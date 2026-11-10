import type { Recipe, RecipeContext, RecipeOutput } from "./_kit";

/**
 * SaaS landing page — long-form marketing IA: sticky nav, hero with product
 * mock, logo strip, metrics, three alternating feature blocks, pricing with a
 * monthly/annual switch, FAQ accordion, final CTA and a four-column footer.
 * A demo signup dialog persists the reservation to localStorage.
 */
function build(_ctx: RecipeContext): RecipeOutput {
  return {
    name: "Northstar",
    tagline: "站会不用开会，3 分钟异步说完",
    summary:
      "一个完整的 SaaS 落地页：Hero 主视觉、三个特性区块、按月 / 按年切换的定价方案、可展开的常见问题与页脚。点「免费试用」会弹出一个可校验邮箱、并把席位保存在本地的预约表单。",
    features: [
      { icon: "zap", title: "Hero 与产品预览", detail: "大标题、双 CTA、右侧产品界面示意" },
      { icon: "layout", title: "三段特性叙事", detail: "编号 + 图文交替，滚动时轻微淡入" },
      { icon: "filter", title: "定价与常见问题", detail: "月付 / 年付切换，FAQ 手风琴" },
      { icon: "database", title: "可用的预约表单", detail: "邮箱校验、方案选择、本地保存" },
    ],
    body: `
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
        <span class="badge">新 · 支持 Slack 与飞书双向同步</span>
        <h1>把 30 分钟的站会<br /><span class="grad">压缩成 3 分钟的异步消息</span></h1>
        <p class="lede">Northstar 让每个人在自己方便的时候写下进展与卡点，早上自动汇总成一份团队日报。不再抢会议室，也不再等迟到的人。</p>
        <div class="cta-row">
          <button class="btn primary lg" data-open-signup type="button">免费开始 · 无需信用卡</button>
          <a class="btn ghost lg" href="#features">看看怎么用</a>
        </div>
        <p class="trust">已有 <strong>2,400+</strong> 个团队在用 · 平均每周省下 4.6 小时</p>
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
                  <span class="standup-name">林一 · 09:12</span>
                  <span class="standup-line"></span>
                  <span class="standup-line short"></span>
                </div>
                <span class="status done">已完成</span>
              </div>
              <div class="standup-row">
                <span class="avatar">周</span>
                <div class="standup-main">
                  <span class="standup-name">周三 · 09:26</span>
                  <span class="standup-line"></span>
                  <span class="standup-line short"></span>
                </div>
                <span class="status done">已完成</span>
              </div>
              <div class="standup-row">
                <span class="avatar">杨</span>
                <div class="standup-main">
                  <span class="standup-name">杨帆 · 正在写…</span>
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
            <p class="fv-note">合并 14 个 PR · 关闭 9 个议题 · 2 个里程碑按期交付</p>
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
      <span>© 2025 Northstar Labs · 演示站点</span>
      <span>为异步团队而做</span>
    </div>
  </footer>

  <div class="scrim" id="scrim" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-x" id="modal-x" type="button" aria-label="关闭">×</button>
      <div id="modal-body"></div>
    </div>
  </div>`,
    css: `
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
}`,
    js: `
var KEY = "vf:landing:v1";

var PLANS = [
  {
    id: "starter", name: "启动版", monthly: "¥0", annual: "¥0", unit: "/ 永久免费",
    desc: "适合 3 人以内的小团队先把异步站会跑起来",
    feats: ["无限次异步站会", "基础周报汇总", "2 个第三方集成", "保留 30 天历史"],
    cta: "免费开始"
  },
  {
    id: "team", name: "团队版", monthly: "¥49", annual: "¥39", unit: "/ 人 / 月",
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
      note = state.billing === "annual" ? "按年付，每人每月省 ¥10" : "14 天试用，不需要信用卡";
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
  if (state.billing === "annual") noteEl.innerHTML = "按年付款，团队版每人每月 <strong>¥39</strong>（比月付省 20%）。随时可以升级或调整席位。";
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
`,
  };
}

export const landingRecipe: Recipe = {
  id: "landing",
  label: "产品落地页",
  keywords: ["落地页", "landing", "官网", "saas", "hero", "定价", "页脚", "营销页", "产品页"],
  build,
};

export default landingRecipe;
