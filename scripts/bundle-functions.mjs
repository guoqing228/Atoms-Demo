/**
 * Bundle Netlify functions with esbuild (dependencies inlined).
 *
 * Netlify CLI's own bundler cannot resolve pnpm's symlinked dependencies on
 * Windows, so we pre-bundle every function into a self-contained ESM file and
 * deploy the result from `.netlify-bundle/`.
 */
import { build } from "esbuild";
import { mkdirSync, readdirSync, rmSync } from "node:fs";

const SRC = "netlify/functions";
const OUT = ".netlify-bundle";

const files = readdirSync(SRC).filter((file) => file.endsWith(".mjs") && !file.startsWith("_"));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

await Promise.all(
  files.map((file) =>
    build({
      entryPoints: [`${SRC}/${file}`],
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node22",
      outfile: `${OUT}/${file}`,
      external: ["node:*"],
      logLevel: "warning",
    }),
  ),
);

console.log(`[functions] bundled ${files.length} functions -> ${OUT}/: ${files.join(", ")}`);
