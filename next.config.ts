import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Keep Turbopack rooted at this project: the parent directory has its own
  // pnpm workspace file, and without an explicit root Next can resolve
  // node_modules from the wrong place.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
