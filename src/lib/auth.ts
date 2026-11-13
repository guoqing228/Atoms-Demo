import { getDB } from "./db";

/**
 * Account layer.
 *
 * Primary path: serverless auth (`/.netlify/functions/auth`, Netlify Blobs) so
 * accounts really exist server-side and passwords are PBKDF2-hashed there.
 * Fallback path: local IndexedDB accounts, used only when the functions are not
 * available (e.g. `pnpm dev` on a machine without Netlify dev).
 */

export type AuthMode = "server" | "local";

export interface Session {
  token: string;
  email: string;
  mode: AuthMode;
}

const SESSION_KEY = "vibeforge:session";
const AUTH_ENDPOINT = "/.netlify/functions/auth";

export const DEMO_EMAIL = "demo@vibeforge.local";
export const DEMO_PASSWORD = "demo123456";

/* ------------------------------------------------------------------ */
/*  storage                                                            */
/* ------------------------------------------------------------------ */
export function saveSession(session: Session): Session {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
  return session;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.token || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  local fallback (dev only)                                          */
/* ------------------------------------------------------------------ */
const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return toHex(buf);
}

async function pbkdf2(password: string, salt: string): Promise<string> {
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 120000, hash: "SHA-256" },
    baseKey,
    256,
  );
  return toHex(new Uint8Array(bits));
}

function validate(email: string, password: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "请输入有效的邮箱地址";
  if (password.length < 6) return "密码至少 6 位";
  if (password.length > 72) return "密码过长";
  return null;
}

const norm = (email: string) => email.trim().toLowerCase();

async function localRegister(email: string, password: string): Promise<Session> {
  const db = getDB();
  const key = norm(email);
  if (await db.users.get(key)) throw new Error("该邮箱已注册，请直接登录");
  const salt = randomHex();
  const hash = await pbkdf2(password, salt);
  await db.users.put({ email: key, salt, hash, createdAt: Date.now() });
  return saveSession({ token: `local-${randomHex(24)}`, email: key, mode: "local" });
}

async function localLogin(email: string, password: string): Promise<Session> {
  const db = getDB();
  const key = norm(email);
  const user = await db.users.get(key);
  if (!user) throw new Error("邮箱或密码错误");
  const hash = await pbkdf2(password, user.salt);
  if (hash !== user.hash) throw new Error("邮箱或密码错误");
  return saveSession({ token: `local-${randomHex(24)}`, email: key, mode: "local" });
}

/* ------------------------------------------------------------------ */
/*  server auth                                                        */
/* ------------------------------------------------------------------ */
async function serverCall(body: Record<string, unknown>): Promise<Response | null> {
  try {
    const res = await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    // 404 → functions are not deployed (local dev without netlify dev)
    if (res.status === 404) return null;
    return res;
  } catch {
    return null;
  }
}

async function serverAuth(
  action: "register" | "login",
  email: string,
  password: string,
): Promise<Session | null> {
  const res = await serverCall({ action, email, password });
  if (!res) return null;
  const data = (await res.json().catch(() => ({}))) as { token?: string; email?: string; error?: string };
  if (!res.ok || !data.token || !data.email) throw new Error(data.error || "操作失败，请稍后重试");
  return saveSession({ token: data.token, email: data.email, mode: "server" });
}

/* ------------------------------------------------------------------ */
/*  public API                                                         */
/* ------------------------------------------------------------------ */
export async function register(email: string, password: string): Promise<Session> {
  const problem = validate(norm(email), password);
  if (problem) throw new Error(problem);
  const server = await serverAuth("register", email, password);
  if (server) return server;
  return localRegister(email, password);
}

export async function login(email: string, password: string): Promise<Session> {
  const problem = validate(norm(email), password);
  if (problem) throw new Error(problem);
  const server = await serverAuth("login", email, password);
  if (server) return server;
  return localLogin(email, password);
}

/** 一键体验：优先登录演示账号，不存在则注册。 */
export async function demoLogin(): Promise<Session> {
  try {
    return await login(DEMO_EMAIL, DEMO_PASSWORD);
  } catch {
    try {
      return await register(DEMO_EMAIL, DEMO_PASSWORD);
    } catch {
      return await login(DEMO_EMAIL, DEMO_PASSWORD);
    }
  }
}

export async function logout(session: Session | null): Promise<void> {
  clearSession();
  if (!session || session.mode !== "server") return;
  try {
    await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ action: "logout" }),
    });
  } catch {
    /* ignore */
  }
}

/** Restore a stored session and verify it when it came from the server. */
export async function restoreSession(): Promise<Session | null> {
  const stored = readStoredSession();
  if (!stored) return null;
  if (stored.mode === "local") return stored;
  try {
    const res = await fetch(`${AUTH_ENDPOINT}?action=me`, {
      headers: { authorization: `Bearer ${stored.token}` },
    });
    if (res.ok) {
      const data = (await res.json()) as { email?: string };
      if (data.email) return saveSession({ ...stored, email: data.email });
    }
  } catch {
    /* network hiccup — keep the optimistic session for static hosting */
    return stored;
  }
  clearSession();
  return null;
}
