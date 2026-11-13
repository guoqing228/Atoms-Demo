import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * 会议室预约 —— 领域专用 recipe。
 *
 * 关键词命中后生成「时间段 + 冲突校验」的预约系统，而不是通用条目库：
 *  - 左侧会议室列表 + 日期切换
 *  - 主区域按小时的时间轴（08:00–20:00），预约块可点击编辑/删除
 *  - 点击空白时段新建预约；保存时校验「同会议室 + 同日期 + 时间重叠」
 *  - 数据 localStorage 持久化，含 8 条种子预约
 */
function build(ctx: RecipeContext): RecipeOutput {
  const titleFromPrompt = extractTitle(ctx.prompt);
  const name = titleFromPrompt ?? "会议室预约";

  return {
    name,
    tagline: "按时间段预约会议室，冲突自动拦截",
    summary:
      "一个会议室预约系统：选择日期、按小时查看各会议室占用情况，点击空白时段即可预约；保存时会校验同一会议室的时间冲突并提示。数据保存在浏览器本地。",
    features: [
      { icon: "calendar", title: "时间段可视化", detail: "按小时展示各会议室占用，一眼看出空闲" },
      { icon: "shield", title: "冲突自动校验", detail: "同会议室 + 同日期 + 时间重叠时拒绝保存并提示" },
      { icon: "users", title: "预约人信息", detail: "记录预约人、主题与用途，便于查找" },
      { icon: "database", title: "本地持久化", detail: "localStorage 自动保存，刷新不丢" },
    ],
    body: `
  <div class="page">
    <header class="head">
      <div class="head-left">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/><path d="M12 13v3l2 1"/></svg>
          </span>
          <div>
            <p class="kicker">ROOM BOOKING</p>
            <h1 id="app-title">${name}</h1>
          </div>
        </div>
        <p class="sub">按时间段预约会议室，冲突自动拦截。</p>
      </div>
      <div class="head-right">
        <button class="btn ghost" id="today-btn" type="button">回到今天</button>
        <div class="date-nav">
          <button class="icon-btn" id="prev-day" type="button" aria-label="前一天">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 6-6 6 6 6"/></svg>
          </button>
          <button class="date-label" id="date-label" type="button">—</button>
          <button class="icon-btn" id="next-day" type="button" aria-label="后一天">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </header>

    <section class="stats" id="stats"></section>

    <main class="layout">
      <aside class="rooms-panel">
        <div class="panel-head">
          <span class="panel-title">会议室</span>
          <span class="panel-hint" id="room-count"></span>
        </div>
        <div id="room-list" class="room-list"></div>
        <div class="panel-foot">
          <p class="legend"><span class="dot free"></span>空闲</p>
          <p class="legend"><span class="dot busy"></span>已预约</p>
        </div>
      </aside>

      <section class="calendar-panel">
        <div class="calendar-scroll">
          <div class="calendar" id="calendar">
            <div class="time-col" id="time-col"></div>
            <div class="grid" id="grid"></div>
          </div>
        </div>
      </section>
    </main>

    <section class="bookings">
      <div class="panel-head">
        <span class="panel-title">当天预约</span>
        <span class="panel-hint" id="day-count"></span>
      </div>
      <ul id="booking-list" class="booking-list"></ul>
      <p id="empty-state" class="empty" hidden>当天还没有预约，点击时间轴空白处即可新建。</p>
    </section>

    <footer class="foot">点击空白时段新建 · 点击预约块编辑 · 数据保存于本机浏览器</footer>
  </div>

  <div class="toast" id="toast" hidden></div>

  <div class="modal" id="modal" hidden>
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal-head">
        <h2 id="modal-title">新建预约</h2>
        <button class="icon-btn" id="close-modal" type="button" aria-label="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <form id="booking-form">
        <div class="form-body">
          <div class="field wide">
            <label for="f-title">预约主题</label>
            <input id="f-title" type="text" placeholder="例如：产品周会" required maxlength="40" />
          </div>
          <div class="field">
            <label for="f-room">会议室</label>
            <select id="f-room"></select>
          </div>
          <div class="field">
            <label for="f-date">日期</label>
            <input id="f-date" type="date" required />
          </div>
          <div class="field">
            <label for="f-start">开始时间</label>
            <select id="f-start"></select>
          </div>
          <div class="field">
            <label for="f-end">结束时间</label>
            <select id="f-end"></select>
          </div>
          <div class="field">
            <label for="f-booker">预约人</label>
            <input id="f-booker" type="text" placeholder="你的名字" maxlength="20" />
          </div>
          <div class="field wide">
            <label for="f-purpose">用途备注（可选）</label>
            <input id="f-purpose" type="text" placeholder="例如：季度复盘，需要投影" maxlength="60" />
          </div>
          <p class="form-error" id="form-error" hidden></p>
        </div>
        <footer class="modal-foot">
          <button type="button" class="btn danger" id="delete-booking" hidden>删除</button>
          <span class="spacer"></span>
          <button type="button" class="btn ghost" id="cancel">取消</button>
          <button type="submit" class="btn primary">保存预约</button>
        </footer>
      </form>
    </div>
  </div>`,
    css: `
.page{max-width:1080px;margin:0 auto;padding:40px 24px 72px}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap;margin-bottom:22px}
.brand{display:flex;gap:12px;align-items:center}
.brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--accent)}
.kicker{font-size:10px;letter-spacing:.18em;color:var(--muted);text-transform:uppercase;margin-bottom:4px}
h1{font-size:clamp(24px,3vw,32px);letter-spacing:-.02em;font-weight:650;line-height:1.15}
.sub{margin-top:8px;font-size:12.5px;color:var(--muted)}
.head-right{display:flex;align-items:center;gap:10px}
.date-nav{display:flex;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:3px}
.icon-btn{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;color:var(--muted);transition:.15s}
.icon-btn:hover{background:color-mix(in srgb,var(--accent) 10%,transparent);color:var(--text)}
.date-label{font-size:12.5px;color:var(--text);padding:4px 8px;min-width:104px;text-align:center;font-variant-numeric:tabular-nums}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border-radius:9px;font-size:12.5px;transition:.15s;white-space:nowrap}
.btn.primary{background:var(--accent);color:color-mix(in srgb,var(--bg) 90%,#000);font-weight:600}
.btn.primary:hover{filter:brightness(1.07)}
.btn.ghost{border:1px solid var(--border);color:var(--muted)}
.btn.ghost:hover{color:var(--text);background:color-mix(in srgb,var(--accent) 7%,transparent)}
.btn.danger{color:#c0392b;border:1px solid color-mix(in srgb,#c0392b 30%,transparent);margin-right:auto}
.btn.danger:hover{background:color-mix(in srgb,#c0392b 8%,transparent)}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:22px}
.stat{border:1px solid var(--border);background:var(--surface);border-radius:12px;padding:13px 15px}
.stat b{display:block;font-size:22px;line-height:1.1;color:var(--text);font-variant-numeric:tabular-nums}
.stat span{display:block;margin-top:3px;font-size:11px;color:var(--muted)}
.layout{display:grid;grid-template-columns:200px minmax(0,1fr);gap:16px;margin-bottom:22px}
.rooms-panel,.calendar-panel,.bookings{border:1px solid var(--border);background:var(--surface);border-radius:14px;overflow:hidden}
.rooms-panel{display:flex;flex-direction:column}
.panel-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border)}
.panel-title{font-size:12px;font-weight:600;letter-spacing:.02em}
.panel-hint{font-size:10.5px;color:var(--muted)}
.room-list{padding:6px;display:flex;flex-direction:column;gap:2px;flex:1}
.room-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:8px;border:1px solid transparent;text-align:left;transition:.15s}
.room-item:hover{background:color-mix(in srgb,var(--accent) 6%,transparent)}
.room-item.active{background:color-mix(in srgb,var(--accent) 10%,transparent);border-color:color-mix(in srgb,var(--accent) 30%,transparent)}
.room-item b{display:block;font-size:12px;font-weight:600;color:var(--text)}
.room-item span{display:block;font-size:10px;color:var(--muted);margin-top:2px}
.room-item .free-badge{margin-left:auto;font-size:9.5px;color:#2f7a58;background:color-mix(in srgb,#2f7a58 10%,transparent);border-radius:999px;padding:2px 7px;white-space:nowrap}
.room-item .free-badge.busy{color:#b0651c;background:color-mix(in srgb,#b0651c 10%,transparent)}
.panel-foot{padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:14px}
.legend{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted)}
.dot{width:7px;height:7px;border-radius:2px;display:inline-block}
.dot.free{background:var(--surface);border:1px solid var(--border)}
.dot.busy{background:color-mix(in srgb,var(--accent) 45%,transparent)}
.calendar-panel{min-width:0}
.calendar-scroll{overflow:auto;max-height:430px}
.calendar{display:grid;grid-template-columns:52px minmax(720px,1fr);position:relative}
.time-col{border-right:1px solid var(--border);background:color-mix(in srgb,var(--bg) 45%,var(--surface))}
.time-slot{height:46px;font-size:10px;color:var(--muted);text-align:right;padding-right:8px;transform:translateY(-6px);font-variant-numeric:tabular-nums}
.grid{position:relative;display:grid}
.grid-lines{position:absolute;inset:0;display:grid;grid-auto-rows:46px;pointer-events:none}
.grid-line{border-top:1px solid var(--border)}
.room-col{position:relative;border-right:1px solid var(--border);min-height:552px}
.room-col:last-child{border-right:none}
.room-col-head{position:sticky;top:0;z-index:3;height:34px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted);background:var(--surface);border-bottom:1px solid var(--border)}
.slot-hit{position:absolute;left:0;right:0;height:46px;cursor:pointer;transition:background .12s}
.slot-hit:hover{background:color-mix(in srgb,var(--accent) 8%,transparent)}
.booking{position:absolute;left:4px;right:4px;border-radius:7px;padding:5px 7px;font-size:10.5px;line-height:1.35;text-align:left;overflow:hidden;border:1px solid color-mix(in srgb,var(--accent) 34%,transparent);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--text);z-index:2;cursor:pointer;transition:.14s}
.booking:hover{background:color-mix(in srgb,var(--accent) 20%,transparent);transform:translateY(-1px)}
.booking b{display:block;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.booking span{display:block;color:var(--muted);font-size:9.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bookings{padding-bottom:4px}
.booking-list{padding:8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}
.booking-card{display:flex;justify-content:space-between;gap:10px;border:1px solid var(--border);border-radius:9px;padding:10px 12px;text-align:left;transition:.15s}
.booking-card:hover{border-color:color-mix(in srgb,var(--accent) 40%,var(--border))}
.booking-card b{display:block;font-size:12px;font-weight:600;color:var(--text)}
.booking-card small{display:block;margin-top:3px;font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.booking-card em{display:block;margin-top:2px;font-style:normal;font-size:10px;color:color-mix(in srgb,var(--muted) 80%,transparent)}
.empty{text-align:center;padding:22px 0 26px;font-size:12px;color:var(--muted)}
.foot{margin-top:26px;text-align:center;font-size:10.5px;color:var(--muted);opacity:.75}

.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:color-mix(in srgb,var(--bg) 92%,#000);color:#fff;padding:9px 14px;border-radius:9px;font-size:12px;z-index:60;box-shadow:0 10px 30px rgba(0,0,0,.25);animation:pop .18s ease both}
.toast.err{background:#c0392b}
@keyframes pop{from{opacity:0;transform:translate(-50%,6px)}to{opacity:1;transform:translate(-50%,0)}}
.modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:18px;background:color-mix(in srgb,#000 55%,transparent)}
.modal[hidden]{display:none}
.modal-card{width:min(520px,100%);max-height:calc(100vh - 36px);overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:14px;box-shadow:0 30px 80px -24px rgba(0,0,0,.5);animation:pop2 .16s ease both}
@keyframes pop2{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border)}
.modal-head h2{font-size:14.5px;font-weight:600}
.form-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px}
.field{display:flex;flex-direction:column;gap:5px;min-width:0}
.field.wide{grid-column:1/-1}
.field label{font-size:10.5px;color:var(--muted)}
.field input,.field select{height:34px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);padding:0 10px;font-size:12.5px;outline:none;font-family:var(--font);width:100%}
.field input:focus,.field select:focus{border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 12%,transparent)}
.form-error{grid-column:1/-1;margin:2px 0 0;font-size:11.5px;color:#c0392b;background:color-mix(in srgb,#c0392b 7%,transparent);border:1px solid color-mix(in srgb,#c0392b 20%,transparent);border-radius:8px;padding:7px 10px}
.modal-foot{display:flex;gap:8px;align-items:center;padding:12px 16px;border-top:1px solid var(--border)}
.spacer{flex:1}
@media (max-width:760px){
  .page{padding:26px 14px 56px}
  .layout{grid-template-columns:1fr}
  .rooms-panel{order:2}
  .calendar-panel{order:1}
  .stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .calendar-scroll{max-height:360px}
  .form-body{grid-template-columns:1fr}
  .head-right{width:100%;justify-content:space-between}
}`,
    js: `
var KEY = "vf:booking:v1";
var ROOMS = [
  { id: "a", name: "云杉厅", capacity: 8 },
  { id: "b", name: "白桦厅", capacity: 12 },
  { id: "c", name: "红枫厅", capacity: 20 },
  { id: "d", name: "松果厅", capacity: 4 }
];
var HOURS = [];
for (var h = 8; h <= 20; h++) HOURS.push(h);
var SLOT_H = 46;

var state = { date: todayStr(), room: "a", bookings: [], editingId: null };

function pad(n) { return (n < 10 ? "0" : "") + n; }
function todayStr() {
  var d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function shiftDate(str, delta) {
  var parts = str.split("-");
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + delta);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state.bookings)); } catch (e) {} }
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Object.prototype.toString.call(parsed) === "[object Array]") { state.bookings = parsed; return; }
    }
  } catch (e) {}
  state.bookings = seed();
  save();
}
function seed() {
  var d0 = todayStr();
  var d1 = shiftDate(d0, 1);
  return [
    { id: uid(), room: "a", date: d0, start: "09:00", end: "10:00", title: "产品周会", booker: "林晓", purpose: "本周迭代对齐" },
    { id: uid(), room: "a", date: d0, start: "14:00", end: "15:30", title: "设计评审", booker: "周舟", purpose: "首页改版方案" },
    { id: uid(), room: "b", date: d0, start: "10:00", end: "11:00", title: "候选人面试", booker: "王敏", purpose: "后端工程师" },
    { id: uid(), room: "b", date: d0, start: "15:00", end: "17:00", title: "客户对齐会", booker: "陈可", purpose: "季度需求沟通" },
    { id: uid(), room: "c", date: d0, start: "09:30", end: "11:30", title: "全员分享", booker: "HR", purpose: "AI 工具实践" },
    { id: uid(), room: "d", date: d0, start: "16:00", end: "17:00", title: "1:1", booker: "李然", purpose: "成长沟通" },
    { id: uid(), room: "a", date: d1, start: "11:00", end: "12:00", title: "数据复盘", booker: "赵一", purpose: "上周指标" },
    { id: uid(), room: "c", date: d1, start: "14:00", end: "16:00", title: "培训", booker: "培训组", purpose: "新人入职培训" }
  ];
}
function toMin(t) { var p = t.split(":"); return Number(p[0]) * 60 + Number(p[1]); }
function toTime(m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }

function overlaps(b, date, room, start, end, ignoreId) {
  if (b.date !== date || b.room !== room || b.id === ignoreId) return false;
  var bs = toMin(b.start), be = toMin(b.end), s = toMin(start), e = toMin(end);
  return s < be && bs < e;
}
function findConflict(date, room, start, end, ignoreId) {
  for (var i = 0; i < state.bookings.length; i++) {
    if (overlaps(state.bookings[i], date, room, start, end, ignoreId)) return state.bookings[i];
  }
  return null;
}
function roomName(id) {
  for (var i = 0; i < ROOMS.length; i++) if (ROOMS[i].id === id) return ROOMS[i].name;
  return id;
}
function dayBookings() {
  return state.bookings.filter(function (b) { return b.date === state.date; })
    .sort(function (a, b) { return toMin(a.start) - toMin(b.start); });
}

function renderHeader() {
  var d = state.date.split("-");
  document.getElementById("date-label").textContent = d[1] + "月" + d[2] + "日 · 周" + "日一二三四五六".charAt(new Date(state.date + "T00:00:00").getDay());
}
function renderRooms() {
  var list = document.getElementById("room-list");
  list.innerHTML = "";
  var day = dayBookings();
  ROOMS.forEach(function (room) {
    var busy = day.filter(function (b) { return b.room === room.id; }).length;
    var el = document.createElement("button");
    el.type = "button";
    el.className = "room-item" + (state.room === room.id ? " active" : "");
    el.innerHTML = '<span><b>' + esc(room.name) + '</b><span>' + room.capacity + ' 人 · 今日 ' + busy + ' 场</span></span>' +
      '<span class="free-badge' + (busy >= 3 ? " busy" : "") + '">' + (busy ? (3 - Math.min(3, busy)) + ' 空' : '空闲') + '</span>';
    el.addEventListener("click", function () { state.room = room.id; render(); });
    list.appendChild(el);
  });
  document.getElementById("room-count").textContent = ROOMS.length + " 间";
}
function renderStats() {
  var day = dayBookings();
  var totalMin = day.reduce(function (n, b) { return n + (toMin(b.end) - toMin(b.start)); }, 0);
  var bookedRooms = {};
  day.forEach(function (b) { bookedRooms[b.room] = true; });
  document.getElementById("stats").innerHTML =
    '<div class="stat"><b>' + day.length + '</b><span>今日预约</span></div>' +
    '<div class="stat"><b>' + Math.round(totalMin / 60 * 10) / 10 + 'h</b><span>占用时长</span></div>' +
    '<div class="stat"><b>' + (ROOMS.length - Object.keys(bookedRooms).length) + '</b><span>完全空闲会议室</span></div>' +
    '<div class="stat"><b>' + ROOMS.length + '</b><span>会议室总数</span></div>';
  document.getElementById("day-count").textContent = day.length + " 条";
}
function renderCalendar() {
  var timeCol = document.getElementById("time-col");
  timeCol.innerHTML = '<div style="height:34px"></div>';
  HOURS.forEach(function (h) {
    var el = document.createElement("div");
    el.className = "time-slot";
    el.textContent = pad(h) + ":00";
    timeCol.appendChild(el);
  });

  var grid = document.getElementById("grid");
  grid.style.gridTemplateColumns = "repeat(" + ROOMS.length + ", minmax(180px, 1fr))";
  grid.innerHTML = "";
  var lines = document.createElement("div");
  lines.className = "grid-lines";
  HOURS.forEach(function () {
    var line = document.createElement("div");
    line.className = "grid-line";
    lines.appendChild(line);
  });
  grid.appendChild(lines);

  var day = dayBookings();
  ROOMS.forEach(function (room) {
    var col = document.createElement("div");
    col.className = "room-col";
    var head = document.createElement("div");
    head.className = "room-col-head";
    head.textContent = room.name;
    col.appendChild(head);

    HOURS.forEach(function (h) {
      var hit = document.createElement("div");
      hit.className = "slot-hit";
      hit.style.top = (34 + (h - 8) * SLOT_H) + "px";
      hit.addEventListener("click", function () { openModal(null, room.id, pad(h) + ":00"); });
      col.appendChild(hit);
    });

    day.filter(function (b) { return b.room === room.id; }).forEach(function (b) {
      var startMin = toMin(b.start), endMin = toMin(b.end);
      var top = 34 + ((startMin - 8 * 60) / 60) * SLOT_H;
      var height = Math.max(26, ((endMin - startMin) / 60) * SLOT_H - 2);
      var block = document.createElement("button");
      block.type = "button";
      block.className = "booking";
      block.style.top = top + "px";
      block.style.height = height + "px";
      block.innerHTML = '<b>' + esc(b.title) + '</b><span>' + b.start + '–' + b.end + ' · ' + esc(b.booker || "未填写") + '</span>';
      block.addEventListener("click", function () { openModal(b.id); });
      col.appendChild(block);
    });
    grid.appendChild(col);
  });
}
function renderList() {
  var day = dayBookings();
  var list = document.getElementById("booking-list");
  list.innerHTML = "";
  document.getElementById("empty-state").hidden = day.length > 0;
  day.forEach(function (b) {
    var li = document.createElement("li");
    li.className = "booking-card";
    li.innerHTML = '<div><b>' + esc(b.title) + '</b><small>' + roomName(b.room) + ' · ' + b.start + '–' + b.end + '</small>' +
      '<em>' + esc(b.booker || "未填写") + (b.purpose ? " · " + esc(b.purpose) : "") + '</em></div>' +
      '<span class="icon-btn" aria-hidden="true">✎</span>';
    li.addEventListener("click", function () { openModal(b.id); });
    list.appendChild(li);
  });
}
function render() { renderHeader(); renderRooms(); renderStats(); renderCalendar(); renderList(); }

function fillTimeSelects() {
  var startSel = document.getElementById("f-start");
  var endSel = document.getElementById("f-end");
  startSel.innerHTML = ""; endSel.innerHTML = "";
  for (var h = 8; h <= 20; h++) {
    var opt = document.createElement("option");
    opt.value = pad(h) + ":00"; opt.textContent = pad(h) + ":00";
    startSel.appendChild(opt);
    if (h > 8) {
      var opt2 = document.createElement("option");
      opt2.value = pad(h) + ":00"; opt2.textContent = pad(h) + ":00";
      endSel.appendChild(opt2);
    }
  }
}
function fillRoomSelect() {
  var sel = document.getElementById("f-room");
  sel.innerHTML = "";
  ROOMS.forEach(function (room) {
    var opt = document.createElement("option");
    opt.value = room.id; opt.textContent = room.name + "（" + room.capacity + " 人）";
    sel.appendChild(opt);
  });
}

function openModal(id, roomId, startTime) {
  state.editingId = id || null;
  var booking = null;
  for (var i = 0; i < state.bookings.length; i++) if (state.bookings[i].id === id) booking = state.bookings[i];
  document.getElementById("modal-title").textContent = booking ? "编辑预约" : "新建预约";
  document.getElementById("delete-booking").hidden = !booking;
  document.getElementById("form-error").hidden = true;

  document.getElementById("f-title").value = booking ? booking.title : "";
  document.getElementById("f-room").value = booking ? booking.room : (roomId || state.room);
  document.getElementById("f-date").value = booking ? booking.date : state.date;
  document.getElementById("f-start").value = booking ? booking.start : (startTime || "09:00");
  document.getElementById("f-end").value = booking ? booking.end : "10:00";
  document.getElementById("f-booker").value = booking ? booking.booker || "" : "";
  document.getElementById("f-purpose").value = booking ? booking.purpose || "" : "";

  document.getElementById("modal").hidden = false;
  document.getElementById("f-title").focus();
}
function closeModal() {
  document.getElementById("modal").hidden = true;
  state.editingId = null;
}
function showError(msg) {
  var el = document.getElementById("form-error");
  el.textContent = msg;
  el.hidden = false;
}
function showToast(msg, isError) {
  var el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast" + (isError ? " err" : "");
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () { el.hidden = true; }, 2400);
}

function submitBooking(e) {
  e.preventDefault();
  var title = document.getElementById("f-title").value.trim();
  var room = document.getElementById("f-room").value;
  var date = document.getElementById("f-date").value;
  var start = document.getElementById("f-start").value;
  var end = document.getElementById("f-end").value;
  var booker = document.getElementById("f-booker").value.trim();
  var purpose = document.getElementById("f-purpose").value.trim();

  if (!title) { showError("请填写预约主题"); return; }
  if (!date) { showError("请选择日期"); return; }
  if (toMin(end) <= toMin(start)) { showError("结束时间必须晚于开始时间"); return; }

  var conflict = findConflict(date, room, start, end, state.editingId);
  if (conflict) {
    showError("时间冲突：" + roomName(room) + " 在 " + date + " " + conflict.start + "–" + conflict.end +
      " 已被「" + conflict.title + "」占用，请调整时间或换会议室。");
    return;
  }

  if (state.editingId) {
    state.bookings = state.bookings.map(function (b) {
      return b.id === state.editingId ? { id: b.id, room: room, date: date, start: start, end: end, title: title, booker: booker, purpose: purpose } : b;
    });
  } else {
    state.bookings.push({ id: uid(), room: room, date: date, start: start, end: end, title: title, booker: booker, purpose: purpose });
  }
  save();
  state.date = date;
  closeModal();
  render();
  showToast("预约已保存");
}

function deleteBooking() {
  if (!state.editingId) return;
  var target = state.editingId;
  state.bookings = state.bookings.filter(function (b) { return b.id !== target; });
  save();
  closeModal();
  render();
  showToast("预约已删除");
}

document.getElementById("prev-day").addEventListener("click", function () { state.date = shiftDate(state.date, -1); render(); });
document.getElementById("next-day").addEventListener("click", function () { state.date = shiftDate(state.date, 1); render(); });
document.getElementById("date-label").addEventListener("click", function () { state.date = todayStr(); render(); });
document.getElementById("today-btn").addEventListener("click", function () { state.date = todayStr(); render(); });
document.getElementById("close-modal").addEventListener("click", closeModal);
document.getElementById("cancel").addEventListener("click", closeModal);
document.getElementById("delete-booking").addEventListener("click", deleteBooking);
document.getElementById("booking-form").addEventListener("submit", submitBooking);
document.getElementById("modal").addEventListener("click", function (e) { if (e.target === document.getElementById("modal")) closeModal(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !document.getElementById("modal").hidden) closeModal(); });

fillTimeSelects();
fillRoomSelect();
load();
render();
`,
  };
}

/** 从修改指令里提取「把标题改成 X」这类要求。 */
function extractTitle(prompt: string): string | null {
  const match = /(?:标题|名字|名称|应用名)[^，。；\n]{0,8}(?:改成|改为|叫|换成)[「"'“]?([^」"'”，。；\n]{1,20})/.exec(
    prompt,
  );
  return match ? match[1].trim() : null;
}

export const bookingRecipe: Recipe = {
  id: "booking",
  label: "会议室预约",
  keywords: ["会议室", "预约", "预订", "排期", "场地", "房间", "booking", "room", "日程"],
  build,
};

export default bookingRecipe;
