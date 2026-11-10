/**
 * VibeForge 演示 GIF —— 真实录制一次「描述应用 → Agent 流式构建 → 预览交互 → 代码 / 版本」流程。
 *
 * 做法：
 *   1. Playwright（msedge headless）以 1280×800 桌面视口打开 dev server；
 *   2. 按定时 `page.screenshot({ type: "png" })` 截取原始帧（不用 video 录制）；
 *   3. pngjs 解码 + 面积平均缩放（超采样）到 960×600；
 *   4. gifenc 用「跨帧统一 256 色全局调色板」编码，帧延迟按真实时间戳换算并夹取到 6–8fps；
 *   5. 自检：首/中/尾帧像素统计（非空白）、阶段帧分布、文件体积（< 6MB，超了自动降级）。
 *
 * 用法：
 *   node scripts/demo-gif.mjs                 # 默认录 http://localhost:4311 → shots/demo.gif
 *   BASE_URL=http://localhost:4311 node scripts/demo-gif.mjs
 *   DEMO_GIF_OUT=shots/demo.gif node scripts/demo-gif.mjs
 *
 * 容错：
 *   - 单个操作失败会就地重试一次；整条流程失败会从头再录一次；
 *   - 若两次都没等到「已构建」，打印当前页面 body 文本并以退出码 1 结束（不会写坏旧 GIF）。
 *
 * 注意：本脚本只读应用 UI，不修改 src/、docs/、package.json，也不重启 dev server。
 */
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import gifenc from "gifenc";

// gifenc 的 package.json 在 Node 下解析到 CJS 入口，用默认导入再解构。
const { GIFEncoder, quantize, applyPalette } = gifenc;
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname } from "node:path";

/* ------------------------------------------------------------------ */
/* 配置                                                                */
/* ------------------------------------------------------------------ */
const BASE = process.env.BASE_URL || "http://localhost:4311";
const OUT_GIF = process.env.DEMO_GIF_OUT || "shots/demo.gif";

const VIEW = { width: 1280, height: 800 }; // 桌面布局；截图后由 pngjs 缩放
const TARGET_W = 960; // 目标 960×600（README 用）
const TARGET_H = 600;

const TARGET_FPS = 7;
const FRAME_MS = Math.round(1000 / TARGET_FPS); // 143ms
const MIN_DELAY = 125; // 8fps
const MAX_DELAY = 167; // 6fps
const LAST_DELAY = 900; // 结尾定格

const MAX_GIF_BYTES = 6 * 1024 * 1024;
// 正常 45s；DEMO_BUILD_TIMEOUT_MS 仅供调试「生成失败 → 打印 body 文本」分支
const BUILD_TIMEOUT_MS = Number(process.env.DEMO_BUILD_TIMEOUT_MS) || 45_000;

/* ------------------------------------------------------------------ */
/* 通用小工具                                                          */
/* ------------------------------------------------------------------ */
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));
const log = (...args) => console.log(...args);
const round1 = (n) => Math.round(n * 10) / 10;
const fmtBytes = (n) => `${n} bytes (${(n / 1024 / 1024).toFixed(2)} MB)`;

/** 生成失败（拿不到「已构建」）——携带当时的 body 文本，供失败时打印。 */
class BuildFailure extends Error {
  constructor(message, bodyText) {
    super(message);
    this.name = "BuildFailure";
    this.bodyText = bodyText || "";
  }
}

/** 就地重试封装：默认最多 2 次（失败重试一次）。 */
async function retry(label, fn, attempts = 2) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      log(`  步骤「${label}」失败（${i}/${attempts}）：${String(err.message || err).split("\n")[0]}`);
      if (i < attempts) await sleep(400);
    }
  }
  throw new Error(`步骤「${label}」重试 ${attempts} 次后仍失败：${lastError?.message || lastError}`);
}

