(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,39423,t=>{"use strict";let e,a;var r=t.i(98470);let n=[{name:"晨雾纸感",mode:"light",bg:"#faf7f0",surface:"#ffffff",text:"#24211b",muted:"#6f685c",accent:"#a65a34",accent2:"#2e5e4c",border:"rgba(36,33,27,0.1)",font:"sans",radius:10,keywords:["温暖","自然","warm","cozy","治愈","手账","日记","阅读","书","复古","retro","咖啡","生活"]},{name:"极简白",mode:"light",bg:"#f7f7f5",surface:"#ffffff",text:"#181816",muted:"#6b6b66",accent:"#2f5d50",accent2:"#a65a34",border:"rgba(24,24,22,0.09)",font:"sans",radius:8,keywords:["极简","minimal","简洁","清爽","商务","business","企业","产品","saas","官网","落地页","landing","crm","客户"]},{name:"海盐蓝",mode:"light",bg:"#f4f7fa",surface:"#ffffff",text:"#1b2430",muted:"#64717f",accent:"#2b5f8a",accent2:"#b06f3c",border:"rgba(27,36,48,0.1)",font:"sans",radius:10,keywords:["数据看板","看板","分析","dashboard","报表","图表","效率工具","cli","开发者"]},{name:"森林呼吸",mode:"light",bg:"#f3f6f1",surface:"#ffffff",text:"#1f2a22",muted:"#67756b",accent:"#2f7a58",accent2:"#a8701c",border:"rgba(31,42,34,0.1)",font:"sans",radius:12,keywords:["绿色","环保","健康","运动","健身","habit","习惯","锻炼","forest","green","番茄","专注"]},{name:"落日暖橙",mode:"light",bg:"#fdf6ee",surface:"#ffffff",text:"#2a211a",muted:"#7c6b5c",accent:"#c05621",accent2:"#2f5d50",border:"rgba(42,33,26,0.1)",font:"sans",radius:10,keywords:["橙","日落","sunset","活力","energetic","旅行","美食","菜谱","food","记账","预算"]},{name:"糖果缤纷",mode:"light",bg:"#fff8f9",surface:"#ffffff",text:"#2b1e24",muted:"#7f6b74",accent:"#c04e78",accent2:"#6f5b9e",border:"rgba(43,30,36,0.09)",font:"sans",radius:14,keywords:["糖果","可爱","candy","粉色","pink","少女","宠物","儿童","卡通","fun","quiz","答题"]},{name:"深海夜色",mode:"dark",bg:"#101722",surface:"#18212f",text:"#e8edf5",muted:"#93a1b8",accent:"#5ad1e6",accent2:"#8b7cf6",border:"rgba(255,255,255,0.09)",font:"sans",radius:12,keywords:["深色","暗黑","夜间","dark","night","科技","终端","黑客","matrix"]},{name:"午夜霓虹",mode:"dark",bg:"#12101a",surface:"#1b1726",text:"#f1e9ff",muted:"#a89bc2",accent:"#c084fc",accent2:"#f472b6",border:"rgba(255,255,255,0.1)",font:"mono",radius:8,keywords:["赛博","cyber","霓虹","neon","未来","futuristic","游戏","game","音乐","music","2048","贪吃蛇"]},{name:"墨色终端",mode:"dark",bg:"#0f1210",surface:"#171c18",text:"#dbe8d6",muted:"#8aa47c",accent:"#9ae34f",accent2:"#2fd0a0",border:"rgba(154,227,79,0.14)",font:"mono",radius:6,keywords:["终端","命令行","命令行工具","cli","shell","vim"]}],i=n.find(t=>"极简白"===t.name)??n[0];function s(t){let e=t.toLowerCase(),a=i,r=0;for(let t of n){let n=0;for(let a of t.keywords)e.includes(a.toLowerCase())&&(n+=a.length>1?2:1);n>r&&(r=n,a=t)}let{keywords:s,...o}=a;return o}let o=[{id:"todo",label:"待办清单",keywords:["待办","todo","任务","清单","checklist","task","to-do","todolist"],build:function(t){return{name:"Focus List",tagline:"把事情排好队，一次只专注一件",summary:"一个轻量待办清单：快速录入、优先级标记、拖拽排序、按状态筛选，数据保存在浏览器本地，刷新不丢。",features:[{icon:"zap",title:"快速录入",detail:"回车即添加，支持高/中/低优先级"},{icon:"grip",title:"拖拽排序",detail:"按住任意任务拖动即可重排"},{icon:"filter",title:"状态筛选",detail:"全部 / 进行中 / 已完成一键切换"},{icon:"database",title:"本地持久化",detail:"localStorage 自动保存，离线可用"}],body:`
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

    <footer class="foot">拖动任务可排序 \xb7 双击编辑 \xb7 数据仅保存在你的浏览器</footer>
  </main>`,css:`
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
}`,js:`
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
`}}},{id:"kanban",label:"看板",keywords:["看板","kanban","拖拽","卡片","跨列","任务板","board"],build:function(t){return{name:"Kanban Studio",tagline:"三列流转，把每张卡推到终点",summary:"一个产品冲刺看板：待办 / 进行中 / 已完成三列，卡片可拖动跨列、按优先级标识、双击改名、逐列新建，支持触屏移动按钮与本地持久化。",features:[{icon:"columns",title:"三列看板",detail:"待办 / 进行中 / 已完成，一眼看清进度"},{icon:"grip",title:"拖拽跨列",detail:"拖动卡片即可换列，附带方向按钮兜底"},{icon:"plus",title:"就地新建",detail:"每列都能加卡片，回车即提交"},{icon:"database",title:"本地保存",detail:"localStorage 自动持久化，刷新不丢"}],body:`
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <rect x="3" y="3" width="6" height="18" rx="1.6"/><rect x="10.5" y="3" width="6" height="11" rx="1.6"/><rect x="18" y="3" width="3" height="14" rx="1.4"/>
          </svg>
        </span>
        <div class="brand-text">
          <p class="eyebrow">PRODUCT SPRINT \xb7 第 12 周</p>
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
      <span>拖动卡片可在列间移动</span><span class="sep">\xb7</span>
      <span>双击标题改名</span><span class="sep">\xb7</span>
      <span>数据仅保存在你的浏览器</span>
    </footer>
  </main>`,css:`
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
}`,js:`
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
  h += '<button class="mini mini-del" data-act="del" data-id="' + c.id + '" title="删除" aria-label="删除卡片">\xd7</button>';
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
`}}},{id:"notes",label:"Markdown 笔记",keywords:["笔记","markdown","md","标签","预览","搜索","notes","notebook","文档"],build:function(t){return{name:"Paper Notes",tagline:"左边写 Markdown，右边即时看到样子",summary:"一个本地 Markdown 笔记应用：分栏写作与实时预览、标签分类、标题正文全文搜索，笔记自动保存到浏览器。",features:[{icon:"columns",title:"分栏写作",detail:"左边 Markdown，右边实时渲染"},{icon:"tag",title:"标签筛选",detail:"按标签归类，点击即筛选"},{icon:"search",title:"全文搜索",detail:"标题、正文和标签一起搜"},{icon:"database",title:"本地保存",detail:"边写边存，刷新不丢"}],body:`
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
  </main>`,css:`
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
}`,js:`
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
      title: "产品周会 \xb7 第 12 周",
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
  document.getElementById("note-count").textContent = state.notes.length + " 篇笔记 \xb7 " + items.length + " 条结果";
  renderTagFilter();
}

function renderTagChips(n) {
  var el = document.getElementById("tag-chips");
  var h = "";
  n.tags.forEach(function (t) {
    h += '<span class="chip">' + escapeHtml(t) + '<button type="button" data-remove-tag="' + escapeHtml(t) + '" aria-label="移除标签' + escapeHtml(t) + '">\xd7</button></span>';
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
`}}},{id:"pomodoro",label:"番茄钟",keywords:["番茄","番茄钟","pomodoro","专注","计时","倒计时","focus","timer"],build:function(t){return{name:"Focus Timer",tagline:"25 分钟一个节奏，把专注攒成记录",summary:"一个番茄钟：选择关联任务后开始 25 分钟专注，环形倒计时结束自动记录一次番茄；短休 / 长休自动切换，并在侧栏汇总今日、本周与最近 7 天的专注数据。",features:[{icon:"timer",title:"环形计时",detail:"25 / 5 / 15 分钟三种节奏"},{icon:"target",title:"关联任务",detail:"专注时选一张任务卡，结束自动累计"},{icon:"chart",title:"专注统计",detail:"今日番茄、本周分钟与 7 天趋势"},{icon:"database",title:"本地保存",detail:"任务与记录刷新不丢"}],body:`
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 3h6"/>
          </svg>
        </span>
        <div>
          <p class="eyebrow">FOCUS TIMER</p>
          <h1>专注时段</h1>
        </div>
      </div>
      <div class="today-total"><span>今日专注</span><strong id="today-min">0</strong><em>分钟</em></div>
    </header>

    <div class="layout">
      <section class="timer-card" id="timer-card" data-mode="focus" aria-label="番茄钟">
        <div class="mode-tabs" role="tablist" aria-label="计时模式">
          <button type="button" data-mode-btn="focus" class="is-active">专注 \xb7 25 分</button>
          <button type="button" data-mode-btn="short">短休 \xb7 5 分</button>
          <button type="button" data-mode-btn="long">长休 \xb7 15 分</button>
        </div>

        <div class="ring-wrap">
          <svg class="ring" viewBox="0 0 240 240" aria-hidden="true">
            <circle class="ring-track" cx="120" cy="120" r="104"></circle>
            <circle class="ring-bar" id="ring-bar" cx="120" cy="120" r="104"></circle>
          </svg>
          <div class="ring-center">
            <p class="time" id="time">25:00</p>
            <p class="phase" id="phase">第 1 个番茄</p>
          </div>
        </div>

        <p class="task-link">关联任务：<strong id="cur-task">未关联任务</strong></p>

        <div class="controls">
          <button type="button" class="primary" id="start">开始专注</button>
          <button type="button" class="ghost" id="reset">重置</button>
          <button type="button" class="ghost" id="skip">跳过</button>
        </div>
        <p class="timer-hint" id="timer-hint">开始后会倒计时，结束时自动记为一次专注。</p>
      </section>

      <aside class="side">
        <section class="panel" aria-label="关联任务列表">
          <div class="panel-head"><h2>任务</h2><span id="task-progress">0/0</span></div>
          <ul class="task-list" id="task-list"></ul>
          <form class="task-form" id="task-form">
            <input id="task-input" type="text" maxlength="40" placeholder="添加任务，回车…" autocomplete="off" aria-label="新任务" />
            <button type="submit" aria-label="添加任务">＋</button>
          </form>
        </section>

        <section class="panel" aria-label="专注记录">
          <div class="panel-head"><h2>专注记录</h2><span id="total-count">0 次</span></div>
          <div class="stat-grid">
            <div class="stat"><strong id="stat-today">0</strong><span>今日番茄</span></div>
            <div class="stat"><strong id="stat-week">0</strong><span>本周分钟</span></div>
            <div class="stat"><strong id="stat-total">0</strong><span>累计番茄</span></div>
          </div>
          <p class="sub-label">最近 7 天</p>
          <div class="week-bars" id="week-bars" aria-label="最近 7 天专注分钟"></div>
          <ul class="record-list" id="record-list"></ul>
          <p class="panel-empty" id="record-empty" hidden>还没有记录，先开始第一个番茄吧。</p>
        </section>
      </aside>
    </div>

    <footer class="foot">25 分钟一个节奏 \xb7 专注结束自动记录 \xb7 数据仅保存在你的浏览器</footer>
  </main>`,css:`
.app{max-width:1040px;margin:0 auto;padding:40px 28px 64px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:24px}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:36px;height:36px;display:grid;place-items:center;border-radius:calc(var(--radius) + 2px);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);flex:0 0 auto}
.eyebrow{font-size:10px;letter-spacing:.2em;color:var(--muted);font-weight:600;margin-bottom:4px}
h1{font-size:clamp(23px,3vw,28px);line-height:1.1;letter-spacing:-.02em;font-weight:650}
.today-total{display:flex;align-items:baseline;gap:6px;color:var(--muted);font-size:11px}
.today-total strong{font-size:24px;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.layout{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(300px,.88fr);gap:16px;align-items:start}
.timer-card{background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 60%),var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:24px 26px 22px;display:flex;flex-direction:column;align-items:center;text-align:center}
.mode-tabs{display:inline-flex;gap:2px;padding:3px;border-radius:calc(var(--radius) - 1px);background:color-mix(in srgb,var(--text) 5%,transparent);border:1px solid var(--border);margin-bottom:22px}
.mode-tabs button{font-size:11.5px;color:var(--muted);padding:5px 12px;border-radius:calc(var(--radius) - 4px);transition:background .15s ease,color .15s ease}
.mode-tabs button:hover{color:var(--text)}
.mode-tabs button.is-active{background:var(--surface);color:var(--text);box-shadow:0 1px 2px color-mix(in srgb,var(--text) 8%,transparent)}
.ring-wrap{position:relative;width:min(248px,76vw);aspect-ratio:1;margin-bottom:18px}
.ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.ring-track{fill:none;stroke:color-mix(in srgb,var(--text) 9%,transparent);stroke-width:7}
.ring-bar{fill:none;stroke:var(--accent);stroke-width:7;stroke-linecap:round;transition:stroke-dashoffset .28s linear,stroke .2s ease}
.timer-card[data-mode="short"] .ring-bar,.timer-card[data-mode="long"] .ring-bar{stroke:var(--accent2)}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
.time{font-size:clamp(42px,7vw,56px);line-height:1;font-weight:600;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.phase{font-size:11px;color:var(--muted);letter-spacing:.02em}
.task-link{font-size:11.5px;color:var(--muted);margin-bottom:18px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.task-link strong{color:var(--text);font-weight:600}
.controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}
.primary{background:var(--accent);color:var(--bg);font-weight:650;font-size:14px;padding:11px 30px;border-radius:calc(var(--radius) - 3px);transition:filter .15s ease,transform .15s ease}
.primary:hover{filter:brightness(1.07)}
.primary:active{transform:scale(.975)}
.ghost{font-size:12.5px;color:var(--muted);padding:9px 13px;border-radius:calc(var(--radius) - 4px);border:1px solid var(--border);transition:color .15s ease,border-color .15s ease,background .15s ease}
.ghost:hover{color:var(--text);border-color:color-mix(in srgb,var(--text) 24%,transparent)}
.timer-hint{font-size:10.5px;color:color-mix(in srgb,var(--muted) 85%,transparent);margin-top:16px;min-height:14px;transition:color .15s ease}
.timer-hint.is-live{color:var(--accent)}
.side{display:flex;flex-direction:column;gap:16px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:15px 15px 13px}
.panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:11px}
.panel-head h2{font-size:12.5px;font-weight:650;letter-spacing:.01em}
.panel-head span{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.task-list{display:flex;flex-direction:column;gap:2px;margin-bottom:9px}
.task{display:flex;align-items:center;gap:9px;padding:7px 7px;border-radius:calc(var(--radius) - 4px);cursor:pointer;border:1px solid transparent;transition:background .14s ease,border-color .14s ease}
.task:hover{background:color-mix(in srgb,var(--text) 4%,transparent)}
.task.is-active{background:color-mix(in srgb,var(--accent) 8%,transparent);border-color:color-mix(in srgb,var(--accent) 26%,transparent)}
.task-check{width:17px;height:17px;flex:0 0 auto;border:1.5px solid color-mix(in srgb,var(--muted) 65%,transparent);border-radius:5px;display:grid;place-items:center;transition:background .14s ease,border-color .14s ease}
.task-check svg{width:10px;height:10px;stroke:var(--bg);stroke-width:3.4;fill:none;opacity:0}
.task.is-done .task-check{background:var(--accent);border-color:var(--accent)}
.task.is-done .task-check svg{opacity:1}
.task-name{flex:1;min-width:0;font-size:12.5px;line-height:1.4;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.task.is-done .task-name{color:var(--muted);text-decoration:line-through}
.pom-count{font-size:10px;color:var(--muted);font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;gap:3px;flex:0 0 auto}
.pom-count i{width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;font-style:normal}
.task-del{font-size:14px;line-height:1;color:var(--muted);padding:2px 4px;border-radius:5px;opacity:0;transition:opacity .14s ease,color .14s ease,background .14s ease;flex:0 0 auto}
.task:hover .task-del,.task:focus-within .task-del{opacity:1}
.task-del:hover{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 12%,transparent)}
.task-form{display:flex;gap:6px;border-top:1px solid var(--border);padding-top:10px}
.task-form input{flex:1;min-width:0;background:transparent;border:none;outline:none;font-size:12px;color:var(--text);padding:2px 1px}
.task-form input::placeholder{color:color-mix(in srgb,var(--muted) 80%,transparent)}
.task-form button{width:24px;height:24px;display:grid;place-items:center;border-radius:6px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);font-size:14px;line-height:1;flex:0 0 auto;transition:filter .14s ease}
.task-form button:hover{filter:brightness(1.12)}
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px}
.stat{display:flex;flex-direction:column;gap:3px;padding:9px 8px;border-radius:calc(var(--radius) - 4px);background:color-mix(in srgb,var(--text) 3%,transparent);border:1px solid var(--border)}
.stat strong{font-size:17px;line-height:1;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.stat span{font-size:9.5px;color:var(--muted);white-space:nowrap}
.sub-label{font-size:9.5px;letter-spacing:.14em;color:var(--muted);font-weight:600;margin-bottom:8px}
.week-bars{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;height:84px;margin-bottom:15px;align-items:end}
.day{display:flex;flex-direction:column;align-items:center;gap:5px;height:100%}
.day-bar{flex:1;width:100%;display:flex;align-items:flex-end;border-radius:4px;background:color-mix(in srgb,var(--text) 4%,transparent);overflow:hidden}
.day-bar i{display:block;width:100%;border-radius:4px 4px 0 0;background:var(--accent);min-height:2px;transition:height .2s ease;opacity:.85}
.day.is-today .day-bar i{opacity:1}
.day span{font-size:9.5px;color:var(--muted)}
.day.is-today span{color:var(--accent);font-weight:600}
.record-list{display:flex;flex-direction:column;gap:2px;border-top:1px solid var(--border);padding-top:9px}
.record{display:flex;align-items:center;gap:7px;padding:4px 2px;font-size:11px;color:var(--muted)}
.rec-dot{width:4px;height:4px;border-radius:50%;background:color-mix(in srgb,var(--accent) 70%,transparent);flex:0 0 auto}
.rec-task{flex:1;min-width:0;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px}
.rec-meta{flex:0 0 auto;font-size:10px;font-variant-numeric:tabular-nums}
.panel-empty{font-size:11.5px;color:var(--muted);padding:12px 2px 4px;text-align:center}
.foot{margin-top:26px;text-align:center;font-size:11px;color:var(--muted);opacity:.78}
button:focus-visible,input:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:820px){
  .app{padding:22px 14px 44px}
  .layout{grid-template-columns:1fr}
  .top{margin-bottom:18px}
  .timer-card{padding:20px 16px 20px}
  .task-del{opacity:1}
  .foot{display:none}
}
@media (prefers-reduced-motion:reduce){
  .primary,.ghost,.ring-bar,.day-bar i,.task,.mode-tabs button{transition:none}
}`,js:`
var KEY = "vf:pomodoro:v1";
var DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
var state = {
  tasks: [],
  records: [],
  currentTaskId: null,
  timer: { mode: "focus", running: false, endAt: 0, remaining: DURATIONS.focus }
};
var tickId = null;

function uid() { return "p" + Math.random().toString(36).slice(2, 9); }

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      tasks: state.tasks,
      records: state.records,
      currentTaskId: state.currentTaskId,
      timer: state.timer
    }));
  } catch (e) {}
}

function dayTs(daysAgo, hour, minute) {
  var d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

function seed() {
  var tasks = [
    { id: uid(), title: "写清楚 VibeForge 的架构说明", done: true, pomodoros: 2 },
    { id: uid(), title: "重构 recipe 的公共契约", done: false, pomodoros: 1 },
    { id: uid(), title: "过一遍 6 个配方的验收", done: false, pomodoros: 0 },
    { id: uid(), title: "回复评审邮件里的三条意见", done: true, pomodoros: 1 },
    { id: uid(), title: "读 30 页《芯片简史》", done: false, pomodoros: 0 },
    { id: uid(), title: "整理下周演示脚本", done: false, pomodoros: 0 }
  ];
  var records = [
    { id: uid(), ts: dayTs(0, 10, 20), minutes: 25, taskTitle: "写清楚 VibeForge 的架构说明" },
    { id: uid(), ts: dayTs(0, 11, 5), minutes: 25, taskTitle: "写清楚 VibeForge 的架构说明" },
    { id: uid(), ts: dayTs(1, 9, 40), minutes: 25, taskTitle: "重构 recipe 的公共契约" },
    { id: uid(), ts: dayTs(1, 14, 10), minutes: 25, taskTitle: "回复评审邮件里的三条意见" },
    { id: uid(), ts: dayTs(1, 15, 0), minutes: 25, taskTitle: "回复评审邮件里的三条意见" },
    { id: uid(), ts: dayTs(2, 16, 30), minutes: 25, taskTitle: "过一遍 6 个配方的验收" },
    { id: uid(), ts: dayTs(4, 10, 0), minutes: 25, taskTitle: "写清楚 VibeForge 的架构说明" },
    { id: uid(), ts: dayTs(6, 20, 15), minutes: 25, taskTitle: "读 30 页《芯片简史》" }
  ];
  return { tasks: tasks, records: records };
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tasks)) state.tasks = parsed.tasks;
      if (parsed && Array.isArray(parsed.records)) state.records = parsed.records;
      if (parsed && typeof parsed.currentTaskId === "string") state.currentTaskId = parsed.currentTaskId;
      if (parsed && parsed.timer && DURATIONS[parsed.timer.mode]) {
        var t = parsed.timer;
        state.timer.mode = t.mode;
        state.timer.remaining = typeof t.remaining === "number" ? t.remaining : DURATIONS[t.mode];
        state.timer.running = !!t.running;
        state.timer.endAt = typeof t.endAt === "number" ? t.endAt : 0;
      }
    }
  } catch (e) {}
  if (!state.tasks.length || !state.records.length) {
    var s = seed();
    state.tasks = s.tasks;
    state.records = s.records;
  }
  if (!taskById(state.currentTaskId) && state.tasks.length) state.currentTaskId = state.tasks[0].id;
  var t = state.timer;
  if (t.running) {
    if (t.endAt > Date.now()) {
      t.remaining = Math.ceil((t.endAt - Date.now()) / 1000);
      startTicking();
    } else {
      t.running = false;
      t.endAt = 0;
      t.remaining = DURATIONS[t.mode] || DURATIONS.focus;
    }
  }
  save();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function taskById(id) {
  for (var i = 0; i < state.tasks.length; i++) { if (state.tasks[i].id === id) return state.tasks[i]; }
  return null;
}

function duration(mode) { return DURATIONS[mode] || DURATIONS.focus; }

function fmt(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function sameDay(a, b) {
  var da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function startOfToday() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function recordsInLastDays(days) {
  var from = startOfToday() - (days - 1) * 86400000;
  return state.records.filter(function (r) { return r.ts >= from; });
}

function todayRecords() {
  return state.records.filter(function (r) { return sameDay(r.ts, Date.now()); });
}

function weekMinutes() {
  var sum = 0;
  recordsInLastDays(7).forEach(function (r) { sum += r.minutes; });
  return sum;
}

function paintTimer() {
  var t = state.timer;
  var dur = duration(t.mode);
  document.getElementById("time").textContent = fmt(t.remaining);
  var bar = document.getElementById("ring-bar");
  var circ = 2 * Math.PI * 104;
  var ratio = dur ? Math.max(0, Math.min(1, t.remaining / dur)) : 0;
  bar.style.strokeDasharray = String(circ);
  bar.style.strokeDashoffset = String(circ * (1 - ratio));
  var card = document.getElementById("timer-card");
  card.setAttribute("data-mode", t.mode);
  var startBtn = document.getElementById("start");
  startBtn.textContent = t.running ? "暂停" : (t.mode === "focus" ? "开始专注" : "开始休息");
  var phase = document.getElementById("phase");
  if (t.mode === "focus") phase.textContent = "第 " + (todayRecords().length + 1) + " 个番茄";
  else phase.textContent = t.mode === "short" ? "短休息 5 分钟" : "长休息 15 分钟";
  var task = taskById(state.currentTaskId);
  document.getElementById("cur-task").textContent = task ? task.title : "未关联任务";
  var tabs = document.querySelectorAll("[data-mode-btn]");
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute("data-mode-btn") === t.mode) tabs[i].classList.add("is-active");
    else tabs[i].classList.remove("is-active");
  }
}

function hint(text, live) {
  var el = document.getElementById("timer-hint");
  el.textContent = text;
  if (live) el.classList.add("is-live");
  else el.classList.remove("is-live");
}

function renderTasks() {
  var list = document.getElementById("task-list");
  var h = "";
  var current = state.currentTaskId;
  state.tasks.forEach(function (t) {
    h += '<li class="task' + (t.id === current ? " is-active" : "") + (t.done ? " is-done" : "") + '" data-id="' + t.id + '">';
    h += '<button type="button" class="task-check" data-act="check" aria-label="标记完成"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></button>';
    h += '<span class="task-name" title="' + escapeHtml(t.title) + '">' + escapeHtml(t.title) + '</span>';
    if (t.pomodoros > 0) h += '<span class="pom-count"><i></i>' + t.pomodoros + '</span>';
    h += '<button type="button" class="task-del" data-act="del" aria-label="删除任务">\xd7</button>';
    h += '</li>';
  });
  if (!state.tasks.length) h = '<li class="panel-empty">还没有任务，先加一条。</li>';
  list.innerHTML = h;
  var done = state.tasks.filter(function (t) { return t.done; }).length;
  document.getElementById("task-progress").textContent = done + "/" + state.tasks.length;
}

function recordLabel(ts) {
  var d = new Date(ts);
  var hm = (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  if (sameDay(ts, Date.now())) return "今天 " + hm;
  var yesterday = startOfToday() - 86400000;
  if (sameDay(ts, yesterday)) return "昨天 " + hm;
  return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hm;
}

function renderStats() {
  document.getElementById("stat-today").textContent = todayRecords().length;
  document.getElementById("stat-week").textContent = weekMinutes();
  document.getElementById("stat-total").textContent = state.records.length;
  document.getElementById("total-count").textContent = state.records.length + " 次";
  var todayMin = 0;
  todayRecords().forEach(function (r) { todayMin += r.minutes; });
  document.getElementById("today-min").textContent = todayMin;

  var days = [];
  for (var i = 6; i >= 0; i--) {
    var ts = startOfToday() - i * 86400000;
    var min = 0;
    state.records.forEach(function (r) { if (sameDay(r.ts, ts)) min += r.minutes; });
    days.push({ ts: ts, min: min });
  }
  var max = 25;
  days.forEach(function (d) { if (d.min > max) max = d.min; });
  var labels = ["日", "一", "二", "三", "四", "五", "六"];
  var h = "";
  days.forEach(function (d) {
    var pct = d.min > 0 ? Math.max(8, Math.round((d.min / max) * 100)) : 0;
    var dow = new Date(d.ts).getDay();
    h += '<div class="day' + (sameDay(d.ts, Date.now()) ? " is-today" : "") + '" title="' + fmt5(d.min) + '">';
    h += '<div class="day-bar">' + (pct > 0 ? '<i style="height:' + pct + '%"></i>' : "") + '</div>';
    h += '<span>' + labels[dow] + '</span></div>';
  });
  document.getElementById("week-bars").innerHTML = h;
}

function fmt5(n) {
  var hh = Math.floor(n / 60);
  var mm = n % 60;
  if (hh > 0) return hh + " 小时 " + (mm ? mm + " 分" : "");
  return n + " 分钟";
}

function renderRecords() {
  var list = document.getElementById("record-list");
  var empty = document.getElementById("record-empty");
  var items = state.records.slice(0, 5);
  var h = "";
  items.forEach(function (r) {
    h += '<li class="record"><span class="rec-dot" aria-hidden="true"></span>';
    h += '<span class="rec-task">' + escapeHtml(r.taskTitle || "自由专注") + '</span>';
    h += '<span class="rec-meta">' + r.minutes + " 分 \xb7 " + recordLabel(r.ts) + '</span></li>';
  });
  list.innerHTML = h;
  empty.hidden = items.length > 0;
}

function renderAll() {
  renderTasks();
  renderStats();
  renderRecords();
  paintTimer();
}

function startTicking() {
  if (tickId) return;
  tickId = setInterval(function () {
    if (!state.timer.running) { stopTicking(); return; }
    var left = Math.max(0, Math.ceil((state.timer.endAt - Date.now()) / 1000));
    state.timer.remaining = left;
    paintTimer();
    if (left <= 0) {
      stopTicking();
      completeSession();
    }
  }, 250);
}

function stopTicking() {
  if (tickId) { clearInterval(tickId); tickId = null; }
}

function setMode(mode, silent) {
  var t = state.timer;
  t.mode = mode;
  t.running = false;
  t.endAt = 0;
  t.remaining = duration(mode);
  stopTicking();
  save();
  if (!silent) hint(mode === "focus" ? "准备好就开始第一个番茄。" : "休息一下，回来继续。", false);
  paintTimer();
}

function completeSession() {
  var t = state.timer;
  t.running = false;
  t.endAt = 0;
  if (t.mode === "focus") {
    var task = taskById(state.currentTaskId);
    state.records.unshift({
      id: uid(),
      ts: Date.now(),
      minutes: 25,
      taskTitle: task ? task.title : "自由专注"
    });
    if (task) task.pomodoros++;
    var count = todayRecords().length;
    var next = count % 4 === 0 ? "long" : "short";
    setMode(next, true);
    hint("专注完成，已记下 25 分钟。去休息一下吧。", true);
  } else {
    setMode("focus", true);
    hint("休息结束，准备好再开始下一轮。", false);
  }
  save();
  renderAll();
}

function findTaskIndex(id) {
  for (var i = 0; i < state.tasks.length; i++) { if (state.tasks[i].id === id) return i; }
  return -1;
}

document.getElementById("start").addEventListener("click", function () {
  var t = state.timer;
  if (t.running) {
    t.remaining = Math.max(1, Math.ceil((t.endAt - Date.now()) / 1000));
    t.running = false;
    t.endAt = 0;
    stopTicking();
    hint("已暂停，随时继续。", false);
  } else {
    if (t.remaining <= 0) t.remaining = duration(t.mode);
    t.endAt = Date.now() + t.remaining * 1000;
    t.running = true;
    startTicking();
    hint(t.mode === "focus" ? "专注中，把手机放远一点。" : "休息中，看看远处。", true);
  }
  save();
  paintTimer();
});

document.getElementById("reset").addEventListener("click", function () {
  setMode(state.timer.mode, false);
});

document.getElementById("skip").addEventListener("click", function () {
  var t = state.timer;
  var wasFocus = t.mode === "focus";
  t.running = false;
  t.endAt = 0;
  stopTicking();
  setMode(wasFocus ? "short" : "focus", true);
  hint(wasFocus ? "已跳过本轮专注，先休息一下。" : "休息结束，回到专注。", false);
  save();
  renderAll();
});

function onModeClick(mode) {
  if (state.timer.running) {
    stopTicking();
    state.timer.running = false;
    state.timer.endAt = 0;
  }
  setMode(mode, false);
}

var modeTabs = document.querySelectorAll("[data-mode-btn]");
for (var mi = 0; mi < modeTabs.length; mi++) {
  (function (btn) {
    btn.addEventListener("click", function () { onModeClick(btn.getAttribute("data-mode-btn")); });
  })(modeTabs[mi]);
}

document.getElementById("task-list").addEventListener("click", function (e) {
  var actBtn = e.target.closest("[data-act]");
  var row = e.target.closest(".task");
  if (!row) return;
  var id = row.getAttribute("data-id");
  if (actBtn) {
    var act = actBtn.getAttribute("data-act");
    var idx = findTaskIndex(id);
    if (idx < 0) return;
    if (act === "check") {
      state.tasks[idx].done = !state.tasks[idx].done;
    } else if (act === "del") {
      state.tasks.splice(idx, 1);
      if (state.currentTaskId === id) {
        state.currentTaskId = state.tasks.length ? state.tasks[Math.min(idx, state.tasks.length - 1)].id : null;
      }
    }
  } else {
    state.currentTaskId = id;
  }
  save();
  renderAll();
});

document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var input = document.getElementById("task-input");
  var title = input.value.trim();
  if (!title) return;
  var task = { id: uid(), title: title, done: false, pomodoros: 0 };
  state.tasks.push(task);
  if (!state.currentTaskId) state.currentTaskId = task.id;
  input.value = "";
  save();
  renderAll();
});

load();
if (state.timer.running) startTicking();
renderAll();
`}}},{id:"expense",label:"记账",keywords:["记账","账本","收支","支出","收入","账单","消费","预算","expense","ledger"],build:function(t){return{name:"Ledger 账本",tagline:"这个月花在哪了，一张图说清楚",summary:"一个本地记账应用：按月份记录收支、分类汇总，用纯 SVG 环图看支出结构、近 6 个月趋势看变化，流水支持新增、修改和删除。",features:[{icon:"wallet",title:"快速记一笔",detail:"金额 / 分类 / 备注 / 日期一步录入"},{icon:"pie-chart",title:"分类环图",detail:"纯 SVG 绘制，看清钱花在哪"},{icon:"trending-up",title:"月度趋势",detail:"近 6 个月收入与支出对比"},{icon:"database",title:"本地保存",detail:"流水保存在浏览器，刷新不丢"}],body:`
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18M16 15h2"/>
          </svg>
        </span>
        <div>
          <p class="eyebrow">PERSONAL FINANCE</p>
          <h1>月度账本</h1>
        </div>
      </div>
      <div class="month-picker" aria-label="切换月份">
        <button type="button" id="prev-month" aria-label="上个月">‹</button>
        <strong id="month-label">—</strong>
        <button type="button" id="next-month" aria-label="下个月">›</button>
      </div>
    </header>

    <section class="summary" aria-label="本月汇总">
      <div class="sum-card main">
        <span>本月结余</span>
        <strong id="sum-balance">\xa50</strong>
        <em id="sum-rate">储蓄率 —</em>
      </div>
      <div class="sum-card"><span>本月收入</span><strong class="pos" id="sum-income">\xa50</strong></div>
      <div class="sum-card"><span>本月支出</span><strong id="sum-expense">\xa50</strong></div>
      <div class="sum-card"><span>日均支出</span><strong id="sum-avg">\xa50</strong><em class="hint" id="sum-days">按 30 天</em></div>
    </section>

    <div class="charts">
      <section class="panel" aria-label="支出分类">
        <div class="panel-head"><h2>支出分类</h2><span id="cat-count">0 类</span></div>
        <div class="cat-chart">
          <div class="donut-wrap">
            <svg id="donut" class="donut" viewBox="0 0 120 120" aria-hidden="true"></svg>
            <div class="donut-center"><strong id="donut-total">\xa50</strong><span>本月支出</span></div>
          </div>
          <ul class="cat-legend" id="cat-legend"></ul>
        </div>
      </section>

      <section class="panel" aria-label="近六个月趋势">
        <div class="panel-head"><h2>近 6 个月趋势</h2><span>收入 / 支出</span></div>
        <div class="trend" id="trend"></div>
        <div class="trend-legend">
          <span><i class="legend-line in"></i>收入</span>
          <span><i class="legend-line out"></i>支出</span>
        </div>
      </section>
    </div>

    <section class="panel ledger" aria-label="流水明细">
      <div class="panel-head"><h2 id="ledger-title">流水明细</h2><span id="ledger-count">0 笔</span></div>

      <form class="add-form" id="add-form">
        <select id="type" aria-label="收支类型">
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
        <input id="amount" type="number" min="0.01" step="0.01" placeholder="金额" inputmode="decimal" aria-label="金额" />
        <select id="category" aria-label="分类"></select>
        <input id="note" type="text" maxlength="30" placeholder="备注，例如：午饭" autocomplete="off" aria-label="备注" />
        <input id="date" type="date" aria-label="日期" />
        <button type="submit" class="save-btn" id="save-btn">记一笔</button>
        <button type="button" class="cancel-btn" id="cancel-edit" hidden>取消</button>
      </form>

      <div class="table-head"><span>日期</span><span>备注</span><span class="ta-r">金额</span><span></span></div>
      <ul class="rows" id="rows"></ul>
      <p class="empty" id="empty" hidden>这个月还没有记录，先记一笔吧。</p>
    </section>

    <footer class="foot">纯前端 \xb7 数据保存在浏览器 \xb7 点击流水可修改</footer>
  </main>`,css:`
html[data-theme="dark"]{color-scheme:dark}
html:not([data-theme="dark"]){color-scheme:light}
.app{max-width:1000px;margin:0 auto;padding:40px 28px 64px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:22px}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:36px;height:36px;display:grid;place-items:center;border-radius:calc(var(--radius) + 2px);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);flex:0 0 auto}
.eyebrow{font-size:10px;letter-spacing:.2em;color:var(--muted);font-weight:600;margin-bottom:4px}
h1{font-size:clamp(23px,3vw,28px);line-height:1.1;letter-spacing:-.02em;font-weight:650}
.month-picker{display:inline-flex;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);padding:3px}
.month-picker button{width:26px;height:26px;display:grid;place-items:center;border-radius:6px;color:var(--muted);font-size:15px;line-height:1;transition:background .14s ease,color .14s ease}
.month-picker button:hover{background:color-mix(in srgb,var(--text) 6%,transparent);color:var(--text)}
.month-picker strong{font-size:12.5px;font-weight:600;padding:0 9px;font-variant-numeric:tabular-nums;min-width:104px;text-align:center}
.summary{display:grid;grid-template-columns:1.35fr 1fr 1fr 1fr;gap:10px;margin-bottom:14px}
.sum-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:13px 15px;display:flex;flex-direction:column;gap:5px;min-width:0}
.sum-card.main{background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--accent) 10%,transparent),transparent 70%),var(--surface)}
.sum-card span{font-size:10.5px;color:var(--muted)}
.sum-card strong{font-size:21px;line-height:1.05;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;word-break:break-all}
.sum-card strong.pos{color:var(--accent)}
.sum-card em{font-size:10px;font-style:normal;color:var(--muted)}
.sum-card em.hint{opacity:.85}
.charts{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:14px;margin-bottom:14px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px}
.panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.panel-head h2{font-size:12.5px;font-weight:650}
.panel-head span{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.cat-chart{display:flex;align-items:center;gap:18px}
.donut-wrap{position:relative;width:126px;height:126px;flex:0 0 auto}
.donut{width:100%;height:100%;transform:rotate(-90deg)}
.donut-track{fill:none;stroke:color-mix(in srgb,var(--text) 7%,transparent);stroke-width:12}
.donut-seg{fill:none;stroke-width:12;stroke-linecap:butt;transition:opacity .14s ease}
.donut-seg:hover{opacity:.82}
.donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;padding:0 14px}
.donut-center strong{font-size:14px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;word-break:break-all}
.donut-center span{font-size:9px;color:var(--muted)}
.cat-legend{display:flex;flex-direction:column;gap:7px;flex:1;min-width:0}
.cat-legend li{display:flex;align-items:center;gap:7px;font-size:11px;min-width:0}
.seg-dot{width:7px;height:7px;border-radius:2px;flex:0 0 auto;background:var(--muted)}
.leg-name{color:var(--muted);flex:0 0 44px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.leg-amt{font-variant-numeric:tabular-nums;flex:1;text-align:right;color:var(--text)}
.leg-pct{color:var(--muted);font-variant-numeric:tabular-nums;flex:0 0 34px;text-align:right;font-size:10px}
.seg-0{background:var(--accent);stroke:var(--accent)}
.seg-1{background:var(--accent2);stroke:var(--accent2)}
.seg-2{background:color-mix(in srgb,var(--accent) 55%,var(--accent2));stroke:color-mix(in srgb,var(--accent) 55%,var(--accent2))}
.seg-3{background:color-mix(in srgb,var(--accent) 48%,var(--muted));stroke:color-mix(in srgb,var(--accent) 48%,var(--muted))}
.seg-4{background:color-mix(in srgb,var(--accent2) 42%,var(--muted));stroke:color-mix(in srgb,var(--accent2) 42%,var(--muted))}
.seg-5{background:color-mix(in srgb,var(--text) 42%,transparent);stroke:color-mix(in srgb,var(--text) 42%,transparent)}
.trend{width:100%}
.trend svg{display:block;width:100%;height:auto;overflow:visible}
.trend .base{stroke:var(--border);stroke-width:1}
.trend .bar-in{fill:var(--accent)}
.trend .bar-out{fill:var(--accent2)}
.trend .grid{stroke:color-mix(in srgb,var(--text) 6%,transparent);stroke-width:1;stroke-dasharray:2 3}
.trend text{fill:var(--muted);font-size:9.5px;text-anchor:middle;font-family:var(--font)}
.trend .lbl-current{fill:var(--accent);font-weight:600}
.trend-legend{display:flex;gap:16px;justify-content:center;margin-top:8px;font-size:10px;color:var(--muted)}
.trend-legend span{display:inline-flex;align-items:center;gap:5px}
.legend-line{width:8px;height:8px;border-radius:2px;display:inline-block}
.legend-line.in{background:var(--accent)}
.legend-line.out{background:var(--accent2)}
.ledger{padding-bottom:12px}
.add-form{display:flex;flex-wrap:wrap;gap:7px;align-items:center;padding:2px 0 13px;border-bottom:1px solid var(--border)}
.add-form input,.add-form select{background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 4px);padding:7px 9px;font-size:12px;color:var(--text);outline:none;transition:border-color .14s ease,box-shadow .14s ease;min-width:0}
.add-form input:focus,.add-form select:focus{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}
.add-form input::placeholder{color:color-mix(in srgb,var(--muted) 80%,transparent)}
#type{width:76px;flex:0 0 auto}
#amount{width:104px;flex:0 0 auto;font-variant-numeric:tabular-nums}
#category{width:92px;flex:0 0 auto}
#note{flex:1 1 150px}
#date{width:132px;flex:0 0 auto;font-size:11.5px}
.save-btn{background:var(--accent);color:var(--bg);font-weight:650;font-size:12px;padding:8px 16px;border-radius:calc(var(--radius) - 4px);flex:0 0 auto;transition:filter .14s ease,transform .14s ease}
.save-btn:hover{filter:brightness(1.07)}
.save-btn:active{transform:scale(.97)}
.cancel-btn{font-size:11.5px;color:var(--muted);padding:7px 10px;border-radius:8px;flex:0 0 auto}
.cancel-btn:hover{color:var(--text);background:color-mix(in srgb,var(--text) 6%,transparent)}
.table-head,.txn{display:grid;grid-template-columns:58px minmax(0,1fr) 104px 28px;gap:10px;align-items:center}
.table-head{padding:10px 4px 7px;font-size:9.5px;letter-spacing:.12em;color:var(--muted);font-weight:600;border-bottom:1px solid var(--border)}
.ta-r{text-align:right}
.rows{display:flex;flex-direction:column}
.txn{padding:8px 4px;border-bottom:1px solid color-mix(in srgb,var(--border) 60%,transparent);border-radius:6px;cursor:pointer;transition:background .13s ease}
.txn:hover{background:color-mix(in srgb,var(--text) 3.5%,transparent)}
.txn.is-editing{background:color-mix(in srgb,var(--accent) 8%,transparent)}
.txn-date{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
.txn-main{display:flex;align-items:center;gap:8px;min-width:0}
.txn-note{font-size:12.5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cat-chip{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;color:var(--muted);border:1px solid var(--border);border-radius:5px;padding:1px 5px;flex:0 0 auto}
.cat-chip i{width:5px;height:5px;border-radius:50%;display:inline-block}
.txn-amount{font-size:12.5px;font-weight:650;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.txn-amount.in{color:var(--accent)}
.txn-amount.out{color:var(--text)}
.txn-del{width:24px;height:24px;display:grid;place-items:center;border-radius:6px;color:var(--muted);font-size:14px;line-height:1;opacity:0;transition:opacity .13s ease,color .13s ease,background .13s ease}
.txn:hover .txn-del,.txn:focus-within .txn-del{opacity:1}
.txn-del:hover{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 12%,transparent)}
.empty{text-align:center;color:var(--muted);font-size:12px;padding:26px 0 16px}
.foot{margin-top:24px;text-align:center;font-size:11px;color:var(--muted);opacity:.78}
button:focus-visible,input:focus-visible,select:focus-visible,.txn:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:780px){
  .app{padding:24px 14px 46px}
  .summary{grid-template-columns:1fr 1fr}
  .sum-card.main{grid-column:1 / -1}
  .charts{grid-template-columns:1fr}
  .cat-chart{gap:14px}
  .donut-wrap{width:112px;height:112px}
  .txn-del{opacity:1}
  #note{flex-basis:100%}
  .foot{display:none}
}
@media (max-width:420px){
  .summary{grid-template-columns:1fr}
  .sum-card.main{grid-column:auto}
  .table-head,.txn{grid-template-columns:46px minmax(0,1fr) 86px 24px;gap:7px}
  .cat-chip{display:none}
}
@media (prefers-reduced-motion:reduce){
  .txn,.donut-seg,.add-form input,.add-form select,.save-btn{transition:none}
}`,js:`
var KEY = "vf:expense:v1";
var EXPENSE_CATS = ["餐饮", "交通", "购物", "居住", "娱乐", "其他"];
var INCOME_CATS = ["工资", "奖金", "理财", "其他"];
var CAT_CLASS = { "餐饮": "seg-0", "交通": "seg-1", "购物": "seg-2", "居住": "seg-3", "娱乐": "seg-4", "其他": "seg-5" };
var state = {
  txns: [],
  editingId: null,
  y: new Date().getFullYear(),
  m: new Date().getMonth()
};

function uid() { return "t" + Math.random().toString(36).slice(2, 9); }

function pad(n) { return (n < 10 ? "0" : "") + n; }

function isoDate(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ txns: state.txns })); } catch (e) {}
}

function seed() {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth();
  var today = now.getDate();
  var out = [];

  function add(monthsAgo, day, type, amount, category, note) {
    var d = new Date(y, m - monthsAgo, 1);
    var yy = d.getFullYear();
    var mm = d.getMonth();
    var dd = monthsAgo === 0 ? Math.max(1, Math.min(day, today)) : Math.max(1, Math.min(day, 28));
    out.push({ id: uid(), type: type, amount: amount, category: category, note: note, date: isoDate(yy, mm, dd) });
  }

  add(0, 1, "income", 18000, "工资", "月薪");
  add(0, 2, "expense", 2600, "居住", "房租");
  add(0, 3, "expense", 18, "交通", "地铁充值");
  add(0, 5, "expense", 42, "餐饮", "午饭 \xb7 公司楼下");
  add(0, 7, "expense", 129, "购物", "键盘腕托");
  add(0, 8, "income", 320, "理财", "基金分红");
  add(0, 9, "expense", 68, "娱乐", "电影票两张");
  add(0, 11, "expense", 86, "餐饮", "周末和朋友吃饭");
  add(1, 1, "income", 18000, "工资", "月薪");
  add(1, 2, "expense", 2600, "居住", "房租");
  add(1, 6, "expense", 320, "餐饮", "一周外卖");
  add(1, 10, "expense", 45, "交通", "打车");
  add(1, 18, "expense", 260, "购物", "换季衣物");
  add(1, 22, "expense", 120, "娱乐", "展览门票");
  add(2, 1, "income", 18000, "工资", "月薪");
  add(2, 2, "expense", 2600, "居住", "房租");
  add(2, 9, "expense", 280, "餐饮", "聚餐");
  add(2, 16, "expense", 60, "交通", "高铁补票");
  add(3, 1, "income", 18000, "工资", "月薪");
  add(3, 2, "expense", 2600, "居住", "房租");
  add(3, 5, "income", 3000, "奖金", "季度奖金");
  add(3, 20, "expense", 899, "购物", "降噪耳机");
  add(4, 1, "income", 18000, "工资", "月薪");
  add(4, 2, "expense", 2600, "居住", "房租");
  add(4, 12, "expense", 240, "餐饮", "朋友生日餐");
  add(5, 1, "income", 18000, "工资", "月薪");
  add(5, 2, "expense", 2600, "居住", "房租");
  add(5, 15, "expense", 55, "交通", "月卡");
  return out;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.txns) && parsed.txns.length) {
        state.txns = parsed.txns.filter(function (t) {
          return t && typeof t.id === "string" && typeof t.amount === "number" &&
            typeof t.date === "string" && (t.type === "income" || t.type === "expense");
        });
      }
    }
  } catch (e) {}
  if (!state.txns.length) { state.txns = seed(); save(); }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function money(n, forceDecimals) {
  var neg = n < 0;
  var abs = Math.abs(n);
  var isInt = Math.abs(abs - Math.round(abs)) < 0.005;
  var s = isInt && !forceDecimals ? String(Math.round(abs)) : abs.toFixed(2);
  var parts = s.split(".");
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
  return (neg ? "-" : "") + "\xa5" + parts[0] + (parts[1] ? "." + parts[1] : "");
}

function parseTxnDate(dateStr) {
  var p = String(dateStr || "").split("-");
  return {
    y: parseInt(p[0], 10) || 0,
    m: (parseInt(p[1], 10) || 1) - 1,
    d: parseInt(p[2], 10) || 1
  };
}

function inSelectedMonth(t) {
  var p = parseTxnDate(t.date);
  return p.y === state.y && p.m === state.m;
}

function monthTxns() {
  return state.txns.filter(inSelectedMonth);
}

function sumBy(list, type) {
  var s = 0;
  list.forEach(function (t) { if (t.type === type) s += t.amount; });
  return s;
}

function categoryTotals(list) {
  var map = {};
  list.forEach(function (t) {
    if (t.type !== "expense") return;
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  var out = [];
  for (var k in map) { if (Object.prototype.hasOwnProperty.call(map, k)) out.push({ name: k, amount: map[k] }); }
  out.sort(function (a, b) { return b.amount - a.amount; });
  return out;
}

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

function isCurrentMonth() {
  var now = new Date();
  return state.y === now.getFullYear() && state.m === now.getMonth();
}

function render() {
  renderSummary();
  renderDonut();
  renderTrend();
  renderLedger();
  document.getElementById("month-label").textContent = state.y + " 年 " + (state.m + 1) + " 月";
}

function renderSummary() {
  var list = monthTxns();
  var income = sumBy(list, "income");
  var expense = sumBy(list, "expense");
  var balance = income - expense;
  document.getElementById("sum-income").textContent = money(income);
  document.getElementById("sum-expense").textContent = money(expense);
  document.getElementById("sum-balance").textContent = money(balance);
  var rate = income > 0 ? Math.round((balance / income) * 100) : 0;
  document.getElementById("sum-rate").textContent = income > 0 ? "储蓄率 " + rate + "%" : "储蓄率 —";
  var days = isCurrentMonth() ? new Date().getDate() : daysInMonth(state.y, state.m);
  document.getElementById("sum-avg").textContent = money(expense / days, true);
  document.getElementById("sum-days").textContent = "按 " + days + " 天计";
}

function renderDonut() {
  var cats = categoryTotals(monthTxns());
  var total = 0;
  cats.forEach(function (c) { total += c.amount; });
  var r = 46;
  var circ = 2 * Math.PI * r;
  var svg = document.getElementById("donut");
  var h = '<circle class="donut-track" cx="60" cy="60" r="46"></circle>';
  if (total > 0) {
    var offset = 0;
    cats.forEach(function (c) {
      var len = (c.amount / total) * circ;
      var gap = Math.min(2.2, len * 0.08);
      var cls = CAT_CLASS[c.name] || "seg-5";
      h += '<circle class="donut-seg ' + cls + '" cx="60" cy="60" r="46" stroke-dasharray="' +
        Math.max(0.4, len - gap) + " " + circ + '" stroke-dashoffset="' + (-offset) + '">';
      h += "<title>" + escapeHtml(c.name) + " " + money(c.amount) + "</title></circle>";
      offset += len;
    });
  }
  svg.innerHTML = h;
  document.getElementById("donut-total").textContent = money(total);
  document.getElementById("cat-count").textContent = cats.length + " 类";

  var h2 = "";
  cats.forEach(function (c) {
    var pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
    h2 += '<li><i class="seg-dot ' + (CAT_CLASS[c.name] || "seg-5") + '"></i>';
    h2 += '<span class="leg-name">' + escapeHtml(c.name) + '</span>';
    h2 += '<span class="leg-amt">' + money(c.amount) + '</span>';
    h2 += '<span class="leg-pct">' + pct + '%</span></li>';
  });
  if (!cats.length) h2 = '<li class="leg-name" style="flex:1">本月还没有支出</li>';
  document.getElementById("cat-legend").innerHTML = h2;
}

function renderTrend() {
  var months = [];
  var i;
  for (i = 5; i >= 0; i--) {
    var d = new Date(state.y, state.m - i, 1);
    months.push({ y: d.getFullYear(), m: d.getMonth() });
  }
  var data = months.map(function (mo) {
    var income = 0, expense = 0;
    state.txns.forEach(function (t) {
      var p = parseTxnDate(t.date);
      if (p.y !== mo.y || p.m !== mo.m) return;
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { y: mo.y, m: mo.m, income: income, expense: expense };
  });
  var max = 1;
  data.forEach(function (d) {
    if (d.income > max) max = d.income;
    if (d.expense > max) max = d.expense;
  });
  var W = 360, H = 132, base = 102, plotH = 84, groupW = 60, barW = 15, barGap = 4;
  var h = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="近 6 个月收入支出趋势">';
  for (var g = 0; g <= 3; g++) {
    var gy = base - (plotH / 3) * g;
    h += '<line class="grid" x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '"></line>';
  }
  data.forEach(function (d, idx) {
    var x0 = idx * groupW + 22;
    var hi = Math.round((d.income / max) * plotH);
    var he = Math.round((d.expense / max) * plotH);
    if (d.income > 0) {
      h += '<rect class="bar-in" x="' + x0 + '" y="' + (base - hi) + '" width="' + barW + '" height="' + Math.max(2, hi) + '" rx="2">';
      h += "<title>" + (d.m + 1) + " 月收入 " + money(d.income) + "</title></rect>";
    }
    if (d.expense > 0) {
      h += '<rect class="bar-out" x="' + (x0 + barW + barGap) + '" y="' + (base - he) + '" width="' + barW + '" height="' + Math.max(2, he) + '" rx="2">';
      h += "<title>" + (d.m + 1) + " 月支出 " + money(d.expense) + "</title></rect>";
    }
    h += '<text x="' + (x0 + barW + barGap / 2) + '" y="' + (base + 14) + '"' +
      (idx === data.length - 1 ? ' class="lbl-current"' : "") + ">" + (d.m + 1) + "月</text>";
  });
  h += '<line class="base" x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '"></line>';
  h += "</svg>";
  document.getElementById("trend").innerHTML = h;
}

function renderLedger() {
  var list = monthTxns().slice().sort(function (a, b) {
    if (a.date === b.date) return b.id > a.id ? 1 : -1;
    return a.date < b.date ? 1 : -1;
  });
  var h = "";
  list.forEach(function (t) {
    var p = parseTxnDate(t.date);
    var isIn = t.type === "income";
    var cls = CAT_CLASS[t.category] || (isIn ? "seg-0" : "seg-5");
    h += '<li class="txn' + (state.editingId === t.id ? " is-editing" : "") + '" data-id="' + t.id + '" tabindex="0">';
    h += '<span class="txn-date">' + (p.m + 1) + "/" + p.d + '</span>';
    h += '<span class="txn-main"><span class="txn-note">' + escapeHtml(t.note || "未备注") + '</span>';
    h += '<span class="cat-chip"><i class="seg-dot ' + cls + '"></i>' + escapeHtml(t.category) + "</span></span>";
    h += '<span class="txn-amount ' + (isIn ? "in" : "out") + '">' + (isIn ? "+" : "−") + money(t.amount) + "</span>";
    h += '<button type="button" class="txn-del" data-act="del" aria-label="删除这笔记录">\xd7</button>';
    h += "</li>";
  });
  document.getElementById("rows").innerHTML = h;
  document.getElementById("empty").hidden = list.length > 0;
  document.getElementById("ledger-count").textContent = list.length + " 笔";
  document.getElementById("ledger-title").textContent = (state.m + 1) + " 月流水";
}

function fillCategories(type, selected) {
  var sel = document.getElementById("category");
  var cats = type === "income" ? INCOME_CATS : EXPENSE_CATS;
  var h = "";
  cats.forEach(function (c) {
    h += '<option value="' + c + '"' + (c === selected ? " selected" : "") + ">" + c + "</option>";
  });
  sel.innerHTML = h;
  if (selected && cats.indexOf(selected) < 0) sel.value = cats[0];
}

function defaultDate() {
  var now = new Date();
  if (state.y === now.getFullYear() && state.m === now.getMonth()) return isoDate(state.y, state.m, now.getDate());
  return isoDate(state.y, state.m, 1);
}

function clearForm() {
  state.editingId = null;
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  document.getElementById("date").value = defaultDate();
  document.getElementById("type").value = "expense";
  fillCategories("expense", null);
  document.getElementById("save-btn").textContent = "记一笔";
  document.getElementById("cancel-edit").hidden = true;
}

function startEdit(id) {
  var t = null;
  for (var i = 0; i < state.txns.length; i++) { if (state.txns[i].id === id) t = state.txns[i]; }
  if (!t) return;
  state.editingId = id;
  document.getElementById("type").value = t.type;
  fillCategories(t.type, t.category);
  document.getElementById("amount").value = t.amount;
  document.getElementById("note").value = t.note;
  document.getElementById("date").value = t.date;
  document.getElementById("save-btn").textContent = "保存修改";
  document.getElementById("cancel-edit").hidden = false;
  document.getElementById("amount").focus();
  renderLedger();
}

document.getElementById("type").addEventListener("change", function () {
  fillCategories(this.value, null);
});

document.getElementById("add-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var type = document.getElementById("type").value;
  var amount = parseFloat(document.getElementById("amount").value);
  var category = document.getElementById("category").value;
  var note = document.getElementById("note").value.trim();
  var date = document.getElementById("date").value;
  if (!isFinite(amount) || amount <= 0) {
    document.getElementById("amount").focus();
    return;
  }
  if (!date) date = defaultDate();
  var p = parseTxnDate(date);
  if (state.editingId) {
    state.txns.forEach(function (t) {
      if (t.id === state.editingId) {
        t.type = type; t.amount = Math.round(amount * 100) / 100;
        t.category = category; t.note = note; t.date = date;
      }
    });
  } else {
    state.txns.push({
      id: uid(), type: type, amount: Math.round(amount * 100) / 100,
      category: category, note: note, date: date
    });
  }
  state.y = p.y;
  state.m = p.m;
  save();
  clearForm();
  render();
});

document.getElementById("cancel-edit").addEventListener("click", function () {
  clearForm();
  renderLedger();
});

document.getElementById("rows").addEventListener("click", function (e) {
  var row = e.target.closest(".txn");
  if (!row) return;
  var del = e.target.closest("[data-act]");
  if (del) {
    var id = row.getAttribute("data-id");
    state.txns = state.txns.filter(function (t) { return t.id !== id; });
    if (state.editingId === id) clearForm();
    save();
    render();
    return;
  }
  startEdit(row.getAttribute("data-id"));
});

document.getElementById("rows").addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  var row = e.target.closest(".txn");
  if (row) { e.preventDefault(); startEdit(row.getAttribute("data-id")); }
});

document.getElementById("prev-month").addEventListener("click", function () {
  state.m -= 1;
  if (state.m < 0) { state.m = 11; state.y -= 1; }
  clearForm();
  render();
});

document.getElementById("next-month").addEventListener("click", function () {
  state.m += 1;
  if (state.m > 11) { state.m = 0; state.y += 1; }
  clearForm();
  render();
});

load();
clearForm();
render();
`}}},{id:"habit",label:"习惯打卡",keywords:["习惯","打卡","habit","热力图","连续","坚持","streak","日常"],build:function(t){return{name:"Streak 打卡",tagline:"每天一个小格子，连续下去",summary:"一个习惯打卡应用：给每个习惯每天打卡，自动计算连续天数，用 12 周热力图看整体坚持情况，支持新增和删除习惯，数据保存在浏览器。",features:[{icon:"check-circle",title:"一键打卡",detail:"最近 7 天每天一格，点一下即可"},{icon:"flame",title:"连续天数",detail:"自动计算每个习惯的当前连续"},{icon:"calendar",title:"12 周热力图",detail:"颜色越深，当天完成得越多"},{icon:"database",title:"本地保存",detail:"打卡记录刷新不丢"}],body:`
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12.5l5 5L20 6.5"/>
          </svg>
        </span>
        <div>
          <p class="eyebrow">DAILY ROUTINE</p>
          <h1>习惯打卡</h1>
        </div>
      </div>
      <div class="top-stats">
        <div class="mini-stat"><strong id="today-done">0/0</strong><span>今日完成</span></div>
        <div class="mini-stat"><strong id="week-rate">0%</strong><span>近 7 天完成率</span></div>
        <div class="mini-stat"><strong id="best-streak">0</strong><span>最长连续</span></div>
      </div>
    </header>

    <section class="panel" aria-label="完成热力图">
      <div class="panel-head">
        <h2>最近 12 周</h2>
        <div class="heat-legend"><span>少</span><i class="lv0"></i><i class="lv1"></i><i class="lv2"></i><i class="lv3"></i><i class="lv4"></i><span>多</span></div>
      </div>
      <div class="heatmap" id="heatmap" aria-label="习惯完成热力图"></div>
      <p class="heat-foot" id="heat-foot"></p>
    </section>

    <section class="panel" aria-label="习惯打卡列表">
      <div class="panel-head"><h2>我的习惯</h2><span id="habit-count">0 个</span></div>
      <div class="week-head" id="week-head">
        <span class="wh-name">习惯</span>
        <span class="wh-days" id="week-days"></span>
        <span class="wh-streak">连续</span>
        <span class="wh-del"></span>
      </div>
      <ul class="habit-list" id="habit-list"></ul>
      <form class="habit-form" id="habit-form">
        <input id="habit-input" type="text" maxlength="24" placeholder="添加一个习惯，比如：早起喝一杯水" autocomplete="off" aria-label="新习惯名称" />
        <button type="submit">＋ 添加</button>
      </form>
    </section>

    <footer class="foot">每一列是一周 \xb7 颜色越深完成越多 \xb7 数据仅保存在你的浏览器</footer>
  </main>`,css:`
.app{max-width:900px;margin:0 auto;padding:40px 28px 60px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:22px}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:36px;height:36px;display:grid;place-items:center;border-radius:calc(var(--radius) + 2px);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);flex:0 0 auto}
.eyebrow{font-size:10px;letter-spacing:.2em;color:var(--muted);font-weight:600;margin-bottom:4px}
h1{font-size:clamp(23px,3vw,28px);line-height:1.1;letter-spacing:-.02em;font-weight:650}
.top-stats{display:flex;gap:22px}
.mini-stat{display:flex;flex-direction:column;gap:3px}
.mini-stat strong{font-size:18px;line-height:1;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.mini-stat span{font-size:10px;color:var(--muted)}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 17px;margin-bottom:14px}
.panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.panel-head h2{font-size:12.5px;font-weight:650}
.panel-head>span{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.heat-legend{display:flex;align-items:center;gap:3px;font-size:9.5px;color:var(--muted)}
.heat-legend i{width:9px;height:9px;border-radius:2px;display:inline-block}
.heatmap{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,var(--cell));grid-auto-columns:var(--cell);gap:4px;justify-content:center;--cell:clamp(13px,2.6vw,22px)}
.heat-cell{border-radius:2.5px;transition:transform .12s ease}
.heat-cell:hover{transform:scale(1.18)}
.heat-cell.is-future{opacity:.32}
.heat-cell.is-today{box-shadow:0 0 0 1.5px color-mix(in srgb,var(--accent) 62%,transparent)}
.lv0{background:color-mix(in srgb,var(--text) 7%,transparent)}
.lv1{background:color-mix(in srgb,var(--accent) 24%,transparent)}
.lv2{background:color-mix(in srgb,var(--accent) 44%,transparent)}
.lv3{background:color-mix(in srgb,var(--accent) 66%,transparent)}
.lv4{background:color-mix(in srgb,var(--accent) 88%,transparent)}
.heat-foot{font-size:10.5px;color:var(--muted);margin-top:11px;text-align:center}
.week-head{display:flex;align-items:center;gap:12px;padding:0 6px 7px;font-size:9px;letter-spacing:.1em;color:var(--muted);font-weight:600}
.wh-name{flex:1 1 180px;min-width:0}
.wh-days{display:grid;grid-template-columns:repeat(7,30px);gap:5px;flex:0 0 auto;text-align:center}
.wh-days span.is-today{color:var(--accent)}
.wh-streak{flex:0 0 58px;text-align:right}
.wh-del{flex:0 0 26px}
.habit-list{display:flex;flex-direction:column}
.habit{display:flex;align-items:center;gap:12px;padding:10px 6px;border-top:1px solid color-mix(in srgb,var(--border) 65%,transparent)}
.habit-name{flex:1 1 180px;min-width:0;display:flex;align-items:center;gap:8px}
.habit-dot{width:9px;height:9px;border-radius:3px;flex:0 0 auto}
.habit-name span{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tint-0{background:var(--accent)}
.tint-1{background:var(--accent2)}
.tint-2{background:color-mix(in srgb,var(--accent) 55%,var(--accent2))}
.tint-3{background:color-mix(in srgb,var(--accent) 50%,var(--muted))}
.tint-4{background:color-mix(in srgb,var(--accent2) 45%,var(--muted))}
.tint-5{background:color-mix(in srgb,var(--text) 45%,transparent)}
.week-grid{display:grid;grid-template-columns:repeat(7,30px);gap:5px;flex:0 0 auto}
.day-cell{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;border:1px solid var(--border);background:color-mix(in srgb,var(--text) 2%,transparent);color:var(--accent);transition:background .13s ease,border-color .13s ease,transform .13s ease}
.day-cell:hover{border-color:color-mix(in srgb,var(--accent) 45%,transparent)}
.day-cell:active{transform:scale(.93)}
.day-cell svg{width:13px;height:13px;stroke:currentColor;stroke-width:3;fill:none;opacity:0;transition:opacity .13s ease}
.day-cell.is-done{background:color-mix(in srgb,var(--accent) 15%,transparent);border-color:color-mix(in srgb,var(--accent) 42%,transparent)}
.day-cell.is-done svg{opacity:1}
.day-cell.is-today{box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 20%,transparent)}
.habit-streak{flex:0 0 58px;text-align:right;font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.habit-streak strong{font-size:14px;color:var(--text);font-weight:600;margin-right:2px}
.habit-del{width:26px;height:26px;display:grid;place-items:center;border-radius:7px;color:var(--muted);font-size:15px;line-height:1;opacity:0;transition:opacity .13s ease,color .13s ease,background .13s ease;flex:0 0 26px}
.habit:hover .habit-del,.habit:focus-within .habit-del{opacity:1}
.habit-del:hover{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 12%,transparent)}
.habit-form{display:flex;gap:8px;border-top:1px solid var(--border);padding-top:12px;margin-top:6px}
.habit-form input{flex:1;min-width:0;background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 4px);padding:9px 11px;font-size:12.5px;color:var(--text);outline:none;transition:border-color .14s ease,box-shadow .14s ease}
.habit-form input:focus{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}
.habit-form input::placeholder{color:color-mix(in srgb,var(--muted) 80%,transparent)}
.habit-form button{background:var(--accent);color:var(--bg);font-weight:650;font-size:12px;padding:0 15px;border-radius:calc(var(--radius) - 4px);flex:0 0 auto;transition:filter .14s ease,transform .14s ease}
.habit-form button:hover{filter:brightness(1.07)}
.habit-form button:active{transform:scale(.97)}
.empty{text-align:center;color:var(--muted);font-size:12px;padding:22px 0}
.foot{margin-top:4px;text-align:center;font-size:10.5px;color:var(--muted);opacity:.78}
button:focus-visible,input:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:760px){
  .app{padding:22px 14px 44px}
  .top-stats{gap:20px;width:100%}
  .week-head{display:none}
  .habit{flex-wrap:wrap;gap:9px;padding:11px 4px}
  .habit-name{flex-basis:100%}
  .week-grid{grid-template-columns:repeat(7,minmax(0,1fr));width:100%;flex:1 1 100%}
  .day-cell{width:100%;height:32px}
  .habit-streak{flex:0 0 auto;margin-left:auto}
  .habit-del{opacity:1}
  .foot{display:none}
}
@media (prefers-reduced-motion:reduce){
  .day-cell,.heat-cell,.habit-del{transition:none}
}`,js:`
var KEY = "vf:habit:v1";
var state = { habits: [] };

function uid() { return "h" + Math.random().toString(36).slice(2, 9); }
function pad(n) { return (n < 10 ? "0" : "") + n; }

function dateKey(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function dayShift(base, n) {
  var d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

function todayKey() { return dateKey(new Date()); }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ habits: state.habits })); } catch (e) {}
}

function seed() {
  var rates = [8, 5, 6, 8, 7, 4];
  var names = [
    "早起喝一杯水",
    "读 20 页书",
    "运动 30 分钟",
    "写三行日记",
    "背 10 个单词",
    "23:30 前上床睡觉"
  ];
  var out = [];
  var tk = todayKey();
  for (var i = 0; i < names.length; i++) {
    var history = {};
    for (var off = 0; off < 84; off++) {
      var d = dayShift(new Date(), -off);
      var score = (i * 7 + off * 3 + ((off * (i + 2)) % 11)) % 10;
      if (score < rates[i]) history[dateKey(d)] = 1;
    }
    if (i < 4) history[tk] = 1;
    out.push({ id: uid(), name: names[i], history: history });
  }
  return out;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.habits) && parsed.habits.length) {
        state.habits = parsed.habits.filter(function (h) {
          return h && typeof h.id === "string" && typeof h.name === "string" && h.history && typeof h.history === "object";
        });
      }
    }
  } catch (e) {}
  if (!state.habits.length) { state.habits = seed(); save(); }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function streakOf(h) {
  var d = new Date();
  d.setHours(12, 0, 0, 0);
  var count = 0;
  if (!h.history[dateKey(d)]) d.setDate(d.getDate() - 1);
  for (var guard = 0; guard < 400; guard++) {
    if (!h.history[dateKey(d)]) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function countDone(h) {
  var n = 0;
  for (var k in h.history) { if (Object.prototype.hasOwnProperty.call(h.history, k) && h.history[k]) n++; }
  return n;
}

function weekDays() {
  var days = [];
  for (var i = 6; i >= 0; i--) days.push(dayShift(new Date(), -i));
  return days;
}

function renderHeatmap() {
  var today = new Date();
  today.setHours(12, 0, 0, 0);
  var monday = new Date(today);
  var dow = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - dow);
  var start = dayShift(monday, -77);
  var tk = todayKey();
  var total = state.habits.length;
  var h = "";
  for (var i = 0; i < 84; i++) {
    var d = dayShift(start, i);
    var key = dateKey(d);
    var future = d.getTime() > today.getTime();
    var done = 0;
    state.habits.forEach(function (hb) { if (hb.history[key]) done++; });
    var level = 0;
    if (!future && total > 0 && done > 0) {
      var ratio = done / total;
      level = ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
    }
    var title = (d.getMonth() + 1) + "月" + d.getDate() + "日";
    title += future ? " \xb7 还没到" : " \xb7 " + done + "/" + total + " 完成";
    h += '<span class="heat-cell lv' + level + (future ? " is-future" : "") + (key === tk ? " is-today" : "") + '" title="' + title + '"></span>';
  }
  document.getElementById("heatmap").innerHTML = h;

  var totalChecks = 0;
  var best = 0;
  state.habits.forEach(function (hb) {
    totalChecks += countDone(hb);
    var s = streakOf(hb);
    if (s > best) best = s;
  });
  document.getElementById("heat-foot").textContent = "共打卡 " + totalChecks + " 次 \xb7 当前最长连续 " + best + " 天 \xb7 今天 " + doneToday() + "/" + total + " 完成";
}

function doneToday() {
  var tk = todayKey();
  var n = 0;
  state.habits.forEach(function (h) { if (h.history[tk]) n++; });
  return n;
}

function renderWeekHead() {
  var days = weekDays();
  var last = days.length - 1;
  var h = "";
  var labels = ["日", "一", "二", "三", "四", "五", "六"];
  days.forEach(function (d, i) {
    h += '<span class="' + (i === last ? "is-today" : "") + '">' + labels[d.getDay()] + "</span>";
  });
  document.getElementById("week-days").innerHTML = h;
}

function renderStats() {
  var total = state.habits.length;
  document.getElementById("today-done").textContent = doneToday() + "/" + total;
  var cells = total * 7;
  var checked = 0;
  weekDays().forEach(function (d) {
    var k = dateKey(d);
    state.habits.forEach(function (h) { if (h.history[k]) checked++; });
  });
  document.getElementById("week-rate").textContent = cells ? Math.round((checked / cells) * 100) + "%" : "—";
  var best = 0;
  state.habits.forEach(function (h) {
    var s = streakOf(h);
    if (s > best) best = s;
  });
  document.getElementById("best-streak").textContent = best;
}

function renderHabits() {
  var days = weekDays();
  var last = days.length - 1;
  var h = "";
  state.habits.forEach(function (hb, idx) {
    var streak = streakOf(hb);
    h += '<li class="habit" data-id="' + hb.id + '">';
    h += '<div class="habit-name"><i class="habit-dot tint-' + (idx % 6) + '" aria-hidden="true"></i><span>' + escapeHtml(hb.name) + '</span></div>';
    h += '<div class="week-grid">';
    days.forEach(function (d, di) {
      var key = dateKey(d);
      var done = !!hb.history[key];
      var label = (d.getMonth() + 1) + "月" + d.getDate() + "日";
      h += '<button type="button" class="day-cell' + (done ? " is-done" : "") + (di === last ? " is-today" : "") +
        '" data-act="toggle" data-key="' + key + '" title="' + label + (done ? " 已完成，点击取消" : " 未完成，点击打卡") +
        '" aria-label="' + label + "，" + (done ? "已完成" : "未完成") + '" aria-pressed="' + done + '">' +
        '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></button>';
    });
    h += '</div>';
    h += '<div class="habit-streak"><strong>' + streak + '</strong><span>天</span></div>';
    h += '<button type="button" class="habit-del" data-act="del" aria-label="删除习惯">\xd7</button>';
    h += "</li>";
  });
  if (!state.habits.length) h = '<li class="empty">还没有习惯，在下面添加第一个吧。</li>';
  document.getElementById("habit-list").innerHTML = h;
  document.getElementById("habit-count").textContent = state.habits.length + " 个";
}

function renderAll() {
  renderStats();
  renderHeatmap();
  renderWeekHead();
  renderHabits();
}

document.getElementById("habit-list").addEventListener("click", function (e) {
  var row = e.target.closest(".habit");
  if (!row) return;
  var id = row.getAttribute("data-id");
  var btn = e.target.closest("[data-act]");
  if (!btn) return;
  var act = btn.getAttribute("data-act");
  if (act === "del") {
    state.habits = state.habits.filter(function (h) { return h.id !== id; });
    save();
    renderAll();
    return;
  }
  if (act === "toggle") {
    var key = btn.getAttribute("data-key");
    state.habits.forEach(function (h) {
      if (h.id !== id) return;
      if (h.history[key]) delete h.history[key];
      else h.history[key] = 1;
    });
    save();
    renderAll();
  }
});

document.getElementById("habit-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var input = document.getElementById("habit-input");
  var name = input.value.trim();
  if (!name) return;
  state.habits.push({ id: uid(), name: name, history: {} });
  input.value = "";
  save();
  renderAll();
});

load();
renderAll();
`}}},{id:"quiz",label:"答题测验",keywords:["答题","测验","题库","选择题","考试","quiz","计分","答题卡"],build:function(t){return{name:"Quiz Flow",tagline:"8 道题，测测你对 VibeForge 的了解",summary:"一个选择题测验：从题库逐题作答，选完立即看到对错与解析，全部答完给出得分、正确率和逐题回顾，最高分保存在本地。",features:[{icon:"list",title:"逐题流程",detail:"一次一题，带进度与当前得分"},{icon:"check-circle",title:"即时解析",detail:"选完立刻显示对错和原因"},{icon:"award",title:"计分结果",detail:"得分 / 正确率 / 逐题回顾"},{icon:"database",title:"最高分记录",detail:"成绩保存在浏览器本地"}],body:`
  <main class="app">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3"/><path d="M12 17h.01"/>
          </svg>
        </span>
        <div>
          <p class="eyebrow">QUIZ ENGINE</p>
          <h1>答题测验</h1>
        </div>
      </div>
      <div class="best"><span>最高分</span><strong id="best-score">—</strong><em id="best-total">/ 0</em></div>
    </header>

    <div id="stage" aria-live="polite"></div>

    <footer class="foot">VibeForge Mock Agent \xb7 题目来自项目规范 \xb7 成绩仅保存在本地</footer>
  </main>`,css:`
.app{max-width:720px;margin:0 auto;padding:44px 28px 64px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:22px}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:36px;height:36px;display:grid;place-items:center;border-radius:calc(var(--radius) + 2px);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);flex:0 0 auto}
.eyebrow{font-size:10px;letter-spacing:.2em;color:var(--muted);font-weight:600;margin-bottom:4px}
h1{font-size:clamp(23px,3vw,28px);line-height:1.1;letter-spacing:-.02em;font-weight:650}
.best{display:flex;align-items:baseline;gap:4px;color:var(--muted);font-size:11px}
.best strong{font-size:23px;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.best em{font-style:normal;font-size:11px;color:var(--muted)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 2px);padding:26px 26px 24px;box-shadow:0 1px 2px color-mix(in srgb,var(--text) 4%,transparent),0 14px 32px -26px color-mix(in srgb,var(--text) 22%,transparent)}
.start-badge{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.06em;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent);border:1px solid color-mix(in srgb,var(--accent) 26%,transparent);border-radius:999px;padding:4px 10px;margin-bottom:16px}
.start-title{font-size:22px;line-height:1.3;letter-spacing:-.02em;font-weight:650;margin-bottom:8px}
.start-desc{font-size:13px;line-height:1.7;color:var(--muted);margin-bottom:18px;max-width:56ch}
.cat-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
.cat-btn{font-size:11px;color:var(--muted);padding:5px 10px;border-radius:999px;border:1px solid var(--border);transition:color .14s ease,border-color .14s ease,background .14s ease}
.cat-btn em{font-style:normal;opacity:.6;margin-left:3px;font-size:10px;font-variant-numeric:tabular-nums}
.cat-btn:hover{color:var(--text);border-color:color-mix(in srgb,var(--text) 22%,transparent)}
.cat-btn.is-active{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 42%,transparent);background:color-mix(in srgb,var(--accent) 9%,transparent)}
.start-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px}
.s-stat{display:flex;flex-direction:column;gap:4px;padding:11px 12px;border-radius:calc(var(--radius) - 3px);background:color-mix(in srgb,var(--text) 3%,transparent);border:1px solid var(--border)}
.s-stat strong{font-size:19px;line-height:1;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.s-stat span{font-size:10.5px;color:var(--muted)}
.primary{background:var(--accent);color:var(--bg);font-weight:650;font-size:13.5px;padding:11px 24px;border-radius:calc(var(--radius) - 3px);transition:filter .15s ease,transform .15s ease}
.primary:hover{filter:brightness(1.07)}
.primary:active{transform:scale(.975)}
.recent{margin-top:20px;border-top:1px solid var(--border);padding-top:14px}
.recent-title{font-size:10px;letter-spacing:.12em;color:var(--muted);font-weight:600;margin-bottom:9px}
.recent-list{display:flex;flex-direction:column;gap:6px}
.recent-row{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11.5px;color:var(--muted)}
.recent-row b{font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}
.progress{height:4px;border-radius:99px;background:color-mix(in srgb,var(--text) 8%,transparent);overflow:hidden;margin-bottom:16px}
.progress i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .2s ease}
.q-meta{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-size:10.5px;color:var(--muted)}
.q-badge{font-size:9.5px;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent);border:1px solid color-mix(in srgb,var(--accent) 24%,transparent);border-radius:5px;padding:2px 7px}
.q-now{margin-left:auto;color:var(--accent);font-variant-numeric:tabular-nums}
.q-text{font-size:18px;line-height:1.45;letter-spacing:-.01em;font-weight:650;margin-bottom:20px;word-break:break-word}
.options{display:flex;flex-direction:column;gap:8px}
.option{width:100%;display:flex;align-items:center;gap:11px;text-align:left;padding:11px 13px;border:1px solid var(--border);border-radius:calc(var(--radius) - 2px);background:color-mix(in srgb,var(--text) 2%,transparent);transition:background .14s ease,border-color .14s ease,transform .14s ease;cursor:pointer}
.option:hover{border-color:color-mix(in srgb,var(--text) 24%,transparent);background:color-mix(in srgb,var(--text) 4%,transparent)}
.option:active{transform:scale(.995)}
.opt-key{width:24px;height:24px;flex:0 0 auto;display:grid;place-items:center;border-radius:7px;border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--muted);background:var(--surface)}
.opt-text{flex:1;min-width:0;font-size:13px;line-height:1.5}
.opt-flag{font-size:10px;color:var(--muted);flex:0 0 auto}
.option.is-correct{border-color:color-mix(in srgb,var(--accent) 55%,transparent);background:color-mix(in srgb,var(--accent) 9%,transparent)}
.option.is-correct .opt-key{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.option.is-correct .opt-flag{color:var(--accent)}
.option.is-wrong{border-color:color-mix(in srgb,var(--accent2) 55%,transparent);background:color-mix(in srgb,var(--accent2) 9%,transparent)}
.option.is-wrong .opt-key{background:var(--accent2);border-color:var(--accent2);color:var(--bg)}
.option.is-wrong .opt-flag{color:var(--accent2)}
.option.is-dim{opacity:.52}
.option[disabled]{cursor:default}
.explain{margin-top:16px;padding:12px 14px;border-radius:calc(var(--radius) - 3px);border-left:2px solid var(--accent);background:color-mix(in srgb,var(--text) 3%,transparent)}
.explain.is-bad{border-left-color:var(--accent2)}
.explain-title{font-size:12px;font-weight:650;margin-bottom:4px;color:var(--accent)}
.explain.is-bad .explain-title{color:var(--accent2)}
.explain-text{font-size:12px;line-height:1.65;color:var(--muted)}
.quiz-hint{font-size:11px;color:var(--muted);margin-top:16px}
.quiz-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}
.result-head{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:20px}
.score-ring{position:relative;width:132px;height:132px;flex:0 0 auto}
.score-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring-track{fill:none;stroke:color-mix(in srgb,var(--text) 8%,transparent);stroke-width:8}
.ring-bar{fill:none;stroke:var(--accent);stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset .3s ease}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
.ring-center strong{font-size:32px;line-height:1;font-weight:600;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.ring-center span{font-size:10.5px;color:var(--muted)}
.result-text{flex:1;min-width:200px}
.result-eyebrow{font-size:10px;letter-spacing:.14em;color:var(--muted);font-weight:600;margin-bottom:6px}
.result-title{font-size:20px;line-height:1.35;letter-spacing:-.02em;font-weight:650;margin-bottom:8px}
.result-desc{font-size:12.5px;line-height:1.65;color:var(--muted)}
.result-stats{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}
.r-stat{font-size:11px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:4px 10px}
.r-stat b{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}
.review{border-top:1px solid var(--border);padding-top:14px;margin-bottom:20px}
.review-title{font-size:10px;letter-spacing:.12em;color:var(--muted);font-weight:600;margin-bottom:8px}
.review-list{display:flex;flex-direction:column;max-height:300px;overflow-y:auto;padding-right:2px}
.review-row{display:flex;gap:10px;padding:8px 2px;border-bottom:1px solid color-mix(in srgb,var(--border) 55%,transparent)}
.r-mark{width:18px;height:18px;flex:0 0 auto;display:grid;place-items:center;border-radius:6px;font-size:11px;font-weight:700;margin-top:1px}
.review-row.ok .r-mark{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.review-row.bad .r-mark{color:var(--accent2);background:color-mix(in srgb,var(--accent2) 12%,transparent)}
.r-body{min-width:0}
.r-q{font-size:12px;line-height:1.5;margin-bottom:2px}
.r-a{font-size:10.5px;line-height:1.55;color:var(--muted)}
.result-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
.ghost{font-size:12.5px;color:var(--muted);padding:9px 13px;border-radius:calc(var(--radius) - 4px);border:1px solid var(--border);transition:color .14s ease,border-color .14s ease}
.ghost:hover{color:var(--text);border-color:color-mix(in srgb,var(--text) 24%,transparent)}
.foot{margin-top:24px;text-align:center;font-size:10.5px;color:var(--muted);opacity:.78}
button:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:1px}
@media (max-width:560px){
  .app{padding:26px 14px 46px}
  .card{padding:20px 16px 18px}
  .start-stats{grid-template-columns:1fr 1fr}
  .result-head{gap:16px}
  .score-ring{width:112px;height:112px}
  .ring-center strong{font-size:27px}
  .foot{display:none}
}
@media (prefers-reduced-motion:reduce){
  .option,.primary,.progress i,.ring-bar{transition:none}
}`,js:`
var KEY = "vf:quiz:v1";
var LETTERS = ["A", "B", "C", "D"];
var BANK = [
  {
    cat: "生成器",
    q: "Mock Agent 在没有调用 LLM 的情况下，靠什么把用户 prompt 路由到对应的应用配方？",
    options: ["对 prompt 做哈希取模", "按关键词命中给每个 recipe 打分", "随机抽一个 recipe", "让用户手动选择"],
    answer: 1,
    explain: "路由层会把 prompt 里命中的 recipe 关键词按长度累计成分数，取分最高者；分数相同按注册顺序决定。"
  },
  {
    cat: "工程",
    q: "生成的 3 文件应用里，app.js 使用哪种脚本形式最稳妥？",
    options: ["ES Module", "经典脚本（classic script）", "JSX", "TypeScript 源文件"],
    answer: 1,
    explain: "预览是把 app.js 内联进页面执行的，经典脚本不需要任何构建或模块解析，兼容性最好。"
  },
  {
    cat: "规范",
    q: "recipe 的 localStorage 持久化 key 应该遵循什么命名？",
    options: ["vf:<recipe-id>:v1", "app-<recipe-id>", "local-storage-<id>", "直接用 id"],
    answer: 0,
    explain: "统一用 vf: 前缀 + 配方 id + 版本号，既避免不同应用互相覆盖，也方便以后迁移数据结构。"
  },
  {
    cat: "设计",
    q: "在 375px 宽的移动端验收中，下面哪一项是明确不允许的？",
    options: ["页面纵向滚动", "出现横向溢出 / 横向滚动条", "卡片改为纵向堆叠", "把 hover 操作换成可点击按钮"],
    answer: 1,
    explain: "规范要求 375px 下不出现横向滚动，所有内容必须在视口内可读、可点。"
  },
  {
    cat: "设计",
    q: "生成应用的取色方式，哪一种是符合规范的？",
    options: ["直接写死 #ffffff", "只通过 CSS 变量取色（var(--accent) 等）", "在 JS 里写内联 style 覆盖颜色", "引入外部配色库"],
    answer: 1,
    explain: "只允许用主题注入的 CSS 变量取色，这样深色 / 浅色主题都能正确显示，也不会破坏克制的视觉语言。"
  },
  {
    cat: "产品",
    q: "一个番茄钟在 25 分钟专注结束后，最合理的默认行为是？",
    options: ["直接再开始一个 25 分钟", "先记录这次专注，再进入休息", "清空所有历史记录", "自动关闭页面"],
    answer: 1,
    explain: "专注结束应先落一条专注记录（并给关联任务累计），再切到短休息，形成可复盘的节奏。"
  },
  {
    cat: "生成器",
    q: "VibeForge 里「recipe」的本质是什么？",
    options: ["对 LLM 的一次真实调用", "访问外部 API 的封装", "手写的、输出可运行应用的文件配方", "数据库里的一张表"],
    answer: 2,
    explain: "recipe 是手写的生成配方：声明产品名、卖点、feature，以及可直接运行的 HTML / CSS / JS 三件套。"
  },
  {
    cat: "规范",
    q: "为什么每个生成的应用都要求至少 6 条种子数据？",
    options: ["让首屏不空，打开就能体验真实交互", "为了占用更多存储空间", "为了增加代码复杂度", "为了方便截图"],
    answer: 0,
    explain: "首次打开就有内容，用户能立刻看懂信息架构并试着操作，而不是面对一个空白页面。"
  }
];

var state = {
  screen: "start",
  filter: "all",
  questions: [],
  index: 0,
  correct: 0,
  answers: [],
  selected: -1,
  answered: false,
  best: null,
  runs: 0,
  attempts: []
};

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed.best === "number") state.best = parsed.best;
      if (parsed && typeof parsed.runs === "number") state.runs = parsed.runs;
      if (parsed && Array.isArray(parsed.attempts)) state.attempts = parsed.attempts.slice(0, 6);
    }
  } catch (e) {}
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ best: state.best, runs: state.runs, attempts: state.attempts }));
  } catch (e) {}
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function fmtDate(ts) {
  var d = new Date(ts);
  return (d.getMonth() + 1) + " 月 " + d.getDate() + " 日";
}

function totalQuestions() { return BANK.length; }

function categories() {
  var seen = {};
  var out = [];
  BANK.forEach(function (q) {
    if (!seen[q.cat]) { seen[q.cat] = 1; out.push(q.cat); }
  });
  return out;
}

function pool() {
  if (state.filter === "all") return BANK.slice();
  return BANK.filter(function (q) { return q.cat === state.filter; });
}

function categoryCount(cat) {
  if (cat === "all") return BANK.length;
  return BANK.filter(function (q) { return q.cat === cat; }).length;
}

function updateBest() {
  document.getElementById("best-score").textContent = state.best === null ? "—" : state.best;
  document.getElementById("best-total").textContent = "/ " + totalQuestions();
}

function render() {
  var stage = document.getElementById("stage");
  if (state.screen === "start") stage.innerHTML = startHtml();
  else if (state.screen === "quiz") stage.innerHTML = quizHtml();
  else stage.innerHTML = resultHtml();
  updateBest();
  if (state.screen === "quiz") {
    var nextBtn = stage.querySelector('[data-act="next"]');
    if (nextBtn) nextBtn.focus();
  }
}

function startHtml() {
  var count = pool().length;
  var h = '<section class="card">';
  h += '<span class="start-badge">共 ' + count + " 题 \xb7 单选题 \xb7 立即解析</span>";
  h += '<h2 class="start-title">产品与工程常识小测</h2>';
  h += '<p class="start-desc">题目覆盖生成器的路由机制、设计规范、工程细节与产品判断。选完立刻看到对错和解析，答完会给出得分与逐题回顾。</p>';
  h += '<div class="cat-filter" role="group" aria-label="选择题库范围">';
  var cats = ["all"].concat(categories());
  cats.forEach(function (c) {
    var label = c === "all" ? "全部" : c;
    h += '<button type="button" class="cat-btn' + (state.filter === c ? " is-active" : "") +
      '" data-act="filter" data-cat="' + escapeHtml(c) + '">' + escapeHtml(label) +
      "<em>" + categoryCount(c) + "</em></button>";
  });
  h += "</div>";
  h += '<div class="start-stats">';
  h += '<div class="s-stat"><strong>' + state.runs + '</strong><span>已完成次数</span></div>';
  h += '<div class="s-stat"><strong>' + totalQuestions() + '</strong><span>题库题目</span></div>';
  h += '<div class="s-stat"><strong>' + (state.best === null ? "—" : state.best) + '</strong><span>最高分</span></div>';
  h += "</div>";
  h += '<button type="button" class="primary" data-act="start">开始答题</button>';
  if (state.attempts.length) {
    h += '<div class="recent"><p class="recent-title">最近成绩</p><div class="recent-list">';
    state.attempts.slice(0, 3).forEach(function (a) {
      var pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
      h += '<div class="recent-row"><span>' + fmtDate(a.ts) + '</span><span><b>' + a.score + " / " + a.total + "</b> \xb7 " + pct + '%</span></div>';
    });
    h += "</div></div>";
  }
  h += "</section>";
  return h;
}

function quizHtml() {
  var q = state.questions[state.index];
  var total = state.questions.length;
  var pct = Math.round(((state.index + (state.answered ? 1 : 0)) / total) * 100);
  var h = '<section class="card">';
  h += '<div class="progress"><i style="width:' + pct + '%"></i></div>';
  h += '<div class="q-meta"><span class="q-badge">' + escapeHtml(q.cat) + "</span>";
  h += "<span>第 " + (state.index + 1) + " / " + total + " 题</span>";
  h += '<span class="q-now">当前得分 ' + state.correct + "</span></div>";
  h += '<h2 class="q-text">' + escapeHtml(q.q) + "</h2>";
  h += '<ul class="options">';
  q.options.forEach(function (opt, i) {
    var cls = "option";
    var flag = "";
    if (state.answered) {
      if (i === q.answer) { cls += " is-correct"; flag = "正确答案"; }
      else if (i === state.selected) { cls += " is-wrong"; flag = "你的选择"; }
      else cls += " is-dim";
    }
    h += '<li><button type="button" class="' + cls + '" data-act="answer" data-idx="' + i + '"' + (state.answered ? " disabled" : "") + ">";
    h += '<span class="opt-key">' + LETTERS[i] + "</span>";
    h += '<span class="opt-text">' + escapeHtml(opt) + "</span>";
    h += '<span class="opt-flag">' + flag + "</span>";
    h += "</button></li>";
  });
  h += "</ul>";
  if (state.answered) {
    var ok = state.selected === q.answer;
    h += '<div class="explain' + (ok ? "" : " is-bad") + '">';
    h += '<p class="explain-title">' + (ok ? "答对了" : "正确答案是 " + LETTERS[q.answer] + "：" + escapeHtml(q.options[q.answer])) + "</p>";
    h += '<p class="explain-text">' + escapeHtml(q.explain) + "</p></div>";
    h += '<div class="quiz-actions"><span></span><button type="button" class="primary" data-act="next">' +
      (state.index === total - 1 ? "查看结果" : "下一题") + "</button></div>";
  } else {
    h += '<p class="quiz-hint">选一个你认为正确的答案，选择后不能修改。</p>';
  }
  h += "</section>";
  return h;
}

function resultHtml() {
  var total = state.questions.length;
  var pct = total ? Math.round((state.correct / total) * 100) : 0;
  var r = 52;
  var circ = 2 * Math.PI * r;
  var offset = circ * (1 - pct / 100);
  var wrong = total - state.correct;
  var comment;
  if (pct >= 90) comment = "几乎满分，这套题你已经很熟了。可以试着解释给同事听。";
  else if (pct >= 70) comment = "状态不错，把错题解析过一遍就基本稳了。";
  else if (pct >= 50) comment = "刚过线。建议先看一眼错题，再答一次。";
  else comment = "别急，先把下面的逐题解析读一遍，再挑战一次。";

  var h = '<section class="card">';
  h += '<div class="result-head">';
  h += '<div class="score-ring"><svg viewBox="0 0 120 120" aria-hidden="true">';
  h += '<circle class="ring-track" cx="60" cy="60" r="' + r + '"></circle>';
  h += '<circle class="ring-bar" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '"></circle>';
  h += '</svg><div class="ring-center"><strong>' + pct + '</strong><span>分</span></div></div>';
  h += '<div class="result-text"><p class="result-eyebrow">本次成绩</p>';
  h += '<h2 class="result-title">答对 ' + state.correct + " / " + total + " 题</h2>";
  h += '<p class="result-desc">' + comment + "</p></div></div>";
  h += '<div class="result-stats">';
  h += '<span class="r-stat">答对 <b>' + state.correct + "</b></span>";
  h += '<span class="r-stat">答错 <b>' + wrong + "</b></span>";
  h += '<span class="r-stat">正确率 <b>' + pct + "%</b></span>";
  h += '<span class="r-stat">最高分 <b>' + (state.best === null ? "—" : state.best) + "</b></span>";
  h += "</div>";

  h += '<div class="review"><p class="review-title">逐题回顾</p><ul class="review-list">';
  state.questions.forEach(function (q, i) {
    var picked = typeof state.answers[i] === "number" ? state.answers[i] : -1;
    var ok = picked === q.answer;
    h += '<li class="review-row ' + (ok ? "ok" : "bad") + '">';
    h += '<span class="r-mark">' + (ok ? "✓" : "\xd7") + "</span>";
    h += '<div class="r-body"><p class="r-q">' + (i + 1) + ". " + escapeHtml(q.q) + "</p>";
    h += '<p class="r-a">你的答案 ' + (picked >= 0 ? LETTERS[picked] : "—") + " \xb7 正确答案 " + LETTERS[q.answer] + " \xb7 " + escapeHtml(q.options[q.answer]) + "</p></div></li>";
  });
  h += "</ul></div>";

  h += '<div class="result-actions"><button type="button" class="primary" data-act="restart">再答一次</button>';
  h += '<button type="button" class="ghost" data-act="home">回到首页</button></div>';
  h += "</section>";
  return h;
}

function startRun() {
  var list = pool();
  if (!list.length) list = BANK.slice();
  state.questions = list;
  state.screen = "quiz";
  state.index = 0;
  state.correct = 0;
  state.answers = [];
  state.selected = -1;
  state.answered = false;
  render();
}

function finishRun() {
  var total = state.questions.length;
  state.runs += 1;
  state.attempts.unshift({ score: state.correct, total: total, ts: Date.now() });
  if (state.attempts.length > 6) state.attempts.length = 6;
  if (state.best === null || state.correct > state.best) state.best = state.correct;
  save();
  state.screen = "result";
  render();
}

document.getElementById("stage").addEventListener("click", function (e) {
  var btn = e.target.closest("[data-act]");
  if (!btn) return;
  var act = btn.getAttribute("data-act");
  if (act === "start" || act === "restart") {
    startRun();
    return;
  }
  if (act === "home") {
    state.screen = "start";
    render();
    return;
  }
  if (act === "filter") {
    state.filter = btn.getAttribute("data-cat");
    render();
    return;
  }
  if (act === "answer") {
    if (state.answered) return;
    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    var q = BANK[state.index];
    state.selected = idx;
    state.answers[state.index] = idx;
    state.answered = true;
    if (idx === q.answer) state.correct += 1;
    render();
    return;
  }
  if (act === "next") {
    if (!state.answered) return;
    if (state.index >= totalQuestions() - 1) finishRun();
    else {
      state.index += 1;
      state.selected = -1;
      state.answered = false;
      render();
    }
  }
});

load();
render();
`}}},{id:"game-2048",label:"2048 游戏",keywords:["2048","小游戏","数字合并","合并方块","方块游戏","滑动","game"],build:function(t){return{name:"Merge 2048",tagline:"把小数字撞成大数字，看你能走多远",summary:"一个完整的 2048 小游戏：方向键、WASD、手机滑动都能操作，相同数字合并时放大提示，得分与最高分实时累计，关掉页面再回来还能接着玩。",features:[{icon:"layout",title:"键盘 + 触屏",detail:"方向键 / WASD / 滑动三条输入通道"},{icon:"zap",title:"合并动画",detail:"新方块弹出、合并方块轻微放大"},{icon:"grip",title:"撤销一步",detail:"手滑走错可以退回上一步"},{icon:"database",title:"本地存档",detail:"棋盘、得分、最高分自动保存在浏览器"}],body:`
  <main class="wrap">
    <header class="top">
      <div class="intro">
        <p class="eyebrow">MERGE 2048</p>
        <h1>把相同数字撞在一起</h1>
        <p class="sub">方向键、WASD 或直接滑动棋盘，每次移动都会新生成一个方块。合成 2048 就算赢。</p>
      </div>
      <div class="scores">
        <div class="score-box"><span>得分</span><strong id="score">0</strong></div>
        <div class="score-box"><span>最高</span><strong id="best">0</strong></div>
      </div>
    </header>

    <div class="game">
      <section class="board-col">
        <div class="board-wrap">
          <div class="board" id="board" aria-label="2048 棋盘"></div>
          <div class="overlay" id="overlay" hidden>
            <p class="ov-title" id="ov-title">本局结束</p>
            <p class="ov-sub" id="ov-sub">没有可以移动的方向了</p>
            <button class="btn primary" id="ov-btn" type="button">再来一局</button>
          </div>
        </div>
        <div class="actions">
          <button class="btn ghost" id="undo" type="button">撤销一步</button>
          <button class="btn primary" id="restart" type="button">新开一局</button>
        </div>
        <p class="hint">提示：合出 <strong>2048</strong> 的方块即为通关 \xb7 进度会自动保存在本地</p>
      </section>

      <aside class="side">
        <div class="side-head">
          <h2>对局记录</h2>
          <span id="record-count">0 局</span>
        </div>
        <ul class="records" id="records"></ul>
        <p class="side-empty" id="side-empty" hidden>还没有记录，先开一局吧。</p>
        <button class="link" id="clear-records" type="button">清空记录</button>
      </aside>
    </div>
  </main>`,css:`
.wrap{max-width:820px;margin:0 auto;padding:48px 24px 72px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:26px;flex-wrap:wrap}
.eyebrow{font-size:11px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:10px}
h1{font-size:clamp(29px,4.6vw,42px);line-height:1.08;letter-spacing:-.03em;font-weight:700}
.sub{color:var(--muted);font-size:13.5px;line-height:1.6;margin-top:9px;max-width:34em}
.scores{display:flex;gap:10px;flex-shrink:0}
.score-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:9px 16px;min-width:88px;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -20px rgba(0,0,0,.18)}
.score-box span{display:block;font-size:10px;letter-spacing:.16em;color:var(--muted);margin-bottom:3px}
.score-box strong{font-size:22px;line-height:1;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums}
.game{display:grid;grid-template-columns:minmax(0,1fr) 232px;gap:26px;align-items:start}
.board-wrap{position:relative}
.board{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;aspect-ratio:1;background:color-mix(in srgb,var(--text) 7%,var(--bg));border:1px solid var(--border);border-radius:calc(var(--radius) + 8px);touch-action:none;user-select:none;-webkit-user-select:none}
.cell{position:relative;border-radius:calc(var(--radius) - 2px);background:color-mix(in srgb,var(--text) 4.5%,transparent)}
.tile{position:absolute;inset:0;display:grid;place-items:center;border-radius:calc(var(--radius) - 2px);font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em;font-size:clamp(17px,4.4vw,27px);background:var(--surface);border:1px solid var(--border);color:var(--text)}
.tile.spawn{animation:spawn .16s ease both}
.tile.pop{animation:pop .16s ease both}
@keyframes spawn{from{transform:scale(.35);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes pop{0%{transform:scale(1)}55%{transform:scale(1.12)}100%{transform:scale(1)}}
.t2{background:color-mix(in srgb,var(--text) 6%,var(--surface));color:var(--text)}
.t4{background:color-mix(in srgb,var(--text) 12%,var(--surface));color:var(--text)}
.t8{background:color-mix(in srgb,var(--accent) 16%,var(--surface));color:var(--text)}
.t16{background:color-mix(in srgb,var(--accent) 26%,var(--surface));color:var(--text)}
.t32{background:color-mix(in srgb,var(--accent) 38%,var(--surface));color:var(--text)}
.t64{background:color-mix(in srgb,var(--accent) 50%,var(--surface));color:var(--bg)}
.t128{background:color-mix(in srgb,var(--accent) 62%,var(--surface));color:var(--bg)}
.t256{background:color-mix(in srgb,var(--accent) 74%,var(--surface));color:var(--bg)}
.t512{background:color-mix(in srgb,var(--accent) 86%,var(--surface));color:var(--bg)}
.t1024{background:var(--accent);color:var(--bg)}
.t2048,.thigh{background:var(--accent2);color:var(--bg)}
.overlay{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:6px;text-align:center;padding:24px;background:color-mix(in srgb,var(--bg) 74%,transparent);backdrop-filter:blur(3px);border-radius:calc(var(--radius) + 8px);animation:fade .18s ease both}
[hidden]{display:none!important}
@keyframes fade{from{opacity:0}to{opacity:1}}
.ov-title{font-size:22px;font-weight:700;letter-spacing:-.02em}
.ov-sub{font-size:13px;color:var(--muted);margin-bottom:12px}
.actions{display:flex;gap:10px;margin-top:14px}
.btn{font-size:13.5px;font-weight:600;padding:10px 18px;border-radius:calc(var(--radius) - 2px);transition:filter .15s,transform .15s,background .15s,border-color .15s;border:1px solid transparent}
.btn.primary{background:var(--accent);color:var(--bg);flex:1}
.btn.primary:hover{filter:brightness(1.07)}
.btn.primary:active{transform:scale(.985)}
.btn.ghost{background:var(--surface);border-color:var(--border);color:var(--text)}
.btn.ghost:hover{border-color:color-mix(in srgb,var(--text) 22%,transparent)}
.btn:focus-visible,.link:focus-visible,.rec-del:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
.hint{margin-top:14px;font-size:11.5px;color:var(--muted);line-height:1.6}
.hint strong{color:var(--text);font-weight:600}
.side{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 16px 12px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -20px rgba(0,0,0,.18)}
.side-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--border);margin-bottom:10px}
.side-head h2{font-size:12.5px;font-weight:600;letter-spacing:.02em}
.side-head span{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.records{display:flex;flex-direction:column;gap:6px}
.rec{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;transition:background .15s}
.rec:hover{background:color-mix(in srgb,var(--text) 4%,transparent)}
.rec-score{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--text)}
.rec-meta{font-size:10.5px;color:var(--muted);margin-left:auto;text-align:right;line-height:1.4}
.rec-del{width:22px;height:22px;display:grid;place-items:center;color:var(--muted);border-radius:5px;line-height:0;opacity:0;transition:opacity .15s,color .15s,background .15s;flex-shrink:0}
.rec:hover .rec-del{opacity:1}
@media (hover:none){.rec-del{opacity:.8}}
.rec-del:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.side-empty{font-size:12px;color:var(--muted);padding:16px 2px}
.link{font-size:11.5px;color:var(--muted);padding:8px 2px 2px;transition:color .15s}
.link:hover{color:var(--accent)}
@media (max-width:720px){
  .wrap{padding:30px 16px 52px}
  .top{gap:16px}
  .game{grid-template-columns:1fr;gap:20px}
  .sub{font-size:13px}
  .rec-del{opacity:1}
}`,js:`
var KEY = "vf:game-2048:v1";
var SIZE = 4;
var state = { board: [], score: 0, best: 0, records: [], undo: [], over: false };

function uid() { return Math.random().toString(36).slice(2, 10); }

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      board: state.board, score: state.score, best: state.best, records: state.records
    }));
  } catch (e) {}
}

function emptyBoard() {
  var b = [];
  for (var i = 0; i < 16; i++) b.push(0);
  return b;
}

function emptyCells(board) {
  var pool = [];
  for (var i = 0; i < 16; i++) { if (!board[i]) pool.push(i); }
  return pool;
}

function addTile(board) {
  var pool = emptyCells(board);
  if (!pool.length) return -1;
  var idx = pool[Math.floor(Math.random() * pool.length)];
  board[idx] = Math.random() < 0.9 ? 2 : 4;
  return idx;
}

function seedRecords() {
  var now = Date.now();
  var day = 86400000;
  return [
    { id: uid(), score: 6204, max: 256, at: now - day * 1.2 },
    { id: uid(), score: 5118, max: 128, at: now - day * 2.6 },
    { id: uid(), score: 3860, max: 128, at: now - day * 4.1 },
    { id: uid(), score: 2744, max: 64, at: now - day * 6.8 },
    { id: uid(), score: 1986, max: 64, at: now - day * 9.4 },
    { id: uid(), score: 1052, max: 32, at: now - day * 12.5 }
  ];
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var data = JSON.parse(raw);
      var okBoard = data && Array.isArray(data.board) && data.board.length === 16;
      if (okBoard) {
        state.board = data.board.map(function (v) { return Number(v) || 0; });
        state.score = Number(data.score) || 0;
        state.best = Number(data.best) || 0;
        state.records = Array.isArray(data.records) ? data.records : seedRecords();
        if (!state.board.some(function (v) { return v > 0; })) {
          state.board = emptyBoard(); addTile(state.board); addTile(state.board);
        }
        return;
      }
    }
  } catch (e) {}
  state.board = emptyBoard();
  addTile(state.board); addTile(state.board);
  state.score = 0;
  state.best = 0;
  state.records = seedRecords();
  save();
}

function linesFor(dir) {
  var lines = [];
  for (var i = 0; i < 4; i++) {
    var line = [];
    for (var j = 0; j < 4; j++) {
      var r, c;
      if (dir === "left") { r = i; c = j; }
      else if (dir === "right") { r = i; c = 3 - j; }
      else if (dir === "up") { r = j; c = i; }
      else { r = 3 - j; c = i; }
      line.push(r * 4 + c);
    }
    lines.push(line);
  }
  return lines;
}

function doMove(dir) {
  if (state.over) return;
  var lines = linesFor(dir);
  var next = state.board.slice();
  var mergedAt = {};
  var gained = 0;
  var moved = false;

  lines.forEach(function (idxs) {
    var vals = [];
    idxs.forEach(function (idx) { if (state.board[idx]) vals.push(state.board[idx]); });
    var out = [];
    var i = 0;
    while (i < vals.length) {
      if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
        var v = vals[i] * 2;
        out.push(v);
        gained += v;
        mergedAt[idxs[out.length - 1]] = true;
        i += 2;
      } else {
        out.push(vals[i]);
        i += 1;
      }
    }
    while (out.length < 4) out.push(0);
    for (var k = 0; k < 4; k++) {
      if (state.board[idxs[k]] !== out[k]) moved = true;
      next[idxs[k]] = out[k];
    }
  });

  if (!moved) return;

  state.undo.push({ board: state.board.slice(), score: state.score });
  if (state.undo.length > 20) state.undo.shift();
  state.board = next;
  state.score += gained;
  if (state.score > state.best) state.best = state.score;
  var spawned = addTile(state.board);
  render({ merged: mergedAt, spawned: spawned });

  var won = state.board.some(function (v) { return v >= 2048; });
  if (won && !state.wonShown) {
    state.wonShown = true;
    showOverlay("合出 2048！", "你已经通关，可以继续挑战更高分。", "继续挑战");
  } else if (!canMove()) {
    endGame();
  }
  save();
}

function canMove() {
  for (var i = 0; i < 16; i++) { if (!state.board[i]) return true; }
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 3; c++) {
      if (state.board[r * 4 + c] === state.board[r * 4 + c + 1]) return true;
    }
  }
  for (var c2 = 0; c2 < 4; c2++) {
    for (var r2 = 0; r2 < 3; r2++) {
      if (state.board[r2 * 4 + c2] === state.board[(r2 + 1) * 4 + c2]) return true;
    }
  }
  return false;
}

function endGame() {
  state.over = true;
  pushRecord(state.score);
  showOverlay("本局结束", "得分 " + state.score + " \xb7 最高方块 " + maxTile(), "再来一局");
  save();
}

function maxTile() {
  var m = 0;
  state.board.forEach(function (v) { if (v > m) m = v; });
  return m || 2;
}

function pushRecord(score) {
  if (!score) return;
  state.records.unshift({ id: uid(), score: score, max: maxTile(), at: Date.now() });
  if (state.records.length > 12) state.records.length = 12;
  save();
}

function showOverlay(title, sub, label) {
  $("#ov-title").textContent = title;
  $("#ov-sub").textContent = sub;
  $("#ov-btn").textContent = label;
  $("#overlay").hidden = false;
}

function hideOverlay() { $("#overlay").hidden = true; }

function formatDate(at) {
  var d = new Date(at);
  var now = new Date();
  var sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  var md = (d.getMonth() + 1) + "/" + d.getDate();
  if (sameDay) return "今天 " + md;
  return md;
}

function render(anim) {
  var boardEl = $("#board");
  boardEl.innerHTML = "";
  state.board.forEach(function (v, i) {
    var cell = document.createElement("div");
    cell.className = "cell";
    if (v) {
      var tile = document.createElement("div");
      var tier = v <= 4096 ? " t" + v : " thigh";
      tile.className = "tile" + tier;
      if (anim && anim.spawned === i) tile.className += " spawn";
      if (anim && anim.merged && anim.merged[i]) tile.className += " pop";
      tile.textContent = String(v);
      cell.appendChild(tile);
    }
    boardEl.appendChild(cell);
  });
  $("#score").textContent = String(state.score);
  $("#best").textContent = String(state.best);
  $("#record-count").textContent = state.records.length + " 局";
  renderRecords();
}

function renderRecords() {
  var listEl = $("#records");
  listEl.innerHTML = "";
  state.records.forEach(function (rec) {
    var li = document.createElement("li");
    li.className = "rec";
    var score = document.createElement("span");
    score.className = "rec-score";
    score.textContent = String(rec.score);
    var meta = document.createElement("span");
    meta.className = "rec-meta";
    meta.textContent = "最大 " + rec.max + " \xb7 " + formatDate(rec.at);
    var del = document.createElement("button");
    del.className = "rec-del";
    del.type = "button";
    del.title = "删除这条记录";
    del.setAttribute("aria-label", "删除记录");
    del.textContent = "\xd7";
    del.addEventListener("click", function () {
      state.records = state.records.filter(function (r) { return r.id !== rec.id; });
      save(); render();
    });
    li.appendChild(score);
    li.appendChild(meta);
    li.appendChild(del);
    listEl.appendChild(li);
  });
  $("#side-empty").hidden = state.records.length > 0;
}

function restart() {
  if (state.score > 0 && !state.over) pushRecord(state.score);
  state.board = emptyBoard();
  addTile(state.board); addTile(state.board);
  state.score = 0;
  state.over = false;
  state.wonShown = false;
  state.undo = [];
  hideOverlay();
  render();
  save();
}

function undo() {
  if (!state.undo.length) return;
  var prev = state.undo.pop();
  state.board = prev.board.slice();
  state.score = prev.score;
  state.over = false;
  hideOverlay();
  render();
  save();
}

var $ = function (sel) { return document.querySelector(sel); };

var KEYMAP = {
  arrowleft: "left", arrowright: "right", arrowup: "up", arrowdown: "down",
  a: "left", d: "right", w: "up", s: "down"
};

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var dir = KEYMAP[String(e.key || "").toLowerCase()];
  if (!dir) return;
  e.preventDefault();
  doMove(dir);
});

var touchStart = null;
var boardEl = $("#board");
boardEl.addEventListener("touchstart", function (e) {
  var t = e.touches && e.touches[0];
  if (!t) return;
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });
boardEl.addEventListener("touchend", function (e) {
  if (!touchStart) return;
  var t = e.changedTouches && e.changedTouches[0];
  if (!t) { touchStart = null; return; }
  var dx = t.clientX - touchStart.x;
  var dy = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
  else doMove(dy > 0 ? "down" : "up");
}, { passive: true });

$("#restart").addEventListener("click", restart);
$("#undo").addEventListener("click", undo);
$("#ov-btn").addEventListener("click", function () {
  if (state.over) restart();
  else hideOverlay();
});
$("#clear-records").addEventListener("click", function () {
  state.records = [];
  save(); render();
});

load();
render();
`}}},{id:"dashboard",label:"数据看板",keywords:["数据看板","看板","dashboard","kpi","指标","折线图","柱状图","数据表格","数据面板","图表","analytics"],build:function(t){return{name:"Pulse 看板",tagline:"把流量、转化和收入放进同一块屏幕",summary:"一个增长数据看板：顶部四张 KPI 指标卡、本期与上期的折线对比、渠道构成柱状图，以及可按任意列排序、点开看明细的渠道表格。切换 7/30/90 天会重算全部数据。",features:[{icon:"chart",title:"指标卡 + 趋势线",detail:"四个核心 KPI，配迷你走势和环比"},{icon:"layout",title:"纯 SVG 图表",detail:"折线对比与渠道柱状，无第三方图表库"},{icon:"filter",title:"时间与渠道筛选",detail:"7/30/90 天、四类渠道一键切换"},{icon:"grip",title:"可排序表格",detail:"点表头排序，点行展开明细"}],body:`
  <main class="app">
    <header class="head">
      <div class="head-main">
        <p class="eyebrow">GROWTH OVERVIEW</p>
        <h1>增长概览</h1>
        <p class="sub" id="sub">最近 30 天的流量与收入表现</p>
      </div>
      <div class="range" role="tablist" aria-label="时间范围">
        <button class="range-btn" data-range="7" role="tab" type="button">7 天</button>
        <button class="range-btn" data-range="30" role="tab" type="button">30 天</button>
        <button class="range-btn" data-range="90" role="tab" type="button">90 天</button>
      </div>
    </header>

    <section class="kpis" id="kpis" aria-label="核心指标"></section>

    <div class="grid">
      <article class="card chart-card">
        <div class="card-head">
          <div>
            <h2>趋势</h2>
            <p class="card-sub" id="chart-sub">访问量 \xb7 本期 vs 上期</p>
          </div>
          <div class="seg" role="tablist" aria-label="图表指标">
            <button class="seg-btn" data-metric="visits" role="tab" type="button">访问量</button>
            <button class="seg-btn" data-metric="revenue" role="tab" type="button">收入</button>
          </div>
        </div>
        <div class="legend" aria-hidden="true">
          <span class="l-cur">本期</span>
          <span class="l-prev">上期</span>
        </div>
        <div class="line-wrap" id="line-wrap"></div>
      </article>

      <article class="card bars-card">
        <div class="card-head">
          <div>
            <h2>渠道构成</h2>
            <p class="card-sub">按访问量排序</p>
          </div>
        </div>
        <div class="bars-wrap" id="bars-wrap"></div>
      </article>
    </div>

    <section class="card table-card">
      <div class="card-head table-head">
        <div>
          <h2>渠道明细</h2>
          <p class="card-sub" id="table-sub">点表头排序 \xb7 点行展开</p>
        </div>
        <div class="filters" role="tablist" aria-label="渠道筛选">
          <button class="chip" data-filter="all" role="tab" type="button">全部 <em>6</em></button>
          <button class="chip" data-filter="search" role="tab" type="button">搜索</button>
          <button class="chip" data-filter="own" role="tab" type="button">自有</button>
          <button class="chip" data-filter="social" role="tab" type="button">社交</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col"><button class="th" data-key="name" type="button">渠道</button></th>
              <th scope="col" class="num"><button class="th" data-key="visits" type="button">访问量</button></th>
              <th scope="col" class="num col-conv"><button class="th" data-key="conv" type="button">转化率</button></th>
              <th scope="col" class="num"><button class="th" data-key="revenue" type="button">收入</button></th>
              <th scope="col" class="num"><button class="th" data-key="delta" type="button">环比</button></th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
      <p class="empty" id="empty" hidden>这个分类下暂时没有渠道。</p>
    </section>

    <p class="foot">演示数据 \xb7 偏好（时间范围 / 筛选 / 排序）会保存在本地</p>
  </main>`,css:`
.app{max-width:1040px;margin:0 auto;padding:48px 24px 72px}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:24px;flex-wrap:wrap}
.eyebrow{font-size:11px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:10px}
h1{font-size:clamp(28px,4vw,38px);line-height:1.12;letter-spacing:-.025em;font-weight:700}
.sub{color:var(--muted);font-size:13px;margin-top:8px}
.range{display:inline-flex;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) - 2px);padding:3px}
.range-btn{font-size:12.5px;color:var(--muted);padding:6px 13px;border-radius:calc(var(--radius) - 5px);transition:background .15s,color .15s}
.range-btn:hover{color:var(--text)}
.range-btn.is-active{background:var(--accent);color:var(--bg);font-weight:600}
.range-btn:focus-visible,.seg-btn:focus-visible,.chip:focus-visible,.th:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
.kpi{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -22px rgba(0,0,0,.18)}
.kpi-label{display:block;font-size:11.5px;color:var(--muted);margin-bottom:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kpi-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px}
.kpi-value{font-size:24px;line-height:1;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kpi-side{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0}
.delta{font-size:10.5px;font-weight:600;font-variant-numeric:tabular-nums;padding:2px 6px;border-radius:5px;white-space:nowrap}
.delta.up{color:var(--accent);background:color-mix(in srgb,var(--accent) 11%,transparent)}
.delta.down{color:var(--muted);background:color-mix(in srgb,var(--text) 7%,transparent)}
.spark{width:64px;height:20px;display:block}
.spark path{fill:none;stroke:var(--accent);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.spark.down path{stroke:color-mix(in srgb,var(--muted) 80%,transparent)}
.grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:14px;margin-bottom:14px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 18px 16px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -22px rgba(0,0,0,.18)}
.card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}
.card-head h2{font-size:13.5px;font-weight:600;letter-spacing:-.01em}
.card-sub{font-size:11px;color:var(--muted);margin-top:4px}
.seg{display:inline-flex;gap:2px;background:color-mix(in srgb,var(--text) 5%,transparent);border-radius:calc(var(--radius) - 4px);padding:2px;flex-shrink:0}
.seg-btn{font-size:11.5px;color:var(--muted);padding:4px 9px;border-radius:calc(var(--radius) - 6px);transition:background .15s,color .15s}
.seg-btn:hover{color:var(--text)}
.seg-btn.is-active{background:var(--surface);color:var(--text);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.legend{display:flex;gap:16px;font-size:10.5px;color:var(--muted);margin:-4px 0 6px}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend span::before{content:"";width:14px;height:2px;border-radius:2px;background:var(--accent)}
.legend .l-prev::before{background:var(--muted);opacity:.7}
.line-wrap{width:100%}
.line-svg{width:100%;height:auto;display:block}
.line-svg .grid-line{stroke:var(--border);stroke-width:1}
.line-svg .axis-text{fill:var(--muted);font-size:9.5px;font-family:var(--font);font-variant-numeric:tabular-nums}
.line-svg .area{fill:color-mix(in srgb,var(--accent) 9%,transparent)}
.line-svg .line-cur{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.line-svg .line-prev{fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 4;opacity:.75;stroke-linecap:round}
.line-svg .dot{fill:var(--surface);stroke:var(--accent);stroke-width:1.6}
.bars-wrap{width:100%}
.bars-svg{width:100%;height:auto;display:block}
.bars-svg .bar{fill:color-mix(in srgb,var(--accent) 38%,transparent);transition:fill .15s}
.bars-svg .bar:hover{fill:var(--accent)}
.bars-svg .bar-name{fill:var(--muted);font-size:9.5px;font-family:var(--font)}
.bars-svg .bar-value{fill:var(--text);font-size:9.5px;font-family:var(--font);font-weight:600;font-variant-numeric:tabular-nums}
.bars-svg .base-line{stroke:var(--border);stroke-width:1}
.table-card{padding-bottom:10px}
.table-head{flex-wrap:wrap}
.filters{display:flex;gap:4px;flex-wrap:wrap}
.chip{font-size:11.5px;color:var(--muted);padding:5px 10px;border-radius:999px;border:1px solid transparent;transition:all .15s}
.chip em{font-style:normal;opacity:.6;font-size:10px;margin-left:2px}
.chip:hover{color:var(--text);background:color-mix(in srgb,var(--text) 5%,transparent)}
.chip.is-active{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 38%,transparent);background:color-mix(in srgb,var(--accent) 9%,transparent)}
.table-wrap{overflow-x:auto;margin:0 -6px}
table{width:100%;border-collapse:collapse;font-size:12.5px}
th{text-align:left;padding:0 6px;border-bottom:1px solid var(--border)}
th.num{text-align:right}
.th{font-size:11px;color:var(--muted);font-weight:500;padding:8px 0;transition:color .15s;white-space:nowrap;width:100%;text-align:inherit}
.th:hover{color:var(--text)}
th.is-sorted .th{color:var(--accent);font-weight:600}
th.is-sorted .th::after{content:"";display:inline-block;width:0;height:0;margin-left:5px;border-left:3.5px solid transparent;border-right:3.5px solid transparent;vertical-align:middle}
th.is-sorted.asc .th::after{border-bottom:4px solid var(--accent)}
th.is-sorted.desc .th::after{border-top:4px solid var(--accent)}
tbody tr.row{cursor:pointer;transition:background .15s}
tbody tr.row:hover{background:color-mix(in srgb,var(--text) 3.5%,transparent)}
tbody tr.row.is-open{background:color-mix(in srgb,var(--accent) 6%,transparent)}
td{padding:10px 6px;border-bottom:1px solid color-mix(in srgb,var(--border) 70%,transparent);white-space:nowrap}
.row .name{display:flex;align-items:center;gap:8px;font-weight:500}
.dot-chip{width:7px;height:7px;border-radius:2px;background:color-mix(in srgb,var(--accent) 55%,transparent);flex-shrink:0}
.row .num{text-align:right;font-variant-numeric:tabular-nums;color:var(--muted)}
.row .num.strong{color:var(--text)}
.detail-row td{padding:0;border-bottom:1px solid var(--border);white-space:normal}
.detail{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:12px 8px 14px;animation:fade .18s ease both}
@keyframes fade{from{opacity:0}to{opacity:1}}
.detail div{min-width:0}
.detail span{display:block;font-size:10.5px;color:var(--muted);margin-bottom:3px}
.detail strong{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.empty{text-align:center;font-size:12.5px;color:var(--muted);padding:32px 0}
.foot{margin-top:22px;text-align:center;font-size:11px;color:var(--muted);opacity:.8}
@media (max-width:860px){
  .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
  .grid{grid-template-columns:1fr}
}
@media (max-width:560px){
  .app{padding:30px 16px 52px}
  .head{gap:16px}
  .kpi{padding:13px}
  .kpi-value{font-size:20px}
  .spark{width:48px}
  .line-svg .axis-text{font-size:11px}
  .bars-svg .bar-name,.bars-svg .bar-value{font-size:11px}
  .col-conv{display:none}
  .detail{grid-template-columns:repeat(2,minmax(0,1fr))}
  th,td{padding-left:4px;padding-right:4px}
  table{font-size:12px}
}`,js:`
var KEY = "vf:dashboard:v1";
var FACTOR = { "7": 1, "30": 4.4, "90": 13.2 };
var DELTAS = {
  "7": [9.8, 0.6, 11.2, -1.4],
  "30": [12.4, 0.8, 9.1, 2.3],
  "90": [18.2, 1.3, 15.6, 3.0]
};

var CHANNELS = [
  { id: "organic", name: "自然搜索", group: "search", visits: 16420, conv: 4.8, revenue: 93400, delta: 12.4, bounce: "36%", session: "3:52", newRate: "58%" },
  { id: "direct", name: "直接访问", group: "own", visits: 11280, conv: 3.2, revenue: 61200, delta: 4.1, bounce: "41%", session: "2:41", newRate: "22%" },
  { id: "social", name: "社交媒体", group: "social", visits: 8940, conv: 2.4, revenue: 31800, delta: -3.6, bounce: "52%", session: "1:48", newRate: "71%" },
  { id: "email", name: "邮件营销", group: "own", visits: 6210, conv: 6.9, revenue: 74100, delta: 8.2, bounce: "29%", session: "4:12", newRate: "18%" },
  { id: "paid", name: "付费广告", group: "search", visits: 5370, conv: 5.1, revenue: 88600, delta: 16.8, bounce: "44%", session: "3:05", newRate: "64%" },
  { id: "referral", name: "合作推荐", group: "social", visits: 3120, conv: 3.8, revenue: 24700, delta: -1.2, bounce: "39%", session: "2:58", newRate: "47%" }
];

var state = {
  range: "30",
  metric: "visits",
  filter: "all",
  sortKey: "visits",
  sortDir: "desc",
  open: {}
};

var $ = function (sel) { return document.querySelector(sel); };
var listAll = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
var round1 = function (n) { return Math.round(n * 10) / 10; };

function fmt(n) {
  var s = String(Math.round(Math.abs(n)));
  var out = "";
  var count = 0;
  for (var i = s.length - 1; i >= 0; i--) {
    out = s.charAt(i) + out;
    count += 1;
    if (count % 3 === 0 && i > 0) out = "," + out;
  }
  return n < 0 ? "-" + out : out;
}

function shortNum(n) {
  if (n >= 10000) return round1(n / 10000) + "万";
  if (n >= 1000) return round1(n / 1000) + "k";
  return String(Math.round(n));
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      range: state.range, metric: state.metric, filter: state.filter,
      sortKey: state.sortKey, sortDir: state.sortDir
    }));
  } catch (e) {}
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return;
    var d = JSON.parse(raw);
    if (!d) return;
    if (d.range === "7" || d.range === "30" || d.range === "90") state.range = d.range;
    if (d.metric === "visits" || d.metric === "revenue") state.metric = d.metric;
    if (d.filter === "all" || d.filter === "search" || d.filter === "own" || d.filter === "social") state.filter = d.filter;
    if (typeof d.sortKey === "string") state.sortKey = d.sortKey;
    if (d.sortDir === "asc" || d.sortDir === "desc") state.sortDir = d.sortDir;
  } catch (e) {}
}

function rows() {
  var f = FACTOR[state.range] || 1;
  var convAdj = state.range === "7" ? 1.03 : state.range === "90" ? 0.94 : 1;
  var revAdj = state.range === "7" ? 1.05 : state.range === "90" ? 0.92 : 1;
  return CHANNELS.map(function (c) {
    return {
      id: c.id,
      name: c.name,
      group: c.group,
      visits: Math.round(c.visits * f),
      conv: round1(c.conv * convAdj),
      revenue: Math.round(c.revenue * f * revAdj),
      delta: c.delta,
      bounce: c.bounce,
      session: c.session,
      newRate: c.newRate
    };
  });
}

function filtered(rs) {
  if (state.filter === "all") return rs;
  return rs.filter(function (r) { return r.group === state.filter; });
}

function totals(rs) {
  var visits = 0, revenue = 0, conv = 0, weight = 0;
  rs.forEach(function (r) {
    visits += r.visits;
    revenue += r.revenue;
    conv += r.conv * r.visits;
    weight += r.visits;
  });
  var avgConv = weight ? conv / weight : 0;
  var orders = visits * avgConv / 100;
  return {
    visits: visits,
    revenue: revenue,
    conv: avgConv,
    aov: orders > 0 ? revenue / orders : 0
  };
}

function genSeries(n, base, swing, phase) {
  var out = [];
  for (var i = 0; i < n; i++) {
    var v = base * (1 + Math.sin((i + phase) / 2.4) * swing + Math.sin((i + phase) / 5.1) * swing * 0.55);
    out.push(Math.max(0, Math.round(v)));
  }
  return out;
}

function sparkSvg(values, up) {
  if (!values.length) return "";
  var W = 64, H = 20;
  var max = Math.max.apply(null, values);
  var min = Math.min.apply(null, values);
  var span = max - min || 1;
  var step = values.length > 1 ? (W - 4) / (values.length - 1) : 0;
  var d = "";
  for (var i = 0; i < values.length; i++) {
    var x = 2 + i * step;
    var y = H - 3 - ((values[i] - min) / span) * (H - 7);
    d += (i ? "L" : "M") + round1(x) + " " + round1(y) + " ";
  }
  return '<svg class="spark' + (up ? "" : " down") + '" viewBox="0 0 64 20" aria-hidden="true"><path d="' + d + '"/></svg>';
}

function renderKpis() {
  var t = totals(rows());
  var deltas = DELTAS[state.range] || DELTAS["30"];
  var defs = [
    { label: "总访问量", value: fmt(t.visits), delta: deltas[0], seed: 130 },
    { label: "平均转化率", value: round1(t.conv) + "%", delta: deltas[1], seed: 4.2 },
    { label: "总收入", value: "\xa5" + fmt(t.revenue), delta: deltas[2], seed: 90 },
    { label: "客单价", value: "\xa5" + fmt(t.aov), delta: deltas[3], seed: 72 }
  ];
  var html = "";
  defs.forEach(function (k, idx) {
    var up = k.delta >= 0;
    var spark = sparkSvg(genSeries(12, k.seed, 0.16, idx * 1.7 + 0.5), up);
    html += '<div class="kpi">' +
      '<span class="kpi-label">' + k.label + " \xb7 " + state.range + " 天</span>" +
      '<div class="kpi-foot">' +
        '<strong class="kpi-value">' + k.value + "</strong>" +
        '<span class="kpi-side">' +
          '<span class="delta ' + (up ? "up" : "down") + '">' + (up ? "+" : "") + k.delta.toFixed(1) + "%</span>" +
          spark +
        "</span>" +
      "</div>" +
    "</div>";
  });
  $("#kpis").innerHTML = html;
  $("#sub").textContent = "最近 " + state.range + " 天的流量与收入表现";
}

function xLabels(n) {
  if (n === 7) return ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  var out = [];
  if (state.range === "30") {
    for (var i = 0; i < n; i++) out.push(1 + i * 3 + "日");
  } else {
    for (var j = 0; j < n; j++) out.push("第" + (j + 1) + "周");
  }
  return out;
}

function renderLine() {
  var n = state.range === "7" ? 7 : state.range === "30" ? 10 : 12;
  var t = totals(rows());
  var isRevenue = state.metric === "revenue";
  var total = isRevenue ? t.revenue : t.visits;
  var base = total / n;
  var cur = genSeries(n, base, 0.16, 1.2);
  var prev = genSeries(n, base * 0.91, 0.14, 3.4);
  var all = cur.concat(prev);
  var maxV = Math.max.apply(null, all);
  var niceMax = Math.ceil(maxV / 4) * 4 || 4;

  var W = 640, H = 240;
  var padL = 46, padR = 14, padT = 14, padB = 30;
  var plotW = W - padL - padR;
  var plotH = H - padT - padB;
  var stepX = n > 1 ? plotW / (n - 1) : 0;

  var svg = '<svg class="line-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (isRevenue ? "收入" : "访问量") + '趋势对比图">';

  for (var g = 0; g < 4; g++) {
    var gv = niceMax * (1 - g / 3);
    var gy = round1(padT + plotH * (g / 3));
    svg += '<line class="grid-line" x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '"/>';
    svg += '<text class="axis-text" x="' + (padL - 8) + '" y="' + (gy + 3.5) + '" text-anchor="end">' + (isRevenue ? "\xa5" + shortNum(gv) : shortNum(gv)) + "</text>";
  }

  var labels = xLabels(n);
  var labelStep = n > 7 ? 2 : 1;
  for (var lx = 0; lx < n; lx++) {
    if (lx % labelStep !== 0 && lx !== n - 1) continue;
    var lxx = round1(padL + lx * stepX);
    svg += '<text class="axis-text" x="' + lxx + '" y="' + (H - 9) + '" text-anchor="middle">' + labels[lx] + "</text>";
  }

  var curPoints = [];
  var prevPoints = [];
  for (var i = 0; i < n; i++) {
    curPoints.push([round1(padL + i * stepX), round1(padT + plotH - (cur[i] / niceMax) * plotH)]);
    prevPoints.push([round1(padL + i * stepX), round1(padT + plotH - (prev[i] / niceMax) * plotH)]);
  }

  function pathOf(points) {
    var d = "";
    for (var k = 0; k < points.length; k++) d += (k ? " L" : "M") + points[k][0] + " " + points[k][1];
    return d;
  }

  var area = pathOf(curPoints) + " L" + curPoints[n - 1][0] + " " + (padT + plotH) + " L" + curPoints[0][0] + " " + (padT + plotH) + " Z";
  svg += '<path class="area" d="' + area + '"/>';
  svg += '<path class="line-prev" d="' + pathOf(prevPoints) + '"/>';
  svg += '<path class="line-cur" d="' + pathOf(curPoints) + '"/>';
  for (var dIdx = 0; dIdx < n; dIdx++) {
    svg += '<circle class="dot" cx="' + curPoints[dIdx][0] + '" cy="' + curPoints[dIdx][1] + '" r="2.6"/>';
  }
  svg += "</svg>";

  $("#line-wrap").innerHTML = svg;
  $("#chart-sub").textContent = (isRevenue ? "收入" : "访问量") + " \xb7 本期 vs 上期";
  listAll("[data-metric]").forEach(function (b) {
    var on = b.getAttribute("data-metric") === state.metric;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function renderBars() {
  var rs = filtered(rows()).slice().sort(function (a, b) { return b.visits - a.visits; });
  var W = 640, H = 210;
  var padL = 10, padR = 10, padT = 20, padB = 34;
  var plotW = W - padL - padR;
  var plotH = H - padT - padB;
  var maxV = rs.length ? rs[0].visits : 1;
  var gap = 12;
  var barW = rs.length ? (plotW - gap * (rs.length - 1)) / rs.length : 10;
  var svg = '<svg class="bars-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="各渠道访问量柱状图">';
  svg += '<line class="base-line" x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (W - padR) + '" y2="' + (padT + plotH) + '"/>';

  rs.forEach(function (r, i) {
    var h = Math.max(3, round1((r.visits / maxV) * plotH));
    var x = round1(padL + i * (barW + gap));
    var y = round1(padT + plotH - h);
    svg += '<rect class="bar" x="' + x + '" y="' + y + '" width="' + round1(barW) + '" height="' + h + '" rx="3"/>';
    svg += '<text class="bar-value" x="' + round1(x + barW / 2) + '" y="' + (y - 6) + '" text-anchor="middle">' + shortNum(r.visits) + "</text>";
    svg += '<text class="bar-name" x="' + round1(x + barW / 2) + '" y="' + (padT + plotH + 16) + '" text-anchor="middle">' + r.name + "</text>";
  });
  svg += "</svg>";
  $("#bars-wrap").innerHTML = svg;
}

function sortedRows() {
  var rs = filtered(rows()).slice();
  var key = state.sortKey;
  var dir = state.sortDir === "asc" ? 1 : -1;
  rs.sort(function (a, b) {
    var av = a[key], bv = b[key];
    if (typeof av === "string") {
      if (key === "name") return av.localeCompare(bv, "zh-CN") * dir;
      return String(av).localeCompare(String(bv)) * dir;
    }
    return (av - bv) * dir;
  });
  return rs;
}

function renderTable() {
  var rs = sortedRows();
  var html = "";
  rs.forEach(function (r) {
    var open = !!state.open[r.id];
    var up = r.delta >= 0;
    html += '<tr class="row' + (open ? " is-open" : "") + '" data-id="' + r.id + '" aria-expanded="' + open + '">' +
      '<td><span class="name"><span class="dot-chip"></span>' + r.name + "</span></td>" +
      '<td class="num strong">' + fmt(r.visits) + "</td>" +
      '<td class="num col-conv">' + round1(r.conv).toFixed(1) + "%</td>" +
      '<td class="num strong">\xa5' + fmt(r.revenue) + "</td>" +
      '<td class="num"><span class="delta ' + (up ? "up" : "down") + '">' + (up ? "+" : "") + r.delta.toFixed(1) + "%</span></td>" +
    "</tr>";
    if (open) {
      html += '<tr class="detail-row"><td colspan="5"><div class="detail">' +
        "<div><span>跳出率</span><strong>" + r.bounce + "</strong></div>" +
        "<div><span>平均停留</span><strong>" + r.session + "</strong></div>" +
        "<div><span>新访客占比</span><strong>" + r.newRate + "</strong></div>" +
        "<div><span>每千次收入</span><strong>\xa5" + fmt(r.revenue / r.visits * 1000) + "</strong></div>" +
      "</div></td></tr>";
    }
  });
  $("#tbody").innerHTML = html;
  $("#empty").hidden = rs.length > 0;

  listAll("th").forEach(function (th) {
    var btn = th.querySelector(".th");
    if (!btn) return;
    var isCur = btn.getAttribute("data-key") === state.sortKey;
    th.classList.toggle("is-sorted", isCur);
    th.classList.toggle("asc", isCur && state.sortDir === "asc");
    th.classList.toggle("desc", isCur && state.sortDir === "desc");
    th.setAttribute("aria-sort", isCur ? (state.sortDir === "asc" ? "ascending" : "descending") : "none");
  });

  var counts = { all: 0, search: 0, own: 0, social: 0 };
  rows().forEach(function (r) { counts.all += 1; counts[r.group] += 1; });
  listAll("[data-filter]").forEach(function (c) {
    var f = c.getAttribute("data-filter");
    var em = c.querySelector("em");
    if (em && f === "all") em.textContent = String(counts.all);
    c.classList.toggle("is-active", f === state.filter);
    c.setAttribute("aria-selected", f === state.filter ? "true" : "false");
  });
  $("#table-sub").textContent = "共 " + rs.length + " 个渠道 \xb7 点行展开明细";
}

function render() {
  renderKpis();
  renderLine();
  renderBars();
  renderTable();
  listAll("[data-range]").forEach(function (b) {
    var on = b.getAttribute("data-range") === state.range;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
}

listAll("[data-range]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    state.range = btn.getAttribute("data-range");
    save();
    render();
  });
});

listAll("[data-metric]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    state.metric = btn.getAttribute("data-metric");
    save();
    renderLine();
  });
});

listAll("[data-filter]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    state.filter = btn.getAttribute("data-filter");
    save();
    renderBars();
    renderTable();
  });
});

listAll(".th").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var key = btn.getAttribute("data-key");
    if (state.sortKey === key) state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
    else {
      state.sortKey = key;
      state.sortDir = key === "name" ? "asc" : "desc";
    }
    save();
    renderTable();
  });
});

$("#tbody").addEventListener("click", function (e) {
  var el = e.target;
  while (el && el !== document.body && el.tagName !== "TR") el = el.parentNode;
  if (!el || !el.classList || !el.classList.contains("row")) return;
  var id = el.getAttribute("data-id");
  if (!id) return;
  if (state.open[id]) delete state.open[id];
  else state.open[id] = true;
  renderTable();
});

load();
render();
`}}},{id:"landing",label:"产品落地页",keywords:["落地页","landing","官网","saas","hero","定价","页脚","营销页","产品页"],build:function(t){return{name:"Northstar",tagline:"站会不用开会，3 分钟异步说完",summary:"一个完整的 SaaS 落地页：Hero 主视觉、三个特性区块、按月 / 按年切换的定价方案、可展开的常见问题与页脚。点「免费试用」会弹出一个可校验邮箱、并把席位保存在本地的预约表单。",features:[{icon:"zap",title:"Hero 与产品预览",detail:"大标题、双 CTA、右侧产品界面示意"},{icon:"layout",title:"三段特性叙事",detail:"编号 + 图文交替，滚动时轻微淡入"},{icon:"filter",title:"定价与常见问题",detail:"月付 / 年付切换，FAQ 手风琴"},{icon:"database",title:"可用的预约表单",detail:"邮箱校验、方案选择、本地保存"}],body:`
  <header class="nav">
    <div class="nav-inner">
      <a class="logo" href="#top" aria-label="Northstar 首页"><span class="logo-mark">N</span><span>Northstar</span></a>
      <nav class="nav-links" aria-label="主导航">
        <a href="#features">功能</a>
        <a href="#pricing">定价</a>
        <a href="#faq">常见问题</a>
      </nav>
      <div class="nav-actions">
        <button class="btn ghost sm" id="nav-signin" type="button">登录</button>
        <button class="btn primary sm" data-open-signup type="button">免费试用</button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-copy reveal">
        <span class="badge">新 \xb7 支持 Slack 与飞书双向同步</span>
        <h1>把 30 分钟的站会<br /><span class="grad">压缩成 3 分钟的异步消息</span></h1>
        <p class="lede">Northstar 让每个人在自己方便的时候写下进展与卡点，早上自动汇总成一份团队日报。不再抢会议室，也不再等迟到的人。</p>
        <div class="cta-row">
          <button class="btn primary lg" data-open-signup type="button">免费开始 \xb7 无需信用卡</button>
          <a class="btn ghost lg" href="#features">看看怎么用</a>
        </div>
        <p class="trust">已有 <strong>2,400+</strong> 个团队在用 \xb7 平均每周省下 4.6 小时</p>
      </div>

      <div class="hero-visual reveal">
        <div class="mock-window">
          <div class="mock-bar">
            <span class="mdot"></span><span class="mdot"></span><span class="mdot"></span>
            <span class="mock-url">northstar.app/standup</span>
          </div>
          <div class="mock-body">
            <div class="mock-head">
              <strong>今日站会</strong>
              <span class="mock-chip">3 人已提交</span>
            </div>
            <div class="standup">
              <div class="standup-row">
                <span class="avatar">林</span>
                <div class="standup-main">
                  <span class="standup-name">林一 \xb7 09:12</span>
                  <span class="standup-line"></span>
                  <span class="standup-line short"></span>
                </div>
                <span class="status done">已完成</span>
              </div>
              <div class="standup-row">
                <span class="avatar">周</span>
                <div class="standup-main">
                  <span class="standup-name">周三 \xb7 09:26</span>
                  <span class="standup-line"></span>
                  <span class="standup-line short"></span>
                </div>
                <span class="status done">已完成</span>
              </div>
              <div class="standup-row">
                <span class="avatar">杨</span>
                <div class="standup-main">
                  <span class="standup-name">杨帆 \xb7 正在写…</span>
                  <span class="standup-line"></span>
                  <span class="standup-line short"></span>
                </div>
                <span class="status doing">进行中</span>
              </div>
            </div>
            <div class="mock-foot">
              <span class="mock-btn">写今日站会</span>
              <span class="mock-note">明天 09:00 自动开始</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="logos reveal" aria-label="客户团队">
      <p class="logos-label">这些团队每天都在用</p>
      <div class="logo-row">
        <span class="client-logo">栖木设计</span>
        <span class="client-logo">Northwind</span>
        <span class="client-logo">像素工坊</span>
        <span class="client-logo">Atlas 云</span>
        <span class="client-logo">点线科技</span>
        <span class="client-logo">Halo Studio</span>
      </div>
    </section>

    <section class="metrics reveal" aria-label="产品数据">
      <div class="metric"><strong>2,400+</strong><span>活跃团队</span></div>
      <div class="metric"><strong>4.6 小时</strong><span>每周节省的会议时间</span></div>
      <div class="metric"><strong>92%</strong><span>次周仍在使用的团队</span></div>
    </section>

    <section class="features" id="features">
      <div class="section-head reveal">
        <span class="eyebrow">功能</span>
        <h2>少一次同步，多一段专注时间</h2>
        <p>三个能力覆盖从写下进展到复盘交付的全过程。</p>
      </div>

      <article class="feature reveal">
        <div class="feature-copy">
          <span class="step">01</span>
          <h3>异步站会</h3>
          <p>每人每天花 90 秒回答三个问题：昨天做了什么、今天计划什么、有什么卡点。系统按团队时区自动汇总，早会前就有结论。</p>
          <ul class="feature-list">
            <li>三个固定问题，减少自由发挥</li>
            <li>卡点自动 @ 到负责人，第二天继续跟进</li>
            <li>跨时区团队也能在同一份日报里对齐</li>
          </ul>
        </div>
        <div class="feature-visual">
          <div class="fv-card">
            <div class="fv-head"><span>今日汇总</span><span class="fv-tag">09:30 自动生成</span></div>
            <div class="fv-qa">
              <div class="fv-q"><span class="fv-dot"></span>已完成<span class="fv-text">登录页改版上线并监控了错误率</span></div>
              <div class="fv-q"><span class="fv-dot"></span>进行中<span class="fv-text">支付回调的重试逻辑还差一个用例</span></div>
              <div class="fv-q"><span class="fv-dot warn"></span>卡点<span class="fv-text">测试环境数据库扩容，需要运维协助</span></div>
            </div>
          </div>
        </div>
      </article>

      <article class="feature reveal">
        <div class="feature-visual">
          <div class="fv-card">
            <div class="fv-head"><span>本周进展</span><span class="fv-tag">第 46 周</span></div>
            <div class="fv-bars" aria-hidden="true">
              <span style="height:38%"></span>
              <span style="height:56%"></span>
              <span style="height:44%"></span>
              <span style="height:72%"></span>
              <span style="height:88%"></span>
              <span style="height:64%"></span>
            </div>
            <div class="fv-axis" aria-hidden="true"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span></div>
            <p class="fv-note">合并 14 个 PR \xb7 关闭 9 个议题 \xb7 2 个里程碑按期交付</p>
          </div>
        </div>
        <div class="feature-copy">
          <span class="step">02</span>
          <h3>自动周报</h3>
          <p>把一周的站会、代码提交与里程碑自动归并，生成一段可以直接发给老板的周报，也可以导出为 Markdown 或飞书文档。</p>
          <ul class="feature-list">
            <li>按项目归并进展，不遗漏小事</li>
            <li>一键导出 Markdown 或飞书文档</li>
            <li>里程碑延期自动提醒干系人</li>
          </ul>
        </div>
      </article>

      <article class="feature reveal">
        <div class="feature-copy">
          <span class="step">03</span>
          <h3>接入现有工具</h3>
          <p>把站会接到团队已经在用的工具里：Slack、飞书、GitHub、Linear、Notion 与 Google 日历，提醒和同步都在原处完成。</p>
          <ul class="feature-list">
            <li>双向同步，不需要搬运内容</li>
            <li>单点登录与组织架构同步</li>
            <li>开放的 API 与 Webhook</li>
          </ul>
        </div>
        <div class="feature-visual">
          <div class="fv-card">
            <div class="fv-head"><span>已连接 6 个应用</span><span class="fv-tag">全部正常</span></div>
            <div class="fv-apps">
              <span class="app-tile">Slack</span>
              <span class="app-tile">飞书</span>
              <span class="app-tile">GitHub</span>
              <span class="app-tile">Linear</span>
              <span class="app-tile">Notion</span>
              <span class="app-tile">日历</span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="pricing" id="pricing">
      <div class="section-head center reveal">
        <span class="eyebrow">定价</span>
        <h2>用得起，也停得下来</h2>
        <p>所有方案都包含核心的异步站会，按月或按年，随时调整。</p>
        <div class="billing" role="tablist" aria-label="计费周期">
          <button class="billing-btn" data-billing="monthly" role="tab" type="button">按月付</button>
          <button class="billing-btn" data-billing="annual" role="tab" type="button">按年付 <em>省 20%</em></button>
        </div>
      </div>
      <div class="plans" id="plans"></div>
      <p class="pricing-note" id="pricing-note"></p>
    </section>

    <section class="faq" id="faq">
      <div class="section-head center reveal">
        <span class="eyebrow">常见问题</span>
        <h2>你可能想问的</h2>
        <p>没有找到答案？直接找我们要一份演示。</p>
      </div>
      <div class="faq-list" id="faq-list"></div>
    </section>

    <section class="final-cta reveal">
      <h2>明天早上的站会，可以不开</h2>
      <p>把今天做的事写下来，剩下的交给 Northstar 汇总。</p>
      <button class="btn primary lg" data-open-signup type="button">免费开始</button>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="logo" href="#top"><span class="logo-mark">N</span><span>Northstar</span></a>
        <p>让团队少开会，多做事。<br />异步优先，默认透明。</p>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>产品</h4>
          <ul>
            <li><a href="#features">异步站会</a></li>
            <li><a href="#features">自动周报</a></li>
            <li><a href="#features">集成</a></li>
            <li><a href="#pricing">定价</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>资源</h4>
          <ul>
            <li><a href="#faq">帮助中心</a></li>
            <li><a href="#features">API 文档</a></li>
            <li><a href="#features">模板库</a></li>
            <li><a href="#top">状态页</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>公司</h4>
          <ul>
            <li><a href="#top">关于我们</a></li>
            <li><a href="#top">招聘</a></li>
            <li><a href="#top">联系销售</a></li>
            <li><a href="#top">隐私政策</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>\xa9 2025 Northstar Labs \xb7 演示站点</span>
      <span>为异步团队而做</span>
    </div>
  </footer>

  <div class="scrim" id="scrim" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-x" id="modal-x" type="button" aria-label="关闭">\xd7</button>
      <div id="modal-body"></div>
    </div>
  </div>`,css:`
:root{scroll-behavior:smooth}
html,body{overflow-x:hidden}
.nav{position:sticky;top:0;z-index:30;background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{display:inline-flex;align-items:center;gap:9px;font-weight:700;letter-spacing:-.02em;font-size:15px;color:var(--text);text-decoration:none}
.logo-mark{width:24px;height:24px;border-radius:7px;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-size:13px;font-weight:800;flex-shrink:0}
.nav-links{display:flex;gap:22px;font-size:13px}
.nav-links a{color:var(--muted);text-decoration:none;transition:color .15s}
.nav-links a:hover{color:var(--text)}
.nav-actions{display:flex;gap:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13.5px;font-weight:600;padding:10px 18px;border-radius:calc(var(--radius) - 1px);transition:filter .15s,transform .15s,background .15s,border-color .15s,color .15s;border:1px solid transparent;text-decoration:none;white-space:nowrap}
.btn.primary{background:var(--accent);color:var(--bg)}
.btn.primary:hover{filter:brightness(1.07)}
.btn.primary:active{transform:scale(.985)}
.btn.ghost{background:var(--surface);border-color:var(--border);color:var(--text)}
.btn.ghost:hover{border-color:color-mix(in srgb,var(--text) 24%,transparent)}
.btn.sm{padding:7px 13px;font-size:12.5px}
.btn.lg{padding:12px 22px;font-size:14px}
.btn.block{width:100%}
.btn:focus-visible,.nav-links a:focus-visible,.footer a:focus-visible,.billing-btn:focus-visible,.faq-q:focus-visible,.modal-x:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
main{max-width:1080px;margin:0 auto;padding:0 24px}
.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:48px;align-items:center;padding:72px 0 56px}
.badge{display:inline-block;font-size:11px;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent);border:1px solid color-mix(in srgb,var(--accent) 26%,transparent);border-radius:999px;padding:4px 10px;margin-bottom:18px}
h1{font-size:clamp(34px,5.2vw,54px);line-height:1.06;letter-spacing:-.035em;font-weight:700;overflow-wrap:break-word}
h1 .grad{color:var(--accent)}
.lede{color:var(--muted);font-size:15px;line-height:1.65;margin-top:18px;max-width:30em}
.cta-row{display:flex;gap:10px;margin-top:26px;flex-wrap:wrap}
.trust{font-size:12px;color:var(--muted);margin-top:18px}
.trust strong{color:var(--text);font-weight:600}
.mock-window{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 6px);box-shadow:0 1px 2px rgba(0,0,0,.04),0 24px 48px -32px rgba(0,0,0,.28);overflow:hidden}
.mock-bar{display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--border)}
.mdot{width:7px;height:7px;border-radius:50%;background:color-mix(in srgb,var(--text) 14%,transparent)}
.mock-url{margin-left:8px;font-size:10px;color:var(--muted);background:color-mix(in srgb,var(--text) 4%,transparent);border-radius:5px;padding:3px 8px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mock-body{padding:16px}
.mock-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.mock-head strong{font-size:13px;font-weight:600}
.mock-chip{font-size:10px;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent);border-radius:999px;padding:3px 8px}
.standup{display:flex;flex-direction:column;gap:8px}
.standup-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);background:color-mix(in srgb,var(--text) 1.5%,transparent)}
.avatar{width:26px;height:26px;border-radius:50%;background:color-mix(in srgb,var(--accent) 14%,var(--surface));color:var(--accent);display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0}
.standup-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
.standup-name{font-size:10.5px;color:var(--muted)}
.standup-line{height:5px;border-radius:3px;background:color-mix(in srgb,var(--text) 8%,transparent);width:88%}
.standup-line.short{width:54%}
.status{font-size:9.5px;padding:3px 7px;border-radius:5px;flex-shrink:0}
.status.done{color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.status.doing{color:var(--muted);background:color-mix(in srgb,var(--text) 7%,transparent)}
.mock-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.mock-btn{font-size:11px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:6px;padding:7px 12px}
.mock-note{font-size:10px;color:var(--muted)}
.logos{padding:30px 0 8px;text-align:center;border-top:1px solid var(--border)}
.logos-label{font-size:10.5px;letter-spacing:.16em;color:var(--muted);margin-bottom:16px}
.logo-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px 34px}
.client-logo{font-size:13px;font-weight:600;color:var(--muted);opacity:.8;letter-spacing:-.01em}
.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:44px 0;border-top:1px solid var(--border);margin-top:34px;text-align:center}
.metric strong{display:block;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--text)}
.metric span{display:block;font-size:11.5px;color:var(--muted);margin-top:6px}
.features{padding:20px 0 12px}
.section-head{max-width:620px;margin-bottom:36px}
.section-head.center{margin-left:auto;margin-right:auto;text-align:center}
.eyebrow{display:block;font-size:10.5px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:12px}
h2{font-size:clamp(24px,3.4vw,34px);line-height:1.15;letter-spacing:-.03em;font-weight:700;overflow-wrap:break-word}
.section-head p{color:var(--muted);font-size:13.5px;line-height:1.6;margin-top:12px}
.feature{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:44px;align-items:center;padding:40px 0;border-top:1px solid var(--border)}
.feature:nth-of-type(even) .feature-copy{order:2}
.step{display:inline-block;font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.1em;margin-bottom:12px;font-variant-numeric:tabular-nums}
.feature h3{font-size:clamp(20px,2.6vw,26px);letter-spacing:-.025em;font-weight:700;margin-bottom:12px}
.feature-copy p{color:var(--muted);font-size:13.5px;line-height:1.65;max-width:30em}
.feature-list{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.feature-list li{position:relative;padding-left:20px;font-size:13px;color:var(--text);line-height:1.5}
.feature-list li::before{content:"";position:absolute;left:2px;top:6px;width:8px;height:8px;border-radius:2px;background:color-mix(in srgb,var(--accent) 55%,transparent)}
.feature-visual{min-width:0}
.fv-card{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 2px);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 18px 36px -30px rgba(0,0,0,.24)}
.fv-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11.5px;font-weight:600;margin-bottom:14px}
.fv-tag{font-size:9.5px;color:var(--muted);font-weight:400;background:color-mix(in srgb,var(--text) 5%,transparent);border-radius:5px;padding:3px 7px}
.fv-qa{display:flex;flex-direction:column;gap:9px}
.fv-q{display:flex;align-items:center;gap:7px;font-size:10.5px;color:var(--muted)}
.fv-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
.fv-dot.warn{background:color-mix(in srgb,var(--text) 40%,transparent)}
.fv-text{color:var(--text);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fv-bars{display:flex;align-items:flex-end;gap:8px;height:118px;padding-top:6px}
.fv-bars span{flex:1;border-radius:3px 3px 0 0;background:color-mix(in srgb,var(--accent) 34%,transparent);min-width:0}
.fv-bars span:last-child{background:var(--accent)}
.fv-axis{display:flex;gap:8px;margin-top:7px}
.fv-axis span{flex:1;text-align:center;font-size:8.5px;color:var(--muted)}
.fv-note{font-size:10px;color:var(--muted);margin-top:12px;padding-top:11px;border-top:1px solid var(--border)}
.fv-apps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.app-tile{font-size:10.5px;color:var(--text);text-align:center;border:1px solid var(--border);border-radius:7px;padding:11px 4px;background:color-mix(in srgb,var(--text) 2%,transparent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pricing{padding:56px 0 20px;margin-top:26px;border-top:1px solid var(--border)}
.billing{display:inline-flex;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);padding:3px;margin-top:22px}
.billing-btn{font-size:12px;color:var(--muted);padding:7px 14px;border-radius:calc(var(--radius) - 4px);transition:background .15s,color .15s}
.billing-btn em{font-style:normal;font-size:9.5px;color:var(--accent);margin-left:2px}
.billing-btn:hover{color:var(--text)}
.billing-btn.is-active{background:var(--accent);color:var(--bg);font-weight:600}
.billing-btn.is-active em{color:var(--bg);opacity:.8}
.plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:start;margin-top:32px}
.plan{position:relative;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 2px);padding:22px 20px;display:flex;flex-direction:column;gap:0;box-shadow:0 1px 2px rgba(0,0,0,.04),0 14px 30px -26px rgba(0,0,0,.2)}
.plan.popular{border-color:color-mix(in srgb,var(--accent) 42%,transparent);box-shadow:0 1px 2px rgba(0,0,0,.04),0 18px 36px -26px rgba(0,0,0,.28)}
.plan-badge{position:absolute;top:-10px;left:20px;font-size:9.5px;font-weight:700;color:var(--bg);background:var(--accent);border-radius:999px;padding:3px 9px}
.plan h3{font-size:15px;font-weight:600}
.plan-desc{font-size:11.5px;color:var(--muted);line-height:1.55;margin-top:7px;min-height:36px}
.plan-price{display:flex;align-items:baseline;gap:5px;margin:16px 0 2px}
.plan-price strong{font-size:30px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.plan-price span{font-size:11px;color:var(--muted)}
.plan-note{font-size:10px;color:var(--muted);min-height:14px;margin-bottom:14px}
.plan-feats{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.plan-feats li{position:relative;padding-left:18px;font-size:12px;line-height:1.5}
.plan-feats li::before{content:"";position:absolute;left:1px;top:6px;width:7px;height:7px;border-radius:2px;background:color-mix(in srgb,var(--accent) 50%,transparent)}
.plan .btn{margin-top:auto}
.pricing-note{text-align:center;font-size:11px;color:var(--muted);margin-top:18px}
.pricing-note strong{color:var(--text)}
.faq{padding:56px 0 20px;margin-top:26px;border-top:1px solid var(--border)}
.faq-list{max-width:680px;margin:0 auto;border-top:1px solid var(--border)}
.faq-item{border-bottom:1px solid var(--border)}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;padding:16px 2px;font-size:13.5px;font-weight:500;transition:color .15s}
.faq-q:hover{color:var(--accent)}
.faq-q svg{width:13px;height:13px;flex-shrink:0;transition:transform .18s ease;color:var(--muted)}
.faq-item.is-open .faq-q svg{transform:rotate(180deg)}
.faq-a{padding:0 2px 16px;animation:fadeIn .18s ease both}
.faq-a p{font-size:12.5px;line-height:1.65;color:var(--muted);max-width:56em}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.final-cta{text-align:center;padding:64px 24px;margin:48px 0 0;background:color-mix(in srgb,var(--accent) 6%,var(--surface));border:1px solid var(--border);border-radius:calc(var(--radius) + 6px)}
.final-cta p{color:var(--muted);font-size:13.5px;margin:12px 0 22px}
.footer{border-top:1px solid var(--border);margin-top:56px;background:color-mix(in srgb,var(--text) 1.5%,transparent)}
.footer-inner{max-width:1080px;margin:0 auto;padding:44px 24px 30px;display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap}
.footer-brand{max-width:260px}
.footer-brand p{font-size:11.5px;color:var(--muted);line-height:1.65;margin-top:12px}
.footer-cols{display:flex;gap:56px;flex-wrap:wrap}
.footer-col h4{font-size:11px;letter-spacing:.1em;color:var(--muted);font-weight:600;margin-bottom:12px}
.footer-col ul{display:flex;flex-direction:column;gap:9px}
.footer-col a{font-size:12px;color:var(--text);text-decoration:none;opacity:.82;transition:opacity .15s,color .15s}
.footer-col a:hover{opacity:1;color:var(--accent)}
.footer-bottom{max-width:1080px;margin:0 auto;padding:16px 24px 28px;border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:14px;font-size:10.5px;color:var(--muted);flex-wrap:wrap}
.reveal{opacity:0;transform:translateY(10px);transition:opacity .2s ease,transform .2s ease}
.reveal.is-in{opacity:1;transform:none}
.scrim{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,var(--text) 42%,transparent);animation:fadeIn .18s ease both}
[hidden]{display:none!important}
.modal{position:relative;width:min(440px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:26px 24px;box-shadow:0 24px 64px -24px rgba(0,0,0,.4)}
.modal-x{position:absolute;top:12px;right:12px;width:28px;height:28px;display:grid;place-items:center;border-radius:6px;color:var(--muted);font-size:17px;line-height:0;transition:background .15s,color .15s}
.modal-x:hover{background:color-mix(in srgb,var(--text) 6%,transparent);color:var(--text)}
.modal h2{font-size:20px;letter-spacing:-.02em}
.modal-sub{font-size:12.5px;color:var(--muted);line-height:1.6;margin-top:8px}
.field{display:block;margin-top:16px}
.field span{display:block;font-size:11px;color:var(--muted);margin-bottom:6px}
.field input,.field select{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);padding:10px 11px;font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s}
.field input:focus,.field select:focus{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 12%,transparent)}
.form-error{font-size:11.5px;color:color-mix(in srgb,var(--accent) 72%,var(--text));margin-top:12px;line-height:1.5}
.modal form .btn{margin-top:18px}
.modal-tiny{font-size:10px;color:var(--muted);line-height:1.6;margin-top:12px;text-align:center}
.signed{text-align:center;padding-top:6px}
.signed-icon{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}
.signed-icon svg{width:20px;height:20px}
.signed .btn{margin-top:20px}
.link-ish{display:block;margin:14px auto 0;font-size:11.5px;color:var(--muted);text-decoration:underline;transition:color .15s}
.link-ish:hover{color:var(--accent)}
@media (max-width:900px){
  .hero{grid-template-columns:1fr;gap:36px;padding:52px 0 40px}
  .hero-visual{max-width:520px}
  .plans{grid-template-columns:1fr;max-width:460px;margin-left:auto;margin-right:auto}
  .plan-desc{min-height:0}
  .feature{grid-template-columns:1fr;gap:24px;padding:32px 0}
  .feature:nth-of-type(even) .feature-copy{order:0}
  .feature-visual{max-width:520px}
}
@media (max-width:640px){
  .nav-inner{padding:12px 16px}
  .nav-links{display:none}
  main{padding:0 16px}
  .hero{padding:38px 0 30px;gap:30px}
  .lede{font-size:14px}
  .cta-row{flex-direction:column;align-items:stretch}
  .cta-row .btn{width:100%}
  .logo-row{gap:12px 22px}
  .client-logo{font-size:12px}
  .metrics{grid-template-columns:1fr;gap:22px;padding:32px 0;text-align:left}
  .metric{display:flex;align-items:baseline;gap:12px}
  .metric strong{font-size:24px}
  .metric span{margin-top:0}
  .section-head{margin-bottom:26px}
  .footer-inner{padding:34px 16px 24px;flex-direction:column;gap:28px}
  .footer-cols{gap:34px;justify-content:space-between;width:100%}
  .footer-bottom{padding:16px 16px 26px;flex-direction:column;gap:6px}
  .final-cta{padding:44px 18px;margin-top:40px}
  .modal{padding:22px 18px}
}`,js:`
var KEY = "vf:landing:v1";

var PLANS = [
  {
    id: "starter", name: "启动版", monthly: "\xa50", annual: "\xa50", unit: "/ 永久免费",
    desc: "适合 3 人以内的小团队先把异步站会跑起来",
    feats: ["无限次异步站会", "基础周报汇总", "2 个第三方集成", "保留 30 天历史"],
    cta: "免费开始"
  },
  {
    id: "team", name: "团队版", monthly: "\xa549", annual: "\xa539", unit: "/ 人 / 月",
    desc: "正在扩张的团队，需要自动化与权限管理",
    feats: ["包含启动版全部功能", "自动周报与里程碑", "不限集成数量", "成员权限与审计日志", "Slack / 飞书机器人"],
    cta: "开始 14 天试用", popular: true
  },
  {
    id: "ent", name: "企业版", monthly: "定制", annual: "定制", unit: "/ 按年签约",
    desc: "需要 SSO、私有部署和专属支持的大团队",
    feats: ["SSO / SCIM 目录同步", "私有化或混合部署", "99.95% SLA 与专属客服", "自定义数据保留策略", "安全合规评估支持"],
    cta: "联系销售"
  }
];

var FAQ = [
  { id: "q1", q: "和直接在群里发消息有什么区别？", a: "群消息会被后面的讨论刷走。Northstar 会按人按项目自动汇总，第二天把还没解决的卡点重新提上来，不依赖谁记得。" },
  { id: "q2", q: "团队真的会用起来吗？", a: "站会设成每天早上 9 点自动提醒，90 秒就能写完。多数团队第一周就形成习惯，也可以把站会绑定到 Slack 的固定频道里。" },
  { id: "q3", q: "数据存在哪里？", a: "默认存放在加密的云端，按团队隔离；企业版可以私有化部署，数据完全留在你自己的服务器上。" },
  { id: "q4", q: "可以按月付款吗？", a: "可以。按月随时取消，按年一次付清能省 20%。降级后历史数据仍会保留 30 天，方便你导走。" },
  { id: "q5", q: "支持哪些语言？", a: "界面支持简体中文、英文和日文。站会内容可以用任何语言书写，汇总时不会改写你的原文。" },
  { id: "q6", q: "有免费额度吗？", a: "启动版对 3 人以内团队永久免费；团队版提供 14 天全功能试用，不需要信用卡。" }
];

var state = {
  billing: "monthly",
  openFaq: "q1",
  signup: null,
  plan: "team"
};

var $ = function (sel) { return document.querySelector(sel); };
var listAll = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function planById(id) {
  for (var i = 0; i < PLANS.length; i++) {
    if (PLANS[i].id === id) return PLANS[i];
  }
  return PLANS[1];
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ billing: state.billing, signup: state.signup }));
  } catch (e) {}
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return;
    var d = JSON.parse(raw);
    if (!d) return;
    if (d.billing === "annual" || d.billing === "monthly") state.billing = d.billing;
    if (d.signup && typeof d.signup.email === "string") {
      state.signup = { email: d.signup.email, plan: d.signup.plan || "team", at: d.signup.at || Date.now() };
      if (state.signup.plan) state.plan = state.signup.plan;
    }
  } catch (e) {}
}

function renderPlans() {
  var html = "";
  PLANS.forEach(function (p) {
    var price = state.billing === "annual" ? p.annual : p.monthly;
    var note = "";
    if (p.id === "team") {
      note = state.billing === "annual" ? "按年付，每人每月省 \xa510" : "14 天试用，不需要信用卡";
    } else if (p.id === "starter") {
      note = "3 人以内永久免费";
    } else {
      note = "支持年度合同与采购流程";
    }
    var feats = "";
    p.feats.forEach(function (f) { feats += "<li>" + f + "</li>"; });
    html += '<article class="plan' + (p.popular ? " popular" : "") + '">' +
      (p.popular ? '<span class="plan-badge">最受欢迎</span>' : "") +
      "<h3>" + p.name + "</h3>" +
      '<p class="plan-desc">' + p.desc + "</p>" +
      '<div class="plan-price"><strong>' + price + "</strong><span>" + p.unit + "</span></div>" +
      '<p class="plan-note">' + note + "</p>" +
      '<ul class="plan-feats">' + feats + "</ul>" +
      '<button class="btn ' + (p.popular ? "primary" : "ghost") + ' block" data-plan="' + p.id + '" type="button">' + p.cta + "</button>" +
    "</article>";
  });
  $("#plans").innerHTML = html;

  var noteEl = $("#pricing-note");
  if (state.billing === "annual") noteEl.innerHTML = "按年付款，团队版每人每月 <strong>\xa539</strong>（比月付省 20%）。随时可以升级或调整席位。";
  else noteEl.innerHTML = "按月付款，随时可以升级或取消。团队版提供 14 天全功能试用。";

  listAll("[data-billing]").forEach(function (b) {
    var on = b.getAttribute("data-billing") === state.billing;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function renderFaq() {
  var html = "";
  FAQ.forEach(function (item) {
    var open = state.openFaq === item.id;
    html += '<div class="faq-item' + (open ? " is-open" : "") + '">' +
      '<button class="faq-q" data-faq="' + item.id + '" aria-expanded="' + open + '" type="button">' +
        "<span>" + item.q + "</span>" +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      "</button>" +
      '<div class="faq-a"' + (open ? "" : " hidden") + "><p>" + item.a + "</p></div>" +
    "</div>";
  });
  $("#faq-list").innerHTML = html;
}

function validEmail(v) {
  var s = String(v || "").trim();
  if (s.length < 6 || s.length > 120) return false;
  if (s.indexOf(" ") >= 0) return false;
  var at = s.indexOf("@");
  if (at < 1) return false;
  var dot = s.indexOf(".", at + 1);
  if (dot < 0 || dot === s.length - 1) return false;
  return true;
}

function renderSignup() {
  var body = $("#modal-body");
  if (state.signup) {
    var plan = planById(state.signup.plan);
    body.innerHTML = '<div class="signed">' +
      '<span class="signed-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></span>' +
      '<h2 id="modal-title">席位已经预留</h2>' +
      '<p class="modal-sub">我们给 <strong>' + escapeHtml(state.signup.email) + '</strong> 预留了「' + plan.name + '」的席位，开通邮件会在几分钟内发出。</p>' +
      '<button class="btn primary block" id="signed-close" type="button">知道了</button>' +
      '<button class="link-ish" id="signed-undo" type="button">换一个邮箱</button>' +
    "</div>";
    $("#signed-close").addEventListener("click", closeModal);
    $("#signed-undo").addEventListener("click", function () {
      state.signup = null;
      save();
      renderSignup();
      var input = $("#signup-email");
      if (input) input.focus();
    });
    return;
  }

  var options = "";
  PLANS.forEach(function (p) {
    options += '<option value="' + p.id + '"' + (p.id === state.plan ? " selected" : "") + ">" + p.name + "</option>";
  });
  body.innerHTML =
    '<p class="eyebrow">START FREE</p>' +
    '<h2 id="modal-title">开启 14 天免费试用</h2>' +
    '<p class="modal-sub">不用信用卡，随时取消。今天就能发出第一份异步站会。</p>' +
    '<form id="signup-form" novalidate>' +
      '<label class="field"><span>工作邮箱</span>' +
        '<input id="signup-email" type="email" placeholder="you@company.com" autocomplete="email" maxlength="120" />' +
      "</label>" +
      '<label class="field"><span>意向方案</span>' +
        '<select id="signup-plan">' + options + "</select>" +
      "</label>" +
      '<p class="form-error" id="form-error" hidden></p>' +
      '<button class="btn primary block" type="submit">创建团队</button>' +
    "</form>" +
    '<p class="modal-tiny">点击「创建团队」即表示同意服务条款与隐私政策。</p>';
}

function openModal(planId) {
  if (planId) state.plan = planId;
  else if (state.signup) state.plan = state.signup.plan;
  renderSignup();
  var scrim = $("#scrim");
  scrim.hidden = false;
  document.body.style.overflow = "hidden";
  var input = $("#signup-email");
  if (input) {
    window.setTimeout(function () { input.focus(); }, 30);
  } else {
    var closeBtn = $("#modal-x");
    if (closeBtn) closeBtn.focus();
  }
}

function closeModal() {
  $("#scrim").hidden = true;
  document.body.style.overflow = "";
}

listAll("[data-open-signup]").forEach(function (btn) {
  btn.addEventListener("click", function () { openModal(null); });
});

listAll("[data-billing]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    state.billing = btn.getAttribute("data-billing");
    save();
    renderPlans();
  });
});

$("#plans").addEventListener("click", function (e) {
  var el = e.target;
  while (el && el !== document.body && !el.getAttribute) el = el.parentNode;
  if (!el || !el.getAttribute) return;
  var planId = el.getAttribute("data-plan");
  if (planId) openModal(planId);
});

$("#faq-list").addEventListener("click", function (e) {
  var el = e.target;
  while (el && el !== document.body && !el.getAttribute) el = el.parentNode;
  if (!el || !el.getAttribute) return;
  var id = el.getAttribute("data-faq");
  if (!id) return;
  state.openFaq = state.openFaq === id ? "" : id;
  renderFaq();
});

$("#modal-body").addEventListener("submit", function (e) {
  e.preventDefault();
  var emailEl = $("#signup-email");
  var planEl = $("#signup-plan");
  var errorEl = $("#form-error");
  if (!emailEl) return;
  if (!validEmail(emailEl.value)) {
    errorEl.textContent = "请填写一个可用的工作邮箱，例如 you@company.com。";
    errorEl.hidden = false;
    emailEl.focus();
    return;
  }
  state.signup = { email: emailEl.value.trim(), plan: planEl ? planEl.value : "team", at: Date.now() };
  save();
  renderSignup();
});

$("#modal-x").addEventListener("click", closeModal);
$("#scrim").addEventListener("click", function (e) {
  if (e.target === $("#scrim")) closeModal();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !$("#scrim").hidden) closeModal();
});
$("#nav-signin").addEventListener("click", function () { openModal(null); });

var revealEls = listAll(".reveal");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(function (el) { io.observe(el); });
  window.setTimeout(function () {
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("is-in");
    });
  }, 120);
} else {
  revealEls.forEach(function (el) { el.classList.add("is-in"); });
}

load();
renderPlans();
renderFaq();
`}}},{id:"chat",label:"AI 聊天",keywords:["聊天","chat","对话","会话","流式","打字","ai 聊天","消息"],build:function(t){return{name:"Thread AI",tagline:"把对话整理成一条条可以回看的线索",summary:"一个 AI 聊天界面：左侧是会话列表（可搜索、可新建、可删除），右侧是消息流。发送后会先出现输入指示，再逐字打出回复；刷新页面后对话依然在。",features:[{icon:"layout",title:"会话流 + 侧栏",detail:"切换、新建、删除、搜索历史会话"},{icon:"zap",title:"打字机回复",detail:"先显示输入指示，再逐字呈现答案"},{icon:"filter",title:"快捷提问",detail:"空会话给出四个可直接发送的建议"},{icon:"database",title:"本地持久化",detail:"会话与消息保存在浏览器本地"}],body:`
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
      <div class="side-foot"><span class="status-dot"></span><span>本地演示 \xb7 不联网</span></div>
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
        <p class="composer-hint">回答由本地模板生成 \xb7 消息只保存在你的浏览器</p>
      </div>
    </section>
  </main>
  <div class="drawer-scrim" id="drawer-scrim" hidden></div>`,css:`
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
}`,js:`
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
      '<button class="conv-del" data-del="' + conv.id + '" type="button" aria-label="删除会话">\xd7</button>' +
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
  $("#conv-meta").textContent = count ? count + " 条消息 \xb7 上次更新 " + relTime(conv.updatedAt) : "开始聊天吧 \xb7 消息会保存在本地";
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
`}}},{id:"calculator",label:"计算器",keywords:["计算器","计算","四则运算","加减乘除","键盘输入","算数","calculator"],build:function(t){return{name:"算一下",tagline:"算式留在屏幕上，历史替你记住",summary:"一个顺手的计算器：支持加减乘除、百分比与正负号，边输入边显示预览结果。键盘直接敲数字和运算符就能算，每次结果自动进入右侧历史，点一下可以接着算。",features:[{icon:"zap",title:"键盘直输",detail:"数字、运算符、Enter、Esc 全支持"},{icon:"layout",title:"实时预览",detail:"输入算式时同步显示计算结果"},{icon:"grip",title:"历史复用",detail:"点击历史结果载入，可单条删除"},{icon:"database",title:"本地保存",detail:"历史记录保存在浏览器，刷新不丢"}],body:`
  <main class="app">
    <header class="head">
      <div>
        <p class="eyebrow">CALCULATOR</p>
        <h1>算点东西</h1>
        <p class="sub">键盘直接输入，边算边看结果，历史会自动留下。</p>
      </div>
      <span class="badge">本地计时 \xb7 无需联网</span>
    </header>

    <div class="layout">
      <section class="calc" aria-label="计算器">
        <div class="display" aria-live="polite">
          <div class="expr" id="expr">0</div>
          <div class="result" id="result">0</div>
          <div class="hint" id="hint">Enter 计算 \xb7 Esc 清空 \xb7 ⌫ 退格</div>
        </div>
        <div class="keys" id="keys">
          <button class="key fn" data-action="clear" type="button">AC</button>
          <button class="key fn" data-action="back" type="button" aria-label="退格">⌫</button>
          <button class="key fn" data-action="percent" type="button">%</button>
          <button class="key op" data-action="op" data-op="/" type="button" aria-label="除">\xf7</button>

          <button class="key" data-action="num" data-num="7" type="button">7</button>
          <button class="key" data-action="num" data-num="8" type="button">8</button>
          <button class="key" data-action="num" data-num="9" type="button">9</button>
          <button class="key op" data-action="op" data-op="*" type="button" aria-label="乘">\xd7</button>

          <button class="key" data-action="num" data-num="4" type="button">4</button>
          <button class="key" data-action="num" data-num="5" type="button">5</button>
          <button class="key" data-action="num" data-num="6" type="button">6</button>
          <button class="key op" data-action="op" data-op="-" type="button" aria-label="减">−</button>

          <button class="key" data-action="num" data-num="1" type="button">1</button>
          <button class="key" data-action="num" data-num="2" type="button">2</button>
          <button class="key" data-action="num" data-num="3" type="button">3</button>
          <button class="key op" data-action="op" data-op="+" type="button" aria-label="加">+</button>

          <button class="key fn" data-action="sign" type="button">\xb1</button>
          <button class="key" data-action="num" data-num="0" type="button">0</button>
          <button class="key" data-action="num" data-num="." type="button">.</button>
          <button class="key eq" data-action="equals" type="button">=</button>
        </div>
      </section>

      <aside class="history" aria-label="历史记录">
        <div class="hist-head">
          <h2>历史记录</h2>
          <span id="hist-count">0 条</span>
        </div>
        <ul class="hist-list" id="hist-list"></ul>
        <p class="hist-empty" id="hist-empty" hidden>还没有计算记录，先算一笔。</p>
        <button class="clear-hist" id="clear-hist" type="button">清空历史</button>
      </aside>
    </div>

    <p class="foot">点击任意历史结果可以载入继续算 \xb7 数据保存在你的浏览器</p>
  </main>`,css:`
.app{max-width:840px;margin:0 auto;padding:48px 24px 72px}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:26px;flex-wrap:wrap}
.eyebrow{font-size:11px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:10px}
h1{font-size:clamp(28px,4vw,38px);line-height:1.1;letter-spacing:-.03em;font-weight:700}
.sub{color:var(--muted);font-size:13px;margin-top:8px;max-width:32em;line-height:1.6}
.badge{font-size:10.5px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:4px 10px;background:var(--surface);flex-shrink:0}
.layout{display:grid;grid-template-columns:minmax(0,360px) minmax(0,1fr);gap:18px;align-items:start}
.calc{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 18px 40px -34px rgba(0,0,0,.26)}
.display{background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);padding:14px 14px 10px;margin-bottom:12px;min-height:104px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;overflow:hidden}
.expr{font-size:12px;color:var(--muted);text-align:right;min-height:17px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.01em}
.result{font-size:clamp(30px,5.4vw,38px);font-weight:600;letter-spacing:-.03em;text-align:right;line-height:1.05;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.result.is-error{font-size:16px;color:var(--muted);letter-spacing:0}
.hint{font-size:9.5px;color:var(--muted);opacity:.8;text-align:right;margin-top:2px}
.keys{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.key{height:56px;border-radius:calc(var(--radius) - 1px);font-size:17px;font-weight:500;color:var(--text);background:color-mix(in srgb,var(--text) 3%,var(--surface));border:1px solid var(--border);transition:background .15s,transform .1s,border-color .15s,color .15s;font-variant-numeric:tabular-nums}
.key:hover{background:color-mix(in srgb,var(--text) 6.5%,var(--surface));border-color:color-mix(in srgb,var(--text) 16%,transparent)}
.key:active,.key.is-pressed{transform:scale(.97);background:color-mix(in srgb,var(--text) 9%,var(--surface))}
.key.fn{color:var(--muted);font-size:14px}
.key.fn:hover{color:var(--text)}
.key.op{color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,var(--surface));font-size:19px;font-weight:500}
.key.op:hover{background:color-mix(in srgb,var(--accent) 14%,var(--surface));border-color:color-mix(in srgb,var(--accent) 30%,transparent)}
.key.eq{background:var(--accent);color:var(--bg);font-size:20px;font-weight:600;border-color:transparent}
.key.eq:hover{filter:brightness(1.07)}
.key:focus-visible,.clear-hist:focus-visible,.hist-load:focus-visible,.hist-del:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
.history{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:16px 16px 12px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.04),0 18px 40px -34px rgba(0,0,0,.26);display:flex;flex-direction:column;max-height:470px}
.hist-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--border);margin-bottom:8px;flex-shrink:0}
.hist-head h2{font-size:12.5px;font-weight:600}
.hist-head span{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.hist-list{flex:1;overflow-y:auto;min-height:0;display:flex;flex-direction:column;gap:3px}
.hist-row{display:flex;align-items:center;gap:6px;border-radius:8px;transition:background .15s;animation:fadeIn .16s ease both}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.hist-row:hover{background:color-mix(in srgb,var(--text) 4%,transparent)}
.hist-load{flex:1;min-width:0;display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:9px 8px;text-align:left;border-radius:8px}
.hist-expr{font-size:11.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
.hist-res{font-size:14px;font-weight:600;color:var(--text);font-variant-numeric:tabular-nums;flex-shrink:0}
.hist-del{width:22px;height:22px;display:grid;place-items:center;color:var(--muted);border-radius:5px;font-size:14px;line-height:0;opacity:0;transition:opacity .15s,color .15s,background .15s;flex-shrink:0}
.hist-row:hover .hist-del{opacity:1}
@media (hover:none){.hist-del{opacity:.75}}
.hist-del:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.hist-empty{font-size:12px;color:var(--muted);padding:20px 4px;line-height:1.6}
.clear-hist{font-size:11px;color:var(--muted);padding:9px 8px 4px;border-top:1px solid var(--border);margin-top:6px;transition:color .15s;flex-shrink:0}
.clear-hist:hover{color:var(--accent)}
[hidden]{display:none!important}
.foot{margin-top:22px;text-align:center;font-size:11px;color:var(--muted);opacity:.85}
@media (max-width:720px){
  .app{padding:30px 16px 52px}
  .layout{grid-template-columns:1fr;gap:14px}
  .history{max-height:none}
  .hist-list{max-height:240px}
  .key{height:52px}
  .display{min-height:96px}
}`,js:`
var KEY = "vf:calculator:v1";

var state = {
  tokens: [],
  current: "",
  justEvaluated: false,
  lastExpr: "",
  lastResult: "",
  error: "",
  history: []
};

var $ = function (sel) { return document.querySelector(sel); };
var exprEl = $("#expr");
var resultEl = $("#result");
var histListEl = $("#hist-list");

function uid() { return Math.random().toString(36).slice(2, 10); }

function normalize(n) {
  if (!isFinite(n)) return n;
  return parseFloat(n.toPrecision(12));
}

function fmtNum(n) {
  var s = String(n);
  var neg = s.charAt(0) === "-";
  if (neg) s = s.slice(1);
  var parts = s.split(".");
  var int = parts[0];
  var out = "";
  var count = 0;
  for (var i = int.length - 1; i >= 0; i--) {
    out = int.charAt(i) + out;
    count += 1;
    if (count % 3 === 0 && i > 0) out = "," + out;
  }
  return (neg ? "-" : "") + out + (parts[1] ? "." + parts[1] : "");
}

var OP_LABEL = { "*": "\xd7", "/": "\xf7", "-": "−", "+": "+" };

function opLabel(op) { return OP_LABEL[op] || op; }

function tokensText(tokens) {
  var out = [];
  tokens.forEach(function (t) {
    out.push(t.t === "num" ? fmtNum(parseFloat(t.v)) : opLabel(t.v));
  });
  return out.join(" ");
}

function evaluate(items) {
  var values = [];
  var ops = [];
  var PREC = { "*": 2, "/": 2, "+": 1, "-": 1 };

  function apply() {
    if (ops.length < 1 || values.length < 2) return false;
    var op = ops.pop();
    var b = values.pop();
    var a = values.pop();
    if (op === "/" && b === 0) return false;
    var r = op === "*" ? a * b : op === "/" ? a / b : op === "+" ? a + b : a - b;
    values.push(r);
    return true;
  }

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.t === "num") {
      var v = parseFloat(item.v);
      if (!isFinite(v)) return { ok: false };
      values.push(v);
    } else {
      while (ops.length && PREC[ops[ops.length - 1]] >= PREC[item.v]) {
        if (!apply()) return { ok: false };
      }
      ops.push(item.v);
    }
  }
  while (ops.length) {
    if (!apply()) return { ok: false };
  }
  if (values.length !== 1 || !isFinite(values[0])) return { ok: false };
  return { ok: true, value: values[0] };
}

function preview() {
  var items = state.tokens.slice();
  if (state.current !== "") items.push({ t: "num", v: state.current });
  while (items.length && items[items.length - 1].t === "op") items.pop();
  if (!items.length) return { text: "0", ok: true };
  var res = evaluate(items);
  if (!res.ok) return { text: "无法计算", ok: false };
  return { text: fmtNum(normalize(res.value)), ok: true };
}

function render() {
  if (state.error) {
    exprEl.textContent = state.lastExpr ? state.lastExpr + " =" : "";
    resultEl.textContent = state.error;
    resultEl.className = "result is-error";
  } else if (state.justEvaluated) {
    exprEl.textContent = state.lastExpr + " =";
    resultEl.textContent = fmtNum(state.lastResult ? parseFloat(state.lastResult) : 0);
    resultEl.className = "result";
  } else {
    var exprText = tokensText(state.tokens);
    if (state.current !== "") exprText += (exprText ? " " : "") + state.current;
    exprEl.textContent = exprText || "0";
    var p = preview();
    resultEl.textContent = p.text;
    resultEl.className = "result" + (p.ok ? "" : " is-error");
  }
  renderHistory();
}

function renderHistory() {
  var html = "";
  state.history.forEach(function (h) {
    html += '<li class="hist-row">' +
      '<button class="hist-load" data-hist="' + h.id + '" type="button">' +
        '<span class="hist-expr">' + h.expr + "</span>" +
        '<span class="hist-res">' + fmtNum(parseFloat(h.result)) + "</span>" +
      "</button>" +
      '<button class="hist-del" data-hdel="' + h.id + '" type="button" aria-label="删除这条记录">\xd7</button>' +
    "</li>";
  });
  histListEl.innerHTML = html;
  $("#hist-count").textContent = state.history.length + " 条";
  $("#hist-empty").hidden = state.history.length > 0;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state.history.slice(0, 30)));
  } catch (e) {}
}

function seedHistory() {
  var now = Date.now();
  return [
    { id: uid(), expr: "128 \xd7 4", result: "512", at: now - 3 * 60000 },
    { id: uid(), expr: "2048 \xf7 8", result: "256", at: now - 9 * 60000 },
    { id: uid(), expr: "19.8 + 4.2", result: "24", at: now - 26 * 60000 },
    { id: uid(), expr: "365 \xd7 24", result: "8760", at: now - 74 * 60000 },
    { id: uid(), expr: "1250 \xd7 0.8", result: "1000", at: now - 5 * 3600000 },
    { id: uid(), expr: "72 \xf7 3", result: "24", at: now - 2 * 86400000 }
  ];
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        state.history = parsed.filter(function (h) {
          return h && typeof h.expr === "string" && typeof h.result === "string";
        });
        if (!state.history.length) state.history = seedHistory();
        return;
      }
    }
  } catch (e) {}
  state.history = seedHistory();
  save();
}

function pushHistory(expr, result) {
  state.history.unshift({ id: uid(), expr: expr, result: String(result), at: Date.now() });
  if (state.history.length > 30) state.history.length = 30;
  save();
}

function clearError() {
  if (state.error) {
    state.error = "";
    state.lastExpr = "";
    state.lastResult = "";
  }
}

function pressNum(d) {
  clearError();
  if (state.justEvaluated) {
    state.tokens = [];
    state.current = "";
    state.justEvaluated = false;
  }
  if (d === ".") {
    if (state.current.indexOf(".") >= 0) return;
    state.current = state.current === "" || state.current === "-" ? (state.current || "") + "0." : state.current + ".";
  } else {
    if (state.current === "0") state.current = d;
    else {
      var digits = state.current.replace("-", "").replace(".", "").length;
      if (digits >= 12) return;
      state.current += d;
    }
  }
  render();
}

function pressOp(op) {
  clearError();
  if (state.justEvaluated) state.justEvaluated = false;
  if (state.current !== "") {
    state.tokens.push({ t: "num", v: state.current });
    state.current = "";
  }
  if (!state.tokens.length) state.tokens.push({ t: "num", v: "0" });
  var last = state.tokens[state.tokens.length - 1];
  if (last.t === "op") last.v = op;
  else state.tokens.push({ t: "op", v: op });
  render();
}

function pressEquals() {
  clearError();
  if (state.justEvaluated) return;
  var items = state.tokens.slice();
  if (state.current !== "") items.push({ t: "num", v: state.current });
  else if (items.length && items[items.length - 1].t === "op") items.pop();
  if (!items.length) return;
  var res = evaluate(items);
  if (!res.ok) {
    state.error = "无法计算（除数为 0？）";
    render();
    return;
  }
  var value = normalize(res.value);
  var expr = tokensText(items);
  state.lastExpr = expr;
  state.lastResult = String(value);
  state.justEvaluated = true;
  state.current = "";
  state.tokens = [{ t: "num", v: String(value) }];
  pushHistory(expr, String(value));
  render();
}

function pressClear() {
  state.tokens = [];
  state.current = "";
  state.justEvaluated = false;
  state.lastExpr = "";
  state.lastResult = "";
  state.error = "";
  render();
}

function pressBack() {
  clearError();
  if (state.justEvaluated) {
    state.tokens = [];
    state.current = "";
    state.justEvaluated = false;
    render();
    return;
  }
  if (state.current !== "") {
    state.current = state.current.slice(0, -1);
  } else if (state.current === "" && state.tokens.length) {
    var last = state.tokens[state.tokens.length - 1];
    if (last.t === "op") state.tokens.pop();
    else {
      state.tokens.pop();
      state.current = last.v;
    }
  }
  render();
}

function pressPercent() {
  clearError();
  if (state.justEvaluated) state.justEvaluated = false;
  if (state.current !== "") {
    state.current = String(normalize(parseFloat(state.current || "0") / 100));
    render();
    return;
  }
  var last = state.tokens[state.tokens.length - 1];
  if (last && last.t === "num") {
    last.v = String(normalize(parseFloat(last.v) / 100));
    render();
  }
}

function pressSign() {
  clearError();
  if (state.justEvaluated) state.justEvaluated = false;
  if (state.current !== "") {
    state.current = state.current.charAt(0) === "-" ? state.current.slice(1) : "-" + state.current;
    render();
    return;
  }
  var last = state.tokens[state.tokens.length - 1];
  if (last && last.t === "num") {
    last.v = String(parseFloat(last.v) === 0 ? 0 : -parseFloat(last.v));
    render();
  }
}

function loadHistory(id) {
  for (var i = 0; i < state.history.length; i++) {
    if (state.history[i].id === id) {
      state.tokens = [];
      state.current = state.history[i].result;
      state.justEvaluated = false;
      state.lastExpr = "";
      state.lastResult = "";
      state.error = "";
      render();
      return;
    }
  }
}

function closestAttr(node, name) {
  while (node && node !== document.body) {
    if (node.hasAttribute && node.hasAttribute(name)) return node;
    node = node.parentNode;
  }
  return null;
}

$("#keys").addEventListener("click", function (e) {
  var btn = closestAttr(e.target, "data-action");
  if (!btn) return;
  var action = btn.getAttribute("data-action");
  if (action === "num") pressNum(btn.getAttribute("data-num"));
  else if (action === "op") pressOp(btn.getAttribute("data-op"));
  else if (action === "equals") pressEquals();
  else if (action === "clear") pressClear();
  else if (action === "back") pressBack();
  else if (action === "percent") pressPercent();
  else if (action === "sign") pressSign();
});

histListEl.addEventListener("click", function (e) {
  var del = closestAttr(e.target, "data-hdel");
  if (del) {
    var delId = del.getAttribute("data-hdel");
    state.history = state.history.filter(function (h) { return h.id !== delId; });
    save();
    renderHistory();
    return;
  }
  var row = closestAttr(e.target, "data-hist");
  if (row) loadHistory(row.getAttribute("data-hist"));
});

$("#clear-hist").addEventListener("click", function () {
  state.history = [];
  save();
  renderHistory();
});

function flashButton(action) {
  var selector = '[data-action="' + action + '"]';
  var btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add("is-pressed");
  window.setTimeout(function () { btn.classList.remove("is-pressed"); }, 120);
}

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var k = e.key;
  var handled = true;
  if (k >= "0" && k <= "9") { pressNum(k); flashButton("num"); }
  else if (k === ".") { pressNum("."); flashButton("num"); }
  else if (k === "+" || k === "-" || k === "*" || k === "/") { pressOp(k); flashButton("op"); }
  else if (k === "Enter" || k === "=") { pressEquals(); flashButton("equals"); }
  else if (k === "Backspace") { pressBack(); flashButton("back"); }
  else if (k === "Escape") { pressClear(); flashButton("clear"); }
  else if (k === "%") { pressPercent(); flashButton("percent"); }
  else handled = false;
  if (handled) e.preventDefault();
});

load();
render();
`}}},{id:"music",label:"音乐播放器",keywords:["音乐","播放器","播放列表","progress","music","player","歌曲","专辑","音轨"],build:function(t){return{name:"Tide 播放器",tagline:"把播放列表当成一张可以编辑的专集",summary:"一个音乐播放器界面：封面、播放控制、进度条拖动、音量与随机 / 循环都在左侧，右侧是可搜索、可收藏、可增删的播放列表。没有音频文件，播放进度是模拟的，但所有状态都会保存。",features:[{icon:"layout",title:"播放器 + 播放列表",detail:"当前曲目与队列分栏，移动端纵向堆叠"},{icon:"zap",title:"模拟播放进度",detail:"播放 / 暂停 / 拖动进度 / 自动切下一首"},{icon:"filter",title:"收藏与筛选",detail:"点红心收藏，按歌名或歌手搜索"},{icon:"database",title:"本地持久化",detail:"当前曲目、进度、音量与收藏都会保留"}],body:`
  <main class="app">
    <header class="head">
      <div class="brand">
        <span class="brand-mark">T</span>
        <div>
          <p class="eyebrow">TIDE PLAYER</p>
          <h1>今天听点什么</h1>
        </div>
      </div>
      <span class="badge">演示播放 \xb7 无音频文件</span>
    </header>

    <div class="shell">
      <section class="player" id="player" aria-label="正在播放">
        <div class="cover c0" id="cover">
          <span class="cover-glyph" id="cover-glyph">夜</span>
          <span class="cover-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="cover-caption">TIDE \xb7 2025</span>
        </div>

        <div class="now">
          <div class="now-main">
            <h2 id="now-title">夜航</h2>
            <p id="now-artist">林间电台 \xb7 Late Night</p>
          </div>
          <button class="like" id="like-now" type="button" aria-label="收藏当前曲目" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3l-1.6-1.4C5.4 14.4 2 11.3 2 7.9 2 5.1 4.2 3 6.9 3c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C17.8 3 20 5.1 20 7.9c0 3.4-3.4 6.5-8.4 11z"/></svg>
          </button>
        </div>

        <div class="vis" id="vis" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </div>

        <div class="progress-wrap">
          <div class="progress" id="progress" role="slider" tabindex="0" aria-label="播放进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-fill" id="progress-fill"></div>
            <div class="progress-knob" id="progress-knob"></div>
          </div>
          <div class="time"><span id="time-cur">0:00</span><span id="time-total">3:34</span></div>
        </div>

        <div class="controls">
          <button class="ctl" id="shuffle" type="button" aria-label="随机播放" aria-pressed="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
          </button>
          <button class="ctl" id="prev" type="button" aria-label="上一首">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14l-9-7z"/></svg>
          </button>
          <button class="play" id="play" type="button" aria-label="播放">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" id="play-icon"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="ctl" id="next" type="button" aria-label="下一首">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l9-7z"/></svg>
          </button>
          <button class="ctl" id="repeat" type="button" aria-label="循环播放" aria-pressed="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3"/></svg>
          </button>
        </div>

        <div class="volume">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/></svg>
          <input type="range" id="volume" min="0" max="100" step="1" value="70" aria-label="音量" />
          <span class="vol-val" id="vol-val">70</span>
        </div>
      </section>

      <section class="playlist-card" aria-label="播放列表">
        <div class="pl-head">
          <div>
            <h2>播放列表</h2>
            <p id="pl-meta">7 首 \xb7 26 分钟</p>
          </div>
          <button class="btn primary sm" id="add-toggle" type="button">+ 导入曲目</button>
        </div>

        <form class="add-form" id="add-form" hidden>
          <input id="add-title" type="text" placeholder="曲目名，例如 夜航" maxlength="40" autocomplete="off" aria-label="曲目名" />
          <input id="add-artist" type="text" placeholder="艺术家" maxlength="30" autocomplete="off" aria-label="艺术家" />
          <input id="add-duration" type="text" placeholder="时长 3:30" maxlength="6" autocomplete="off" aria-label="时长，格式 分:秒" />
          <div class="add-actions">
            <button class="btn primary sm" type="submit">添加</button>
            <button class="btn ghost sm" id="add-cancel" type="button">取消</button>
          </div>
          <p class="add-error" id="add-error" hidden></p>
        </form>

        <div class="pl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          <input id="search" type="search" placeholder="搜索曲目或艺术家…" autocomplete="off" maxlength="40" aria-label="搜索曲目" />
        </div>

        <ul class="tracks" id="tracks"></ul>
        <p class="pl-empty" id="pl-empty" hidden>没有匹配的曲目，换个关键词试试。</p>

        <div class="pl-foot">
          <span id="like-count">0 首已收藏</span>
          <span>进度与收藏会自动保存</span>
        </div>
      </section>
    </div>
  </main>`,css:`
.app{max-width:1000px;margin:0 auto;padding:44px 24px 72px}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:22px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.brand-mark{width:38px;height:38px;border-radius:12px;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-weight:800;font-size:18px;flex-shrink:0}
.eyebrow{font-size:10.5px;letter-spacing:.22em;color:var(--accent);font-weight:700;margin-bottom:7px}
h1{font-size:clamp(24px,3.4vw,32px);letter-spacing:-.03em;font-weight:700;line-height:1.1}
.badge{font-size:10.5px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:4px 10px;background:var(--surface);flex-shrink:0}
.shell{display:grid;grid-template-columns:minmax(0,380px) minmax(0,1fr);gap:20px;align-items:start}
.player{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 22px 48px -36px rgba(0,0,0,.3);position:sticky;top:20px}
.cover{position:relative;aspect-ratio:1;width:100%;border-radius:calc(var(--radius) + 1px);overflow:hidden;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 16%,var(--surface));border:1px solid var(--border)}
.cover::before{content:"";position:absolute;inset:16%;border-radius:50%;background:color-mix(in srgb,var(--accent2) 22%,var(--surface));opacity:.85}
.cover::after{content:"";position:absolute;inset:33%;border-radius:50%;background:color-mix(in srgb,var(--accent) 26%,var(--surface));opacity:.9}
.cover-glyph{position:relative;z-index:1;font-size:clamp(48px,9vw,74px);font-weight:700;letter-spacing:-.04em;color:color-mix(in srgb,var(--text) 72%,var(--surface));user-select:none}
.cover-caption{position:absolute;left:14px;bottom:12px;z-index:2;font-size:9.5px;letter-spacing:.2em;color:var(--text);opacity:.55}
.cover-eq{position:absolute;right:14px;bottom:12px;z-index:2;display:flex;align-items:flex-end;gap:2.5px;height:14px;opacity:0;transition:opacity .18s}
.cover-eq i{width:3px;height:100%;border-radius:2px;background:var(--accent);transform-origin:bottom;animation:eq .9s ease-in-out infinite alternate;animation-play-state:paused}
.cover-eq i:nth-child(2){animation-delay:.12s}
.cover-eq i:nth-child(3){animation-delay:.24s}
.cover-eq i:nth-child(4){animation-delay:.36s}
.player.is-playing .cover-eq{opacity:1}
.player.is-playing .cover-eq i{animation-play-state:running}
.c0{background:color-mix(in srgb,var(--accent) 16%,var(--surface))}
.c1{background:color-mix(in srgb,var(--accent2) 16%,var(--surface))}
.c2{background:color-mix(in srgb,var(--accent) 10%,color-mix(in srgb,var(--accent2) 12%,var(--surface)))}
.c3{background:color-mix(in srgb,var(--text) 12%,var(--surface))}
.c4{background:color-mix(in srgb,var(--accent) 24%,var(--surface))}
.c5{background:color-mix(in srgb,var(--accent2) 24%,var(--surface))}
.c6{background:color-mix(in srgb,var(--text) 20%,var(--surface))}
.now{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-top:15px}
.now-main{min-width:0}
.now-main h2{font-size:19px;letter-spacing:-.02em;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.now-main p{font-size:11.5px;color:var(--muted);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.like{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;color:var(--muted);flex-shrink:0;transition:color .15s,background .15s}
.like svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;transition:fill .15s}
.like:hover{color:var(--text);background:color-mix(in srgb,var(--text) 6%,transparent)}
.like.is-liked{color:var(--accent)}
.like.is-liked svg{fill:var(--accent);stroke:var(--accent)}
.vis{display:flex;align-items:flex-end;gap:3px;height:24px;margin-top:13px}
.vis i{flex:1;min-width:0;height:100%;border-radius:2px;background:color-mix(in srgb,var(--accent) 48%,transparent);transform-origin:bottom;animation:eq 1.1s ease-in-out infinite alternate;animation-play-state:paused}
.player.is-playing .vis i{animation-play-state:running}
@keyframes eq{from{transform:scaleY(.16)}to{transform:scaleY(1)}}
.progress-wrap{margin-top:14px}
.progress{position:relative;height:20px;display:flex;align-items:center;cursor:pointer;touch-action:none;outline-offset:4px}
.progress::before{content:"";position:absolute;left:0;right:0;height:4px;border-radius:2px;background:color-mix(in srgb,var(--text) 10%,transparent)}
.progress-fill{position:absolute;left:0;height:4px;border-radius:2px;background:var(--accent);width:0;transition:width .12s linear}
.progress-knob{position:absolute;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--surface);left:0;transform:translateX(-50%);opacity:0;transition:opacity .15s}
.progress:hover .progress-knob,.progress:focus-visible .progress-knob,.player.is-playing .progress-knob{opacity:1}
.time{display:flex;justify-content:space-between;font-size:10px;color:var(--muted);font-variant-numeric:tabular-nums;margin-top:1px}
.controls{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:13px}
.ctl{width:34px;height:34px;display:grid;place-items:center;border-radius:9px;color:var(--muted);transition:color .15s,background .15s}
.ctl svg{width:17px;height:17px}
.ctl:hover{color:var(--text);background:color-mix(in srgb,var(--text) 6%,transparent)}
.ctl[aria-pressed="true"]{color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.play{width:46px;height:46px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;transition:filter .15s,transform .15s;flex-shrink:0}
.play svg{width:20px;height:20px}
.play:hover{filter:brightness(1.07)}
.play:active{transform:scale(.96)}
.volume{display:flex;align-items:center;gap:9px;margin-top:14px}
.volume svg{width:15px;height:15px;color:var(--muted);flex-shrink:0}
.volume input[type=range]{flex:1;min-width:0;accent-color:var(--accent);height:18px;cursor:pointer}
.vol-val{font-size:10px;color:var(--muted);width:18px;text-align:right;font-variant-numeric:tabular-nums}
.playlist-card{background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);padding:16px 16px 10px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.04),0 22px 48px -36px rgba(0,0,0,.3)}
.pl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.pl-head h2{font-size:14px;font-weight:600;letter-spacing:-.01em}
.pl-head p{font-size:10.5px;color:var(--muted);margin-top:4px}
.btn{display:inline-flex;align-items:center;justify-content:center;font-weight:600;border-radius:calc(var(--radius) - 2px);transition:filter .15s,background .15s,border-color .15s,color .15s;border:1px solid transparent;white-space:nowrap}
.btn.sm{font-size:11px;padding:6px 11px}
.btn.primary{background:var(--accent);color:var(--bg)}
.btn.primary:hover{filter:brightness(1.07)}
.btn.ghost{background:transparent;border-color:var(--border);color:var(--text)}
.btn.ghost:hover{border-color:color-mix(in srgb,var(--text) 22%,transparent)}
.add-form{background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 1px);padding:12px;margin-bottom:12px;display:flex;flex-direction:column;gap:7px;animation:fadeIn .16s ease both}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.add-form input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:7px 9px;font-size:12px;outline:none;transition:border-color .15s}
.add-form input:focus{border-color:color-mix(in srgb,var(--accent) 52%,transparent)}
.add-actions{display:flex;gap:7px;margin-top:2px}
.add-error{font-size:10.5px;color:color-mix(in srgb,var(--accent) 70%,var(--text));line-height:1.5}
.pl-search{display:flex;align-items:center;gap:7px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:6px 9px;margin-bottom:8px;transition:border-color .15s}
.pl-search:focus-within{border-color:color-mix(in srgb,var(--accent) 48%,transparent)}
.pl-search svg{width:13px;height:13px;color:var(--muted);flex-shrink:0}
.pl-search input{flex:1;min-width:0;background:transparent;border:none;outline:none;font-size:12px}
.tracks{display:flex;flex-direction:column;gap:1px}
.track{display:flex;align-items:center;border-radius:8px;transition:background .15s;min-width:0}
.track:hover{background:color-mix(in srgb,var(--text) 4%,transparent)}
.track.is-active{background:color-mix(in srgb,var(--accent) 8%,transparent)}
.track-main{flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:8px 6px;text-align:left;border-radius:8px}
.track-index{width:20px;flex-shrink:0;display:grid;place-items:center;font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.track.is-active .track-index .tnum{display:none}
.track-index .teq{display:none;align-items:flex-end;gap:2px;height:11px}
.track.is-active .track-index .teq{display:inline-flex}
.teq i{width:2.5px;height:100%;border-radius:1px;background:var(--accent);transform-origin:bottom;animation:eq .8s ease-in-out infinite alternate;animation-play-state:paused}
.track.is-active.is-playing .teq i{animation-play-state:running}
.teq i:nth-child(2){animation-delay:.15s}
.teq i:nth-child(3){animation-delay:.3s}
.track-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.track-title{font-size:12.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.track.is-active .track-title{color:var(--accent);font-weight:600}
.track-artist{font-size:10px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.track-dur{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums;flex-shrink:0}
.track-like,.track-del{width:24px;height:24px;display:grid;place-items:center;border-radius:6px;color:var(--muted);flex-shrink:0;opacity:0;transition:opacity .15s,color .15s,background .15s}
.track-like svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.7}
.track:hover .track-like,.track:hover .track-del{opacity:1}
.track-like.is-liked{opacity:1;color:var(--accent)}
.track-like.is-liked svg{fill:var(--accent);stroke:var(--accent)}
.track-like:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.track-del{font-size:14px;line-height:0}
.track-del:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
@media (hover:none){.track-like{opacity:1}.track-del{opacity:.7}}
.pl-empty{font-size:12px;color:var(--muted);padding:22px 4px;text-align:center}
.pl-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--border);margin-top:10px;padding:10px 2px 4px;font-size:10px;color:var(--muted)}
[hidden]{display:none!important}
.track-main:focus-visible,.like:focus-visible,.ctl:focus-visible,.play:focus-visible,.progress:focus-visible,.track-like:focus-visible,.track-del:focus-visible,.add-form input:focus-visible{outline:2px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
@media (max-width:820px){
  .shell{grid-template-columns:1fr}
  .player{position:static;max-width:440px;margin:0 auto;width:100%}
  .playlist-card{max-width:560px;margin:0 auto;width:100%}
}
@media (max-width:640px){
  .app{padding:28px 16px 52px}
  .head{gap:12px}
  .badge{display:none}
  .player,.playlist-card{padding:14px}
  .cover-glyph{font-size:56px}
}`,js:`
var KEY = "vf:music:v1";

var seedTracks = [
  { id: "t1", title: "夜航", artist: "林间电台", album: "Late Night", duration: 214, cover: 0 },
  { id: "t2", title: "慢速公路", artist: "北纬三十", album: "Route 30", duration: 252, cover: 1 },
  { id: "t3", title: "蓝线", artist: "城市候鸟", album: "Blue Line", duration: 182, cover: 2 },
  { id: "t4", title: "潮汐表", artist: "木箱", album: "Tide Table", duration: 308, cover: 3 },
  { id: "t5", title: "玻璃海", artist: "失重剧场", album: "Glass Sea", duration: 285, cover: 4 },
  { id: "t6", title: "未命名周末", artist: "纸飞机俱乐部", album: "Weekend", duration: 236, cover: 5 },
  { id: "t7", title: "雾中信号", artist: "白噪研究所", album: "Signal", duration: 178, cover: 6 }
];

var state = {
  tracks: [],
  likes: {},
  currentId: "",
  playing: false,
  position: 0,
  volume: 70,
  repeat: true,
  shuffle: false,
  query: "",
  adding: false
};

var $ = function (sel) { return document.querySelector(sel); };
var listAll = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
var tracksEl = $("#tracks");
var timer = null;
var tickCount = 0;

function uid() { return "u" + Math.random().toString(36).slice(2, 9); }

function fmtTime(sec) {
  var s = Math.max(0, Math.round(sec));
  var m = Math.floor(s / 60);
  var r = s % 60;
  return m + ":" + (r < 10 ? "0" : "") + r;
}

function current() {
  for (var i = 0; i < state.tracks.length; i++) {
    if (state.tracks[i].id === state.currentId) return state.tracks[i];
  }
  return null;
}

function currentIndex() {
  for (var i = 0; i < state.tracks.length; i++) {
    if (state.tracks[i].id === state.currentId) return i;
  }
  return -1;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      tracks: state.tracks,
      likes: state.likes,
      currentId: state.currentId,
      position: state.position,
      volume: state.volume,
      repeat: state.repeat,
      shuffle: state.shuffle
    }));
  } catch (e) {}
}

function seedLikes() {
  return { t2: true, t5: true };
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var d = JSON.parse(raw);
      if (d && Array.isArray(d.tracks) && d.tracks.length) {
        state.tracks = d.tracks.filter(function (t) {
          return t && typeof t.id === "string" && typeof t.title === "string" && typeof t.duration === "number";
        });
        if (!state.tracks.length) state.tracks = seedTracks.slice();
        state.likes = d.likes && typeof d.likes === "object" ? d.likes : seedLikes();
        state.volume = typeof d.volume === "number" ? Math.max(0, Math.min(100, d.volume)) : 70;
        state.repeat = typeof d.repeat === "boolean" ? d.repeat : true;
        state.shuffle = typeof d.shuffle === "boolean" ? d.shuffle : false;
        state.position = typeof d.position === "number" ? Math.max(0, d.position) : 0;
        var found = false;
        for (var i = 0; i < state.tracks.length; i++) {
          if (state.tracks[i].id === d.currentId) found = true;
        }
        state.currentId = found ? d.currentId : state.tracks[0].id;
        save();
        return;
      }
    }
  } catch (e) {}
  state.tracks = seedTracks.slice();
  state.likes = seedLikes();
  state.currentId = state.tracks[0].id;
  state.position = 0;
  state.volume = 70;
  state.repeat = true;
  state.shuffle = false;
  save();
}

function renderPlayer() {
  var t = current();
  if (!t) return;
  var coverEl = $("#cover");
  coverEl.className = "cover c" + (t.cover || 0);
  $("#cover-glyph").textContent = t.title.charAt(0);
  $("#now-title").textContent = t.title;
  $("#now-artist").textContent = t.artist + " \xb7 " + t.album;
  $("#time-total").textContent = fmtTime(t.duration);
  $("#player").classList.toggle("is-playing", state.playing);
  $("#play-icon").innerHTML = state.playing
    ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
  $("#play").setAttribute("aria-label", state.playing ? "暂停" : "播放");
  $("#shuffle").setAttribute("aria-pressed", state.shuffle ? "true" : "false");
  $("#repeat").setAttribute("aria-pressed", state.repeat ? "true" : "false");
  $("#volume").value = String(state.volume);
  $("#vol-val").textContent = String(state.volume);
  var liked = !!state.likes[t.id];
  $("#like-now").classList.toggle("is-liked", liked);
  $("#like-now").setAttribute("aria-pressed", liked ? "true" : "false");
  renderProgress();
}

function renderProgress() {
  var t = current();
  if (!t) return;
  var dur = t.duration || 1;
  var pct = Math.max(0, Math.min(100, (state.position / dur) * 100));
  $("#progress-fill").style.width = pct + "%";
  $("#progress-knob").style.left = pct + "%";
  $("#time-cur").textContent = fmtTime(state.position);
  var prog = $("#progress");
  prog.setAttribute("aria-valuenow", String(Math.round(pct)));
  prog.setAttribute("aria-valuetext", fmtTime(state.position) + " / " + fmtTime(dur));
}

function renderPlaylist() {
  var q = state.query.trim().toLowerCase();
  var html = "";
  var shown = 0;
  var totalSec = 0;
  state.tracks.forEach(function (t, idx) {
    totalSec += t.duration;
    if (q && (t.title + " " + t.artist).toLowerCase().indexOf(q) < 0) return;
    shown += 1;
    var active = t.id === state.currentId;
    var liked = !!state.likes[t.id];
    html += '<li class="track' + (active ? " is-active" : "") + (active && state.playing ? " is-playing" : "") + '" data-track="' + t.id + '">' +
      '<button class="track-main" type="button">' +
        '<span class="track-index"><span class="tnum">' + (idx + 1 < 10 ? "0" : "") + (idx + 1) + '</span>' +
          '<span class="teq" aria-hidden="true"><i></i><i></i><i></i></span></span>' +
        '<span class="track-info">' +
          '<span class="track-title">' + escapeHtml(t.title) + "</span>" +
          '<span class="track-artist">' + escapeHtml(t.artist) + " \xb7 " + escapeHtml(t.album) + "</span>" +
        "</span>" +
        '<span class="track-dur">' + fmtTime(t.duration) + "</span>" +
      "</button>" +
      '<button class="track-like' + (liked ? " is-liked" : "") + '" data-like="' + t.id + '" type="button" aria-label="收藏 ' + escapeHtml(t.title) + '" aria-pressed="' + liked + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3l-1.6-1.4C5.4 14.4 2 11.3 2 7.9 2 5.1 4.2 3 6.9 3c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C17.8 3 20 5.1 20 7.9c0 3.4-3.4 6.5-8.4 11z"/></svg>' +
      "</button>" +
      '<button class="track-del" data-del="' + t.id + '" type="button" aria-label="移除 ' + escapeHtml(t.title) + '">\xd7</button>' +
    "</li>";
  });
  tracksEl.innerHTML = html;
  $("#pl-empty").hidden = shown > 0;
  $("#pl-meta").textContent = state.tracks.length + " 首 \xb7 " + Math.round(totalSec / 60) + " 分钟";
  var likedCount = 0;
  Object.keys(state.likes).forEach(function (k) { if (state.likes[k]) likedCount += 1; });
  $("#like-count").textContent = likedCount + " 首已收藏";
}

function renderAll() {
  renderPlayer();
  renderPlaylist();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function clearTimer() {
  if (timer) { window.clearInterval(timer); timer = null; }
}

function startTimer() {
  if (timer) return;
  timer = window.setInterval(function () {
    if (!state.playing) return;
    var t = current();
    if (!t) return;
    state.position += 1;
    tickCount += 1;
    if (tickCount % 5 === 0) save();
    if (state.position >= t.duration) {
      state.position = 0;
      advance(true);
      return;
    }
    renderProgress();
  }, 1000);
}

function play() {
  var t = current();
  if (!t) return;
  state.playing = true;
  save();
  renderPlayer();
  renderPlaylist();
  startTimer();
}

function pause() {
  state.playing = false;
  clearTimer();
  save();
  renderPlayer();
  renderPlaylist();
}

function toggle() {
  if (state.playing) pause();
  else play();
}

function advance(auto) {
  var idx = currentIndex();
  if (idx < 0) idx = 0;
  if (state.shuffle && state.tracks.length > 1) {
    var nextIdx = idx;
    while (nextIdx === idx) nextIdx = Math.floor(Math.random() * state.tracks.length);
    state.currentId = state.tracks[nextIdx].id;
  } else if (idx + 1 < state.tracks.length) {
    state.currentId = state.tracks[idx + 1].id;
  } else if (state.repeat || !auto) {
    state.currentId = state.tracks[0].id;
  } else {
    state.playing = false;
    state.position = 0;
    clearTimer();
    save();
    renderAll();
    return;
  }
  state.position = 0;
  save();
  renderAll();
  if (state.playing) startTimer();
}

function prev() {
  if (state.position > 3) {
    state.position = 0;
    renderProgress();
    save();
    return;
  }
  var idx = currentIndex();
  if (idx <= 0) idx = state.tracks.length;
  state.currentId = state.tracks[idx - 1].id;
  state.position = 0;
  save();
  renderAll();
  if (state.playing) startTimer();
}

function playTrack(id) {
  if (state.currentId === id) {
    toggle();
    return;
  }
  state.currentId = id;
  state.position = 0;
  state.playing = true;
  save();
  renderAll();
  startTimer();
}

function seekRatio(ratio) {
  var t = current();
  if (!t) return;
  state.position = Math.max(0, Math.min(t.duration - 0.01, ratio * t.duration));
  renderProgress();
  save();
}

function toggleLike(id) {
  if (state.likes[id]) delete state.likes[id];
  else state.likes[id] = true;
  save();
  renderAll();
}

function removeTrack(id) {
  var wasCurrent = state.currentId === id;
  state.tracks = state.tracks.filter(function (t) { return t.id !== id; });
  delete state.likes[id];
  if (!state.tracks.length) {
    state.tracks = seedTracks.slice();
    state.currentId = state.tracks[0].id;
    state.position = 0;
    state.playing = false;
    clearTimer();
  } else if (wasCurrent) {
    state.currentId = state.tracks[0].id;
    state.position = 0;
  }
  save();
  renderAll();
}

function parseDuration(text) {
  var s = String(text || "").trim();
  if (!s) return -1;
  var colon = s.indexOf(":");
  if (colon > 0) {
    var m = parseInt(s.slice(0, colon), 10);
    var sec = parseInt(s.slice(colon + 1), 10);
    if (!isFinite(m) || !isFinite(sec) || m < 0 || sec < 0 || sec > 59) return -1;
    var total = m * 60 + sec;
    return total > 0 && total <= 3600 ? total : -1;
  }
  var only = parseInt(s, 10);
  if (!isFinite(only) || only <= 0 || only > 3600) return -1;
  return only;
}

$("#tracks").addEventListener("click", function (e) {
  var node = e.target;
  while (node && node !== document.body) {
    if (node.hasAttribute && node.hasAttribute("data-like")) {
      toggleLike(node.getAttribute("data-like"));
      return;
    }
    if (node.hasAttribute && node.hasAttribute("data-del")) {
      removeTrack(node.getAttribute("data-del"));
      return;
    }
    if (node.hasAttribute && node.hasAttribute("data-track")) {
      playTrack(node.getAttribute("data-track"));
      return;
    }
    node = node.parentNode;
  }
});

$("#play").addEventListener("click", toggle);
$("#next").addEventListener("click", function () { advance(false); });
$("#prev").addEventListener("click", prev);
$("#shuffle").addEventListener("click", function () {
  state.shuffle = !state.shuffle;
  save();
  renderPlayer();
});
$("#repeat").addEventListener("click", function () {
  state.repeat = !state.repeat;
  save();
  renderPlayer();
});
$("#like-now").addEventListener("click", function () {
  var t = current();
  if (t) toggleLike(t.id);
});
$("#volume").addEventListener("input", function () {
  state.volume = parseInt($("#volume").value, 10) || 0;
  $("#vol-val").textContent = String(state.volume);
  save();
});
$("#search").addEventListener("input", function () {
  state.query = $("#search").value;
  renderPlaylist();
});

var seeking = false;
function seekFromEvent(e) {
  var prog = $("#progress");
  var rect = prog.getBoundingClientRect();
  var x = e.clientX - rect.left;
  seekRatio(Math.max(0, Math.min(1, x / rect.width)));
}
$("#progress").addEventListener("pointerdown", function (e) {
  seeking = true;
  try { $("#progress").setPointerCapture(e.pointerId); } catch (err) {}
  seekFromEvent(e);
});
$("#progress").addEventListener("pointermove", function (e) {
  if (seeking) seekFromEvent(e);
});
$("#progress").addEventListener("pointerup", function () {
  seeking = false;
});
$("#progress").addEventListener("pointercancel", function () {
  seeking = false;
});
$("#progress").addEventListener("keydown", function (e) {
  var t = current();
  if (!t) return;
  if (e.key === "ArrowRight") { state.position = Math.min(t.duration - 0.01, state.position + 5); e.preventDefault(); }
  else if (e.key === "ArrowLeft") { state.position = Math.max(0, state.position - 5); e.preventDefault(); }
  else return;
  renderProgress();
  save();
});

$("#add-toggle").addEventListener("click", function () {
  state.adding = !state.adding;
  $("#add-form").hidden = !state.adding;
  if (state.adding) {
    $("#add-error").hidden = true;
    $("#add-title").focus();
  }
});
$("#add-cancel").addEventListener("click", function () {
  state.adding = false;
  $("#add-form").hidden = true;
});
$("#add-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var title = $("#add-title").value.trim();
  var artist = $("#add-artist").value.trim() || "未知艺术家";
  var dur = parseDuration($("#add-duration").value);
  var errEl = $("#add-error");
  if (!title) {
    errEl.textContent = "先给曲目起个名字。";
    errEl.hidden = false;
    return;
  }
  if (dur < 0) {
    errEl.textContent = "时长格式不对，写成 3:30 或直接填秒数（例如 210）。";
    errEl.hidden = false;
    return;
  }
  var id = uid();
  state.tracks.unshift({ id: id, title: title.slice(0, 40), artist: artist.slice(0, 30), album: "本地导入", duration: dur, cover: Math.floor(Math.random() * 7) });
  state.adding = false;
  $("#add-form").hidden = true;
  $("#add-title").value = "";
  $("#add-artist").value = "";
  $("#add-duration").value = "";
  save();
  renderAll();
});

document.addEventListener("keydown", function (e) {
  var tag = e.target && e.target.tagName ? e.target.tagName : "";
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === " ") {
    e.preventDefault();
    toggle();
  } else if (e.key === "ArrowRight" && e.shiftKey) {
    e.preventDefault();
    advance(false);
  }
});

load();
renderAll();
`}}}],l=`*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;-webkit-font-smoothing:antialiased}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer;border:none;background:none}
a{color:var(--accent)}
h1,h2,h3,h4,p{margin:0}
ul,ol{margin:0;padding:0;list-style:none}
::selection{background:color-mix(in srgb,var(--accent) 30%,transparent)}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}`;function d(t,e){let a,r,n,i=t.name;return{"index.html":(a=t.body,r="dark"===e.mode,`<!DOCTYPE html>
<html lang="zh-CN"${r?' data-theme="dark"':""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${i}</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23ffffff'/%3E%3Cpath d='M16 7.6c.6 3.7 2.5 5.6 6.2 6.2-3.7.6-5.6 2.5-6.2 6.2-.6-3.7-2.5-5.6-6.2-6.2 3.7-.6 5.6-2.5 6.2-6.2Z' fill='%232e5e4c'/%3E%3C/svg%3E" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${a.trim()}
  <script src="app.js"></script>
</body>
</html>`),"styles.css":`${l}

${n="serif"===e.font?'"Iowan Old Style", "Palatino Linotype", Georgia, "Songti SC", "Noto Serif SC", serif':"mono"===e.font?'"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace':'ui-sans-serif, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',`:root{
  --bg:${e.bg};
  --surface:${e.surface};
  --text:${e.text};
  --muted:${e.muted};
  --accent:${e.accent};
  --accent2:${e.accent2};
  --border:${e.border};
  --radius:${e.radius}px;
  --font:${n};
}`}

${t.css.trim()}
`,"app.js":`/* ${i} — generated by VibeForge mock agent */
(function () {
"use strict";
${t.js.trim()}
})();
`}}let c=[{key:"book",name:"书架",kicker:"READING SHELF",unit:"本书",icon:"book",fields:[{key:"title",label:"书名",type:"text",required:!0,placeholder:"例如：置身事内"},{key:"author",label:"作者",type:"text",placeholder:"作者"},{key:"status",label:"状态",type:"select",options:["想读","在读","已读完"]},{key:"rating",label:"评分",type:"number",placeholder:"1-5"},{key:"note",label:"短评",type:"textarea",placeholder:"读后感受…"}],titleKey:"title",statusKey:"status",statKey:"rating",statLabel:"平均评分",seed:[{title:"置身事内",author:"兰小欢",status:"已读完",rating:5,note:"把土地财政讲透了。"},{title:"芯片简史",author:"汪波",status:"在读",rating:4,note:"读到光刻机部分。"},{title:"Designing Data-Intensive Applications",author:"Martin Kleppmann",status:"想读",rating:5,note:"分布式必读。"},{title:"海风中失落的血色馈赠",author:"阿利斯泰尔·麦克劳德",status:"已读完",rating:5,note:"短篇里的海风。"},{title:"人类简史",author:"尤瓦尔·赫拉利",status:"已读完",rating:3,note:"观点密集，后半略散。"},{title:"万历十五年",author:"黄仁宇",status:"在读",rating:4,note:"以史为镜。"}]},{key:"movie",name:"片单",kicker:"WATCH LIST",unit:"部片",icon:"film",fields:[{key:"title",label:"片名",type:"text",required:!0,placeholder:"例如：沙丘 2"},{key:"genre",label:"类型",type:"text",placeholder:"科幻 / 剧情"},{key:"status",label:"状态",type:"select",options:["想看","在看","已看完"]},{key:"platform",label:"平台",type:"text",placeholder:"影院 / 流媒体"},{key:"rating",label:"评分",type:"number",placeholder:"1-10"},{key:"note",label:"短评",type:"textarea"}],titleKey:"title",statusKey:"status",statKey:"rating",statLabel:"平均评分",seed:[{title:"沙丘 2",genre:"科幻",status:"已看完",platform:"影院",rating:9,note:"视听天花板。"},{title:"奥本海默",genre:"传记",status:"已看完",platform:"影院",rating:8,note:"三小时不闷。"},{title:"可怜的东西",genre:"奇幻",status:"想看",platform:"流媒体",rating:0,note:"等资源。"},{title:"繁花",genre:"剧集",status:"在看",platform:"腾讯",rating:8,note:"王家卫拍上海。"},{title:"驾驶我的车",genre:"剧情",status:"已看完",platform:"流媒体",rating:9,note:"契诃夫式对话。"},{title:"年会不能停",genre:"喜剧",status:"已看完",platform:"影院",rating:7,note:"职场爽片。"}]},{key:"recipe",name:"菜谱本",kicker:"RECIPE BOX",unit:"道菜",icon:"chef",fields:[{key:"title",label:"菜名",type:"text",required:!0,placeholder:"例如：番茄牛腩"},{key:"cuisine",label:"菜系",type:"text",placeholder:"川 / 粤 / 家常"},{key:"difficulty",label:"难度",type:"select",options:["简单","中等","麻烦"]},{key:"minutes",label:"耗时(分钟)",type:"number",placeholder:"45"},{key:"ingredients",label:"主要食材",type:"textarea",placeholder:"牛腩、番茄、洋葱…"}],titleKey:"title",statusKey:"difficulty",statKey:"minutes",statLabel:"平均耗时",seed:[{title:"番茄牛腩",cuisine:"家常",difficulty:"中等",minutes:90,ingredients:"牛腩 500g、番茄 3 个、洋葱半个"},{title:"葱油拌面",cuisine:"本帮",difficulty:"简单",minutes:20,ingredients:"细面、小葱一把、生抽、糖"},{title:"蒜香黄油虾",cuisine:"西式",difficulty:"简单",minutes:15,ingredients:"大虾、黄油、蒜、柠檬"},{title:"酸辣土豆丝",cuisine:"川",difficulty:"简单",minutes:15,ingredients:"土豆 2 个、干辣椒、醋"},{title:"冬阴功汤",cuisine:"泰式",difficulty:"麻烦",minutes:40,ingredients:"虾、香茅、南姜、椰浆"},{title:"鸡蛋羹",cuisine:"家常",difficulty:"简单",minutes:12,ingredients:"鸡蛋 2 个、温水、香油"}]},{key:"workout",name:"训练日志",kicker:"TRAINING LOG",unit:"组训练",icon:"dumbbell",fields:[{key:"title",label:"动作",type:"text",required:!0,placeholder:"例如：深蹲"},{key:"part",label:"部位",type:"select",options:["腿","背","胸","肩","核心"]},{key:"sets",label:"组数",type:"number"},{key:"reps",label:"次数",type:"number"},{key:"weight",label:"重量(kg)",type:"number"},{key:"note",label:"感受",type:"textarea"}],titleKey:"title",statusKey:"part",statKey:"sets",statLabel:"总组数",seed:[{title:"深蹲",part:"腿",sets:4,reps:8,weight:60,note:"最后一组有点晃。"},{title:"卧推",part:"胸",sets:4,reps:10,weight:40,note:"肩膀要沉。"},{title:"引体向上",part:"背",sets:5,reps:6,weight:0,note:"宽握。"},{title:"硬拉",part:"腿",sets:3,reps:5,weight:80,note:"腰别塌。"},{title:"平板支撑",part:"核心",sets:3,reps:1,weight:0,note:"60 秒一组。"},{title:"哑铃肩推",part:"肩",sets:4,reps:12,weight:12,note:"左侧弱一点。"}]},{key:"trip",name:"行囊",kicker:"TRIP PLANNER",unit:"个行程",icon:"plane",fields:[{key:"title",label:"目的地",type:"text",required:!0,placeholder:"例如：京都"},{key:"date",label:"出发日期",type:"date"},{key:"days",label:"天数",type:"number"},{key:"budget",label:"预算(元)",type:"number"},{key:"status",label:"状态",type:"select",options:["计划中","已预订","已完成"]},{key:"note",label:"备忘",type:"textarea"}],titleKey:"title",statusKey:"status",statKey:"budget",statLabel:"总预算",seed:[{title:"京都",date:"2026-03-28",days:5,budget:8e3,status:"已预订",note:"樱花季，早订。"},{title:"泉州",date:"2026-01-10",days:3,budget:3e3,status:"计划中",note:"吃面线糊。"},{title:"伊犁",date:"2026-06-15",days:8,budget:15e3,status:"计划中",note:"自驾需要租车。"},{title:"清迈",date:"2025-11-02",days:6,budget:9e3,status:"已完成",note:"雨季尾巴。"},{title:"杭州",date:"2026-04-04",days:2,budget:1500,status:"已预订",note:"看展。"},{title:"东京",date:"2026-05-20",days:6,budget:12e3,status:"计划中",note:"签证先办。"}]},{key:"crm",name:"客户台",kicker:"PIPELINE",unit:"个客户",icon:"users",fields:[{key:"title",label:"公司",type:"text",required:!0,placeholder:"例如：深维智能"},{key:"contact",label:"联系人",type:"text"},{key:"stage",label:"阶段",type:"select",options:["线索","沟通中","提案","已签约"]},{key:"amount",label:"金额(万元)",type:"number"},{key:"note",label:"跟进记录",type:"textarea"}],titleKey:"title",statusKey:"stage",statKey:"amount",statLabel:"总金额",seed:[{title:"深维智能",contact:"王总",stage:"提案",amount:45,note:"下周三过方案。"},{title:"星野科技",contact:"李工",stage:"沟通中",amount:12,note:"关注数据合规。"},{title:"澄明资本",contact:"陈经理",stage:"已签约",amount:80,note:"二期一月启动。"},{title:"青柚教育",contact:"周老师",stage:"线索",amount:6,note:"展会认识。"},{title:"和风制造",contact:"赵厂长",stage:"已签约",amount:30,note:"需要驻场支持。"},{title:"拾光影像",contact:"孙制片",stage:"沟通中",amount:18,note:"预算有限。"}]},{key:"inventory",name:"库存表",kicker:"INVENTORY",unit:"个 SKU",icon:"box",fields:[{key:"title",label:"品名",type:"text",required:!0,placeholder:"例如：A4 打印纸"},{key:"sku",label:"SKU",type:"text"},{key:"qty",label:"数量",type:"number"},{key:"price",label:"单价(元)",type:"number"},{key:"status",label:"状态",type:"select",options:["充足","偏低","缺货"]}],titleKey:"title",statusKey:"status",statKey:"qty",statLabel:"总库存",seed:[{title:"A4 打印纸",sku:"PAP-A4",qty:120,price:24,status:"充足"},{title:"订书钉",sku:"STP-24",qty:8,price:3,status:"偏低"},{title:"快递面单",sku:"LBL-100",qty:0,price:.4,status:"缺货"},{title:"打包胶带",sku:"TPE-48",qty:36,price:6,status:"充足"},{title:"气泡膜",sku:"BUB-50",qty:4,price:18,status:"偏低"},{title:"记号笔",sku:"MRK-BLK",qty:60,price:2,status:"充足"}]},{key:"course",name:"学习计划",kicker:"LEARNING PLAN",unit:"门课",icon:"graduation",fields:[{key:"title",label:"课程",type:"text",required:!0,placeholder:"例如：CS224N"},{key:"platform",label:"平台",type:"text"},{key:"progress",label:"进度(%)",type:"number"},{key:"status",label:"状态",type:"select",options:["未开始","进行中","已完成"]},{key:"note",label:"笔记",type:"textarea"}],titleKey:"title",statusKey:"status",statKey:"progress",statLabel:"平均进度",seed:[{title:"CS224N NLP",platform:"Stanford",progress:45,status:"进行中",note:"看完 attention 部分。"},{title:"Designing Data-Intensive Applications",platform:"书",progress:30,status:"进行中",note:"第 5 章。"},{title:"Figma 进阶",platform:"B 站",progress:100,status:"已完成",note:"组件化讲得好。"},{title:"线性代数",platform:"MIT OCW",progress:0,status:"未开始",note:"周末开始。"},{title:"Rust 程序设计",platform:"官方书",progress:15,status:"进行中",note:"所有权再读一遍。"},{title:"英语听力 30 天",platform:"自定",progress:60,status:"进行中",note:"每天 20 分钟。"}]},{key:"idea",name:"灵感池",kicker:"IDEA POOL",unit:"条灵感",icon:"bulb",fields:[{key:"title",label:"标题",type:"text",required:!0,placeholder:"一句话说清这个点子"},{key:"tag",label:"标签",type:"text",placeholder:"产品 / 写作 / 设计"},{key:"priority",label:"优先级",type:"select",options:["高","中","低"]},{key:"note",label:"展开",type:"textarea"}],titleKey:"title",statusKey:"priority",seed:[{title:"给命令行加一个「后悔药」",tag:"产品",priority:"中",note:"任何破坏性操作前自动快照。"},{title:"写作时用语音先讲一遍",tag:"写作",priority:"高",note:"口述比打字快。"},{title:"做一个只记录开心事的 App",tag:"产品",priority:"低",note:"每天三件小事。"},{title:"把读书笔记做成卡片墙",tag:"设计",priority:"中",note:"随机抽取复习。"},{title:"周末断网 4 小时实验",tag:"生活",priority:"高",note:"看看会发生什么。"},{title:"研究一下浏览器本地模型",tag:"技术",priority:"低",note:"WebGPU 跑小模型。"}]},{key:"task",name:"事项",kicker:"TASKS",unit:"个事项",icon:"check",fields:[{key:"title",label:"事项",type:"text",required:!0,placeholder:"要做什么"},{key:"project",label:"所属",type:"text"},{key:"priority",label:"优先级",type:"select",options:["高","中","低"]},{key:"due",label:"截止日期",type:"date"},{key:"note",label:"备注",type:"textarea"}],titleKey:"title",statusKey:"priority",seed:[{title:"整理季度复盘材料",project:"工作",priority:"高",due:"2026-11-14",note:"先拉数据。"},{title:"给爸妈打电话",project:"生活",priority:"中",due:"2026-11-11",note:""},{title:"预约体检",project:"健康",priority:"高",due:"2026-11-20",note:"空腹。"},{title:"读完《芯片简史》",project:"阅读",priority:"低",due:"2026-11-30",note:""},{title:"换季整理衣柜",project:"生活",priority:"低",due:"",note:""},{title:"续费域名和证书",project:"工作",priority:"中",due:"2026-11-25",note:""}]},{key:"contact",name:"通讯录",kicker:"CONTACTS",unit:"位联系人",icon:"users",fields:[{key:"title",label:"姓名",type:"text",required:!0,placeholder:"姓名"},{key:"phone",label:"电话",type:"text"},{key:"company",label:"公司",type:"text"},{key:"tag",label:"分组",type:"select",options:["朋友","同事","客户","家人"]},{key:"note",label:"备注",type:"textarea"}],titleKey:"title",statusKey:"tag",seed:[{title:"林工",phone:"138****2210",company:"星野",tag:"同事",note:"后端主力。"},{title:"小满",phone:"139****8801",company:"",tag:"朋友",note:"爬山搭子。"},{title:"王总",phone:"137****4520",company:"深维",tag:"客户",note:"偏好邮件沟通。"},{title:"妈妈",phone:"136****1189",company:"",tag:"家人",note:"周末视频。"},{title:"陈经理",phone:"135****7732",company:"澄明资本",tag:"客户",note:""},{title:"阿哲",phone:"188****6621",company:"自由职业",tag:"朋友",note:"摄影。"}]},{key:"generic",name:"条目库",kicker:"COLLECTION",unit:"条记录",icon:"grid",fields:[{key:"title",label:"名称",type:"text",required:!0,placeholder:"名称"},{key:"category",label:"分类",type:"text",placeholder:"分类"},{key:"status",label:"状态",type:"select",options:["进行中","已完成","已归档"]},{key:"score",label:"数值",type:"number"},{key:"note",label:"备注",type:"textarea"}],titleKey:"title",statusKey:"status",seed:[{title:"示例条目一",category:"默认分类",status:"进行中",score:8,note:""},{title:"示例条目二",category:"默认分类",status:"已完成",score:6,note:""},{title:"示例条目三",category:"默认分类",status:"已归档",score:4,note:""},{title:"示例条目四",category:"默认分类",status:"进行中",score:9,note:""},{title:"示例条目五",category:"默认分类",status:"已完成",score:7,note:""},{title:"示例条目六",category:"默认分类",status:"进行中",score:5,note:""}]}],p=[{key:"book",words:["书","阅读","读书","book","reading","书架","书单"]},{key:"movie",words:["电影","追剧","片单","剧","movie","film","影视"]},{key:"recipe",words:["菜谱","食谱","做菜","烹饪","recipe","菜","food"]},{key:"workout",words:["健身","训练","运动","锻炼","workout","gym","力量"]},{key:"trip",words:["旅行","行程","旅游","出游","trip","travel","攻略"]},{key:"crm",words:["客户","销售","crm","商机","线索","签单"]},{key:"inventory",words:["库存","仓库","进销存","inventory","物料","sku"]},{key:"course",words:["课程","学习","网课","course","learn","教程"]},{key:"idea",words:["灵感","点子","想法","idea","创意","收藏"]},{key:"contact",words:["联系人","通讯录","contact","名片","人脉"]},{key:"task",words:["事项","任务","待办","日程","todo","task"]}],u={name:"精密仪表",headingFont:'"SF Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',letterSpacing:"-0.015em",cardRadius:"6px",cardBg:"var(--surface)",cardBorder:"1px solid var(--border)",cardShadow:"0 1px 2px rgba(0,0,0,.03)",kickerTransform:"uppercase",rowGap:"8px",bodyClass:"design-technical",decor:"grid"},m={name:"软糖卡片",headingFont:'ui-rounded, "PingFang SC", ui-sans-serif, system-ui',letterSpacing:"-0.02em",cardRadius:"14px",cardBg:"var(--surface)",cardBorder:"1px solid color-mix(in srgb, var(--accent) 14%, var(--border))",cardShadow:"0 1px 2px rgba(0,0,0,.03), 0 14px 30px -22px rgba(0,0,0,.16)",kickerTransform:"uppercase",rowGap:"14px",bodyClass:"design-playful",decor:"blobs"},g={name:"纸上编辑",headingFont:'Georgia, "Songti SC", "Noto Serif SC", ui-serif, serif',letterSpacing:"-0.01em",cardRadius:"2px",cardBg:"var(--surface)",cardBorder:"1px solid color-mix(in srgb, var(--text) 14%, transparent)",cardShadow:"none",kickerTransform:"uppercase",rowGap:"0px",bodyClass:"design-editorial",decor:"rules"},f={name:"极简秩序",headingFont:"ui-sans-serif, -apple-system, 'Segoe UI', 'PingFang SC', sans-serif",letterSpacing:"-0.03em",cardRadius:"12px",cardBg:"var(--surface)",cardBorder:"1px solid var(--border)",cardShadow:"none",kickerTransform:"uppercase",rowGap:"8px",bodyClass:"design-minimal",decor:"none"},x={book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',chef:'<path d="M7 21h10M12 21v-6"/><path d="M9 15a4 4 0 1 1-2-7.4A4 4 0 0 1 12 3a4 4 0 0 1 5 4.6A4 4 0 0 1 15 15H9Z"/>',dumbbell:'<path d="M4 9v6M20 9v6M7 7v10M17 7v10M7 12h10"/>',plane:'<path d="M10.5 13.5 3 11V9l7.5 2L15 3h2l-2 8 6 2v2l-6 2 2 8h-2l-4.5-6.5L3 21v-2l7.5-2"/>',users:'<path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.2"/><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 5.2a3.2 3.2 0 0 1 0 5.6"/>',box:'<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',graduation:'<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>',check:'<path d="m4 12.5 5 5L20 6.5"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'},v=(e=void 0!==r.default?r.default.env:void 0,Number.isFinite(a=Number.parseFloat(e?.MOCK_SPEED||"1"))&&a>=0?a:1),b=t=>{let e;return 0===v?Promise.resolve():(e=t/v,new Promise(t=>setTimeout(t,e)))};function h(t){let e=t.trim().replace(/\s+/g," ");return e.length>42?`${e.slice(0,42)}…`:e}async function*y(t){let e,a=Date.now(),r="edit"===t.mode&&!!t.current,n=r&&t.current?.prompt?`${t.current.prompt}；追加要求：${t.prompt}`:t.prompt,i=s(n),l=function(t,e){let a=o.map(e=>({recipe:e,score:function(t,e){let a=t.toLowerCase(),r=0;for(let t of e){if(!t)continue;let e=t.toLowerCase();!(e.length<2)&&a.includes(e)&&(r+=Math.min(4,e.length-1))}return r}(t,e.keywords)})).sort((t,e)=>e.score-t.score);if(e?.recipeId){let t=a.find(t=>t.recipe.id===e.recipeId);if(t)return{kind:"recipe",recipe:t.recipe,score:t.score}}let r=a[0];return r&&r.score>0?{kind:"recipe",recipe:r.recipe,score:r.score}:{kind:"synth",score:0}}(n,t.current);yield{type:"step",id:"understand",label:"理解需求",status:"start"},yield{type:"log",text:r?`收到修改意见：「${h(t.prompt)}」`:`收到需求：「${h(t.prompt)}」`},await b(320);try{e=(()=>{var e,a,r,s,o,v;let b,h,y,k,w,E,S,L,I;if("recipe"===l.kind&&l.recipe){let e=l.recipe.build({prompt:n,theme:i,prev:t.current?.files??null}),a=d(e,i);return{app:{plan:{name:e.name,tagline:e.tagline,summary:e.summary,stack:["原生 HTML / CSS / JS","localStorage","响应式布局"],features:e.features},theme:i,entry:"index.html",files:a,recipeId:l.recipe.id}}}let z=(e=n,a=t.current?.files,h=function(t){let e=t.toLowerCase(),a=c[c.length-1],r=0;for(let{key:t,words:n}of p){let i=0;for(let t of n)e.includes(t.toLowerCase())&&(i+=t.length);i>r&&(r=i,a=c.find(e=>e.key===t)??a)}return a}(e),y=(b=e.toLowerCase(),/赛博|cyber|未来|科技|终端|暗黑|hack|极客/.test(b)?u:/可爱|粉色|糖果|少女|软萌|cute|pink|温柔/.test(b)?m:/复古|文艺|手账|温暖|纸|咖啡|日系|杂志/.test(b)?g:f),k=h.fields.find(t=>t.key===h.statusKey),w=k?.options??[],E=h.fields.map(t=>t.label).join("、"),S=[{icon:"zap",title:"快速新增",detail:`一键弹窗录入${h.unit}，${h.fields.slice(0,3).map(t=>t.label).join(" / ")} 一次填完`},{icon:"filter",title:"搜索与筛选",detail:w.length?`按状态（${w.join(" / ")}）筛选，支持关键词搜索`:"关键词即时搜索"},{icon:"database",title:"本地持久化",detail:"localStorage 自动保存，刷新 / 关闭浏览器都不丢数据"},{icon:"chart",title:"概览统计",detail:h.statKey?`顶部实时汇总总数与${h.statLabel}`:"顶部实时汇总总数与状态分布"}],{name:h.name,tagline:`${y.name}风格的${h.name}，把${E}放进一个可搜索、可筛选的视图里。`,summary:`一个${h.name}应用：新增、编辑、删除${h.unit}，按状态筛选并搜索关键词，数据保存在浏览器本地，刷新不丢。界面采用「${y.name}」设计语言。`,features:S,body:(r=h,L="grid"===(s=y).decor?'<div class="decor decor-grid" aria-hidden="true"></div>':"blobs"===s.decor?'<div class="decor decor-blob decor-blob-a" aria-hidden="true"></div><div class="decor decor-blob decor-blob-b" aria-hidden="true"></div>':"",`
  ${L}
  <div class="app ${s.bodyClass}">
    <header class="masthead">
      <div class="brand">
        <span class="brand-mark">${function(t,e=18){return`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${x[t]??x.grid}</svg>`}(r.icon,20)}</span>
        <div class="brand-text">
          <p class="kicker">${r.kicker}</p>
          <h1>${r.name}</h1>
        </div>
      </div>
      <div class="stats" id="stats"></div>
    </header>

    <section class="toolbar">
      <div class="filters" id="filters" role="tablist" aria-label="状态筛选"></div>
      <div class="tools">
        <label class="search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
          <input id="search" type="search" placeholder="搜索${r.unit}…" aria-label="搜索" />
        </label>
        <button type="button" class="btn primary" id="add-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          新增${r.unit.replace("个","")}
        </button>
      </div>
    </section>

    <main>
      <div class="list-head" id="list-head"></div>
      <ul class="list" id="list" aria-live="polite"></ul>
      <div class="empty" id="empty" hidden>
        <p class="empty-title">这里还没有记录</p>
        <p class="empty-hint">点右上角「新增」加入第一条${r.unit}。</p>
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
  </div>`),css:(o=y,`
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
.decor{position:fixed;pointer-events:none;z-index:0}
.decor-grid{inset:0;background-image:linear-gradient(color-mix(in srgb,var(--accent) 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 7%,transparent) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse at 50% 0%,#000 20%,transparent 72%)}
.decor-blob{width:320px;height:320px;border-radius:50%;filter:blur(70px);opacity:.4}
.decor-blob-a{top:-120px;right:-60px;background:color-mix(in srgb,var(--accent) 45%,transparent)}
.decor-blob-b{bottom:-140px;left:-80px;background:color-mix(in srgb,var(--accent2) 35%,transparent)}

.app{position:relative;z-index:1;max-width:${"纸上编辑"===o.name?"880px":"960px"};margin:0 auto;padding:44px 24px 72px}

.masthead{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px}
.brand{display:flex;align-items:center;gap:14px}
.brand-mark{width:44px;height:44px;display:grid;place-items:center;border-radius:calc(var(--radius) * .8);border:${o.cardBorder};background:${o.cardBg};color:var(--accent)}
.kicker{font-family:var(--font);font-size:10px;letter-spacing:.2em;${"uppercase"===o.kickerTransform?"text-transform:uppercase;":""}color:color-mix(in srgb,var(--accent) 80%,var(--muted));margin-bottom:6px}
h1{font-family:${o.headingFont};font-size:clamp(26px,3.6vw,36px);line-height:1.1;letter-spacing:${o.letterSpacing};font-weight:600}
.stats{display:flex;gap:22px;flex-wrap:wrap}
.stat{display:flex;flex-direction:column;gap:2px}
.stat b{font-family:${o.headingFont};font-size:22px;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
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
.list{display:flex;flex-direction:column;gap:${o.rowGap}}
.row{display:grid;grid-template-columns:52px minmax(0,1.5fr) minmax(0,1fr) 92px 76px;gap:12px;align-items:center;padding:13px 14px;background:${o.cardBg};border:${o.cardBorder};border-radius:${o.cardRadius};box-shadow:${o.cardShadow};transition:border-color .16s,transform .16s}
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
.modal-card{width:min(520px,100%);max-height:calc(100vh - 40px);overflow:auto;background:color-mix(in srgb,var(--surface) 96%,#000);border:1px solid color-mix(in srgb,var(--accent) 22%,var(--border));border-radius:${o.cardRadius};box-shadow:0 40px 80px -30px rgba(0,0,0,.8);animation:pop .18s ease both}
@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--border)}
.modal-head h2{font-size:15px;font-weight:600;font-family:${o.headingFont};letter-spacing:${o.letterSpacing}}
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
.design-editorial .row-title{font-family:${o.headingFont}}
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
}`),js:(I={entity:{name:(v=h).name,unit:v.unit,fields:v.fields,titleKey:v.titleKey,statusKey:v.statusKey,statKey:v.statKey,statLabel:v.statLabel},seed:v.seed,key:`vf:${v.key}:v1`},`
var CONFIG = ${JSON.stringify(I)};
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
  return parts.join(" \xb7 ");
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
`)});return{app:{plan:{name:z.name,tagline:z.tagline,summary:z.summary,stack:["原生 HTML / CSS / JS","localStorage","响应式布局"],features:z.features},theme:i,entry:"index.html",files:d(z,i),recipeId:void 0}}})().app}catch(t){yield{type:"error",message:`生成失败：${t instanceof Error?t.message:String(t)}`};return}let v=e.plan.features.map(t=>t.title);yield{type:"log",text:v.length?`拆解出 ${v.length} 个关键点：${v.join(" / ")}`:"拆解需求：一个核心主流程 + 一个延展能力"},yield{type:"log",text:`设计方向：${i.name} \xb7 主色 ${i.accent} \xb7 ${"dark"===i.mode?"深色":"浅色"}表面 \xb7 圆角 ${i.radius}px`},yield{type:"step",id:"understand",label:"理解需求",status:"done"},await b(420),yield{type:"step",id:"design",label:"设计系统",status:"start"},yield{type:"plan",plan:e.plan,theme:e.theme},await b(520),yield{type:"step",id:"design",label:"设计系统",status:"done",detail:`${i.name} \xb7 ${"dark"===i.mode?"dark":"light"}`},yield{type:"step",id:"code",label:"编写实现",status:"start"};let y=["index.html","styles.css","app.js"].filter(t=>t in e.files);for(let t of y){var k;let a=e.files[t],n={path:t,lines:(k=a).split("\n").length,kb:(k.length/1024).toFixed(1)};await b(180+Math.min(520,a.length/4)),yield{type:"file",path:t,content:a,action:r?"update":"write"},yield{type:"log",text:`${t}  \xb7  ${n.lines} 行  \xb7  ${n.kb} KB`},await b(140)}yield{type:"step",id:"code",label:"编写实现",status:"done",detail:`${y.length} 个文件`},yield{type:"step",id:"verify",label:"自检",status:"start"},await b(380);let w=function(t){let e=[],a=t["index.html"]||"",r=t["app.js"]||"";a.includes("<body")||e.push("缺少 body 结构"),a.includes("app.js")||e.push("未挂载脚本"),a.includes("styles.css")||e.push("未挂载样式"),/"use strict"/.test(r)||e.push("脚本未启用严格模式");let n=!0;try{Function(r)}catch{n=!1,e.push("脚本语法检查失败")}return{ok:0===e.length&&n,notes:e}}(e.files);yield{type:"log",text:w.ok?`自检通过：结构完整 \xb7 脚本语法 OK \xb7 本地存储受限访问已包裹 \xb7 体积 ${(Object.values(e.files).reduce((t,e)=>t+e.length,0)/1024).toFixed(1)} KB`:`自检提示：${w.notes.join("；")}`},await b(w.ok?300:520),yield{type:"step",id:"verify",label:"自检",status:"done",detail:w.ok?"通过":"有提示"},yield{type:"done",app:e,ms:Date.now()-a,provider:"mock"}}let k=["index.html","styles.css","app.js"],w=`You are an expert front-end engineer. Build a complete, runnable single-page app.

Reply with EXACTLY ONE JSON object, no markdown fences, no prose before or after:

{
  "plan": {
    "name": "2-4 word product name",
    "tagline": "one sentence",
    "summary": "one paragraph",
    "stack": ["HTML/CSS/JS", "localStorage"],
    "features": [{ "icon": "zap", "title": "短标题", "detail": "一句说明" }]
  },
  "files": {
    "index.html": "complete HTML document; links styles.css and loads app.js at the end of body",
    "styles.css": "complete CSS; define :root CSS variables (--bg --surface --text --muted --accent --accent2 --border --radius --font)",
    "app.js": "complete CLASSIC script (no modules, no imports, no template literals $\{...}); persist state in localStorage inside try/catch"
  }
}

Rules:
- Fully offline: no CDN, no external fonts or images, inline SVG icons only.
- Responsive down to 375px; real interactions (add/edit/delete/filter/drag/sort…); 6+ seed items so it never opens empty.
- Refined product design (Linear/Notion-like): light surfaces, one restrained accent, 1px hairline borders, 8-12px radius, generous spacing, subtle hover/focus states.
- Chinese UI copy. No console errors, no TODOs, no console.log.
- JSON must be valid: escape newlines inside strings as \\n, never break the outer object.`;function E(t){if("edit"===t.mode&&t.current){let e=Object.entries(t.current.files).map(([t,e])=>`--- ${t} ---
${e}`).join("\n\n");return`Existing app: ${t.current.name}

${e}

Apply this change and return the COMPLETE updated JSON object (all files):
${t.prompt}`}return"edit"===t.mode?`Apply this change and return the complete JSON object:
${t.prompt}`:`Build this app:
${t.prompt}`}async function*S(t,e){var a,r;let n,i,o;if(!e.apiKey)return void(yield{type:"error",message:"缺少 API Key：请在设置中填入模型 Key，或切回 Mock Agent"});let l=Date.now(),d=s(t.prompt),c=e.model??"default";yield{type:"step",id:"understand",label:"理解需求",status:"start"},yield{type:"log",text:`调用 ${e.id} \xb7 ${c}，等待模型输出结构化 JSON…`},yield{type:"step",id:"understand",label:"理解需求",status:"done"},yield{type:"step",id:"code",label:"生成代码",status:"start"};let p=[],u=0,m=Date.now(),g="reasoning";try{for await(let a of"anthropic"===e.id?T(t,e):A(t,e))if("reasoning"===a.kind?u+=a.text.length:(p.push(a.text),"reasoning"===g&&(g="content",yield{type:"log",text:"推理完成，开始输出 JSON 代码…"})),Date.now()-m>8e3){m=Date.now();let t=Math.round((Date.now()-l)/1e3);yield{type:"log",text:"reasoning"===g?`模型推理中… 已思考 ${u.toLocaleString()} 字符（${t}s）`:`已接收 ${p.join("").length.toLocaleString()} 字符（${t}s）`}}}catch(t){yield{type:"error",message:t instanceof Error?t.message:String(t)};return}let f=p.join(""),x=function(t){let e=function(t){let e=t.replace(/^```(?:json)?/i,"").replace(/```\s*$/g,""),a=e.indexOf("{");if(a<0)return null;let r=0,n=!1,i=!1;for(let t=a;t<e.length;t+=1){let s=e[t];if(n){i?i=!1:"\\"===s?i=!0:'"'===s&&(n=!1);continue}if('"'===s)n=!0;else if("{"===s)r+=1;else if("}"===s&&0==(r-=1))return e.slice(a,t+1)}return null}(t);if(!e)return null;try{let t=JSON.parse(e);if(!t||"object"!=typeof t)return null;return t}catch{return null}}(f);if(!x)return void(yield{type:"error",message:`模型输出不是合法 JSON（${f.length} 字符）：${f.slice(0,180).replace(/\s+/g," ")}…`});let v=(a=x.plan,r=t.prompt,i="string"==typeof(n=a&&"object"==typeof a?a:{}).name&&n.name.trim()?n.name.trim():"Generated App",0===(o=Array.isArray(n.features)?n.features.filter(t=>!!t&&"object"==typeof t).slice(0,6).map(t=>({icon:"string"==typeof t.icon?t.icon:"sparkles",title:"string"==typeof t.title?t.title:"功能",detail:"string"==typeof t.detail?t.detail:""})):[]).length&&o.push({icon:"sparkles",title:"AI 生成",detail:r.slice(0,40)}),{name:i,tagline:"string"==typeof n.tagline?n.tagline:"",summary:"string"==typeof n.summary?n.summary:r,stack:I(n.stack).length?I(n.stack):["HTML / CSS / JS","localStorage"],features:o}),b=function(t){if(!t||"object"!=typeof t)return{};let e={};for(let[a,r]of Object.entries(t))"string"==typeof r&&r.trim()&&(e[a]=r);return!e["styles.css"]&&e["index.html"]&&(e["styles.css"]=""),!e["app.js"]&&e["index.html"]&&(e["app.js"]=""),e}(x.files);if(!b["index.html"])return void(yield{type:"error",message:"模型返回的文件里缺少 index.html"});await L(150),yield{type:"plan",plan:v,theme:d};let h=[...k.filter(t=>t in b),...Object.keys(b).filter(t=>!k.includes(t))];for(let e of h)yield{type:"file",path:e,content:b[e],action:"edit"===t.mode?"update":"write"},yield{type:"log",text:`${e}  \xb7  ${b[e].split("\n").length} 行  \xb7  ${(b[e].length/1024).toFixed(1)} KB`},await L(80);yield{type:"step",id:"code",label:"生成代码",status:"done",detail:`${h.length} 个文件`},yield{type:"step",id:"verify",label:"自检",status:"start"},await L(200);let y=function(t){let e=[],a=t["index.html"]??"",r=t["app.js"]??"";a.includes("<body")||e.push("HTML 缺少 body"),a.includes("styles.css")||e.push("HTML 未引用 styles.css"),a.includes("app.js")||e.push("HTML 未引用 app.js"),(/\bimport\s+[^("]/.test(r)||/\bexport\s+(default|const|function)/.test(r))&&e.push("app.js 含模块语法（应为经典脚本）");try{Function(r)}catch{e.push("app.js 语法错误")}return e}(b);yield{type:"log",text:y.length?`自检提示：${y.join("；")}`:"自检通过：HTML 结构完整 · 脚本为经典脚本 · 样式与脚本均已挂载"},yield{type:"step",id:"verify",label:"自检",status:"done",detail:y.length?"有提示":"通过"},yield{type:"done",app:{plan:v,theme:d,entry:"index.html",files:b},ms:Date.now()-l,provider:e.id}}let L=t=>new Promise(e=>setTimeout(e,t));function I(t){return Array.isArray(t)?t.filter(t=>"string"==typeof t):[]}function z(t,e){return(t||e).replace(/\/+$/,"")}async function*A(t,e){let a=z(e.baseURL,"https://api.openai.com/v1"),r=[{role:"system",content:w},{role:"user",content:E(t)}],n=[.../dashscope\.aliyuncs\.com/.test(a)?[{jsonMode:!0,maxTokens:32e3,thinkingOff:!0}]:[],{jsonMode:!0,maxTokens:32e3,thinkingOff:!1},{jsonMode:!1,maxTokens:32e3,thinkingOff:!1},{jsonMode:!1,maxTokens:16e3,thinkingOff:!1},{jsonMode:!1,maxTokens:8e3,thinkingOff:!1}],i=null,s="";for(let t of n){let n=fetch(`${a}/chat/completions`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.model,stream:!0,max_tokens:t.maxTokens,messages:r,...t.jsonMode?{response_format:{type:"json_object"}}:{},...t.thinkingOff?{enable_thinking:!1}:{}}),signal:AbortSignal.timeout(3e5)});if((i=await n).ok)break;let o=await i.text();if(s=`模型接口返回 ${i.status}：${o.slice(0,240)}`,!((400===i.status||422===i.status)&&/response_format|json_object|max_tokens|temperature|enable_thinking|thinking|unsupported|invalid_parameter|not supported/i.test(o)))break}if(!i||!i.ok||!i.body)throw Error(s||"模型接口请求失败（未获得响应）");yield*M(i.body,t=>{let e=t.choices?.[0]?.delta;return e?"string"==typeof e.reasoning_content&&e.reasoning_content?{kind:"reasoning",text:e.reasoning_content}:"string"==typeof e.content&&e.content?{kind:"content",text:e.content}:null:null})}async function*T(t,e){let a=await fetch(`${z(e.baseURL,"https://api.anthropic.com")}/v1/messages`,{method:"POST",headers:{"content-type":"application/json","x-api-key":e.apiKey??"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:e.model,max_tokens:8e3,stream:!0,system:w,messages:[{role:"user",content:E(t)}]}),signal:AbortSignal.timeout(3e5)});if(!a.ok||!a.body)throw Error(`Anthropic 接口返回 ${a.status}：${(await a.text()).slice(0,240)}`);yield*M(a.body,t=>{let e="content_block_delta"===t.type?t.delta?.text:void 0;return e?{kind:"content",text:e}:null})}async function*M(t,e){let a=t.getReader(),r=new TextDecoder,n="";for(;;){let{done:t,value:i}=await a.read();if(t)break;let s=(n+=r.decode(i,{stream:!0})).indexOf("\n");for(;s>=0;){let t=n.slice(0,s).trim();if(n=n.slice(s+1),t.startsWith("data:")){let a=t.slice(5).trim();if("[DONE]"===a)return;try{let t=e(JSON.parse(a));t?.text&&(yield t)}catch{}}s=n.indexOf("\n")}}}async function*C(t,e){let a=()=>{if(e?.aborted)throw new DOMException("已取消生成","AbortError")},r=t.provider;if(r&&"mock"!==r.id)return r.apiKey?(a(),void(yield*S(t,{id:r.id,apiKey:r.apiKey,baseURL:r.baseURL,model:r.model}))):void(yield{type:"error",message:"静态部署下使用真实模型需要填写自己的 API Key（设置面板），或切回 Mock Agent"});let n=y(t);for(;;){a();let t=await n.next();if(t.done)break;yield t.value}}t.s(["localGenerate",0,C],39423)}]);