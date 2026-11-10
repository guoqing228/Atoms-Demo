import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Expense — 记账账本：月度汇总 + 收支流水表 + 纯 SVG 分类环图 / 6 个月趋势。
 * 信息架构：数据看板（KPI + 图表 + 表格），不是卡片网格。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Ledger 账本",
    tagline: "这个月花在哪了，一张图说清楚",
    summary:
      "一个本地记账应用：按月份记录收支、分类汇总，用纯 SVG 环图看支出结构、近 6 个月趋势看变化，流水支持新增、修改和删除。",
    features: [
      { icon: "wallet", title: "快速记一笔", detail: "金额 / 分类 / 备注 / 日期一步录入" },
      { icon: "pie-chart", title: "分类环图", detail: "纯 SVG 绘制，看清钱花在哪" },
      { icon: "trending-up", title: "月度趋势", detail: "近 6 个月收入与支出对比" },
      { icon: "database", title: "本地保存", detail: "流水保存在浏览器，刷新不丢" },
    ],
    body: `
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
        <strong id="sum-balance">¥0</strong>
        <em id="sum-rate">储蓄率 —</em>
      </div>
      <div class="sum-card"><span>本月收入</span><strong class="pos" id="sum-income">¥0</strong></div>
      <div class="sum-card"><span>本月支出</span><strong id="sum-expense">¥0</strong></div>
      <div class="sum-card"><span>日均支出</span><strong id="sum-avg">¥0</strong><em class="hint" id="sum-days">按 30 天</em></div>
    </section>

    <div class="charts">
      <section class="panel" aria-label="支出分类">
        <div class="panel-head"><h2>支出分类</h2><span id="cat-count">0 类</span></div>
        <div class="cat-chart">
          <div class="donut-wrap">
            <svg id="donut" class="donut" viewBox="0 0 120 120" aria-hidden="true"></svg>
            <div class="donut-center"><strong id="donut-total">¥0</strong><span>本月支出</span></div>
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

    <footer class="foot">纯前端 · 数据保存在浏览器 · 点击流水可修改</footer>
  </main>`,
    css: `
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
}`,
    js: `
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
  add(0, 5, "expense", 42, "餐饮", "午饭 · 公司楼下");
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
  return (neg ? "-" : "") + "¥" + parts[0] + (parts[1] ? "." + parts[1] : "");
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
    h += '<button type="button" class="txn-del" data-act="del" aria-label="删除这笔记录">×</button>';
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
`,
  };
}

export const expenseRecipe: Recipe = {
  id: "expense",
  label: "记账",
  keywords: ["记账", "账本", "收支", "支出", "收入", "账单", "消费", "预算", "expense", "ledger"],
  build,
};

export default expenseRecipe;
