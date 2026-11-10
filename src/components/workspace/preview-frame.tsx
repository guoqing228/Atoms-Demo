"use client";

import * as React from "react";
import { Lock, RefreshCw } from "lucide-react";
import { PREVIEW_SOURCE } from "@/lib/preview";
import { cn } from "@/lib/utils";

export type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

export interface PreviewSignal {
  kind: "console" | "error" | "ready";
  level?: string;
  message?: string;
  args?: string[];
  line?: number;
}

/**
 * Sandboxed renderer for a generated app.
 *
 * The generated code lives in an iframe (`srcdoc`, opaque sandbox with
 * scripts enabled). A tiny bridge injected by `buildPreviewDocument` posts
 * console output and runtime errors back to the workspace, where they show up
 * in the Console tab — this is what makes agent iteration debuggable.
 */
export function PreviewFrame({
  html,
  title,
  device,
  reloadKey,
  onSignal,
}: {
  html: string;
  title: string;
  device: Device;
  reloadKey: number;
  onSignal: (signal: PreviewSignal) => void;
}) {
  const [ready, setReady] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setReady(false);
    setKey((k) => k + 1);
  }, [html, reloadKey]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { source?: string } & PreviewSignal;
      if (!data || data.source !== PREVIEW_SOURCE) return;
      if (data.kind === "ready") {
        setReady(true);
        return;
      }
      onSignal(data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onSignal]);

  const slug = React.useMemo(
    () =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 28) || "app",
    [title],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-[0_18px_40px_-24px_rgba(34,31,26,0.35)]">
      {/* browser chrome */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-line px-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f57]/70" />
          <span className="size-2 rounded-full bg-[#febc2e]/70" />
          <span className="size-2 rounded-full bg-[#28c840]/70" />
        </div>
        <div className="mx-auto flex h-5.5 w-[min(420px,60%)] items-center gap-1.5 rounded-full border border-line bg-ink/[0.035] px-2.5">
          <Lock size={8} className="text-ok/80" />
          <span className="truncate font-mono text-[10.5px] text-faint">
            {slug}.vibeforge.app
          </span>
          {!ready ? (
            <span className="ml-auto h-1 w-8 overflow-hidden rounded-full bg-ink/10">
              <span className="block h-full w-1/2 animate-pulse bg-lime/60" />
            </span>
          ) : (
            <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.1em] text-ok/60">
              live
            </span>
          )}
        </div>
        <div className="flex w-14 items-center justify-end gap-1">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="rounded p-1 text-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
            aria-label="刷新预览"
            title="刷新预览"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* viewport */}
      <div className="flex min-h-0 flex-1 justify-center overflow-hidden bg-canvas p-2.5">
        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden bg-white transition-[width,border-radius] duration-300",
            device !== "desktop" &&
              "my-1 rounded-lg border border-line shadow-[0_0_0_8px_#e7e0d2]",
          )}
          style={{ width: DEVICE_WIDTH[device] }}
        >
          <iframe
            key={key}
            title="应用预览"
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            className="h-full w-full flex-1 border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
