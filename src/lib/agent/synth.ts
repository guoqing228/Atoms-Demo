import type { FileMap, PlanFeature, Theme } from "../types";
import type { RecipeOutput } from "./recipes/_kit";

/**
 * Generic synthesizer — the fallback "I can build anything" path.
 *
 * It parses the prompt for an entity vocabulary (books, movies, recipes,
 * workouts, …) and emits a complete CRUD app for that entity: searchable list,
 * status filter, stats, add/edit modal, delete, localStorage persistence.
 *
 * A small "design language" layer adapts typography, shapes and decoration to
 * the mood of the prompt, so two different prompts do not look like the same
 * template with a different accent colour.
 */

type FieldType = "text" | "number" | "select" | "date" | "textarea";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface EntityDef {
  key: string;
  /** product name shown in the header */
  name: string;
  kicker: string;
  unit: string;
  icon: string;
  fields: FieldDef[];
  /** field used as the row title */
  titleKey: string;
  statusKey?: string;
  /** numeric field summed in the stats strip */
  statKey?: string;
  statLabel?: string;
  seed: Record<string, string | number>[];
}

interface DesignLanguage {
  name: string;
  headingFont: string;
  letterSpacing: string;
  cardRadius: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  kickerTransform: string;
  rowGap: string;
  bodyClass: string;
  decor: string;
}

