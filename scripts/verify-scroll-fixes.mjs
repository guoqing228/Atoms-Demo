/**
 * Verify scroll fixes end to end (online): chat panel, generated app page,
 * settings dialog at short viewport, mobile panes.
 *
 * Usage: BASE_URL=https://... node scripts/verify-scroll-fixes.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "https://vibeforge-interview-demo.netlify.app";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1000);
if (await page.getByRole("button", { name: /使用演示账号一键体验/ }).count()) {
  await page.getByRole("button", { name: /使用演示账号一键体验/ }).click();
  await page.waitForTimeout(1800);
}
await page.getByRole("button", { name: /新建应用/ }).click();
await page.waitForTimeout(400);
for (let i = 0; i < 2; i += 1) {
  const input = page.locator("textarea").last();
  await input.fill(
    i === 0
      ? "做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示"
      : "把标题改成「会议室预订系统」，并在当天预约列表上方加搜索框和会议室筛选",
  );
  await input.press("Enter");
  await page.waitForFunction(
    (n) => document.body.textContent.split("已构建").length - 1 >= n,
    i + 1,
    { timeout: 180000 },
  );
  await page.waitForTimeout(1600);
}

/* 1. chat panel scroll */
const chat = await page.evaluate(() => {
  const el = document.querySelector("[data-testid='chat-messages']");
  el.scrollTop = 0;
  const top = el.scrollTop;
  el.scrollTop = el.scrollHeight;
  return { overflowY: getComputedStyle(el).overflowY, top, bottom: el.scrollTop, max: el.scrollHeight - el.clientHeight };
});
check("chat panel scrollable", chat.overflowY === "auto" && chat.max > 0 && chat.bottom > 0, JSON.stringify(chat));

/* 2. generated app page scroll inside preview */
const frameBody = page.frameLocator("iframe[title='应用预览']").locator("body");
const appScroll = await frameBody.evaluate((body) => {
  window.scrollTo(0, 260);
  return {
    y: window.scrollY,
    docH: document.documentElement.scrollHeight,
    viewport: window.innerHeight,
    bodyH: body.scrollHeight,
  };
});
check(
  "generated app page scrollable",
  appScroll.docH > appScroll.viewport && appScroll.y > 0,
  JSON.stringify(appScroll),
);

/* 3. settings dialog at short viewport */
await page.setViewportSize({ width: 1366, height: 420 });
await page.waitForTimeout(500);
await page.getByRole("button", { name: "设置" }).first().click();
await page.waitForTimeout(700);
const dialog = await page.evaluate(() => {
  const el = document.querySelector(".vf-dialog");
  if (!el) return null;
  const cs = getComputedStyle(el);
  el.scrollTop = 0;
  el.scrollTop = el.scrollHeight;
  return {
    overflowY: cs.overflowY,
    maxH: cs.maxHeight,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    canScroll: el.scrollHeight > el.clientHeight,
    scrolledTo: el.scrollTop,
  };
});
check(
  "settings dialog scrolls when viewport is short",
  Boolean(dialog) && (dialog.canScroll ? dialog.scrolledTo > 0 : dialog.scrollHeight <= dialog.clientHeight),
  JSON.stringify(dialog),
);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

/* 4. mobile: chat/preview panes usable and chat scrollable */
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(700);
const mobileChat = await page.evaluate(() => {
  const el = document.querySelector("[data-testid='chat-messages']");
  if (!el) return null;
  el.scrollTop = el.scrollHeight;
  return { h: el.clientHeight, max: el.scrollHeight - el.clientHeight, bottom: el.scrollTop, overflowY: getComputedStyle(el).overflowY };
});
check("mobile chat scrollable", Boolean(mobileChat) && mobileChat.h > 100 && mobileChat.max > 0, JSON.stringify(mobileChat));
await page.getByRole("button", { name: "预览" }).first().click();
await page.waitForTimeout(700);
const mobilePreview = await page.evaluate(() => {
  const f = document.querySelector("iframe[title='应用预览']");
  if (!f) return null;
  const r = f.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
});
check("mobile preview visible", Boolean(mobilePreview) && mobilePreview.w > 100 && mobilePreview.h > 100, JSON.stringify(mobilePreview));
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check("mobile no horizontal overflow", overflow <= 1, `${overflow}px`);

await page.screenshot({ path: "shots/audit-scroll-mobile.png" });
console.log("errors:", errors.length ? errors : "none");
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `\n${failed} check(s) failed` : "\nall scroll checks passed");
await browser.close();
process.exitCode = failed || errors.length ? 1 : 0;
