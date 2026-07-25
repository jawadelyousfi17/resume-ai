import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/content/guides";
import { TEMPLATES } from "@/lib/templates";
import { siteOrigin } from "@/lib/site-url";

/** Only the pages worth indexing: the marketing and written content. The
 *  dashboard, the editor and every API route are excluded — they're either
 *  per-user or not pages at all. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();

  const fixed: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/resume-templates", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/guides", priority: 0.8 },
    { path: "/faq", priority: 0.7 },
  ];

  return [
    ...fixed.map((page) => ({
      url: `${origin}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...TEMPLATES.map((template) => ({
      url: `${origin}/resume-templates/${template.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...GUIDES.map((guide) => ({
      url: `${origin}/guides/${guide.slug}`,
      lastModified: new Date(`${guide.updated}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
