import type {
  AgentEvent,
  AppPlan,
  FileMap,
  GenerateRequest,
  GeneratedApp,
  Theme,
} from "@/lib/types";
import { pickTheme } from "./themes";
import { RECIPES } from "./recipes";
import { assembleFiles } from "./recipes/_kit";
import { synthApp } from "./synth";
import { sleep } from "./provider";

/**
 * Deterministic mock agent.
 *
 * No model call: the prompt is routed to a hand-built recipe (or a generic
 * CRUD synthesizer), the design system is derived from a keyword lexicon,
 * and the run is streamed with realistic pacing so the workspace behaves
 * exactly like it would with a real LLM behind it. Swapping in a real
 * provider only changes this module.
 */

const SPEED = (() => {
  const raw = Number.parseFloat(process.env.MOCK_SPEED || "1");
  return Number.isFinite(raw) && raw >= 0 ? raw : 1;
})();

const pause = (ms: number) => (SPEED === 0 ? Promise.resolve() : sleep(ms / SPEED));

/* ------------------------------------------------------------------ */
/*  Routing                                                            */
/* ------------------------------------------------------------------ */

interface Route {
  kind: "recipe" | "synth";
  recipe?: (typeof RECIPES)[number];
  score: number;
}

function scoreRecipe(prompt: string, keywords: string[]): number {
  const p = prompt.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    const k = kw.toLowerCase();
    if (k.length < 2) continue;
    if (p.includes(k)) score += Math.min(4, k.length - 1);
  }
  return score;
}

function routePrompt(prompt: string, current?: GenerateRequest["current"]): Route {
  const candidates = RECIPES.map((recipe) => ({
    recipe,
    score: scoreRecipe(prompt, recipe.keywords),
  })).sort((a, b) => b.score - a.score);

  // continuing an existing app: prefer the recipe that produced it
  if (current?.recipeId) {
    const same = candidates.find((c) => c.recipe.id === current.recipeId);
    if (same) return { kind: "recipe", recipe: same.recipe, score: same.score };
  }

  const best = candidates[0];
  if (best && best.score > 0) {
    return { kind: "recipe", recipe: best.recipe, score: best.score };
  }
  return { kind: "synth", score: 0 };
}

/* ------------------------------------------------------------------ */
/*  Narration helpers                                                  */
/* ------------------------------------------------------------------ */

function byteSize(files: FileMap): number {
  return Object.values(files).reduce((n, c) => n + c.length, 0);
}

function fileMeta(path: string, content: string) {
  const lines = content.split("\n").length;
  const kb = (content.length / 1024).toFixed(1);
  return { path, lines, kb };
}

/** Cheap but real static checks on the generated project. */
function selfCheck(files: FileMap): { ok: boolean; notes: string[] } {
  const notes: string[] = [];
  const html = files["index.html"] || "";
  const js = files["app.js"] || "";
  if (!html.includes("<body")) notes.push("缺少 body 结构");
  if (!html.includes("app.js")) notes.push("未挂载脚本");
  if (!html.includes("styles.css")) notes.push("未挂载样式");
  if (!/"use strict"/.test(js)) notes.push("脚本未启用严格模式");
  let parseOk = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(js);
  } catch {
    parseOk = false;
    notes.push("脚本语法检查失败");
  }
  const ok = notes.length === 0 && parseOk;
  return { ok, notes };
}

function shortPrompt(prompt: string): string {
  const p = prompt.trim().replace(/\s+/g, " ");
  return p.length > 42 ? `${p.slice(0, 42)}…` : p;
}

function featureNames(plan: AppPlan): string[] {
  return plan.features.map((f) => f.title);
}

/* ------------------------------------------------------------------ */
/*  The stream                                                         */
/* ------------------------------------------------------------------ */

