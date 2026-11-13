# VibeForge

> 说出你想要的应用，剩下的交给 Agent。
>
> 一个 Atoms 风格的 **AI 原生应用生成器**：自然语言 → 可运行、可交互、可回滚的网页应用。
>
> 🌐 **在线体验**：https://vibeforge-interview-demo.netlify.app
> （线上默认真实模型 qwen3.8-flash，可切 qwen3.8-max-0902；**需先注册/登录**，可点「演示账号一键体验」，无需自备 Key）
>
> 📄 提交用简要说明（实现思路 / 完成度 / 扩展优先级）见 [`说明文档.md`](说明文档.md)。
>
> 📘 不会用？看 [`操作手册.md`](操作手册.md)（图文版，3 分钟上手：登录 → 生成 → 试玩 → 迭代 → 分享）。
>
> 🔐 仓库内所有 Key 均为空占位；真实 Key 只存在部署平台环境变量或本地 `.env.local`（已 gitignore）。

![workspace](shots/01-home.png)

![demo](shots/demo.gif)

## 这是什么

VibeForge 复刻的是「AI Agent 驱动生成应用」的核心体验：

1. 用一句话描述你想要的应用（中文）；
2. Agent 流式工作：拆解需求 → 输出实施计划 → 逐个文件写出 `index.html / styles.css / app.js` → 自检；
3. 生成结果在**沙箱 iframe 里立刻运行**，可直接交互、可刷新、数据持久化；
4. 不满意就继续对话，每次迭代自动存档，可回滚、可分享、可导出。

线上由**服务端真实模型**生成（Key 不进前端），账号登录后项目按账号隔离；
本地开发默认内置 **Mock Agent**，也可配置真实模型。不依赖任何 CDN —— 应用代码完全离线可运行。

## 快速开始

```bash
# 需要 Node 22+ / pnpm 10+
pnpm install      # 本目录自带 pnpm-workspace.yaml + pnpm-lock.yaml，完全自包含
pnpm dev          # http://localhost:4311（浏览器里需注册/登录，可一键演示账号）
pnpm build        # 生产构建（全功能服务器模式）
```

> 本地默认使用内置 **Mock Agent**（确定性生成器，无需 API Key，秒级返回）。
> 想用真实模型：把 `.env.example` 复制成 `.env.local`，填 `OPENAI_*`（Key 只留在本地，不会提交）；
> 线上由 Netlify 环境变量提供，访问者无需填 Key。
>
> 👉 第一次使用建议先看 **[操作手册.md](操作手册.md)**（图文步骤：登录 → 生成 → 试玩 → 迭代 → 代码/版本 → 分享导出）。

## 功能

| 能力 | 说明 |
| --- | --- |
| **账号体系** | 注册 / 登录 / 退出、PBKDF2 加盐密码哈希、服务端会话（Netlify Blobs）；项目按账号隔离，未登录不可进入工作台 |
| 流式生成 | NDJSON 流式接口，逐帧渲染「思考 / 计划 / 写文件 / 自检」 |
| 实时预览 | 多文件项目内联成单文档，注入运行时桥后在沙箱 iframe 运行 |
| 多轮迭代 | 继续对话即可修改；真实模型会带当前文件上下文整体重写，Mock 模式会响应改名/换主题等显式指令 |
| 版本时间线 | 每次生成自动快照，可回滚到任意历史版本，可**逐行 diff 对比**当前版本 |
| 分享链接 | 整个应用压缩编码进 URL hash，打开即运行，无需服务器 |
| 导出 | 单文件 HTML / 项目 JSON |
| 运行时控制台 | 捕获生成应用的 `console` 与未捕获错误，便于定位问题 |
| 本地持久化 | 项目 / 会话 / 版本存 IndexedDB，刷新不丢 |
| 设备预览 | 桌面 / 平板 / 手机三种视口；移动端「对话 / 预览」切换 |
| 生成控制 | 可随时**停止**生成；失败可**重试这一步** |
| **真实 Agent** | 服务端调用真实大模型（OpenAI 兼容 / 百炼 qwen3.8-flash · qwen3.8-max-0902 / Anthropic），结构化 JSON 输出；Netlify Background Function（15 分钟预算）+ 轮询进度；模型不可用时自动降级到内置生成器 |
| **领域生成** | 关键词命中领域配方（如「会议室预约」→ 时间段 + 冲突校验），而非通用条目库 |

