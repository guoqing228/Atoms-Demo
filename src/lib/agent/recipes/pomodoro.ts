import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Pomodoro — 番茄钟：环形倒计时 + 关联任务 + 专注记录 / 最近 7 天柱状统计。
 * 信息架构：单焦点计时器 + 任务侧栏 + 记录统计。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Focus Timer",
    tagline: "25 分钟一个节奏，把专注攒成记录",
    summary:
      "一个番茄钟：选择关联任务后开始 25 分钟专注，环形倒计时结束自动记录一次番茄；短休 / 长休自动切换，并在侧栏汇总今日、本周与最近 7 天的专注数据。",
    features: [
      { icon: "timer", title: "环形计时", detail: "25 / 5 / 15 分钟三种节奏" },
      { icon: "target", title: "关联任务", detail: "专注时选一张任务卡，结束自动累计" },
      { icon: "chart", title: "专注统计", detail: "今日番茄、本周分钟与 7 天趋势" },
      { icon: "database", title: "本地保存", detail: "任务与记录刷新不丢" },
    ],
    body: `
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
          <button type="button" data-mode-btn="focus" class="is-active">专注 · 25 分</button>
          <button type="button" data-mode-btn="short">短休 · 5 分</button>
          <button type="button" data-mode-btn="long">长休 · 15 分</button>
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

    <footer class="foot">25 分钟一个节奏 · 专注结束自动记录 · 数据仅保存在你的浏览器</footer>
  </main>`,
    css: `
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
}`,
    js: `
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
    h += '<button type="button" class="task-del" data-act="del" aria-label="删除任务">×</button>';
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
    h += '<span class="rec-meta">' + r.minutes + " 分 · " + recordLabel(r.ts) + '</span></li>';
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
`,
  };
}

export const pomodoroRecipe: Recipe = {
  id: "pomodoro",
  label: "番茄钟",
  keywords: ["番茄", "番茄钟", "pomodoro", "专注", "计时", "倒计时", "focus", "timer"],
  build,
};

export default pomodoroRecipe;
