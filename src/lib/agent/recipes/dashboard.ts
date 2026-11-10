import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Analytics dashboard — KPI strip, SVG trend chart (current vs previous),
 * channel bar chart and a sortable / expandable data table. Time-range and
 * metric switches recompute everything from one deterministic data model.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Pulse 看板",
    tagline: "把流量、转化和收入放进同一块屏幕",
    summary:
      "一个增长数据看板：顶部四张 KPI 指标卡、本期与上期的折线对比、渠道构成柱状图，以及可按任意列排序、点开看明细的渠道表格。切换 7/30/90 天会重算全部数据。",
    features: [
      { icon: "chart", title: "指标卡 + 趋势线", detail: "四个核心 KPI，配迷你走势和环比" },
      { icon: "layout", title: "纯 SVG 图表", detail: "折线对比与渠道柱状，无第三方图表库" },
      { icon: "filter", title: "时间与渠道筛选", detail: "7/30/90 天、四类渠道一键切换" },
      { icon: "grip", title: "可排序表格", detail: "点表头排序，点行展开明细" },
    ],
    body: `
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
            <p class="card-sub" id="chart-sub">访问量 · 本期 vs 上期</p>
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
          <p class="card-sub" id="table-sub">点表头排序 · 点行展开</p>
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

    <p class="foot">演示数据 · 偏好（时间范围 / 筛选 / 排序）会保存在本地</p>
  </main>`,
    css: `
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
}`,
    js: `
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
    { label: "总收入", value: "¥" + fmt(t.revenue), delta: deltas[2], seed: 90 },
    { label: "客单价", value: "¥" + fmt(t.aov), delta: deltas[3], seed: 72 }
  ];
  var html = "";
  defs.forEach(function (k, idx) {
    var up = k.delta >= 0;
    var spark = sparkSvg(genSeries(12, k.seed, 0.16, idx * 1.7 + 0.5), up);
    html += '<div class="kpi">' +
      '<span class="kpi-label">' + k.label + " · " + state.range + " 天</span>" +
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
    svg += '<text class="axis-text" x="' + (padL - 8) + '" y="' + (gy + 3.5) + '" text-anchor="end">' + (isRevenue ? "¥" + shortNum(gv) : shortNum(gv)) + "</text>";
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
  $("#chart-sub").textContent = (isRevenue ? "收入" : "访问量") + " · 本期 vs 上期";
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
      '<td class="num strong">¥' + fmt(r.revenue) + "</td>" +
      '<td class="num"><span class="delta ' + (up ? "up" : "down") + '">' + (up ? "+" : "") + r.delta.toFixed(1) + "%</span></td>" +
    "</tr>";
    if (open) {
      html += '<tr class="detail-row"><td colspan="5"><div class="detail">' +
        "<div><span>跳出率</span><strong>" + r.bounce + "</strong></div>" +
        "<div><span>平均停留</span><strong>" + r.session + "</strong></div>" +
        "<div><span>新访客占比</span><strong>" + r.newRate + "</strong></div>" +
        "<div><span>每千次收入</span><strong>¥" + fmt(r.revenue / r.visits * 1000) + "</strong></div>" +
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
  $("#table-sub").textContent = "共 " + rs.length + " 个渠道 · 点行展开明细";
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
`,
  };
}

export const dashboardRecipe: Recipe = {
  id: "dashboard",
  label: "数据看板",
  keywords: ["数据看板", "看板", "dashboard", "kpi", "指标", "折线图", "柱状图", "数据表格", "数据面板", "图表", "analytics"],
  build,
};

export default dashboardRecipe;