## 生成内核

```
prompt ──► router（关键词路由）
             ├─► recipe ×14        # 手写的「精致产品感」应用配方（含会议室预约）
             └─► synthesizer       # 任意对象型需求的通用 CRUD 合成器
                     │
                     ├─ theme engine   # 关键词 → 调色板（亮色优先）
                     └─ design language# 极简 / 纸感 / 精密仪表 / 软糖卡片
                             ▼
                   3-file app（HTML/CSS/JS）──► SSE/NDJSON ──► 预览
```

- **recipe**：待办、看板、Markdown 笔记、番茄钟、记账、习惯打卡、答题、2048、数据看板、落地页、AI 聊天、计算器、音乐播放器；
- **synthesizer**：书单、追剧、菜谱、健身、旅行、客户、库存、课程、灵感、联系人…… 任意「XX 管理」需求；
- **Mock generation 是确定性的**：同一 prompt 永远得到同一结果，便于测试；真实模型只替换 provider 层。

### 真实 Agent 实测（百炼 · qwen3.8-flash，线上）

线上站点通过 Netlify Background Function 调用真实模型（Key 只存在服务端环境变量），浏览器侧轮询 Blobs 进度。

| 指标 | 结果 |
| --- | --- |
| 首轮生成（会议室预约，任意需求） | **77.9s**（prompt 未预设、模型自行设计领域；生成中持续推送心跳日志） |
| 二轮修改（改标题 + 加冲突校验） | **70.8s**，标题生效、领域逻辑保持 |
| 输出 | 3 文件 / 约 14 KB：`index.html` 2.0KB、`styles.css` 4.8KB、`app.js` 7.4KB |
| 领域正确性 | 生成「会议室 + 时间段 + 冲突校验」应用，代码含 `overlap/conflict` 校验逻辑（非内置配方） |
| 备选模型 | 设置面板可切换 `qwen3.8-max-0902`（更强，约 2 分钟）/ `qwen3.8-flash`（默认，约 1–1.5 分钟） |
| 降级 | 模型不可用（Key 失效/限流）时自动切到内置生成器并在对话中提示，保证演示不中断 |
| 截图 | `shots/real-agent-booking.png` |

复跑：`BASE_URL=https://vibeforge-interview-demo.netlify.app node scripts/verify-real-agent-online.mjs`
（或 `pnpm test:real`），会校验首轮/二轮均真实完成、非内置配方、含冲突校验。

## 技术栈与取舍

- **Next.js 16 App Router + TypeScript + Tailwind v4**：一个仓库同时容纳 UI 与生成接口，Vercel 一键部署；
- **服务端流式生成**（`POST /api/generate`，NDJSON）：模型 Key 不进浏览器代码；逐帧推送让生成过程可感知；
- **本地优先 + 轻量服务端**：项目/版本/会话存浏览器 IndexedDB（Dexie）；账号与会话存 Netlify Blobs（PBKDF2 哈希），不引入数据库；
- **单文件内联预览**：生成的应用不是部署到独立域名，而是把 3 个文件内联进 `iframe srcdoc`；配合注入的运行时桥实现控制台捕获、错误捕获和存储降级；
- **分享 = URL 编码**：gzip + base64url 压缩完整项目进 URL hash（比旧版 lz-string 小 ~33%，兼容旧链接），别人打开即可运行，零后端；
- **真实模型 = 结构化 JSON**：要求模型只输出一个 `{plan, files}` JSON 对象；对推理模型做参数降级重试（temperature/response_format/max_tokens 被拒时自动退让），并推送心跳日志避免长任务看起来卡死；
- **Mock provider 与真实 provider 同构**：都是 `AsyncGenerator<AgentEvent>`，UI 只认事件流。

## 目录结构