/** dev server 连通性预检：失败时快速报错，而不是让 goto 超时几分钟。 */
async function preflight() {
  const attempts = 2;
  for (let i = 1; i <= attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch(BASE, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      log(`dev server 正常：${BASE}`);
      return;
    } catch (err) {
      log(`dev server 预检失败（${i}/${attempts}）：${err.message}${i < attempts ? "，稍后重试…" : ""}`);
      if (i < attempts) await sleep(2000);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`dev server 不可用（${BASE}）。请先启动 pnpm dev 再运行本脚本。`);
}

/* ------------------------------------------------------------------ */
/* 截帧器：独立循环按固定节奏截图，动作脚本与它并行执行                */
/* ------------------------------------------------------------------ */
class Recorder {
  constructor(page) {
    this.page = page;
    this.frames = []; // { buf: Buffer, t: ms(相对录制开始), phase }
    this.marks = []; // { name, idx, t }
    this.phase = "home";
    this.running = false;
    this.t0 = 0;
    this.loopPromise = null;
  }

  start() {
    this.t0 = Date.now();
    this.running = true;
    this.loopPromise = this.#loop();
  }

  /** 标记进入新阶段（用于报告里的帧分布统计）。 */
  mark(name) {
    this.marks.push({ name, idx: this.frames.length, t: Date.now() - this.t0 });
    this.phase = name;
    log(`  [${((Date.now() - this.t0) / 1000).toFixed(2)}s] ▶ 阶段：${name}`);
  }

  async #loop() {
    while (this.running) {
      const started = Date.now();
      try {
        const buf = await this.page.screenshot({ type: "png", timeout: 30_000 });
        if (!this.running) break;
        this.frames.push({ buf, t: started - this.t0, phase: this.phase });
      } catch (err) {
        if (!this.running) break;
        log(`  截帧失败（忽略并继续）：${String(err.message || err).split("\n")[0]}`);
        await sleep(100);
      }
      const elapsed = Date.now() - started;
      if (this.running && elapsed < FRAME_MS) await sleep(FRAME_MS - elapsed);
    }
  }

  async stop() {
    this.running = false;
    if (this.loopPromise) await this.loopPromise.catch(() => {});
    return this.frames;
  }
}

/* ------------------------------------------------------------------ */
/* 像素处理                                                            */
/* ------------------------------------------------------------------ */
/** 面积平均（box）缩放，RGBA。用于 1280×800 截图 → 960×600（超采样降噪，利于 GIF 压缩）。 */
function resizeRGBA(src, sw, sh, dw, dh) {
  if (sw === dw && sh === dh) return copyRGBA(src);
  const out = new Uint8Array(dw * dh * 4);
  for (let dy = 0; dy < dh; dy++) {
    const sy0 = (dy * sh) / dh;
    const sy1 = ((dy + 1) * sh) / dh;
    const y0 = Math.floor(sy0);
    const y1 = Math.min(sh, Math.ceil(sy1));
    for (let dx = 0; dx < dw; dx++) {
      const sx0 = (dx * sw) / dw;
      const sx1 = ((dx + 1) * sw) / dw;
      const x0 = Math.floor(sx0);
      const x1 = Math.min(sw, Math.ceil(sx1));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let wsum = 0;
      for (let y = y0; y < y1; y++) {
        const wy = Math.min(y + 1, sy1) - Math.max(y, sy0);
        for (let x = x0; x < x1; x++) {
          const wx = Math.min(x + 1, sx1) - Math.max(x, sx0);
          const wgt = wx * wy;
          const i = (y * sw + x) * 4;
          r += src[i] * wgt;
          g += src[i + 1] * wgt;
          b += src[i + 2] * wgt;
          a += src[i + 3] * wgt;
          wsum += wgt;
        }
      }
      const o = (dy * dw + dx) * 4;
      out[o] = r / wsum;
      out[o + 1] = g / wsum;
      out[o + 2] = b / wsum;
      out[o + 3] = a / wsum;
    }
  }
  return out;
}

/** 保证 RGBA 的 byteOffset 为 0（gifenc 内部会直接 new Uint32Array(buffer)）。 */
function copyRGBA(src) {
  if (src.byteOffset === 0 && src.buffer.byteLength === src.length) return src;
  return new Uint8Array(src);
}

/** 解码 PNG 并缩放到目标尺寸。 */
function decodeResize(buf, dw, dh) {
  const png = PNG.sync.read(buf);
  const src = copyRGBA(png.data);
  if (png.width === dw && png.height === dh) return src;
  return resizeRGBA(src, png.width, png.height, dw, dh);
}

