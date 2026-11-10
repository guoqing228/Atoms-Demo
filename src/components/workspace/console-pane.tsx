"use client";

import * as React from "react";
import { Eraser, Terminal } from "lucide-react";
import type { ConsoleEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { clock } from "@/lib/format";

const LEVEL_STYLE: Record<ConsoleEntry["level"], string> = {
  error: "text-danger border-danger/25 bg-danger/[0.07]",
  warn: "text-warn border-warn/25 bg-warn/[0.07]",
  info: "text-cyan border-cyan/25 bg-cyan/[0.07]",
  debug: "text-violet border-violet/25 bg-violet/[0.07]",
  log: "text-dim border-line-strong bg-ink/[0.03]",
};

export function ConsolePane({
  entries,
  onClear,
}: {
  entries: ConsoleEntry[];
  onClear: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(entries.length);

  React.useEffect(() => {
    if (entries.length !== count) {
      setCount(entries.length);
      const el = ref.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-panel">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-line px-2.5">
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          <Terminal size={10} />
          runtime console
          <span className="text-faint/50">({entries.length})</span>
        </span>
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded px-1.5 py-1 font-mono text-[10.5px] text-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
        >
          <Eraser size={10} />
          清空
        </button>
      </div>

      <div ref={ref} className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {entries.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Terminal size={18} className="text-faint/40" />
            <p className="text-[12.5px] text-faint">还没有运行时日志</p>
            <p className="max-w-[240px] text-[11.5px] leading-relaxed text-faint/60">
              生成应用后，这里会实时显示它的 console 输出和未捕获错误，方便你直接让 Agent 修复。
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-2 rounded px-1.5 py-1 font-mono text-[11.5px] leading-relaxed hover:bg-ink/[0.02]"
              >
                <span className="shrink-0 pt-px text-[10.5px] text-faint/40">{clock(entry.at)}</span>
                <span
                  className={cn(
                    "mt-px shrink-0 rounded border px-1 text-[10.5px] uppercase leading-[14px]",
                    LEVEL_STYLE[entry.level],
                  )}
                >
                  {entry.level}
                </span>
                <span className="min-w-0 whitespace-pre-wrap break-words text-dim">
                  {entry.args.join(" ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
