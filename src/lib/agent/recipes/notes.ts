import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Notes — Markdown 笔记：左侧列表 + 分栏编辑器（写作 / 实时预览）+ 标签 + 全文搜索。
 * 信息架构：编辑器分栏 + 侧边列表。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Paper Notes",
    tagline: "左边写 Markdown，右边即时看到样子",
    summary:
      "一个本地 Markdown 笔记应用：分栏写作与实时预览、标签分类、标题正文全文搜索，笔记自动保存到浏览器。",
    features: [
      { icon: "columns", title: "分栏写作", detail: "左边 Markdown，右边实时渲染" },
      { icon: "tag", title: "标签筛选", detail: "按标签归类，点击即筛选" },
      { icon: "search", title: "全文搜索", detail: "标题、正文和标签一起搜" },
      { icon: "database", title: "本地保存", detail: "边写边存，刷新不丢" },
    ],
    body: `
  <main class="app">
    <aside class="sidebar" aria-label="笔记列表">
      <div class="side-head">
        <div class="wordmark">
          <span class="logo" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 7h7M8 11h5"/>
            </svg>
          </span>
          <strong>Paper</strong>
          <span class="ver">笔记</span>
        </div>
        <button class="new-note" id="new-note" title="新建笔记" aria-label="新建笔记">＋</button>
      </div>

      <label class="search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>
        </svg>
        <input id="search" type="search" placeholder="搜索标题、正文或标签" autocomplete="off" aria-label="搜索笔记" />
      </label>

      <div class="tag-filter" id="tag-filter" role="group" aria-label="按标签筛选"></div>
      <ul class="note-list" id="note-list" aria-label="笔记"></ul>
      <div class="side-foot">
        <span id="note-count">0 篇笔记</span>
        <span class="save-dot" aria-hidden="true"></span>
        <span>本地保存</span>
      </div>
    </aside>

    <section class="editor" aria-label="笔记编辑器">
      <div class="empty-editor" id="empty-editor" hidden>
        <p class="empty-title">还没有笔记</p>
        <p class="empty-hint">点左上角的「＋」新建一篇，或者换一个搜索词。</p>
      </div>

      <div class="editor-body" id="editor-body" hidden>
        <header class="editor-head">
          <input class="note-title" id="note-title" type="text" maxlength="80" placeholder="无标题笔记" aria-label="笔记标题" />
          <div class="editor-tools">
            <div class="view-toggle" role="group" aria-label="编辑视图">
              <button type="button" data-view="split" class="is-active">分栏</button>
              <button type="button" data-view="edit">编辑</button>
              <button type="button" data-view="preview">预览</button>
            </div>
            <button type="button" class="danger" id="del-note" title="删除这篇笔记" aria-label="删除这篇笔记">删除</button>
          </div>
        </header>

        <div class="tag-row">
          <div class="tag-chips" id="tag-chips"></div>
          <input class="tag-input" id="tag-input" type="text" maxlength="12" placeholder="＋ 添加标签" aria-label="添加标签" />
        </div>

        <div class="panes view-split" id="panes">
          <section class="pane pane-edit">
            <div class="pane-label"><span>MARKDOWN</span><em id="char-count">0 字</em></div>
            <textarea id="editor" spellcheck="false" aria-label="Markdown 正文" placeholder="用 Markdown 写点什么…&#10;&#10;支持 # 标题、**加粗**、- 列表、> 引用"></textarea>
          </section>
          <section class="pane pane-preview">
            <div class="pane-label"><span>实时预览</span><em>只读</em></div>
            <article class="md" id="preview" aria-label="Markdown 预览"></article>
          </section>
        </div>
      </div>
    </section>
  </main>`,
    css: `
.app{max-width:1140px;margin:0 auto;padding:34px 28px 44px;display:grid;grid-template-columns:252px minmax(0,1fr);gap:16px;align-items:start}
.sidebar{position:sticky;top:34px;display:flex;flex-direction:column;gap:11px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 12px 10px;max-height:calc(100vh - 68px);min-height:520px}
.side-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.wordmark{display:flex;align-items:center;gap:7px}
.logo{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:color-mix(in srgb,var(--accent) 13%,transparent);color:var(--accent);flex:0 0 auto}
.wordmark strong{font-size:14px;font-weight:650;letter-spacing:-.01em}
.ver{font-size:10px;color:var(--muted);border:1px solid var(--border);border-radius:5px;padding:1px 5px}
.new-note{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);font-size:15px;line-height:1;transition:filter .14s ease,transform .14s ease}
.new-note:hover{filter:brightness(1.12)}
.new-note:active{transform:scale(.94)}
.search{display:flex;align-items:center;gap:7px;background:color-mix(in srgb,var(--text) 4%,transparent);border:1px solid var(--border);border-radius:calc(var(--radius) - 3px);padding:7px 9px;color:var(--muted);transition:border-color .14s ease,box-shadow .14s ease}
.search:focus-within{border-color:color-mix(in srgb,var(--accent) 50%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}
.search input{flex:1;min-width:0;background:transparent;border:none;outline:none;font-size:12px;color:var(--text)}
.search input::placeholder{color:color-mix(in srgb,var(--muted) 85%,transparent)}
.tag-filter{display:flex;gap:5px;flex-wrap:wrap}
.tag-pill{font-size:10.5px;color:var(--muted);padding:3px 8px;border-radius:999px;border:1px solid var(--border);transition:color .14s ease,border-color .14s ease,background .14s ease}
.tag-pill em{font-style:normal;opacity:.6;margin-left:2px;font-variant-numeric:tabular-nums}
.tag-pill:hover{color:var(--text);border-color:color-mix(in srgb,var(--text) 22%,transparent)}
.tag-pill.is-active{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 42%,transparent);background:color-mix(in srgb,var(--accent) 9%,transparent)}
.note-list{display:flex;flex-direction:column;gap:3px;overflow-y:auto;flex:1;min-height:150px;padding-right:1px;scrollbar-width:thin}
.note-item{padding:8px 9px;border-radius:calc(var(--radius) - 3px);border:1px solid transparent;cursor:pointer;transition:background .14s ease,border-color .14s ease}
.note-item:hover{background:color-mix(in srgb,var(--text) 4%,transparent)}
.note-item.is-active{background:color-mix(in srgb,var(--accent) 9%,transparent);border-color:color-mix(in srgb,var(--accent) 27%,transparent)}
.note-name{font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.note-excerpt{font-size:11px;line-height:1.5;color:var(--muted);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
.note-meta{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:5px;font-size:10px;color:color-mix(in srgb,var(--muted) 88%,transparent)}
.note-tag{color:var(--accent);opacity:.9}
.side-foot{display:flex;align-items:center;gap:6px;border-top:1px solid var(--border);padding-top:8px;font-size:10px;color:var(--muted)}
.save-dot{width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:.75;margin-left:auto}
.editor{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;min-height:600px}
.editor-body{display:flex;flex-direction:column;flex:1;min-height:0}
.editor-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:15px 20px 13px;border-bottom:1px solid var(--border)}
.note-title{flex:1;min-width:150px;background:transparent;border:none;outline:none;padding:2px 0;font-size:20px;font-weight:650;letter-spacing:-.02em;color:var(--text)}
.note-title::placeholder{color:color-mix(in srgb,var(--muted) 70%,transparent)}
.editor-tools{display:flex;align-items:center;gap:10px;margin-left:auto}
.view-toggle{display:inline-flex;gap:1px;padding:2px;border-radius:8px;background:color-mix(in srgb,var(--text) 5%,transparent);border:1px solid var(--border)}
.view-toggle button{font-size:11px;color:var(--muted);padding:3px 9px;border-radius:6px;transition:background .14s ease,color .14s ease}
.view-toggle button:hover{color:var(--text)}
.view-toggle button.is-active{background:var(--surface);color:var(--text);box-shadow:0 1px 2px color-mix(in srgb,var(--text) 8%,transparent)}
.danger{font-size:11.5px;color:var(--muted);padding:4px 9px;border-radius:7px;transition:color .14s ease,background .14s ease}
.danger:hover{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 10%,transparent)}
.tag-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:9px 20px;border-bottom:1px solid var(--border)}
.tag-chips{display:flex;gap:5px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:var(--accent);padding:3px 7px;border-radius:999px;background:color-mix(in srgb,var(--accent) 8%,transparent);border:1px solid color-mix(in srgb,var(--accent) 24%,transparent)}
.chip button{line-height:0;color:var(--accent);opacity:.55;transition:opacity .14s ease}
.chip button:hover{opacity:1}
.tag-input{background:transparent;border:none;outline:none;font-size:11px;color:var(--muted);width:96px;padding:3px 2px}
.tag-input::placeholder{color:color-mix(in srgb,var(--muted) 78%,transparent)}
.panes{display:grid;grid-template-columns:1fr 1fr;flex:1;min-height:0}
.panes.view-edit{grid-template-columns:1fr}
.panes.view-edit .pane-preview{display:none}
.panes.view-edit .pane-edit{border-right:none}
.panes.view-preview{grid-template-columns:1fr}
.panes.view-preview .pane-edit{display:none}
.pane{display:flex;flex-direction:column;min-width:0;min-height:0}
.pane-edit{border-right:1px solid var(--border)}
.pane-label{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 20px 6px;font-size:9.5px;letter-spacing:.16em;color:var(--muted);font-weight:600}
.pane-label em{font-style:normal;letter-spacing:.02em;font-weight:400;font-variant-numeric:tabular-nums}
.pane-edit textarea{flex:1;width:100%;min-height:420px;resize:none;background:transparent;border:none;outline:none;padding:4px 20px 24px;font-family:ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,var(--font);font-size:13px;line-height:1.75;color:var(--text);tab-size:2}
.pane-edit textarea::placeholder{color:color-mix(in srgb,var(--muted) 72%,transparent)}
.md{padding:4px 22px 26px;overflow-y:auto;max-height:560px;font-size:13.5px;line-height:1.72;color:var(--text);word-break:break-word}
.md h2{font-size:17px;font-weight:650;letter-spacing:-.01em;margin:16px 0 8px}
.md h3{font-size:14.5px;font-weight:650;margin:14px 0 6px}
.md h4{font-size:13px;font-weight:650;margin:12px 0 5px}
.md p{margin:9px 0}
.md ul{list-style:disc;padding-left:19px;margin:9px 0}
.md ol{list-style:decimal;padding-left:19px;margin:9px 0}
.md li{margin:3px 0}
.md blockquote{margin:10px 0;padding:2px 0 2px 12px;border-left:2px solid color-mix(in srgb,var(--accent) 60%,transparent);color:var(--muted)}
.md hr{border:none;border-top:1px solid var(--border);margin:16px 0}
.md a{color:var(--accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--accent) 35%,transparent)}
.md strong{font-weight:650}
.md del{opacity:.7}
.md .md-empty{color:var(--muted);font-size:13px}
.empty-editor{padding:90px 24px;text-align:center}
.empty-title{font-size:15px;font-weight:600;margin-bottom:6px}
.empty-hint{font-size:12.5px;color:var(--muted)}
button:focus-visible,input:focus-visible,textarea:focus-visible,.note-item:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:860px){
  .app{grid-template-columns:1fr;padding:18px 14px 32px;gap:12px}
  .sidebar{position:static;max-height:none;min-height:0}
  .note-list{flex-direction:row;overflow-x:auto;overflow-y:hidden;min-height:0;padding-bottom:4px}
  .note-item{flex:0 0 196px}
  .note-excerpt{-webkit-line-clamp:1}
  .panes{grid-template-columns:1fr}
  .pane-edit{border-right:none}
  .pane-preview{border-top:1px solid var(--border)}
  .pane-edit textarea{min-height:250px}
  .md{max-height:none}
  .view-toggle [data-view="split"]{display:none}
  .editor{min-height:0}
}
@media (prefers-reduced-motion:reduce){
  .note-item,.tag-pill,.new-note,.search,.chip{transition:none}
}`,
    js: `
var KEY = "vf:notes:v1";
var state = { notes: [], selectedId: null, query: "", tag: "all", view: "split" };

function uid() { return "n" + Math.random().toString(36).slice(2, 9); }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ notes: state.notes })); } catch (e) {}
}

function seed() {
  var now = Date.now();
  return [
    {
      id: uid(),
      title: "产品周会 · 第 12 周",
      tags: ["会议", "产品"],
      updatedAt: now - 1000 * 60 * 42,
      body: [
        "## 本周结论",
        "",
        "1. 聚焦生成器的**首屏速度**，先砍掉一次不必要的请求。",
        "2. 看板列在 375px 下改为纵向堆叠，不再横向滚动。",
        "3. 发布节奏调整为每周三，评审提前到周二下午。",
        "",
        "> 行动项：补一版 3 文件产物的体积预算，目标 30KB 以内。",
        "",
        "### 待跟进",
        "- 对齐设计稿的空状态",
        "- 补埋点事件表",
        "- 和运营确认灰度名单"
      ].join("\\n")
    },
    {
      id: uid(),
      title: "Mock Agent 的路由设计",
      tags: ["技术", "设计"],
      updatedAt: now - 1000 * 60 * 60 * 3,
      body: [
        "## 一句话",
        "",
        "不调用 LLM，靠关键词打分把 prompt 路由到 recipe，再用主题词库决定配色。",
        "",
        "## 打分规则",
        "- 命中关键词越长，权重越高",
        "- 分数相同按注册顺序取靠前者",
        "- 分数为 0 时回落到通用 CRUD 合成器",
        "",
        "## 待验证",
        "1. 关键词会不会互相抢词",
        "2. 主题色在深色下是否仍然克制",
        "",
        "---",
        "",
        "相关链接：见 [配方规范](/docs/recipe-spec.md)"
      ].join("\\n")
    },
    {
      id: uid(),
      title: "读书笔记：芯片简史",
      tags: ["阅读"],
      updatedAt: now - 1000 * 60 * 60 * 26,
      body: [
        "## 印象最深的三段",
        "",
        "> 摩尔定律不是自然规律，而是一群人的自我承诺。",
        "",
        "1. 从平面到 FinFET，是一次**结构上的妥协**。",
        "2. 光刻机的故事说明：极限工艺往往靠供应链协作。",
        "3. 封装正在变成新的性能战场。",
        "",
        "### 摘抄",
        "- 制程的数字早已不等于物理尺寸",
        "- 良率是制造里最诚实的指标",
        "",
        "下次想读：《芯片战争》。"
      ].join("\\n")
    },
    {
      id: uid(),
      title: "周末露营装备清单",
      tags: ["生活"],
      updatedAt: now - 1000 * 60 * 60 * 24 * 2,
      body: [
        "## 必带",
        "- 帐篷、地垫、气泵",
        "- 头灯两把（含备用电池）",
        "- 卡式炉 + 挡风板",
        "- 垃圾袋（无痕山林）",
        "",
        "## 食材",
        "1. 咖啡豆、手冲壶",
        "2. 吐司、鸡蛋、黄油",
        "3. 一锅番茄牛腩罐头",
        "",
        "> 提醒：营地海拔 1800m，夜里到 4 度，睡袋按 0 度准备。"
      ].join("\\n")
    },
    {
      id: uid(),
      title: "灵感：把工具做成玩具",
      tags: ["灵感", "写作"],
      updatedAt: now - 1000 * 60 * 60 * 24 * 3,
      body: [
        "## 核心判断",
        "",
        "工具解决**任务**，玩具解决**情绪**。好的产品让任务顺手完成，又留一点可玩的余地。",
        "",
        "- 生成器：让每次生成都像开盲盒，但要可预期",
        "- 看板：拖拽的落位反馈就是玩具感",
        "- 计时器：把专注变成能收集的记录",
        "",
        "### 反例",
        "把所有东西都塞进卡片网格，看起来整齐，其实没有节奏。"
      ].join("\\n")
    },
    {
      id: uid(),
      title: "面试复盘：Demo 演示节奏",
      tags: ["面试", "复盘"],
      updatedAt: now - 1000 * 60 * 60 * 24 * 5,
      body: [
        "## 好的部分",
        "- 开场 30 秒讲清楚要解决什么问题",
        "- 每一步操作都有可见反馈",
        "- 提前准备好断网、刷新后的兜底",
        "",
        "## 下次改进",
        "1. 不要照着功能列表念，讲**用户路径**。",
        "2. 留 1 分半钟给提问，不要用演示填满。",
        "3. 录屏备份一份，现场网络不可控。",
        "",
        "> 一句话：演示是讲故事，不是念文档。"
      ].join("\\n")
    }
  ];
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.notes) && parsed.notes.length) {
        state.notes = parsed.notes.filter(function (n) {
          return n && typeof n.id === "string" && typeof n.title === "string" &&
            typeof n.body === "string" && Array.isArray(n.tags);
        });
      }
    }
  } catch (e) {}
  if (!state.notes.length) { state.notes = seed(); save(); }
  state.selectedId = state.notes[0].id;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function currentNote() {
  for (var i = 0; i < state.notes.length; i++) {
    if (state.notes[i].id === state.selectedId) return state.notes[i];
  }
  return null;
}

function noteById(id) {
  for (var i = 0; i < state.notes.length; i++) { if (state.notes[i].id === id) return state.notes[i]; }
  return null;
}

function relTime(ts) {
  var diff = Date.now() - ts;
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
  if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
  var d = Math.floor(diff / 86400000);
  if (d === 1) return "昨天";
  if (d < 7) return d + " 天前";
  var dt = new Date(ts);
  return (dt.getMonth() + 1) + " 月 " + dt.getDate() + " 日";
}

function excerptOf(body) {
  return String(body).replace(/[#>*~\\[\\]()]/g, " ").replace(/\\s+/g, " ").trim().slice(0, 72);
}

function inlineMd(s) {
  s = s.replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>");
  s = s.replace(/\\*([^*]+)\\*/g, "<em>$1</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  s = s.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
  return s;
}

function mdToHtml(src) {
  var lines = String(src || "").replace(/\\r\\n?/g, "\\n").split("\\n");
  var html = "";
  var para = [];
  var listTag = null;
  var listItems = [];

  function flushPara() {
    if (para.length) { html += "<p>" + inlineMd(para.join("<br>")) + "</p>"; para = []; }
  }
  function flushList() {
    if (listTag) { html += "<" + listTag + ">" + listItems.join("") + "</" + listTag + ">"; listTag = null; listItems = []; }
  }

  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].replace(/\\s+$/, "");
    if (!l.trim()) { flushPara(); flushList(); continue; }
    if (/^#{1,4}\\s+/.test(l)) {
      flushPara(); flushList();
      var level = l.match(/^#+/)[0].length;
      html += "<h" + level + ">" + inlineMd(l.replace(/^#{1,4}\\s+/, "")) + "</h" + level + ">";
      continue;
    }
    if (/^\\s*[-*+]\\s+/.test(l)) {
      if (listTag && listTag !== "ul") flushList();
      flushPara(); listTag = "ul";
      listItems.push("<li>" + inlineMd(l.replace(/^\\s*[-*+]\\s+/, "")) + "</li>");
      continue;
    }
    if (/^\\s*\\d+\\.\\s+/.test(l)) {
      if (listTag && listTag !== "ol") flushList();
      flushPara(); listTag = "ol";
      listItems.push("<li>" + inlineMd(l.replace(/^\\s*\\d+\\.\\s+/, "")) + "</li>");
      continue;
    }
    if (/^>\\s?/.test(l)) {
      flushPara(); flushList();
      html += "<blockquote>" + inlineMd(l.replace(/^>\\s?/, "")) + "</blockquote>";
      continue;
    }
    if (/^---+$/.test(l)) { flushPara(); flushList(); html += "<hr>"; continue; }
    flushList();
    para.push(l);
  }
  flushPara(); flushList();
  return html || '<p class="md-empty">开始写点什么吧…</p>';
}

var listEl = document.getElementById("note-list");
var tagFilterEl = document.getElementById("tag-filter");
var searchEl = document.getElementById("search");
var panesEl = document.getElementById("panes");

function allTags() {
  var seen = {};
  var out = [];
  state.notes.forEach(function (n) {
    n.tags.forEach(function (t) {
      if (!seen[t]) { seen[t] = 1; out.push(t); }
    });
  });
  return out;
}

function filteredNotes() {
  var q = state.query.trim().toLowerCase();
  return state.notes.filter(function (n) {
    if (state.tag !== "all") {
      var has = false;
      for (var i = 0; i < n.tags.length; i++) { if (n.tags[i] === state.tag) has = true; }
      if (!has) return false;
    }
    if (!q) return true;
    var blob = (n.title + " " + n.body + " " + n.tags.join(" ")).toLowerCase();
    return blob.indexOf(q) >= 0;
  });
}

function renderTagFilter() {
  var tags = allTags();
  var h = '<button class="tag-pill' + (state.tag === "all" ? " is-active" : "") + '" data-tag="all">全部<em>' + state.notes.length + '</em></button>';
  tags.forEach(function (t) {
    var count = 0;
    state.notes.forEach(function (n) { if (n.tags.indexOf(t) >= 0) count++; });
    h += '<button class="tag-pill' + (state.tag === t ? " is-active" : "") + '" data-tag="' + escapeHtml(t) + '">' + escapeHtml(t) + '<em>' + count + '</em></button>';
  });
  tagFilterEl.innerHTML = h;
}

function renderList() {
  var items = filteredNotes();
  var h = "";
  items.forEach(function (n) {
    h += '<li class="note-item' + (n.id === state.selectedId ? " is-active" : "") + '" data-id="' + n.id + '" tabindex="0" role="button">';
    h += '<p class="note-name">' + escapeHtml(n.title || "无标题笔记") + '</p>';
    h += '<p class="note-excerpt">' + escapeHtml(excerptOf(n.body)) + '</p>';
    h += '<div class="note-meta"><span>' + relTime(n.updatedAt) + '</span>';
    if (n.tags.length) h += '<span class="note-tag">' + escapeHtml(n.tags[0]) + '</span>';
    h += '</div></li>';
  });
  if (!items.length) h = '<li class="note-excerpt" style="padding:14px 8px">没有匹配的笔记。</li>';
  listEl.innerHTML = h;
  document.getElementById("note-count").textContent = state.notes.length + " 篇笔记 · " + items.length + " 条结果";
  renderTagFilter();
}

function renderTagChips(n) {
  var el = document.getElementById("tag-chips");
  var h = "";
  n.tags.forEach(function (t) {
    h += '<span class="chip">' + escapeHtml(t) + '<button type="button" data-remove-tag="' + escapeHtml(t) + '" aria-label="移除标签' + escapeHtml(t) + '">×</button></span>';
  });
  el.innerHTML = h;
}

function updateCount() {
  var n = currentNote();
  var el = document.getElementById("char-count");
  if (el) el.textContent = (n ? n.body.replace(/\\s/g, "").length : 0) + " 字";
}

function renderPreview() {
  var n = currentNote();
  document.getElementById("preview").innerHTML = mdToHtml(n ? n.body : "");
}

function renderEditor() {
  var n = currentNote();
  var bodyEl = document.getElementById("editor-body");
  var emptyEl = document.getElementById("empty-editor");
  if (!n) {
    bodyEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  bodyEl.hidden = false;
  emptyEl.hidden = true;
  document.getElementById("note-title").value = n.title;
  document.getElementById("editor").value = n.body;
  renderTagChips(n);
  renderPreview();
  updateCount();
  panesEl.className = "panes view-" + state.view;
  syncViewButtons();
}

function syncViewButtons() {
  var btns = document.querySelectorAll(".view-toggle button");
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].getAttribute("data-view") === state.view) btns[i].classList.add("is-active");
    else btns[i].classList.remove("is-active");
  }
}

function touch(id) {
  var n = noteById(id);
  if (n) n.updatedAt = Date.now();
  save();
}

function selectNote(id) {
  state.selectedId = id;
  renderList();
  renderEditor();
  if (window.innerWidth <= 860) {
    var ed = document.getElementById("editor-body");
    if (ed) ed.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

listEl.addEventListener("click", function (e) {
  var item = e.target.closest(".note-item");
  if (item && item.getAttribute("data-id")) selectNote(item.getAttribute("data-id"));
});

listEl.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  var item = e.target.closest(".note-item");
  if (item) { e.preventDefault(); selectNote(item.getAttribute("data-id")); }
});

tagFilterEl.addEventListener("click", function (e) {
  var pill = e.target.closest("[data-tag]");
  if (!pill) return;
  state.tag = pill.getAttribute("data-tag");
  renderList();
});

searchEl.addEventListener("input", function () {
  state.query = searchEl.value;
  renderList();
});

document.getElementById("new-note").addEventListener("click", function () {
  var n = { id: uid(), title: "未命名笔记", tags: [], updatedAt: Date.now(), body: "" };
  state.notes.unshift(n);
  state.selectedId = n.id;
  save();
  renderList();
  renderEditor();
  var title = document.getElementById("note-title");
  title.focus();
  title.select();
});

document.getElementById("note-title").addEventListener("input", function () {
  var n = currentNote();
  if (!n) return;
  n.title = this.value;
  n.updatedAt = Date.now();
  save();
  renderList();
});

document.getElementById("editor").addEventListener("input", function () {
  var n = currentNote();
  if (!n) return;
  n.body = this.value;
  n.updatedAt = Date.now();
  save();
  renderPreview();
  updateCount();
  renderList();
});

document.getElementById("tag-input").addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== ",") return;
  e.preventDefault();
  var n = currentNote();
  if (!n) return;
  var t = this.value.trim().replace(/^#/, "");
  if (!t) return;
  if (n.tags.indexOf(t) < 0 && n.tags.length < 8) {
    n.tags.push(t);
    n.updatedAt = Date.now();
    save();
    renderTagChips(n);
    renderList();
  }
  this.value = "";
});

document.getElementById("tag-chips").addEventListener("click", function (e) {
  var btn = e.target.closest("[data-remove-tag]");
  if (!btn) return;
  var n = currentNote();
  if (!n) return;
  var t = btn.getAttribute("data-remove-tag");
  n.tags = n.tags.filter(function (x) { return x !== t; });
  if (state.tag === t) state.tag = "all";
  n.updatedAt = Date.now();
  save();
  renderTagChips(n);
  renderList();
});

document.getElementById("del-note").addEventListener("click", function () {
  var n = currentNote();
  if (!n) return;
  var idx = -1;
  for (var i = 0; i < state.notes.length; i++) { if (state.notes[i].id === n.id) idx = i; }
  state.notes.splice(idx, 1);
  if (state.notes.length) {
    var next = state.notes[Math.min(idx, state.notes.length - 1)];
    state.selectedId = next.id;
  } else {
    state.selectedId = null;
  }
  save();
  renderList();
  renderEditor();
});

document.querySelector(".view-toggle").addEventListener("click", function (e) {
  var btn = e.target.closest("[data-view]");
  if (!btn) return;
  state.view = btn.getAttribute("data-view");
  panesEl.className = "panes view-" + state.view;
  syncViewButtons();
});

load();
renderList();
renderEditor();
`,
  };
}

export const notesRecipe: Recipe = {
  id: "notes",
  label: "Markdown 笔记",
  keywords: ["笔记", "markdown", "md", "标签", "预览", "搜索", "notes", "notebook", "文档"],
  build,
};

export default notesRecipe;