/** 等比缩放后居中 letterbox（降级到 800×520 时保持画面不变形）。 */
function resizeLetterbox(src, sw, sh, dw, dh) {
  const scale = Math.min(dw / sw, dh / sh);
  const tw = Math.max(1, Math.round(sw * scale));
  const th = Math.max(1, Math.round(sh * scale));
  const scaled = resizeRGBA(src, sw, sh, tw, th);
  if (tw === dw && th === dh) return scaled;
  const out = new Uint8Array(dw * dh * 4);
  const bg = [src[0], src[1], src[2], 255];
  for (let i = 0; i < dw * dh; i++) {
    const o = i * 4;
    out[o] = bg[0];
    out[o + 1] = bg[1];
    out[o + 2] = bg[2];
    out[o + 3] = bg[3];
  }
  const ox = Math.floor((dw - tw) / 2);
  const oy = Math.floor((dh - th) / 2);
  for (let y = 0; y < th; y++) {
    const srcStart = y * tw * 4;
    const dstStart = ((y + oy) * dw + ox) * 4;
    out.set(scaled.subarray(srcStart, srcStart + tw * 4), dstStart);
  }
  return out;
}

/** 帧像素统计：平均亮度 / 对比度（标准差）/ 12bit 色彩数 / 亮度范围。 */
function frameStats(rgba, w, h) {
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  let min = 255;
  let max = 0;
  const colors = new Set();
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const i = (y * w + x) * 4;
      const lum = 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2];
      sum += lum;
      sumSq += lum * lum;
      n++;
      if (lum < min) min = lum;
      if (lum > max) max = lum;
      colors.add(((rgba[i] >> 4) << 8) | ((rgba[i + 1] >> 4) << 4) | (rgba[i + 2] >> 4));
    }
  }
  const mean = sum / n;
  return {
    mean: round1(mean),
    std: round1(Math.sqrt(Math.max(0, sumSq / n - mean * mean))),
    colors: colors.size,
    min: Math.round(min),
    max: Math.round(max),
  };
}

/** 两帧平均绝对差（每 8 个采样点取一个），用于确认画面确实在变化。 */
function frameDiff(a, b, w, h) {
  let diff = 0;
  let n = 0;
  for (let y = 0; y < h; y += 8) {
    for (let x = 0; x < w; x += 8) {
      const i = (y * w + x) * 4;
      diff +=
        Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      n += 3;
    }
  }
  return round1(diff / n);
}

const isBlank = (stats) => stats.std < 8 || stats.colors < 30 || stats.max - stats.min < 40;

/* ------------------------------------------------------------------ */
/* GIF 编码                                                            */
/* ------------------------------------------------------------------ */
/**
 * 用跨帧统一全局调色板编码：
 *   - 从 10 帧均匀采样像素 quantize 出 256 色全局 palette（避免逐帧调色板造成的闪烁，也更省体积）；
 *   - 每一帧 applyPalette 后用 gifenc 写出；帧延迟取真实截图间隔并夹取到 6–8fps。
 */
function encodeGif(frames, delays, outW, outH, maxColors, letterbox) {
  const n = frames.length;
  const toTarget = (buf) => {
    const png = PNG.sync.read(buf);
    const src = copyRGBA(png.data);
    if (letterbox) {
      return resizeLetterbox(src, png.width, png.height, outW, outH);
    }
    return png.width === outW && png.height === outH
      ? src
      : resizeRGBA(src, png.width, png.height, outW, outH);
  };

  // ---- 1. 采样出全局调色板 ----
  const sampleIdx = [];
  const sampleCount = Math.min(10, n);
  for (let k = 0; k < sampleCount; k++) {
    sampleIdx.push(Math.min(n - 1, Math.round((k * (n - 1)) / Math.max(1, sampleCount - 1))));
  }
  const pixelsPerFrame = Math.floor((outW * outH) / 4); // 每 4 个像素采 1 个
  const sampleData = new Uint8Array(pixelsPerFrame * 4 * sampleIdx.length);
  let off = 0;
  for (const idx of sampleIdx) {
    const rgba = toTarget(frames[idx].buf);
    for (let p = 0; p + 3 < rgba.length; p += 16) {
      sampleData[off++] = rgba[p];
      sampleData[off++] = rgba[p + 1];
      sampleData[off++] = rgba[p + 2];
      sampleData[off++] = rgba[p + 3];
    }
  }
  const palette = quantize(sampleData.subarray(0, off), maxColors, { format: "rgb565" });

  // ---- 2. 逐帧写 GIF，同时收集首/中/尾帧统计 ----
  const gif = GIFEncoder();
  const stats = new Map();
  const kept = new Map();
  const keepIdx = new Set([0, Math.floor((n - 1) / 2), n - 1]);
  for (let i = 0; i < n; i++) {
    const rgba = toTarget(frames[i].buf);
    if (keepIdx.has(i)) kept.set(i, rgba);
    stats.set(i, frameStats(rgba, outW, outH));
    const indexed = applyPalette(rgba, palette, "rgb565");
    gif.writeFrame(
      indexed,
      outW,
      outH,
      i === 0 ? { palette, delay: delays[i], repeat: 0 } : { delay: delays[i] },
    );
  }
  gif.finish();
  return { bytes: gif.bytes(), palette, stats, kept, outW, outH };
}

