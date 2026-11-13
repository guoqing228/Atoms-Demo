/**
 * Core domain types shared by the agent runtime, the streaming API,
 * the persistence layer and the UI.
 */

export type FileMap = Record<string, string>;

export interface Theme {
  /** human readable name, e.g. "深海夜色" */
  name: string;
  /** "dark" | "light" — used for preview chrome decisions */
  mode: "dark" | "light";
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  border: string;
  /** CSS font stack keyword for the generated app */
  font: "sans" | "serif" | "mono";
  /** base border radius in px */
  radius: number;
}

export interface PlanFeature {
  /** lucide icon name hint, e.g. "layout", "zap", "database" */
  icon: string;
  title: string;
  detail: string;
}

export interface AppPlan {
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  features: PlanFeature[];
}

export interface GeneratedApp {
  plan: AppPlan;
  theme: Theme;
  /** entry html path inside `files` */
  entry: string;
  files: FileMap;
  /** which mock recipe produced this app (used for deterministic iteration) */
  recipeId?: string;
}

/* ------------------------------------------------------------------ */
/*  Agent streaming protocol (SSE / NDJSON frames)                     */
/* ------------------------------------------------------------------ */

export type AgentEvent =
  /** free-form narration streamed as the agent "thinks" */
  | { type: "log"; text: string }
  /** a unit of work in the run timeline */
  | { type: "step"; id: string; label: string; status: "start" | "done"; detail?: string }
  /** the plan, emitted once before files */
  | { type: "plan"; plan: AppPlan; theme: Theme }
  /** one file written by the agent */
  | { type: "file"; path: string; content: string; action: "write" | "update" }
  /** terminal success frame */
  | { type: "done"; app: GeneratedApp; ms: number; provider: string }
  /** terminal failure frame */
  | { type: "error"; message: string };

export interface GenerateRequest {
  prompt: string;
  mode: "create" | "edit";
  /** existing project state when iterating */
  current?: {
    name: string;
    prompt?: string;
    recipeId?: string;
    files: FileMap;
    plan: AppPlan;
    theme: Theme;
    entry: string;
  } | null;
  /** previous turns, used by real LLM providers for context */
  history?: { role: "user" | "agent"; content: string }[];
  /** per-request provider override (BYOK) */
  provider?: { id: "mock" | "openai" | "anthropic"; apiKey?: string; baseURL?: string; model?: string };
}

/* ------------------------------------------------------------------ */
/*  Persistence entities                                               */
/* ------------------------------------------------------------------ */

export interface Project {
  id: string;
  name: string;
  tagline: string;
  prompt: string;
  plan: AppPlan;
  theme: Theme;
  entry: string;
  files: FileMap;
  provider: string;
  /** account that owns this project (undefined for pre-auth local projects) */
  owner?: string;
  createdAt: number;
  updatedAt: number;
}

export type MessageKind =
  | "text"
  | "plan"
  | "files"
  | "error"
  | "notice"
  | "app";

export interface ChatMessage {
  id: string;
  projectId: string;
  role: "user" | "agent";
  kind: MessageKind;
  content: string;
  /** structured payload for plan/file/error messages */
  meta?: {
    plan?: AppPlan;
    theme?: Theme;
    files?: { path: string; bytes: number; action: "write" | "update" }[];
    steps?: { id: string; label: string; detail?: string }[];
    ms?: number;
    provider?: string;
  };
  createdAt: number;
}

export interface Version {
  id: string;
  projectId: string;
  label: string;
  prompt: string;
  files: FileMap;
  plan: AppPlan;
  theme: Theme;
  entry: string;
  createdAt: number;
}

export interface ConsoleEntry {
  id: string;
  level: "log" | "info" | "warn" | "error" | "debug";
  args: string[];
  at: number;
}
