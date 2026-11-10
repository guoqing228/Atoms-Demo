import LZString from "lz-string";
import type { AppPlan, FileMap, Theme } from "./types";

/**
 * Share links encode the whole project (files included) into the URL hash, so
 * a recipient needs no backend, no account and no CDN: opening the link
 * rebuilds the app locally.
 *
 * Two formats are supported:
 *   g1.<base64url(gzip(json))>  — preferred, ~55% smaller (CompressionStream)
 *   l1.<lz-string>              — fallback when CompressionStream is missing
 *   <lz-string>                 — legacy links created before this change
 *
 * A ~6 KB project compresses to ~1.3 KB of URL with gzip.
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

const GZIP_PREFIX = "g1.";
const LZ_PREFIX = "l1.";

/* ------------------------------------------------------------------ */
/*  base64url helpers (btoa/atob are latin1-only, so chunk the bytes)  */
/* ------------------------------------------------------------------ */

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function gzipToBase64Url(text: string): Promise<string | null> {
  if (typeof CompressionStream === "undefined") return null;
  try {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
    const buffer = await new Response(stream).arrayBuffer();
    return bytesToBase64Url(new Uint8Array(buffer));
  } catch {
    return null;
  }
}

async function gunzipFromBase64Url(encoded: string): Promise<string | null> {
  if (typeof DecompressionStream === "undefined") return null;
  try {
    const bytes = base64UrlToBytes(encoded);
    const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("gzip"));
    return await new Response(stream).text();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export async function encodeProject(payload: SharePayload): Promise<string> {
  const json = JSON.stringify(payload);
  const gzipped = await gzipToBase64Url(json);
  if (gzipped) return `${GZIP_PREFIX}${gzipped}`;
  return `${LZ_PREFIX}${LZString.compressToEncodedURIComponent(json)}`;
}

export async function decodeProject(encoded: string): Promise<SharePayload | null> {
  try {
    let json: string | null = null;
    if (encoded.startsWith(GZIP_PREFIX)) {
      json = await gunzipFromBase64Url(encoded.slice(GZIP_PREFIX.length));
    } else if (encoded.startsWith(LZ_PREFIX)) {
      json = LZString.decompressFromEncodedURIComponent(encoded.slice(LZ_PREFIX.length));
    } else {
      // legacy links from before the gzip format existed
      json = LZString.decompressFromEncodedURIComponent(encoded);
    }
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
