import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is secret — these are just per-user or non-HTML, and
      // crawling them wastes budget that should go to the content.
      disallow: ["/api/", "/dashboard", "/resume/", "/auth/", "/login"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
