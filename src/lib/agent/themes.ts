import type { Theme } from "@/lib/types";

/**
 * Deterministic palette engine.
 *
 * The prompt is matched against a small keyword lexicon (Chinese first,
 * English fallback). No LLM required, so the mock agent produces a stable,
 * inspectable result — the same prompt always yields the same design.
 *
 * Direction: refined product surfaces with one restrained accent colour.
 * (Linear / Notion / Stripe rather than neon gradient dashboards.)
 */

interface Palette extends Theme {
  keywords: string[];
}

export const PALETTES: Palette[] = [
  {
    name: "晨雾纸感",
    mode: "light",
    bg: "#faf7f0",
    surface: "#ffffff",
    text: "#24211b",
    muted: "#6f685c",
    accent: "#a65a34",
    accent2: "#2e5e4c",
    border: "rgba(36,33,27,0.1)",
    font: "sans",
    radius: 10,
    keywords: ["温暖", "自然", "warm", "cozy", "治愈", "手账", "日记", "阅读", "书", "复古", "retro", "咖啡", "生活"],
  },
  {
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
    keywords: ["极简", "minimal", "简洁", "清爽", "商务", "business", "企业", "产品", "saas", "官网", "落地页", "landing", "crm", "客户"],
  },
  {
    name: "海盐蓝",
    mode: "light",
    bg: "#f4f7fa",
    surface: "#ffffff",
    text: "#1b2430",
    muted: "#64717f",
    accent: "#2b5f8a",
    accent2: "#b06f3c",
    border: "rgba(27,36,48,0.1)",
    font: "sans",
    radius: 10,
    keywords: ["数据看板", "看板", "分析", "dashboard", "报表", "图表", "效率工具", "cli", "开发者"],
  },
  {
    name: "森林呼吸",
    mode: "light",
    bg: "#f3f6f1",
    surface: "#ffffff",
    text: "#1f2a22",
    muted: "#67756b",
    accent: "#2f7a58",
    accent2: "#a8701c",
    border: "rgba(31,42,34,0.1)",
    font: "sans",
    radius: 12,
    keywords: ["绿色", "环保", "健康", "运动", "健身", "habit", "习惯", "锻炼", "forest", "green", "番茄", "专注"],
  },
  {
    name: "落日暖橙",
    mode: "light",
    bg: "#fdf6ee",
    surface: "#ffffff",
    text: "#2a211a",
    muted: "#7c6b5c",
    accent: "#c05621",
    accent2: "#2f5d50",
    border: "rgba(42,33,26,0.1)",
    font: "sans",
    radius: 10,
    keywords: ["橙", "日落", "sunset", "活力", "energetic", "旅行", "美食", "菜谱", "food", "记账", "预算"],
  },
  {
    name: "糖果缤纷",
    mode: "light",
    bg: "#fff8f9",
    surface: "#ffffff",
    text: "#2b1e24",
    muted: "#7f6b74",
    accent: "#c04e78",
    accent2: "#6f5b9e",
    border: "rgba(43,30,36,0.09)",
    font: "sans",
    radius: 14,
    keywords: ["糖果", "可爱", "candy", "粉色", "pink", "少女", "宠物", "儿童", "卡通", "fun", "quiz", "答题"],
  },
  {
    name: "深海夜色",
    mode: "dark",
    bg: "#101722",
    surface: "#18212f",
    text: "#e8edf5",
    muted: "#93a1b8",
    accent: "#5ad1e6",
    accent2: "#8b7cf6",
    border: "rgba(255,255,255,0.09)",
    font: "sans",
    radius: 12,
    keywords: ["深色", "暗黑", "夜间", "dark", "night", "科技", "终端", "黑客", "matrix"],
  },
  {
    name: "午夜霓虹",
    mode: "dark",
    bg: "#12101a",
    surface: "#1b1726",
    text: "#f1e9ff",
    muted: "#a89bc2",
    accent: "#c084fc",
    accent2: "#f472b6",
    border: "rgba(255,255,255,0.1)",
    font: "mono",
    radius: 8,
    keywords: ["赛博", "cyber", "霓虹", "neon", "未来", "futuristic", "游戏", "game", "音乐", "music", "2048", "贪吃蛇"],
  },
  {
    name: "墨色终端",
    mode: "dark",
    bg: "#0f1210",
    surface: "#171c18",
    text: "#dbe8d6",
    muted: "#8aa47c",
    accent: "#9ae34f",
    accent2: "#2fd0a0",
    border: "rgba(154,227,79,0.14)",
    font: "mono",
    radius: 6,
    keywords: ["终端", "命令行", "命令行工具", "cli", "shell", "vim"],
  },
];

/** refined neutral product surface is the safe default for arbitrary prompts */
const DEFAULT_PALETTE = PALETTES.find((p) => p.name === "极简白") ?? PALETTES[0];

export function pickTheme(prompt: string): Theme {
  const p = prompt.toLowerCase();
  let best = DEFAULT_PALETTE;
  let bestScore = 0;
  for (const palette of PALETTES) {
    let score = 0;
    for (const kw of palette.keywords) {
      if (p.includes(kw.toLowerCase())) score += kw.length > 1 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = palette;
    }
  }
  const { keywords: _kw, ...theme } = best;
  return theme;
}

/** Emit the palette as CSS custom properties for a generated single-file app. */
export function themeCssVars(theme: Theme): string {
  const fontStack =
    theme.font === "serif"
      ? `"Iowan Old Style", "Palatino Linotype", Georgia, "Songti SC", "Noto Serif SC", serif`
      : theme.font === "mono"
        ? `"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`
        : `ui-sans-serif, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`;
  return `:root{
  --bg:${theme.bg};
  --surface:${theme.surface};
  --text:${theme.text};
  --muted:${theme.muted};
  --accent:${theme.accent};
  --accent2:${theme.accent2};
  --border:${theme.border};
  --radius:${theme.radius}px;
  --font:${fontStack};
}`;
}
