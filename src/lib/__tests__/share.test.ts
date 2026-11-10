import LZString from "lz-string";
import { afterEach, describe, expect, it, vi } from "vitest";
import { decodeProject, encodeProject, shareUrl, type SharePayload } from "@/lib/share";

/**
 * Share links are the only "backend" the app has, so the codec is load-bearing:
 * gzip is the primary format, lz-string the fallback/legacy one. The codec is
 * async, so every case awaits the real implementation.
 */

const APP_JS = `(function () {\n  "use strict";\n  var KEY = "vf:focus:v1";\n  var items = [{ title: "写周报", done: false }, { title: "读 20 页书", done: true }];\n  function load() { try { var raw = localStorage.getItem(KEY); if (raw) items = JSON.parse(raw); } catch (e) { items = []; } }\n  function render() {\n    var list = document.getElementById("list");\n    list.innerHTML = items.map(function (item) { return "<li>" + item.title + "</li>"; }).join("");\n  }\n  load(); render();\n})();\n`;

const STYLES_CSS = `:root{--bg:#f7f7f5;--surface:#fff;--text:#181816;--muted:#6b6b66;--accent:#2f5d50;--border:rgba(24,24,22,.09);--radius:8px}\nbody{margin:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,sans-serif}\n`.repeat(4);

const INDEX_HTML = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head><meta charset="UTF-8" /><link rel="stylesheet" href="styles.css" /></head>\n<body><main><h1>Focus List</h1><ul id="list"></ul></main><script src="app.js"></script></body>\n</html>\n`.repeat(2);

function makePayload(): SharePayload {
  return {
    v: 1,
    name: "Focus List",
    tagline: "一个不打扰人的待办清单",
    prompt: "做一个待办清单应用",
    plan: {
      name: "Focus List",
      tagline: "一个不打扰人的待办清单",
      summary: "本地优先的待办清单",
      stack: ["HTML/CSS/JS", "localStorage"],
      features: [{ icon: "zap", title: "快速添加", detail: "回车即添加" }],
    },
    theme: {
      name: "极简白",
      mode: "light",
      bg: "#f7f7f5",
      surface: "#ffffff",
      text: "#181816",
      muted: "#6b6b66",
      accent: "#2f5d50",
      accent2: "#a65a34",
      border: "rgba(24,24,22,0.09)",
      font: "sans",
      radius: 8,
    },
    entry: "index.html",
    files: { "index.html": INDEX_HTML, "styles.css": STYLES_CSS, "app.js": APP_JS },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("share codec", () => {
  it("round-trips a project through the gzip format", async () => {
    const payload = makePayload();
    const encoded = await encodeProject(payload);

    expect(encoded.startsWith("g1.")).toBe(true);
    await expect(decodeProject(encoded)).resolves.toEqual(payload);
  });

  it("gzip keeps the URL shorter than the raw JSON", async () => {
    const payload = makePayload();
    const encoded = await encodeProject(payload);
    expect(encoded.length).toBeLessThan(JSON.stringify(payload).length);
  });

  it("falls back to lz-string when CompressionStream is unavailable", async () => {
    const payload = makePayload();
    vi.stubGlobal("CompressionStream", undefined);

    const encoded = await encodeProject(payload);
    expect(encoded.startsWith("l1.")).toBe(true);
    expect(await decodeProject(encoded)).toEqual(payload);
  });

  it("still decodes legacy bare lz-string links", async () => {
    const payload = makePayload();
    // pre-gzip links had no format prefix
    const legacy = LZString.compressToEncodedURIComponent(JSON.stringify(payload));

    expect(legacy.startsWith("g1.")).toBe(false);
    expect(await decodeProject(legacy)).toEqual(payload);
  });

  it("returns null for corrupt, unsupported or malformed payloads", async () => {
    expect(await decodeProject("g1.not-valid-base64!!")).toBeNull();
    expect(await decodeProject("l1.definitely-not-lz")).toBeNull();
    expect(await decodeProject("")).toBeNull();

    const wrongVersion = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 2, files: {}, plan: {} }));
    expect(await decodeProject(wrongVersion)).toBeNull();
  });

  it("shareUrl returns a bare hash on the server", () => {
    expect(shareUrl("g1.abc")).toBe("#share=g1.abc");
  });
});
