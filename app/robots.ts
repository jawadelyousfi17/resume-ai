import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();

  return {
    rules: {
      userAgent: "*",
      // /api/avatar is an exception to the /api/ block below: it serves the
      // stand-in portraits inside every template preview, so a crawler that
      // can't fetch it renders those pages with holes in them.
      allow: ["/", "/api/avatar"],
      // Nothing here is secret — these are just per-user or non-HTML, and
      // crawling them wastes budget that should go to the content.
      //
      // /dashboard and /login are deliberately absent: they carry a `noindex`
      // in their own metadata, and a blocked path is a path Google can't fetch
      // and therefore can't read that tag on. A disallowed URL can still be
      // indexed bare from inbound links, which is the outcome noindex prevents
      // and robots.txt cannot.
      disallow: ["/api/", "/resume/", "/auth/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
