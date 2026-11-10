import type { AgentEvent, GenerateRequest } from "@/lib/types";

/**
 * A provider is an async generator so the HTTP route can forward frames
 * to the browser the moment they happen (SSE / NDJSON streaming).
 */
export interface AgentProvider {
  id: string;
  label: string;
  generate(req: GenerateRequest): AsyncGenerator<AgentEvent, void, unknown>;
}

export interface ProviderSettings {
  id: "mock" | "openai" | "anthropic";
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

export const DEFAULT_MODELS: Record<string, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-5",
};

export function resolveProviderSettings(req: GenerateRequest): ProviderSettings {
  const requested = req.provider;
  const envDefault = (process.env.DEFAULT_PROVIDER || "mock") as ProviderSettings["id"];
  const id = requested?.id ?? envDefault;
  if (id === "openai") {
    return {
      id,
      apiKey: requested?.apiKey || process.env.OPENAI_API_KEY,
      baseURL: requested?.baseURL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      model: requested?.model || process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
    };
  }
  if (id === "anthropic") {
    return {
      id,
      apiKey: requested?.apiKey || process.env.ANTHROPIC_API_KEY,
      baseURL: requested?.baseURL || process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com",
      model: requested?.model || process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic,
    };
  }
  return { id: "mock" };
}

/** Sleep helper shared by the mock agent's paced streams. */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
