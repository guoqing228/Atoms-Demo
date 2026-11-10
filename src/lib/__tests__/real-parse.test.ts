import { describe, expect, it } from "vitest";
import { extractJsonObject, inspectApp, normalizeFiles, normalizePlan, parseAppJson } from "@/lib/agent/real";
import type { FileMap } from "@/lib/types";

describe("extractJsonObject", () => {
  it("pulls a balanced object out of prose and markdown fences", () => {
    const raw = 'Here is the app:\n```json\n{"plan":{"name":"A"},"files":{"index.html":"<p>x</p>"}}\n```\nDone.';
    const json = extractJsonObject(raw);

    expect(json).not.toBeNull();
    expect(JSON.parse(json as string).plan.name).toBe("A");
  });

  it("is string-aware so braces inside strings do not break balance", () => {
    expect(extractJsonObject('prefix {"a":"}{","b":1} suffix')).toBe('{"a":"}{","b":1}');
  });

  it("returns null when there is no object at all", () => {
    expect(extractJsonObject("no json here")).toBeNull();
  });
});

describe("parseAppJson", () => {
  it("parses valid fenced model output", () => {
    const parsed = parseAppJson('```json\n{"plan":{"name":"X"},"files":{"index.html":"<body></body>"}}\n```');
    expect(parsed?.plan).toBeTruthy();
    expect(parsed?.files).toBeTruthy();
  });

  it("returns null for garbage instead of throwing", () => {
    expect(parseAppJson("totally not json")).toBeNull();
    expect(parseAppJson("{broken json")).toBeNull();
  });
});

describe("normalizePlan", () => {
  it("fills safe defaults for a missing plan", () => {
    const plan = normalizePlan(undefined, "做一个待办清单");

    expect(plan.name).toBe("Generated App");
    expect(plan.summary).toBe("做一个待办清单");
    expect(plan.stack).toEqual(["HTML / CSS / JS", "localStorage"]);
    expect(plan.features).toHaveLength(1);
    expect(plan.features[0].detail).toBe("做一个待办清单");
  });

  it("keeps provided fields and caps the feature list at six", () => {
    const plan = normalizePlan(
      {
        name: "  Ledger  ",
        tagline: "记账",
        stack: ["HTML/CSS/JS"],
        features: Array.from({ length: 9 }, (_, i) => ({ title: `f${i}` })),
      },
      "记账",
    );

    expect(plan.name).toBe("Ledger");
    expect(plan.features).toHaveLength(6);
    expect(plan.stack).toEqual(["HTML/CSS/JS"]);
    expect(plan.features[0].icon).toBe("sparkles");
  });
});

describe("normalizeFiles", () => {
  it("rejects non-objects and non-string / blank contents", () => {
    expect(normalizeFiles(null)).toEqual({});
    expect(normalizeFiles("nope")).toEqual({});
    expect(normalizeFiles({ bad: 42, blank: "   " })).toEqual({});
  });

  it("adds the expected empty companion files when index.html exists", () => {
    const files = normalizeFiles({ "index.html": "<body>hi</body>" });

    expect(files["styles.css"]).toBe("");
    expect(files["app.js"]).toBe("");
    expect(files["index.html"]).toBe("<body>hi</body>");
  });

  it("keeps real files as-is", () => {
    const files = normalizeFiles({ "index.html": "<body></body>", "app.js": "var a = 1;" });
    expect(files["app.js"]).toBe("var a = 1;");
  });
});

describe("inspectApp", () => {
  const good: FileMap = {
    "index.html": '<html><body><link rel="stylesheet" href="styles.css" /><script src="app.js"></script></body></html>',
    "styles.css": "body { margin: 0; }",
    "app.js": "var value = 1;",
  };

  it("passes a well-formed classic-script app", () => {
    expect(inspectApp(good)).toEqual([]);
  });

  it("flags a missing body and missing references", () => {
    const problems = inspectApp({ "index.html": "<div>hi</div>" });
    expect(problems).toContain("HTML 缺少 body");
    expect(problems).toContain("HTML 未引用 styles.css");
    expect(problems).toContain("HTML 未引用 app.js");
  });

  it("flags module syntax and JavaScript syntax errors", () => {
    const moduleProblems = inspectApp({ ...good, "app.js": "import x from './x.js';" });
    expect(moduleProblems).toContain("app.js 含模块语法（应为经典脚本）");

    const syntaxProblems = inspectApp({ ...good, "app.js": "function {" });
    expect(syntaxProblems).toContain("app.js 语法错误");
  });
});
