import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * 2048 — board-centric layout: a 4x4 board with a score board and a session
 * history rail. Real interactions: arrow-key / WASD / touch-swipe moves,
 * merge animations, undo, new game, per-record delete, localStorage resume.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Merge 2048",
    tagline: "把小数字撞成大数字，看你能走多远",
    summary:
      "一个完整的 2048 小游戏：方向键、WASD、手机滑动都能操作，相同数字合并时放大提示，得分与最高分实时累计，关掉页面再回来还能接着玩。",
    features: [
      { icon: "layout", title: "键盘 + 触屏", detail: "方向键 / WASD / 滑动三条输入通道" },
      { icon: "zap", title: "合并动画", detail: "新方块弹出、合并方块轻微放大" },
      { icon: "grip", title: "撤销一步", detail: "手滑走错可以退回上一步" },
      { icon: "database", title: "本地存档", detail: "棋盘、得分、最高分自动保存在浏览器" },
    ],
    body: `
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
        <p class="hint">提示：合出 <strong>2048</strong> 的方块即为通关 · 进度会自动保存在本地</p>
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
  </main>`,
    css: `
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
}`,
    js: `
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
  showOverlay("本局结束", "得分 " + state.score + " · 最高方块 " + maxTile(), "再来一局");
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
    meta.textContent = "最大 " + rec.max + " · " + formatDate(rec.at);
    var del = document.createElement("button");
    del.className = "rec-del";
    del.type = "button";
    del.title = "删除这条记录";
    del.setAttribute("aria-label", "删除记录");
    del.textContent = "×";
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
`,
  };
}

export const game2048Recipe: Recipe = {
  id: "game-2048",
  label: "2048 游戏",
  keywords: ["2048", "小游戏", "数字合并", "合并方块", "方块游戏", "滑动", "game"],
  build,
};

export default game2048Recipe;
