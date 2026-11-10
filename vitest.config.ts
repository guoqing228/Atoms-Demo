import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Unit tests cover the pure logic libraries in `src/lib` only — the browser
 * app is exercised by the Playwright scripts in `scripts/` and `e2e/`, so those
 * are explicitly excluded here.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "e2e/**", "scripts/**", "shots/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
