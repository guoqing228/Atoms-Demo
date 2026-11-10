import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Calculator — tool IA: keypad + live expression preview on the left, a
 * persistent calculation history rail on the right. Supports four operations,
 * percent, sign flip, backspace, full keyboard input and click-to-reuse history.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "算一下",
    tagline: "算式留在屏幕上，历史替你记住",
    summary:
      "一个顺手的计算器：支持加减乘除、百分比与正负号，边输入边显示预览结果。键盘直接敲数字和运算符就能算，每次结果自动进入右侧历史，点一下可以接着算。",
    features: [
      { icon: "zap", title: "键盘直输", detail: "数字、运算符、Enter、Esc 全支持" },
      { icon: "layout", title: "实时预览", detail: "输入算式时同步显示计算结果" },
      { icon: "grip", title: "历史复用", detail: "点击历史结果载入，可单条删除" },
      { icon: "database", title: "本地保存", detail: "历史记录保存在浏览器，刷新不丢" },
    ],
    body: `
  <main class="app">
    <header class="head">
      <div>
        <p class="eyebrow">CALCULATOR</p>
        <h1>算点东西</h1>
        <p class="sub">键盘直接输入，边算边看结果，历史会自动留下。</p>
      </div>
      <span class="badge">本地计时 · 无需联网</span>
    </header>

    <div class="layout">
      <section class="calc" aria-label="计算器">
        <div class="display" aria-live="polite">
          <div class="expr" id="expr">0</div>
          <div class="result" id="result">0</div>
          <div class="hint" id="hint">Enter 计算 · Esc 清空 · ⌫ 退格</div>
        </div>
        <div class="keys" id="keys">
          <button class="key fn" data-action="clear" type="button">AC</button>
          <button class="key fn" data-action="back" type="button" aria-label="退格">⌫</button>
          <button class="key fn" data-action="percent" type="button">%</button>
          <button class="key op" data-action="op" data-op="/" type="button" aria-label="除">÷</button>

          <button class="key" data-action="num" data-num="7" type="button">7</button>
          <button class="key" data-action="num" data-num="8" type="button">8</button>
          <button class="key" data-action="num" data-num="9" type="button">9</button>
          <button class="key op" data-action="op" data-op="*" type="button" aria-label="乘">×</button>

          <button class="key" data-action="num" data-num="4" type="button">4</button>
          <button class="key" data-action="num" data-num="5" type="button">5</button>
          <button class="key" data-action="num" data-num="6" type="button">6</button>
          <button class="key op" data-action="op" data-op="-" type="button" aria-label="减">−</button>

          <button class="key" data-action="num" data-num="1" type="button">1</button>
          <button class="key" data-action="num" data-num="2" type="button">2</button>
          <button class="key" data-action="num" data-num="3" type="button">3</button>
          <button class="key op" data-action="op" data-op="+" type="button" aria-label="加">+</button>

          <button class="key fn" data-action="sign" type="button">±</button>
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

    <p class="foot">点击任意历史结果可以载入继续算 · 数据保存在你的浏览器</p>
  </main>`,
    css: `
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
}`,
    js: `
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

var OP_LABEL = { "*": "×", "/": "÷", "-": "−", "+": "+" };

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
      '<button class="hist-del" data-hdel="' + h.id + '" type="button" aria-label="删除这条记录">×</button>' +
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
    { id: uid(), expr: "128 × 4", result: "512", at: now - 3 * 60000 },
    { id: uid(), expr: "2048 ÷ 8", result: "256", at: now - 9 * 60000 },
    { id: uid(), expr: "19.8 + 4.2", result: "24", at: now - 26 * 60000 },
    { id: uid(), expr: "365 × 24", result: "8760", at: now - 74 * 60000 },
    { id: uid(), expr: "1250 × 0.8", result: "1000", at: now - 5 * 3600000 },
    { id: uid(), expr: "72 ÷ 3", result: "24", at: now - 2 * 86400000 }
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
`,
  };
}

export const calculatorRecipe: Recipe = {
  id: "calculator",
  label: "计算器",
  keywords: ["计算器", "计算", "四则运算", "加减乘除", "键盘输入", "算数", "calculator"],
  build,
};

export default calculatorRecipe;
