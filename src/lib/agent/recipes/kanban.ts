import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Kanban board — 三列看板，卡片跨列拖拽 / 增删改 / 优先级 / 本地持久化。
 * 信息架构：横向列式看板（不是卡片网格）。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Kanban Studio",
    tagline: "三列流转，把每张卡推到终点",
    summary:
      "一个产品冲刺看板：待办 / 进行中 / 已完成三列，卡片可拖动跨列、按优先级标识、双击改名、逐列新建，支持触屏移动按钮与本地持久化。",
    features: [
      { icon: "columns", title: "三列看板", detail: "待办 / 进行中 / 已完成，一眼看清进度" },
      { icon: "grip", title: "拖拽跨列", detail: "拖动卡片即可换列，附带方向按钮兜底" },
      { icon: "plus", title: "就地新建", detail: "每列都能加卡片，回车即提交" },
      { icon: "database", title: "本地保存", detail: "localStorage 自动持久化，刷新不丢" },
    ],
    body: `
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <rect x="3" y="3" width="6" height="18" rx="1.6"/><rect x="10.5" y="3" width="6" height="11" rx="1.6"/><rect x="18" y="3" width="3" height="14" rx="1.4"/>
          </svg>
        </span>
        <div class="brand-text">
          <p class="eyebrow">PRODUCT SPRINT · 第 12 周</p>
          <h1>本周看板</h1>
        </div>
      </div>
      <dl class="metrics">
        <div class="metric"><dt>全部卡片</dt><dd id="m-all">0</dd></div>
        <div class="metric"><dt>已完成</dt><dd id="m-done">0</dd></div>
        <div class="metric"><dt>完成度</dt><dd id="m-rate">0%</dd></div>
      </dl>
    </header>

    <div class="board" id="board" aria-label="看板列"></div>

    <footer class="foot">
      <span>拖动卡片可在列间移动</span><span class="sep">·</span>
      <span>双击标题改名</span><span class="sep">·</span>
      <span>数据仅保存在你的浏览器</span>
    </footer>
  </main>`,
    css: `
.app{max-width:1080px;margin:0 auto;padding:44px 32px 72px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px}
.brand{display:flex;align-items:center;gap:13px}
.logo{width:38px;height:38px;display:grid;place-items:center;flex:0 0 auto;border:1px solid var(--border);border-radius:calc(var(--radius) + 2px);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}
.brand-text .eyebrow{font-size:10.5px;letter-spacing:.16em;color:var(--muted);font-weight:600;margin-bottom:5px}
h1{font-size:clamp(24px,3vw,30px);line-height:1.1;letter-spacing:-.02em;font-weight:650}
.metrics{display:flex;gap:26px;margin:0}
.metric dt{font-size:11px;color:var(--muted);margin-bottom:3px}
.metric dd{margin:0;font-size:22px;line-height:1;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.metric dd#m-done{color:var(--accent)}
.board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
.column{background:color-mix(in srgb,var(--text) 3%,transparent);border:1px solid var(--border);border-radius:var(--radius);padding:12px 12px 10px;transition:background .16s ease}
.col-head{display:flex;align-items:center;gap:8px;padding:2px 4px 10px}
.dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;background:var(--muted)}
.column[data-col="doing"] .dot{background:var(--accent2)}
.column[data-col="done"] .dot{background:var(--accent)}
.col-head h2{font-size:13px;font-weight:600;letter-spacing:.01em}
.col-head em{font-style:normal;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;margin-right:auto}
.col-add{width:24px;height:24px;display:grid;place-items:center;border-radius:7px;color:var(--muted);font-size:16px;line-height:1;transition:background .14s ease,color .14s ease}
.col-add:hover,.col-add:focus-visible{background:color-mix(in srgb,var(--text) 7%,transparent);color:var(--text)}
.col-add:active{transform:scale(.94)}
.cards{display:flex;flex-direction:column;gap:8px;min-height:52px;border-radius:calc(var(--radius) - 3px);transition:background .14s ease}
.cards.is-over{background:color-mix(in srgb,var(--accent) 8%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 38%,transparent)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) - 2px);padding:10px 11px;cursor:grab;box-shadow:0 1px 2px color-mix(in srgb,var(--text) 4%,transparent);transition:border-color .14s ease,transform .14s ease,opacity .14s ease}
.card:hover{border-color:color-mix(in srgb,var(--text) 20%,transparent)}
.card:active{cursor:grabbing}
.card.dragging{opacity:.42;transform:scale(.985)}
.card-title{font-size:13.5px;line-height:1.5;letter-spacing:-.005em;margin:7px 0 8px;word-break:break-word}
.card.is-done .card-title{color:var(--muted);text-decoration:line-through}
.card-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.pri{font-size:10px;letter-spacing:.03em;padding:2px 6px;border-radius:5px;font-weight:600;border:1px solid transparent}
.pri-high{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 13%,transparent);border-color:color-mix(in srgb,var(--accent2) 26%,transparent)}
.pri-mid{color:var(--accent);background:color-mix(in srgb,var(--accent) 11%,transparent);border-color:color-mix(in srgb,var(--accent) 24%,transparent)}
.pri-low{color:var(--muted);background:color-mix(in srgb,var(--text) 6%,transparent);border-color:var(--border)}
.tag{font-size:10px;color:var(--muted);padding:2px 6px;border-radius:5px;border:1px solid var(--border)}
.card-actions{display:flex;gap:4px;justify-content:flex-end;opacity:0;transition:opacity .14s ease}
.card:hover .card-actions,.card:focus-within .card-actions{opacity:1}
.mini{width:24px;height:22px;display:grid;place-items:center;border-radius:6px;font-size:13px;line-height:1;color:var(--muted);transition:background .14s ease,color .14s ease}
.mini:hover,.mini:focus-visible{background:color-mix(in srgb,var(--text) 8%,transparent);color:var(--text)}
.mini-del:hover{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 12%,transparent)}
.title-edit{width:100%;margin:7px 0 8px;background:var(--bg);border:1px solid color-mix(in srgb,var(--accent) 65%,transparent);border-radius:6px;padding:5px 8px;font-size:13.5px;outline:none}
.add-trigger{width:100%;text-align:left;padding:8px 9px;border-radius:calc(var(--radius) - 3px);font-size:12.5px;color:var(--muted);transition:background .14s ease,color .14s ease}
.add-trigger:hover,.add-trigger:focus-visible{background:color-mix(in srgb,var(--text) 5%,transparent);color:var(--text)}
.add-form{margin-top:6px;display:flex;flex-direction:column;gap:6px}
.add-input{width:100%;background:var(--surface);border:1px solid color-mix(in srgb,var(--accent) 55%,transparent);border-radius:calc(var(--radius) - 3px);padding:8px 9px;font-size:13px;outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 11%,transparent)}
.add-input::placeholder{color:color-mix(in srgb,var(--muted) 82%,transparent)}
.add-row{display:flex;gap:6px}
.add-pri{flex:1;min-width:0;background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:6px 8px;font-size:12px;color:var(--muted);outline:none}
.add-row button{background:var(--accent);color:var(--bg);font-weight:650;font-size:12px;padding:0 13px;border-radius:7px;transition:filter .14s ease,transform .14s ease}
.add-row button:hover{filter:brightness(1.06)}
.add-row button:active{transform:scale(.97)}
.foot{margin-top:30px;text-align:center;font-size:11.5px;color:var(--muted);opacity:.8}
.sep{margin:0 8px;opacity:.5}
button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:820px){
  .board{grid-template-columns:1fr}
  .app{padding:28px 16px 56px}
  .top{margin-bottom:20px}
  .metrics{gap:20px;width:100%}
  .card-actions{opacity:1}
  .foot{display:none}
}
@media (prefers-reduced-motion:reduce){
  .card,.column,.cards,.add-input{transition:none}
}`,
    js: `
var KEY = "vf:kanban:v1";
var COLS = [
  { id: "todo", name: "待办", hint: "还没开始" },
  { id: "doing", name: "进行中", hint: "正在推进" },
  { id: "done", name: "已完成", hint: "验收通过" }
];
var PRI_LABEL = { high: "高优先", mid: "普通", low: "低优先" };
var state = { cards: [], dragId: null, openForm: null };

function uid() { return "c" + Math.random().toString(36).slice(2, 9); }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ cards: state.cards })); } catch (e) {}
}

function seed() {
  var now = Date.now();
  return [
    { id: uid(), col: "todo", title: "首页空状态插画对齐新品牌色", tag: "设计", pri: "high", createdAt: now - 9000 },
    { id: uid(), col: "todo", title: "补齐用量统计埋点（生成 / 预览 / 导出）", tag: "数据", pri: "mid", createdAt: now - 8000 },
    { id: uid(), col: "todo", title: "375px 下导航折叠的交互稿", tag: "前端", pri: "mid", createdAt: now - 7000 },
    { id: uid(), col: "doing", title: "重构生成器流式输出的状态机", tag: "前端", pri: "high", createdAt: now - 6000 },
    { id: uid(), col: "doing", title: "设计卡片拖拽的落位反馈", tag: "设计", pri: "mid", createdAt: now - 5000 },
    { id: uid(), col: "doing", title: "整理 6 个配方的文案口径", tag: "文档", pri: "low", createdAt: now - 4000 },
    { id: uid(), col: "done", title: "升级 localStorage 到 v1 结构", tag: "前端", pri: "mid", createdAt: now - 3000 },
    { id: uid(), col: "done", title: "暗色主题对比度评审通过", tag: "评审", pri: "low", createdAt: now - 2000 }
  ];
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.cards) && parsed.cards.length) {
        state.cards = parsed.cards.filter(function (c) {
          return c && typeof c.id === "string" && typeof c.title === "string" && inCols(c.col);
        });
      }
    }
  } catch (e) {}
  if (!state.cards.length) { state.cards = seed(); save(); }
}

function inCols(id) {
  for (var i = 0; i < COLS.length; i++) { if (COLS[i].id === id) return true; }
  return false;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function cardsIn(colId) {
  return state.cards.filter(function (c) { return c.col === colId; });
}

function findCard(id) {
  for (var i = 0; i < state.cards.length; i++) { if (state.cards[i].id === id) return state.cards[i]; }
  return null;
}

var board = document.getElementById("board");

function cardHtml(c) {
  var done = c.col === "done";
  var pri = PRI_LABEL[c.pri] ? c.pri : "mid";
  var h = '<li class="card' + (done ? ' is-done' : '') + '" draggable="true" data-id="' + c.id + '">';
  h += '<div class="card-meta"><span class="pri pri-' + pri + '">' + PRI_LABEL[pri] + '</span>';
  if (c.tag) h += '<span class="tag">' + escapeHtml(c.tag) + '</span>';
  h += '</div>';
  h += '<p class="card-title" title="双击编辑">' + escapeHtml(c.title) + '</p>';
  h += '<div class="card-actions">';
  h += '<button class="mini" data-act="left" data-id="' + c.id + '" title="移到上一列" aria-label="移到上一列">←</button>';
  h += '<button class="mini" data-act="right" data-id="' + c.id + '" title="移到下一列" aria-label="移到下一列">→</button>';
  h += '<button class="mini mini-del" data-act="del" data-id="' + c.id + '" title="删除" aria-label="删除卡片">×</button>';
  h += '</div></li>';
  return h;
}

function render() {
  var h = "";
  COLS.forEach(function (col) {
    var list = cardsIn(col.id);
    h += '<section class="column" data-col="' + col.id + '">';
    h += '<header class="col-head"><span class="dot" aria-hidden="true"></span><h2>' + col.name + '</h2>';
    h += '<em>' + list.length + '</em>';
    h += '<button class="col-add" data-add="' + col.id + '" title="新建卡片" aria-label="在' + col.name + '新建卡片">＋</button></header>';
    h += '<ul class="cards" data-col="' + col.id + '">';
    list.forEach(function (c) { h += cardHtml(c); });
    h += '</ul>';
    if (state.openForm === col.id) {
      h += '<form class="add-form" data-form="' + col.id + '">';
      h += '<input class="add-input" type="text" maxlength="60" placeholder="卡片标题，回车添加…" autocomplete="off" aria-label="卡片标题" />';
      h += '<div class="add-row"><select class="add-pri" aria-label="优先级"><option value="mid">普通</option><option value="high">高优先</option><option value="low">低优先</option></select>';
      h += '<button type="submit">添加</button></div></form>';
    } else {
      h += '<button class="add-trigger" data-add="' + col.id + '">＋ 添加卡片</button>';
    }
    h += '</section>';
  });
  board.innerHTML = h;
  updateMetrics();
  if (state.openForm) {
    var input = board.querySelector('.add-form[data-form="' + state.openForm + '"] .add-input');
    if (input) input.focus();
  }
}

function updateMetrics() {
  var total = state.cards.length;
  var done = cardsIn("done").length;
  document.getElementById("m-all").textContent = total;
  document.getElementById("m-done").textContent = done;
  document.getElementById("m-rate").textContent = (total ? Math.round((done / total) * 100) : 0) + "%";
}

function moveCard(id, col, beforeId) {
  var from = -1;
  for (var i = 0; i < state.cards.length; i++) { if (state.cards[i].id === id) from = i; }
  if (from < 0) return;
  var card = state.cards[from];
  if (card.col === col && (!beforeId || beforeId === card.id)) return;
  state.cards.splice(from, 1);
  card.col = col;
  var at = -1;
  if (beforeId) {
    for (var j = 0; j < state.cards.length; j++) { if (state.cards[j].id === beforeId) at = j; }
  }
  if (at < 0) {
    at = state.cards.length;
    for (var k = 0; k < state.cards.length; k++) { if (state.cards[k].col === col) at = k + 1; }
  }
  state.cards.splice(at, 0, card);
  save(); render();
}

function shiftCard(id, dir) {
  var card = findCard(id);
  if (!card) return;
  var ci = -1;
  for (var i = 0; i < COLS.length; i++) { if (COLS[i].id === card.col) ci = i; }
  var ni = ci + dir;
  if (ni < 0 || ni >= COLS.length) return;
  moveCard(id, COLS[ni].id, null);
}

function removeCard(id) {
  state.cards = state.cards.filter(function (c) { return c.id !== id; });
  save(); render();
}

function addCard(colId, title, pri) {
  title = (title || "").trim();
  if (!title) return false;
  state.cards.push({ id: uid(), col: colId, title: title, tag: "", pri: pri || "mid", createdAt: Date.now() });
  save(); render();
  return true;
}

function startEdit(titleEl) {
  var cardEl = titleEl.closest(".card");
  var card = cardEl ? findCard(cardEl.getAttribute("data-id")) : null;
  if (!card) return;
  var input = document.createElement("input");
  input.className = "title-edit";
  input.value = card.title;
  input.maxLength = 60;
  titleEl.replaceWith(input);
  input.focus();
  input.select();
  var closed = false;
  function commit(ok) {
    if (closed) return;
    closed = true;
    var v = input.value.trim();
    if (ok && v) { card.title = v; save(); }
    render();
  }
  input.addEventListener("blur", function () { commit(true); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); commit(true); }
    else if (e.key === "Escape") { e.preventDefault(); commit(false); }
  });
}

board.addEventListener("click", function (e) {
  var target = e.target;
  var addBtn = target.closest("[data-add]");
  if (addBtn) {
    var colId = addBtn.getAttribute("data-add");
    state.openForm = state.openForm === colId ? null : colId;
    render();
    return;
  }
  var actBtn = target.closest("[data-act]");
  if (!actBtn) return;
  var id = actBtn.getAttribute("data-id");
  var act = actBtn.getAttribute("data-act");
  if (act === "left") shiftCard(id, -1);
  else if (act === "right") shiftCard(id, 1);
  else if (act === "del") removeCard(id);
});

board.addEventListener("dblclick", function (e) {
  var title = e.target.closest(".card-title");
  if (title) { e.preventDefault(); startEdit(title); }
});

board.addEventListener("submit", function (e) {
  var form = e.target.closest(".add-form");
  if (!form) return;
  e.preventDefault();
  var input = form.querySelector(".add-input");
  var pri = form.querySelector(".add-pri");
  var colId = form.getAttribute("data-form");
  if (addCard(colId, input.value, pri.value)) { input.value = ""; input.focus(); }
});

board.addEventListener("dragstart", function (e) {
  var cardEl = e.target.closest(".card");
  if (!cardEl) return;
  state.dragId = cardEl.getAttribute("data-id");
  cardEl.classList.add("dragging");
  try {
    e.dataTransfer.setData("text/plain", state.dragId);
    e.dataTransfer.effectAllowed = "move";
  } catch (err) {}
});

board.addEventListener("dragend", function (e) {
  var cardEl = e.target.closest(".card");
  if (cardEl) cardEl.classList.remove("dragging");
  state.dragId = null;
  clearOver();
});

function clearOver() {
  var lists = board.querySelectorAll(".cards");
  for (var i = 0; i < lists.length; i++) lists[i].classList.remove("is-over");
}

board.addEventListener("dragover", function (e) {
  var list = e.target.closest(".cards");
  if (!list) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  clearOver();
  list.classList.add("is-over");
});

board.addEventListener("drop", function (e) {
  var list = e.target.closest(".cards");
  if (!list || !state.dragId) return;
  e.preventDefault();
  var beforeEl = e.target.closest(".card");
  var beforeId = beforeEl ? beforeEl.getAttribute("data-id") : null;
  moveCard(state.dragId, list.getAttribute("data-col"), beforeId);
  state.dragId = null;
  clearOver();
});

load();
render();
`,
  };
}

export const kanbanRecipe: Recipe = {
  id: "kanban",
  label: "看板",
  keywords: ["看板", "kanban", "拖拽", "卡片", "跨列", "任务板", "board"],
  build,
};

export default kanbanRecipe;
