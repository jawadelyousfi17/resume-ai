import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqList,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { panel } from "@/components/landing/ui";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { cn } from "@/lib/utils";

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
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: guide.metaTitle,
      description: guide.description,
      url,
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.description,
    },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map(getGuide)
    .filter((item) => item !== undefined);

  return (
    <ContentPage>
      {/* Three graphs: the article itself, its questions, and where it sits. */}
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
              author: { "@type": "Organization", name: "resumeai" },
              publisher: { "@type": "Organization", name: "resumeai" },
              mainEntityOfPage: `/guides/${guide.slug}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: guide.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Guides",
                  item: "/guides",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: guide.title,
                  item: `/guides/${guide.slug}`,
                },
              ],
            },
          ],
        }}
      />

      <Column>
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: guide.title },
          ]}
        />

        <PageHeader
          eyebrow={guide.eyebrow}
          title={guide.title}
          intro={guide.intro}
          updated={guide.updated}
        />

        <article className="mt-10 space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-[16px] leading-[1.75] text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[16px] leading-[1.7] text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={guide.faqs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Read next
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/guides/${item.slug}`}
                  className={cn(
                    panel,
                    "px-5 py-4 transition hover:ring-ink/15",
                  )}
                >
                  <span className="block text-[15.5px] font-extrabold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
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
