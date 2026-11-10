import { describe, expect, it } from "vitest";
import { PALETTES, pickTheme, themeCssVars } from "@/lib/agent/themes";

describe("pickTheme", () => {
  it("matches dark-mode keywords", () => {
    const theme = pickTheme("做一个深色的夜间待办应用");
    expect(theme.mode).toBe("dark");
    expect(theme.name).toBe("深海夜色");
    expect(theme.bg).toBe("#101722");
  });

  it("matches music/neon keywords with the mono-font palette", () => {
    const theme = pickTheme("做一个赛博朋克风格的音乐播放器");
    expect(theme.name).toBe("午夜霓虹");
    expect(theme.mode).toBe("dark");
    expect(theme.font).toBe("mono");
  });

  it("matches light business keywords", () => {
    expect(pickTheme("做一个 SaaS 产品落地页").name).toBe("极简白");
    expect(pickTheme("做一个数据看板").name).toBe("海盐蓝");
  });

  it("defaults to the light minimal palette when nothing matches", () => {
    const theme = pickTheme("随便做点有趣的东西");
    expect(theme.name).toBe("极简白");
    expect(theme.mode).toBe("light");
  });

  it("is deterministic and never exposes the keyword lexicon", () => {
    const first = pickTheme("做一个记账应用");
    const second = pickTheme("做一个记账应用");
    expect(first).toEqual(second);
    expect(first).not.toHaveProperty("keywords");
  });

  it("keeps every palette well-formed", () => {
    for (const palette of PALETTES) {
      expect(palette.mode === "dark" || palette.mode === "light").toBe(true);
      expect(palette.keywords.length).toBeGreaterThan(0);
      expect(palette.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("themeCssVars", () => {
  it("emits the palette as CSS custom properties", () => {
    const css = themeCssVars(pickTheme("做一个深色应用"));
    expect(css).toContain(":root{");
    expect(css).toContain("--bg:#101722;");
    expect(css).toContain("--accent:#5ad1e6;");
    expect(css).toContain("--radius:12px;");
    expect(css).toContain("--font:");
  });
});
