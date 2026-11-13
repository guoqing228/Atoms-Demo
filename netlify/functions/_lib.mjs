/**
 * Shared helpers for Netlify serverless functions.
 *
 * Long model calls run in a Background Function (15 min budget) because the
 * synchronous function limit is far below what a reasoning model needs.
 * Progress + result are stored in Netlify Blobs and polled by the browser.
 */
import { getStore } from "@netlify/blobs";

export const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const jobStore = () => getStore({ name: "vibeforge-jobs", consistency: "strong" });
export const authStore = () => getStore({ name: "vibeforge-auth", consistency: "strong" });

/* ------------------------------------------------------------------ */
/*  Theme picker (mirrors src/lib/agent/themes.ts, simplified)         */
/* ------------------------------------------------------------------ */
const PALETTES = [
  {
    name: "极简白", mode: "light", bg: "#f7f7f5", surface: "#ffffff", text: "#181816",
    muted: "#6b6b66", accent: "#2f5d50", accent2: "#a65a34", border: "rgba(24,24,22,0.09)",
    font: "sans", radius: 8,
    keywords: ["极简", "简洁", "清爽", "商务", "saas", "官网", "落地页", "预约", "会议"],
  },
  {
    name: "晨雾纸感", mode: "light", bg: "#faf7f0", surface: "#ffffff", text: "#24211b",
    muted: "#6f685c", accent: "#a65a34", accent2: "#2e5e4c", border: "rgba(36,33,27,0.1)",
    font: "sans", radius: 10,
    keywords: ["温暖", "自然", "治愈", "笔记", "阅读", "日记", "咖啡"],
  },
  {
    name: "海盐蓝", mode: "light", bg: "#f4f7fa", surface: "#ffffff", text: "#1b2430",
    muted: "#64717f", accent: "#2b5f8a", accent2: "#b06f3c", border: "rgba(27,36,48,0.1)",
    font: "sans", radius: 10,
    keywords: ["数据", "看板", "分析", "报表", "图表", "效率", "工具"],
  },
  {
    name: "森林呼吸", mode: "light", bg: "#f3f6f1", surface: "#ffffff", text: "#1f2a22",
    muted: "#67756b", accent: "#2f7a58", accent2: "#a8701c", border: "rgba(31,42,34,0.1)",
    font: "sans", radius: 12,
    keywords: ["绿色", "健康", "运动", "健身", "习惯", "番茄", "专注"],
  },
  {
    name: "深海夜色", mode: "dark", bg: "#101722", surface: "#18212f", text: "#e8edf5",
    muted: "#93a1b8", accent: "#5ad1e6", accent2: "#8b7cf6", border: "rgba(255,255,255,0.09)",
    font: "sans", radius: 12,
    keywords: ["深色", "暗黑", "夜间", "科技", "游戏"],
  },
];

export function pickTheme(prompt) {
  const p = String(prompt || "").toLowerCase();
  let best = PALETTES[0];
  let bestScore = 0;
  for (const palette of PALETTES) {
    let score = 0;
    for (const kw of palette.keywords) if (p.includes(kw.toLowerCase())) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = palette;
    }
  }
  const { keywords, ...theme } = best;
  return theme;
}

/* ------------------------------------------------------------------ */
/*  Agent prompt                                                       */
/* ------------------------------------------------------------------ */
export const SYSTEM_PROMPT = `You are an expert full-stack engineer. Build a complete, runnable single-page app.

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
    "app.js": "complete CLASSIC script (no modules, no imports, no template literals with \${...}); persist state in localStorage inside try/catch"
  }
}

CRITICAL — model the user's ACTUAL domain, not a generic list app:
- If the request is about scheduling / booking / 预约 / 会议室 / 排期: include real domain fields
  (e.g. room/会议室, date/日期, start time/开始时间, end time/结束时间, booker/预约人, purpose/用途)
  and implement TIME-SLOT or calendar UI, plus overlap/conflict validation when saving
  (same room + overlapping date/time range must be rejected with a clear message).
- If it is about booking, expenses, habits, notes, tasks, projects… use the fields and views a real
  product for that domain would use (tables, calendars, kanban, charts, forms) — never fall back to a
  generic "name/category/status/value/note" list when the domain clearly needs more.
- Edit requests (mode=edit): preserve the existing app and apply the requested change faithfully;
  e.g. renaming the title must change the visible product name, and adding validation must add real logic.

Rules:
- Fully offline: no CDN, no external fonts or images, inline SVG icons only.
- Responsive down to 375px; real interactions; 6+ seed items so it never opens empty.
- Refined product design (Linear/Notion-like): light surfaces, one restrained accent, 1px hairline
  borders, 8-12px radius, generous spacing, subtle hover/focus states.
- Chinese UI copy. No console errors, no TODOs, no console.log.
- Keep output compact (aim 8-20 KB total). Valid JSON: escape newlines inside strings as \\n.`;

