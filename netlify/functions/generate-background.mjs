/**
 * Background function: runs one real-model generation (up to 15 min) and streams
 * progress into Netlify Blobs so the static client can poll it.
 *
 * URL: /.netlify/functions/generate-background   (returns 202 immediately)
 */
import {
  jobStore,
  json,
  SYSTEM_PROMPT,
  buildUserMessage,
  callModel,
  extractJsonObject,
  normalizeApp,
  pickTheme,
} from "./_lib.mjs";

const short = (text, max = 44) => {
  const t = String(text || "").trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max)}…` : t;
};

const inspect = (files) => {
  const problems = [];
  const html = files["index.html"] || "";
  const js = files["app.js"] || "";
  if (!html.includes("<body")) problems.push("HTML 缺少 body");
  if (!html.includes("styles.css")) problems.push("HTML 未引用 styles.css");
  if (!html.includes("app.js")) problems.push("HTML 未引用 app.js");
  if (/\bimport\s+[^("]/.test(js) || /\bexport\s+(default|const|function)/.test(js)) {
    problems.push("app.js 含模块语法");
  }
  try {
    new Function(js);
  } catch {
    problems.push("app.js 语法错误");
  }
  return problems;
};

export default async (req) => {
  const started = Date.now();
  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid json body" });
  }
  const jobId = body?.jobId;
  if (!jobId || !body?.prompt?.trim()) return json(400, { error: "jobId and prompt are required" });

  const store = jobStore();
  const events = [];
  let status = "running";
  const push = (event) => events.push({ ...event, seq: events.length });
  const flush = async () => {
    await store.setJSON(`job:${jobId}`, { status, events, updatedAt: Date.now() });
  };

  await flush();

  try {
    push({ type: "step", id: "understand", label: "理解需求", status: "start" });
    push({ type: "log", text: `收到需求：「${short(body.prompt)}」` });
    await flush();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessage(body) },
    ];

    // Model selection: the client may ask for one of the allowed models;
    // anything else falls back to the server default (OPENAI_MODEL).
    const allowed = (process.env.OPENAI_ALLOWED_MODELS || process.env.OPENAI_MODEL || "qwen3.8-max-0902")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    const requested = typeof body.provider?.model === "string" ? body.provider.model : "";
    const model = allowed.includes(requested) ? requested : process.env.OPENAI_MODEL || allowed[0];
    push({ type: "log", text: `使用模型：${model}` });
    await flush();

    const raw = await callModel(
      messages,
      async (chars) => {
        push({ type: "log", text: `真实模型生成中… 已输出 ${chars.toLocaleString()} 字符` });
        await flush();
      },
      { model },
    );

    push({ type: "step", id: "understand", label: "理解需求", status: "done" });
    push({ type: "log", text: `模型返回 ${raw.length.toLocaleString()} 字符，开始解析结构化输出` });

    const jsonText = extractJsonObject(raw);
    if (!jsonText) throw new Error("模型输出不是合法 JSON（未找到 JSON 对象）");
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error("模型输出的 JSON 解析失败");
    }
    const app = normalizeApp(parsed, body.prompt);
    if (!app) throw new Error("模型返回的文件里缺少 index.html");

    const theme = pickTheme(body.prompt);
    push({ type: "step", id: "design", label: "设计系统", status: "start" });
    push({ type: "plan", plan: app.plan, theme });
    await flush();

    push({ type: "step", id: "design", label: "设计系统", status: "done", detail: theme.name });
    push({ type: "step", id: "code", label: "编写实现", status: "start" });
    const paths = [
      ...["index.html", "styles.css", "app.js"].filter((p) => p in app.files),
      ...Object.keys(app.files).filter((p) => !["index.html", "styles.css", "app.js"].includes(p)),
    ];
    for (const path of paths) {
      push({ type: "file", path, content: app.files[path], action: body.mode === "edit" ? "update" : "write" });
      push({
        type: "log",
        text: `${path}  ·  ${app.files[path].split("\n").length} 行  ·  ${(app.files[path].length / 1024).toFixed(1)} KB`,
      });
      await flush();
    }
    push({ type: "step", id: "code", label: "编写实现", status: "done", detail: `${paths.length} 个文件` });

    push({ type: "step", id: "verify", label: "自检", status: "start" });
    const problems = inspect(app.files);
    push({
      type: "log",
      text: problems.length ? `自检提示：${problems.join("；")}` : "自检通过：结构完整 · 脚本为经典脚本 · 样式与脚本均已挂载",
    });
    push({ type: "step", id: "verify", label: "自检", status: "done", detail: problems.length ? "有提示" : "通过" });

    push({
      type: "done",
      app: { plan: app.plan, theme, entry: "index.html", files: app.files },
      ms: Date.now() - started,
      provider: "openai",
    });
    status = "done";
  } catch (err) {
    push({ type: "error", message: err instanceof Error ? err.message : String(err) });
    status = "error";
  }
  await flush();
};