/* ------------------------------------------------------------------ */
/* 录制流程                                                            */
/* ------------------------------------------------------------------ */
/** 等「已构建」出现；同时留意错误态。返回 boolean。 */
async function waitForBuilt(page, timeoutMs) {
  const start = Date.now();
  let tick = 0;
  while (Date.now() - start < timeoutMs) {
    tick++;
    if (await page.getByText("已构建").count().catch(() => 0)) return true;
    if (tick % 4 === 0) {
      const body = await page.locator("body").innerText().catch(() => "");
      if (body.includes("已取消生成") || body.includes("生成失败")) return false;
    }
    await sleep(120);
  }
  return false;
}

/**
 * 尝试完整录制一次（新的浏览器 context = 干净的 IndexedDB，帧与上次尝试互不污染）。
 * 成功返回 { frames, marks, pageErrors, interaction }；失败抛出异常。
 */
async function recordAttempt(browser, attemptNo) {
  const context = await browser.newContext({ viewport: { ...VIEW }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") pageErrors.push(`console.error: ${m.text().slice(0, 300)}`);
  });

  const rec = new Recorder(page);
  let interaction = { ok: false, note: "未执行" };
  // 各阶段的 DOM 证据：证明录到的是「真实流程」，不是静态图
  const evidence = { streaming: null, built: null, iframe: null, code: null, versions: null, preview: null };

  try {
    log(`\n=== 第 ${attemptNo}/2 次录制尝试 ===`);
    log(`打开首页 ${BASE} …`);
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 150_000 });
    await retry("等待首页模板列表", () =>
      page.getByRole("button", { name: /待办清单/ }).first().waitFor({ timeout: 60_000 }),
    );
    await sleep(1300); // 等首屏入场动画 + 字体稳定

    // 开始连续截帧
    rec.start();
    rec.mark("home");

    /* 1) 首页停留 1.5s ------------------------------------------------ */
    await sleep(1500);

    /* 2) 点「待办清单」模板 → 生成中 ---------------------------------- */
    rec.mark("generating");
    await retry("点击「待办清单」模板", async () => {
      const tpl = page.getByRole("button", { name: /待办清单/ }).first();
      const box = await tpl.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
        await sleep(220); // 记录 hover 高亮
      }
      await tpl.click({ timeout: 20_000 });
    });

    // 生成中的「流式」证据：约 1.8s 内聊天面板文本明显变长，说明步骤/文件正在流式出现
    try {
      const before = (await page.locator("body").innerText()).length;
      await sleep(1800);
      const after = (await page.locator("body").innerText()).length;
      evidence.streaming = { before, after, delta: after - before };
      log(`  生成中 UI 文本 ${before} → ${after} 字符（+${after - before}），步骤/文件确实在流式出现`);
    } catch {
      evidence.streaming = null;
    }

    log(`等待 Agent 流式构建（最多 ${BUILD_TIMEOUT_MS / 1000}s）…`);
    if (!(await waitForBuilt(page, BUILD_TIMEOUT_MS))) {
      const body = await page.locator("body").innerText().catch(() => "");
      throw new BuildFailure(
        `生成失败：${BUILD_TIMEOUT_MS / 1000}s 内没有出现「已构建」`,
        body,
      );
    }
    rec.mark("built");
    log("已出现「已构建」，开始预览交互…");
    try {
      const body = await page.locator("body").innerText();
      evidence.built = {
        hasBuilt: body.includes("已构建"),
        hasPlanName: /focus list/i.test(body),
        filesLine: (/[\d.]+\s*KB/i.exec(body) || [""])[0],
        hasMs: /\d+(\.\d+)?s\b/.test(body),
      };
    } catch {
      evidence.built = null;
    }

    /* 3) 生成完成：预览停留 + 在生成的应用内输入 ---------------------- */
    const iframe = page.locator("iframe[title='应用预览']").first();
    const appFrame = page.frameLocator("iframe[title='应用预览']");
    try {
      await retry("等待生成应用预览就绪", async () => {
        await iframe.waitFor({ state: "visible", timeout: 20_000 });
        await appFrame.locator("#input").waitFor({ state: "visible", timeout: 20_000 });
      });
      const input = appFrame.locator("#input");
      await input.click({ timeout: 8000 });
      await input.pressSequentially("整理本周待办", { delay: 70 }); // 逐字输入，帧里能看到文字流
      await page.keyboard.press("Enter");
      await sleep(450);
      const firstCheck = appFrame.locator(".item .check").first();
      if (await firstCheck.count()) await firstCheck.click({ timeout: 5000 });
      interaction = { ok: true, note: "输入「整理本周待办」并勾选第一项" };
      const appText = await appFrame.locator("body").innerText().catch(() => "");
      evidence.iframe = {
        items: await appFrame.locator(".item").count().catch(() => 0),
        textLen: appText.length,
        addedTaskVisible: appText.includes("整理本周待办"),
      };
    } catch (err) {
      interaction = { ok: false, note: String(err.message || err).split("\n")[0] };
      log(`  预览交互失败（不影响录制）：${interaction.note}`);
    }
    // 「已构建」后整体停留 ≈ 2s（交互耗时已占一部分）
    await sleep(interaction.ok ? 800 : 1700);

    /* 4) 代码 tab ------------------------------------------------------ */
    rec.mark("code");
    await retry("切换到「代码」tab", () =>
      page.getByRole("button", { name: /^代码/ }).first().click({ timeout: 15_000 }),
    );
    await sleep(1500);
    try {
      const body = await page.locator("body").innerText();
      evidence.code = {
        files: ["index.html", "styles.css", "app.js"].filter((p) => body.includes(p)),
        hasSource: /<!doctype\s+html>/i.test(body),
        hasCopy: body.includes("复制") || body.includes("COPY"),
      };
    } catch {
      evidence.code = null;
    }

    /* 5) 版本 tab ------------------------------------------------------ */
    rec.mark("versions");
    await retry("切换到「版本」tab", () =>
      page.getByRole("button", { name: /^版本/ }).first().click({ timeout: 15_000 }),
    );
    await sleep(1200);
    try {
      const body = await page.locator("body").innerText();
      evidence.versions = {
        hasTimeline: /version timeline/i.test(body) || /snapshots/i.test(body),
        hasV01: /v0?1/i.test(body),
      };
    } catch {
      evidence.versions = null;
    }

    /* 6) 回到预览 ------------------------------------------------------ */
    rec.mark("preview");
    await retry("切回「预览」tab", () =>
      page.getByRole("button", { name: /^预览/ }).first().click({ timeout: 15_000 }),
    );
    await sleep(1100);
    try {
      evidence.preview = {
        iframeVisible: await iframe.isVisible().catch(() => false),
        items: await appFrame.locator(".item").count().catch(() => 0),
      };
    } catch {
      evidence.preview = null;
    }

    return { frames: rec.frames, marks: rec.marks, pageErrors, interaction, evidence };
  } finally {
    try {
      await rec.stop();
    } catch {
      /* ignore */
    }
    await context.close().catch(() => {});
  }
}

