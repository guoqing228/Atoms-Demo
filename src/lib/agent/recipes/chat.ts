import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * AI chat — conversation-stream IA: conversation sidebar + message thread +
 * composer. Interactions: new / switch / delete / search conversations,
 * send with Enter, simulated typing indicator and typewriter reply, mobile
 * drawer. Everything persists to localStorage.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Thread AI",
    tagline: "把对话整理成一条条可以回看的线索",
    summary:
      "一个 AI 聊天界面：左侧是会话列表（可搜索、可新建、可删除），右侧是消息流。发送后会先出现输入指示，再逐字打出回复；刷新页面后对话依然在。",
    features: [
      { icon: "layout", title: "会话流 + 侧栏", detail: "切换、新建、删除、搜索历史会话" },
      { icon: "zap", title: "打字机回复", detail: "先显示输入指示，再逐字呈现答案" },
      { icon: "filter", title: "快捷提问", detail: "空会话给出四个可直接发送的建议" },
      { icon: "database", title: "本地持久化", detail: "会话与消息保存在浏览器本地" },
    ],
    body: `
  <main class="shell">
    <aside class="sidebar" id="sidebar" aria-label="会话列表">
      <div class="side-top">
        <span class="brand"><span class="brand-mark">T</span><span>Thread</span></span>
        <button class="new-btn" id="new-conv" type="button" aria-label="新建会话">+ 新对话</button>
      </div>
      <div class="side-search">
        <input id="search" type="search" placeholder="搜索会话…" autocomplete="off" maxlength="40" aria-label="搜索会话" />
      </div>
      <ul class="conv-list" id="conv-list"></ul>
      <div class="side-foot"><span class="status-dot"></span><span>本地演示 · 不联网</span></div>
    </aside>

    <section class="chat" aria-label="聊天">
      <header class="chat-head">
        <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="打开会话列表">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <div class="chat-title">
          <strong id="conv-title">新的对话</strong>
          <span id="conv-meta">开始聊天吧</span>
        </div>
        <button class="icon-btn" id="delete-conv" type="button" aria-label="删除当前会话">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
        </button>
      </header>

      <div class="stream" id="stream"></div>

      <div class="composer-wrap">
        <form class="composer" id="composer">
          <textarea id="input" rows="1" placeholder="给 Thread 发消息，Enter 发送，Shift + Enter 换行…" maxlength="600" aria-label="输入消息"></textarea>
          <button class="send" id="send" type="submit" aria-label="发送" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </form>
        <p class="composer-hint">回答由本地模板生成 · 消息只保存在你的浏览器</p>
      </div>
    </section>
  </main>
  <div class="drawer-scrim" id="drawer-scrim" hidden></div>`,
    css: `
body{overflow:hidden}
.shell{max-width:1120px;margin:22px auto;height:calc(100vh - 44px);display:grid;grid-template-columns:238px minmax(0,1fr);background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 6px);overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04),0 28px 64px -44px rgba(0,0,0,.34)}
.sidebar{background:color-mix(in srgb,var(--text) 2.5%,var(--surface));border-right:1px solid var(--border);display:flex;flex-direction:column;min-height:0;min-width:0}
.side-top{padding:14px 12px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.brand{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:13px;letter-spacing:-.02em}
.brand-mark{width:22px;height:22px;border-radius:7px;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-size:11px;font-weight:800;flex-shrink:0}
.new-btn{font-size:11px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:7px;padding:6px 9px;transition:filter .15s,transform .15s;white-space:nowrap}
.new-btn:hover{filter:brightness(1.07)}
.new-btn:active{transform:scale(.98)}
.side-search{padding:0 12px 8px}
.side-search input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:7px 10px;font-size:11.5px;outline:none;transition:border-color .15s}
.side-search input:focus{border-color:color-mix(in srgb,var(--accent) 50%,transparent)}
.conv-list{flex:1;overflow-y:auto;min-height:0;padding:2px 8px 8px;display:flex;flex-direction:column;gap:1px}
.conv{display:flex;align-items:center;border-radius:8px;min-width:0;transition:background .15s}
.conv:hover{background:color-mix(in srgb,var(--text) 5%,transparent)}
.conv.is-active{background:color-mix(in srgb,var(--accent) 10%,transparent)}
.conv-btn{flex:1;min-width:0;text-align:left;padding:8px 9px;display:flex;flex-direction:column;gap:3px}
.conv-title{font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.conv.is-active .conv-title{color:var(--accent);font-weight:600}
.conv-preview{font-size:10px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.conv-del{width:22px;height:22px;margin-right:4px;display:grid;place-items:center;border-radius:5px;color:var(--muted);font-size:14px;line-height:0;opacity:0;transition:opacity .15s,color .15s,background .15s;flex-shrink:0}
.conv:hover .conv-del{opacity:1}
.conv-del:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
@media (hover:none){.conv-del{opacity:.75}}
.conv-empty{font-size:11px;color:var(--muted);padding:16px 8px;line-height:1.6}
.side-foot{padding:9px 12px;border-top:1px solid var(--border);font-size:10px;color:var(--muted);display:flex;align-items:center;gap:6px;flex-shrink:0}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
.chat{display:flex;flex-direction:column;min-width:0;min-height:0}
.chat-head{display:flex;align-items:center;gap:8px;padding:11px 16px;border-bottom:1px solid var(--border);flex-shrink:0}
.icon-btn{width:30px;height:30px;display:grid;place-items:center;border-radius:7px;color:var(--muted);transition:background .15s,color .15s;flex-shrink:0}
.icon-btn svg{width:15px;height:15px}
.icon-btn:hover{background:color-mix(in srgb,var(--text) 6%,transparent);color:var(--text)}
.menu-btn{display:none}
.chat-title{flex:1;min-width:0}
.chat-title strong{display:block;font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chat-title span{display:block;font-size:10px;color:var(--muted);margin-top:2px}
.stream{flex:1;overflow-y:auto;min-height:0;padding:20px 20px 6px;display:flex;flex-direction:column;gap:15px}
.msg{display:flex;gap:10px;min-width:0}
.msg-user{justify-content:flex-end}
.msg-wrap{display:flex;flex-direction:column;gap:4px;min-width:0;max-width:min(560px,82%)}
.msg-user .msg-wrap{align-items:flex-end}
.msg-bot .msg-wrap{align-items:flex-start}
.bot-avatar{width:26px;height:26px;border-radius:8px;background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:var(--accent);display:grid;place-items:center;flex-shrink:0;margin-top:1px}
.bot-avatar svg{width:14px;height:14px}
.bubble{padding:9px 12px;border-radius:12px;font-size:13px;line-height:1.62;min-width:0}
.msg-bot .bubble{background:color-mix(in srgb,var(--text) 4%,var(--surface));border:1px solid var(--border);border-top-left-radius:4px}
.msg-user .bubble{background:var(--accent);color:var(--bg);border-top-right-radius:4px}
.msg-text{margin:0;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere}
.msg-time{font-size:9px;color:var(--muted);padding:0 2px}
.typing{display:inline-flex;align-items:center;gap:4px;height:17px}
.typing i{width:5px;height:5px;border-radius:50%;background:var(--muted);animation:blink 1.2s ease-in-out infinite}
.typing i:nth-child(2){animation-delay:.15s}
.typing i:nth-child(3){animation-delay:.3s}
@keyframes blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)}}
.empty-state{margin:auto;text-align:center;max-width:420px;padding:16px}
.empty-mark{width:42px;height:42px;border-radius:12px;background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:var(--accent);display:grid;place-items:center;margin:0 auto 14px}
.empty-mark svg{width:20px;height:20px}
.empty-state h2{font-size:18px;letter-spacing:-.02em;font-weight:700}
.empty-state p{font-size:12px;color:var(--muted);line-height:1.6;margin-top:8px}
.suggestions{display:flex;flex-direction:column;gap:7px;margin-top:18px}
.sugg{font-size:11.5px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:9px 11px;text-align:left;transition:border-color .15s,color .15s,background .15s}
.sugg:hover{border-color:color-mix(in srgb,var(--accent) 42%,transparent);color:var(--accent);background:color-mix(in srgb,var(--accent) 5%,var(--surface))}
.composer-wrap{padding:8px 16px 14px;flex-shrink:0}
.composer{display:flex;align-items:flex-end;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 2px);padding:7px 8px 7px 12px;transition:border-color .15s,box-shadow .15s}
.composer:focus-within{border-color:color-mix(in srgb,var(--accent) 52%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 11%,transparent)}
.composer textarea{flex:1;min-width:0;background:transparent;border:none;outline:none;resize:none;font-size:13px;line-height:1.55;max-height:110px;padding:3px 0;font-family:inherit}
.composer textarea::placeholder{color:color-mix(in srgb,var(--muted) 82%,transparent)}
.send{width:32px;height:32px;border-radius:8px;background:var(--accent);color:var(--bg);display:grid;place-items:center;flex-shrink:0;transition:opacity .15s,transform .15s,filter .15s}
.send svg{width:15px;height:15px}
.send:hover:not(:disabled){filter:brightness(1.07)}
.send:active:not(:disabled){transform:scale(.96)}
.send:disabled{opacity:.32;cursor:default}
.composer-hint{text-align:center;font-size:9.5px;color:var(--muted);margin-top:7px}
.drawer-scrim{position:fixed;inset:0;z-index:15;background:color-mix(in srgb,var(--text) 42%,transparent);animation:fadeIn .16s ease both}
[hidden]{display:none!important}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.new-btn:focus-visible,.conv-btn:focus-visible,.conv-del:focus-visible,.icon-btn:focus-visible,.send:focus-visible,.sugg:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
@media (max-width:760px){
  .shell{margin:0;height:100vh;max-width:none;grid-template-columns:1fr;border:none;border-radius:0}
  .sidebar{position:fixed;top:0;bottom:0;left:0;width:min(82vw,300px);z-index:20;transform:translateX(-102%);transition:transform .18s ease;background:var(--surface);box-shadow:0 0 48px rgba(0,0,0,.2)}
  .sidebar.is-open{transform:none}
  .menu-btn{display:grid}
  .stream{padding:16px 14px 4px;gap:13px}
  .msg-wrap{max-width:88%}
  .composer-wrap{padding:8px 12px 12px}
  .side-search input{font-size:16px}
  .composer textarea{font-size:16px}
}`,
    js: `
var KEY = "vf:chat:v1";

var state = {
  convs: [],
  currentId: "",
  query: ""
};

var $ = function (sel) { return document.querySelector(sel); };
var listAll = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
var streamEl = $("#stream");
var convListEl = $("#conv-list");
var inputEl = $("#input");
var sendEl = $("#send");
var searchEl = $("#search");
var genToken = 0;

function uid() { return Math.random().toString(36).slice(2, 10); }

function pad2(n) { return (n < 10 ? "0" : "") + n; }

function clock(at) {
  var d = new Date(at || Date.now());
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}

function relTime(at) {
  var diff = Date.now() - at;
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
  if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
  var d = new Date(at);
  return (d.getMonth() + 1) + "/" + d.getDate();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function seed() {
  var now = Date.now();
  var min = 60000;
  return [
    {
      id: "c-weekly", title: "帮我写一份周报", updatedAt: now - 6 * min,
      messages: [
        { id: "m1", role: "user", text: "帮我把这周的进展整理成周报，重点写支付模块和登录页改版。", at: now - 8 * min },
        { id: "m2", role: "assistant", text: "好的，我按「完成 / 进行中 / 风险」三段来整理：本周完成支付回调重试与登录页改版上线；进行中的是账单导出联调；风险是测试环境扩容需要运维在周四前处理。整体可以压到 300 字以内，发给主管前我再帮你核对数据口径。", at: now - 7 * min },
        { id: "m3", role: "user", text: "语气再正式一点。", at: now - 6 * min },
        { id: "m4", role: "assistant", text: "收到。我会把口语化的表达换成汇报口径，并给每个事项补上负责人和预期完成时间；你确认口径后我再输出最终版本。", at: now - 6 * min }
      ]
    },
    {
      id: "c-effect", title: "useEffect 的依赖数组", updatedAt: now - 26 * min,
      messages: [
        { id: "m5", role: "user", text: "解释一下 useEffect 的依赖数组到底该怎么写？", at: now - 30 * min },
        { id: "m6", role: "assistant", text: "依赖数组决定 effect 什么时候重新执行：留空只跑一次，写上变量则在变量变化时重跑。原则是「effect 里读到的所有响应式值都要写进依赖」，否则会读到过期闭包。需要清理的订阅一定记得返回清理函数。", at: now - 29 * min },
        { id: "m7", role: "user", text: "那省略依赖数组呢？", at: now - 26 * min },
        { id: "m8", role: "assistant", text: "省略依赖数组等于每次渲染都执行，通常只在你确实需要「每次更新都同步」时使用，比如把 DOM 状态同步到 ref。大多数场景下写全依赖更安全，也更方便用 lint 规则兜底。", at: now - 25 * min }
      ]
    },
    {
      id: "c-meeting", title: "产品评审会议纪要", updatedAt: now - 2 * 60 * min,
      messages: [
        { id: "m9", role: "user", text: "把刚才产品评审的讨论整理成纪要，突出待办。", at: now - 125 * min },
        { id: "m10", role: "assistant", text: "已按「结论 / 待办 / 待确认」整理：结论是本期只做筛选器和导出；待办三条，负责人分别是设计、前端和运营；待确认的是导出是否需要支持 Excel 格式。需要我直接发到项目群里吗？", at: now - 122 * min }
      ]
    },
    {
      id: "c-naming", title: "给新功能起名字", updatedAt: now - 5 * 60 * min,
      messages: [
        { id: "m11", role: "user", text: "给新的异步站会功能起几个名字，要克制一点。", at: now - 320 * min },
        { id: "m12", role: "assistant", text: "偏克制的方向有三个：「异步同步」「每日一页」「轻站会」。前两个更贴近功能，最后一个更有画面感但不够清晰。建议主推「异步同步」，副标题里解释清楚它是替代早会的每日进展汇总。", at: now - 315 * min }
      ]
    },
    {
      id: "c-plan", title: "三个月 TypeScript 计划", updatedAt: now - 26 * 60 * min,
      messages: [
        { id: "m13", role: "user", text: "帮我做一个三个月的 TypeScript 学习计划，每周三小时。", at: now - 27 * 60 * min },
        { id: "m14", role: "assistant", text: "三个月按四周一节拆：第 1 个月吃透类型系统与泛型，第 2 个月练工程化与类型体操，第 3 个月用真实项目收口。每周三小时分成「1 小时读文档 + 1.5 小时写练习 + 0.5 小时复盘」，我可以在每周日提醒你。", at: now - 1600 * min }
      ]
    },
    {
      id: "c-postmortem", title: "复盘一次线上故障", updatedAt: now - 2 * 24 * 60 * min,
      messages: [
        { id: "m15", role: "user", text: "帮我复盘昨天的线上故障，尽量客观。", at: now - 2 * 24 * 60 * min },
        { id: "m16", role: "assistant", text: "客观复盘可以按时间线、影响面、根因、改进项四部分写：故障从报警到恢复共 23 分钟，影响约 4% 的支付请求；根因是配置变更缺少灰度；改进项包括配置双人复核、灰度发布和回滚演练。需要我生成一份可直接贴进文档的版本吗？", at: now - 2 * 24 * 60 * min + 60000 }
      ]
    }
  ];
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ convs: state.convs, currentId: state.currentId }));
  } catch (e) {}
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var d = JSON.parse(raw);
      if (d && Array.isArray(d.convs) && d.convs.length) {
        state.convs = d.convs.filter(function (c) {
          return c && typeof c.id === "string" && Array.isArray(c.messages);
        });
        if (!state.convs.length) state.convs = seed();
        var found = false;
        for (var i = 0; i < state.convs.length; i++) {
          if (state.convs[i].id === d.currentId) found = true;
        }
        state.currentId = found ? d.currentId : state.convs[0].id;
        save();
        return;
      }
    }
  } catch (e) {}
  state.convs = seed();
  state.currentId = state.convs[0].id;
  save();
}

function current() {
  for (var i = 0; i < state.convs.length; i++) {
    if (state.convs[i].id === state.currentId) return state.convs[i];
  }
  return state.convs[0] || null;
}

function lastText(conv) {
  for (var i = conv.messages.length - 1; i >= 0; i--) {
    if (conv.messages[i].text) return conv.messages[i].text;
  }
  return "还没有消息";
}

function isTyping(conv) {
  return conv.messages.some(function (m) { return !!m.typing; });
}

function renderList() {
  var q = state.query.trim().toLowerCase();
  var html = "";
  var shown = 0;
  state.convs.forEach(function (conv) {
    var preview = lastText(conv);
    if (q) {
      var hay = (conv.title + " " + preview).toLowerCase();
      if (hay.indexOf(q) < 0) return;
    }
    shown += 1;
    html += '<li class="conv' + (conv.id === state.currentId ? " is-active" : "") + '" data-conv="' + conv.id + '">' +
      '<button class="conv-btn" type="button">' +
        '<span class="conv-title">' + escapeHtml(conv.title) + "</span>" +
        '<span class="conv-preview">' + escapeHtml(preview.slice(0, 30)) + "</span>" +
      "</button>" +
      '<button class="conv-del" data-del="' + conv.id + '" type="button" aria-label="删除会话">×</button>' +
    "</li>";
  });
  if (!shown) html = '<li class="conv-empty">没有匹配的会话，换个关键词试试。</li>';
  convListEl.innerHTML = html;
}

function renderHeader() {
  var conv = current();
  if (!conv) return;
  $("#conv-title").textContent = conv.title;
  var count = conv.messages.length;
  $("#conv-meta").textContent = count ? count + " 条消息 · 上次更新 " + relTime(conv.updatedAt) : "开始聊天吧 · 消息会保存在本地";
}

function botAvatar() {
  return '<span class="bot-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg></span>';
}

function messageHtml(m) {
  var time = m.typing ? "" : '<span class="msg-time">' + clock(m.at) + "</span>";
  if (m.role === "user") {
    return '<div class="msg msg-user" data-id="' + m.id + '"><div class="msg-wrap"><div class="bubble"><p class="msg-text">' +
      escapeHtml(m.text) + '</p></div>' + time + "</div></div>";
  }
  var inner = m.typing
    ? '<span class="typing" aria-label="正在输入"><i></i><i></i><i></i></span>'
    : '<p class="msg-text">' + escapeHtml(m.text) + "</p>";
  return '<div class="msg msg-bot" data-id="' + m.id + '">' + botAvatar() +
    '<div class="msg-wrap"><div class="bubble">' + inner + '</div>' + time + "</div></div>";
}

function renderStream() {
  var conv = current();
  if (!conv) return;
  if (!conv.messages.length) {
    streamEl.innerHTML = '<div class="empty-state">' +
      '<span class="empty-mark">' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>' + "</span>" +
      "<h2>今天想一起想点什么？</h2>" +
      "<p>这是一个本地演示的 AI 助手：回答来自内置模板，但会话、输入状态和保存逻辑都是真的。</p>" +
      '<div class="suggestions">' +
        '<button class="sugg" data-sugg="帮我写一份本周周报，重点写支付模块和登录页" type="button">帮我写一份本周周报</button>' +
        '<button class="sugg" data-sugg="解释一下 useEffect 的依赖数组应该怎么写" type="button">解释 useEffect 依赖数组</button>' +
        '<button class="sugg" data-sugg="把刚才的会议讨论整理成纪要和待办" type="button">整理会议纪要与待办</button>' +
        '<button class="sugg" data-sugg="帮我复盘一次线上故障，尽量客观" type="button">复盘一次线上故障</button>' +
      "</div>" +
    "</div>";
    return;
  }
  var html = "";
  conv.messages.forEach(function (m) { html += messageHtml(m); });
  streamEl.innerHTML = html;
}

function scrollBottom() {
  streamEl.scrollTop = streamEl.scrollHeight;
}

function updateComposer() {
  var conv = current();
  sendEl.disabled = !conv || !inputEl.value.trim() || isTyping(conv);
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(110, inputEl.scrollHeight) + "px";
}

function renderAll() {
  renderList();
  renderHeader();
  renderStream();
  updateComposer();
  scrollBottom();
}

function replyFor(text) {
  var t = String(text || "");
  if (t.indexOf("周报") >= 0) {
    return "可以。建议按「本周完成 / 进行中 / 风险与求助」三段来写，每段不超过三条，并给出负责人和时间。你把具体条目贴给我，我帮你压缩到 300 字以内，再补一句下周的重点，主管一眼就能读完。";
  }
  if (t.indexOf("useEffect") >= 0 || t.indexOf("代码") >= 0 || t.indexOf("bug") >= 0) {
    return "先把问题拆成「现象 / 触发条件 / 期望」三步。如果是 React 的 effect 问题，优先检查依赖数组是否漏了变量；如果是线上 bug，先看最近一次变更和灰度范围。把最小复现代码贴给我，我可以帮你定位到具体是哪一行。";
  }
  if (t.indexOf("会议") >= 0 || t.indexOf("纪要") >= 0) {
    return "好，我按「结论 / 待办 / 待确认」三类整理：结论写明已经拍板的事，待办带上负责人和截止时间，待确认单独列出来，避免会上没聊清楚的问题被当成结论。你可以先把原始笔记发我。";
  }
  if (t.indexOf("复盘") >= 0 || t.indexOf("故障") >= 0) {
    return "复盘建议按时间线、影响面、根因、改进项四段写，语气保持客观，不追责个人。改进项要能落到人和时间：谁在什么时候完成什么验证。确认后我可以帮你生成一份可以直接贴进文档的版本。";
  }
  if (t.indexOf("起名") >= 0 || t.indexOf("名字") >= 0) {
    return "给产品起名先定三条口径：能一眼看懂是做什么的、两个词以内、念出来不别扭。你可以先给我三个候选，我帮你按「清晰度 / 记忆度 / 扩展性」打分，再选出最稳的一个。";
  }
  if (t.indexOf("计划") >= 0 || t.indexOf("学习") >= 0) {
    return "把目标拆成每周可交付的小块最有效：每周固定三小时，分成「读文档 / 写练习 / 复盘」三段，周末做一次十分钟自测。告诉我你想学的方向和时间预算，我帮你排出十二周的具体安排。";
  }
  if (t.indexOf("你好") >= 0 || t.indexOf("hi") >= 0) {
    return "你好，我是 Thread。可以帮你写周报、整理会议纪要、解释代码或做复盘。直接说你现在要处理的事，我们边聊边把它拆成可执行的小步骤。";
  }
  return "我理解你的意思了。先把目标写成一句话，再列出三个已知条件和两个不确定点，通常就能看出下一步该做什么。你可以继续补充细节，我会和你一起把方案收敛到可以直接执行的版本。";
}

function pickReply(text) {
  return replyFor(text);
}

function send(text) {
  var conv = current();
  if (!conv) return;
  var value = String(text || "").trim();
  if (!value || isTyping(conv)) return;

  var userMsg = { id: uid(), role: "user", text: value, at: Date.now() };
  conv.messages.push(userMsg);
  if (conv.title === "新的对话") conv.title = value.slice(0, 16) + (value.length > 16 ? "…" : "");
  conv.updatedAt = Date.now();
  save();

  var botMsg = { id: uid(), role: "assistant", text: "", typing: true, at: Date.now() };
  conv.messages.push(botMsg);
  state.query = "";
  searchEl.value = "";
  inputEl.value = "";
  renderAll();
  scrollBottom();

  var convId = conv.id;
  var prompt = value;
  window.setTimeout(function () { startTyping(convId, botMsg, prompt); }, 460);
}

function startTyping(convId, msg, prompt) {
  var full = pickReply(prompt);
  var conv = null;
  for (var i = 0; i < state.convs.length; i++) {
    if (state.convs[i].id === convId) conv = state.convs[i];
  }
  var token = ++genToken;
  if (!conv || state.currentId !== convId) {
    msg.text = full;
    msg.typing = false;
    if (conv) { conv.updatedAt = Date.now(); }
    save();
    return;
  }
  msg.typing = false;
  msg.at = Date.now();
  renderStream();
  scrollBottom();
  var idx = 0;
  var timer = window.setInterval(function () {
    if (token !== genToken) {
      window.clearInterval(timer);
      msg.text = full;
      msg.typing = false;
      save();
      return;
    }
    idx += 2;
    msg.text = full.slice(0, idx);
    var el = streamEl.querySelector('[data-id="' + msg.id + '"] .msg-text');
    if (el) el.textContent = msg.text;
    scrollBottom();
    if (idx >= full.length) {
      window.clearInterval(timer);
      msg.text = full;
      msg.typing = false;
      conv.updatedAt = Date.now();
      save();
      renderAll();
    }
  }, 16);
}

function closeDrawer() {
  $("#sidebar").classList.remove("is-open");
  $("#drawer-scrim").hidden = true;
}

function openDrawer() {
  $("#sidebar").classList.add("is-open");
  $("#drawer-scrim").hidden = false;
}

function switchConv(id) {
  if (state.currentId === id) { closeDrawer(); return; }
  genToken += 1;
  state.currentId = id;
  save();
  renderAll();
  closeDrawer();
}

function newConv() {
  genToken += 1;
  var conv = { id: uid(), title: "新的对话", messages: [], updatedAt: Date.now() };
  state.convs.unshift(conv);
  state.currentId = conv.id;
  state.query = "";
  searchEl.value = "";
  save();
  renderAll();
  closeDrawer();
  inputEl.focus();
}

function deleteConv(id) {
  genToken += 1;
  state.convs = state.convs.filter(function (c) { return c.id !== id; });
  if (!state.convs.length) {
    state.convs = [{ id: uid(), title: "新的对话", messages: [], updatedAt: Date.now() }];
  }
  if (state.currentId === id) state.currentId = state.convs[0].id;
  save();
  renderAll();
}

function closestAttr(node, name) {
  while (node && node !== document.body) {
    if (node.hasAttribute && node.hasAttribute(name)) return node;
    node = node.parentNode;
  }
  return null;
}

convListEl.addEventListener("click", function (e) {
  var del = closestAttr(e.target, "data-del");
  if (del) { deleteConv(del.getAttribute("data-del")); return; }
  var row = closestAttr(e.target, "data-conv");
  if (row) switchConv(row.getAttribute("data-conv"));
});

streamEl.addEventListener("click", function (e) {
  var sugg = closestAttr(e.target, "data-sugg");
  if (!sugg) return;
  send(sugg.getAttribute("data-sugg"));
});

$("#composer").addEventListener("submit", function (e) {
  e.preventDefault();
  send(inputEl.value);
});

inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send(inputEl.value);
  }
});

inputEl.addEventListener("input", updateComposer);

searchEl.addEventListener("input", function () {
  state.query = searchEl.value;
  renderList();
});

$("#new-conv").addEventListener("click", newConv);
$("#delete-conv").addEventListener("click", function () {
  var conv = current();
  if (conv) deleteConv(conv.id);
});
$("#menu-btn").addEventListener("click", function () {
  if ($("#sidebar").classList.contains("is-open")) closeDrawer();
  else openDrawer();
});
$("#drawer-scrim").addEventListener("click", closeDrawer);

load();
renderAll();
`,
  };
}

export const chatRecipe: Recipe = {
  id: "chat",
  label: "AI 聊天",
  keywords: ["聊天", "chat", "对话", "会话", "流式", "打字", "ai 聊天", "消息"],
  build,
};

export default chatRecipe;
