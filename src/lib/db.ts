import Dexie, { type Table } from "dexie";
import type { ChatMessage, Project, Version } from "./types";

/**
 * Local-first persistence.
 *
 * Everything the user creates lives in IndexedDB: no account, no backend
 * database, no data leaving the browser. That keeps the demo deployable on
 * any static/serverless host and makes "persistence" a property of the
 * product rather than of an infrastructure account.
 */
class VibeForgeDB extends Dexie {
  projects!: Table<Project, string>;
  messages!: Table<ChatMessage, string>;
  versions!: Table<Version, string>;
  settings!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super("vibeforge");
    this.version(1).stores({
      projects: "id, updatedAt, createdAt",
      messages: "id, projectId, createdAt",
      versions: "id, projectId, [projectId+createdAt]",
      settings: "key",
    });
  }
}

let instance: VibeForgeDB | null = null;

export function getDB(): VibeForgeDB {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!instance) instance = new VibeForgeDB();
  return instance;
}
