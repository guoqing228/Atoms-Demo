"use client";

import * as React from "react";
import { toast, Toaster } from "sonner";
import type { AgentEvent, ChatMessage, ConsoleEntry, Project, Version } from "@/lib/types";
import { streamGeneration } from "@/lib/agent-client";
import { getDB } from "@/lib/db";
import { buildStandaloneHtml } from "@/lib/preview";
import { decodeProject, encodeProject, shareUrl } from "@/lib/share";
import { TopBar, type RunStatus } from "./top-bar";
import { Rail } from "./rail";
import { Hero } from "./hero";
import { Chat } from "./chat";
import { PreviewPanel } from "./preview";
import { AboutDialog, DEFAULT_LLM, SettingsDialog, ShareDialog, type LLMSettings } from "./dialogs";
import type { PreviewSignal } from "./preview-frame";
import type { PreviewTab, RunView } from "./types";

const SETTINGS_KEY = "vibeforge:llm";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function emptyRun(prompt: string): RunView {
  return {
    status: "running",
    prompt,
    steps: [],
    logs: [],
    plan: null,
    theme: null,
    files: {},
    writing: null,
  };
}

function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "app";
}

export function Workspace() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [run, setRun] = React.useState<RunView | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [consoleEntries, setConsoleEntries] = React.useState<ConsoleEntry[]>([]);
  const [draft, setDraft] = React.useState("");
  const [tab, setTab] = React.useState<PreviewTab>("preview");
  const [llm, setLlm] = React.useState<LLMSettings>(DEFAULT_LLM);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [shareEncoded, setShareEncoded] = React.useState("");
  const [shareBytes, setShareBytes] = React.useState(0);
  const [booted, setBooted] = React.useState(false);
  const bootRef = React.useRef(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const activeProject = React.useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  const files = React.useMemo(() => {
    if (run && Object.keys(run.files).length > 0) return run.files;
    return activeProject?.files ?? {};
  }, [run, activeProject]);

  const plan = run?.plan ?? activeProject?.plan ?? null;
  const theme = run?.theme ?? activeProject?.theme ?? null;
  const inWorkspace = Boolean(activeId || run);

  const refreshProjects = React.useCallback(async () => {
    try {
      const rows = await getDB().projects.orderBy("updatedAt").reverse().toArray();
      setProjects(rows);
    } catch (err) {
      console.error(err);
      toast.error("读取本地项目失败，浏览器可能禁用了 IndexedDB");
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Boot: settings, projects, share-link import                      */
  /* ---------------------------------------------------------------- */
  React.useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) setLlm({ ...DEFAULT_LLM, ...(JSON.parse(saved) as LLMSettings) });
    } catch {
      /* ignore */
    }

    const boot = async () => {
      await refreshProjects();
      const hash = window.location.hash;
      const match = /share=([^&]+)/.exec(hash);
      if (match) {
        const payload = decodeProject(match[1]);
        if (payload) {
          const imported: Project = {
            id: uid(),
            name: payload.name,
            tagline: payload.tagline,
            prompt: payload.prompt,
            plan: payload.plan,
            theme: payload.theme,
            entry: payload.entry,
            files: payload.files,
            provider: "share",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          // persist immediately so the import survives StrictMode re-runs,
          // reloads, and shows up in the project rail like any other project
          try {
            await getDB().projects.put(imported);
          } catch {
            /* storage unavailable — in-memory import still works */
          }
          setProjects((prev) => [imported, ...prev.filter((p) => p.id !== imported.id)]);
          setActiveId(imported.id);
          setTab("preview");
          toast.success("已导入分享的应用", {
            description: "完整代码已解码并保存到本地，继续对话即可迭代。",
          });
          history.replaceState(null, "", window.location.pathname);
        } else {
          toast.error("分享链接无效或已损坏");
        }
      }
      setBooted(true);
    };
    void boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Generation                                                       */
  /* ---------------------------------------------------------------- */
  const applyEvent = React.useCallback((event: AgentEvent) => {
    setRun((prev) => {
      if (!prev) return prev;
      switch (event.type) {
        case "log":
          return { ...prev, logs: [...prev.logs, { id: uid(), text: event.text }] };
        case "step": {
          const existing = prev.steps.find((s) => s.id === event.id);
          const steps = existing
            ? prev.steps.map((s) =>
                s.id === event.id ? { ...s, status: event.status, detail: event.detail ?? s.detail } : s,
              )
            : [...prev.steps, { id: event.id, label: event.label, status: event.status, detail: event.detail }];
          const writing = event.status === "start" && event.id === "code" ? prev.writing : prev.writing;
          return { ...prev, steps, writing };
        }
        case "plan":
          return { ...prev, plan: event.plan, theme: event.theme };
        case "file":
          return {
            ...prev,
            files: { ...prev.files, [event.path]: event.content },
            writing: event.path,
          };
        case "done":
          return {
            ...prev,
            status: "done",
            files: event.app.files,
            plan: event.app.plan,
            theme: event.app.theme,
            ms: event.ms,
            writing: null,
          };
        case "error":
          return { ...prev, status: "error", error: event.message, writing: null };
        default:
          return prev;
      }
    });
  }, []);

  const persistResult = React.useCallback(
    async (app: Project["files"], event: Extract<AgentEvent, { type: "done" }>, prompt: string, mode: "create" | "edit") => {
      const db = getDB();
      const now = Date.now();
      const planData = event.app.plan;

      const agentMessage: ChatMessage = {
        id: uid(),
        projectId: activeId ?? "pending",
        role: "agent",
        kind: "app",
        content: planData.summary,
        meta: {
          plan: planData,
          theme: event.app.theme,
          ms: event.ms,
          provider: event.provider,
          files: Object.entries(app).map(([path, content]) => ({
            path,
            bytes: new TextEncoder().encode(content).length,
            action: mode === "edit" ? "update" : "write",
          })),
        },
        createdAt: now,
      };

      const userMessage: ChatMessage = {
        id: uid(),
        projectId: activeId ?? "pending",
        role: "user",
        kind: "text",
        content: prompt,
        createdAt: now - 1,
      };

      if (mode === "create" || !activeProject) {
        const project: Project = {
          id: uid(),
          name: planData.name,
          tagline: planData.tagline,
          prompt: prompt,
          plan: planData,
          theme: event.app.theme,
          entry: event.app.entry,
          files: app,
          provider: event.provider,
          createdAt: now,
          updatedAt: now,
        };
        agentMessage.projectId = project.id;
        userMessage.projectId = project.id;
        const version: Version = {
          id: uid(),
          projectId: project.id,
          label: `v1 · ${planData.name}`,
          prompt,
          files: app,
          plan: planData,
          theme: event.app.theme,
          entry: event.app.entry,
          createdAt: now,
        };
        await db.projects.put(project);
        await db.messages.bulkPut([userMessage, agentMessage]);
        await db.versions.put(version);
        setProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
        setActiveId(project.id);
        setMessages([userMessage, agentMessage]);
        setVersions([version]);
        return;
      }

      const project: Project = {
        ...activeProject,
        name: planData.name || activeProject.name,
        tagline: planData.tagline,
        plan: planData,
        theme: event.app.theme,
        entry: event.app.entry,
        files: app,
        updatedAt: now,
      };
      const version: Version = {
        id: uid(),
        projectId: project.id,
        label: `v${versions.length + 1} · ${planData.name}`,
        prompt,
        files: app,
        plan: planData,
        theme: event.app.theme,
        entry: event.app.entry,
        createdAt: now,
      };
      await db.projects.put(project);
      await db.messages.bulkPut([userMessage, agentMessage]);
      await db.versions.put(version);
      setProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
      setMessages((prev) => [...prev, userMessage, agentMessage]);
      setVersions((prev) => [version, ...prev]);
    },
    [activeId, activeProject, versions.length],
  );

  const generate = React.useCallback(
    async (prompt: string, mode: "create" | "edit") => {
      if (busy) return;
      const trimmed = prompt.trim();
      if (!trimmed) return;

      setBusy(true);
      setDraft("");
      setTab("preview");
      setConsoleEntries([]);
      const fresh = emptyRun(trimmed);
      setRun(fresh);

      if (mode === "create") {
        setActiveId(null);
        setMessages([]);
        setVersions([]);
      }

      const current =
        mode === "edit" && activeProject
          ? {
              name: activeProject.name,
              prompt: activeProject.prompt,
              recipeId: undefined,
              files: activeProject.files,
              plan: activeProject.plan,
              theme: activeProject.theme,
              entry: activeProject.entry,
            }
          : null;

      try {
        let finished = false;
        const controller = new AbortController();
        abortRef.current = controller;
        await streamGeneration(
          {
            prompt: trimmed,
            mode,
            current,
            history: messages.slice(-6).map((m) => ({
              role: m.role === "user" ? ("user" as const) : ("agent" as const),
              content: m.content,
            })),
            provider:
              llm.provider === "mock"
                ? { id: "mock" }
                : {
                    id: llm.provider,
                    apiKey: llm.apiKey || undefined,
                    baseURL: llm.baseURL || undefined,
                    model: llm.model || undefined,
                  },
          },
          (event) => {
            if (event.type === "done") {
              finished = true;
              void persistResult(event.app.files, event, trimmed, mode).then(() => {
                toast.success("应用已就绪", { description: event.app.plan.name });
              });
            }
            applyEvent(event);
          },
          controller.signal,
        );
        if (!finished) {
          // the stream closed without a terminal frame
          setRun((prev) => (prev ? { ...prev, status: "error", error: "生成意外中断" } : prev));
        }
      } catch (err) {
        const aborted = abortRef.current?.signal.aborted ?? false;
        if (aborted) {
          setRun((prev) => (prev ? { ...prev, status: "error", error: "已取消生成" } : prev));
          toast.message("已停止生成");
        } else {
          const message = err instanceof Error ? err.message : String(err);
          setRun((prev) => (prev ? { ...prev, status: "error", error: message } : prev));
          toast.error("生成失败", { description: message });
        }
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, activeProject, messages, llm, applyEvent, persistResult],
  );

  const stopGeneration = React.useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const retryGeneration = React.useCallback(
    (prompt: string) => {
      if (!prompt.trim()) return;
      void generate(prompt, activeProject ? "edit" : "create");
    },
    [generate, activeProject],
  );

  /* ---------------------------------------------------------------- */
  /*  Project actions                                                  */
  /* ---------------------------------------------------------------- */
  const newApp = React.useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setVersions([]);
    setRun(null);
    setDraft("");
    setConsoleEntries([]);
    setTab("preview");
  }, []);

  const openProject = React.useCallback(async (project: Project) => {
    setActiveId(project.id);
    setRun(null);
    setConsoleEntries([]);
    setTab("preview");
    try {
      const [msgs, vers] = await Promise.all([
        getDB().messages.where("projectId").equals(project.id).sortBy("createdAt"),
        getDB().versions.where("projectId").equals(project.id).reverse().sortBy("createdAt"),
      ]);
      setMessages(msgs);
      setVersions(vers);
    } catch (err) {
      console.error(err);
      setMessages([]);
      setVersions([]);
    }
  }, []);

  const deleteProject = React.useCallback(
    async (project: Project) => {
      if (!window.confirm(`删除「${project.name}」？该操作不可撤销。`)) return;
      const db = getDB();
      await db.projects.delete(project.id);
      await db.messages.where("projectId").equals(project.id).delete();
      await db.versions.where("projectId").equals(project.id).delete();
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      if (activeId === project.id) newApp();
      toast.success("项目已删除");
    },
    [activeId, newApp],
  );

  const restoreVersion = React.useCallback(
    async (version: Version) => {
      if (!activeProject) return;
      const db = getDB();
      const project: Project = {
        ...activeProject,
        files: version.files,
        plan: version.plan,
        theme: version.theme,
        entry: version.entry,
        updatedAt: Date.now(),
      };
      await db.projects.put(project);
      setProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
      setRun(null);
      const notice: ChatMessage = {
        id: uid(),
        projectId: project.id,
        role: "agent",
        kind: "notice",
        content: `已回滚到版本「${version.label}」，当前预览为该版本的内容。`,
        createdAt: Date.now(),
      };
      await db.messages.put(notice);
      setMessages((prev) => [...prev, notice]);
      toast.success("已回滚版本", { description: version.label });
    },
    [activeProject],
  );

  /* ---------------------------------------------------------------- */
  /*  Export / share                                                   */
  /* ---------------------------------------------------------------- */
  const exportHtml = React.useCallback(() => {
    if (!files["index.html"]) return;
    const title = plan?.name || "app";
    download(`${safeName(title)}.html`, buildStandaloneHtml(files, "index.html"), "text/html");
    toast.success("已下载单文件 HTML");
  }, [files, plan]);

  const exportJson = React.useCallback(() => {
    const payload = {
      name: plan?.name,
      tagline: plan?.tagline,
      prompt: activeProject?.prompt ?? run?.prompt ?? "",
      plan,
      theme,
      entry: activeProject?.entry ?? "index.html",
      files,
    };
    download(`${safeName(plan?.name || "app")}.json`, JSON.stringify(payload, null, 2), "application/json");
    toast.success("已导出项目 JSON");
  }, [plan, theme, files, activeProject, run]);

  const openStandalone = React.useCallback(() => {
    if (!files["index.html"]) return;
    const html = buildStandaloneHtml(files, "index.html");
    const win = window.open("", "_blank");
    if (!win) {
      toast.error("浏览器拦截了新窗口");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }, [files]);

  const openShare = React.useCallback(() => {
    if (!files["index.html"]) {
      toast.error("先生成一个应用");
      return;
    }
    const payload = {
      v: 1 as const,
      name: plan?.name ?? "Untitled app",
      tagline: plan?.tagline ?? "",
      prompt: activeProject?.prompt ?? run?.prompt ?? "",
      plan: plan!,
      theme: theme!,
      entry: activeProject?.entry ?? "index.html",
      files,
    };
    if (!payload.plan || !payload.theme) {
      toast.error("应用数据不完整，无法分享");
      return;
    }
    const encoded = encodeProject(payload);
    setShareEncoded(encoded);
    setShareBytes(encoded.length);
    setShareOpen(true);
  }, [files, plan, theme, activeProject, run]);

  const saveSettings = React.useCallback((next: LLMSettings) => {
    setLlm(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    toast.success(next.provider === "mock" ? "已切换回 Mock Agent" : "已保存模型配置");
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Keyboard                                                         */
  /* ---------------------------------------------------------------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        newApp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [newApp]);

  /* ---------------------------------------------------------------- */
  /*  Console signals from the preview iframe                          */
  /* ---------------------------------------------------------------- */
  const onPreviewSignal = React.useCallback((signal: PreviewSignal) => {
    if (signal.kind === "console") {
      const level = (signal.level ?? "log") as ConsoleEntry["level"];
      setConsoleEntries((prev) =>
        [
          ...prev,
          { id: uid(), level, args: signal.args ?? [], at: Date.now() },
        ].slice(-200),
      );
    } else if (signal.kind === "error") {
      setConsoleEntries((prev) =>
        [
          ...prev,
          {
            id: uid(),
            level: "error" as const,
            args: [
              signal.message ?? "Unknown error",
              signal.line ? `(line ${signal.line})` : "",
            ].filter(Boolean),
            at: Date.now(),
          },
        ].slice(-200),
      );
    }
  }, []);

  const status: RunStatus = run
    ? run.status === "done"
      ? "ready"
      : run.status === "error"
        ? "error"
        : "running"
    : activeProject
      ? "ready"
      : "idle";

  if (!booted) {
    return (
      <div className="grid h-dvh place-items-center bg-bg">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
          <span className="size-1.5 animate-pulse rounded-full bg-lime" />
          loading workspace
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-ink">
      <TopBar
        projectName={plan?.name ?? activeProject?.name ?? null}
        status={status}
        hasProject={Boolean(files["index.html"])}
        onShare={openShare}
        onExport={exportHtml}
        onSettings={() => setSettingsOpen(true)}
        onAbout={() => setAboutOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <Rail
            projects={projects}
            activeId={activeId}
            onNew={newApp}
            onOpen={openProject}
            onDelete={deleteProject}
            onSettings={() => setSettingsOpen(true)}
            onAbout={() => setAboutOpen(true)}
          />
        </div>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
          {!inWorkspace ? (
            <Hero
              onSubmit={(prompt) => void generate(prompt, "create")}
              onStop={stopGeneration}
              running={busy}
            />
          ) : (
            <>
              <Chat
                projectName={plan?.name ?? activeProject?.name ?? null}
                messages={messages}
                run={run && (run.status === "running" || run.status === "error") ? run : null}
                running={busy}
                draft={draft}
                onDraftChange={setDraft}
                onSend={() => void generate(draft, activeProject ? "edit" : "create")}
                onFollowUp={(text) => void generate(text, "edit")}
                onShare={openShare}
                onExport={exportHtml}
                onStop={stopGeneration}
                onRetry={retryGeneration}
              />
              <PreviewPanel
                tab={tab}
                onTabChange={setTab}
                files={files}
                title={plan?.name ?? "app"}
                theme={theme}
                hasProject={Boolean(activeProject)}
                running={busy}
                run={run}
                versions={versions}
                onRestoreVersion={restoreVersion}
                consoleEntries={consoleEntries}
                onClearConsole={() => setConsoleEntries([])}
                onShare={openShare}
                onExportHtml={exportHtml}
                onExportJson={exportJson}
                onOpenStandalone={openStandalone}
                onSignal={onPreviewSignal}
              />
            </>
          )}
        </main>
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        url={shareEncoded ? shareUrl(shareEncoded) : ""}
        payloadBytes={shareBytes}
      />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        value={llm}
        onSave={saveSettings}
      />
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#14161c",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#e8eaf0",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}
