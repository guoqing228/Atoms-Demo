/**
 * Static export build.
 *
 * Next.js refuses to export statically while an API route exists, so we move
 * `src/app/api` aside for the duration of the build and restore it afterwards.
 * In static mode the Mock Agent runs entirely in the browser (NEXT_PUBLIC_LOCAL_AGENT).
 *
 * Usage: node scripts/build-static.mjs   →  out/
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const stashDir = path.join(root, ".static-build");
const stashApi = path.join(stashDir, "api");
const outDir = path.join(root, "out");

let moved = false;
try {
  if (existsSync(apiDir)) {
    mkdirSync(stashDir, { recursive: true });
    if (existsSync(stashApi)) rmSync(stashApi, { recursive: true, force: true });
    renameSync(apiDir, stashApi);
    moved = true;
    console.log("[static] moved src/app/api aside (static export has no server routes)");
  }

  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  // stale dev-server types would reference the moved route and fail type check
  rmSync(path.join(root, ".next"), { recursive: true, force: true });

  execSync("pnpm exec next build", {
    stdio: "inherit",
    cwd: root,
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_LOCAL_AGENT: "1",
    },
  });

  if (!existsSync(path.join(outDir, "index.html"))) {
    throw new Error("build finished but out/index.html is missing");
  }
  const walk = (dir) => {
    let total = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      total += entry.isDirectory() ? walk(full) : statSync(full).size;
    }
    return total;
  };
  console.log(`[static] done: out/ = ${(walk(outDir) / 1024 / 1024).toFixed(1)} MB`);
} finally {
  if (moved) {
    if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
    renameSync(stashApi, apiDir);
    console.log("[static] restored src/app/api");
  }
}
