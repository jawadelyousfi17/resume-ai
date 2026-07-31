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
import { RESUME_EXAMPLES } from "@/lib/content/resume-examples";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { withYear } from "@/lib/seo/year";
import { cn } from "@/lib/utils";

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

  const related = guide.related
    .map(getGuide)
    .filter((item) => item !== undefined);

  const trail = [
    HOME,
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];

  // A template view and a role example for every guide. The example rotates by
  // slug rather than being the same one on all sixteen pages — a link every
  // guide shares is a link none of them recommends.
  const example =
    RESUME_EXAMPLES[
      Math.abs(
        [...guide.slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7),
      ) % RESUME_EXAMPLES.length
    ];
  const practiceLinks = [
    {
      label: "ATS-friendly templates",
      href: "/ats-friendly-resume-templates",
      note: "The single-column layouts that parse cleanly, free to use.",
    },
    {
      label: `${example.role} resume example`,
      href: `/resume-examples/${example.slug}`,
      note: example.description,
    },
    {
      label: "Write a cover letter",
      href: "/cover-letter",
      note: "The four paragraphs that work, and when one is worth writing.",
    },
  ];

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
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              mainEntityOfPage: abs(`/guides/${guide.slug}`),
            },
            faqPage(guide.faqs),
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title={guide.title}
          intro={guide.intro}
          updated={guide.updated}
        />

        {/* The prose keeps a reading measure; the width the page gains goes to
            the rail beside it rather than to longer lines. */}
        <div className="mt-10 lg:flex lg:items-start lg:gap-14">
          <article className="min-w-0 flex-1 space-y-10 lg:max-w-[72ch]">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2
                  id={anchor(section.heading)}
                  className="scroll-mt-24 text-[24px] leading-tight font-extrabold tracking-tight text-ink"
                >
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

          <aside className="mt-12 lg:sticky lg:top-24 lg:mt-1 lg:w-[280px] lg:shrink-0">
            <nav aria-label="On this page" className={cn(panel, "px-5 py-4")}>
              <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                On this page
              </p>
              <ul className="mt-3 space-y-2">
                {guide.sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${anchor(section.heading)}`}
                      className="block text-[14px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {related.length > 0 && (
              <section className="mt-4">
                <p className="px-5 text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                  Read next
                </p>
                <div className="mt-3 space-y-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/guides/${item.slug}`}
                      className={cn(
                        panel,
                        "block px-5 py-4 transition hover:ring-ink/15",
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
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={guide.faqs} />
        </section>

        {/* Guides used to link only sideways, to other guides — so the whole
            /guides subtree pointed at itself and never down into the pages that
            convert. Every guide now reaches a template collection and a role
            example, which is the pass the internal-linking audit asked for. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Put it into practice
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {practiceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(panel, "px-5 py-4 transition hover:ring-ink/15")}
              >
                <span className="block text-[15px] font-extrabold text-ink">
                  {link.label}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                  {link.note}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
