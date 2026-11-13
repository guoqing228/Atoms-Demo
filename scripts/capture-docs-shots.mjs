/**
 * Capture up-to-date screenshots for the manual/readme.
 * Usage: node scripts/capture-docs-shots.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "https://vibeforge-interview-demo.netlify.app";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();

await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/00-login.png" });
console.log("saved shots/00-login.png");

await page.getByRole("button", { name: /使用演示账号一键体验/ }).click();
await page.waitForTimeout(2200);
await page.screenshot({ path: "shots/01-home.png" });
console.log("saved shots/01-home.png");

await page.getByRole("button", { name: /新建应用/ }).click();
await page.waitForTimeout(500);
await page.locator("textarea").first().fill(
  "做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示",
);
await page.keyboard.press("Enter");
await page.waitForTimeout(15000);
await page.screenshot({ path: "shots/02-generating.png" });
console.log("saved shots/02-generating.png");

await page.waitForFunction(
  () => document.body.textContent.split("已构建").length - 1 >= 1,
  null,
  { timeout: 300000 },
);
await page.waitForTimeout(2500);
await page.screenshot({ path: "shots/03-result.png" });
console.log("saved shots/03-result.png");

await page.getByRole("button", { name: /^代码/ }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/04-code.png" });
console.log("saved shots/04-code.png");

await page.getByRole("button", { name: /^版本/ }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/06-versions.png" });
console.log("saved shots/06-versions.png");

await page.getByRole("button", { name: "设置" }).first().click();
await page.waitForTimeout(800);
await page.screenshot({ path: "shots/05-settings.png" });
console.log("saved shots/05-settings.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

await page.getByRole("button", { name: /^预览/ }).first().click();
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
await page.getByRole("button", { name: "预览" }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/public-mobile.png" });
console.log("saved shots/public-mobile.png");

await browser.close();
console.log("screenshots done");
