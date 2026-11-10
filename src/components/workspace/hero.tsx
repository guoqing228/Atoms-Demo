"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  CheckSquare,
  Columns3,
  Gamepad2,
  NotebookPen,
  Rocket,
  Timer,
  Wallet,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { Composer } from "./composer";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  check: CheckSquare,
  columns: Columns3,
  note: NotebookPen,
  timer: Timer,
  wallet: Wallet,
  game: Gamepad2,
  chart: BarChart3,
  rocket: Rocket,
};

const ACCENTS = ["#2e5e4c", "#b3552f", "#4a6b8a", "#8a6a3a", "#6b4a63", "#3d6b64", "#8a5a3a", "#556b4a"];

export function Hero({
  onSubmit,
  onStop,
  running,
}: {
  onSubmit: (prompt: string) => void;
  onStop?: () => void;
  running?: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="pane relative flex-1 overflow-y-auto">
      {/* backdrop */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="glow-accent pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

      <div className="grain relative mx-auto w-full max-w-[860px] px-6 pb-16 pt-[9vh] sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
            <span className="size-1.5 bg-lime" />
            <span>AI native app studio</span>
            <span className="h-px w-8 bg-ink/15" />
            <span className="text-faint/60">local-first</span>
          </div>

          <h1 className="mt-6 font-serif text-[clamp(36px,4.8vw,58px)] font-normal leading-[1.12] tracking-[-0.02em] text-ink">
            说出你想要的应用，
            <br />
            <span className="text-dim">剩下的交给 Agent</span>
            <span className="text-lime">。</span>
          </h1>

          <p className="mt-5 max-w-[540px] text-[14.5px] leading-relaxed text-dim">
            用一句话描述需求，VibeForge 会拆解需求、设计界面、写出可直接运行的代码，
            并在右侧实时预览。不满意就继续说，每一次迭代都会成为一个可回滚的版本。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <Composer
            variant="hero"
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => {
              if (prompt.trim()) onSubmit(prompt.trim());
            }}
            running={running}
            onStop={onStop}
            autoFocus
            placeholder="例如：做一个记账应用，支持分类统计、月度汇总和趋势图表，界面要清爽…"
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
              从这些开始
            </span>
            <span className="font-mono text-[11px] text-faint/50">08 recipes</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {TEMPLATES.map((tpl, i) => {
              const Icon = ICONS[tpl.icon] ?? Rocket;
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setPrompt(tpl.prompt);
                    onSubmit(tpl.prompt);
                  }}
                  className="group relative overflow-hidden rounded-xl border border-line bg-elev p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 panel-shadow hover:-translate-y-0.5 hover:border-line-strong hover:bg-elev"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid size-8 place-items-center rounded-lg border"
                      style={{
                        borderColor: `${accent}2e`,
                        background: `${accent}0f`,
                        color: accent,
                      }}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="font-mono text-[10.5px] text-faint/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-3 text-[13.5px] font-medium text-ink">{tpl.title}</p>
                  <p className="mt-0.5 truncate text-[11.5px] text-faint">{tpl.desc}</p>
                  <ArrowUpRight
                    size={13}
                    className="absolute bottom-3 right-3 translate-y-1 text-faint opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-faint/70"
        >
          <span className={cn("flex items-center gap-1.5")}>
            <span className="size-1 bg-lime/70" />
            无需注册
          </span>
          <span>数据只存在你的浏览器</span>
          <span>生成即运行</span>
          <span className="ml-auto text-faint/50">mock agent · 秒级生成</span>
        </motion.footer>
      </div>
    </div>
  );
}
