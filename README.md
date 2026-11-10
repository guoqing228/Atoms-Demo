# VibeForge

> 说出你想要的应用，剩下的交给 Agent。
>
> 一个 Atoms 风格的 **AI 原生应用生成器**：自然语言 → 可运行、可交互、可回滚的网页应用。

![workspace](shots/01-home.png)

## 这是什么

VibeForge 复刻的是「AI Agent 驱动生成应用」的核心体验：

1. 用一句话描述你想要的应用（中文）；
2. Agent 流式工作：拆解需求 → 输出实施计划 → 逐个文件写出 `index.html / styles.css / app.js` → 自检；
3. 生成结果在**沙箱 iframe 里立刻运行**，可直接交互、可刷新、数据持久化；
4. 不满意就继续对话，每次迭代自动存档，可回滚、可分享、可导出。

不需要注册、不需要后端数据库、不依赖任何 CDN —— 应用代码完全离线可运行。

## 快速开始

```bash
pnpm install
pnpm dev          # http://localhost:4311
```

> 默认使用内置 **Mock Agent**（确定性生成器，无需 API Key，秒级返回）。
> 接入真实模型：右上角「设置」→ 选择 OpenAI 兼容 / Anthropic → 填入 Key（只保存在本地浏览器，随请求发给同源代理）。

## 功能

| 能力 | 说明 |
| --- | --- |
| 流式生成 | NDJSON 流式接口，逐帧渲染「思考 / 计划 / 写文件 / 自检」 |
| 实时预览 | 多文件项目内联成单文档，注入运行时桥后在沙箱 iframe 运行 |
| 多轮迭代 | 继续对话即可修改；Mock 模式下按「原始需求 + 追加要求」重新生成 |
| 版本时间线 | 每次生成自动快照，可回滚到任意历史版本 |
| 分享链接 | 整个应用压缩编码进 URL hash，打开即运行，无需服务器 |
| 导出 | 单文件 HTML / 项目 JSON |
| 运行时控制台 | 捕获生成应用的 `console` 与未捕获错误，便于定位问题 |
| 本地持久化 | 项目 / 会话 / 版本存 IndexedDB，刷新不丢 |
| 设备预览 | 桌面 / 平板 / 手机三种视口 |

## 生成内核

```
prompt ──► router（关键词路由）
             ├─► recipe ×13        # 手写的「精致产品感」应用配方
             └─► synthesizer       # 任意对象型需求的通用 CRUD 合成器
                     │
                     ├─ theme engine   # 关键词 → 调色板（亮色优先）
                     └─ design language# 极简 / 纸感 / 精密仪表 / 软糖卡片
                             ▼
                   3-file app（HTML/CSS/JS）──► SSE/NDJSON ──► 预览
```

- **recipe**：待办、看板、Markdown 笔记、番茄钟、记账、习惯打卡、答题、2048、数据看板、落地页、AI 聊天、计算器、音乐播放器；
- **synthesizer**：书单、追剧、菜谱、健身、旅行、客户、库存、课程、灵感、联系人…… 任意「XX 管理」需求；
- Mock 生成器是**确定性**的：同一 prompt 永远得到同一结果，便于测试；真实模型只替换 provider 层。

## 技术栈与取舍

- **Next.js 16 App Router + TypeScript + Tailwind v4**：一个仓库同时容纳 UI 与生成接口，Vercel 一键部署；
- **服务端流式生成**（`POST /api/generate`，NDJSON）：模型 Key 不进浏览器代码；逐帧推送让生成过程可感知；
- **无服务端数据库**：全部数据存浏览器 IndexedDB（Dexie）。避免登录与后端依赖，让「持久化」成为产品能力而非账号能力；
- **单文件内联预览**：生成的应用不是部署到独立域名，而是把 3 个文件内联进 `iframe srcdoc`；配合注入的运行时桥实现控制台捕获、错误捕获和存储降级；
- **分享 = URL 编码**：lz-string 压缩完整项目到 URL hash，别人打开链接即可运行，零后端；
- **Mock provider 与真实 provider 同构**：都是 `AsyncGenerator<AgentEvent>`，UI 只认事件流。

## 目录结构

```
src/
  app/
    page.tsx                 # 工作台入口
    api/generate/route.ts    # 流式生成接口（NDJSON）
    globals.css              # 设计令牌：paper & ink 亮色主题
  components/
    ui/                      # Button / Dialog / Tooltip / Logo 等基础件
    workspace/               # 顶栏、侧栏、对话、预览、代码、控制台、版本、设置
  lib/
    agent/
      mock.ts                # Mock Agent：路由 + 叙述 + 流式节拍 + 静态自检
      real.ts                # OpenAI 兼容 / Anthropic 流式接入 + 标签协议解析
      themes.ts              # prompt → 调色板
      recipes/               # 13 个应用配方（每个都是完整可运行应用）
      synth.ts               # 通用 CRUD 合成器
    preview.ts               # 多文件内联 + 运行时桥
    share.ts                 # 分享链接编解码
    db.ts                    # Dexie schema
scripts/
  check-recipe.mjs           # 单个 recipe 的自动化验收（生成 → 语法 → 渲染 → 截图）
  test-real-provider.mjs     # 用本地假 SSE 服务验证真实模型接入链路
  shots.mjs                  # 截图回归
```

## 测试

```bash
pnpm typecheck                         # TypeScript
node scripts/test-real-provider.mjs    # 真实模型接入链路（本地假 SSE，无需 Key）
node scripts/check-recipe.mjs --all    # 全部 13 个 recipe + 合成器验收（生成 → 语法 → 渲染 → 截图）
node scripts/e2e-flows.mjs             # 端到端主流程（生成/迭代/回滚/分享/导出/刷新持久化）
node scripts/shots.mjs                 # UI 截图回归（输出 shots/*.png）
node scripts/qa-ui.mjs                 # 布局/对比度/移动端审计
```

当前状态：`typecheck` ✅、recipe 全量 14/14 PASS ✅、主流程 E2E 10/10 PASS ✅、
真实模型两条协议链路 PASS ✅、控制台零报错 ✅。

## 已知限制

- **Mock 模式不是真的 LLM**：任意 prompt 会路由到最接近的 recipe 或通用合成器，语义理解有上限；
  真实模型模式（BYOK）走同一事件协议，质量由所选模型决定。
- **Mock 模式的多轮迭代是「整体重建」**，不是精准 diff 修改；真实模型模式下会把现有文件作为上下文做完整重写。
- 预览 iframe 使用 `allow-same-origin allow-scripts` 以便生成应用使用 `localStorage`；生成代码来自受信任的生成器，若接入真实模型建议改为独立域名沙箱。
- 长页面分享 URL 可能超过部分聊天工具的长度限制，此时用「导出 HTML」。

## Roadmap（继续投入的优先级）

1. **真实模型质量**（P0）：默认接入一个便宜快模型，配合「生成 → 运行时错误回喂 → 自动修复」闭环；
2. **沙箱独立域**（P0）：生成应用到独立 origin，彻底隔离；
3. **精准增量修改**（P1）：结构化 AST 级 patch，而不是整文件重写；
4. **部署与分享强化**（P1）：一键部署生成的静态站点到用户域名；
5. **协作**（P2）：项目导出/导入、多人实时预览。
