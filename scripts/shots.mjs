import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:4311";
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1512, height: 950 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "shots/01-home.png" });
console.log("home ok");

await page.getByRole("button", { name: /待办清单/ }).first().click();
await page.waitForTimeout(2800);
await page.screenshot({ path: "shots/02-generating.png" });
console.log("generating captured");

await page.getByText("已构建").first().waitFor({ timeout: 45000 });
await page.waitForTimeout(4200); // let the toast fade
await page.screenshot({ path: "shots/03-result.png" });
console.log("result captured");

// verify the generated app actually rendered inside the iframe
const frame = page.frameLocator("iframe[title='应用预览']");
const appText = await frame.locator("body").innerText();
console.log("preview app text:", appText.replace(/\s+/g, " ").slice(0, 160));
const appBg = await frame
  .locator("body")
  .evaluate((el) => getComputedStyle(el).backgroundColor);
console.log("preview app body bg:", appBg);

await page.getByRole("button", { name: /^代码/ }).first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: "shots/04-code.png" });
console.log("code tab ok");

await page.getByRole("button", { name: /^控制台/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: "shots/05-console.png" });

await page.getByRole("button", { name: /^版本/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: "shots/06-versions.png" });
console.log("versions tab ok");

// layout sanity
const layout = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  scrollHeight: document.documentElement.scrollHeight,
  innerHeight: window.innerHeight,
}));
console.log("layout:", JSON.stringify(layout));

console.log("console errors:", errors.length ? errors.slice(0, 10) : "none");
await browser.close();
