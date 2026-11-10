import type { FileMap } from "@/lib/types";

/**
 * Turns a multi-file project into a single self-contained HTML document that
 * can be rendered inside a sandboxed iframe (srcdoc).
 *
 * Why not just serve the files? Because the generated apps are not deployed
 * anywhere: inlining keeps the preview instant, offline and dependency-free,
 * and lets us inject a runtime bridge before any user code runs.
 */

export const PREVIEW_SOURCE = "vibeforge-preview";

const RUNTIME_BRIDGE = `<script>
(function () {
  "use strict";
  var post = function (msg) {
    try { parent.postMessage(Object.assign({ source: "${PREVIEW_SOURCE}" }, msg), "*"); } catch (e) {}
  };
  window.addEventListener("error", function (e) {
    post({ kind: "error", message: e.message || "Script error", line: e.lineno, col: e.colno, stack: e.error && e.error.stack });
  });
  window.addEventListener("unhandledrejection", function (e) {
    var reason = e.reason;
    post({ kind: "error", message: "Unhandled rejection: " + (reason && reason.message ? reason.message : String(reason)) });
  });
  ["log", "info", "warn", "error", "debug"].forEach(function (level) {
    var original = console[level] ? console[level].bind(console) : function () {};
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      original.apply(null, args);
      try {
        post({
          kind: "console",
          level: level,
          args: args.map(function (a) {
            if (typeof a === "string") return a;
            try { return JSON.stringify(a); } catch (e) { return String(a); }
          })
        });
      } catch (e) {}
    };
  });
  // localStorage can be unavailable in opaque-origin sandboxes: provide an
  // in-memory fallback so generated apps never crash on storage access.
  try {
    window.localStorage.setItem("__vf_probe__", "1");
    window.localStorage.removeItem("__vf_probe__");
  } catch (e) {
    var memory = {};
    var shim = {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null; },
      setItem: function (k, v) { memory[String(k)] = String(v); },
      removeItem: function (k) { delete memory[k]; },
      clear: function () { memory = {}; },
      key: function (i) { return Object.keys(memory)[i] || null; },
      get length() { return Object.keys(memory).length; }
    };
    try { Object.defineProperty(window, "localStorage", { value: shim, configurable: true }); } catch (e) {}
  }
  post({ kind: "ready" });
})();
</script>`;

function normalizePath(p: string): string {
  return p.replace(/^\.?\//, "").replace(/\\/g, "/");
}

function escapeScript(code: string): string {
  return code.replace(/<\/script/gi, "<\\/script");
}

function inlineCss(files: FileMap, href: string): string | null {
  const key = normalizePath(href.split("?")[0].split("#")[0]);
  const content = files[key];
  // while the agent is still writing files, drop refs that would 404 instead
  // of leaving them to be requested from the dev server.
  if (content == null) return `<style data-vf-pending="${key}"></style>`;
  return `<style data-vf-file="${key}">\n${content}\n</style>`;
}

function inlineJs(files: FileMap, src: string): string | null {
  const key = normalizePath(src.split("?")[0].split("#")[0]);
  const content = files[key];
  if (content == null) return `<script data-vf-pending="${key}"></script>`;
  return `<script data-vf-file="${key}">\n${escapeScript(content)}\n</script>`;
}

/**
 * Build the preview document. Any referenced local file that exists in the
 * project is inlined; unknown external URLs are left untouched (the generated
 * apps are offline-first, so this should be rare).
 */
export function buildPreviewDocument(files: FileMap, entry = "index.html"): string {
  const html = files[normalizePath(entry)] ?? files["index.html"] ?? "";
  let out = html;

  out = out.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (match, href: string) => {
    if (/^(https?:)?\/\//i.test(href) || href.startsWith("data:")) return match;
    if (!/rel=["']?stylesheet/i.test(match)) return match;
    return inlineCss(files, href) ?? match;
  });

  out = out.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (match, _a, src: string) => {
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return match;
    return inlineJs(files, src) ?? match;
  });

  // Asset references that point at files in the project but are not scripts or
  // styles (e.g. an <img src="logo.svg">): keep them intact — the mock apps
  // never depend on external assets.
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>\n${RUNTIME_BRIDGE}`);
  } else {
    out = `${RUNTIME_BRIDGE}\n${out}`;
  }
  return out;
}

/** Flatten a project into one downloadable HTML file. */
export function buildStandaloneHtml(files: FileMap, entry = "index.html"): string {
  return buildPreviewDocument(files, entry).replace(RUNTIME_BRIDGE, "");
}
