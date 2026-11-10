// throwaway probe — delete after use
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const OUT = "shots/.probe";
mkdirSync(OUT, { recursive: true });

function resizeRGBA(src, sw, sh, dw, dh) {
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
      let r = 0, g = 0, b = 0, a = 0, ws = 0;
      for (let y = y0; y < y1; y++) {
        const wy = Math.min(y + 1, sy1) - Math.max(y, sy0);
        for (let x = x0; x < x1; x++) {
          const wx = Math.min(x + 1, sx1) - Math.max(x, sx0);
          const w = wx * wy;
          const i = (y * sw + x) * 4;
          r += src[i] * w; g += src[i + 1] * w; b += src[i + 2] * w; a += src[i + 3] * w;
          ws += w;
        }
      }
      const o = (dy * dw + dx) * 4;
      out[o] = r / ws; out[o + 1] = g / ws; out[o + 2] = b / ws; out[o + 3] = a / ws;
    }
  }
  return out;
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });

const t0 = Date.now();
await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
console.log("goto ms", Date.now() - t0);
await page.waitForTimeout(1200);

let ts = Date.now();
for (let i = 0; i < 5; i++) await page.screenshot();
console.log("screenshot avg ms", (Date.now() - ts) / 5);

await page.screenshot({ path: `${OUT}/01-home.png` });
console.log("layout", JSON.stringify(await page.evaluate(() => ({ iw: innerWidth, ih: innerHeight, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight }))));
console.log("todo buttons", await page.getByRole("button", { name: /待办清单/ }).count());

const tClick = Date.now();
await page.getByRole("button", { name: /待办清单/ }).first().click();

// capture generating frames until built, every ~320ms
let n = 0;
let builtAt = null;
while (Date.now() - tClick < 70000) {
  await page.screenshot({ path: `${OUT}/gen-${String(n).padStart(2, "0")}.png` });
  n++;
  if (await page.getByText("已构建").count()) { builtAt = Date.now() - tClick; break; }
  await page.waitForTimeout(200);
}
console.log("frames during gen", n, "builtAt ms", builtAt);

if (builtAt !== null) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/02-built.png` });
  const frame = page.frameLocator("iframe[title='应用预览']");
  const input = frame.locator("#input");
  console.log("iframe input count", await input.count());
  try {
    await input.click();
    await input.fill("整理本周待办");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    console.log("iframe items", await frame.locator(".item").count());
  } catch (e) {
    console.log("iframe interaction failed:", e.message);
  }
  await page.screenshot({ path: `${OUT}/03-interact.png` });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/04-preview2.png` });

  await page.getByRole("button", { name: /^代码/ }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/05-code.png` });

  await page.getByRole("button", { name: /^版本/ }).first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/06-versions.png` });
  console.log("versions pane has", /v1/.test(await page.locator("body").innerText()));

  await page.getByRole("button", { name: /^预览/ }).first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/07-back.png` });
}

// resize timing test on one file
const raw = new PNG();
const buf = (await import("node:fs")).readFileSync(`${OUT}/01-home.png`);
const png = PNG.sync.read(buf);
let rt = Date.now();
const small = resizeRGBA(png.data, png.width, png.height, 960, 600);
console.log("resize ms", Date.now() - rt);
const outPng = new PNG({ width: 960, height: 600 });
outPng.data = Buffer.from(small);
writeFileSync(`${OUT}/01-home-960x600.png`, PNG.sync.write(outPng));

console.log("errors:", errs.length ? errs.slice(0, 10) : "none");
await browser.close();