/* ------------------------------------------------------------------ */
/* 预热：让 dev server 先编译路由，避免录制时首屏/SSE 卡顿             */
/* ------------------------------------------------------------------ */
async function warmup(browser) {
  log("\n预热 dev server（编译首页与生成路由，约 5–10s）…");
  const context = await browser.newContext({ viewport: { ...VIEW }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 150_000 });
    await page.getByRole("button", { name: /待办清单/ }).first().click({ timeout: 30_000 });
    await page.getByText("已构建").first().waitFor({ timeout: 90_000 });
    log("预热完成（dev server 已就绪）");
  } catch (err) {
    log(`预热未完成（继续尝试录制）：${String(err.message || err).split("\n")[0]}`);
  } finally {
    await context.close().catch(() => {});
  }
}

/* ------------------------------------------------------------------ */
/* 编码 + 自检 + 报告                                                  */
/* ------------------------------------------------------------------ */
function buildDelays(frames) {
  return frames.map((f, i) => {
    if (i === frames.length - 1) return LAST_DELAY;
    const delta = frames[i + 1].t - f.t;
    const rounded = Math.round(delta / 10) * 10;
    return Math.min(MAX_DELAY, Math.max(MIN_DELAY, rounded));
  });
}

function phaseDistribution(frames, marks, delays) {
  if (!frames.length) return [];
  return marks.map((mark, i) => {
    const next = marks[i + 1];
    const endIdx = next ? next.idx : frames.length;
    const startT = mark.t;
    const endT = next
      ? next.t
      : (frames[frames.length - 1].t + (delays[delays.length - 1] || 0));
    return {
      phase: mark.name,
      frames: Math.max(0, endIdx - mark.idx),
      seconds: Math.max(0, (endT - startT) / 1000),
    };
  });
}

