import type { AgentEvent, AppPlan, ChatMessage, FileMap, Project, Theme, Version } from "@/lib/types";
import { getDB } from "@/lib/db";

/**
 * Persistence layer for the workspace: turns a finished agent run into
 * Project / ChatMessage / Version rows and writes them in one transaction.
 *
 * Kept out of the React component so the data shaping is testable and the
 * workspace only has to deal with UI state.
 */

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export interface PersistGenerationInput {
  mode: "create" | "edit";
  prompt: string;
  app: { plan: AppPlan; theme: Theme; entry: string; files: FileMap };
  /** the done frame (carries duration/provider for the message meta) */
  done: Extract<AgentEvent, { type: "done" }>;
  /** target project when iterating */
  activeProject: Project | null;
  /** 1-based version number for the snapshot label */
  versionNumber: number;
  /** account that owns the project (for per-account project lists) */
  ownerEmail?: string;
}

export interface PersistGenerationOutput {
  project: Project;
  userMessage: ChatMessage;
  agentMessage: ChatMessage;
  version: Version;
}

export async function persistGeneration(
  input: PersistGenerationInput,
): Promise<PersistGenerationOutput> {
  const { mode, prompt, app, done, activeProject, versionNumber } = input;
  const db = getDB();
  const now = Date.now();
  const projectId = mode === "create" || !activeProject ? uid() : activeProject.id;

  const userMessage: ChatMessage = {
    id: uid(),
    projectId,
    role: "user",
    kind: "text",
    content: prompt,
    createdAt: now - 1,
  };

  const agentMessage: ChatMessage = {
    id: uid(),
    projectId,
    role: "agent",
    kind: "app",
    content: app.plan.summary,
    meta: {
      plan: app.plan,
      theme: app.theme,
      ms: done.ms,
      provider: done.provider,
      files: Object.entries(app.files).map(([path, content]) => ({
        path,
        bytes: new TextEncoder().encode(content).length,
        action: mode === "edit" ? ("update" as const) : ("write" as const),
      })),
    },
    createdAt: now,
  };

  const project: Project =
    mode === "create" || !activeProject
      ? {
          id: projectId,
          name: app.plan.name,
          tagline: app.plan.tagline,
          prompt,
          plan: app.plan,
          theme: app.theme,
          entry: app.entry,
          files: app.files,
          provider: done.provider,
          owner: input.ownerEmail,
          createdAt: now,
          updatedAt: now,
        }
      : {
          ...activeProject,
          name: app.plan.name || activeProject.name,
          tagline: app.plan.tagline,
          plan: app.plan,
          theme: app.theme,
          entry: app.entry,
          files: app.files,
          updatedAt: now,
        };

  const version: Version = {
    id: uid(),
    projectId,
    label: `v${versionNumber} · ${app.plan.name}`,
    prompt,
    files: app.files,
    plan: app.plan,
    theme: app.theme,
    entry: app.entry,
    createdAt: now,
  };

  await db.transaction("rw", db.projects, db.messages, db.versions, async () => {
    await db.projects.put(project);
    await db.messages.bulkPut([userMessage, agentMessage]);
    await db.versions.put(version);
  });

  return { project, userMessage, agentMessage, version };
}

export async function deleteProjectData(projectId: string): Promise<void> {
  const db = getDB();
  await db.transaction("rw", db.projects, db.messages, db.versions, async () => {
    await db.projects.delete(projectId);
    await db.messages.where("projectId").equals(projectId).delete();
    await db.versions.where("projectId").equals(projectId).delete();
  });
}

export interface RestoreVersionOutput {
  project: Project;
  notice: ChatMessage;
}

export async function restoreVersionData(
  activeProject: Project,
  version: Version,
): Promise<RestoreVersionOutput> {
  const db = getDB();
  const project: Project = {
    ...activeProject,
    files: version.files,
    plan: version.plan,
    theme: version.theme,
    entry: version.entry,
    updatedAt: Date.now(),
  };
  const notice: ChatMessage = {
    id: uid(),
    projectId: project.id,
    role: "agent",
    kind: "notice",
    content: `已回滚到版本「${version.label}」，当前预览为该版本的内容。`,
    createdAt: Date.now(),
  };
  await db.transaction("rw", db.projects, db.messages, async () => {
    await db.projects.put(project);
    await db.messages.put(notice);
  });
  return { project, notice };
}
