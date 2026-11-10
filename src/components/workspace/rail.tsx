"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, Plus, Search, Settings2, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/bits";
import { Tip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { lineCount, timeAgo } from "@/lib/format";

export function Rail({
  projects,
  activeId,
  onNew,
  onOpen,
  onDelete,
  onSettings,
  onAbout,
}: {
  projects: Project[];
  activeId: string | null;
  onNew: () => void;
  onOpen: (project: Project) => void;
  onDelete: (project: Project) => void;
  onSettings: () => void;
  onAbout: () => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q),
    );
  }, [projects, query]);

  return (
    <aside className="flex w-[252px] shrink-0 flex-col border-r border-line bg-panel">
      <div className="p-3">
        <Button
          onClick={onNew}
          variant="outline"
          className="group h-9 w-full justify-between border-dashed border-line px-2.5 text-dim hover:border-lime/40 hover:bg-lime/[0.04] hover:text-ink"
        >
          <span className="flex items-center gap-2">
            <Plus size={14} className="text-lime" />
            <span className="text-[13.5px]">新建应用</span>
          </span>
          <Kbd className="border-line bg-transparent text-[10.5px] text-faint">⌘K</Kbd>
        </Button>

        <div className="relative mt-2.5">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索项目"
            className="h-8 w-full rounded-lg border border-transparent bg-ink/[0.035] pl-8 pr-2 text-[13px] text-ink placeholder:text-faint focus:border-line focus:bg-ink/[0.05] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-1.5 pt-1">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">
          最近项目
        </span>
        <span className="font-mono text-[10.5px] text-faint/60">{filtered.length}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <div className="mx-1 mt-2 rounded-lg border border-dashed border-line px-3 py-6 text-center">
            <p className="text-[12.5px] text-faint">
              {projects.length === 0 ? "还没有项目" : "没有匹配的项目"}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-faint/60">
              {projects.length === 0 ? "生成第一个应用后会自动保存在这里" : "换个关键词试试"}
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            <AnimatePresence initial={false}>
              {filtered.map((project) => {
                const active = project.id === activeId;
                const fileCount = Object.keys(project.files).length;
                return (
                  <motion.li
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpen(project)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onOpen(project);
                        }
                      }}
                      className={cn(
                        "vf-project group relative flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                        active ? "bg-ink/[0.055]" : "hover:bg-ink/[0.035]",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="rail-active"
                          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-lime"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      ) : null}
                      <div
                        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border font-mono text-[11px] uppercase"
                        style={{
                          borderColor: `${project.theme.accent}33`,
                          color: project.theme.accent,
                          background: `${project.theme.accent}12`,
                        }}
                      >
                        {project.plan.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-[13.5px] leading-5",
                            active ? "text-ink" : "text-dim group-hover:text-ink",
                          )}
                        >
                          {project.plan.name || project.name}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-faint/70">
                          {fileCount} 文件 · {lineCount(project.files["app.js"] || "")} 行 ·{" "}
                          {timeAgo(project.updatedAt)}
                        </p>
                      </div>
                      <div className="vf-project-actions flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity">
                        <Tip label="删除项目">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(project);
                            }}
                            aria-label="删除项目"
                            className="rounded p-1 text-faint hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 size={12} />
                          </button>
                        </Tip>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="border-t border-line p-2">
        <button
          onClick={onSettings}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-dim transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <Settings2 size={13} />
          设置
        </button>
        <button
          onClick={onAbout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-dim transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <Info size={13} />
          关于与快捷键
        </button>
        <p className="mt-1.5 px-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint/50">
          v0.1 · local-first · mock agent
        </p>
      </div>
    </aside>
  );
}
