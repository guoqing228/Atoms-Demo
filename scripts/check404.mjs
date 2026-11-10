import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1512, height: 950 } });
const bad = [];
page.on("response", (r) => {
  if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /待办清单/ }).first().click();
await page.getByText("已构建").first().waitFor({ timeout: 45000 });
await page.waitForTimeout(2500);
for (const tab of ["代码", "控制台", "版本", "预览"]) {
  await page.getByRole("button", { name: new RegExp("^" + tab) }).first().click();
  await page.waitForTimeout(700);
}
console.log("failed responses:", bad.length ? bad : "none");
await browser.close();
