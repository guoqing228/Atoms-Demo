import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * Music player — player IA: now-playing cover + transport controls + seek/volume
 * on the left, playlist rail on the right. No audio files: playback time is
 * simulated, but play/pause, seek, shuffle, repeat, likes, search, add and
 * remove all mutate real state and persist to localStorage.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Tide 播放器",
    tagline: "把播放列表当成一张可以编辑的专集",
    summary:
      "一个音乐播放器界面：封面、播放控制、进度条拖动、音量与随机 / 循环都在左侧，右侧是可搜索、可收藏、可增删的播放列表。没有音频文件，播放进度是模拟的，但所有状态都会保存。",
    features: [
      { icon: "layout", title: "播放器 + 播放列表", detail: "当前曲目与队列分栏，移动端纵向堆叠" },
      { icon: "zap", title: "模拟播放进度", detail: "播放 / 暂停 / 拖动进度 / 自动切下一首" },
      { icon: "filter", title: "收藏与筛选", detail: "点红心收藏，按歌名或歌手搜索" },
      { icon: "database", title: "本地持久化", detail: "当前曲目、进度、音量与收藏都会保留" },
    ],
    body: `
  <main class="app">
    <header class="head">
      <div class="brand">
        <span class="brand-mark">T</span>
        <div>
          <p class="eyebrow">TIDE PLAYER</p>
          <h1>今天听点什么</h1>
        </div>
      </div>
      <span class="badge">演示播放 · 无音频文件</span>
    </header>

    <div class="shell">
      <section class="player" id="player" aria-label="正在播放">
        <div class="cover c0" id="cover">
          <span class="cover-glyph" id="cover-glyph">夜</span>
          <span class="cover-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="cover-caption">TIDE · 2025</span>
        </div>

        <div class="now">
          <div class="now-main">
            <h2 id="now-title">夜航</h2>
            <p id="now-artist">林间电台 · Late Night</p>
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
            <p id="pl-meta">7 首 · 26 分钟</p>
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
  </main>`,
    css: `
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
}`,
    js: `
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
  $("#now-artist").textContent = t.artist + " · " + t.album;
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
          '<span class="track-artist">' + escapeHtml(t.artist) + " · " + escapeHtml(t.album) + "</span>" +
        "</span>" +
        '<span class="track-dur">' + fmtTime(t.duration) + "</span>" +
      "</button>" +
      '<button class="track-like' + (liked ? " is-liked" : "") + '" data-like="' + t.id + '" type="button" aria-label="收藏 ' + escapeHtml(t.title) + '" aria-pressed="' + liked + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3l-1.6-1.4C5.4 14.4 2 11.3 2 7.9 2 5.1 4.2 3 6.9 3c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C17.8 3 20 5.1 20 7.9c0 3.4-3.4 6.5-8.4 11z"/></svg>' +
      "</button>" +
      '<button class="track-del" data-del="' + t.id + '" type="button" aria-label="移除 ' + escapeHtml(t.title) + '">×</button>' +
    "</li>";
  });
  tracksEl.innerHTML = html;
  $("#pl-empty").hidden = shown > 0;
  $("#pl-meta").textContent = state.tracks.length + " 首 · " + Math.round(totalSec / 60) + " 分钟";
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
`,
  };
}

export const musicRecipe: Recipe = {
  id: "music",
  label: "音乐播放器",
  keywords: ["音乐", "播放器", "播放列表", "progress", "music", "player", "歌曲", "专辑", "音轨"],
  build,
};

export default musicRecipe;
