// The body of a template collection page — /ats-friendly-resume-templates and
// its siblings. Server-rendered rather than reusing the client-side gallery:
// the whole point of these URLs is that the filtered set is in the HTML, so
// there is something to crawl.

import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqList,
  JsonLd,
  PageHeader,
  measure,
} from "@/components/content/ContentShell";
import { TemplateCard } from "@/components/content/TemplateCard";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import {
  type TemplateCollection,
  getCollection,
} from "@/lib/content/template-collections";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { templatesIn } from "@/lib/templates";
import { cn } from "@/lib/utils";

/** The metadata for a collection, so each route file stays a few lines. */
export function collectionMetadata(collection: TemplateCollection) {
  const count = templatesIn(collection.category).length;
  const url = `/${collection.slug}`;
  return {
    title: collection.metaTitle(count),
    description: collection.description,
    alternates: { canonical: url },
    openGraph: {
      title: collection.metaTitle(count),
      description: collection.description,
      url,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: collection.metaTitle(count),
      description: collection.description,
    },
  };
}

export function TemplateCollectionPage({
  collection,
}: {
  collection: TemplateCollection;
}) {
  const templates = templatesIn(collection.category);
  const related = collection.related
    .map(getCollection)
    .filter((item) => item !== undefined);

  const trail = [
    HOME,
    { name: "Resume templates", path: "/resume-templates" },
    { name: collection.title, path: `/${collection.slug}` },
  ];

  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: collection.title,
              description: collection.description,
              url: abs(`/${collection.slug}`),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: templates.length,
                itemListElement: templates.map((template, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: `${template.name} resume template`,
                  description: template.description,
                  image: abs(`/templates/${template.id}.png`),
                })),
              },
            },
            faqPage(collection.faqs),
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <PageHeader title={collection.title} intro={collection.intro} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Start your resume
          </Link>
          <Link href="/resume-templates" className={btnQuiet}>
            See all templates
          </Link>
        </div>

        <p className="mt-6 text-[14px] font-semibold text-ink-faint">
          {templates.length} of our templates
          {templates.length === 1 ? " matches" : " match"} this. Every one is
          free to use, with unlimited watermark-free PDF downloads.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {collection.sections.map((section) => (
          <section key={section.heading} className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className={cn(
                  "mt-4 text-[16px] leading-[1.75] text-ink-soft",
                  measure,
                )}
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={collection.faqs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Other collections
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className={cn(
                    panel,
                    "px-5 py-4 transition hover:ring-ink/15",
                  )}
                >
                  <span className="block text-[15px] font-extrabold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
