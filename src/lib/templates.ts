export interface Template {
  id: string;
  title: string;
  desc: string;
  prompt: string;
  icon: string;
}

/**
 * Prompt starters. They are intentionally concrete — vague prompts are the
 * main cause of disappointing generation, so the product teaches the user how
 * to brief the agent.
 */
export const TEMPLATES: Template[] = [
  {
    id: "todo",
    title: "待办清单",
    desc: "优先级 · 拖拽 · 本地保存",
    prompt: "做一个待办清单应用：可以快速添加任务、设置优先级、拖拽排序、按状态筛选，数据保存在本地。",
    icon: "check",
  },
  {
    id: "kanban",
    title: "看板",
    desc: "多列拖拽 · 卡片编辑",
    prompt: "做一个看板应用：待办 / 进行中 / 已完成三列，卡片可以拖拽跨列，支持编辑和新建。",
    icon: "columns",
  },
  {
    id: "notes",
    title: "Markdown 笔记",
    desc: "实时预览 · 标签 · 搜索",
    prompt: "做一个 Markdown 笔记应用：左边写 Markdown，右边实时预览，支持标签分类和全文搜索。",
    icon: "note",
  },
  {
    id: "pomodoro",
    title: "番茄钟",
    desc: "计时 · 任务 · 统计",
    prompt: "做一个番茄钟应用：25 分钟专注计时，支持关联任务、专注记录统计和深色界面。",
    icon: "timer",
  },
  {
    id: "expense",
    title: "记账本",
    desc: "分类 · 图表 · 月度汇总",
    prompt: "做一个记账应用：记录收支、按分类统计、显示月度汇总和趋势图表。",
    icon: "wallet",
  },
  {
    id: "game2048",
    title: "2048",
    desc: "键盘 · 触屏 · 最高分",
    prompt: "做一个 2048 小游戏：键盘方向键和触屏滑动都能操作，显示得分和最高分。",
    icon: "game",
  },
  {
    id: "dashboard",
    title: "数据看板",
    desc: "KPI · 图表 · 表格",
    prompt: "做一个数据看板：顶部 KPI 指标卡，折线图和柱状图展示趋势，下面是可排序的数据表格。",
    icon: "chart",
  },
  {
    id: "landing",
    title: "产品落地页",
    desc: "Hero · 特性 · 定价",
    prompt: "做一个 SaaS 产品落地页：大标题 Hero、三个特性区块、定价方案和页脚。",
    icon: "rocket",
  },
];

/** Smart follow-up suggestions after a successful build. */
export const FOLLOW_UPS = [
  "加一个深色模式切换",
  "增加搜索和筛选",
  "改成卡片式布局",
  "补充空状态和加载状态",
];