export function buildUserMessage(req) {
  if (req.mode === "edit" && req.current) {
    const files = Object.entries(req.current.files || {})
      .map(([path, content]) => `--- ${path} ---\n${content}`)
      .join("\n\n");
    return `Existing app: ${req.current.name || "app"}\n\n${files}\n\nApply this change and return the COMPLETE updated JSON object (all files):\n${req.prompt}`;
  }
  return `Build this app:\n${req.prompt}`;
}

/* ------------------------------------------------------------------ */
/*  Model call (OpenAI-compatible, DashScope compatible)               */
/* ------------------------------------------------------------------ */
export async function callModel(messages, onHeartbeat, signalTimeoutMs = 840000) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("服务端未配置 OPENAI_API_KEY，无法调用真实模型");
  const baseURL = (process.env.OPENAI_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || "kimi-k3";

  const isDashScope = /dashscope\.aliyuncs\.com/.test(baseURL);
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 32000,
      messages,
      response_format: { type: "json_object" },
      ...(isDashScope ? { enable_thinking: false } : {}),
    }),
    signal: AbortSignal.timeout(signalTimeoutMs),
  });
  if (!res.ok || !res.body) {
    throw new Error(`模型接口返回 ${res.status}：${(await res.text()).slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let lastBeat = Date.now();
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
        if (payload !== "[DONE]") {
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (typeof delta === "string") content += delta;
          } catch {
            /* skip malformed frame */
          }
        }
      }
      newline = buffer.indexOf("\n");
    }
    if (Date.now() - lastBeat > 8000) {
      lastBeat = Date.now();
      onHeartbeat?.(content.length);
    }
  }
  return content;
}

/* ------------------------------------------------------------------ */
/*  JSON parsing                                                       */
/* ------------------------------------------------------------------ */
export function extractJsonObject(raw) {
  const text = String(raw || "").replace(/^```(?:json)?/i, "").replace(/```\s*$/g, "");
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

export function normalizeApp(parsed, prompt) {
  const planRaw = parsed?.plan && typeof parsed.plan === "object" ? parsed.plan : {};
  const filesRaw = parsed?.files && typeof parsed.files === "object" ? parsed.files : {};
  const files = {};
  for (const [path, content] of Object.entries(filesRaw)) {
    if (typeof content === "string" && content.trim()) files[path] = content;
  }
  if (!files["index.html"]) return null;
  if (!files["styles.css"]) files["styles.css"] = "";
  if (!files["app.js"]) files["app.js"] = "";

  const features = Array.isArray(planRaw.features)
    ? planRaw.features
        .filter((f) => f && typeof f === "object")
        .slice(0, 6)
        .map((f) => ({
          icon: typeof f.icon === "string" ? f.icon : "sparkles",
          title: typeof f.title === "string" ? f.title : "功能",
          detail: typeof f.detail === "string" ? f.detail : "",
        }))
    : [];

  const plan = {
    name: typeof planRaw.name === "string" && planRaw.name.trim() ? planRaw.name.trim() : "Generated App",
    tagline: typeof planRaw.tagline === "string" ? planRaw.tagline : "",
    summary: typeof planRaw.summary === "string" ? planRaw.summary : String(prompt || ""),
    stack: Array.isArray(planRaw.stack) && planRaw.stack.length ? planRaw.stack.map(String) : ["HTML / CSS / JS", "localStorage"],
    features: features.length ? features : [{ icon: "sparkles", title: "AI 生成", detail: "由真实模型生成" }],
  };
  return { plan, files };
}

/* ------------------------------------------------------------------ */
/*  Auth helpers                                                       */
/* ------------------------------------------------------------------ */
export function newToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 120000, hash: "SHA-256" },
    baseKey,
    256,
  );
  return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const normEmail = (email) => String(email || "").trim().toLowerCase();
export const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
