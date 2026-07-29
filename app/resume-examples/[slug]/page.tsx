import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Column,
  ContentCta,
  ContentPage,
  FaqList,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { getGuide } from "@/lib/content/guides";
import {
  RESUME_EXAMPLES,
  getExample,
  toResumeData,
} from "@/lib/content/resume-examples";
import { getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

/** Section headings double as anchors for the rail beside the article. */
const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Every example is known at build time, so all of them prerender. */
export function generateStaticParams() {
  return RESUME_EXAMPLES.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata(
  props: PageProps<"/resume-examples/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const example = getExample(slug);
  if (!example) return {};

  const url = `/resume-examples/${example.slug}`;
  return {
    title: example.metaTitle,
    description: example.description,
    // The alternate titles are the same job under a different name, which is
    // what people actually search. They belong in the keywords rather than
    // stuffed into the copy, where they'd read as padding.
    keywords: [
      `${example.role} resume`,
      `${example.role} resume example`,
      `${example.role} resume template`,
      ...example.aka.map((title) => `${title} resume`),
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: example.metaTitle,
      description: example.description,
      url,
      publishedTime: example.updated,
      modifiedTime: example.updated,
    },
    twitter: {
      card: "summary_large_image",
      title: example.metaTitle,
      description: example.description,
    },
  };
}

export default async function ResumeExamplePage(
  props: PageProps<"/resume-examples/[slug]">,
) {
  const { slug } = await props.params;
  const example = getExample(slug);
  if (!example) notFound();

  const resume = toResumeData(example);
  const template = getTemplate(example.template);

  const related = example.related
    .map(getExample)
    .filter((item) => item !== undefined);
  const guides = example.guides
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
              headline: `${example.role} resume example`,
              description: example.description,
              datePublished: example.updated,
              dateModified: example.updated,
              author: { "@type": "Organization", name: "meniacv" },
              publisher: { "@type": "Organization", name: "meniacv" },
              mainEntityOfPage: `/resume-examples/${example.slug}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: example.faqs.map((faq) => ({
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
                  name: "Resume examples",
                  item: "/resume-examples",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${example.role} resume example`,
                  item: `/resume-examples/${example.slug}`,
                },
              ],
            },
          ],
        }}
      />

      <Column>
        <PageHeader
          title={`${example.role} resume example`}
          intro={example.intro}
          updated={example.updated}
        />

        <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-ink-faint">
          Also written as{" "}
          {example.aka.map((title, i) => (
            <span key={title}>
              {i > 0 && (i === example.aka.length - 1 ? " and " : ", ")}
              <span className="font-semibold text-ink-soft">{title}</span>
            </span>
          ))}
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Build this resume
          </Link>
          <Link href="/resume-ats-score" className={btnQuiet}>
            Check your ATS score
          </Link>
        </div>

        {/* What a hiring manager scans for, before any of the writing advice.
            It's the fastest thing on the page to act on. */}
        <section className={cn(panel, "mt-10 px-6 py-5")}>
          <h2 className="text-[17px] font-extrabold text-ink">
            What hiring managers look for first
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {example.looksFor.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* The live render, not a picture of one: the same <ResumePreview> the
            editor and the PDF export use, so the example can't drift from what
            the product actually produces. */}
        <section className="mt-14">
          <h2
            id="example"
            className="scroll-mt-24 text-[24px] leading-tight font-extrabold tracking-tight text-ink"
          >
            A full {example.role.toLowerCase()} resume
          </h2>
          <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
            Every figure below is invented, but the shape is the point: each
            bullet names what was owned, what changed, and the number that
            moved. It&rsquo;s laid out in the{" "}
            <Link
              href={`/resume-templates/${template.id}`}
              className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {template.name}
            </Link>{" "}
            template — switching template re-renders the same content rather
            than starting it over.
          </p>

          <div className="mt-8 flex justify-center">
            <div
              className="resume-page overflow-hidden rounded-xl bg-white shadow-[var(--shadow-paper)] ring-1 ring-black/5"
              style={{ width: PAGE_SIZES.A4.width, maxWidth: "100%" }}
            >
              <ResumePreview data={resume} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className={btnPrimary}>
              Start from this example
            </Link>
            <Link href="/resume-templates" className={btnQuiet}>
              Browse all templates
            </Link>
          </div>
        </section>

        {/* The prose keeps a reading measure; the width the page gains goes to
            the rail beside it rather than to longer lines. */}
        <div className="mt-16 lg:flex lg:items-start lg:gap-14">
          <article className="min-w-0 flex-1 space-y-10 lg:max-w-[72ch]">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              How to write it
            </h2>

            {example.sections.map((section) => (
              <section key={section.heading}>
                <h3
                  id={anchor(section.heading)}
                  className="scroll-mt-24 text-[20px] leading-tight font-extrabold tracking-tight text-ink"
                >
                  {section.heading}
                </h3>
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
                <li>
                  <a
                    href="#example"
                    className="block text-[14px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                  >
                    The full example
                  </a>
                </li>
                {example.sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${anchor(section.heading)}`}
                      className="block text-[14px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#keywords"
                    className="block text-[14px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                  >
                    Skills &amp; ATS keywords
                  </a>
                </li>
                <li>
                  <a
                    href="#mistakes"
                    className="block text-[14px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                  >
                    Mistakes to avoid
                  </a>
                </li>
              </ul>
            </nav>

            {guides.length > 0 && (
              <section className="mt-4">
                <p className="px-5 text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                  Go deeper
                </p>
                <div className="mt-3 space-y-3">
                  {guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className={cn(
                        panel,
                        "block px-5 py-4 transition hover:ring-ink/15",
                      )}
                    >
                      <span className="block text-[15px] font-extrabold text-ink">
                        {guide.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                        {guide.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* The keyword bank. Grouped rather than listed flat: a reader is
            picking the handful that are true of them, and groups make that a
            scan instead of a search. */}
        <section className="mt-16">
          <h2
            id="keywords"
            className="scroll-mt-24 text-[24px] leading-tight font-extrabold tracking-tight text-ink"
          >
            {example.role} skills and ATS keywords
          </h2>
          <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
            These are the terms that appear in {example.role.toLowerCase()}{" "}
            postings, which is what an applicant tracking system matches your
            resume against. Take the ones that are genuinely true of you — a
            keyword you can&rsquo;t defend in an interview costs more than the
            match is worth.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {example.keywords.map((group) => (
              <div key={group.group} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                  {group.group}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.terms.map((term) => (
                    <li
                      key={term}
                      className="rounded-lg bg-field px-2.5 py-1 text-[13.5px] font-semibold text-ink-soft"
                    >
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2
            id="mistakes"
            className="scroll-mt-24 text-[24px] leading-tight font-extrabold tracking-tight text-ink"
          >
            Mistakes that cost {example.role.toLowerCase()}s interviews
          </h2>
          <ul className="mt-5 grid gap-2 md:grid-cols-2">
            {example.mistakes.map((mistake) => (
              <li
                key={mistake}
                className={cn(
                  panel,
                  "flex gap-3 px-5 py-4 text-[15px] leading-relaxed text-ink-soft",
                )}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.1em] shrink-0 font-bold text-brand"
                >
                  ×
                </span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            {example.role} resume FAQs
          </h2>
          <FaqList entries={example.faqs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Related resume examples
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/resume-examples/${item.slug}`}
                  className={cn(
                    panel,
                    "px-5 py-4 transition hover:ring-ink/15",
                  )}
                >
                  <span className="block text-[15px] font-extrabold text-ink">
                    {item.role}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                    {item.aka[0]}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ContentCta
          heading={`Write your ${example.role.toLowerCase()} resume`}
          body="Start from a template, get AI help tightening every bullet, and export an ATS-ready PDF. Free to start, and no card at any point."
        />
      </Column>
    </ContentPage>
  );
}
