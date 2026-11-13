"use client";

import { Download, HelpCircle, LogOut, Settings2, Share2 } from "lucide-react";
import { Logo, LogoMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Tip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type RunStatus = "idle" | "running" | "ready" | "error";

const STATUS_COPY: Record<RunStatus, { label: string; className: string; dot: string }> = {
  idle: { label: "待命", className: "text-faint border-line-strong", dot: "bg-ink/35" },
  running: {
    label: "构建中",
    className: "text-lime border-lime/25 bg-lime/[0.06]",
    dot: "bg-lime animate-pulse",
  },
  ready: { label: "已就绪", className: "text-ok/90 border-ok/25 bg-ok/[0.06]", dot: "bg-ok" },
  error: { label: "异常", className: "text-danger border-danger/25 bg-danger/[0.06]", dot: "bg-danger" },
};

export function TopBar({
  projectName,
  status,
  hasProject,
  userEmail,
  onLogout,
  onShare,
  onExport,
  onSettings,
  onAbout,
}: {
  projectName?: string | null;
  status: RunStatus;
  hasProject: boolean;
  userEmail?: string | null;
  onLogout?: () => void;
  onShare: () => void;
  onExport: () => void;
  onSettings: () => void;
  onAbout: () => void;
}) {
  const chip = STATUS_COPY[status];
  return (
    <header className="relative z-20 flex h-[52px] shrink-0 items-center justify-between border-b border-line bg-bg/85 px-3.5 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <Logo />
        <span className="hidden h-4 w-px bg-ink/10 sm:block" />
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            workspace
          </span>
          <span className="text-faint/60">/</span>
          <span className="max-w-[220px] truncate text-[13.5px] text-dim">
            {projectName || "新应用"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "mr-1 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] md:flex",
            chip.className,
          )}
        >
          <span className={cn("size-1.5 rounded-full", chip.dot)} />
          {chip.label}
        </div>

        <Tip label={hasProject ? "分享应用" : "生成后可分享"}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            disabled={!hasProject}
            aria-label="分享"
          >
            <Share2 size={15} />
          </Button>
        </Tip>
        <Tip label="导出代码">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExport}
            disabled={!hasProject}
            aria-label="导出"
          >
            <Download size={15} />
          </Button>
        </Tip>
        <Tip label="设置">
          <Button variant="ghost" size="icon" onClick={onSettings} aria-label="设置">
            <Settings2 size={15} />
          </Button>
        </Tip>
        <Tip label="关于 / 快捷键">
          <Button variant="ghost" size="icon" onClick={onAbout} aria-label="关于">
            <HelpCircle size={15} />
          </Button>
        </Tip>
        <div className="mx-1.5 h-4 w-px bg-ink/10" />
        {userEmail ? (
          <div className="flex items-center gap-1">
            <Tip label={`已登录：${userEmail}`}>
              <div className="hidden max-w-[160px] items-center gap-1.5 rounded-full border border-line-strong bg-ink/[0.03] px-2.5 py-1 sm:flex">
                <span className="size-1.5 rounded-full bg-ok" />
                <span className="truncate font-mono text-[10.5px] text-dim">{userEmail}</span>
              </div>
            </Tip>
            {onLogout ? (
              <Tip label="退出登录">
                <Button variant="ghost" size="icon" onClick={onLogout} aria-label="退出登录">
                  <LogOut size={15} />
                </Button>
              </Tip>
            ) : null}
          </div>
        ) : (
          <Tip label="本地工作区">
            <div className="grid size-7 place-items-center rounded-full border border-line-strong bg-gradient-to-br from-ink/[0.14] to-ink/[0.03]">
              <LogoMark size={15} className="text-ink/80" />
            </div>
          </Tip>
        )}
      </div>
    </header>
  );
}
