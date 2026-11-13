/**
 * Auth function (register / login / logout / me) backed by Netlify Blobs.
 * POST /.netlify/functions/auth   body: { action, email, password }
 * GET  /.netlify/functions/auth?action=me   header: Authorization: Bearer <token>
 */
import { authStore, json, hashPassword, randomSalt, newToken, normEmail, validEmail } from "./_lib.mjs";

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;
const userKey = (email) => `user:${email}`;
const sessionKey = (token) => `session:${token}`;

async function createSession(store, email) {
  const token = newToken();
  await store.setJSON(sessionKey(token), { email, expiresAt: Date.now() + SESSION_TTL });
  return token;
}

async function currentUser(req, store) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  const session = await store.get(sessionKey(token), { type: "json" });
  if (!session || !session.expiresAt || session.expiresAt < Date.now()) return null;
  return { email: session.email, token };
}

export default async (req) => {
  const store = authStore();
  const url = new URL(req.url);

  if (req.method === "GET") {
    const action = url.searchParams.get("action") || "me";
    if (action !== "me") return json(400, { error: "unsupported action" });
    const user = await currentUser(req, store);
    if (!user) return json(401, { error: "未登录或登录已过期" });
    return json(200, { email: user.email });
  }

  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid json body" });
  }

  const action = body?.action;
  const email = normEmail(body?.email);
  const password = String(body?.password ?? "");

  if (action === "logout") {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (token) await store.delete(sessionKey(token));
    return json(200, { ok: true });
  }

  if (action === "me") {
    const user = await currentUser(req, store);
    if (!user) return json(401, { error: "未登录或登录已过期" });
    return json(200, { email: user.email });
  }

  if (!validEmail(email)) return json(400, { error: "请输入有效的邮箱地址" });
  if (password.length < 6) return json(400, { error: "密码至少 6 位" });
  if (password.length > 72) return json(400, { error: "密码过长" });

  if (action === "register") {
    const existing = await store.get(userKey(email), { type: "json" });
    if (existing) return json(409, { error: "该邮箱已注册，请直接登录" });
    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    await store.setJSON(userKey(email), { email, salt, hash, createdAt: Date.now() });
    const token = await createSession(store, email);
    return json(200, { token, email });
  }

  if (action === "login") {
    const user = await store.get(userKey(email), { type: "json" });
    if (!user) return json(401, { error: "邮箱或密码错误" });
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) return json(401, { error: "邮箱或密码错误" });
    const token = await createSession(store, email);
    return json(200, { token, email });
  }

  return json(400, { error: "unsupported action" });
};
