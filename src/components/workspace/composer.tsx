"use client";

import * as React from "react";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/bits";
import { cn } from "@/lib/utils";

export function Composer({
  value,
  onChange,
  onSubmit,
  running = false,
  variant = "hero",
  placeholder = "描述你想要的应用…",
  autoFocus = false,
  intro,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  running?: boolean;
  variant?: "hero" | "chat";
  placeholder?: string;
  autoFocus?: boolean;
  intro?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const hero = variant === "hero";

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, hero ? 180 : 132)}px`;
  }, [hero]);

  React.useEffect(() => {
    resize();
  }, [value, resize]);

  React.useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    if (running || !value.trim()) return;
    onSubmit();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "group relative rounded-2xl border bg-popover/95 transition-[border-color,box-shadow] duration-200",
        hero
          ? "border-line bg-popover panel-shadow focus-within:border-accent/40 focus-within:shadow-[0_0_0_4px_rgba(46,94,76,0.07),0_18px_40px_-26px_rgba(34,31,26,0.3)]"
          : "border-line-strong rounded-xl focus-within:border-accent/35",
      )}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={hero ? 2 : 1}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(
          "block w-full resize-none bg-transparent text-ink outline-none placeholder:text-faint/80",
          hero ? "px-4 pt-3.5 pb-1 text-[14px] leading-relaxed" : "px-3 pt-2.5 pb-1 text-[13px]",
        )}
      />

      <div
        className={cn(
          "flex items-center justify-between gap-2 px-2 pb-2",
          hero ? "pl-2.5" : "pl-1.5",
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-line bg-ink/[0.03] font-mono uppercase tracking-[0.08em] text-faint",
              hero ? "px-2 py-1 text-[9.5px]" : "px-1.5 py-0.5 text-[9px]",
            )}
          >
            <Sparkles size={hero ? 11 : 9} className="text-lime/80" />
            mock agent
          </span>
          {hero ? (
            <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint/60 sm:block">
              无需 API Key
            </span>
          ) : null}
          {intro}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1 text-[10.5px] text-faint/70 sm:flex">
            <Kbd>{hero ? "⌘" : "⏎"}</Kbd>
            <span>{hero ? "↵ 生成" : "发送"}</span>
          </span>
          <Button
            type="submit"
            size={hero ? "md" : "icon-sm"}
            className={cn(hero ? "h-8 gap-1.5 px-3 text-[12px]" : "size-7")}
            disabled={running || !value.trim()}
          >
            {running ? (
              <Loader2 size={hero ? 13 : 12} className="animate-spin" />
            ) : (
              <ArrowUp size={hero ? 13 : 12} />
            )}
            {hero ? <span>生成应用</span> : null}
          </Button>
        </div>
      </div>
    </form>
  );
}
