import { describe, expect, it } from "vitest";
import { collapseContext, diffLines, diffSummary, type DiffLine } from "@/lib/diff";

describe("diffLines", () => {
  it("marks unchanged, removed and added lines with 1-based line numbers", () => {
    const lines = diffLines("a\nb\nc", "a\nx\nc");

    expect(lines.map((l) => l.type)).toEqual(["same", "del", "add", "same"]);
    expect(lines[0]).toMatchObject({ type: "same", text: "a", oldLine: 1, newLine: 1 });
    expect(lines[1]).toMatchObject({ type: "del", text: "b", oldLine: 2 });
    expect(lines[2]).toMatchObject({ type: "add", text: "x", newLine: 2 });
    expect(lines[3]).toMatchObject({ type: "same", text: "c", oldLine: 3, newLine: 3 });
  });

  it("treats identical input as fully unchanged", () => {
    const lines = diffLines("one\ntwo\nthree", "one\ntwo\nthree");
    expect(lines).toHaveLength(3);
    expect(lines.every((l) => l.type === "same")).toBe(true);
  });

  it("appends additions at the end of the file", () => {
    const lines = diffLines("a", "a\nb\nc");
    expect(lines.map((l) => l.type)).toEqual(["same", "add", "add"]);
    expect(lines[1].newLine).toBe(2);
    expect(lines[2].newLine).toBe(3);
  });

  it("falls back to a whole-file replace for pathological input sizes", () => {
    const before = "line\n".repeat(2001);
    const after = "other\n".repeat(2001);
    const lines = diffLines(before, after);

    expect(lines.some((l) => l.type === "same")).toBe(false);
    expect(lines.filter((l) => l.type === "del")).toHaveLength(2002);
    expect(lines.filter((l) => l.type === "add")).toHaveLength(2002);
  });
});

describe("diffSummary", () => {
  it("counts added and removed lines", () => {
    const lines = diffLines("a\nb\nc", "a\nx\ny\nc");
    expect(diffSummary(lines)).toEqual({ added: 2, removed: 1 });
  });

  it("reports zeros for identical files", () => {
    expect(diffSummary(diffLines("same", "same"))).toEqual({ added: 0, removed: 0 });
  });
});

describe("collapseContext", () => {
  const same = (text: string): DiffLine => ({ type: "same", text });

  it("collapses long unchanged runs into a single marker", () => {
    const lines: DiffLine[] = [
      ...Array.from({ length: 10 }, (_, i) => same(`same-${i}`)),
      { type: "add", text: "new", newLine: 1 },
      ...Array.from({ length: 10 }, (_, i) => same(`tail-${i}`)),
    ];
    const collapsed = collapseContext(lines, 1);

    expect(collapsed).toHaveLength(5);
    expect(collapsed[0].text).toBe("⋯ 9 行未变");
    expect(collapsed[1].text).toBe("same-9");
    expect(collapsed[2].type).toBe("add");
    expect(collapsed[3].text).toBe("tail-0");
    expect(collapsed[4].text).toBe("⋯ 9 行未变");
  });

  it("keeps only changed lines with zero context", () => {
    const lines: DiffLine[] = [
      ...Array.from({ length: 3 }, (_, i) => same(`a-${i}`)),
      { type: "del", text: "gone", oldLine: 4 },
      ...Array.from({ length: 3 }, (_, i) => same(`b-${i}`)),
    ];
    const collapsed = collapseContext(lines, 0);

    expect(collapsed).toHaveLength(3);
    expect(collapsed[1].text).toBe("gone");
    expect(collapsed.filter((l) => l.text.includes("行未变"))).toHaveLength(2);
  });

  it("collapses an all-unchanged file into one marker", () => {
    const collapsed = collapseContext([same("a"), same("b"), same("c")]);
    expect(collapsed).toEqual([{ type: "same", text: "⋯ 3 行未变" }]);
  });
});
