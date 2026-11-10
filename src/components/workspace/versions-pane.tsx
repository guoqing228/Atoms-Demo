"use client";

import * as React from "react";
import { History, GitCompareArrows, RotateCcw } from "lucide-react";
import type { FileMap, Version } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { timeAgo, bytes } from "@/lib/format";
import { collapseContext, diffLines, diffSummary, type DiffLine } from "@/lib/diff";
import { cn } from "@/lib/utils";

export function VersionsPane({
  versions,
  currentFiles,
  onRestore,
}: {
  versions: Version[];
  /** files of the currently open project, used as the "new" side of a diff */
  currentFiles: FileMap;
  onRestore: (version: Version) => void;
}) {
  const [compare, setCompare] = React.useState<Version | null>(null);
  const [activePath, setActivePath] = React.useState("index.html");

  const diff = React.useMemo(() => {
    if (!compare) return null;
    const paths = Array.from(
      new Set([...Object.keys(compare.files), ...Object.keys(currentFiles)]),
    );
    const perFile = paths.map((path) => {
      const lines = collapseContext(diffLines(compare.files[path] ?? "", currentFiles[path] ?? ""));
      return { path, lines, summary: diffSummary(lines) };
    });
    const total = perFile.reduce(
      (acc, file) => ({
        added: acc.added + file.summary.added,
        removed: acc.removed + file.summary.removed,
      }),
      { added: 0, removed: 0 },
    );
    return { perFile, paths, total };
  }, [compare, currentFiles]);

  React.useEffect(() => {
    if (compare && diff && !diff.paths.includes(activePath)) setActivePath(diff.paths[0] ?? "index.html");
  }, [compare, diff, activePath]);

  const activeDiff = diff?.perFile.find((file) => file.path === activePath);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-panel">
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
            <p className="max-w-[260px] text-[11.5px] leading-relaxed text-faint/60">
              每次生成或迭代都会自动保存一个快照，随时可以回滚，也可以和当前版本逐行对比。
            </p>
          </div>
        ) : (
          <ol className="relative space-y-1 pl-3">
            <span className="absolute bottom-2 left-[3px] top-2 w-px bg-ink/10" />
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
                      "absolute -left-3 top-3 size-[7px] rounded-full border-2 border-panel",
                      latest ? "bg-lime" : "bg-ink/25",
                    )}
                  />
                  <div className="group flex items-start justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 transition-colors hover:border-line hover:bg-ink/[0.025]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-lime/80">
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
                      <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setActivePath("index.html");
                            setCompare(version);
                          }}
                        >
                          <GitCompareArrows size={11} />
                          对比
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onRestore(version)}>
                          <RotateCcw size={11} />
                          恢复
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <Dialog open={compare !== null} onOpenChange={(open) => (open ? null : setCompare(null))}>
        <DialogContent
          title={`与当前版本对比 · ${compare?.label ?? ""}`}
          description={
            diff
              ? `相对当前版本：+${diff.total.added} / -${diff.total.removed} 行`
              : "正在计算差异…"
          }
          className="w-[min(820px,calc(100vw-32px))]"
        >
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center gap-1 border-b border-line px-4 py-2">
              {diff?.paths.map((path) => (
                <button
                  key={path}
                  onClick={() => setActivePath(path)}
                  className={cn(
                    "rounded px-2 py-1 font-mono text-[11px] transition-colors",
                    path === activePath ? "bg-ink/[0.07] text-ink" : "text-faint hover:text-dim",
                  )}
                >
                  {path}
                </button>
              ))}
            </div>
            <div className="max-h-[56vh] overflow-auto bg-[#fbf9f4] px-1 py-1">
              {activeDiff?.lines.length ? (
                <pre className="code-pre min-w-max">
                  {activeDiff.lines.map((line, index) => (
                    <DiffRow key={index} line={line} />
                  ))}
                </pre>
              ) : (
                <p className="px-4 py-8 text-center text-[12px] text-faint">
                  该文件在两个版本之间没有变化。
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DiffRow({ line }: { line: DiffLine }) {
  const tone =
    line.type === "add"
      ? "bg-ok/[0.12] text-ok"
      : line.type === "del"
        ? "bg-danger/[0.1] text-danger"
        : "text-dim";
  const marker = line.type === "add" ? "+" : line.type === "del" ? "−" : " ";
  return (
    <div className={cn("flex gap-2 px-2", tone)}>
      <span className="w-3 shrink-0 select-none text-[10px] opacity-60">{marker}</span>
      <span className="w-9 shrink-0 select-none text-right text-[10px] text-faint/40">
        {line.newLine ?? line.oldLine ?? ""}
      </span>
      <span className="whitespace-pre">{line.text || " "}</span>
    </div>
  );
}
