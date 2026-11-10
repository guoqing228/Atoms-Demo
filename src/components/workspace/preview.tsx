"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  AppWindow,
  Code2,
  Download,
  ExternalLink,
  FileJson,
  History,
  Monitor,
  MoreHorizontal,
  Share2,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
X,
} from "lucide-react";
import type { ConsoleEntry, FileMap, Theme, Version } from "@/lib/types";
import { buildPreviewDocument } from "@/lib/preview";
import { Button } from "@/components/ui/button";
import { Tip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PreviewTab, RunView } from "./types";
import { PreviewFrame, type Device, type PreviewSignal } from "./preview-frame";
import { CodePane } from "./code-pane";
import { ConsolePane } from "./console-pane";
import { VersionsPane } from "./versions-pane";

const TABS: { id: PreviewTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "preview", label: "预览", icon: AppWindow },
  { id: "code", label: "代码", icon: Code2 },
  { id: "console", label: "控制台", icon: Terminal },
  { id: "versions", label: "版本", icon: History },
];

const DEVICES: { id: Device; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "桌面" },
  { id: "tablet", icon: Tablet, label: "平板" },
  { id: "mobile", icon: Smartphone, label: "手机" },
];

export function PreviewPanel({
  tab,
  onTabChange,
  files,
  title,
  theme,
  hasProject,
  running,
  run,
  versions,
  onRestoreVersion,
  consoleEntries,
  onClearConsole,
  onShare,
  onExportHtml,
  onExportJson,
  onOpenStandalone,
  onSignal,
}: {
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  files: FileMap;
  title: string;
  theme: Theme | null;
  hasProject: boolean;
  running: boolean;
  run: RunView | null;
  versions: Version[];
  onRestoreVersion: (version: Version) => void;
  consoleEntries: ConsoleEntry[];
  onClearConsole: () => void;
  onShare: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
  onOpenStandalone: () => void;
  onSignal: (signal: PreviewSignal) => void;
}) {
  const [device, setDevice] = React.useState<Device>("desktop");
  const [activeFile, setActiveFile] = React.useState("index.html");
  const [menuOpen, setMenuOpen] = React.useState(false);

  const html = React.useMemo(
    () => (files["index.html"] ? buildPreviewDocument(files, "index.html") : ""),
    [files],
  );

  const errorCount = consoleEntries.filter((e) => e.level === "error").length;
  const activeStep = run?.steps.find((s) => s.status === "start");

  React.useEffect(() => {
    if (files[activeFile]) return;
    const first = Object.keys(files)[0];
    if (first) setActiveFile(first);
  }, [files, activeFile]);

  const hasOutput = Boolean(html);

  return (
    <section className="pane flex-1 bg-canvas">
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-line px-2.5">
        <div className="flex items-center gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "relative flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11.5px] transition-colors",
                  active ? "text-ink" : "text-faint hover:text-dim",
                )}
              >
                <Icon size={12} />
                {label}
                {id === "console" && errorCount > 0 ? (
                  <span className="grid size-3.5 place-items-center rounded-full bg-danger/20 font-mono text-[8.5px] text-danger">
                    {errorCount}
                  </span>
                ) : null}
                {id === "versions" && versions.length > 0 ? (
                  <span className="font-mono text-[9px] text-faint/60">{versions.length}</span>
                ) : null}
                {active ? (
                  <motion.span
                    layoutId="preview-tab"
                    className="absolute inset-x-1.5 -bottom-[7px] h-[2px] rounded-full bg-lime"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {tab === "preview" && hasOutput ? (
            <div className="mr-1 hidden items-center rounded-md border border-line bg-ink/[0.02] p-0.5 sm:flex">
              {DEVICES.map(({ id, icon: Icon, label }) => (
                <Tip key={id} label={label}>
                  <button
                    onClick={() => setDevice(id)}
                    className={cn(
                      "grid size-6 place-items-center rounded transition-colors",
                      device === id ? "bg-ink/[0.09] text-ink" : "text-faint hover:text-dim",
                    )}
                    aria-label={label}
                  >
                    <Icon size={12} />
                  </button>
                </Tip>
              ))}
            </div>
          ) : null}

          <Tip label="在新窗口打开">
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={!hasOutput}
              onClick={onOpenStandalone}
              aria-label="在新窗口打开"
            >
              <ExternalLink size={13} />
            </Button>
          </Tip>
          <Tip label="分享应用链接">
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={!hasOutput}
              onClick={onShare}
              aria-label="分享"
            >
              <Share2 size={13} />
            </Button>
          </Tip>
          <div className="relative">
            <Tip label="导出">
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={!hasOutput}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="导出"
              >
                <MoreHorizontal size={14} />
              </Button>
            </Tip>
            {menuOpen && hasOutput ? (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-9 z-40 w-[184px] overflow-hidden rounded-lg border border-line bg-popover py-1 shadow-[0_16px_40px_-20px_rgba(34,31,26,0.3)]"
                >
                  <MenuItem icon={Download} label="下载 HTML" onClick={() => { setMenuOpen(false); onExportHtml(); }} />
                  <MenuItem icon={FileJson} label="导出项目 JSON" onClick={() => { setMenuOpen(false); onExportJson(); }} />
                  <div className="my-1 h-px bg-ink/[0.06]" />
                  <MenuItem icon={X} label="关闭预览" onClick={() => setMenuOpen(false)} />
                </motion.div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-2.5">
        {tab === "preview" ? (
          hasOutput ? (
            <PreviewFrame
              html={html}
              title={title}
              device={device}
              reloadKey={0}
              onSignal={onSignal}
            />
          ) : running ? (
            <BuildSkeleton activeLabel={activeStep?.label} files={files} />
          ) : (
            <EmptyPreview running={running} hasProject={hasProject} />
          )
        ) : null}

        {tab === "code" ? (
          hasOutput ? (
            <CodePane files={files} activePath={activeFile} onSelect={setActiveFile} />
          ) : (
            <EmptyPane
              icon={Code2}
              title="还没有代码"
              description="生成应用后，这里可以浏览 Agent 写出的每一个文件，并一键复制。"
            />
          )
        ) : null}

        {tab === "console" ? (
          <ConsolePane entries={consoleEntries} onClear={onClearConsole} />
        ) : null}

        {tab === "versions" ? (
          <VersionsPane versions={versions} onRestore={onRestoreVersion} />
        ) : null}
      </div>
    </section>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[12px] text-dim transition-colors hover:bg-ink/[0.05] hover:text-ink"
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

function EmptyPreview({ running, hasProject }: { running: boolean; hasProject: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line bg-ink/[0.01]">
      <div className="max-w-[300px] px-6 text-center">
        <div className="mx-auto grid size-11 place-items-center rounded-xl border border-line bg-ink/[0.02]">
          <Sparkles size={16} className="text-faint" />
        </div>
        <p className="mt-3 text-[12.5px] text-dim">
          {running ? "Agent 正在构建…" : hasProject ? "切换到预览" : "预览区空闲"}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-faint/70">
          {running
            ? "生成完成后会自动在这里运行。"
            : "在左侧描述一个应用，Agent 写出的代码会立刻在这里运行，可交互、可刷新。"}
        </p>
      </div>
    </div>
  );
}

function EmptyPane({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line bg-ink/[0.01]">
      <div className="max-w-[280px] px-6 text-center">
        <Icon size={18} className="mx-auto text-faint/50" />
        <p className="mt-3 text-[12.5px] text-dim">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-faint/70">{description}</p>
      </div>
    </div>
  );
}

/** Skeleton shown while the agent is still writing files. */
function BuildSkeleton({ activeLabel, files }: { activeLabel?: string; files: FileMap }) {
  const paths = Object.keys(files);
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl border border-line bg-ink/[0.01] p-3">
      <div className="flex items-center justify-between rounded-lg border border-line bg-popover px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-ping rounded-full bg-lime/40" />
            <span className="relative inline-flex size-2 rounded-full bg-lime" />
          </span>
          <span className="text-[11.5px] text-dim">
            {activeLabel ? `${activeLabel}…` : "Agent 正在组装界面"}
          </span>
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint/60">
          {paths.length} files
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-line bg-panel p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded shimmer" />
          <div className="h-3 w-14 rounded shimmer" />
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-16 shrink-0 rounded-lg shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded shimmer" />
            <div className="h-3 w-1/2 rounded shimmer" />
          </div>
        </div>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-full rounded-md shimmer" style={{ opacity: 1 - i * 0.18 }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {paths.length === 0
          ? ["index.html", "styles.css", "app.js"].map((p) => (
              <div
                key={p}
                className="flex items-center justify-between rounded-md border border-dashed border-line px-2 py-1.5"
              >
                <span className="font-mono text-[9.5px] text-faint/50">{p}</span>
                <span className="font-mono text-[8.5px] text-faint/40">queued</span>
              </div>
            ))
          : paths.map((p) => (
              <div
                key={p}
                className="flex items-center justify-between rounded-md border border-lime/15 bg-lime/[0.04] px-2 py-1.5"
              >
                <span className="truncate font-mono text-[9.5px] text-dim">{p}</span>
                <span className="font-mono text-[8.5px] text-lime/70">written</span>
              </div>
            ))}
      </div>
    </div>
  );
}
