import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });

async function auditHome(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const bad = [];
  page.on("response", (r) => {
    if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const data = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        font: cs.fontFamily.split(",")[0],
        size: cs.fontSize,
        color: cs.color,
        bg: cs.backgroundColor,
      };
    };
    const contrast = (() => {
      const parse = (c) => c.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
      const lum = ([r, g, b]) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const body = getComputedStyle(document.body);
      const l1 = lum(parse(body.color));
      const l2 = lum(parse(body.backgroundColor));
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return Math.round(ratio * 100) / 100;
    })();
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      bodyContrast: contrast,
      header: pick("header"),
      h1: pick("h1"),
      composer: pick("form"),
      card: pick("button.group"),
      cards: document.querySelectorAll("button.group").length,
      textSample: (document.body.innerText || "").slice(0, 80),
    };
  });
  console.log(`\n[home ${width}x${height}]`, JSON.stringify(data));
  if (bad.length) console.log("  failed requests:", bad.slice(0, 6));
  await page.screenshot({ path: `shots/qa-home-${width}.png` });
  await page.close();
}

async function auditWorkspace(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /待办清单/ }).first().click();
  await page.getByText("已构建").first().waitFor({ timeout: 45000 });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { w: Math.round(b.width), h: Math.round(b.height) };
    };
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      rail: r("aside"),
      chat: r("main > section"),
      preview: r("main > section:nth-of-type(2)"),
      iframe: r("iframe"),
      tabs: document.querySelectorAll("[role=tab]").length,
    };
  });
  console.log(`[workspace ${width}x${height}]`, JSON.stringify(data));
  await page.screenshot({ path: `shots/qa-work-${width}.png` });
  await page.close();
}

await auditHome(1512, 950);
await auditHome(390, 844);
await auditWorkspace(1512, 950);
await auditWorkspace(390, 844);
await browser.close();
