"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import type { FileMap } from "@/lib/types";
import { cn } from "@/lib/utils";
import { bytes, lineCount } from "@/lib/format";

const LANGUAGE: Record<string, string> = {
  html: "markup",
  htm: "markup",
  css: "css",
  js: "javascript",
  mjs: "javascript",
  ts: "typescript",
  json: "json",
  md: "markdown",
  svg: "markup",
};

const EXT_COLOR: Record<string, string> = {
  html: "#ff8a3d",
  css: "#5ad1e6",
  js: "#ffc857",
  json: "#9a8cff",
};

const THEME: PrismTheme = {
  plain: { color: "#c8cdd8", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#5c6373", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#8b93a5" } },
    { types: ["tag", "keyword", "selector"], style: { color: "#ff7ba0" } },
    { types: ["attr-name", "property"], style: { color: "#9a8cff" } },
    { types: ["attr-value", "string", "char"], style: { color: "#c9f158" } },
    { types: ["number", "boolean", "constant"], style: { color: "#ffc857" } },
    { types: ["function", "class-name"], style: { color: "#5ad1e6" } },
    { types: ["operator"], style: { color: "#8b93a5" } },
  ],
};

function langOf(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGE[ext] ?? "markup";
}

export function CodePane({
  files,
  activePath,
  onSelect,
}: {
  files: FileMap;
  activePath: string;
  onSelect: (path: string) => void;
}) {
  const paths = Object.keys(files);
  const content = files[activePath] ?? "";
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-line bg-code text-[#ded6c6]">
      <div className="flex w-[168px] shrink-0 flex-col border-r border-white/10">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/10 px-2.5">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8b8272]">
            files
          </span>
          <span className="font-mono text-[10.5px] text-[#7c7466]">{paths.length}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-1">
          {paths.map((path) => {
            const ext = path.split(".").pop()?.toLowerCase() ?? "";
            const active = path === activePath;
            return (
              <button
                key={path}
                onClick={() => onSelect(path)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
                  active ? "bg-white/[0.09]" : "hover:bg-white/[0.05]",
                )}
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: EXT_COLOR[ext] ?? "#8b93a5" }}
                />
                <span
                  className={cn(
                    "truncate font-mono text-[11.5px]",
                    active ? "text-[#f2ebdb]" : "text-[#a79d8b]",
                  )}
                >
                  {path}
                </span>
              </button>
            );
          })}
        </div>
        <div className="shrink-0 border-t border-white/10 px-2.5 py-2 font-mono text-[10.5px] text-[#7c7466]">
          {lineCount(content)} 行 · {bytes(new TextEncoder().encode(content).length)}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/10 px-3">
          <span className="truncate font-mono text-[11.5px] text-[#c9c0ae]">{activePath}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1 rounded px-1.5 py-1 font-mono text-[10.5px] text-[#a79d8b] transition-colors hover:bg-white/[0.07] hover:text-[#f2ebdb]"
          >
            {copied ? <Check size={10} className="text-ok" /> : <Copy size={10} />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Highlight code={content} language={langOf(activePath)} theme={THEME}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre className="code-pre min-w-max px-3 py-2.5">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="flex">
                    <span className="w-8 shrink-0 select-none pr-3 text-right text-[11px] leading-[1.65] text-faint/40">
                      {i + 1}
                    </span>
                    <span className="whitespace-pre">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
}
