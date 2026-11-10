"use client";

import * as React from "react";
import { Check, Copy, ExternalLink, Link2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/bits";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Share                                                              */
/* ------------------------------------------------------------------ */

export function ShareDialog({
  open,
  onOpenChange,
  url,
  payloadBytes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  payloadBytes: number;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="分享这个应用"
        description="链接里编码了完整的应用代码与版本信息，打开即可运行 —— 不需要注册、不需要服务器。"
      >
        <div className="space-y-4 px-5 py-4">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-ink/[0.035] px-3 py-2.5">
            <Link2 size={13} className="shrink-0 text-lime/70" />
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-dim">{url}</span>
            <Button size="sm" variant={copied ? "soft" : "primary"} onClick={copy}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "已复制" : "复制链接"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "编码体积", v: `${(payloadBytes / 1024).toFixed(1)} KB` },
              { k: "渲染方式", v: "浏览器本地" },
              { k: "有效期", v: "永久" },
            ].map((item) => (
              <div key={item.k} className="rounded-lg border border-line bg-ink/[0.02] px-2.5 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint/60">
                  {item.k}
                </p>
                <p className="mt-0.5 text-[12px] text-dim">{item.v}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-faint/70">
            提示：分享链接会随项目一起保存本地改动；如果链接过长，可改用「下载 HTML」发送文件。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export interface LLMSettings {
  provider: "mock" | "openai" | "anthropic";
  apiKey: string;
  baseURL: string;
  model: string;
}

export const DEFAULT_LLM: LLMSettings = {
  provider: "mock",
  apiKey: "",
  baseURL: "",
  model: "",
};

const PROVIDERS: { id: LLMSettings["provider"]; label: string; hint: string }[] = [
  { id: "mock", label: "Mock Agent", hint: "内置确定性生成器，无需 Key，秒级返回" },
  { id: "openai", label: "OpenAI 兼容", hint: "任意兼容 /chat/completions 的服务（OpenAI、DeepSeek、硅基流动…）" },
  { id: "anthropic", label: "Anthropic", hint: "Claude 系列，走 /v1/messages 流式接口" },
];

export function SettingsDialog({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: LLMSettings;
  onSave: (settings: LLMSettings) => void;
}) {
  const [draft, setDraft] = React.useState<LLMSettings>(value);
  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="生成引擎"
        description="默认使用内置 Mock Agent，生成的代码完全离线；也可以接入你自己的模型 Key（只保存在本地浏览器）。"
      >
        <div className="space-y-4 px-5 py-4">
          <div className="space-y-1.5">
            {PROVIDERS.map((provider) => {
              const active = draft.provider === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => setDraft({ ...draft, provider: provider.id })}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-lime/35 bg-lime/[0.05]"
                      : "border-line hover:border-line hover:bg-ink/[0.02]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full border",
                      active ? "border-lime bg-lime" : "border-ink/30",
                    )}
                  >
                    {active ? <Check size={8} className="text-white" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-ink">{provider.label}</span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-faint">
                      {provider.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {draft.provider !== "mock" ? (
            <div className="space-y-2.5">
              <Field
                label="API Key"
                placeholder={draft.provider === "openai" ? "sk-…" : "sk-ant-…"}
                value={draft.apiKey}
                onChange={(v) => setDraft({ ...draft, apiKey: v })}
                type="password"
              />
              <Field
                label="Base URL（可选）"
                placeholder={
                  draft.provider === "openai"
                    ? "https://api.openai.com/v1"
                    : "https://api.anthropic.com"
                }
                value={draft.baseURL}
                onChange={(v) => setDraft({ ...draft, baseURL: v })}
              />
              <Field
                label="模型（可选）"
                placeholder={draft.provider === "openai" ? "gpt-4o-mini" : "claude-sonnet-4-5"}
                value={draft.model}
                onChange={(v) => setDraft({ ...draft, model: v })}
              />
              <p className="text-[10.5px] leading-relaxed text-faint/70">
                Key 仅保存在本机 localStorage，并随生成请求发给服务端代理；不会写入分享链接或版本记录。
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-line pt-3">
            <p className="text-[10.5px] text-faint/60">
              <Kbd>⌘K</Kbd> 新建 · <Kbd>⌘↵</Kbd> 发送
            </p>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSave(draft);
                  onOpenChange(false);
                }}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border border-line bg-ink/[0.035] px-2.5 text-[12px] text-ink placeholder:text-faint/50 focus:border-lime/40 focus:outline-none"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

export function AboutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="VibeForge · AI 应用生成工作台"
        description="一个 Atoms 风格的 Demo：自然语言 → 可运行应用。"
      >
        <div className="space-y-4 px-5 py-4">
          <p className="text-[12px] leading-relaxed text-dim">
            Agent 会先拆解需求并输出实施计划，再逐个文件写出可运行的
            HTML / CSS / JS，预览在沙箱 iframe 中实时运行；每次构建自动存档，可回滚、可分享。
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["生成引擎", "Mock Agent（内置）"],
              ["真实模型", "OpenAI / Anthropic（BYOK）"],
              ["持久化", "IndexedDB 本地存储"],
              ["分享", "URL 内编码完整应用"],
              ["预览", "沙箱 iframe + 运行时桥"],
              ["栈", "Next.js · TypeScript · Tailwind"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line bg-ink/[0.02] px-2.5 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint/60">{k}</p>
                <p className="mt-0.5 text-[11.5px] text-dim">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint/60">
              快捷键：⌘K 新建 · ⌘↵ 发送 · Esc 关闭
            </p>
            <a
              href="https://atoms.dev/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-dim hover:text-ink"
            >
              Atoms 参考 <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
