// throwaway probe 2 — screenshot cost matrix
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });

async function measure(label, contextOpts, shotOpts = {}) {
  const context = await browser.newContext({ viewport: contextOpts.viewport, deviceScaleFactor: contextOpts.dsf ?? 1 });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  const times = [];
  for (let i = 0; i < 6; i++) {
    const t = Date.now();
    await page.screenshot(shotOpts);
    times.push(Date.now() - t);
  }
  const dims = await page.evaluate(() => {
    const c = document.createElement("canvas");
    return { iw: innerWidth, ih: innerHeight };
  });
  console.log(label, "dims", dims.iw + "x" + dims.ih, "times", times.join(","), "avg", Math.round(times.reduce((a, b) => a + b) / times.length));
  await context.close();
}

await measure("960x600 dsf1 default", { viewport: { width: 960, height: 600 } });
await measure("960x600 dsf1 animations-disable", { viewport: { width: 960, height: 600 } }, { animations: "disabled" });
await measure("1280x800 dsf1 default", { viewport: { width: 1280, height: 800 } });
await measure("1280x800 dsf1 jpeg", { viewport: { width: 1280, height: 800 } }, { type: "jpeg", quality: 70 });
await measure("1280x800 dsf0.75", { viewport: { width: 1280, height: 800 }, dsf: 0.75 });
await measure("1280x800 dsf0.5", { viewport: { width: 1280, height: 800 }, dsf: 0.5 });

// second browser launch with gpu flags
const browser2 = await chromium.launch({ channel: "msedge", headless: true, args: ["--use-angle=d3d11", "--enable-gpu"] });
{
  const context = await browser2.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  const times = [];
  for (let i = 0; i < 6; i++) {
    const t = Date.now();
    await page.screenshot();
    times.push(Date.now() - t);
  }
  console.log("GPU flags 1280x800 dsf1", "times", times.join(","), "avg", Math.round(times.reduce((a, b) => a + b) / times.length));
  await context.close();
}
await browser.close();
await browser2.close();
