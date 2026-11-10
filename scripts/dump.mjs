import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1512, height: 950 } });
const logs = [];
page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

const res = await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
console.log("status:", res?.status());
console.log("title:", await page.title());
console.log("---- body text ----");
console.log((await page.locator("body").innerText()).slice(0, 1200));
console.log("---- console ----");
console.log(logs.slice(0, 12).join("\n"));
await browser.close();
