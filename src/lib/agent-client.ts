import type { AgentEvent, GenerateRequest } from "@/lib/types";

/**
 * Local mode flag: set at build time for the static export (`STATIC_EXPORT=1`).
 * In that mode there is no /api/generate route, so the Mock Agent runs in the
 * browser instead (same event stream, same UI).
 */
const LOCAL_AGENT = process.env.NEXT_PUBLIC_LOCAL_AGENT === "1";

/**
 * Streams one agent run to the caller.
 *
 *  - server deployment: POST /api/generate (NDJSON frames, model keys stay on the server)
 *  - static export:     run the Mock Agent in the browser (no server available)
 *
 * Each frame is forwarded as soon as it is produced so the UI renders steps and
 * files while the agent is still working.
 */
export async function streamGeneration(
  req: GenerateRequest,
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (LOCAL_AGENT) {
    const { localGenerate } = await import("@/lib/agent/local");
    for await (const event of localGenerate(req, signal)) {
      onEvent(event);
    }
    const aborted = signal?.aborted;
    if (aborted) throw new DOMException("已取消生成", "AbortError");
    return;
  }

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
