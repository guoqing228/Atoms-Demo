import type { AgentEvent } from "@/lib/types";
import type { RunView } from "./types";

/** Pure state machine for an in-flight agent run. */
export function emptyRun(prompt: string): RunView {
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

export function reduceRunEvent(prev: RunView | null, event: AgentEvent): RunView | null {
  if (!prev) return prev;
  switch (event.type) {
    case "log":
      return { ...prev, logs: [...prev.logs, { id: `${event.text.length}-${prev.logs.length}`, text: event.text }] };
    case "step": {
      const existing = prev.steps.find((s) => s.id === event.id);
      const steps = existing
        ? prev.steps.map((s) =>
            s.id === event.id ? { ...s, status: event.status, detail: event.detail ?? s.detail } : s,
          )
        : [...prev.steps, { id: event.id, label: event.label, status: event.status, detail: event.detail }];
      return { ...prev, steps };
    }
    case "plan":
      return { ...prev, plan: event.plan, theme: event.theme };
    case "file":
      return { ...prev, files: { ...prev.files, [event.path]: event.content }, writing: event.path };
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
}
