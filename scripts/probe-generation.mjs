/**
 * Probe the deployed generation backend (background function + polling).
 * Usage: node scripts/probe-generation.mjs "prompt"
 */
const BASE = process.env.BASE_URL || "https://vibeforge-interview-demo.netlify.app";
const prompt = process.argv[2] || "做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const jobId = `probe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const t0 = Date.now();
const submit = await fetch(`${BASE}/.netlify/functions/generate-background`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jobId, prompt, mode: "create" }),
});
console.log(`submit: HTTP ${submit.status} · job=${jobId} · prompt=${prompt.slice(0, 40)}`);

let cursor = 0;
let finished = false;
while (!finished && Date.now() - t0 < 420_000) {
  await sleep(3000);
  const res = await fetch(`${BASE}/.netlify/functions/poll?job=${jobId}&cursor=${cursor}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    console.log("waiting for job document…");
    continue;
  }
  const data = await res.json();
  for (const event of data.events || []) {
    cursor += 1;
    if (event.type === "log") console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] log: ${event.text}`);
    else if (event.type === "step") console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] step: ${event.label} ${event.status}`);
    else if (event.type === "plan") console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] PLAN: ${event.plan.name} — ${event.plan.tagline}`);
    else if (event.type === "file") console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] FILE: ${event.path} ${(event.content.length / 1024).toFixed(1)}KB`);
    else if (event.type === "done") {
      finished = true;
      const files = event.app.files;
      console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] DONE ms=${event.ms} provider=${event.provider}`);
      const all = Object.values(files).join("\n");
      console.log("  index.html has body:", files["index.html"].includes("<body"));
      console.log("  mentions 开始/结束时间:", /开始时间|结束时间|开始|结束/.test(all));
      console.log("  mentions 冲突:", /冲突|重叠|overlap|conflict/i.test(all));
      console.log("  mentions 会议室:", /会议室|房间|room/i.test(all));
      console.log("  total size:", (all.length / 1024).toFixed(1), "KB");
    } else if (event.type === "error") {
      finished = true;
      console.log("  ERROR:", event.message);
    }
  }
}
console.log(finished ? "probe finished" : "probe timed out");
process.exitCode = finished ? 0 : 1;
