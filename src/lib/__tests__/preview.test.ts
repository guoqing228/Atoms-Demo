import { describe, expect, it } from "vitest";
import { buildPreviewDocument, buildStandaloneHtml, PREVIEW_SOURCE } from "@/lib/preview";
import type { FileMap } from "@/lib/types";

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <h1>Focus List</h1>
  <script src="app.js"></script>
</body>
</html>`;

const FILES: FileMap = {
  "index.html": HTML,
  "styles.css": "body { background: #f7f7f5; }",
  "app.js": "console.log('ready');",
};

describe("buildPreviewDocument", () => {
  it("inlines referenced local CSS and JS instead of leaving 404-able refs", () => {
    const doc = buildPreviewDocument(FILES);

    expect(doc).toContain('<style data-vf-file="styles.css">');
    expect(doc).toContain("body { background: #f7f7f5; }");
    expect(doc).toContain('<script data-vf-file="app.js">');
    expect(doc).toContain("console.log('ready');");
    expect(doc).not.toContain('href="styles.css"');
    expect(doc).not.toContain('src="app.js"');
  });

  it("injects the runtime bridge before user code runs", () => {
    const doc = buildPreviewDocument(FILES);

    expect(doc).toContain(PREVIEW_SOURCE);
    expect(doc).toContain("parent.postMessage");
    expect(doc.indexOf(PREVIEW_SOURCE)).toBeLessThan(doc.indexOf("<h1>Focus List</h1>"));
    expect(doc.indexOf(PREVIEW_SOURCE)).toBeGreaterThan(doc.indexOf("<head>"));
  });

  it("uses empty placeholder tags for files the agent has not written yet", () => {
    const partial: FileMap = { "index.html": HTML };
    const doc = buildPreviewDocument(partial);

    expect(doc).toContain('<style data-vf-pending="styles.css">');
    expect(doc).toContain('<script data-vf-pending="app.js"></script>');
    expect(doc).not.toContain('href="styles.css"');
    expect(doc).not.toContain('src="app.js"');
  });

  it("leaves external URLs untouched", () => {
    const external: FileMap = {
      "index.html": `<html><head><link rel="stylesheet" href="https://cdn.example.com/x.css" /></head><body><script src="https://cdn.example.com/x.js"></script></body></html>`,
    };
    const doc = buildPreviewDocument(external);

    expect(doc).toContain('href="https://cdn.example.com/x.css"');
    expect(doc).toContain('src="https://cdn.example.com/x.js"');
  });

  it("escapes closing script tags inside inlined JavaScript", () => {
    const files: FileMap = {
      "index.html": `<html><body><script src="app.js"></script></body></html>`,
      "app.js": "var tpl = '</script>';",
    };
    const doc = buildPreviewDocument(files);

    expect(doc).toContain("<\\/script");
    expect(doc).not.toContain("'</script>'");
  });

  it("prepends the bridge when the document has no <head>", () => {
    const files: FileMap = { "index.html": "<body><p>hi</p></body>" };
    const doc = buildPreviewDocument(files);

    expect(doc.startsWith("<script>")).toBe(true);
    expect(doc.indexOf(PREVIEW_SOURCE)).toBeLessThan(doc.indexOf("<body>"));
  });
});

describe("buildStandaloneHtml", () => {
  it("strips the preview runtime bridge from the exported document", () => {
    const standalone = buildStandaloneHtml(FILES);

    expect(standalone).not.toContain(PREVIEW_SOURCE);
    expect(standalone).not.toContain("parent.postMessage");
    expect(standalone).toContain("body { background: #f7f7f5; }");
    expect(standalone).toContain("console.log('ready');");
  });

  it("equals the preview document minus the bridge", () => {
    const preview = buildPreviewDocument(FILES);
    const standalone = buildStandaloneHtml(FILES);
    const start = preview.indexOf("<script>");
    const end = preview.indexOf("</script>", start) + "</script>".length;

    expect(start).toBeGreaterThan(-1);
    expect(standalone).toBe(preview.slice(0, start) + preview.slice(end));
    expect(standalone.length).toBeLessThan(preview.length);
  });
});
