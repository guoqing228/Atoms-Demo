/**
 * Recipe acceptance check.
 *
 * Usage:
 *   node scripts/check-recipe.mjs "做一个看板应用，三列拖拽"
 *   node scripts/check-recipe.mjs --all
 *
 * For each prompt it: calls /api/generate (mock agent), then validates
 *  1. the 3 generated files exist and app.js compiles (syntax gate)
 *  2. index.html has a body, links the stylesheet and the script
 *  3. the app renders in Chromium: non-empty text, visible background,
 *     no uncaught errors / console errors
 *  4. a screenshot is written to shots/recipes/<slug>.png
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const OUT = "shots/recipes";
mkdirSync(OUT, { recursive: true });

const ALL = [
  ["todo", "做一个待办清单应用：可以快速添加任务、设置优先级、拖拽排序、按状态筛选"],
  ["kanban", "做一个看板应用：待办 / 进行中 / 已完成三列，卡片可以拖拽跨列，支持编辑和新建"],
  ["notes", "做一个 Markdown 笔记应用：左边写 Markdown，右边实时预览，支持标签分类和全文搜索"],
  ["pomodoro", "做一个番茄钟应用：25 分钟专注计时，支持关联任务、专注记录统计"],
  ["expense", "做一个记账应用：记录收支、按分类统计、显示月度汇总和趋势图表"],
  ["habit", "做一个习惯打卡应用：每天打卡，显示连续天数和日历热力图"],
  ["quiz", "做一个答题测验应用：选择题题库、计分、结果页"],
  ["game2048", "做一个 2048 小游戏：键盘方向键和触屏滑动都能操作，显示得分和最高分"],
  ["dashboard", "做一个数据看板：顶部 KPI 指标卡，折线图和柱状图展示趋势，下面是可排序的数据表格"],
  ["landing", "做一个 SaaS 产品落地页：大标题 Hero、三个特性区块、定价方案和页脚"],
  ["chat", "做一个 AI 聊天界面：消息列表、流式打字效果、会话切换"],
  ["calculator", "做一个计算器应用：支持四则运算和键盘输入"],
  ["music", "做一个音乐播放器界面：播放列表、进度条、播放控制"],
  ["synth", "做一个书单管理应用：记录书名、作者、评分和阅读状态"],
];

/** Inline local styles.css / app.js into a standalone preview document. */
function buildPreview(files) {
  const inline = (path) => {
    const key = path.replace(/^\.?\//, "");
    return files[key];
  };
  return (files["index.html"] || "")
    .replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (m, href) => {
      if (/^(https?:)?\/\//i.test(href)) return m;
      if (!/rel=["']?stylesheet/i.test(m)) return m;
      const css = inline(href);
      return css ? `<style>${css}</style>` : m;
    })
    .replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (m, src) => {
      if (/^(https?:)?\/\//i.test(src)) return m;
      const js = inline(src);
      return js ? `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>` : m;
    });
}

async function generate(prompt) {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, mode: "create" }),
  });
  if (!res.ok) throw new Error(`generate HTTP ${res.status}: ${await res.text()}`);
  const text = await res.text();
  const events = text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const done = events.find((e) => e.type === "done");
  const error = events.find((e) => e.type === "error");
  if (error) throw new Error(error.message);
  if (!done) throw new Error("no done event in stream");
  return done.app;
}

function staticChecks(app) {
  const problems = [];
  const files = app.files;
  for (const path of ["index.html", "styles.css", "app.js"]) {
    if (typeof files[path] !== "string" || files[path].trim().length < 20) {
      problems.push(`missing file: ${path}`);
    }
  }
  const html = files["index.html"] || "";
  if (!html.includes("<body")) problems.push("index.html has no <body>");
  if (!html.includes("styles.css")) problems.push("index.html does not link styles.css");
  if (!html.includes("app.js")) problems.push("index.html does not load app.js");
  try {
    new Function(files["app.js"] || "");
  } catch (err) {
    problems.push(`app.js syntax error: ${err.message}`);
  }
  for (const [path, content] of Object.entries(files)) {
    if (/<script[^>]+src=["']https?:/i.test(content)) problems.push(`${path} loads remote script`);
    if (/@import\s+url\(["']?https?:/i.test(content)) problems.push(`${path} imports remote css`);
  }
  return problems;
}

async function renderCheck(browser, app, slug) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
  });
  await page.setContent(buildPreview(app.files), { waitUntil: "load" });
  await page.waitForTimeout(900);

  const info = await page.evaluate(() => {
    const body = document.body;
    const style = getComputedStyle(body);
    const text = (body.innerText || "").replace(/\s+/g, " ").trim();
    const parse = (c) => c.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    const lum = (rgb) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    };
    const l1 = lum(parse(style.color));
    const l2 = lum(parse(style.backgroundColor));
    const contrast = Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
    return {
      text,
      bg: style.backgroundColor,
      color: style.color,
      contrast,
      bodyHeight: body.scrollHeight,
      interactive: document.querySelectorAll("button, input, select, textarea").length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  const problems = [];
  if (info.text.length < 40) problems.push(`too little visible text (${info.text.length} chars)`);
  if (info.interactive < 3) problems.push(`only ${info.interactive} interactive elements`);
  if (info.bodyHeight < 200) problems.push(`page too short (${info.bodyHeight}px)`);
  if (info.overflowX > 2) problems.push(`horizontal overflow ${info.overflowX}px`);
  if (/transparent|rgba\(0, 0, 0, 0\)/.test(info.bg)) problems.push(`body background is ${info.bg}`);
  if (info.contrast < 4) problems.push(`low text contrast ${info.contrast}:1 (${info.color} on ${info.bg})`);

  await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: false });
  await page.close();
  return { problems: [...problems, ...errors], info };
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const prompts = process.argv.includes("--all") ? ALL : [[null, process.argv[2]]];
let failed = 0;
for (const [id, prompt] of prompts) {
  if (!prompt) {
    console.error("usage: node scripts/check-recipe.mjs <prompt> | --all");
    process.exit(2);
  }
  const slug = id || prompt.slice(0, 12).replace(/[^\w\u4e00-\u9fa5]+/g, "-");
  try {
    const app = await generate(prompt);
    const staticProblems = staticChecks(app);
    const { problems, info } = await renderCheck(browser, app, slug);
    const all = [...staticProblems, ...problems];
    const ok = all.length === 0;
    if (!ok) failed += 1;
    console.log(
      `${ok ? "PASS" : "FAIL"} ${slug.padEnd(12)} ${app.plan.name.padEnd(14)} ` +
        `${Object.keys(app.files).length} files · ${info.text.length} chars · buttons ${info.interactive}`,
    );
    if (all.length) all.slice(0, 8).forEach((p) => console.log(`   - ${p}`));
    if (!ok) writeFileSync(`${OUT}/${slug}.json`, JSON.stringify({ prompt, app: app.files, problems: all }, null, 2));
  } catch (err) {
    failed += 1;
    console.log(`FAIL ${slug.padEnd(12)} generation failed: ${err.message}`);
  }
}
await browser.close();
console.log(failed ? `\n${failed} recipe(s) failed` : "\nall recipes passed");
process.exit(failed ? 1 : 0);
