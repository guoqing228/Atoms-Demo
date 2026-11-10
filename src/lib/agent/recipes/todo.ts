import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Reference recipe — the canonical quality bar for the mock generator.
 * Real interactions: add / edit / toggle / filter / drag-reorder / bulk-clear,
 * persisted to localStorage.
 */
function build(ctx: RecipeContext): RecipeOutput {
  return {
    name: "Focus List",
    tagline: "把事情排好队，一次只专注一件",
    summary:
      "一个轻量待办清单：快速录入、优先级标记、拖拽排序、按状态筛选，数据保存在浏览器本地，刷新不丢。",
    features: [
      { icon: "zap", title: "快速录入", detail: "回车即添加，支持高/中/低优先级" },
      { icon: "grip", title: "拖拽排序", detail: "按住任意任务拖动即可重排" },
      { icon: "filter", title: "状态筛选", detail: "全部 / 进行中 / 已完成一键切换" },
      { icon: "database", title: "本地持久化", detail: "localStorage 自动保存，离线可用" },
    ],
    body: `
  <main class="app">
    <header class="hero">
      <div>
        <p class="eyebrow">FOCUS LIST</p>
        <h1>今天要完成什么？</h1>
      </div>
      <div class="stats">
        <div class="stat"><strong id="stat-done">0</strong><span>已完成</span></div>
        <div class="stat"><strong id="stat-left">0</strong><span>待处理</span></div>
      </div>
    </header>

    <form class="composer" id="composer">
      <input id="input" type="text" placeholder="输入任务，回车添加…" autocomplete="off" maxlength="120" />
      <select id="priority" aria-label="优先级">
        <option value="high">高优先</option>
        <option value="mid" selected>普通</option>
        <option value="low">低优先</option>
      </select>
      <button type="submit" class="add" id="add">添加</button>
    </form>

    <div class="toolbar">
      <div class="filters" role="tablist">
        <button class="chip is-active" data-filter="all" role="tab">全部 <em id="count-all">0</em></button>
        <button class="chip" data-filter="active" role="tab">进行中 <em id="count-active">0</em></button>
        <button class="chip" data-filter="done" role="tab">已完成 <em id="count-done">0</em></button>
      </div>
      <button class="ghost" id="clear-done">清除已完成</button>
    </div>

    <ul class="list" id="list" aria-label="任务列表"></ul>
    <p class="empty" id="empty" hidden>还没有任务，先加上第一件小事吧。</p>

    <footer class="foot">拖动任务可排序 · 双击编辑 · 数据仅保存在你的浏览器</footer>
  </main>`,
    css: `
.app{max-width:760px;margin:0 auto;padding:56px 24px 80px}
.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:28px}
.eyebrow{font-size:11px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:10px}
h1{font-size:clamp(28px,4vw,40px);line-height:1.15;letter-spacing:-.02em;font-weight:700}
.stats{display:flex;gap:20px;flex-shrink:0}
.stat{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.stat strong{font-size:26px;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
.stat span{font-size:11px;color:var(--muted)}
.composer{display:flex;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px;margin-bottom:18px;transition:border-color .2s, box-shadow .2s}
.composer:focus-within{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 12%,transparent)}
.composer input{flex:1;min-width:0;background:transparent;border:none;outline:none;padding:10px 12px;font-size:15px}
.composer input::placeholder{color:color-mix(in srgb,var(--muted) 85%,transparent)}
.composer select{background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 4px);padding:8px 10px;font-size:13px;outline:none;color:var(--muted)}
.add{background:var(--accent);color:color-mix(in srgb,var(--bg) 88%,#000);font-weight:700;padding:0 20px;border-radius:calc(var(--radius) - 4px);font-size:14px;transition:transform .15s, filter .15s}
.add:hover{filter:brightness(1.08)}
.add:active{transform:scale(.97)}
.toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.filters{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-size:13px;color:var(--muted);padding:6px 12px;border-radius:999px;border:1px solid transparent;transition:all .15s}
.chip em{font-style:normal;opacity:.6;font-size:11px;margin-left:2px}
.chip:hover{color:var(--text);background:var(--surface)}
.chip.is-active{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 40%,transparent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.ghost{font-size:12.5px;color:var(--muted);padding:6px 10px;border-radius:8px;transition:all .15s}
.ghost:hover{color:var(--text);background:var(--surface)}
.list{display:flex;flex-direction:column;gap:8px}
.item{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:13px 14px;cursor:grab;transition:border-color .15s, transform .15s, opacity .15s;animation:in .22s ease both}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.item:hover{border-color:color-mix(in srgb,var(--text) 18%,transparent)}
.item.dragging{opacity:.4;transform:scale(.99);cursor:grabbing}
.item.drop-target{border-color:var(--accent);box-shadow:inset 0 2px 0 var(--accent)}
.item.p-high{border-left:3px solid #ff6b6b}
.item.p-mid{border-left:3px solid var(--accent2)}
.item.p-low{border-left:3px solid color-mix(in srgb,var(--muted) 60%,transparent)}
.item.done .title{color:var(--muted);text-decoration:line-through}
.item.done{opacity:.66}
.check{width:20px;height:20px;flex-shrink:0;border:1.5px solid color-mix(in srgb,var(--muted) 70%,transparent);border-radius:6px;display:grid;place-items:center;transition:all .15s}
.item.done .check{background:var(--accent);border-color:var(--accent)}
.check svg{width:12px;height:12px;opacity:0;stroke:color-mix(in srgb,var(--bg) 88%,#000);stroke-width:3;fill:none}
.item.done .check svg{opacity:1}
.title{flex:1;min-width:0;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.title[contenteditable="true"]{outline:none;white-space:normal;text-decoration:none;color:var(--text)}
.title-input{flex:1;min-width:0;background:var(--bg);border:1px solid var(--accent);border-radius:6px;padding:4px 8px;font-size:14.5px;outline:none}
.pri{font-size:10.5px;letter-spacing:.04em;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:3px 8px;flex-shrink:0}
.del{color:var(--muted);opacity:0;padding:4px;border-radius:6px;transition:all .15s;flex-shrink:0;line-height:0}
.item:hover .del{opacity:1}
.del:hover{color:#ff6b6b;background:color-mix(in srgb,#ff6b6b 12%,transparent)}
.empty{text-align:center;color:var(--muted);font-size:14px;padding:52px 0}
.foot{margin-top:34px;text-align:center;font-size:11.5px;color:var(--muted);opacity:.75}
@media (max-width:560px){
  .app{padding:36px 16px 60px}
  .hero{flex-direction:column;align-items:flex-start;gap:16px}
  .composer{flex-wrap:wrap}
  .composer input{flex-basis:100%}
  .composer select{flex:1}
  .add{flex:1}
}`,
    js: `
var KEY = "vf:todo:v1";
var state = { items: [], filter: "all", dragId: null };

function uid() { return Math.random().toString(36).slice(2, 10); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state.items)); } catch (e) {} }
function seed() {
  var now = Date.now();
  return [
    { id: uid(), text: "把笔试 Demo 的 PR 描述写清楚", pri: "high", done: false, createdAt: now - 5000 },
    { id: uid(), text: "回复产品评审的三条评论", pri: "high", done: false, createdAt: now - 4000 },
    { id: uid(), text: "读完《芯片简史》第 6 章", pri: "mid", done: false, createdAt: now - 3000 },
    { id: uid(), text: "给周报补上本周数据", pri: "mid", done: true, createdAt: now - 2000 },
    { id: uid(), text: "预约下周的牙医", pri: "low", done: false, createdAt: now - 1000 },
    { id: uid(), text: "跑步 5 公里", pri: "low", done: true, createdAt: now - 500 }
  ];
}
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) { state.items = parsed; return; }
    }
  } catch (e) {}
  state.items = seed();
  save();
}

var $ = function (sel) { return document.querySelector(sel); };
var listEl = $("#list"), emptyEl = $("#empty"), inputEl = $("#input"), priEl = $("#priority");

var PRI_LABEL = { high: "高优先", mid: "普通", low: "低优先" };

function visible() {
  if (state.filter === "active") return state.items.filter(function (t) { return !t.done; });
  if (state.filter === "done") return state.items.filter(function (t) { return t.done; });
  return state.items;
}

function render() {
  var items = visible();
  listEl.innerHTML = "";
  items.forEach(function (t) {
    var li = document.createElement("li");
    li.className = "item p-" + t.pri + (t.done ? " done" : "");
    li.draggable = true;
    li.dataset.id = t.id;
    li.innerHTML =
      '<span class="check" role="checkbox" aria-checked="' + t.done + '" tabindex="0">' +
        '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>' +
      "</span>" +
      '<span class="title" title="双击编辑">' + escapeHtml(t.text) + "</span>" +
      '<span class="pri">' + PRI_LABEL[t.pri] + "</span>" +
      '<button class="del" title="删除" aria-label="删除">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>' +
      "</button>";

    li.querySelector(".check").addEventListener("click", function () { toggle(t.id); });
    li.querySelector(".check").addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(t.id); }
    });
    li.querySelector(".del").addEventListener("click", function () { remove(t.id); });
    li.querySelector(".title").addEventListener("dblclick", function () { startEdit(li, t.id); });

    li.addEventListener("dragstart", function (e) {
      state.dragId = t.id; li.classList.add("dragging");
      try { e.dataTransfer.setData("text/plain", t.id); } catch (err) {}
      e.dataTransfer.effectAllowed = "move";
    });
    li.addEventListener("dragend", function () { li.classList.remove("dragging"); clearTargets(); });
    li.addEventListener("dragover", function (e) { e.preventDefault(); li.classList.add("drop-target"); });
    li.addEventListener("dragleave", function () { li.classList.remove("drop-target"); });
    li.addEventListener("drop", function (e) {
      e.preventDefault(); li.classList.remove("drop-target");
      if (state.dragId && state.dragId !== t.id) reorder(state.dragId, t.id);
    });
    listEl.appendChild(li);
  });
  emptyEl.hidden = items.length > 0;
  updateStats();
}

function clearTargets() {
  Array.prototype.forEach.call(listEl.children, function (el) { el.classList.remove("drop-target"); });
}

function updateStats() {
  var done = state.items.filter(function (t) { return t.done; }).length;
  var all = state.items.length;
  $("#stat-done").textContent = done;
  $("#stat-left").textContent = all - done;
  $("#count-all").textContent = all;
  $("#count-active").textContent = all - done;
  $("#count-done").textContent = done;
}

function add(text, pri) {
  text = (text || "").trim();
  if (!text) return;
  state.items.unshift({ id: uid(), text: text, pri: pri, done: false, createdAt: Date.now() });
  save(); render();
}

function toggle(id) {
  state.items.forEach(function (t) { if (t.id === id) t.done = !t.done; });
  save(); render();
}

function remove(id) {
  state.items = state.items.filter(function (t) { return t.id !== id; });
  save(); render();
}

function reorder(fromId, toId) {
  var from = -1, to = -1;
  state.items.forEach(function (t, i) { if (t.id === fromId) from = i; if (t.id === toId) to = i; });
  if (from < 0 || to < 0) return;
  var moved = state.items.splice(from, 1)[0];
  state.items.splice(to, 0, moved);
  save(); render();
}

function startEdit(li, id) {
  var title = li.querySelector(".title");
  var original = title.textContent;
  var input = document.createElement("input");
  input.className = "title-input";
  input.value = original;
  title.replaceWith(input);
  input.focus(); input.select();
  var commit = function (saveIt) {
    var v = input.value.trim();
    if (saveIt && v) {
      state.items.forEach(function (t) { if (t.id === id) t.text = v; });
      save();
    }
    render();
  };
  input.addEventListener("blur", function () { commit(true); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); commit(true); }
    if (e.key === "Escape") { e.preventDefault(); commit(false); }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

$("#composer").addEventListener("submit", function (e) {
  e.preventDefault();
  add(inputEl.value, priEl.value);
  inputEl.value = "";
  inputEl.focus();
});

$("#clear-done").addEventListener("click", function () {
  state.items = state.items.filter(function (t) { return !t.done; });
  save(); render();
});

Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
  chip.addEventListener("click", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (c) { c.classList.remove("is-active"); });
    chip.classList.add("is-active");
    state.filter = chip.dataset.filter;
    render();
  });
});

load();
render();
inputEl.focus();
`,
  };
}

export const todoRecipe: Recipe = {
  id: "todo",
  label: "待办清单",
  keywords: ["待办", "todo", "任务", "清单", "checklist", "task", "to-do", "todolist"],
  build,
};

export default todoRecipe;