```
src/
  app/
    page.tsx                 # 工作台入口
    api/generate/route.ts    # 本地/服务器模式的流式生成接口（NDJSON）
    globals.css              # 设计令牌：paper & ink 亮色主题
  components/
    auth/auth-gate.tsx       # 登录/注册门禁（演示账号一键体验）
    ui/                      # Button / Dialog / Tooltip / Logo 等基础件
    workspace/               # 工作台组件
      workspace.tsx          #   编排：账号态 + 状态 + 布局
      run-state.ts           #   纯 reducer：Agent 事件 → RunView
      chat.tsx / preview.tsx / versions-pane.tsx / …
  lib/
    auth.ts                  # 注册/登录/登出/会话恢复（服务端优先，本地降级）
    agent/
      mock.ts                # Mock Agent：路由 + 叙述 + 静态自检（确定性基线）
      real.ts                # OpenAI 兼容 / Anthropic 流式接入（结构化 JSON）
      themes.ts              # prompt → 调色板
      recipes/               # 14 个领域配方（含 booking：时间段 + 冲突校验）
      synth.ts               # 通用 CRUD 合成器
    preview.ts               # 多文件内联 + 运行时桥
    share.ts                 # 分享链接编解码（gzip / lz-string / legacy）
    diff.ts                  # 版本逐行 diff
    workspace-store.ts       # 持久化：Project/Message/Version 事务
    workspace-io.ts          # 导出下载等浏览器 IO
    db.ts                    # Dexie schema（含本地开发用的 users 表）
    agent-client.ts          # 三种运行形态：服务端流 / 后台函数轮询 / 浏览器 Mock
netlify/functions/
  _lib.mjs                   # 共享：模型调用、JSON 解析、主题、鉴权哈希
  generate-background.mjs    # Background Function：真实模型生成（15 分钟预算）
  poll.mjs                   # 轮询任务进度（Netlify Blobs）
  auth.mjs                   # 注册/登录/登出/会话（Netlify Blobs）
scripts/
  build-static.mjs / bundle-functions.mjs   # 静态导出 / esbuild 函数打包
  check-recipe.mjs           # recipe 自动化验收（生成 → 语法 → 渲染 → 截图）
  e2e-flows.mjs              # 端到端主流程测试
  verify-requirements.mjs    # 笔试四项需求覆盖验证
  verify-real-agent-online.mjs # 线上真实模型双轮验收（首轮 + 改名/校验二轮）
  verify-scroll-fixes.mjs / audit-scroll.mjs # 滚动验收 / 裁切审计
  check-mobile.mjs           # 移动端对话/预览切换 + 溢出检查
  capture-docs-shots.mjs     # 文档截图（登录/生成/结果/代码/版本/设置/移动端）
  demo-gif.mjs               # 录制演示 GIF
shots/                       # 截图与 demo.gif
```

## 实现与评分项对照

| 评分项 | 实现位置 | 可验证方式（线上） |
| --- | --- | --- |
| **注册登录** | 未登录不可进入工作台；注册/登录/退出、邮箱唯一、PBKDF2 加盐、7 天会话、项目按账号隔离；`src/lib/auth.ts`、`src/components/auth/auth-gate.tsx`、`netlify/functions/auth.mjs` | 打开站点先见登录页；注册新账号后进入；退出再登录，项目仍在 |
| **Agent 交互** | 服务端真实模型（qwen3.8-flash 默认 / qwen3.8-max 可选）+ Background Function + 轮询进度；步骤/计划/写文件/自检可见；可停止、失败可重试 | 任意 prompt（如「会议室预约」）会由模型生成领域应用（时间段 + 冲突校验），二轮改名生效 |
| **数据持久化** | 项目/会话/版本 IndexedDB；生成应用 localStorage；账号与会话 Blobs；刷新不丢、退出重登项目仍在 | 生成后刷新页面、退出重登均可复现 |
| **页面美观** | 纸感亮色 + 墨绿强调 + 衬线标题；生成应用统一「精致产品感」；桌面/移动自适应 | 直接看首页、工作台、生成应用与移动端 |
| **代码管理** | 版本时间线（每次生成自动快照）、逐行 diff 对比、回滚、单文件 HTML/项目 JSON 导出、文件树/复制 | 右侧「版本」页签：恢复历史版本、对比当前版本逐行差异 |
| **产物预览** | 3 文件内联进沙箱 iframe、真实可交互、运行时 console/错误捕获、设备视口切换 | 预览区直接点击/输入；「控制台」页签查看生成应用运行日志 |

## 部署

