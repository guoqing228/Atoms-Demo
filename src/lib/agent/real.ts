import type { AgentEvent, AppPlan, FileMap, GenerateRequest, PlanFeature } from "@/lib/types";
import type { ProviderSettings } from "./provider";
import { pickTheme } from "./themes";

/**
 * Real-model provider (bring your own key).
 *
 * Structured output: the model must reply with ONE JSON object and nothing
 * else, which is far more robust than tag-scanning for reasoning models that
 * like to emit prose:
 *
 * {
 *   "plan": { "name", "tagline", "summary", "stack": [], "features": [{...}] },
 *   "files": { "index.html": "...", "styles.css": "...", "app.js": "..." }
 * }
 *
 * Works with OpenAI-compatible endpoints (request `json_object` mode, retry
 * without it if the server rejects the field) and Anthropic `/v1/messages`.
 * Long generations from reasoning models get heartbeat log frames so the UI
 * never looks frozen, and the whole run can be cancelled from the browser.
 */

const FILE_ORDER = ["index.html", "styles.css", "app.js"];

const SYSTEM_PROMPT = `You are an expert front-end engineer. Build a complete, runnable single-page app.

Reply with EXACTLY ONE JSON object, no markdown fences, no prose before or after:

{
  "plan": {
    "name": "2-4 word product name",
    "tagline": "one sentence",
    "summary": "one paragraph",
    "stack": ["HTML/CSS/JS", "localStorage"],
    "features": [{ "icon": "zap", "title": "短标题", "detail": "一句说明" }]
  },
  "files": {
    "index.html": "complete HTML document; links styles.css and loads app.js at the end of body",
    "styles.css": "complete CSS; define :root CSS variables (--bg --surface --text --muted --accent --accent2 --border --radius --font)",
    "app.js": "complete CLASSIC script (no modules, no imports, no template literals \${...}); persist state in localStorage inside try/catch"
  }
}

Rules:
- Fully offline: no CDN, no external fonts or images, inline SVG icons only.
- Responsive down to 375px; real interactions (add/edit/delete/filter/drag/sort…); 6+ seed items so it never opens empty.
- Refined product design (Linear/Notion-like): light surfaces, one restrained accent, 1px hairline borders, 8-12px radius, generous spacing, subtle hover/focus states.
- Chinese UI copy. No console errors, no TODOs, no console.log.
- JSON must be valid: escape newlines inside strings as \\n, never break the outer object.`;

function buildUserMessage(req: GenerateRequest): string {
  if (req.mode === "edit" && req.current) {
    const files = Object.entries(req.current.files)
      .map(([path, content]) => `--- ${path} ---\n${content}`)
      .join("\n\n");
    return `Existing app: ${req.current.name}\n\n${files}\n\nApply this change and return the COMPLETE updated JSON object (all files):\n${req.prompt}`;
  }
  if (req.mode === "edit") return `Apply this change and return the complete JSON object:\n${req.prompt}`;
  return `Build this app:\n${req.prompt}`;
}

