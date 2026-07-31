import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/content/guides";
import { RESUME_EXAMPLES } from "@/lib/content/resume-examples";
import { LANDINGS } from "@/lib/content/landings";
import { TEMPLATE_COLLECTIONS } from "@/lib/content/template-collections";
import { TEMPLATES } from "@/lib/templates";
import { siteOrigin } from "@/lib/site-url";

/** Only the pages worth indexing: the marketing and written content. The
 *  dashboard, the editor and every API route are excluded — they're either
 *  per-user or not pages at all. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();

  const fixed: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/resume-examples", priority: 0.9 },
    { path: "/resume-templates", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    // The public cover letter pages. /cover-letters — plural — is the
    // signed-in editor and stays out of the sitemap.
    { path: "/cover-letter", priority: 0.9 },
    { path: "/cover-letter/templates", priority: 0.85 },
    { path: "/cover-letter/examples", priority: 0.85 },
    { path: "/guides", priority: 0.8 },
    { path: "/resume-ats-score", priority: 0.8 },
    { path: "/resume-review", priority: 0.8 },
    { path: "/faq", priority: 0.7 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...fixed.map((page) => ({
      url: `${origin}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...RESUME_EXAMPLES.map((example) => ({
      url: `${origin}/resume-examples/${example.slug}`,
      lastModified: new Date(`${example.updated}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // The collection landings sit above the individual templates: they're the
    // pages carrying the demand, and each one links down into the detail pages.
    ...TEMPLATE_COLLECTIONS.map((collection) => ({
      url: `${origin}/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // The CV vocabulary, ecosystem and AI builder landings.
    ...LANDINGS.map((landing) => ({
      url: `${origin}/${landing.slug}`,
      lastModified: new Date(`${landing.updated}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: `${origin}/cv-examples`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.85 },
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
