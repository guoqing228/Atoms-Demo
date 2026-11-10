"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CircleAlert,
  Database,
  Download,
  Filter,
  Grip,
  LayoutGrid,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import type { RunView } from "./types";
import { Composer } from "./composer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bytes, clock, lineCount } from "@/lib/format";
import { FOLLOW_UPS } from "@/lib/templates";

const FEATURE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  grip: Grip,
  filter: Filter,
  database: Database,
  layout: LayoutGrid,
  sparkles: Sparkles,
  chart: LayoutGrid,
};

function SparkAvatar() {
  return (
    <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-lime/20 bg-lime/[0.08]">
      <Sparkles size={13} className="text-lime" />
    </div>
  );
}

export function Chat({
  projectName,
  messages,
  run,
  running,
  draft,
  onDraftChange,
  onSend,
  onFollowUp,
  onShare,
  onExport,
}: {
  projectName?: string | null;
  messages: ChatMessage[];
  run: RunView | null;
  running: boolean;
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onFollowUp: (text: string) => void;
  onShare: () => void;
  onExport: () => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = React.useState(true);

  const itemCount = messages.length + (run ? 1 : 0);

  React.useEffect(() => {
    if (pinned) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount, run?.logs.length, run?.files, run?.plan, run?.status]);

  return (
    <section className="flex h-[46vh] w-full shrink-0 flex-col border-b border-line bg-panel md:h-auto md:w-[396px] md:border-b-0 md:border-r">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">
            session
          </span>
          <span className="truncate text-[12.5px] text-ink">{projectName || "新的对话"}</span>
        </div>
        {running ? (
          <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-lime">
            <span className="size-1.5 animate-pulse rounded-full bg-lime" />
            generating
          </span>
        ) : (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint/60">
            {messages.length} turns
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        data-testid="chat-messages"
        onScroll={(e) => {
          const el = e.currentTarget;
          setPinned(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
        }}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3.5 py-4"
      >
        {messages.length === 0 && !run ? (
          <div className="pt-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint/60">
              no session yet
            </p>
          </div>
        ) : null}

        {messages.map((message) =>
          message.role === "user" ? (
            <UserBubble key={message.id} text={message.content} at={message.createdAt} />
          ) : message.kind === "app" ? (
            <AppCard
              key={message.id}
              message={message}
              onShare={onShare}
              onExport={onExport}
            />
          ) : message.kind === "error" ? (
            <ErrorCard key={message.id} text={message.content} />
          ) : (
            <div key={message.id} className="flex gap-2.5">
              <SparkAvatar />
              <p className="pt-1 text-[12.5px] leading-relaxed text-dim">{message.content}</p>
            </div>
          ),
        )}

        {run ? <RunPanel run={run} /> : null}
      </div>

      <div className="shrink-0 border-t border-line bg-panel p-2.5">
        {!running && messages.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="flex items-center font-mono text-[9px] uppercase tracking-[0.14em] text-faint/60">
              继续迭代
            </span>
            {FOLLOW_UPS.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onFollowUp(suggestion)}
                className="rounded-full border border-line bg-ink/[0.02] px-2 py-1 text-[10.5px] text-dim transition-colors hover:border-lime/30 hover:bg-lime/[0.06] hover:text-ink"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
        <Composer
          variant="chat"
          value={draft}
          onChange={onDraftChange}
          onSubmit={onSend}
          running={running}
          placeholder={running ? "Agent 正在构建…" : "继续描述你的修改…"}
        />
      </div>
    </section>
  );
}

function UserBubble({ text, at }: { text: string; at: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-end gap-1"
    >
      <div className="max-w-[86%] rounded-2xl rounded-br-md border border-line bg-elev px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink panel-shadow">
        {text}
      </div>
      <span className="pr-1 font-mono text-[9px] text-faint/50">{clock(at)}</span>
    </motion.div>
  );
}

function AppCard({
  message,
  onShare,
  onExport,
}: {
  message: ChatMessage;
  onShare: () => void;
  onExport: () => void;
}) {
  const meta = message.meta;
  const plan = meta?.plan;
  if (!plan) return null;
  const totalBytes = (meta?.files || []).reduce((n, f) => n + f.bytes, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="flex gap-2.5"
    >
      <SparkAvatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="grid size-3.5 place-items-center rounded-full bg-ok/15">
            <Check size={9} className="text-ok" />
          </span>
          <p className="text-[12.5px] text-ink">
            已构建 <span className="font-medium">{plan.name}</span>
          </p>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-dim">{plan.tagline}</p>

        <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-ink/[0.02]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-lime/80">
              实施计划
            </span>
            <span className="font-mono text-[9px] text-faint/60">
              {meta?.ms ? `${(meta.ms / 1000).toFixed(1)}s` : ""}
            </span>
          </div>
          <div className="space-y-2 px-3 py-2.5">
            {plan.features.slice(0, 4).map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
              return (
                <div key={feature.title} className="flex items-start gap-2">
                  <Icon size={12} className="mt-0.5 shrink-0 text-lime/80" />
                  <div className="min-w-0">
                    <p className="text-[11.5px] leading-snug text-ink">{feature.title}</p>
                    <p className="text-[10.5px] leading-snug text-faint">{feature.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-1.5 font-mono text-[9.5px] text-faint/70">
            <span>
              {(meta?.files || []).length} files · {bytes(totalBytes)}
            </span>
            <span>{plan.stack.slice(0, 2).join(" / ")}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <Button size="sm" variant="soft" onClick={onShare}>
            <Share2 size={11} /> 分享
          </Button>
          <Button size="sm" variant="ghost" onClick={onExport}>
            <Download size={11} /> 导出
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ErrorCard({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-danger/25 bg-danger/[0.08]">
        <CircleAlert size={13} className="text-danger" />
      </div>
      <div className="min-w-0 flex-1 rounded-lg border border-danger/20 bg-danger/[0.06] px-3 py-2">
        <p className="text-[12px] leading-relaxed text-danger">{text}</p>
      </div>
    </div>
  );
}

function RunPanel({ run }: { run: RunView }) {
  return (
    <div className="flex gap-2.5">
      <SparkAvatar />
      <div className="min-w-0 flex-1">
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {run.logs.map((log) => (
              <motion.p
                key={log.id}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] leading-relaxed text-dim"
              >
                {log.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {run.plan ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 overflow-hidden rounded-xl border border-line bg-ink/[0.025]"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-lime/80">
                  新应用
                </span>
                <span className="truncate text-[12.5px] font-medium text-ink">
                  {run.plan.name}
                </span>
              </div>
              <span className="rounded border border-line-strong px-1 py-px font-mono text-[8.5px] uppercase text-faint">
                plan
              </span>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[11.5px] leading-relaxed text-dim">{run.plan.tagline}</p>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {run.plan.features.map((feature) => {
                  const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
                  return (
                    <div key={feature.title} className="flex items-start gap-1.5">
                      <Icon size={11} className="mt-0.5 shrink-0 text-lime/70" />
                      <p className="text-[11px] leading-snug text-dim">
                        <span className="text-ink">{feature.title}</span>
                        <span className="text-faint"> · {feature.detail}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}

        {run.steps.length > 0 ? (
          <div className="mt-3 space-y-1.5 border-t border-line pt-2.5">
            {run.steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.status === "done" ? (
                  <Check size={11} className="shrink-0 text-ok" />
                ) : (
                  <span className="relative flex size-[11px] shrink-0 items-center justify-center">
                    <span className="absolute size-[11px] animate-ping rounded-full bg-lime/25" />
                    <span className="size-[5px] rounded-full bg-lime" />
                  </span>
                )}
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.12em]",
                    step.status === "done" ? "text-faint" : "text-ink",
                  )}
                >
                  {step.label}
                </span>
                {step.detail ? (
                  <span className="truncate font-mono text-[9.5px] text-faint/60">
                    {step.detail}
                  </span>
                ) : null}
                {step.status === "start" ? (
                  <span className="ml-auto font-mono text-[9px] text-lime/70">…</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {Object.keys(run.files).length > 0 ? (
          <div className="mt-3 space-y-1">
            {Object.entries(run.files).map(([path, content]) => (
              <div key={path} className="relative overflow-hidden rounded-md bg-ink/[0.02] px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[10px] text-dim">{path}</span>
                  <span className="shrink-0 font-mono text-[9px] text-faint/60">
                    {lineCount(content)} 行 · {bytes(new TextEncoder().encode(content).length)}
                  </span>
                </div>
                {run.writing === path && run.status === "running" ? (
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-lime/[0.12] to-transparent vf-sweep" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {run.status === "error" && run.error ? <ErrorCard text={run.error} /> : null}

        {run.status === "done" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ok/90"
          >
            <Check size={11} />
            构建完成，预览已就绪
            {run.ms ? <span className="font-mono text-[9.5px] text-faint/60">{run.ms}ms</span> : null}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
