import type { AgentEvent, AppPlan, FileMap, GenerateRequest } from "@/lib/types";
import type { ProviderSettings } from "./provider";
import { pickTheme } from "./themes";

/**
 * Real-model provider (bring your own key).
 *
 * The model is asked to reply in a strict tag protocol so its output can be
 * streamed into exactly the same UI the mock agent drives:
 *
 *   <plan>{ "name": …, "features": [ … ] }</plan>
 *   <file path="index.html">…</file>
 *   <file path="styles.css">…</file>
 *   <file path="app.js">…</file>
 *
 * Supports OpenAI-compatible `/chat/completions` and Anthropic `/v1/messages`
 * streaming. The key never leaves the server: the browser sends it per
 * request from local settings, the route proxies it to the provider.
 */

const SYSTEM_PROMPT = `You are an expert front-end engineer. Build a complete single-page app.

Reply ONLY with this protocol, no markdown fences and no extra prose outside:

<plan>{"name":"2-4 word product name","tagline":"one sentence","summary":"one paragraph","stack":["HTML/CSS/JS","localStorage"],"features":[{"icon":"zap","title":"…","detail":"…"}]}</plan>
<file path="index.html">complete HTML document (links styles.css, ends with <script src="app.js"></script>)</file>
<file path="styles.css">complete CSS using CSS variables from :root</file>
<file path="app.js">complete classic script (no modules, no imports), persists state in localStorage inside try/catch</file>

Rules:
- Fully offline: no CDN, no external fonts or images; inline SVG only.
- Responsive down to 375px, real interactions (add/edit/delete/filter/drag…), seed data so it never opens empty.
- Polished visual design with a consistent palette, generous spacing, hover/focus states.
- Chinese UI copy. No console errors. No TODOs.`;

function buildUserMessage(req: GenerateRequest): string {
  if (req.mode === "edit" && req.current) {
    const files = Object.entries(req.current.files)
      .map(([path, content]) => `--- ${path} ---\n${content}`)
      .join("\n\n");
    return `Existing app: ${req.current.name}\n\n${files}\n\nApply this change and return the complete updated files:\n${req.prompt}`;
  }
  if (req.mode === "edit") return `Apply this change:\n${req.prompt}`;
  return `Build this app:\n${req.prompt}`;
}

export async function* realGenerate(
  req: GenerateRequest,
  settings: ProviderSettings,
): AsyncGenerator<AgentEvent, void, unknown> {
  if (!settings.apiKey) {
    yield { type: "error", message: "缺少 API Key：请在设置中填入模型 Key，或切回 Mock Agent" };
    return;
  }

  const started = Date.now();
  const theme = pickTheme(req.prompt);
  const parser = new ProtocolParser();
  const mode = settings.id === "anthropic" ? "anthropic" : "openai";

  yield { type: "step", id: "understand", label: "理解需求", status: "start" };
  yield { type: "log", text: `调用 ${settings.id} · ${settings.model ?? "default"}，流式生成中…` };

  try {
    const stream = mode === "anthropic" ? anthropicStream(req, settings) : openaiStream(req, settings);
    for await (const chunk of stream) {
      for (const event of parser.push(chunk)) yield event;
    }
  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : String(err) };
    return;
  }

  const plan = parser.plan ?? fallbackPlan(req.prompt);
  if (!parser.plan) yield { type: "plan", plan, theme };

  if (Object.keys(parser.files).length === 0) {
    yield { type: "error", message: "模型没有按协议返回文件，请重试或换用其他模型" };
    return;
  }

  yield {
    type: "done",
    app: { plan, theme, entry: "index.html", files: parser.files },
    ms: Date.now() - started,
    provider: settings.id,
  };
}

function fallbackPlan(prompt: string): AppPlan {
  return {
    name: "Generated App",
    tagline: prompt.slice(0, 40),
    summary: prompt,
    stack: ["HTML / CSS / JS", "localStorage"],
    features: [{ icon: "sparkles", title: "AI 生成", detail: "由真实模型即时生成" }],
  };
}

/* ------------------------------------------------------------------ */
/*  Protocol parser                                                    */
/* ------------------------------------------------------------------ */

export class ProtocolParser {
  private buffer = "";
  private mode: "text" | "plan" | "file" = "text";
  private currentPath = "";
  private fileBuffer = "";
  plan: AppPlan | null = null;
  files: FileMap = {};

