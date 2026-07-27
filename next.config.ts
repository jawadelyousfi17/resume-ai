import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Every page behind the sidebar is dynamic (it reads the session), and
    // dynamic segments aren't cached client-side by default — so moving
    // between Resumes, Cover Letters and the Tracker refetched all of it every
    // time. Two minutes is long enough that a round trip feels instant and
    // short enough that a resume saved in another tab still shows up.
    staleTimes: {
      dynamic: 120,
      static: 300,
    },
  },
  // Pin the workspace root so Turbopack doesn't get confused by the parent
  // directory's lockfile.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
