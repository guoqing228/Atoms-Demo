import Dexie, { type Table } from "dexie";
import type { ChatMessage, Project, Version } from "./types";

/**
 * Local-first persistence.
 *
 * Project data lives in IndexedDB. Accounts are normally handled server-side
 * (Netlify Blobs); the `users` table is only a fallback for local development
 * where the serverless functions are not running.
 */
export interface LocalUser {
  email: string;
  salt: string;
  hash: string;
  createdAt: number;
}

class VibeForgeDB extends Dexie {
  projects!: Table<Project, string>;
  messages!: Table<ChatMessage, string>;
  versions!: Table<Version, string>;
  settings!: Table<{ key: string; value: unknown }, string>;
  users!: Table<LocalUser, string>;

  constructor() {
    super("vibeforge");
    this.version(1).stores({
      projects: "id, updatedAt, createdAt",
      messages: "id, projectId, createdAt",
      versions: "id, projectId, [projectId+createdAt]",
      settings: "key",
    });
    this.version(2).stores({
      users: "email, createdAt",
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