当前线上方式：**Netlify 静态托管 + Background Functions**（见下方「当前线上」小节）。
`vercel.app` 在部分网络不可达，Vercel 部署仅作为备选保留（全功能服务器模式）。
所有 Key 只通过环境变量注入，**不会**出现在仓库、前端代码或分享链接里；
本地 `.env.local` 已被 gitignore（仓库内只有空值的 `.env.example`）。

### 备选：Vercel（全功能服务器）

项目无服务端数据库、无外部依赖，`pnpm build` 已通过，可直接部署：

```bash
pnpm dlx vercel deploy --prod        # 首次会提示登录 / 关联项目
# 或：在 Vercel 控制台 Import 本目录（Framework: Next.js，Build: pnpm build）
```

### 备选：临时公网隧道（cloudflared，无需账号）

适合「评委临时点开看」或没有 Vercel 账号时：

```powershell
# 终端 1：生产模式跑在 0.0.0.0（同事/同网设备可访问 http://<本机IP>:4311）
pnpm build
pnpm start:lan

# 终端 2：把本地 4311 暴露到公网（cloudflared 放在 .tools\，不入库）
.\.tools\cloudflared.exe tunnel --url http://localhost:4311 --no-autoupdate
# 输出形如 https://xxx.trycloudflare.com 的公网地址
```

> 注意：链接只在两个进程运行期间有效，关机/关闭终端即失效；重启后地址会变。
> 验证线上可用性：`BASE_URL=https://xxx.trycloudflare.com node scripts/verify-public.mjs`。

### 当前线上：Netlify 静态 + 服务端函数

`vercel.app` / `pages.dev` 在部分网络不可达，Netlify 静态托管 + Background Functions 是更稳的方案：

```powershell
pnpm build:static        # 静态导出到 out/（约 1.7MB）
pnpm build:functions     # esbuild 打包 netlify/functions → .netlify-bundle/（依赖内联）
pnpm --package=netlify-cli@latest dlx netlify deploy --dir=out --functions=.netlify-bundle --prod --site <site-id>
```

- **账号**：`/.netlify/functions/auth`（注册/登录/登出，Netlify Blobs 存储，PBKDF2 哈希）
- **真实模型**：`/.netlify/functions/generate-background`（Background Function，15 分钟预算）调用服务端
  `OPENAI_*` 配置的模型，进度写入 Blobs，前端 `/.netlify/functions/poll` 轮询并逐帧渲染；
  模型不可用时前端自动降级为内置生成器。
- 服务端环境变量（Netlify 项目设置 / `netlify env:set`）：

| 变量 | 说明 |
| --- | --- |
| `OPENAI_API_KEY` | 服务端模型 Key（必填，模型才可用） |
| `OPENAI_BASE_URL` | 兼容端点，如 `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `OPENAI_MODEL` | 默认模型，如 `qwen3.8-flash` |
| `OPENAI_ALLOWED_MODELS` | 允许前端切换的模型（逗号分隔），如 `qwen3.8-flash,qwen3.8-max-0902` |

- 若站点被 Netlify 的 Team protection 拦截（HTTP 401），在站点设置里关闭 SSO 保护即可。

可选环境变量（不配则运行内置 Mock Agent）：

| 变量 | 说明 |
| --- | --- |
| `DEFAULT_PROVIDER` | `mock`（默认）/ `openai` / `anthropic` |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | 服务端默认模型 |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL` / `ANTHROPIC_MODEL` | 服务端默认模型 |

> 也可以让访问者自带 Key（设置面板），Key 只存访问者本地、随请求发给同源代理，不写入代码与分享链接。

## 笔试需求覆盖（自动验证）

笔试要求「真实交互 / 数据持久化 / 基本使用流程 / 至少一个延展能力」。
四项均已满足并有可复跑的自动化证据（`node scripts/verify-requirements.mjs`，报告写入
`docs/需求覆盖验证报告.md`）：

| 要求 | 实现 | 自动验证证据 |
| --- | --- | --- |
| 真实交互（非静态） | 生成过程流式可交互；生成结果在沙箱 iframe 真实运行 | 脚本进入生成的应用：输入+回车新增任务、统计实时更新、筛选 tab 真实过滤 |
| 数据持久化 | 产品：IndexedDB（项目/会话/版本）；生成应用：localStorage（+ 不可用时的内存降级桥） | 刷新 iframe 后新增数据仍在；整页刷新后项目仍在；重开项目代码与数据一并恢复 |
| 基本流程（初始化/主流程） | 空状态初始化 + 8 个起步模板；核心流程 = 输入 → 理解 → 计划 → 写文件 → 自检 → 预览 | 协议断言完整事件序列（understand/design/code/verify + 3 files + done）；流式耗时 5–6s 可感知 |
| 延展能力 | 多轮迭代、版本时间线/回滚、分享链接、导出 HTML/JSON、运行时控制台 | 脚本逐项操作并断言（迭代后版本 +1、回滚生效、分享链接新标签页可直接运行、导出触发下载） |