const ENTITIES: EntityDef[] = [
  {
    key: "book",
    name: "书架",
    kicker: "READING SHELF",
    unit: "本书",
    icon: "book",
    fields: [
      { key: "title", label: "书名", type: "text", required: true, placeholder: "例如：置身事内" },
      { key: "author", label: "作者", type: "text", placeholder: "作者" },
      { key: "status", label: "状态", type: "select", options: ["想读", "在读", "已读完"] },
      { key: "rating", label: "评分", type: "number", placeholder: "1-5" },
      { key: "note", label: "短评", type: "textarea", placeholder: "读后感受…" },
    ],
    titleKey: "title",
    statusKey: "status",
    statKey: "rating",
    statLabel: "平均评分",
    seed: [
      { title: "置身事内", author: "兰小欢", status: "已读完", rating: 5, note: "把土地财政讲透了。" },
      { title: "芯片简史", author: "汪波", status: "在读", rating: 4, note: "读到光刻机部分。" },
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", status: "想读", rating: 5, note: "分布式必读。" },
      { title: "海风中失落的血色馈赠", author: "阿利斯泰尔·麦克劳德", status: "已读完", rating: 5, note: "短篇里的海风。" },
      { title: "人类简史", author: "尤瓦尔·赫拉利", status: "已读完", rating: 3, note: "观点密集，后半略散。" },
      { title: "万历十五年", author: "黄仁宇", status: "在读", rating: 4, note: "以史为镜。" },
    ],
  },
  {
    key: "movie",
    name: "片单",
    kicker: "WATCH LIST",
    unit: "部片",
    icon: "film",
    fields: [
      { key: "title", label: "片名", type: "text", required: true, placeholder: "例如：沙丘 2" },
      { key: "genre", label: "类型", type: "text", placeholder: "科幻 / 剧情" },
      { key: "status", label: "状态", type: "select", options: ["想看", "在看", "已看完"] },
      { key: "platform", label: "平台", type: "text", placeholder: "影院 / 流媒体" },
      { key: "rating", label: "评分", type: "number", placeholder: "1-10" },
      { key: "note", label: "短评", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "status",
    statKey: "rating",
    statLabel: "平均评分",
    seed: [
      { title: "沙丘 2", genre: "科幻", status: "已看完", platform: "影院", rating: 9, note: "视听天花板。" },
      { title: "奥本海默", genre: "传记", status: "已看完", platform: "影院", rating: 8, note: "三小时不闷。" },
      { title: "可怜的东西", genre: "奇幻", status: "想看", platform: "流媒体", rating: 0, note: "等资源。" },
      { title: "繁花", genre: "剧集", status: "在看", platform: "腾讯", rating: 8, note: "王家卫拍上海。" },
      { title: "驾驶我的车", genre: "剧情", status: "已看完", platform: "流媒体", rating: 9, note: "契诃夫式对话。" },
      { title: "年会不能停", genre: "喜剧", status: "已看完", platform: "影院", rating: 7, note: "职场爽片。" },
    ],
  },
  {
    key: "recipe",
    name: "菜谱本",
    kicker: "RECIPE BOX",
    unit: "道菜",
    icon: "chef",
    fields: [
      { key: "title", label: "菜名", type: "text", required: true, placeholder: "例如：番茄牛腩" },
      { key: "cuisine", label: "菜系", type: "text", placeholder: "川 / 粤 / 家常" },
      { key: "difficulty", label: "难度", type: "select", options: ["简单", "中等", "麻烦"] },
      { key: "minutes", label: "耗时(分钟)", type: "number", placeholder: "45" },
      { key: "ingredients", label: "主要食材", type: "textarea", placeholder: "牛腩、番茄、洋葱…" },
    ],
    titleKey: "title",
    statusKey: "difficulty",
    statKey: "minutes",
    statLabel: "平均耗时",
    seed: [
      { title: "番茄牛腩", cuisine: "家常", difficulty: "中等", minutes: 90, ingredients: "牛腩 500g、番茄 3 个、洋葱半个" },
      { title: "葱油拌面", cuisine: "本帮", difficulty: "简单", minutes: 20, ingredients: "细面、小葱一把、生抽、糖" },
      { title: "蒜香黄油虾", cuisine: "西式", difficulty: "简单", minutes: 15, ingredients: "大虾、黄油、蒜、柠檬" },
      { title: "酸辣土豆丝", cuisine: "川", difficulty: "简单", minutes: 15, ingredients: "土豆 2 个、干辣椒、醋" },
      { title: "冬阴功汤", cuisine: "泰式", difficulty: "麻烦", minutes: 40, ingredients: "虾、香茅、南姜、椰浆" },
      { title: "鸡蛋羹", cuisine: "家常", difficulty: "简单", minutes: 12, ingredients: "鸡蛋 2 个、温水、香油" },
    ],
  },
  {
    key: "workout",
    name: "训练日志",
    kicker: "TRAINING LOG",
    unit: "组训练",
    icon: "dumbbell",
    fields: [
      { key: "title", label: "动作", type: "text", required: true, placeholder: "例如：深蹲" },
      { key: "part", label: "部位", type: "select", options: ["腿", "背", "胸", "肩", "核心"] },
      { key: "sets", label: "组数", type: "number" },
      { key: "reps", label: "次数", type: "number" },
      { key: "weight", label: "重量(kg)", type: "number" },
      { key: "note", label: "感受", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "part",
    statKey: "sets",
    statLabel: "总组数",
    seed: [
      { title: "深蹲", part: "腿", sets: 4, reps: 8, weight: 60, note: "最后一组有点晃。" },
      { title: "卧推", part: "胸", sets: 4, reps: 10, weight: 40, note: "肩膀要沉。" },
      { title: "引体向上", part: "背", sets: 5, reps: 6, weight: 0, note: "宽握。" },
      { title: "硬拉", part: "腿", sets: 3, reps: 5, weight: 80, note: "腰别塌。" },
      { title: "平板支撑", part: "核心", sets: 3, reps: 1, weight: 0, note: "60 秒一组。" },
      { title: "哑铃肩推", part: "肩", sets: 4, reps: 12, weight: 12, note: "左侧弱一点。" },
    ],
  },
  {
    key: "trip",
    name: "行囊",
    kicker: "TRIP PLANNER",
    unit: "个行程",
    icon: "plane",
    fields: [
      { key: "title", label: "目的地", type: "text", required: true, placeholder: "例如：京都" },
      { key: "date", label: "出发日期", type: "date" },
      { key: "days", label: "天数", type: "number" },
      { key: "budget", label: "预算(元)", type: "number" },
      { key: "status", label: "状态", type: "select", options: ["计划中", "已预订", "已完成"] },
      { key: "note", label: "备忘", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "status",
    statKey: "budget",
    statLabel: "总预算",
    seed: [
      { title: "京都", date: "2026-03-28", days: 5, budget: 8000, status: "已预订", note: "樱花季，早订。" },
      { title: "泉州", date: "2026-01-10", days: 3, budget: 3000, status: "计划中", note: "吃面线糊。" },
      { title: "伊犁", date: "2026-06-15", days: 8, budget: 15000, status: "计划中", note: "自驾需要租车。" },
      { title: "清迈", date: "2025-11-02", days: 6, budget: 9000, status: "已完成", note: "雨季尾巴。" },
      { title: "杭州", date: "2026-04-04", days: 2, budget: 1500, status: "已预订", note: "看展。" },
      { title: "东京", date: "2026-05-20", days: 6, budget: 12000, status: "计划中", note: "签证先办。" },
    ],
  },
  {
    key: "crm",
    name: "客户台",
    kicker: "PIPELINE",
    unit: "个客户",
    icon: "users",
    fields: [
      { key: "title", label: "公司", type: "text", required: true, placeholder: "例如：深维智能" },
      { key: "contact", label: "联系人", type: "text" },
      { key: "stage", label: "阶段", type: "select", options: ["线索", "沟通中", "提案", "已签约"] },
      { key: "amount", label: "金额(万元)", type: "number" },
      { key: "note", label: "跟进记录", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "stage",
    statKey: "amount",
    statLabel: "总金额",
    seed: [
      { title: "深维智能", contact: "王总", stage: "提案", amount: 45, note: "下周三过方案。" },
      { title: "星野科技", contact: "李工", stage: "沟通中", amount: 12, note: "关注数据合规。" },
      { title: "澄明资本", contact: "陈经理", stage: "已签约", amount: 80, note: "二期一月启动。" },
      { title: "青柚教育", contact: "周老师", stage: "线索", amount: 6, note: "展会认识。" },
      { title: "和风制造", contact: "赵厂长", stage: "已签约", amount: 30, note: "需要驻场支持。" },
      { title: "拾光影像", contact: "孙制片", stage: "沟通中", amount: 18, note: "预算有限。" },
    ],
  },
  {
    key: "inventory",
    name: "库存表",
    kicker: "INVENTORY",
    unit: "个 SKU",
    icon: "box",
    fields: [
      { key: "title", label: "品名", type: "text", required: true, placeholder: "例如：A4 打印纸" },
      { key: "sku", label: "SKU", type: "text" },
      { key: "qty", label: "数量", type: "number" },
      { key: "price", label: "单价(元)", type: "number" },
      { key: "status", label: "状态", type: "select", options: ["充足", "偏低", "缺货"] },
    ],
    titleKey: "title",
    statusKey: "status",
    statKey: "qty",
    statLabel: "总库存",
    seed: [
      { title: "A4 打印纸", sku: "PAP-A4", qty: 120, price: 24, status: "充足" },
      { title: "订书钉", sku: "STP-24", qty: 8, price: 3, status: "偏低" },
      { title: "快递面单", sku: "LBL-100", qty: 0, price: 0.4, status: "缺货" },
      { title: "打包胶带", sku: "TPE-48", qty: 36, price: 6, status: "充足" },
      { title: "气泡膜", sku: "BUB-50", qty: 4, price: 18, status: "偏低" },
      { title: "记号笔", sku: "MRK-BLK", qty: 60, price: 2, status: "充足" },
    ],
  },
  {
    key: "course",
    name: "学习计划",
    kicker: "LEARNING PLAN",
    unit: "门课",
    icon: "graduation",
    fields: [
      { key: "title", label: "课程", type: "text", required: true, placeholder: "例如：CS224N" },
      { key: "platform", label: "平台", type: "text" },
      { key: "progress", label: "进度(%)", type: "number" },
      { key: "status", label: "状态", type: "select", options: ["未开始", "进行中", "已完成"] },
      { key: "note", label: "笔记", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "status",
    statKey: "progress",
    statLabel: "平均进度",
    seed: [
      { title: "CS224N NLP", platform: "Stanford", progress: 45, status: "进行中", note: "看完 attention 部分。" },
      { title: "Designing Data-Intensive Applications", platform: "书", progress: 30, status: "进行中", note: "第 5 章。" },
      { title: "Figma 进阶", platform: "B 站", progress: 100, status: "已完成", note: "组件化讲得好。" },
      { title: "线性代数", platform: "MIT OCW", progress: 0, status: "未开始", note: "周末开始。" },
      { title: "Rust 程序设计", platform: "官方书", progress: 15, status: "进行中", note: "所有权再读一遍。" },
      { title: "英语听力 30 天", platform: "自定", progress: 60, status: "进行中", note: "每天 20 分钟。" },
    ],
  },
  {
    key: "idea",
    name: "灵感池",
    kicker: "IDEA POOL",
    unit: "条灵感",
    icon: "bulb",
    fields: [
      { key: "title", label: "标题", type: "text", required: true, placeholder: "一句话说清这个点子" },
      { key: "tag", label: "标签", type: "text", placeholder: "产品 / 写作 / 设计" },
      { key: "priority", label: "优先级", type: "select", options: ["高", "中", "低"] },
      { key: "note", label: "展开", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "priority",
    seed: [
      { title: "给命令行加一个「后悔药」", tag: "产品", priority: "中", note: "任何破坏性操作前自动快照。" },
      { title: "写作时用语音先讲一遍", tag: "写作", priority: "高", note: "口述比打字快。" },
      { title: "做一个只记录开心事的 App", tag: "产品", priority: "低", note: "每天三件小事。" },
      { title: "把读书笔记做成卡片墙", tag: "设计", priority: "中", note: "随机抽取复习。" },
      { title: "周末断网 4 小时实验", tag: "生活", priority: "高", note: "看看会发生什么。" },
      { title: "研究一下浏览器本地模型", tag: "技术", priority: "低", note: "WebGPU 跑小模型。" },
    ],
  },
  {
    key: "task",
    name: "事项",
    kicker: "TASKS",
    unit: "个事项",
    icon: "check",
    fields: [
      { key: "title", label: "事项", type: "text", required: true, placeholder: "要做什么" },
      { key: "project", label: "所属", type: "text" },
      { key: "priority", label: "优先级", type: "select", options: ["高", "中", "低"] },
      { key: "due", label: "截止日期", type: "date" },
      { key: "note", label: "备注", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "priority",
    seed: [
      { title: "整理季度复盘材料", project: "工作", priority: "高", due: "2026-11-14", note: "先拉数据。" },
      { title: "给爸妈打电话", project: "生活", priority: "中", due: "2026-11-11", note: "" },
      { title: "预约体检", project: "健康", priority: "高", due: "2026-11-20", note: "空腹。" },
      { title: "读完《芯片简史》", project: "阅读", priority: "低", due: "2026-11-30", note: "" },
      { title: "换季整理衣柜", project: "生活", priority: "低", due: "", note: "" },
      { title: "续费域名和证书", project: "工作", priority: "中", due: "2026-11-25", note: "" },
    ],
  },
  {
    key: "contact",
    name: "通讯录",
    kicker: "CONTACTS",
    unit: "位联系人",
    icon: "users",
    fields: [
      { key: "title", label: "姓名", type: "text", required: true, placeholder: "姓名" },
      { key: "phone", label: "电话", type: "text" },
      { key: "company", label: "公司", type: "text" },
      { key: "tag", label: "分组", type: "select", options: ["朋友", "同事", "客户", "家人"] },
      { key: "note", label: "备注", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "tag",
    seed: [
      { title: "林工", phone: "138****2210", company: "星野", tag: "同事", note: "后端主力。" },
      { title: "小满", phone: "139****8801", company: "", tag: "朋友", note: "爬山搭子。" },
      { title: "王总", phone: "137****4520", company: "深维", tag: "客户", note: "偏好邮件沟通。" },
      { title: "妈妈", phone: "136****1189", company: "", tag: "家人", note: "周末视频。" },
      { title: "陈经理", phone: "135****7732", company: "澄明资本", tag: "客户", note: "" },
      { title: "阿哲", phone: "188****6621", company: "自由职业", tag: "朋友", note: "摄影。" },
    ],
  },
  {
    key: "generic",
    name: "条目库",
    kicker: "COLLECTION",
    unit: "条记录",
    icon: "grid",
    fields: [
      { key: "title", label: "名称", type: "text", required: true, placeholder: "名称" },
      { key: "category", label: "分类", type: "text", placeholder: "分类" },
      { key: "status", label: "状态", type: "select", options: ["进行中", "已完成", "已归档"] },
      { key: "score", label: "数值", type: "number" },
      { key: "note", label: "备注", type: "textarea" },
    ],
    titleKey: "title",
    statusKey: "status",
    seed: [
      { title: "示例条目一", category: "默认分类", status: "进行中", score: 8, note: "" },
      { title: "示例条目二", category: "默认分类", status: "已完成", score: 6, note: "" },
      { title: "示例条目三", category: "默认分类", status: "已归档", score: 4, note: "" },
      { title: "示例条目四", category: "默认分类", status: "进行中", score: 9, note: "" },
      { title: "示例条目五", category: "默认分类", status: "已完成", score: 7, note: "" },
      { title: "示例条目六", category: "默认分类", status: "进行中", score: 5, note: "" },
    ],
  },
];

const ENTITY_KEYWORDS: { key: string; words: string[] }[] = [
  { key: "book", words: ["书", "阅读", "读书", "book", "reading", "书架", "书单"] },
  { key: "movie", words: ["电影", "追剧", "片单", "剧", "movie", "film", "影视"] },
  { key: "recipe", words: ["菜谱", "食谱", "做菜", "烹饪", "recipe", "菜", "food"] },
  { key: "workout", words: ["健身", "训练", "运动", "锻炼", "workout", "gym", "力量"] },
  { key: "trip", words: ["旅行", "行程", "旅游", "出游", "trip", "travel", "攻略"] },
  { key: "crm", words: ["客户", "销售", "crm", "商机", "线索", "签单"] },
  { key: "inventory", words: ["库存", "仓库", "进销存", "inventory", "物料", "sku"] },
  { key: "course", words: ["课程", "学习", "网课", "course", "learn", "教程"] },
  { key: "idea", words: ["灵感", "点子", "想法", "idea", "创意", "收藏"] },
  { key: "contact", words: ["联系人", "通讯录", "contact", "名片", "人脉"] },
  { key: "task", words: ["事项", "任务", "待办", "日程", "todo", "task"] },
];

function pickEntity(prompt: string): EntityDef {
  const p = prompt.toLowerCase();
  let best = ENTITIES[ENTITIES.length - 1];
  let bestScore = 0;
  for (const { key, words } of ENTITY_KEYWORDS) {
    let score = 0;
    for (const word of words) if (p.includes(word.toLowerCase())) score += word.length;
    if (score > bestScore) {
      bestScore = score;
      best = ENTITIES.find((e) => e.key === key) ?? best;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/*  Design languages                                                   */
/* ------------------------------------------------------------------ */

function pickDesign(prompt: string): DesignLanguage {
  const p = prompt.toLowerCase();
  if (/赛博|cyber|未来|科技|终端|暗黑|hack|极客/.test(p)) return TECHNICAL;
  if (/可爱|粉色|糖果|少女|软萌|cute|pink|温柔/.test(p)) return PLAYFUL;
  if (/复古|文艺|手账|温暖|纸|咖啡|日系|杂志/.test(p)) return EDITORIAL;
  return MINIMAL;
}

const TECHNICAL: DesignLanguage = {
  name: "精密仪表",
  headingFont: '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
  letterSpacing: "-0.015em",
  cardRadius: "6px",
  cardBg: "var(--surface)",
  cardBorder: "1px solid var(--border)",
  cardShadow: "0 1px 2px rgba(0,0,0,.03)",
  kickerTransform: "uppercase",
  rowGap: "8px",
  bodyClass: "design-technical",
  decor: "grid",
};

const PLAYFUL: DesignLanguage = {
  name: "软糖卡片",
  headingFont: 'ui-rounded, "PingFang SC", ui-sans-serif, system-ui',
  letterSpacing: "-0.02em",
  cardRadius: "14px",
  cardBg: "var(--surface)",
  cardBorder: "1px solid color-mix(in srgb, var(--accent) 14%, var(--border))",
  cardShadow: "0 1px 2px rgba(0,0,0,.03), 0 14px 30px -22px rgba(0,0,0,.16)",
  kickerTransform: "uppercase",
  rowGap: "14px",
  bodyClass: "design-playful",
  decor: "blobs",
};

const EDITORIAL: DesignLanguage = {
  name: "纸上编辑",
  headingFont: 'Georgia, "Songti SC", "Noto Serif SC", ui-serif, serif',
  letterSpacing: "-0.01em",
  cardRadius: "2px",
  cardBg: "var(--surface)",
  cardBorder: "1px solid color-mix(in srgb, var(--text) 14%, transparent)",
  cardShadow: "none",
  kickerTransform: "uppercase",
  rowGap: "0px",
  bodyClass: "design-editorial",
  decor: "rules",
};

const MINIMAL: DesignLanguage = {
  name: "极简秩序",
  headingFont: "ui-sans-serif, -apple-system, 'Segoe UI', 'PingFang SC', sans-serif",
  letterSpacing: "-0.03em",
  cardRadius: "12px",
  cardBg: "var(--surface)",
  cardBorder: "1px solid var(--border)",
  cardShadow: "none",
  kickerTransform: "uppercase",
  rowGap: "8px",
  bodyClass: "design-minimal",
  decor: "none",
};

const ICONS: Record<string, string> = {
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  chef: '<path d="M7 21h10M12 21v-6"/><path d="M9 15a4 4 0 1 1-2-7.4A4 4 0 0 1 12 3a4 4 0 0 1 5 4.6A4 4 0 0 1 15 15H9Z"/>',
  dumbbell: '<path d="M4 9v6M20 9v6M7 7v10M17 7v10M7 12h10"/>',
  plane: '<path d="M10.5 13.5 3 11V9l7.5 2L15 3h2l-2 8 6 2v2l-6 2 2 8h-2l-4.5-6.5L3 21v-2l7.5-2"/>',
  users: '<path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.2"/><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 5.2a3.2 3.2 0 0 1 0 5.6"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  graduation: '<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
};

function icon(key: string, size = 18): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[key] ?? ICONS.grid}</svg>`;
}

/* ------------------------------------------------------------------ */
/*  Build                                                              */
/* ------------------------------------------------------------------ */

export function synthApp(prompt: string, theme: Theme, _prev: FileMap | null): RecipeOutput {
  const entity = pickEntity(prompt);
  const design = pickDesign(prompt);
  const statusField = entity.fields.find((f) => f.key === entity.statusKey);
  const statuses = statusField?.options ?? [];

  const labels = entity.fields.map((f) => f.label).join("、");
  const features: PlanFeature[] = [
    {
      icon: "zap",
      title: "快速新增",
      detail: `一键弹窗录入${entity.unit}，${entity.fields.slice(0, 3).map((f) => f.label).join(" / ")} 一次填完`,
    },
    {
      icon: "filter",
      title: "搜索与筛选",
      detail: statuses.length ? `按状态（${statuses.join(" / ")}）筛选，支持关键词搜索` : "关键词即时搜索",
    },
    {
      icon: "database",
      title: "本地持久化",
      detail: "localStorage 自动保存，刷新 / 关闭浏览器都不丢数据",
    },
    {
      icon: "chart",
      title: "概览统计",
      detail: entity.statKey ? `顶部实时汇总总数与${entity.statLabel}` : "顶部实时汇总总数与状态分布",
    },
  ];

  return {
    name: entity.name,
    tagline: `${design.name}风格的${entity.name}，把${labels}放进一个可搜索、可筛选的视图里。`,
    summary: `一个${entity.name}应用：新增、编辑、删除${entity.unit}，按状态筛选并搜索关键词，数据保存在浏览器本地，刷新不丢。界面采用「${design.name}」设计语言。`,
    features,
    body: buildBody(entity, design),
    css: buildCss(entity, design),
    js: buildJs(entity, design),
  };
}

/* ------------------------------------------------------------------ */
/*  HTML                                                               */
/* ------------------------------------------------------------------ */

function buildBody(entity: EntityDef, design: DesignLanguage): string {
  const decor =
    design.decor === "grid"
      ? '<div class="decor decor-grid" aria-hidden="true"></div>'
      : design.decor === "blobs"
        ? '<div class="decor decor-blob decor-blob-a" aria-hidden="true"></div><div class="decor decor-blob decor-blob-b" aria-hidden="true"></div>'
        : "";
  return `
  ${decor}
  <div class="app ${design.bodyClass}">
    <header class="masthead">
      <div class="brand">
        <span class="brand-mark">${icon(entity.icon, 20)}</span>
        <div class="brand-text">
          <p class="kicker">${entity.kicker}</p>
          <h1>${entity.name}</h1>
        </div>
      </div>
      <div class="stats" id="stats"></div>
    </header>

    <section class="toolbar">
      <div class="filters" id="filters" role="tablist" aria-label="状态筛选"></div>
      <div class="tools">
        <label class="search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
          <input id="search" type="search" placeholder="搜索${entity.unit}…" aria-label="搜索" />
        </label>
        <button type="button" class="btn primary" id="add-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          新增${entity.unit.replace("个", "")}
        </button>
      </div>
    </section>

    <main>
      <div class="list-head" id="list-head"></div>
      <ul class="list" id="list" aria-live="polite"></ul>
      <div class="empty" id="empty" hidden>
        <p class="empty-title">这里还没有记录</p>
        <p class="empty-hint">点右上角「新增」加入第一条${entity.unit}。</p>
      </div>
    </main>

    <footer class="foot">
      <span id="foot-count"></span>
      <span>数据保存在这台设备的浏览器里</span>
    </footer>
  </div>

  <div class="modal" id="modal" hidden>
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal-head">
        <h2 id="modal-title">新增</h2>
        <button type="button" class="icon-btn" id="modal-close" aria-label="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <form id="form">
        <div class="fields" id="fields"></div>
        <footer class="modal-foot">
          <button type="button" class="btn ghost" id="cancel">取消</button>
          <button type="submit" class="btn primary">保存</button>
        </footer>
      </form>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ */
/*  CSS                                                                */
/* ------------------------------------------------------------------ */

function buildCss(entity: EntityDef, design: DesignLanguage): string {
  return `
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
.decor{position:fixed;pointer-events:none;z-index:0}
.decor-grid{inset:0;background-image:linear-gradient(color-mix(in srgb,var(--accent) 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 7%,transparent) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse at 50% 0%,#000 20%,transparent 72%)}
.decor-blob{width:320px;height:320px;border-radius:50%;filter:blur(70px);opacity:.4}
.decor-blob-a{top:-120px;right:-60px;background:color-mix(in srgb,var(--accent) 45%,transparent)}
.decor-blob-b{bottom:-140px;left:-80px;background:color-mix(in srgb,var(--accent2) 35%,transparent)}

.app{position:relative;z-index:1;max-width:${design.name === "纸上编辑" ? "880px" : "960px"};margin:0 auto;padding:44px 24px 72px}

.masthead{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px}
.brand{display:flex;align-items:center;gap:14px}
.brand-mark{width:44px;height:44px;display:grid;place-items:center;border-radius:calc(var(--radius) * .8);border:${design.cardBorder};background:${design.cardBg};color:var(--accent)}
.kicker{font-family:var(--font);font-size:10px;letter-spacing:.2em;${design.kickerTransform === "uppercase" ? "text-transform:uppercase;" : ""}color:color-mix(in srgb,var(--accent) 80%,var(--muted));margin-bottom:6px}
h1{font-family:${design.headingFont};font-size:clamp(26px,3.6vw,36px);line-height:1.1;letter-spacing:${design.letterSpacing};font-weight:600}
.stats{display:flex;gap:22px;flex-wrap:wrap}
.stat{display:flex;flex-direction:column;gap:2px}
.stat b{font-family:${design.headingFont};font-size:22px;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
.stat span{font-size:10.5px;color:var(--muted);letter-spacing:.02em}

.toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.filters{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-size:12.5px;color:var(--muted);padding:6px 12px;border-radius:calc(var(--radius) * .7);border:1px solid transparent;transition:all .15s}
.chip em{font-style:normal;font-size:10px;opacity:.65;margin-left:3px}
.chip:hover{color:var(--text);background:color-mix(in srgb,var(--surface) 70%,transparent)}
.chip.on{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 40%,transparent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.tools{display:flex;align-items:center;gap:10px}
.search{display:flex;align-items:center;gap:7px;background:color-mix(in srgb,var(--surface) 65%,transparent);border:1px solid var(--border);border-radius:calc(var(--radius) * .7);padding:0 10px;height:34px;color:var(--muted)}
.search input{background:transparent;border:none;outline:none;font-size:12.5px;color:var(--text);width:150px}
.search input::placeholder{color:color-mix(in srgb,var(--muted) 80%,transparent)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:12.5px;height:34px;padding:0 14px;border-radius:calc(var(--radius) * .7);transition:all .15s;white-space:nowrap}
.btn.primary{background:var(--accent);color:color-mix(in srgb,var(--bg) 88%,#000);font-weight:600}
.btn.primary:hover{filter:brightness(1.08)}
.btn.primary:active{transform:translateY(1px)}
.btn.ghost{color:var(--muted);border:1px solid var(--border)}
.btn.ghost:hover{color:var(--text);background:color-mix(in srgb,var(--surface) 70%,transparent)}

.list-head{display:grid;grid-template-columns:52px minmax(0,1.5fr) minmax(0,1fr) 92px 76px;gap:12px;padding:0 14px 8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);opacity:.65}
.list{display:flex;flex-direction:column;gap:${design.rowGap}}
.row{display:grid;grid-template-columns:52px minmax(0,1.5fr) minmax(0,1fr) 92px 76px;gap:12px;align-items:center;padding:13px 14px;background:${design.cardBg};border:${design.cardBorder};border-radius:${design.cardRadius};box-shadow:${design.cardShadow};transition:border-color .16s,transform .16s}
.row:hover{border-color:color-mix(in srgb,var(--accent) 40%,var(--border));transform:translateY(-1px)}
.row-idx{font-family:var(--font);font-size:11px;color:var(--muted);opacity:.6;font-variant-numeric:tabular-nums}
.row-main{min-width:0}
.row-title{font-size:14px;line-height:1.35;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row-sub{font-size:11px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row-meta{min-width:0;font-size:11.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.status{justify-self:start;font-size:11px;padding:4px 9px;border-radius:999px;border:1px solid;white-space:nowrap}
.acts{display:flex;gap:4px;justify-content:flex-end}
.icon-btn{width:26px;height:26px;display:grid;place-items:center;border-radius:6px;color:var(--muted);transition:all .15s}
.icon-btn:hover{background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--text)}
.icon-btn.del:hover{background:color-mix(in srgb,#ff6b6b 14%,transparent);color:#ff6b6b}

.empty{text-align:center;padding:56px 0}
.empty-title{font-size:14px;color:var(--text)}
.empty-hint{font-size:11.5px;color:var(--muted);margin-top:6px}
.foot{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:28px;padding-top:12px;border-top:1px solid var(--border);font-size:10.5px;color:var(--muted);opacity:.8;font-family:var(--font)}

.modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,#000 62%,transparent);backdrop-filter:blur(4px)}
.modal[hidden]{display:none}
.modal-card{width:min(520px,100%);max-height:calc(100vh - 40px);overflow:auto;background:color-mix(in srgb,var(--surface) 96%,#000);border:1px solid color-mix(in srgb,var(--accent) 22%,var(--border));border-radius:${design.cardRadius};box-shadow:0 40px 80px -30px rgba(0,0,0,.8);animation:pop .18s ease both}
@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--border)}
.modal-head h2{font-size:15px;font-weight:600;font-family:${design.headingFont};letter-spacing:${design.letterSpacing}}
.fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px}
.field{display:flex;flex-direction:column;gap:5px;min-width:0}
.field.wide{grid-column:1 / -1}
.field label{font-size:10.5px;letter-spacing:.06em;color:var(--muted)}
.field input,.field select,.field textarea{background:color-mix(in srgb,var(--bg) 70%,#000);border:1px solid var(--border);border-radius:calc(var(--radius) * .55);padding:8px 10px;font-size:12.5px;color:var(--text);outline:none;font-family:var(--font);width:100%}
.field textarea{resize:vertical;min-height:64px}
.field input:focus,.field select:focus,.field textarea:focus{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 12%,transparent)}
.modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 18px;border-top:1px solid var(--border)}

.design-technical .row{border-left:2px solid color-mix(in srgb,var(--accent) 30%,transparent)}
.design-technical h1{font-weight:500}
.design-playful .row{border-radius:20px}
.design-playful .row:hover{transform:translateY(-2px)}
.design-playful .brand-mark{border-radius:12px}
.design-editorial .list{gap:0;border-top:1px solid var(--border)}
.design-editorial .row{border:none;border-bottom:1px solid var(--border);border-radius:0;background:transparent;box-shadow:none;padding:16px 4px}
.design-editorial .row:hover{transform:none;background:color-mix(in srgb,var(--surface) 40%,transparent)}
.design-editorial .list-head{padding-left:4px;padding-right:4px}
.design-editorial .row-title{font-family:${design.headingFont}}
.design-minimal .row{box-shadow:none}

@media (max-width:720px){
  .app{padding:28px 16px 56px}
  .masthead{gap:16px}
  .toolbar{align-items:stretch}
  .tools{width:100%}
  .search{flex:1}
  .list-head{display:none}
  .row{grid-template-columns:28px minmax(0,1fr) 72px;gap:8px;padding:12px}
  .row-meta{display:none}
  .row-title{white-space:normal}
  .stats{gap:16px}
  .fields{grid-template-columns:1fr}
}`;
}

/* ------------------------------------------------------------------ */
/*  JS                                                                 */
/* ------------------------------------------------------------------ */

function buildJs(entity: EntityDef, _design: DesignLanguage): string {
  const config = {
    entity: {
      name: entity.name,
      unit: entity.unit,
      fields: entity.fields,
      titleKey: entity.titleKey,
      statusKey: entity.statusKey,
      statKey: entity.statKey,
      statLabel: entity.statLabel,
    },
    seed: entity.seed,
    key: `vf:${entity.key}:v1`,
  };

  return `
var CONFIG = ${JSON.stringify(config)};
var FIELDS = CONFIG.entity.fields;
var STATUS_KEY = CONFIG.entity.statusKey;
var STATUSES = [];
(function () {
  for (var i = 0; i < FIELDS.length; i++) {
    if (FIELDS[i].key === STATUS_KEY && FIELDS[i].options) STATUSES = FIELDS[i].options;
  }
})();

var state = { items: [], query: "", filter: "all", editingId: null };

function uid() { return Math.random().toString(36).slice(2, 10); }
function $(sel) { return document.querySelector(sel); }
function esc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function save() {
  try { localStorage.setItem(CONFIG.key, JSON.stringify(state.items)); } catch (e) {}
}
function load() {
  try {
    var raw = localStorage.getItem(CONFIG.key);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Object.prototype.toString.call(parsed) === "[object Array]") { state.items = parsed; return; }
    }
  } catch (e) {}
  state.items = CONFIG.seed.map(function (seedItem) {
    var copy = { id: uid(), createdAt: Date.now() };
    for (var k in seedItem) copy[k] = seedItem[k];
    return copy;
  });
  save();
}

function fieldByKey(key) {
  for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].key === key) return FIELDS[i];
  return null;
}
function statusIndex(item) {
  if (!STATUS_KEY) return -1;
  var field = fieldByKey(STATUS_KEY);
  if (!field || !field.options) return -1;
  return field.options.indexOf(item[STATUS_KEY]);
}
function statusTone(item) {
  var idx = statusIndex(item);
  var tones = ["var(--muted)", "var(--accent2)", "var(--accent)", "var(--text)"];
  return idx < 0 ? tones[0] : tones[Math.min(idx, tones.length - 1)];
}

function visibleItems() {
  var q = state.query.toLowerCase();
  return state.items.filter(function (item) {
    if (state.filter !== "all" && item[STATUS_KEY] !== state.filter) return false;
    if (!q) return true;
    for (var i = 0; i < FIELDS.length; i++) {
      var v = item[FIELDS[i].key];
      if (v != null && String(v).toLowerCase().indexOf(q) >= 0) return true;
    }
    return false;
  });
}

function renderFilters() {
  var box = $("#filters");
  box.innerHTML = "";
  if (!STATUSES.length) return;
  var all = document.createElement("button");
  all.type = "button";
  all.className = "chip" + (state.filter === "all" ? " on" : "");
  all.innerHTML = "全部 <em>" + state.items.length + "</em>";
  all.addEventListener("click", function () { state.filter = "all"; render(); });
  box.appendChild(all);
  STATUSES.forEach(function (status) {
    var count = state.items.filter(function (i) { return i[STATUS_KEY] === status; }).length;
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (state.filter === status ? " on" : "");
    chip.innerHTML = esc(status) + " <em>" + count + "</em>";
    chip.addEventListener("click", function () { state.filter = status; render(); });
    box.appendChild(chip);
  });
}

function renderStats() {
  var box = $("#stats");
  var total = state.items.length;
  var html = '<div class="stat"><b>' + total + "</b><span>总" + esc(CONFIG.entity.unit) + "</span></div>";
  if (STATUS_KEY && STATUSES.length) {
    var doneLike = STATUSES[STATUSES.length - 1];
    var done = state.items.filter(function (i) { return i[STATUS_KEY] === doneLike; }).length;
    html += '<div class="stat"><b>' + done + "</b><span>" + esc(doneLike) + "</span></div>";
  }
  if (CONFIG.entity.statKey) {
    var sum = 0, count = 0;
    state.items.forEach(function (i) {
      var v = Number(i[CONFIG.entity.statKey]);
      if (!isNaN(v)) { sum += v; count++; }
    });
    var value = count ? Math.round((sum / count) * 10) / 10 : 0;
    html += '<div class="stat"><b>' + value + "</b><span>" + esc(CONFIG.entity.statLabel || "合计") + "</span></div>";
  }
  box.innerHTML = html;
}

function subLine(item) {
  var parts = [];
  for (var i = 0; i < FIELDS.length; i++) {
    var f = FIELDS[i];
    if (f.key === CONFIG.entity.titleKey || f.key === STATUS_KEY || f.type === "textarea") continue;
    var v = item[f.key];
    if (v != null && String(v).trim() !== "") parts.push(f.label + " " + v);
    if (parts.length >= 2) break;
  }
  return parts.join(" · ");
}

function renderList() {
  var list = $("#list");
  var items = visibleItems();
  list.innerHTML = "";
  $("#empty").hidden = items.length > 0;
  var head = $("#list-head");
  if (items.length > 0) {
    var headCells = '<span>#</span><span>' + esc(fieldByKey(CONFIG.entity.titleKey) ? fieldByKey(CONFIG.entity.titleKey).label : "名称") + "</span><span>详情</span><span>状态</span><span style=\\"text-align:right\\">操作</span>";
    head.innerHTML = headCells;
    head.style.display = "";
  } else {
    head.innerHTML = "";
  }

  items.forEach(function (item, index) {
    var li = document.createElement("li");
    li.className = "row";

    var idx = document.createElement("span");
    idx.className = "row-idx";
    idx.textContent = String(index + 1).padStart(2, "0");

    var main = document.createElement("div");
    main.className = "row-main";
    var title = document.createElement("p");
    title.className = "row-title";
    title.textContent = String(item[CONFIG.entity.titleKey] || "未命名");
    var sub = document.createElement("p");
    sub.className = "row-sub";
    sub.textContent = subLine(item);
    main.appendChild(title);
    if (sub.textContent) main.appendChild(sub);

    var meta = document.createElement("div");
    meta.className = "row-meta";
    var noteField = null;
    for (var n = 0; n < FIELDS.length; n++) if (FIELDS[n].type === "textarea") noteField = FIELDS[n];
    meta.textContent = noteField && item[noteField.key] ? item[noteField.key] : "";

    var status = document.createElement("span");
    status.className = "status";
    if (STATUS_KEY && item[STATUS_KEY]) {
      status.textContent = String(item[STATUS_KEY]);
      status.style.color = statusTone(item);
      status.style.borderColor = "color-mix(in srgb," + statusTone(item) + " 35%, transparent)";
      status.style.background = "color-mix(in srgb," + statusTone(item) + " 10%, transparent)";
    } else {
      status.hidden = true;
    }

    var acts = document.createElement("div");
    acts.className = "acts";
    var edit = document.createElement("button");
    edit.type = "button";
    edit.className = "icon-btn";
    edit.title = "编辑";
    edit.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4L20 8l-4-4L4 16v4Z"/></svg>';
    edit.addEventListener("click", function () { openModal(item.id); });
    var del = document.createElement("button");
    del.type = "button";
    del.className = "icon-btn del";
    del.title = "删除";
    del.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
    del.addEventListener("click", function () {
      if (!confirm("确定删除「" + String(item[CONFIG.entity.titleKey] || "这条记录") + "」？")) return;
      state.items = state.items.filter(function (i) { return i.id !== item.id; });
      save(); render();
    });
    acts.appendChild(edit);
    acts.appendChild(del);

    li.appendChild(idx);
    li.appendChild(main);
    li.appendChild(meta);
    li.appendChild(status);
    li.appendChild(acts);
    list.appendChild(li);
  });

  $("#foot-count").textContent = "共 " + state.items.length + " " + CONFIG.entity.unit;
}

function buildFields(item) {
  var box = $("#fields");
  box.innerHTML = "";
  FIELDS.forEach(function (field) {
    var wrap = document.createElement("div");
    wrap.className = "field" + (field.type === "textarea" ? " wide" : "");
    var label = document.createElement("label");
    label.setAttribute("for", "f-" + field.key);
    label.textContent = field.label + (field.required ? " *" : "");
    var input;
    if (field.type === "select") {
      input = document.createElement("select");
      (field.options || []).forEach(function (option) {
        var opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        input.appendChild(opt);
      });
    } else if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.placeholder = field.placeholder || "";
    } else {
      input = document.createElement("input");
      input.type = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
      input.placeholder = field.placeholder || "";
    }
    input.id = "f-" + field.key;
    input.dataset.key = field.key;
    input.value = item && item[field.key] != null ? String(item[field.key]) : "";
    wrap.appendChild(label);
    wrap.appendChild(input);
    box.appendChild(wrap);
  });
}

function openModal(id) {
  state.editingId = id || null;
  var item = id ? state.items.filter(function (i) { return i.id === id; })[0] : null;
  $("#modal-title").textContent = item ? "编辑" + CONFIG.entity.unit.replace("个", "") : "新增" + CONFIG.entity.unit.replace("个", "");
  buildFields(item);
  var modal = $("#modal");
  modal.hidden = false;
  var first = modal.querySelector("input, select, textarea");
  if (first) first.focus();
}
function closeModal() {
  $("#modal").hidden = true;
  state.editingId = null;
}

function submitForm(e) {
  e.preventDefault();
  var data = {};
  var inputs = $("#fields").querySelectorAll("[data-key]");
  for (var i = 0; i < inputs.length; i++) {
    var el = inputs[i];
    var key = el.dataset.key;
    var field = fieldByKey(key);
    var raw = el.value.trim();
    if (field && field.required && !raw) {
      el.focus();
      el.style.borderColor = "color-mix(in srgb,#ff6b6b 60%,transparent)";
      setTimeout(function (node) { return function () { node.style.borderColor = ""; }; }(el), 1200);
      return;
    }
    data[key] = field && field.type === "number" ? (raw === "" ? "" : Number(raw)) : raw;
  }
  if (state.editingId) {
    state.items = state.items.map(function (i) {
      return i.id === state.editingId ? Object.assign({}, i, data) : i;
    });
  } else {
    state.items.unshift(Object.assign({ id: uid(), createdAt: Date.now() }, data));
  }
  save();
  closeModal();
  render();
}

function render() {
  renderFilters();
  renderStats();
  renderList();
}

$("#add-btn").addEventListener("click", function () { openModal(null); });
$("#modal-close").addEventListener("click", closeModal);
$("#cancel").addEventListener("click", closeModal);
$("#form").addEventListener("submit", submitForm);
$("#modal").addEventListener("click", function (e) { if (e.target === $("#modal")) closeModal(); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !$("#modal").hidden) closeModal();
  if (e.key.toLowerCase() === "n" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openModal(null); }
});
var searchEl = $("#search");
searchEl.addEventListener("input", function () { state.query = searchEl.value; renderList(); });

load();
render();
`;
}
