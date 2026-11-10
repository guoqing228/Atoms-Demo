// throwaway probe 4 — dsf 0.8 dims + timing during generation
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.8 });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1200);

const b = await page.screenshot();
const png = PNG.sync.read(b);
console.log("dsf0.8 dims", png.width, "x", png.height, "bytes", b.length);
for (let i = 0; i < 3; i++) await page.screenshot();
const home = [];
for (let i = 0; i < 4; i++) { const t = Date.now(); await page.screenshot(); home.push(Date.now() - t); }
console.log("home times", home.join(","));

const tClick = Date.now();
await page.getByRole("button", { name: /待办清单/ }).first().click();
const t = [];
let n = 0, builtAt = null;
while (Date.now() - tClick < 70000) {
  const s = Date.now();
  await page.screenshot();
  t.push(Date.now() - s);
  n++;
  if (n % 3 === 0 && (await page.getByText("已构建").count())) { builtAt = Date.now() - tClick; break; }
}
const mid = t.slice(2, -2).sort((a, b) => a - b);
console.log("gen shots", n, "builtAt", builtAt, "median", mid[Math.floor(mid.length / 2)], "max", Math.max(...t), "times", t.join(","));
await browser.close();
