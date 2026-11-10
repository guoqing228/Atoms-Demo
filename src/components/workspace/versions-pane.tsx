"use client";

import { History, RotateCcw } from "lucide-react";
import type { Version } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { timeAgo, bytes } from "@/lib/format";
import { cn } from "@/lib/utils";

export function VersionsPane({
  versions,
  onRestore,
}: {
  versions: Version[];
  onRestore: (version: Version) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-panel">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-line px-2.5">
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          <History size={10} />
          version timeline
        </span>
        <span className="font-mono text-[10.5px] text-faint/60">{versions.length} snapshots</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {versions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <History size={18} className="text-faint/40" />
            <p className="text-[12.5px] text-faint">还没有版本</p>
            <p className="max-w-[240px] text-[11.5px] leading-relaxed text-faint/60">
              每次生成或迭代都会自动保存一个快照，随时可以回滚到之前的版本。
            </p>
          </div>
        ) : (
          <ol className="relative space-y-1 pl-3">
            <span className="absolute bottom-2 left-[3px] top-2 w-px bg-ink/[0.08]" />
            {versions.map((version, index) => {
              const latest = index === 0;
              const size = Object.values(version.files).reduce(
                (n, c) => n + new TextEncoder().encode(c).length,
                0,
              );
              return (
                <li key={version.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-3 top-3 size-[7px] rounded-full border-2 border-[#0b0c0f]",
                      latest ? "bg-lime" : "bg-ink/25",
                    )}
                  />
                  <div className="group flex items-start justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 transition-colors hover:border-line hover:bg-ink/[0.025]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-lime/80">
                          v{String(versions.length - index).padStart(2, "0")}
                        </span>
                        {latest ? (
                          <span className="rounded border border-lime/25 bg-lime/[0.08] px-1 py-px font-mono text-[9.5px] uppercase text-lime/90">
                            current
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-dim">
                        {version.prompt}
                      </p>
                      <p className="mt-1 font-mono text-[10.5px] text-faint/60">
                        {timeAgo(version.createdAt)} · {Object.keys(version.files).length} files ·{" "}
                        {bytes(size)}
                      </p>
                    </div>
                    {!latest ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => onRestore(version)}
                      >
                        <RotateCcw size={11} />
                        恢复
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
