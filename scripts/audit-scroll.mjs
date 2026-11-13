/**
 * Scroll audit (workspace + generated app). Logs in, generates a booking app,
 * optionally adds more turns so the chat panel has enough text, then checks:
 *  - which elements clip content without offering a scrollbar
 *  - whether the chat panel can actually scroll (scrollTop moves)
 *  - whether the generated app page scrolls inside the preview iframe
 *
 * Usage: BASE_URL=https://... TURNS=3 node scripts/audit-scroll.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "https://vibeforge-interview-demo.netlify.app";
const TURNS = Number(process.env.TURNS || 1);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const auditFn = () => {
  const results = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const cs = getComputedStyle(el);
    const overflowY = cs.overflowY;
    const scrollable = overflowY === "auto" || overflowY === "scroll";
    const clippedY = el.scrollHeight - el.clientHeight;
    if (clippedY > 4 && !scrollable && el.clientHeight > 0 && el.clientHeight < 2000) {
      results.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 70),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflowY,
        clipped: clippedY,
      });
    }
  }
  return results.sort((a, b) => b.clipped - a.clipped).slice(0, 10);
};

const waitBuilds = (n) =>
  page.waitForFunction(
    (expected) => document.body.textContent.split("已构建").length - 1 >= expected,
    n,
    { timeout: 180000 },
  );

async function generate(prompt, expectedBuilds) {
  const input = page.locator("textarea").last();
  await input.fill(prompt);
  await input.press("Enter");
  await waitBuilds(expectedBuilds);
  await page.waitForTimeout(1800);
}

await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1200);
if (await page.getByRole("button", { name: /使用演示账号一键体验/ }).count()) {
  await page.getByRole("button", { name: /使用演示账号一键体验/ }).click();
  await page.waitForTimeout(1800);
}
if (await page.getByRole("button", { name: /新建应用/ }).count()) {
  await page.getByRole("button", { name: /新建应用/ }).click();
  await page.waitForTimeout(400);
}

await generate("做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示", 1);
const extra = [
  "给当天预约列表加一个按会议室筛选的搜索框，并显示每间会议室的可用时段数量",
  "把标题改成「会议室预订系统」，并在预约表单里加一个「参加人数」字段并校验不超过会议室容量",
];
for (let i = 0; i < Math.max(0, TURNS - 1); i += 1) {
  await generate(extra[i % extra.length], 2 + i);
}

console.log("=== workspace clipped-without-scroll ===");
console.log(JSON.stringify(await page.evaluate(auditFn), null, 1));

const chat = await page.evaluate(() => {
  const el = document.querySelector("[data-testid='chat-messages']");
  if (!el) return null;
  return {
    overflowY: getComputedStyle(el).overflowY,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    canScroll: el.scrollHeight - el.clientHeight > 4,
  };
});
console.log("=== chat panel ===", JSON.stringify(chat));
if (chat && chat.canScroll) {
  const moved = await page.evaluate(() => {
    const el = document.querySelector("[data-testid='chat-messages']");
    el.scrollTop = 0;
    const top = el.scrollTop;
    el.scrollTop = el.scrollHeight;
    return { top, bottom: el.scrollTop, max: el.scrollHeight - el.clientHeight };
  });
  console.log("chat scrollTop test:", JSON.stringify(moved));
}

const frameBody = page.frameLocator("iframe[title='应用预览']").locator("body");
const appMetrics = await frameBody.evaluate((body) => ({
  bodyScrollH: body.scrollHeight,
  bodyClientH: body.clientHeight,
  viewportH: window.innerHeight,
  docScrollH: document.documentElement.scrollHeight,
  htmlOverflow: getComputedStyle(document.documentElement).overflowY,
  bodyOverflow: getComputedStyle(body).overflowY,
}));
console.log("=== generated app page ===", JSON.stringify(appMetrics));
console.log("=== generated app clipped-without-scroll ===");
const appClipped = await frameBody.evaluate(() => {
  const results = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const cs = getComputedStyle(el);
    if ((cs.overflowY === "auto" || cs.overflowY === "scroll") === false) {
      const clipped = el.scrollHeight - el.clientHeight;
      if (clipped > 4 && el.clientHeight > 0 && el.clientHeight < 1600) {
        results.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 70), clipped, overflowY: cs.overflowY });
      }
    }
  }
  return results.sort((a, b) => b.clipped - a.clipped).slice(0, 8);
});
console.log(JSON.stringify(appClipped, null, 1));

await page.screenshot({ path: "shots/audit-scroll.png" });
console.log("errors:", errors.length ? errors : "none");
await browser.close();
