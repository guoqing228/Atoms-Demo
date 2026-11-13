/**
 * Benchmark the two Bailian models for a real app-generation prompt.
 * Usage: node scripts/bench-model.mjs
 */
import { SYSTEM_PROMPT, extractJsonObject, normalizeApp } from "../netlify/functions/_lib.mjs";

const KEY = process.env.OPENAI_API_KEY;
const BASE = (process.env.OPENAI_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/+$/, "");
const PROMPT = "做一个会议室预约系统：可以按时间段预约会议室，同一会议室时间冲突时要提示";
const MODELS = ["qwen3.8-flash", "qwen3.8-max-0902"];

for (const model of MODELS) {
  const t0 = Date.now();
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 32000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Build this app:\n${PROMPT}` },
      ],
      response_format: { type: "json_object" },
      enable_thinking: false,
    }),
    signal: AbortSignal.timeout(600000),
  });
  if (!res.ok || !res.body) {
    console.log(`${model} -> HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    continue;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl = buffer.indexOf("\n");
    while (nl >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) {
        const payload = line.slice(5).trim();
        if (payload !== "[DONE]") {
          try {
            const parsed = JSON.parse(payload);
            const d = parsed.choices?.[0]?.delta?.content;
            if (typeof d === "string") content += d;
          } catch {}
        }
      }
      nl = buffer.indexOf("\n");
    }
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  const jsonText = extractJsonObject(content);
  const parsed = jsonText ? JSON.parse(jsonText) : null;
  const app = parsed ? normalizeApp(parsed, PROMPT) : null;
  const all = app ? Object.values(app.files).join("\n") : "";
  console.log(
    `${model}: ${secs}s · chars=${content.length} · json=${Boolean(jsonText)} · app=${Boolean(app)} · ` +
      `size=${(all.length / 1024).toFixed(1)}KB · 会议室=${/会议室|房间/.test(all)} · ` +
      `起止=${/开始时间|结束时间|开始|结束/.test(all)} · 冲突=${/冲突|重叠|overlap|conflict/i.test(all)}`,
  );
  if (app) console.log(`   plan: ${app.plan.name} — ${app.plan.tagline}`);
}
