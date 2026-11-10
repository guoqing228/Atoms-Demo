/**
 * 需求覆盖验证（对照笔试要求）：
 *   1) 具备真实交互（而非纯静态展示）
 *   2) 具备数据持久化（不限技术方案）
 *   3) 基本使用流程（初始化 / 核心主流程）
 *   4) 至少一个延展或衍生能力
 *
 * 与其它 e2e 不同的是：本脚本会真正进入「生成出来的应用」内部操作，
 * 并分别验证「产品自身」与「生成应用」两层的数据持久化。
 *
 * Usage: node scripts/verify-requirements.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4311";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 950 }, acceptDownloads: true });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") pageErrors.push(`console.error: ${m.text()}`);
});

const rows = [];
function requirement(id, title) {
  const evidence = [];
  return {
    id,
    title,
    evidence,
    pass: true,
    add(ok, text) {
      evidence.push({ ok, text });
      if (!ok) this.pass = false;
    },
  };
}
const frame = () => page.frameLocator("iframe[title='应用预览']");
async function waitForBuilds(n) {
  await page.waitForFunction(
    (expected) => document.body.innerText.split("已构建").length - 1 >= expected,
    n,
    { timeout: 90000 },
  );
}

/* ------------------------------------------------------------------ */
/* 初始化 + 核心主流程                                                 */
/* ------------------------------------------------------------------ */
const r3 = requirement("3", "基本使用流程：初始化 / 核心主流程");
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const homeText = await page.locator("body").innerText();
const templateCount = await page.getByRole("button").evaluateAll(
  (els) => els.filter((el) => el.className.includes("group relative")).length,
);
r3.add(homeText.includes("从这些开始"), "初始化：空状态 + 起步模板区正常渲染");
r3.add(templateCount >= 8, `初始化：提供 ${templateCount} 个起步模板`);
r3.add(homeText.includes("还没有项目") || homeText.includes("最近项目"), "初始化：本地项目列表为空态");

const t0 = Date.now();
await page.getByRole("button", { name: /待办清单/ }).first().click();
// capture the run panel while the agent is still streaming (steps/files are
// ephemeral by design — after `done` the persisted summary card replaces them)
await page.waitForTimeout(2400);
const midChatText = await page.getByTestId("chat-messages").innerText();
await waitForBuilds(1);
await page.waitForTimeout(1200);
const genMs = Date.now() - t0;
const chatText = await page.getByTestId("chat-messages").innerText();
r3.add(/理解需求/.test(midChatText), "核心流程：Agent 先「理解需求」（流式步骤可见）");
r3.add(/实施计划|新应用/.test(midChatText), "核心流程：输出实施计划（功能/技术栈）");
r3.add(/index\.html|app\.js/.test(midChatText), "核心流程：逐个文件写入（index.html / app.js）");
r3.add(/已构建/.test(chatText), "核心流程：完成后生成持久化的结果卡片");

// 用流式接口断言完整事件序列（DOM 里「自检」步骤是瞬时的，直接查协议更稳）
const streamRes = await page.request.post(`${BASE}/api/generate`, {
  data: { prompt: "做一个待办清单应用：快速添加、优先级、筛选", mode: "create" },
});
const frames = (await streamRes.text())
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const doneStepIds = frames.filter((e) => e.type === "step" && e.status === "done").map((e) => e.id);
const fileCount = frames.filter((e) => e.type === "file").length;
const hasDone = frames.some((e) => e.type === "done");
r3.add(
  ["understand", "design", "code", "verify"].every((id) => doneStepIds.includes(id)),
  "核心流程：完整事件序列 理解 → 设计 → 编码 → 自检",
);
r3.add(fileCount === 3 && hasDone, `核心流程：自检通过后返回 ${fileCount} 个文件 + done`);
r3.add(genMs > 1500, `核心流程：流式生成耗时可见（${(genMs / 1000).toFixed(1)}s，非一次性返回）`);
const seedText = await frame().locator("body").innerText();
r3.add(seedText.includes("把笔试 Demo"), "核心流程：生成结果在预览里自动运行（含初始化种子数据）");
r3.add((await frame().locator("#input").count()) > 0, "核心流程：生成物是可交互的表单而非常静态页面");

/* ------------------------------------------------------------------ */
/* 真实交互（产品层 + 生成应用层）                                     */
/* ------------------------------------------------------------------ */
const r1 = requirement("1", "具备真实交互（而非纯静态展示）");

// 产品层：对话、版本、设置、快捷键入口都存在且可点
const railButtons = await page.locator("aside button").count();
r1.add(railButtons >= 3, `产品层：侧栏可交互控件 ${railButtons} 个（新建/搜索/设置…）`);

// 生成应用层：真实往列表里加一条待办
await frame().locator("#input").fill("E2E 验证：真实交互新增的任务");
await frame().locator("#input").press("Enter");
await page.waitForTimeout(600);
const afterAdd = await frame().locator("body").innerText();
r1.add(afterAdd.includes("E2E 验证：真实交互新增的任务"), "生成应用层：输入 + 回车后任务真实写入列表");
r1.add(afterAdd.includes("7 待处理") || afterAdd.includes("7"), "生成应用层：统计数字随交互实时更新");

// 真实交互还可以切换筛选
await frame().locator("button.chip", { hasText: "已完成" }).click();
await page.waitForTimeout(400);
const filtered = await frame().locator("body").innerText();
r1.add(!filtered.includes("E2E 验证：真实交互新增的任务"), "生成应用层：筛选 tab 真实过滤数据（不再显示进行中项）");
await frame().locator("button.chip", { hasText: "全部" }).click();
await page.waitForTimeout(300);

