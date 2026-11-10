/**
 * End-to-end flows against the running app:
 *  create → iterate → version restore → share link → export → reload persistence
 *
 * Usage: node scripts/e2e-flows.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 950 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
});

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

const frame = () => page.frameLocator("iframe[title='应用预览']");
const buildCount = async () => page.getByText("已构建").count();
async function waitForBuilds(n) {
  await page.waitForFunction(
    (expected) => document.body.innerText.split("已构建").length - 1 >= expected,
    n,
    { timeout: 90000 },
  );
}

/* 1. create ------------------------------------------------------------ */
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /待办清单/ }).first().click();
await waitForBuilds(1);
await page.waitForTimeout(1500);
check("create: preview renders", (await frame().locator("body").innerText()).length > 20);
check("create: project appears in sidebar", (await page.locator("aside").innerText()).includes("Focus List"));

/* 2. iterate ----------------------------------------------------------- */
await page.getByRole("button", { name: /加一个深色模式切换/ }).click();
await waitForBuilds(2);
await page.waitForTimeout(1200);
const userTurns = await page
  .getByTestId("chat-messages")
  .getByText("加一个深色模式切换", { exact: true })
  .count();
check("iterate: user message appended once", userTurns === 1, `found ${userTurns}`);
await page.getByRole("button", { name: /^版本/ }).first().click();
await page.waitForTimeout(700);
const versionPane = await page.locator("body").innerText();
check(
  "iterate: version snapshot added",
  /v02|2 snapshots/.test(versionPane) || (await page.getByRole("button", { name: "恢复" }).count()) > 0,
);

/* 3. version restore --------------------------------------------------- */
const restoreButtons = page.getByRole("button", { name: "恢复" });
const restoreCount = await restoreButtons.count();
if (restoreCount > 0) {
  await restoreButtons.first().click();
  await page.waitForTimeout(1500);
  check("restore: rolled back", (await page.locator("body").innerText()).includes("已回滚"));
} else {
  check("restore: rolled back", false, "no restore button");
}

/* 4. share link -------------------------------------------------------- */
await page.getByRole("button", { name: "分享", exact: true }).first().click();
await page.waitForTimeout(700);
const dialogText = await page.getByRole("dialog").innerText();
const match = /(http[^\s]*#share=[^\s]+)/.exec(dialogText);
check("share: dialog shows encoded url", Boolean(match), match ? `${match[1].length} chars` : "no url");
await page.keyboard.press("Escape");

const sharedUrl = match?.[1] ?? "";
if (sharedUrl) {
  const shared = await context.newPage();
  await shared.goto(sharedUrl, { waitUntil: "networkidle" });
  await shared.waitForTimeout(3200);
  const sharedFrame = shared.frameLocator("iframe[title='应用预览']");
  const sharedText = await sharedFrame.locator("body").innerText().catch(() => "");
  const importedBanner = (await shared.locator("body").innerText()).includes("已导入分享的应用");
  check(
    "share: link opens a runnable app",
    sharedText.length > 20 && importedBanner,
    sharedText.replace(/\s+/g, " ").slice(0, 40),
  );
  await shared.close();
}

/* 5. export ------------------------------------------------------------ */
const downloadPromise = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "导出" }).first().click();
const download = await downloadPromise;
check("export: html download triggered", Boolean(download), download ? download.suggestedFilename() : "no download");

/* 6. reload persistence ------------------------------------------------ */
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1800);
const railText = await page.locator("aside").innerText();
check("persist: project survives reload", railText.includes("Focus List"));
await page.getByRole("button", { name: /Focus List/ }).first().click();
await page.waitForTimeout(1800);
const restored = await page.frameLocator("iframe[title='应用预览']").locator("body").innerText().catch(() => "");
check("persist: preview restores from IndexedDB", restored.length > 20, restored.replace(/\s+/g, " ").slice(0, 40));

console.log("\nconsole/page errors:", errors.length ? errors.slice(0, 8) : "none");
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} flow(s) failed` : "\nall flows passed");
await browser.close();
process.exitCode = failed || errors.length ? 1 : 0;