/**
 * 只做结构解析的极简 GIF 读回校验：确认写出的文件真的是 GIF89a、尺寸正确、
 * 图像块数量与延迟符合预期（不依赖任何额外依赖）。
 */
function parseGifStructure(buf) {
  const header = buf.toString("ascii", 0, 6);
  if (header !== "GIF89a") throw new Error(`输出不是 GIF89a（header=${header}）`);
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  const packed = buf[10];
  let pos = 13;
  if (packed & 0x80) pos += 3 * (1 << ((packed & 7) + 1)); // 全局色表
  let frames = 0;
  let delays = [];
  let loop = false;
  while (pos < buf.length) {
    const block = buf[pos++];
    if (block === 0x3b) break; // trailer
    if (block === 0x21) {
      const label = buf[pos++];
      if (label === 0xf9) {
        const size = buf[pos];
        delays.push(buf.readUInt16LE(pos + 2) * 10);
        pos += size + 2; // 块数据 + 终止符
      } else {
        if (label === 0xff) {
          const sub = buf[pos];
          if (buf.toString("ascii", pos + 1, pos + 1 + sub).startsWith("NETSCAPE")) loop = true;
        }
        while (buf[pos] !== 0) pos += buf[pos] + 1; // 跳过子块
        pos++;
      }
    } else if (block === 0x2c) {
      frames++;
      pos += 8; // left/top/width/height
      const ipacked = buf[pos++];
      if (ipacked & 0x80) pos += 3 * (1 << ((ipacked & 7) + 1)); // 局部色表
      pos++; // LZW min code size
      while (buf[pos] !== 0) pos += buf[pos] + 1;
      pos++;
    } else {
      throw new Error(`未知 GIF 数据块 0x${block.toString(16)}，偏移 ${pos - 1}`);
    }
  }
  return { width, height, frames, delays, loop };
}