  push(chunk: string): AgentEvent[] {
    this.buffer += chunk;
    const events: AgentEvent[] = [];
    let guard = 0;

    for (;;) {
      if (guard++ > 200) break;

      if (this.mode === "text") {
        const planIdx = this.buffer.indexOf("<plan>");
        const fileMatch = /<file\s+path="([^"]+)">/.exec(this.buffer);
        const candidates = [planIdx, fileMatch?.index ?? -1].filter((i) => i >= 0);
        if (candidates.length === 0) break;
        const idx = Math.min(...candidates);
        const narration = this.buffer.slice(0, idx).trim();
        if (narration) events.push({ type: "log", text: narration });
        if (idx === planIdx) {
          this.buffer = this.buffer.slice(idx + "<plan>".length);
          this.mode = "plan";
        } else if (fileMatch) {
          this.buffer = this.buffer.slice(idx + fileMatch[0].length);
          this.currentPath = fileMatch[1];
          this.fileBuffer = "";
          this.mode = "file";
        }
        continue;
      }

      if (this.mode === "plan") {
        const end = this.buffer.indexOf("</plan>");
        if (end < 0) break;
        const raw = this.buffer.slice(0, end);
        this.buffer = this.buffer.slice(end + "</plan>".length);
        const plan = parsePlan(raw);
        if (plan) {
          this.plan = plan;
          events.push({ type: "plan", plan, theme: pickTheme(raw) });
        }
        this.mode = "text";
        continue;
      }

      // mode === "file"
      const end = this.buffer.indexOf("</file>");
      if (end < 0) {
        this.fileBuffer += this.buffer;
        this.buffer = "";
        break;
      }
      this.fileBuffer += this.buffer.slice(0, end);
      this.buffer = this.buffer.slice(end + "</file>".length);
      this.files[this.currentPath] = this.fileBuffer;
      events.push({
        type: "file",
        path: this.currentPath,
        content: this.fileBuffer,
        action: "write",
      });
      this.fileBuffer = "";
      this.mode = "text";
    }

    return events;
  }
}

function parsePlan(raw: string): AppPlan | null {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<AppPlan>;
    if (!parsed.name) return null;
    return {
      name: String(parsed.name),
      tagline: String(parsed.tagline ?? ""),
      summary: String(parsed.summary ?? ""),
      stack: Array.isArray(parsed.stack) ? parsed.stack.map(String) : ["HTML / CSS / JS"],
      features: Array.isArray(parsed.features) ? parsed.features : [],
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Streaming clients                                                  */
/* ------------------------------------------------------------------ */

function trimBase(base: string | undefined, fallback: string): string {
  return (base || fallback).replace(/\/+$/, "");
}

async function* openaiStream(
  req: GenerateRequest,
  settings: ProviderSettings,
): AsyncGenerator<string> {
  const res = await fetch(
    `${trimBase(settings.baseURL, "https://api.openai.com/v1")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        stream: true,
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(req) },
        ],
      }),
    },
  );
  if (!res.ok || !res.body) {
    throw new Error(`模型接口返回 ${res.status}：${(await res.text()).slice(0, 240)}`);
  }
  yield* sseText(res.body, (json) => {
    const payload = json as { choices?: { delta?: { content?: string } }[] };
    return payload.choices?.[0]?.delta?.content ?? "";
  });
}

async function* anthropicStream(
  req: GenerateRequest,
  settings: ProviderSettings,
): AsyncGenerator<string> {
  const res = await fetch(`${trimBase(settings.baseURL, "https://api.anthropic.com")}/v1/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": settings.apiKey ?? "",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 8000,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(req) }],
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Anthropic 接口返回 ${res.status}：${(await res.text()).slice(0, 240)}`);
  }
  yield* sseText(res.body, (json) => {
    const payload = json as { type?: string; delta?: { type?: string; text?: string } };
    return payload.type === "content_block_delta" ? (payload.delta?.text ?? "") : "";
  });
}

async function* sseText(
  body: ReadableStream<Uint8Array>,
  extract: (json: unknown) => string,
): AsyncGenerator<string> {
  const reader = body.getReader();
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
      if (line.startsWith("data:")) {
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const text = extract(JSON.parse(payload));
          if (text) yield text;
        } catch {
          /* skip malformed frame */
        }
      }
      newline = buffer.indexOf("\n");
    }
  }
}
