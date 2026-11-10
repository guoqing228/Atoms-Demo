import type { AppPlan, FileMap, Theme } from "@/lib/types";

export interface StepView {
  id: string;
  label: string;
  status: "start" | "done";
  detail?: string;
}

export interface LogView {
  id: string;
  text: string;
}

export interface RunView {
  status: "running" | "done" | "error";
  prompt: string;
  steps: StepView[];
  logs: LogView[];
  plan: AppPlan | null;
  theme: Theme | null;
  files: FileMap;
  writing: string | null;
  error?: string;
  ms?: number;
  provider?: string;
}

export type PreviewTab = "preview" | "code" | "console" | "versions";