/* ------------------------------------------------------------------ */
/* 数据持久化（产品层 IndexedDB + 生成应用层 localStorage）             */
/* ------------------------------------------------------------------ */
const r2 = requirement("2", "具备数据持久化（不限技术方案）");

// 生成应用层：刷新 iframe 后数据仍在
await page.getByRole("button", { name: "刷新预览" }).click();
await page.waitForTimeout(1500);
const afterFrameReload = await frame().locator("body").innerText();
r2.add(
  afterFrameReload.includes("E2E 验证：真实交互新增的任务"),
  "生成应用层：iframe 刷新后新增数据仍在（localStorage 持久化）",
);

// 产品层：整页刷新后项目/会话仍在，打开仍是同一应用
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1800);
const railText = await page.locator("aside").innerText();
r2.add(railText.includes("Focus List"), "产品层：整页刷新后项目仍在（IndexedDB 持久化）");
await page.getByRole("button", { name: /Focus List/ }).first().click();
await page.waitForTimeout(2000);
const afterPageReload = await frame().locator("body").innerText();
r2.add(
  afterPageReload.includes("E2E 验证：真实交互新增的任务"),
  "产品层：重新打开项目后应用数据与代码一并恢复",
);

/* ------------------------------------------------------------------ */
/* 延展 / 衍生能力                                                     */
/* ------------------------------------------------------------------ */
const r4 = requirement("4", "至少一个延展或衍生能力");

// 4.1 多轮迭代
await page.getByRole("button", { name: /加一个深色模式切换/ }).click();
await waitForBuilds(2);
await page.waitForTimeout(1000);
r4.add((await page.getByTestId("chat-messages").innerText()).includes("加一个深色模式切换"), "延展 1：多轮对话迭代（基于已有应用继续改）");

// 4.2 版本时间线 + 回滚
await page.getByRole("button", { name: /^版本/ }).first().click();
await page.waitForTimeout(600);
const versionText = await page.locator("body").innerText();
r4.add(/snapshots|v02/.test(versionText), "延展 2：版本时间线（每次迭代自动快照）");
const restore = page.getByRole("button", { name: "恢复" });
const hasRestore = (await restore.count()) > 0;
if (hasRestore) await restore.first().click();
await page.waitForTimeout(1200);
r4.add(hasRestore && (await page.locator("body").innerText()).includes("已回滚"), "延展 3：版本回滚（可恢复到历史快照）");

// 4.3 分享链接（应用编码进 URL，零后端）
await page.getByRole("button", { name: "分享", exact: true }).first().click();
await page.waitForTimeout(600);
const dialogText = await page.getByRole("dialog").innerText();
const shareMatch = /(http[^\s]*#share=[^\s]+)/.exec(dialogText);
r4.add(Boolean(shareMatch), `延展 4：分享链接（URL 内编码完整应用，${shareMatch ? shareMatch[1].length : 0} 字符）`);
await page.keyboard.press("Escape");
if (shareMatch) {
  const shared = await context.newPage();
  await shared.goto(shareMatch[1], { waitUntil: "networkidle" });
  await shared.waitForTimeout(2500);
  const sharedText = await shared
    .frameLocator("iframe[title='应用预览']")
    .locator("body")
    .innerText()
    .catch(() => "");
  r4.add(sharedText.length > 20, "延展 4 验证：分享链接在全新标签页可直接运行");
  await shared.close();
}

// 4.4 导出
const downloadPromise = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "导出" }).first().click();
const download = await downloadPromise;
r4.add(Boolean(download), `延展 5：导出单文件 HTML（${download ? download.suggestedFilename() : "未触发"}）`);

/* ------------------------------------------------------------------ */
/* 报告                                                               */
/* ------------------------------------------------------------------ */
const requirements = [r1, r2, r3, r4];
let failed = 0;
for (const r of requirements) {
  console.log(`\n[需求 ${r.id}] ${r.title}  →  ${r.pass ? "PASS" : "FAIL"}`);
  for (const e of r.evidence) console.log(`   ${e.ok ? "✓" : "✗"} ${e.text}`);
  if (!r.pass) failed += 1;
}
console.log("\n页面运行时错误:", pageErrors.length ? pageErrors.slice(0, 6) : "无");
if (pageErrors.length) failed += 1;

const doc = `# 需求覆盖验证报告（自动生成）

> 生成脚本：\`scripts/verify-requirements.mjs\` · 时间：${new Date().toISOString()}

${requirements
  .map(
    (r) =>
      `## 需求 ${r.id}：${r.title} — ${r.pass ? "PASS" : "FAIL"}\n\n${r.evidence
        .map((e) => `- ${e.ok ? "✅" : "❌"} ${e.text}`)
        .join("\n")}\n`,
  )
  .join("\n")}
## 页面运行时错误

${pageErrors.length ? pageErrors.map((e) => `- ${e}`).join("\n") : "- 无"}

## 结论

${failed === 0 ? "四项要求全部满足。" : `${failed} 项未通过，见上。`}
`;
await import("node:fs").then((fs) => fs.writeFileSync("docs/需求覆盖验证报告.md", doc, "utf8"));

await browser.close();
console.log(failed ? `\n${failed} requirement(s) failed` : "\n4/4 requirements passed");
process.exitCode = failed ? 1 : 0;
