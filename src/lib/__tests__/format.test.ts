import { describe, expect, it } from "vitest";
import { bytes, clock, escapeHtml, fileSize, lineCount, timeAgo, truncate } from "@/lib/format";

const NOW = new Date("2026-06-15T12:00:00").getTime();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("timeAgo", () => {
  it("returns 刚刚 for anything under a minute (including future timestamps)", () => {
    expect(timeAgo(NOW, NOW)).toBe("刚刚");
    expect(timeAgo(NOW - 59_000, NOW)).toBe("刚刚");
    expect(timeAgo(NOW + 5 * MIN, NOW)).toBe("刚刚");
  });

  it("formats minutes, hours and days", () => {
    expect(timeAgo(NOW - 5 * MIN, NOW)).toBe("5 分钟前");
    expect(timeAgo(NOW - 59 * MIN, NOW)).toBe("59 分钟前");
    expect(timeAgo(NOW - 3 * HOUR, NOW)).toBe("3 小时前");
    expect(timeAgo(NOW - 2 * DAY, NOW)).toBe("2 天前");
  });

  it("falls back to an absolute date after 30 days", () => {
    expect(timeAgo(NOW - 45 * DAY, NOW)).toBe("5 月 1 日");
  });
});

describe("bytes", () => {
  it("picks B / KB / MB units", () => {
    expect(bytes(0)).toBe("0 B");
    expect(bytes(1023)).toBe("1023 B");
    expect(bytes(2048)).toBe("2.0 KB");
    expect(bytes(3 * 1024 * 1024)).toBe("3.0 MB");
  });
});

describe("lineCount", () => {
  it("counts logical lines and treats empty input as zero", () => {
    expect(lineCount("")).toBe(0);
    expect(lineCount("a")).toBe(1);
    expect(lineCount("a\nb\nc")).toBe(3);
  });
});

describe("truncate", () => {
  it("collapses whitespace before measuring", () => {
    expect(truncate("  hello   world  ")).toBe("hello world");
  });

  it("adds an ellipsis only when over the limit", () => {
    expect(truncate("short", 10)).toBe("short");
    const out = truncate("123456789012345", 10);
    expect(out).toBe("1234567890…");
    expect(out.length).toBe(11);
  });
});

describe("misc formatting", () => {
  it("fileSize counts UTF-8 bytes (Chinese chars are 3 bytes)", () => {
    expect(fileSize("abc")).toBe(3);
    expect(fileSize("你好")).toBe(6);
  });

  it("clock zero-pads hours/minutes/seconds", () => {
    const ts = new Date("2026-06-15T03:04:05").getTime();
    expect(clock(ts)).toBe("03:04:05");
  });

  it("escapeHtml escapes the four markup characters", () => {
    expect(escapeHtml('<a b="c">&')).toBe("&lt;a b=&quot;c&quot;&gt;&amp;");
  });
});
