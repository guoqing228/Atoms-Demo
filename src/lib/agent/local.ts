import type { AgentEvent, GenerateRequest } from "@/lib/types";
import { mockGenerate } from "./mock";
import { realGenerate } from "./real";

/**
 * Browser-side agent runtime, used by the static export (`NEXT_PUBLIC_LOCAL_AGENT=1`).
 *
 * In the normal (server) deployment the browser calls `/api/generate` so model
 * keys stay on the server. Static hosting has no server, so:
 *   - Mock Agent runs entirely in the browser (deterministic, no key needed);
 *   - Real models are only possible as BYOK directly from the browser, which
 *     depends on the provider's CORS policy (works for some, not OpenAI).
 */
export async function* localGenerate(
  req: GenerateRequest,
  signal?: AbortSignal,
): AsyncGenerator<AgentEvent, void, unknown> {
  const throwIfAborted = () => {
    if (signal?.aborted) throw new DOMException("已取消生成", "AbortError");
  };

  const provider = req.provider;
  if (provider && provider.id !== "mock") {
    if (!provider.apiKey) {
      yield { type: "error", message: "静态部署下使用真实模型需要填写自己的 API Key（设置面板），或切回 Mock Agent" };
      return;
    }
    throwIfAborted();
    yield* realGenerate(req, {
      id: provider.id,
      apiKey: provider.apiKey,
      baseURL: provider.baseURL,
      model: provider.model,
    }) as AsyncGenerator<AgentEvent, void, unknown>;
    return;
  }

  const inner = mockGenerate(req);
  for (;;) {
    throwIfAborted();
    const next = await inner.next();
    if (next.done) break;
    yield next.value;
  }
}
