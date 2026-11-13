/**
 * Poll a generation job stored in Netlify Blobs.
 * GET /.netlify/functions/poll?job=<id>&cursor=<n>
 */
import { jobStore, json } from "./_lib.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const job = url.searchParams.get("job");
  const cursor = Number(url.searchParams.get("cursor") || 0);
  if (!job) return json(400, { error: "job is required" });

  const doc = await jobStore().get(`job:${job}`, { type: "json" });
  if (!doc) return json(404, { error: "job not found" });

  const events = Array.isArray(doc.events) ? doc.events : [];
  return json(200, {
    status: doc.status,
    events: events.slice(Math.max(0, cursor)),
    total: events.length,
    updatedAt: doc.updatedAt ?? null,
  });
};