async function encodeAndReport(result) {
  const { frames, marks, pageErrors, interaction, evidence } = result;

  if (frames.length < 30) {
    throw new Error(`截帧数量过少（${frames.length}），录制可能失败。`);
  }

  const delays = buildDelays(frames);
  const totalMs = delays.reduce((a, b) => a + b, 0);
  const playDelays = delays.slice(0, -1);
  const avgDelay = playDelays.reduce((a, b) => a + b, 0) / playDelays.length;
  const avgFps = 1000 / avgDelay;

  // ---- 编码：960×600 / 256 色；超 6MB 自动降级 ----
  let encoded = encodeGif(frames, delays, TARGET_W, TARGET_H, 256, false);
  log(`\n首次编码：${fmtBytes(encoded.bytes.length)}（${TARGET_W}×${TARGET_H}）`);
  if (encoded.bytes.length > MAX_GIF_BYTES) {
    log("超过 6MB，改用 128 色重新编码…");
    encoded = encodeGif(frames, delays, TARGET_W, TARGET_H, 128, false);
    log(`128 色编码：${fmtBytes(encoded.bytes.length)}`);
  }
  if (encoded.bytes.length > MAX_GIF_BYTES) {
    log("仍超过 6MB，降级到 800×520（letterbox）…");
    encoded = encodeGif(frames, delays, 800, 520, 128, true);
    log(`800×520 编码：${fmtBytes(encoded.bytes.length)}`);
  }
  if (encoded.bytes.length > MAX_GIF_BYTES) {
    log(`警告：最终体积仍超过 6MB（${fmtBytes(encoded.bytes.length)}）。`);
  }

  mkdirSync(dirname(OUT_GIF), { recursive: true });
  writeFileSync(OUT_GIF, Buffer.from(encoded.bytes));
  const fileSize = statSync(OUT_GIF).size;

  // 写出的文件再读回，做一次纯结构校验（GIF89a / 尺寸 / 图像块数 / 延迟 / 循环）
  const gifStructure = parseGifStructure(Buffer.from(encoded.bytes));

  // 可选：把每个阶段「停留中」的一帧落盘成 PNG，方便人工复查（默认不落盘）
  if (process.env.DEMO_DEBUG_DIR) {
    mkdirSync(process.env.DEMO_DEBUG_DIR, { recursive: true });
    for (let i = 0; i < marks.length; i++) {
      const mark = marks[i];
      const endIdx = i + 1 < marks.length ? marks[i + 1].idx : frames.length;
      const midIdx = Math.min(
        frames.length - 1,
        mark.idx + Math.floor(Math.max(1, endIdx - mark.idx) / 2),
      );
      const frame = frames[midIdx];
      if (frame) writeFileSync(`${process.env.DEMO_DEBUG_DIR}/${mark.name}.png`, frame.buf);
    }
    log(`调试帧（各阶段停留中帧）已保存到 ${process.env.DEMO_DEBUG_DIR}/`);
  }

  const n = frames.length;
  const midIdx = Math.floor((n - 1) / 2);
  const lastIdx = n - 1;
  const statFirst = encoded.stats.get(0);
  const statMid = encoded.stats.get(midIdx);
  const statLast = encoded.stats.get(lastIdx);
  const firstRGBA = encoded.kept.get(0);
  const midRGBA = encoded.kept.get(midIdx);
  const lastRGBA = encoded.kept.get(lastIdx);

  const checks = [
    ["首帧", statFirst],
    ["中间帧", statMid],
    ["尾帧", statLast],
  ].map(([name, s]) => ({ name, s, ok: !isBlank(s) }));
  const diffFirstLast = frameDiff(firstRGBA, lastRGBA, encoded.outW, encoded.outH);
  const diffFirstMid = frameDiff(firstRGBA, midRGBA, encoded.outW, encoded.outH);

  /* ---------------- 报告 ---------------- */
  const dist = phaseDistribution(frames, marks, delays);
  const phaseLabel = {
    home: "首页",
    generating: "生成中（流式）",
    built: "已构建 + 预览交互",
    code: "代码 tab",
    versions: "版本 tab",
    preview: "回到预览",
  };
  const distText = dist
    .map((d) => `${phaseLabel[d.phase] || d.phase} ${d.frames}帧/${d.seconds.toFixed(1)}s`)
    .join(" · ");

  log("\n================ demo.gif 自检报告 ================");
  log(`文件路径 ：${OUT_GIF}`);
  log(`文件大小 ：${fileSize} bytes（${(fileSize / 1024 / 1024).toFixed(2)} MB）`);
  log(`尺寸     ：${encoded.outW}×${encoded.outH}（截帧原始 ${VIEW.width}×${VIEW.height}，pngjs 面积平均缩放）`);
  log(`帧数     ：${n} 帧（GIF 读回校验：${gifStructure.frames} 帧，尺寸 ${gifStructure.width}×${gifStructure.height}，循环=${gifStructure.loop ? "是" : "否"}）`);
  log(`时长     ：${(totalMs / 1000).toFixed(2)}s`);
  log(`帧率     ：平均 ${avgFps.toFixed(2)}fps（帧延迟 ${Math.min(...playDelays)}–${Math.max(...playDelays)}ms，末帧定格 ${LAST_DELAY}ms）`);
  log(`阶段分布 ：${distText}`);
  log(`预览交互 ：${interaction.ok ? `成功 - ${interaction.note}` : `跳过 - ${interaction.note}`}`);
  if (evidence.streaming) {
    log(`流式证据 ：生成中 ${evidence.streaming.before} → ${evidence.streaming.after} 字符（+${evidence.streaming.delta}）`);
  }
  if (evidence.built) {
    log(`构建证据 ：已构建=${evidence.built.hasBuilt}，应用=${evidence.built.hasPlanName ? "Focus List" : "?"}，体积=${evidence.built.filesLine || "?"}`);
  }
  if (evidence.iframe) {
    log(`应用交互 ：列表 ${evidence.iframe.items} 项，文本 ${evidence.iframe.textLen} 字符，新任务可见=${evidence.iframe.addedTaskVisible}`);
  }
  if (evidence.code) {
    log(`代码证据 ：文件=${evidence.code.files.join("/") || "?"}，含源码=${evidence.code.hasSource}，复制按钮=${evidence.code.hasCopy}`);
  }
  if (evidence.versions) {
    log(`版本证据 ：时间线=${evidence.versions.hasTimeline}，含 V01=${evidence.versions.hasV01}`);
  }
  if (evidence.preview) {
    log(`回到预览 ：iframe 可见=${evidence.preview.iframeVisible}，列表 ${evidence.preview.items} 项`);
  }
  log(`页面错误 ：${pageErrors.length ? `${pageErrors.length} 条（录制过程仍成功）` : "无"}`);
  for (const { name, s, ok } of checks) {
    log(
      `像素自检 ：${name} 平均亮度 ${s.mean} / 对比度 ${s.std} / 色彩 ${s.colors} / 亮度范围 ${s.min}-${s.max} → ${ok ? "非空白 ✓" : "疑似空白 ✗"}`,
    );
  }
  log(`帧变化   ：首帧 vs 中间帧差异 ${diffFirstMid}，首帧 vs 尾帧差异 ${diffFirstLast}（>1 表示画面明显变化）`);
  log(`调色板   ：全局 ${encoded.palette.length} 色`);
  log("==================================================");

  // GIF 结构读回断言
  if (gifStructure.frames !== n || gifStructure.delays.length !== n) {
    throw new Error(
      `GIF 结构校验失败：图像块 ${gifStructure.frames} / 延迟 ${gifStructure.delays.length}，期望 ${n}`,
    );
  }
  if (gifStructure.width !== encoded.outW || gifStructure.height !== encoded.outH) {
    throw new Error(`GIF 结构校验失败：尺寸 ${gifStructure.width}×${gifStructure.height}`);
  }
  if (!gifStructure.loop) throw new Error("GIF 结构校验失败：缺少循环播放扩展块");

  const blank = checks.filter((c) => !c.ok);
  if (blank.length) {
    throw new Error(`自检失败：${blank.map((c) => c.name).join("/")} 疑似空白`);
  }
  if (diffFirstLast < 1) {
    throw new Error("自检失败：首帧与尾帧几乎相同，录制可能停在同一画面。");
  }
  log(`\n用法：node scripts/demo-gif.mjs    （默认读取 ${BASE}，输出 ${OUT_GIF}）`);
  return { fileSize, frames: n, width: encoded.outW, height: encoded.outH };
}

/* ------------------------------------------------------------------ */
/* 入口                                                                */
/* ------------------------------------------------------------------ */
async function main() {
  log("VibeForge 演示 GIF 录制脚本");
  await preflight();

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    await warmup(browser);

    let result = null;
    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await recordAttempt(browser, attempt);
        log(`\n第 ${attempt} 次尝试录制成功：${result.frames.length} 帧`);
        break;
      } catch (err) {
        lastError = err;
        log(`\n第 ${attempt} 次尝试失败：${String(err.message || err).split("\n")[0]}`);
        if (attempt === 1) log("将完整重试一次…");
      }
    }

    if (!result) {
      log("\n=== 生成失败：未能产出演示 GIF ===");
      log(`原因：${lastError?.message || lastError}`);
      if (lastError?.bodyText) {
        log("\n当前页面 body 文本：");
        log(lastError.bodyText.slice(0, 4000));
      }
      process.exitCode = 1;
      return;
    }

    await encodeAndReport(result);
  } catch (err) {
    log(`\n致命错误：${String(err.message || err)}`);
    process.exitCode = 1;
  } finally {
    await browser.close().catch(() => {});
  }
}

await main();
