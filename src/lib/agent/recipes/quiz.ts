import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Quiz — 答题测验：题库 → 逐题作答（即时解析）→ 计分结果页 + 错题回顾。
 * 信息架构：分步答题流程（开始 / 作答 / 结果），不是卡片网格。
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Quiz Flow",
    tagline: "8 道题，测测你对 VibeForge 的了解",
    summary:
      "一个选择题测验：从题库逐题作答，选完立即看到对错与解析，全部答完给出得分、正确率和逐题回顾，最高分保存在本地。",
    features: [
      { icon: "list", title: "逐题流程", detail: "一次一题，带进度与当前得分" },
      { icon: "check-circle", title: "即时解析", detail: "选完立刻显示对错和原因" },
      { icon: "award", title: "计分结果", detail: "得分 / 正确率 / 逐题回顾" },
      { icon: "database", title: "最高分记录", detail: "成绩保存在浏览器本地" },
    ],
    body: `
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

    <footer class="foot">VibeForge Mock Agent · 题目来自项目规范 · 成绩仅保存在本地</footer>
  </main>`,
    css: `
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
}`,
    js: `
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
  h += '<span class="start-badge">共 ' + count + " 题 · 单选题 · 立即解析</span>";
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
      h += '<div class="recent-row"><span>' + fmtDate(a.ts) + '</span><span><b>' + a.score + " / " + a.total + "</b> · " + pct + '%</span></div>';
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
    h += '<span class="r-mark">' + (ok ? "✓" : "×") + "</span>";
    h += '<div class="r-body"><p class="r-q">' + (i + 1) + ". " + escapeHtml(q.q) + "</p>";
    h += '<p class="r-a">你的答案 ' + (picked >= 0 ? LETTERS[picked] : "—") + " · 正确答案 " + LETTERS[q.answer] + " · " + escapeHtml(q.options[q.answer]) + "</p></div></li>";
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
`,
  };
}

export const quizRecipe: Recipe = {
  id: "quiz",
  label: "答题测验",
  keywords: ["答题", "测验", "题库", "选择题", "考试", "quiz", "计分", "答题卡"],
  build,
};

export default quizRecipe;
