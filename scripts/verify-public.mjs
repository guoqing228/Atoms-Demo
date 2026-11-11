/**
 * Verify the app through its public tunnel URL (not localhost).
 * Usage: BASE_URL=https://xxx.trycloudflare.com node scripts/verify-public.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL;
if (!BASE) {
  console.error("set BASE_URL");
  process.exit(2);
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 950 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 160)}`);
});

const t0 = Date.now();
const res = await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
console.log(`[1] load ${BASE} -> HTTP ${res?.status()} in ${Date.now() - t0}ms`);
console.log("    title:", await page.title());

await page.getByRole("button", { name: /待办清单/ }).first().click();
await page.waitForFunction(
  () => document.body.textContent.split("已构建").length - 1 >= 1,
  null,
  { timeout: 120000 },
);
console.log(`[2] generation via public URL: done in ${Date.now() - t0}ms`);

const frame = page.frameLocator("iframe[title='应用预览']");
await page.waitForTimeout(1500);
const appText = await frame.locator("body").innerText();
console.log("[3] preview:", appText.replace(/\s+/g, " ").slice(0, 80));

// real interaction through the tunnel
await frame.locator("#input").fill("公网隧道验证任务");
await frame.locator("#input").press("Enter");
await page.waitForTimeout(500);
const interacted = (await frame.locator("body").innerText()).includes("公网隧道验证任务");
console.log("[4] interact inside generated app:", interacted ? "PASS" : "FAIL");

// share dialog works
await page.getByRole("button", { name: "分享", exact: true }).first().click();
await page.waitForTimeout(800);
const dialog = await page.getByRole("dialog").innerText();
const shareUrl = /(http[^\s]*#share=[^\s]+)/.exec(dialog)?.[1];
console.log("[5] share url:", shareUrl ? `${shareUrl.length} chars` : "missing");
await page.keyboard.press("Escape");

// persistence after reload
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const persisted = (await page.locator("aside").innerText()).includes("Focus List");
console.log("[6] reload persistence:", persisted ? "PASS" : "FAIL");

await page.screenshot({ path: "shots/public-result.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log("[7] mobile overflow:", overflow, "px");
await page.screenshot({ path: "shots/public-mobile.png" });

console.log("runtime errors:", errors.length ? errors.slice(0, 6) : "none");
await browser.close();
const ok = interacted && persisted && errors.length === 0 && overflow <= 1;
console.log(ok ? "\nPUBLIC VERIFICATION PASSED" : "\nPUBLIC VERIFICATION HAD ISSUES");
process.exitCode = ok ? 0 : 1;
