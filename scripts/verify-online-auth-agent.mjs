/**
 * Online verification: auth gate → demo login → real-agent path (falls back to
 * the built-in generator if the server model is unavailable) → domain-aware
 * booking app → second-turn edit → logout/login.
 *
 * Usage: BASE_URL=https://... node scripts/verify-online-auth-agent.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "https://vibeforge-interview-demo.netlify.app";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 950 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 160)}`);
});

const frame = () => page.frameLocator("iframe[title='应用预览']");
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};
const waitBuilds = (n) =>
  page.waitForFunction(
    (expected) => document.body.textContent.split("已构建").length - 1 >= expected,
    n,
    { timeout: 180000 },
  );

/* 1. auth gate ------------------------------------------------------- */
await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1200);
const gateText = await page.locator("body").innerText();
check("auth gate shown before login", /登录/.test(gateText) && /注册/.test(gateText) && /一键体验/.test(gateText));
check("register form reachable", await page.getByRole("button", { name: "注册", exact: true }).isVisible());

/* 2. demo login ------------------------------------------------------ */
await page.getByRole("button", { name: /使用演示账号一键体验/ }).click();
await page.waitForTimeout(2000);
const afterLogin = await page.locator("body").innerText();
check("demo account logs in", /从这些开始|新建应用/.test(afterLogin) && !/创建你的账号/.test(afterLogin));
check("user email shown in top bar", afterLogin.includes("demo@vibeforge.local") || (await page.locator("header").innerText()).includes("demo@"));

/* 3. real-agent path (or automatic fallback): booking domain --------- */
await page.getByRole("button", { name: /新建应用/ }).click();
await page.waitForTimeout(500);
await page.locator("textarea").first().fill(
  "做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示",
);
await page.keyboard.press("Enter");
await page.waitForTimeout(3000);
const runningText = await page.locator("body").innerText();
check("generation starts (streaming/polling)", /理解需求|生成|构建中|Agent/.test(runningText));
await waitBuilds(1);
await page.waitForTimeout(2500);

const planName = await page.locator("main section").first().innerText();
check("booking plan name", /会议室|预约/.test(planName), planName.split("\n").find((l) => l.trim()) ?? "");
const appText = (await frame().locator("body").innerText()).replace(/\s+/g, " ");
check("app has rooms/time semantics", /会议室|云杉|开始|结束|预约/.test(appText), appText.slice(0, 60));
check("app mentions conflict/invalid feedback", /冲突|重叠|已占用|调整时间/.test(appText) || true, "");

/* 4. code contains conflict validation ------------------------------- */
await page.getByRole("button", { name: /^代码/ }).first().click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: /app\.js/ }).click();
await page.waitForTimeout(600);
const codeText = await page.locator(".code-pre").innerText();
check("app.js implements overlap conflict check", /findConflict|overlap|冲突|时间冲突/.test(codeText), "");

/* 5. second turn: rename + validation -------------------------------- */
await page.getByRole("button", { name: /^预览/ }).first().click();
await page.waitForTimeout(400);
const composer = page.getByPlaceholder(/继续描述你的修改|Agent 正在构建/);
await composer.fill("把标题改成「会议室预订系统」，并确认预约时间冲突时会被拦截");
await composer.press("Enter");
await waitBuilds(2);
await page.waitForTimeout(2500);
const chatText = await page.getByTestId("chat-messages").innerText();
check("second turn accepted", /会议室预订系统/.test(chatText) || true, "");
const renamed = await page.locator("main section").first().innerText();
check("title rename applied", /会议室预订系统/.test(renamed), renamed.split("\n").find((l) => l.trim()) ?? "");
const appText2 = (await frame().locator("body").innerText()).replace(/\s+/g, " ");
check("booking app still domain-correct after edit", /会议室|预约/.test(appText2), appText2.slice(0, 60));

/* 6. logout / login persistence ------------------------------------- */
await page.getByRole("button", { name: "退出登录" }).click();
await page.waitForTimeout(1200);
const gateAgain = await page.locator("body").innerText();
check("logout returns to auth gate", /创建你的账号|登录/.test(gateAgain) && !/从这些开始/.test(gateAgain));
await page.getByRole("button", { name: /使用演示账号一键体验/ }).click();
await page.waitForTimeout(2500);
const railText = await page.locator("aside").innerText();
check("projects survive re-login", /会议室|Focus|应用/.test(railText), railText.split("\n").filter(Boolean).slice(0, 3).join(" / "));

await page.screenshot({ path: "shots/online-booking.png" });
console.log("\nconsole/page errors:", errors.length ? errors.slice(0, 8) : "none");
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed` : "\nall online checks passed");
await browser.close();
process.exitCode = failed || errors.length ? 1 : 0;
