"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Loader2, LogIn, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { DEMO_EMAIL, DEMO_PASSWORD, demoLogin, login, register, type Session } from "@/lib/auth";

type Tab = "login" | "register";

export function AuthGate({ onAuthed }: { onAuthed: (session: Session) => void }) {
  const [tab, setTab] = React.useState<Tab>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<"form" | "demo" | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (tab === "register" && password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }
    setBusy("form");
    try {
      const session = tab === "login" ? await login(email, password) : await register(email, password);
      onAuthed(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  };

  const enterDemo = async () => {
    setError(null);
    setBusy("demo");
    try {
      onAuthed(await demoLogin());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-y-auto bg-bg px-5 py-10">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="glow-accent pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[720px] -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
            account
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-popover panel-shadow">
          <div className="flex border-b border-line">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTab(item);
                  setError(null);
                }}
                className={cn(
                  "relative flex-1 px-4 py-3 text-[13.5px] transition-colors",
                  tab === item ? "text-ink" : "text-faint hover:text-dim",
                )}
              >
                {item === "login" ? "登录" : "注册"}
                {tab === item ? (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-lime"
                  />
                ) : null}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3.5 px-5 py-5">
            <div>
              <p className="font-serif text-[24px] leading-tight tracking-[-0.02em] text-ink">
                {tab === "login" ? "欢迎回来" : "创建你的账号"}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-dim">
                {tab === "login"
                  ? "登录后可保存你的应用、版本与迭代记录。"
                  : "注册后项目会按账号保存，换设备登录即可继续。"}
              </p>
            </div>

            <Field
              label="邮箱"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="you@example.com"
              onChange={setEmail}
            />
            <Field
              label="密码"
              type="password"
              value={password}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              placeholder="至少 6 位"
              onChange={setPassword}
            />
            {tab === "register" ? (
              <Field
                label="确认密码"
                type="password"
                value={confirm}
                autoComplete="new-password"
                placeholder="再输入一次"
                onChange={setConfirm}
              />
            ) : null}

            {error ? (
              <p className="rounded-md border border-danger/25 bg-danger/[0.06] px-3 py-2 text-[12px] text-danger">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="h-10 w-full gap-2 text-[13.5px]" disabled={busy !== null}>
              {busy === "form" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : tab === "login" ? (
                <LogIn size={14} />
              ) : (
                <UserPlus size={14} />
              )}
              {tab === "login" ? "登录" : "注册并登录"}
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint/70">
                或
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-full gap-2 text-[13px]"
              onClick={enterDemo}
              disabled={busy !== null}
            >
              {busy === "demo" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-lime" />}
              使用演示账号一键体验
            </Button>
            <p className="text-center font-mono text-[10.5px] text-faint/70">
              {DEMO_EMAIL} · {DEMO_PASSWORD}
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-faint/80">
          密码经 PBKDF2 加盐哈希后存储；注册账户保存在服务端（Netlify Blobs），
          本地开发时降级为浏览器本地账户。
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-lg border border-line-strong bg-white/[0.55] px-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-faint/70 focus:border-accent/50 focus:bg-popover"
      />
    </label>
  );
}
