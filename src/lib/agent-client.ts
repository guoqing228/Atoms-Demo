import type { AgentEvent, GenerateRequest } from "@/lib/types";

/**
 * Local mode flag: set at build time for the static export (`STATIC_EXPORT=1`).
 * In that mode there is no /api/generate route, so generation goes through the
 * Netlify functions backend (real model, background job + polling) or, if that
 * is unavailable, the Mock Agent in the browser.
 */
const REMOTE_AGENT = process.env.NEXT_PUBLIC_REMOTE_AGENT === "1";
const LOCAL_AGENT = process.env.NEXT_PUBLIC_LOCAL_AGENT === "1";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Netlify background function + blob-backed polling (real model, 15 min budget). */
async function remoteGeneration(
  req: GenerateRequest,
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const jobId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const started = await fetch("/.netlify/functions/generate-background", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...req, jobId }),
  });
  if (!started.ok && started.status !== 202) {
    const text = await started.text().catch(() => "");
    throw new Error(`生成任务启动失败（${started.status}）${text ? `：${text.slice(0, 160)}` : ""}`);
  }

  let cursor = 0;
  let finished = false;
  const deadline = Date.now() + 16 * 60 * 1000;
  let fallbackToLocal = false;

  while (!finished) {
    if (signal?.aborted) throw new DOMException("已取消生成", "AbortError");
    if (Date.now() > deadline) throw new Error("生成超时（16 分钟），请稍后重试");

    const res = await fetch(
      `/.netlify/functions/poll?job=${encodeURIComponent(jobId)}&cursor=${cursor}`,
      { cache: "no-store" },
    );
    if (res.status === 404) {
      // job document not written yet
      await sleep(500);
      continue;
    }
    if (!res.ok) throw new Error(`轮询生成进度失败（${res.status}）`);
    const data = (await res.json()) as {
      status?: string;
      events?: AgentEvent[];
      total?: number;
    };
    const events = data.events ?? [];
    for (const event of events) {
      // 服务端模型不可用（Key 失效/未配置）时，不把错误抛给用户，静默降级到内置生成器
      if (
        event.type === "error" &&
        /Incorrect API key|invalid_api_key|服务端未配置|401|Unauthorized/i.test(event.message)
      ) {
        fallbackToLocal = true;
        break;
      }
      onEvent(event);
      if (event.type === "done" || event.type === "error") finished = true;
    }
    cursor = typeof data.total === "number" ? data.total : cursor + events.length;
    if (fallbackToLocal) break;
    if (!finished) await sleep(700);
  }

  if (fallbackToLocal) {
    onEvent({ type: "log", text: "服务端真实模型暂不可用，已切换为内置生成器继续完成。" });
    await localGeneration(req, onEvent, signal);
  }
}

/** Browser-side Mock Agent (pure static hosting without the functions backend). */
async function localGeneration(
  req: GenerateRequest,
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const { localGenerate } = await import("@/lib/agent/local");
  for await (const event of localGenerate(req, signal)) {
    onEvent(event);
  }
  if (signal?.aborted) throw new DOMException("已取消生成", "AbortError");
}

/**
 * Streams one agent run to the caller.
 *
 *  - server deployment (`/api/generate`): NDJSON streaming, keys stay server-side
 *  - static + functions (this repo's Netlify deploy): background job + polling, real model
 *  - static only: Mock Agent runs in the browser
 */
export async function streamGeneration(
  req: GenerateRequest,
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (REMOTE_AGENT) return remoteGeneration(req, onEvent, signal);
  if (LOCAL_AGENT) return localGeneration(req, onEvent, signal);

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`生成请求失败（${res.status}）${text ? `：${text.slice(0, 200)}` : ""}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) {
        try {
          onEvent(JSON.parse(line) as AgentEvent);
        } catch {
          // ignore malformed frame — the next one will still be processed
        }
      }
      newline = buffer.indexOf("\n");
    }
  }
  const rest = buffer.trim();
  if (rest) {
    try {
      onEvent(JSON.parse(rest) as AgentEvent);
    } catch {
      /* ignore trailing partial frame */
    }
  }
}
