import type { NextConfig } from "next";
import path from "node:path";

// STATIC_EXPORT=1 produces a fully static build (`out/`) for hosts that cannot
// run the Next.js server (Netlify static / GitHub Pages). In that mode the Mock
// Agent runs in the browser instead of the /api/generate route, and the route
// directory is temporarily moved aside by scripts/build-static.mjs.
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStatic
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {
        experimental: {
          serverActions: { bodySizeLimit: "4mb" },
        },
      }),
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Keep Turbopack rooted at this project: the parent directory has its own
  // pnpm workspace file, and without an explicit root Next can resolve
  // node_modules from the wrong place.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