## 测试

```bash
pnpm typecheck                          # TypeScript（严格模式）
pnpm lint                               # ESLint（flat config，0 warning）
pnpm test                               # Vitest 单元测试（53 个断言：share/format/preview/themes/diff/real 解析）
node scripts/test-real-provider.mjs     # 真实模型协议（本地假 SSE，无需 Key）
node scripts/check-recipe.mjs --all     # 全部 14 个 recipe + 合成器验收（生成 → 语法 → 渲染 → 截图）
node scripts/e2e-flows.mjs              # 端到端主流程（生成/迭代/回滚/分享/导出/刷新持久化）
node scripts/verify-requirements.mjs    # 笔试四项需求覆盖验证（真实交互/持久化/主流程/延展）
node scripts/check-mobile.mjs            # 移动端对话/预览切换 + 溢出检查
node scripts/demo-gif.mjs                # 录制演示 GIF（shots/demo.gif）
node scripts/validate-real-app.mjs       # 渲染校验真实模型生成结果（需 shots/real-run.ndjson）
node scripts/qa-ui.mjs / shots.mjs       # 布局审计 / 截图回归
node scripts/audit-scroll.mjs             # 扫描「内容超出却没有滚动条」的元素
BASE_URL=https://vibeforge-interview-demo.netlify.app pnpm test:real  # 线上真实模型双轮验收
pnpm build:static && pnpm build:functions  # 线上部署产物（静态 + 函数）
```

当前状态：`typecheck` ✅、`lint` 0 warning ✅、`build` ✅、单元测试 53/53 ✅、
recipe 全量 14/14 PASS ✅、主流程 E2E 11/11 PASS ✅（含取消/重试）、
**笔试四项需求覆盖 4/4 PASS** ✅、移动端 7/7 PASS ✅、滚动修复验收 6/6 PASS ✅、
**线上真实模型双轮验收全 PASS** ✅（首轮 77.9s、二轮 70.8s，会议室预约 + 冲突校验）。

## 已知限制

- **线上默认真实模型**：任意 prompt 由模型自由设计领域（已实测「会议室预约」→ 时间段 + 冲突校验）；
  内置生成器作为秒级兜底，两者走同一事件协议。
- **真实模型依赖服务端 Key**：Key 只存在 Netlify 环境变量；失效/限流时系统自动降级到内置生成器并在对话中提示。
- **真实模型较慢**：百炼 qwen3.8-flash 约 1–1.5 分钟、qwen3.8-max-0902 约 2 分钟（会持续推送心跳日志，可随时取消）；
  Mock 模式是秒级，适合评委直接体验。
- **Mock 模式的多轮迭代是「整体重建」**，不是精准 diff 修改；真实模型模式下会把现有文件作为上下文做完整重写。
- 预览 iframe 使用 `allow-same-origin allow-scripts` 以便生成应用使用 `localStorage`；生成代码来自受信任的生成器，若接入真实模型建议改为独立域名沙箱。
- 分享链接经 gzip 后约 7–8KB（base64 有 ~33% 膨胀）；更长的项目建议用「导出 HTML」。

## Roadmap（继续投入的优先级）

已完成：真实模型接入（后台函数 + 轮询 + 模型切换 + 自动降级）、账号体系、滚动修复。

1. **真实模型质量闭环**（P0）：生成 → 运行时错误回喂 → 自动修复，建立固定 prompt 评估集；
2. **沙箱独立域**（P0）：生成应用到独立 origin，彻底隔离；
3. **任务可恢复**（P1）：生成中刷新/换设备后可回到任务看进度与结果；
4. **精准增量修改**（P1）：结构化 AST 级 patch，而不是整文件重写；
5. **分享短链**（P1）；**协作**（P2）：多人实时预览、模板市场。
