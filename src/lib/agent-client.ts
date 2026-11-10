import type { AgentEvent, GenerateRequest } from "@/lib/types";

/**
 * Streams the agent run from POST /api/generate (newline-delimited JSON).
 * Each frame is forwarded to the caller as soon as it arrives so the UI can
 * render steps/files while the agent is still working.
 */
export async function streamGeneration(
  req: GenerateRequest,
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
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
