import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright is required at runtime by the local renderer and never bundled:
  // its driver ships as files on disk that a bundler can't trace, and the
  // deployment that calls the standalone renderer doesn't load it at all.
  serverExternalPackages: ["playwright"],
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
  async redirects() {
    return [
      // /templates/{filter} are real pages; the bare parent is the gallery,
      // which has always lived at /resume-templates.
      { source: "/templates", destination: "/resume-templates", permanent: true },
    ];
  },
};

export default nextConfig;