/* ------------------------------------------------------------------ */
/*  Entry                                                              */
/* ------------------------------------------------------------------ */

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
  const model = settings.model ?? "default";

  yield { type: "step", id: "understand", label: "理解需求", status: "start" };
  yield { type: "log", text: `调用 ${settings.id} · ${model}，等待模型输出结构化 JSON…` };
  yield { type: "step", id: "understand", label: "理解需求", status: "done" };

  yield { type: "step", id: "code", label: "生成代码", status: "start" };
  const chunks: string[] = [];
  let reasoningChars = 0;
  let lastBeat = Date.now();
  let phase: "reasoning" | "content" = "reasoning";

  try {
    const stream =
      settings.id === "anthropic" ? anthropicStream(req, settings) : openaiStream(req, settings);
    for await (const delta of stream) {
      if (delta.kind === "reasoning") {
        reasoningChars += delta.text.length;
      } else {
        chunks.push(delta.text);
        if (phase === "reasoning") {
          phase = "content";
          yield { type: "log", text: "推理完成，开始输出 JSON 代码…" };
        }
      }
      if (Date.now() - lastBeat > 8000) {
        lastBeat = Date.now();
        const seconds = Math.round((Date.now() - started) / 1000);
        yield {
          type: "log",
          text:
            phase === "reasoning"
              ? `模型推理中… 已思考 ${reasoningChars.toLocaleString()} 字符（${seconds}s）`
              : `已接收 ${chunks.join("").length.toLocaleString()} 字符（${seconds}s）`,
        };
      }
    }
  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : String(err) };
    return;
  }

  const raw = chunks.join("");
  const parsed = parseAppJson(raw);
  if (!parsed) {
    yield {
      type: "error",
      message: `模型输出不是合法 JSON（${raw.length} 字符）：${raw.slice(0, 180).replace(/\s+/g, " ")}…`,
    };
    return;
  }

  const plan = normalizePlan(parsed.plan, req.prompt);
  const files = normalizeFiles(parsed.files);
  if (!files["index.html"]) {
    yield { type: "error", message: "模型返回的文件里缺少 index.html" };
    return;
  }

  await sleep(150);
  yield { type: "plan", plan, theme };

  const paths = [...FILE_ORDER.filter((p) => p in files), ...Object.keys(files).filter((p) => !FILE_ORDER.includes(p))];
  for (const path of paths) {
    yield { type: "file", path, content: files[path], action: req.mode === "edit" ? "update" : "write" };
    yield { type: "log", text: `${path}  ·  ${files[path].split("\n").length} 行  ·  ${(files[path].length / 1024).toFixed(1)} KB` };
    await sleep(80);
  }

  yield { type: "step", id: "code", label: "生成代码", status: "done", detail: `${paths.length} 个文件` };
  yield { type: "step", id: "verify", label: "自检", status: "start" };
  await sleep(200);
  const problems = inspectApp(files);
  yield {
    type: "log",
    text: problems.length
      ? `自检提示：${problems.join("；")}`
      : "自检通过：HTML 结构完整 · 脚本为经典脚本 · 样式与脚本均已挂载",
  };
  yield { type: "step", id: "verify", label: "自检", status: "done", detail: problems.length ? "有提示" : "通过" };

  yield {
    type: "done",
    app: { plan, theme, entry: "index.html", files },
    ms: Date.now() - started,
    provider: settings.id,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  JSON parsing / normalisation                                       */
/* ------------------------------------------------------------------ */

interface ParsedApp {
  plan?: unknown;
  files?: unknown;
}

/** Extract the first balanced JSON object from model output (string-aware). */
export function extractJsonObject(raw: string): string | null {
  const text = raw.replace(/^```(?:json)?/i, "").replace(/```\s*$/g, "");
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export function parseAppJson(raw: string): ParsedApp | null {
  const json = extractJsonObject(raw);
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as ParsedApp;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function normalizePlan(raw: unknown, prompt: string): AppPlan {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const name = typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : "Generated App";
  const features: PlanFeature[] = Array.isArray(obj.features)
    ? obj.features
        .filter((f): f is Record<string, unknown> => Boolean(f) && typeof f === "object")
        .slice(0, 6)
        .map((f) => ({
          icon: typeof f.icon === "string" ? f.icon : "sparkles",
          title: typeof f.title === "string" ? f.title : "功能",
          detail: typeof f.detail === "string" ? f.detail : "",
        }))
    : [];
  if (features.length === 0) {
    features.push({ icon: "sparkles", title: "AI 生成", detail: prompt.slice(0, 40) });
  }
  return {
    name,
    tagline: typeof obj.tagline === "string" ? obj.tagline : "",
    summary: typeof obj.summary === "string" ? obj.summary : prompt,
    stack: asStringList(obj.stack).length ? asStringList(obj.stack) : ["HTML / CSS / JS", "localStorage"],
    features,
  };
}

export function normalizeFiles(raw: unknown): FileMap {
  if (!raw || typeof raw !== "object") return {};
  const files: FileMap = {};
  for (const [path, content] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof content === "string" && content.trim()) files[path] = content;
  }
  if (!files["styles.css"] && files["index.html"]) files["styles.css"] = "";
  if (!files["app.js"] && files["index.html"]) files["app.js"] = "";
  return files;
}

/** Cheap static checks shared with the mock agent's self-check. */
export function inspectApp(files: FileMap): string[] {
  const problems: string[] = [];
  const html = files["index.html"] ?? "";
  const js = files["app.js"] ?? "";
  if (!html.includes("<body")) problems.push("HTML 缺少 body");
  if (!html.includes("styles.css")) problems.push("HTML 未引用 styles.css");
  if (!html.includes("app.js")) problems.push("HTML 未引用 app.js");
  if (/\bimport\s+[^("]/.test(js) || /\bexport\s+(default|const|function)/.test(js)) {
    problems.push("app.js 含模块语法（应为经典脚本）");
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(js);
  } catch {
    problems.push("app.js 语法错误");
  }
  return problems;
}

/* ------------------------------------------------------------------ */
/*  Streaming clients                                                  */
/* ------------------------------------------------------------------ */

type Delta = { kind: "content" | "reasoning"; text: string };

function trimBase(base: string | undefined, fallback: string): string {
  return (base || fallback).replace(/\/+$/, "");
}

async function* openaiStream(
  req: GenerateRequest,
  settings: ProviderSettings,
): AsyncGenerator<Delta> {
  const base = trimBase(settings.baseURL, "https://api.openai.com/v1");
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserMessage(req) },
  ];

  // Reasoning-model endpoints are picky: some reject `temperature`, others
  // don't know `response_format`, others cap `max_tokens`. Try the richest
  // request first and degrade parameter by parameter.
  const attempts: { jsonMode: boolean; maxTokens: number }[] = [
    { jsonMode: true, maxTokens: 32000 },
    { jsonMode: false, maxTokens: 32000 },
    { jsonMode: false, maxTokens: 16000 },
    { jsonMode: false, maxTokens: 8000 },
  ];

  let res: Response | null = null;
  let lastError = "";
  for (const attempt of attempts) {
    const request = fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        stream: true,
        max_tokens: attempt.maxTokens,
        messages,
        ...(attempt.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(300_000),
    });
    res = await request;
    if (res.ok) break;
    const text = await res.text();
    lastError = `模型接口返回 ${res.status}：${text.slice(0, 240)}`;
    const retryable =
      (res.status === 400 || res.status === 422) &&
      /response_format|json_object|max_tokens|temperature|unsupported|invalid_parameter|not supported/i.test(text);
    if (!retryable) break;
  }

  if (!res || !res.ok || !res.body) {
    throw new Error(lastError || "模型接口请求失败（未获得响应）");
  }

  yield* sseText(res.body, (json) => {
    const payload = json as {
      choices?: { delta?: { content?: string; reasoning_content?: string } }[];
    };
    const delta = payload.choices?.[0]?.delta;
    if (!delta) return null;
    if (typeof delta.reasoning_content === "string" && delta.reasoning_content) {
      return { kind: "reasoning", text: delta.reasoning_content };
    }
    if (typeof delta.content === "string" && delta.content) {
      return { kind: "content", text: delta.content };
    }
    return null;
  });
}

async function* anthropicStream(
  req: GenerateRequest,
  settings: ProviderSettings,
): AsyncGenerator<Delta> {
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
    signal: AbortSignal.timeout(300_000),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Anthropic 接口返回 ${res.status}：${(await res.text()).slice(0, 240)}`);
  }
  yield* sseText(res.body, (json) => {
    const payload = json as { type?: string; delta?: { type?: string; text?: string } };
    const text = payload.type === "content_block_delta" ? payload.delta?.text : undefined;
    return text ? { kind: "content" as const, text } : null;
  });
}

async function* sseText(
  body: ReadableStream<Uint8Array>,
  extract: (json: unknown) => Delta | null,
): AsyncGenerator<Delta> {
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
          const delta = extract(JSON.parse(payload));
          if (delta?.text) yield delta;
        } catch {
          /* skip malformed frame */
        }
      }
      newline = buffer.indexOf("\n");
    }
  }
}
