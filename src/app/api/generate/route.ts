import type { AgentEvent, GenerateRequest } from "@/lib/types";
import { mockGenerate } from "@/lib/agent/mock";
import { resolveProviderSettings } from "@/lib/agent/provider";
import { realGenerate } from "@/lib/agent/real";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Function duration. Vercel Hobby caps this at 60s; the default Mock Agent
// finishes in ~5s so the free plan works out of the box. Long real-model
// generations (e.g. kimi-k3 ~3.5min) need Pro (raise to 300) or local hosting.
export const maxDuration = 60;

const encoder = new TextEncoder();

function frame(event: AgentEvent): Uint8Array {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

export async function POST(req: Request): Promise<Response> {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return Response.json({ error: "invalid json body" }, { status: 400 });
  }

  const prompt = (body.prompt || "").trim();
  if (!prompt) return Response.json({ error: "prompt is required" }, { status: 400 });
  if (prompt.length > 4000) return Response.json({ error: "prompt too long" }, { status: 413 });

  const settings = resolveProviderSettings(body);
  const run =
    settings.id !== "mock" && settings.apiKey
      ? realGenerate({ ...body, prompt }, settings)
      : mockGenerate({ ...body, prompt });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try {
          controller.enqueue(chunk);
        } catch {
          closed = true;
        }
      };
      try {
        for await (const event of run) {
          safeEnqueue(frame(event));
        }
      } catch (err) {
        safeEnqueue(
          frame({
            type: "error",
            message: err instanceof Error ? err.message : "unknown generation error",
          }),
        );
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
    cancel() {
      /* client disconnected — the async generator is abandoned on next yield */
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
