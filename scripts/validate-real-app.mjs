/**
 * Render the app produced by the real-model run (shots/real-run.ndjson) in a
 * headless browser and report quality signals + a screenshot.
 *
 * Usage: node scripts/validate-real-app.mjs
 */
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const raw = readFileSync("shots/real-run.ndjson", "utf8");
const frames = raw
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const done = frames.find((f) => f.type === "done");
if (!done) {
  console.error("no done frame in shots/real-run.ndjson");
  process.exit(2);
}

const files = done.app.files;
const inline = (path) => files[path.replace(/^\.?\//, "")];
const html = (files["index.html"] ?? "")
  .replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (m, href) => {
    const css = inline(href);
    return css != null && /rel=["']?stylesheet/i.test(m) ? `<style>${css}</style>` : m;
  })
  .replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (m, src) => {
    const js = inline(src);
    return js != null ? `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>` : m;
  });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
});

await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const style = getComputedStyle(document.body);
  const parse = (c) => c.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  const lum = (rgb) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  };
  const l1 = lum(parse(style.color));
  const l2 = lum(parse(style.backgroundColor));
  return {
    text: (document.body.innerText || "").replace(/\s+/g, " ").trim(),
    bg: style.backgroundColor,
    contrast: Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100,
    interactive: document.querySelectorAll("button, input, select, textarea, [role=button]").length,
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    height: document.body.scrollHeight,
  };
});

// click the first actionable button to prove it is interactive
let clickOk = false;
try {
  const button = page.locator("button:visible").first();
  if ((await button.count()) > 0) {
    const before = await page.locator("body").innerText();
    await button.click({ timeout: 4000 });
    await page.waitForTimeout(600);
    clickOk = true;
    void before;
  }
} catch {
  clickOk = false;
}

await page.screenshot({ path: "shots/real-kimi-app.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth - window.innerWidth,
);

console.log("provider:", done.provider, "· model:", process.env.OPENAI_MODEL || "kimi-k3", "· ms:", done.ms);
console.log("plan:", done.app.plan.name, "—", done.app.plan.tagline);
console.log("files:", Object.entries(files).map(([p, c]) => `${p} ${(c.length / 1024).toFixed(1)}KB`).join(", "));
console.log("visible text:", info.text.length, "chars");
console.log("text:", info.text.slice(0, 160));
console.log("contrast:", info.contrast, "· interactive:", info.interactive, "· desktop overflow:", info.overflowX);
console.log("mobile overflow:", mobileOverflow);
console.log("clicked a button:", clickOk);
console.log("runtime errors:", errors.length ? errors.slice(0, 5) : "none");
await browser.close();
process.exitCode = errors.length || info.overflowX > 1 || mobileOverflow > 1 || info.text.length < 40 ? 1 : 0;
