# Recipe 开发规范（Mock 生成器）

> 本文件是 VibeForge 中「Mock Agent 应用配方」的契约。每个 recipe 负责在**不调用任何 LLM**的前提下，
> 根据用户 prompt 生成一个**真正可运行、可交互、有持久化**的单页应用。
>
> **设计目标：精致产品感（Linear / Notion / Stripe 一档）。** 亮色为主、克制、精密、有呼吸感。
> 参考 todo.ts 的代码密度，但**不要**照抄它的视觉骨架 —— 每个应用要有自己的信息架构。

## 1. 文件位置与分工

```
src/lib/agent/recipes/<id>.ts      # 每个应用一个文件，默认导出 `Recipe`（文件已创建为 STUB，直接整体替换）
src/lib/agent/recipes/index.ts     # 注册表（已接好，不要改）
src/lib/agent/recipes/_kit.ts      # 契约与组装器（不要改）
```

**不要修改** `_kit.ts` / `index.ts` / `themes.ts` / 其它人的 recipe 文件；**不要**跑 `pnpm add` / 安装依赖。

## 2. 契约

```ts
import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

function build(ctx: RecipeContext): RecipeOutput {
  // ctx.theme: 主题调色板（bg/surface/text/muted/accent/accent2/border/radius/font/mode）
  // ctx.prompt: 用户原始 prompt
  // ctx.prev: 迭代时的上一版文件（Mock 模式忽略即可）
  return {
    name: "产品名",            // 2-4 词，例如 "Focus List" / "Kanban Studio"
    tagline: "一句话卖点",
    summary: "一段话说明做什么、关键交互是什么。",
    features: [               // 3-6 条，展示在设计卡里
      { icon: "zap", title: "快速录入", detail: "回车即添加" },
    ],
    body: `...`,              // <body> 内部 HTML
    css: `...`,               // 应用私有 CSS（共享 reset 与主题变量已注入）
    js: `...`,                // 应用 JS（会被包进 IIFE，严格模式）
  };
}

export const kanbanRecipe: Recipe = {
  id: "kanban",
  label: "看板",
  keywords: ["看板", "kanban", "拖拽", "列"],
  build,
};
export default kanbanRecipe;
```

注意：导出变量名必须与 STUB 文件中的一致（例如 `kanbanRecipe`、`game2048Recipe`）。

`_kit.ts` 会把输出组装成 3 个文件：`index.html` / `styles.css` / `app.js`。

## 3. 设计规范（重点：精致产品感）

1. **亮色优先**：`ctx.theme.mode` 通常为 `"light"`，但代码必须只通过 CSS 变量取色
   （`var(--bg) var(--surface) var(--text) var(--muted) var(--accent) var(--accent2) var(--border) var(--radius) var(--font)`），
   禁止硬编码任何颜色值（含 `#fff` / `rgb()`）。深色主题下也要能看。
2. **克制的视觉语言**：
   - 中性底色 + 一个强调色；不要高饱和渐变、霓虹色、大面积色块；
   - 描边 1px 半透明线条；圆角 8–12px；阴影极浅
     （`0 1px 2px rgba(0,0,0,.04), 0 12px 28px -20px rgba(0,0,0,.18)`）；
   - 强调色只用在：主操作、选中态、关键数字、链接。
3. **排版**：标题 `letter-spacing:-0.02em`、`font-weight:600`；正文 13–14px，行高 1.55–1.65；
   辅助文字 11–12px 用 `var(--muted)`；数字一律 `font-variant-numeric: tabular-nums`。
4. **留白与栅格**：外层容器 `max-width: 720–1040px`，`padding: 40–56px`（移动端 20px）；
   区块间距 20–32px。不要塞满屏幕。
5. **交互精度**：所有可点元素有 hover / active / focus-visible（`outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent)`）；
   过渡 120–180ms `ease`；不要弹跳、不要超过 200ms 的动画；尊重 `prefers-reduced-motion`。
6. **每个应用独有的信息架构**：至少满足其一 —— 看板列 / 时间线 / 日历 / 对话流 / 画布 / 表格 / 编辑器分栏 / 播放器 / 仪表盘。
   禁止 6 个应用都是「标题 + 卡片网格」。
7. **移动端 375px 可用**：不横向滚动，触屏可点（不要只靠 hover）。

## 4. 功能硬性要求（会被自动化校验）

1. **可运行**：`js` 只能是经典脚本（禁 `import/export`、顶层 `await`、`??=` 等需构建语法）；
   不依赖 CDN / 外部字体 / 外部图片；图标用内联 SVG。
2. **真实交互**：至少「新增 / 编辑 / 删除」中的两种，加一个状态切换（筛选、排序、拖拽、计时、游戏操作…）。
3. **数据持久化**：`localStorage`，key 形如 `"vf:<recipe-id>:v1"`；读写 `try/catch`。
4. **有数据模型**：`state` + `render()` 模式，禁止写死 DOM；**至少 6 条种子数据**，首次打开不空屏。
5. **无控制台报错**：先拿到 DOM 再绑事件（脚本在 body 末尾）。
6. **中文 UI**：文案具体、口语化，不用占位文本 / Lorem ipsum；不要残留 `TODO`、`console.log`。

## 5. 自检（提交前必须跑）

```bash
# 在项目根目录，dev server 已由 Lead 启动在 http://localhost:4311
node scripts/check-recipe.mjs "做一个看板应用，三列拖拽"
```

脚本会：调用生成接口 → 检查 3 个文件 & app.js 语法 → 在 Chromium 里渲染 → 检查
可见文本量 / 交互元素数 / 横向溢出 / 控制台错误，截图存到 `shots/recipes/<slug>.png`。
**要求每个你负责的 recipe 都 PASS**，然后才算完成。

## 6. 已有参考实现

- `src/lib/agent/recipes/todo.ts` —— 待办清单（增删改 / 拖拽 / 筛选 / 统计 / 持久化 / 6 条种子数据）。
