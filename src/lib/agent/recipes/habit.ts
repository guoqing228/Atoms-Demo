import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Habit — 习惯打卡：每个习惯最近 7 天打卡格 + 连续天数 + 12 周完成热力图。
 * 信息架构：日历/热力图 + 逐行打卡列表。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Streak 打卡",
    tagline: "每天一个小格子，连续下去",
    summary:
      "一个习惯打卡应用：给每个习惯每天打卡，自动计算连续天数，用 12 周热力图看整体坚持情况，支持新增和删除习惯，数据保存在浏览器。",
    features: [
      { icon: "check-circle", title: "一键打卡", detail: "最近 7 天每天一格，点一下即可" },
      { icon: "flame", title: "连续天数", detail: "自动计算每个习惯的当前连续" },
      { icon: "calendar", title: "12 周热力图", detail: "颜色越深，当天完成得越多" },
      { icon: "database", title: "本地保存", detail: "打卡记录刷新不丢" },
    ],
    body: `
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

    <footer class="foot">每一列是一周 · 颜色越深完成越多 · 数据仅保存在你的浏览器</footer>
  </main>`,
    css: `
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
}`,
    js: `
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
    title += future ? " · 还没到" : " · " + done + "/" + total + " 完成";
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
  document.getElementById("heat-foot").textContent = "共打卡 " + totalChecks + " 次 · 当前最长连续 " + best + " 天 · 今天 " + doneToday() + "/" + total + " 完成";
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
    h += '<button type="button" class="habit-del" data-act="del" aria-label="删除习惯">×</button>';
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
`,
  };
}

export const habitRecipe: Recipe = {
  id: "habit",
  label: "习惯打卡",
  keywords: ["习惯", "打卡", "habit", "热力图", "连续", "坚持", "streak", "日常"],
  build,
};

export default habitRecipe;
