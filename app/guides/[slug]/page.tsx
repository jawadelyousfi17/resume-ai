import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/content/ContentShell";
import { GuideArticle } from "@/components/content/GuideArticle";
import { guideArt } from "@/lib/content/guide-art";
import { authorFor, readingMinutes } from "@/lib/content/guide-meta";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { RESUME_EXAMPLES } from "@/lib/content/resume-examples";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { withYear } from "@/lib/seo/year";
import { templatesIn } from "@/lib/templates";

/** Section headings double as anchors for the rail beside the article. */
const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Every guide is known at build time, so all of them prerender. */
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) return {};

  const url = `/guides/${guide.slug}`;
  // Titles carry a "{year}" token rather than a typed-in year — see lib/seo/year.ts.
  const title = withYear(guide.metaTitle);
  return {
    title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: guide.description,
      url,
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: guide.description,
    },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const art = guideArt(guide.slug);
  const author = authorFor(guide.slug);
  const minutes = readingMinutes(guide);

  const related = guide.related
    .map(getGuide)
    .filter((item) => item !== undefined);

  const trail = [
    HOME,
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];

  // Eleven guides ask for the "simple" cut, so slicing from the front would
  // show all eleven of them the same six templates. The window starts at a
  // position derived from the slug instead: same category, different six, and
  // stable across builds because it is a hash rather than a shuffle.
  const seed = Math.abs(
    [...guide.slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7),
  );

  // Server-rendered from the same `templatesIn` the collection pages use, so
  // the strip is real HTML with real links rather than a gallery behind a click.
  const pool = guide.templates ? templatesIn(guide.templates.category) : [];
  const templates = pool.length
    ? Array.from(
        { length: Math.min(guide.templates?.count ?? 6, pool.length) },
        (_, i) => pool[(seed + i) % pool.length],
      )
    : [];

  // A role example per guide, rotating for the same reason — a link every
  // guide shares is a link none of them recommends.
  const example = RESUME_EXAMPLES[seed % RESUME_EXAMPLES.length];

  const rail = [
    ...(guide.takeaways ? [{ id: "summary", label: "The short version" }] : []),
    ...guide.sections.map((section) => ({
      id: anchor(section.heading),
      label: section.heading,
    })),
    ...(guide.rewrites ? [{ id: "rewrites", label: "Before and after" }] : []),
    ...(guide.compare ? [{ id: "compare", label: guide.compare.heading }] : []),
    ...(guide.checklist
      ? [{ id: "checklist", label: guide.checklist.heading }]
      : []),
    ...(templates.length > 0 ? [{ id: "templates", label: "Templates" }] : []),
    { id: "faqs", label: "Common questions" },
  ];

  // Three graphs: the article itself, its questions, and where it sits.
  const jsonLd = (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            datePublished: guide.updated,
            dateModified: guide.updated,
            // The byline the page shows. A page that names a writer and a
            // graph that credits the company disagree about who wrote it,
            // and the visible one is the one readers check.
            author: {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role,
            },
            publisher: ORGANIZATION,
            timeRequired: `PT${minutes}M`,
            mainEntityOfPage: abs(`/guides/${guide.slug}`),
          },
          faqPage(guide.faqs),
          breadcrumbList(trail),
        ],
      }}
    />
  );

  return (
    <GuideArticle
      guide={guide}
      jsonLd={jsonLd}
      trail={trail}
      art={art}
      author={author}
      minutes={minutes}
      related={related}
      templates={templates}
      example={example}
      rail={rail}
    />
  );
}
