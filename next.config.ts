import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't get confused by the parent
  // directory's lockfile.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
