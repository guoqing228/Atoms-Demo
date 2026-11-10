import LZString from "lz-string";
import type { AppPlan, FileMap, Theme } from "./types";

/**
 * Share links encode the whole project (files included) into the URL hash, so
 * a recipient needs no backend, no account and no CDN: opening the link
 * rebuilds the app locally. A ~6 KB project compresses to ~1.5 KB.
 */

export interface SharePayload {
  v: 1;
  name: string;
  tagline: string;
  prompt: string;
  plan: AppPlan;
  theme: Theme;
  entry: string;
  files: FileMap;
}

export function encodeProject(payload: SharePayload): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeProject(encoded: string): SharePayload | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as SharePayload;
    if (parsed?.v !== 1 || !parsed.files || !parsed.plan) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function shareUrl(encoded: string): string {
  if (typeof window === "undefined") return `#share=${encoded}`;
  const url = new URL(window.location.href);
  url.hash = `share=${encoded}`;
  return url.toString();
}