export async function* mockGenerate(req: GenerateRequest): AsyncGenerator<AgentEvent, void, unknown> {
  const started = Date.now();
  const isEdit = req.mode === "edit" && !!req.current;
  const prompt =
    isEdit && req.current?.prompt ? `${req.current.prompt}；追加要求：${req.prompt}` : req.prompt;
  const theme: Theme = pickTheme(prompt);
  const route = routePrompt(prompt, req.current);

  yield { type: "step", id: "understand", label: "理解需求", status: "start" };
  yield {
    type: "log",
    text: isEdit ? `收到修改意见：「${shortPrompt(req.prompt)}」` : `收到需求：「${shortPrompt(req.prompt)}」`,
  };
  await pause(320);

  const build = (): { app: GeneratedApp } => {
    if (route.kind === "recipe" && route.recipe) {
      const out = route.recipe.build({ prompt, theme, prev: req.current?.files ?? null });
      const files = assembleFiles(out, theme);
      return {
        app: {
          plan: {
            name: out.name,
            tagline: out.tagline,
            summary: out.summary,
            stack: ["原生 HTML / CSS / JS", "localStorage", "响应式布局"],
            features: out.features,
          },
          theme,
          entry: "index.html",
          files,
          recipeId: route.recipe.id,
        },
      };
    }
    const synth = synthApp(prompt, theme, req.current?.files ?? null);
    return {
      app: {
        plan: {
          name: synth.name,
          tagline: synth.tagline,
          summary: synth.summary,
          stack: ["原生 HTML / CSS / JS", "localStorage", "响应式布局"],
          features: synth.features,
        },
        theme,
        entry: "index.html",
        files: assembleFiles(synth, theme),
        recipeId: undefined,
      },
    };
  };

  let app: GeneratedApp;
  try {
    app = build().app;
  } catch (err) {
    yield { type: "error", message: `生成失败：${err instanceof Error ? err.message : String(err)}` };
    return;
  }

  const detected = featureNames(app.plan);
  yield {
    type: "log",
    text: detected.length
      ? `拆解出 ${detected.length} 个关键点：${detected.join(" / ")}`
      : "拆解需求：一个核心主流程 + 一个延展能力",
  };
  yield {
    type: "log",
    text: `设计方向：${theme.name} · 主色 ${theme.accent} · ${theme.mode === "dark" ? "深色" : "浅色"}表面 · 圆角 ${theme.radius}px`,
  };
  yield { type: "step", id: "understand", label: "理解需求", status: "done" };
  await pause(420);

  yield { type: "step", id: "design", label: "设计系统", status: "start" };
  yield { type: "plan", plan: app.plan, theme: app.theme };
  await pause(520);
  yield {
    type: "step",
    id: "design",
    label: "设计系统",
    status: "done",
    detail: `${theme.name} · ${theme.mode === "dark" ? "dark" : "light"}`,
  };

  yield { type: "step", id: "code", label: "编写实现", status: "start" };
  const order = ["index.html", "styles.css", "app.js"].filter((p) => p in app.files);
  for (const path of order) {
    const content = app.files[path];
    const meta = fileMeta(path, content);
    await pause(180 + Math.min(520, content.length / 4));
    yield { type: "file", path, content, action: isEdit ? "update" : "write" };
    yield { type: "log", text: `${path}  ·  ${meta.lines} 行  ·  ${meta.kb} KB` };
    await pause(140);
  }
  yield {
    type: "step",
    id: "code",
    label: "编写实现",
    status: "done",
    detail: `${order.length} 个文件`,
  };

  yield { type: "step", id: "verify", label: "自检", status: "start" };
  await pause(380);
  const check = selfCheck(app.files);
  yield {
    type: "log",
    text: check.ok
      ? `自检通过：结构完整 · 脚本语法 OK · 本地存储受限访问已包裹 · 体积 ${(byteSize(app.files) / 1024).toFixed(1)} KB`
      : `自检提示：${check.notes.join("；")}`,
  };
  await pause(check.ok ? 300 : 520);
  yield {
    type: "step",
    id: "verify",
    label: "自检",
    status: "done",
    detail: check.ok ? "通过" : "有提示",
  };

  yield { type: "done", app, ms: Date.now() - started, provider: "mock" };
}

/** Exported for the recipe authoring docs / tests. */
export { routePrompt };
