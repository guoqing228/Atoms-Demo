// throwaway probe 3 — dsf 0.75 output dims + capture cost during generation
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.75 });
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1200);

const first = await page.screenshot();
const png = PNG.sync.read(first);
console.log("dsf0.75 screenshot dims:", png.width, "x", png.height, "bytes", first.length);

for (let i = 0; i < 3; i++) await page.screenshot();
let homeTimes = [];
for (let i = 0; i < 4; i++) {
  const t = Date.now();
  const b = await page.screenshot();
  homeTimes.push([Date.now() - t, b.length]);
}
console.log("home shot times/bytes:", JSON.stringify(homeTimes));

const tClick = Date.now();
await page.getByRole("button", { name: /待办清单/ }).first().click();
const genTimes = [];
let n = 0;
let builtAt = null;
while (Date.now() - tClick < 70000) {
  const t = Date.now();
  const b = await page.screenshot();
  genTimes.push([Date.now() - t, b.length]);
  n++;
  if (await page.getByText("已构建").count()) { builtAt = Date.now() - tClick; break; }
}
console.log("gen frames", n, "builtAt", builtAt, "shot times:", JSON.stringify(genTimes.map((x) => x[0])));
const mid = genTimes.slice(2, -2).map((x) => x[0]).sort((a, b) => a - b);
console.log("gen median shot ms", mid[Math.floor(mid.length / 2)], "avg bytes", Math.round(genTimes.reduce((a, b) => a + b[1], 0) / genTimes.length));

await page.waitForTimeout(500);
const built = PNG.sync.read(await page.screenshot());
console.log("built dims", built.width, built.height);
const frame = page.frameLocator("iframe[title='应用预览']");
console.log("iframe input count", await frame.locator("#input").count());
console.log("versions label check");
await page.getByRole("button", { name: /^版本/ }).first().click();
await page.waitForTimeout(700);
console.log((await page.locator("body").innerText()).slice(-600));
await browser.close();
