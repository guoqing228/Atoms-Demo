/**
 * End-to-end test for the real-model provider path, without a real API key.
 *
 * Starts a local fake provider that speaks (a) the OpenAI streaming protocol
 * and (b) the Anthropic streaming protocol, then calls the app's
 * /api/generate endpoint with a per-request provider override and asserts the
 * streamed run produces a valid app.
 *
 * Usage: node scripts/test-real-provider.mjs
 */
import { createServer } from "node:http";

const APP = process.env.BASE_URL || "http://localhost:4311";
const FAKE_PORT = 4399;

const PLAN = {
  name: "Ledger Lite",
  tagline: "本地记账，一眼看清月度开销",
  summary: "记录收支、分类统计、月度汇总，数据保存在浏览器。",
  stack: ["HTML/CSS/JS", "localStorage"],
  features: [
    { icon: "zap", title: "快速记账", detail: "金额 + 分类一步完成" },
    { icon: "chart", title: "月度汇总", detail: "趋势一眼看清" },
  ],
};

const FILES = {
  "index.html": `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Ledger</title><link rel="stylesheet" href="styles.css" /></head>
<body><main class="app"><h1>Ledger</h1><p id="total">总支出 ¥0</p><button id="add">记一笔</button><ul id="list"></ul></main><script src="app.js"></script></body>
</html>`,
  "styles.css": `:root{--bg:#f7f7f5;--surface:#fff;--text:#181816;--muted:#6b6b66;--accent:#2f5d50;--border:rgba(24,24,22,.09);--radius:8px}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,"PingFang SC",sans-serif}
.app{max-width:560px;margin:0 auto;padding:48px 20px}.app h1{font-size:28px;letter-spacing:-.02em;margin:0 0 8px}
#add{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 14px;cursor:pointer}
#list{padding:0;margin:20px 0 0;list-style:none;display:grid;gap:8px}
#list li{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between}`,
  "app.js": `(function () {
"use strict";
var KEY = "vf:ledger:v1";
var items = [];
function load() {
  try { var raw = localStorage.getItem(KEY); if (raw) items = JSON.parse(raw); } catch (e) { items = []; }
  if (!Array.isArray(items) || items.length === 0) {
    items = [ { title: "地铁", amount: 6, cat: "交通" }, { title: "早餐", amount: 12, cat: "餐饮" }, { title: "咖啡", amount: 28, cat: "餐饮" } ];
  }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
function render() {
  var list = document.getElementById("list");
  var total = 0;
  list.innerHTML = "";
  items.forEach(function (item) {
    total += Number(item.amount) || 0;
    var li = document.createElement("li");
    li.innerHTML = "<span>" + item.title + " · " + item.cat + "</span><b>¥" + item.amount + "</b>";
    list.appendChild(li);
  });
  document.getElementById("total").textContent = "总支出 ¥" + total;
}
document.getElementById("add").addEventListener("click", function () {
  items.push({ title: "新开销", amount: 10, cat: "其他" });
  save(); render();
});
load(); render();
})();
`,
};

function protocolReply() {
  let body = `<plan>${JSON.stringify(PLAN)}</plan>\n`;
  for (const [path, content] of Object.entries(FILES)) body += `<file path="${path}">${content}</file>\n`;
  return body;
}

let lastProtocol = null;

const fake = createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    lastProtocol = req.url;
    const body = Buffer.concat(chunks).toString("utf8");
    const text = protocolReply();
    if (req.url.includes("/v1/messages")) {
      // Anthropic streaming protocol
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
      res.write(`event: message_start\ndata: {"type":"message_start"}\n\n`);
      const step = 120;
      for (let i = 0; i < text.length; i += step) {
        res.write(
          `event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":${JSON.stringify(text.slice(i, i + step))}}}\n\n`,
        );
      }
      res.write(`event: message_stop\ndata: {"type":"message_stop"}\n\n`);
      res.end();
    } else {
      // OpenAI-compatible streaming protocol
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
      const step = 120;
      for (let i = 0; i < text.length; i += step) {
        res.write(
          `data: ${JSON.stringify({ choices: [{ delta: { content: text.slice(i, i + step) } }] })}\n\n`,
        );
      }
      res.write("data: [DONE]\n\n");
      res.end();
    }
    void body;
  });
});
await new Promise((resolve) => fake.listen(FAKE_PORT, resolve));
console.log(`fake provider listening on ${FAKE_PORT} (${lastProtocol ?? "waiting"})`);

async function runCase(id, provider) {
  const res = await fetch(`${APP}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "做一个记账应用", mode: "create", provider }),
  });
  const text = await res.text();
  const events = text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const done = events.find((e) => e.type === "done");
  const error = events.find((e) => e.type === "error");
  const plan = events.find((e) => e.type === "plan");
  const fileCount = events.filter((e) => e.type === "file").length;
  const ok = Boolean(done) && !error && done.app.files["app.js"]?.includes("vf:ledger:v1");
  console.log(
    `${ok ? "PASS" : "FAIL"} ${id.padEnd(10)} done=${Boolean(done)} plan=${Boolean(plan)} files=${fileCount}` +
      (error ? ` error=${error.message}` : ""),
  );
  return ok;
}

let failures = 0;
failures += (await runCase("openai", { id: "openai", apiKey: "test-key", baseURL: `http://127.0.0.1:${FAKE_PORT}/v1`, model: "fake" })) ? 0 : 1;
failures += (await runCase("anthropic", { id: "anthropic", apiKey: "test-key", baseURL: `http://127.0.0.1:${FAKE_PORT}`, model: "fake" })) ? 0 : 1;

fake.closeAllConnections?.();
fake.close();
console.log(failures ? `\n${failures} provider case(s) failed` : "\nboth provider protocols passed");
process.exitCode = failures ? 1 : 0;
