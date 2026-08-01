import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright is required at runtime by the local renderer and never bundled:
  // its driver ships as files on disk that a bundler can't trace, and the
  // deployment that calls the standalone renderer doesn't load it at all.
  serverExternalPackages: ["playwright"],
  images: {
    // 75 is the default and what everything photographic uses. 95 exists for
    // the flat vector illustrations on the marketing pages: they are drawn on
    // pure white and set on a pure white page, and at 75 the WebP encoder
    // lands their ground on 254 — a 0.4% step that a lossy encoder considers
    // free and that the eye reads as a faint grey slab with hard edges around
    // every picture. Next 16 requires the allowlist; anything not in it 400s.
    qualities: [75, 95],
  },
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
