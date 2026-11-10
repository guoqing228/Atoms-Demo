/**
 * Mobile layout check: chat/preview are swapped by a segmented control instead
 * of being stacked, and the build auto-reveals the preview when it finishes.
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /待办清单/ }).first().click();
// wait for the run to finish regardless of which pane is visible
await page.waitForFunction(
  () => document.body.textContent.split("已构建").length - 1 >= 1,
  null,
  { timeout: 90000 },
);
await page.waitForTimeout(1800);

const visible = async (selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return r.width > 10 && r.height > 10 && style.display !== "none" && style.visibility !== "hidden";
  }, selector);

const checks = [];
checks.push(["preview auto-revealed after build", await visible("iframe[title='应用预览']")]);
checks.push(["chat hidden while preview shown", !(await visible("[data-testid='chat-messages']"))]);
checks.push(["mobile switcher rendered", await page.getByRole("button", { name: "对话" }).first().isVisible()]);

await page.getByRole("button", { name: "对话" }).first().click();
await page.waitForTimeout(500);
checks.push(["chat shown after switching", await visible("[data-testid='chat-messages']")]);
checks.push(["preview hidden after switching", !(await visible("iframe[title='应用预览']"))]);

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
checks.push([`no horizontal overflow (${overflow}px)`, overflow <= 1]);

// interact with the generated app while on the preview pane
await page.getByRole("button", { name: "预览" }).first().click();
await page.waitForTimeout(900);
const frame = page.frameLocator("iframe[title='应用预览']");
await frame.locator("#input").fill("移动端新增任务");
await frame.locator("#input").press("Enter");
await page.waitForTimeout(500);
checks.push([
  "generated app interactive on mobile",
  (await frame.locator("body").innerText()).includes("移动端新增任务"),
]);
await page.screenshot({ path: "shots/qa-mobile-preview.png" });

let failed = 0;
for (const [label, ok] of checks) {
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
}
console.log("page errors:", errors.length ? errors : "none");
console.log(failed ? `\n${failed} mobile check(s) failed` : "\nmobile checks passed");
await browser.close();
process.exitCode = failed ? 1 : 0;
