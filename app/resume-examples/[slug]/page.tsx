import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleRail } from "@/components/content/ArticleRail";
import {
  Breadcrumbs,
  Column,
  ContentPage,
  FaqAccordion,
  JsonLd,
} from "@/components/content/ContentShell";
import { ExampleShowcase } from "@/components/content/ExampleShowcase";
import {
  ArrowRight,
  btnCompact,
  btnPrimary,
  btnQuiet,
  eyebrow,
  h2,
  tag,
} from "@/components/landing/ui";
import { coverLetterForResume } from "@/lib/content/cover-letters";
import { exampleArt } from "@/lib/content/example-art";
import { getGuide } from "@/lib/content/guides";
import {
  RESUME_EXAMPLES,
  getExample,
  toResumeData,
} from "@/lib/content/resume-examples";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { withYear } from "@/lib/seo/year";
import { getTemplate } from "@/lib/templates";
import type { TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";

/** The tick beside a line — the landing hero's blue disc. */
function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.2em] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lp-accent text-white"
    >
      <CheckIcon className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

/** Serif sub-heading inside the article. */
const sectionHeading =
  "font-editorial text-[28px] leading-[1.12] font-normal tracking-[-0.02em] text-ink sm:text-[32px]";

/**
 * The five templates the showcase offers, the example's own first.
 *
 * A fixed spread rather than five at random: a serif single column, a sans
 * one, the stripped-back one, a two-column, and a dated left rail. Between
 * them they cover the decisions that actually change how a page reads, which
 * is the point being made — the rest of the library is a link away.
 */
const SHOWCASE: TemplateId[] = [
  "ledger",
  "modern",
  "minimal",
  "sidebar",
  "chronicle",
];

function showcaseTemplates(own: TemplateId) {
  const ids = [own, ...SHOWCASE.filter((id) => id !== own)].slice(0, 5);
  return ids.map((id) => {
    const template = getTemplate(id);
    return { id: template.id, name: template.name };
  });
}

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
  // Titles carry a "{year}" token rather than a typed-in year — see lib/seo/year.ts.
  const title = withYear(example.metaTitle);
  // The same document is a CV in the UK, Ireland and Australia, so the
  // description says so once rather than the copy repeating it per role.
  const description = `${example.description} Works as a resume or a CV.`;
  return {
    title,
    description,
    // The alternate titles are the same job under a different name, which is
    // what people actually search. They belong in the keywords rather than
    // stuffed into the copy, where they'd read as padding.
    keywords: [
      `${example.role} resume`,
      `${example.role} resume example`,
      `${example.role} resume template`,
      `${example.role} cv`,
      `${example.role} cv example`,
      ...example.aka.map((title) => `${title} resume`),
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: example.updated,
      modifiedTime: example.updated,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const art = exampleArt(example.slug);

  const related = example.related
    .map(getExample)
    .filter((item) => item !== undefined);
  const guides = example.guides
    .map(getGuide)
    .filter((item) => item !== undefined);
  const letter = coverLetterForResume(example.slug);

  const trail = [
    HOME,
    { name: "Resume examples", path: "/resume-examples" },
    { name: example.role, path: `/resume-examples/${example.slug}` },
  ];

  return (
    <ContentPage surface="white" landing>
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
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              mainEntityOfPage: abs(`/resume-examples/${example.slug}`),
            },
            faqPage(example.faqs),
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />

        <header className="mt-4 grid items-center gap-10 overflow-hidden rounded-[28px] bg-canvas px-6 py-10 sm:mt-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:rounded-[35px] lg:px-16 lg:py-14">
          <div className="min-w-0">
            <span className={eyebrow}>{"// Resume example //"}</span>
            <h1 className="mt-5 font-editorial text-[38px] leading-[1.05] font-normal tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[58px]">
              {`${example.role} resume & CV example`}
            </h1>
            <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.62] text-ink-soft lg:text-[17px]">
              {example.intro}
            </p>

            <p className="mt-5 max-w-[60ch] text-[13.5px] leading-relaxed text-ink-soft">
              <time dateTime={example.updated}>
                Updated{" "}
                {new Date(`${example.updated}T00:00:00Z`).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  },
                )}
              </time>
              {" · "}
              Also written as{" "}
              {example.aka.map((title, i) => (
                <span key={title}>
                  {i > 0 && (i === example.aka.length - 1 ? " and " : ", ")}
                  <span className="font-semibold text-ink">{title}</span>
                </span>
              ))}
            </p>

            {/* Both buttons open a resume that already is the one below — same
                template, same words — and /start writes it. Nothing prefetches
                it: it's a row in the database, not a page. */}
            <div className="mt-7 flex flex-nowrap gap-3">
              <Link
                href={`/start?example=${example.slug}`}
                prefetch={false}
                className={cn(btnPrimary, btnCompact)}
              >
                Build this resume
              </Link>
              <Link
                href="/resume-ats-score"
                className={cn(btnQuiet, btnCompact)}
              >
                Check your ATS score
              </Link>
            </div>
          </div>

          {art && (
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              priority
              sizes="(min-width: 1024px) 520px, 90vw"
              // Multiplied into the panel so the drawing's white ground
              // disappears rather than sitting on it as a sticker.
              className="mx-auto aspect-[1338/753] w-full max-w-[520px] scale-105 object-cover mix-blend-multiply max-lg:hidden"
            />
          )}
        </header>

        {/* The finished page beside the list of what has to be true of it. The
            render is live — the same <ResumePreview> the editor and the PDF
            export use — so the example can't drift from the product. */}
        <section
          id="example"
          className="mt-10 scroll-mt-24 rounded-[28px] bg-canvas px-6 py-10 sm:px-10 lg:rounded-[35px] lg:px-16 lg:py-14"
        >
          <ExampleShowcase
            data={resume}
            slug={example.slug}
            templates={showcaseTemplates(example.template)}
          >
            <span className={tag("blue")}>The full example</span>
            <h2 className="mt-4 font-editorial text-[30px] leading-[1.1] font-normal tracking-[-0.025em] text-ink sm:text-[38px]">
              What this {example.role.toLowerCase()} resume gets right
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Every figure on it is invented; the shape is the point. Work down
              the list against your own page — each line is something a hiring
              manager checks for in the first ten seconds.
            </p>

            <ul className="mt-6 space-y-3">
              {example.looksFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckMark />
                  <span className="text-[15px] leading-relaxed text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[14px] leading-relaxed text-ink-soft">
              Drawn in the{" "}
              <Link
                href="/resume-templates"
                className="font-semibold text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
              >
                {template.name}
              </Link>{" "}
              template. Switch it below — the same content re-renders rather
              than starting over, which is what happens in the editor too.
            </p>
          </ExampleShowcase>
        </section>

        <div className="mt-16 lg:flex lg:items-start lg:gap-14">
          <article className="min-w-0 flex-1 space-y-12">
            <div>
              <span className={eyebrow}>{"// Guide //"}</span>
              <h2 className={cn(h2, "mt-4")}>How to write it</h2>
            </div>

            {example.sections.map((section) => (
              <section key={section.heading}>
                <h3
                  id={anchor(section.heading)}
                  className={cn(sectionHeading, "scroll-mt-24")}
                >
                  {section.heading}
                </h3>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-5 text-[17px] leading-[1.75] text-ink"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-5 space-y-2.5">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[17px] leading-[1.7] text-ink"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-lp-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <ArticleRail
            links={[
              { id: "example", label: "The full example" },
              ...example.sections.map((section) => ({
                id: anchor(section.heading),
                label: section.heading,
              })),
              { id: "keywords", label: "Skills & ATS keywords" },
              { id: "mistakes", label: "Mistakes to avoid" },
            ]}
            cta={{
              title: "Build this resume",
              body: "Start from this exact page, then make it yours with live preview and AI help on every bullet.",
              label: "Start from this example",
              href: `/start?example=${example.slug}`,
            }}
            cards={[
              ...(guides.length > 0
                ? [
                    {
                      label: "Go deeper",
                      tone: "pink" as const,
                      links: guides.map((guide) => ({
                        href: `/guides/${guide.slug}`,
                        text: guide.title,
                      })),
                    },
                  ]
                : []),
              {
                label: "Cover letter",
                tone: "mint" as const,
                links: [
                  letter
                    ? {
                        href: `/cover-letter/examples#${letter.id}`,
                        text: `${example.role} cover letter example`,
                      }
                    : {
                        href: "/cover-letter",
                        text: "How to write a cover letter",
                      },
                ],
              },
            ]}
          />
        </div>

        {/* Grouped rather than listed flat: a reader is picking the handful
            that are true of them, and groups make that a scan. */}
        <section className="mt-20">
          <span className={eyebrow}>{"// Keywords //"}</span>
          <h2 id="keywords" className={cn(h2, "mt-4 scroll-mt-24")}>
            {example.role} skills and ATS keywords
          </h2>
          <p className="mt-4 max-w-[64ch] text-[16px] leading-[1.65] text-ink-soft">
            These are the terms that appear in {example.role.toLowerCase()}{" "}
            postings, which is what an applicant tracking system matches your
            resume against. Take the ones that are genuinely true of you — a
            keyword you can&rsquo;t defend in an interview costs more than the
            match is worth.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {example.keywords.map((group) => (
              <div
                key={group.group}
                className="rounded-[22px] bg-canvas px-6 py-6"
              >
                <h3 className="text-[12px] font-medium text-ink-soft">
                  {group.group}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.terms.map((term) => (
                    <li
                      key={term}
                      className="rounded-full bg-white px-3 py-1 text-[13.5px] font-medium text-ink ring-1 ring-divider"
                    >
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <span className={eyebrow}>{"// Avoid //"}</span>
          <h2 id="mistakes" className={cn(h2, "mt-4 scroll-mt-24")}>
            Mistakes that cost {example.role.toLowerCase()}s interviews
          </h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {example.mistakes.map((mistake) => (
              <li
                key={mistake}
                className="flex gap-3 rounded-[18px] bg-canvas px-5 py-4 text-[15px] leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.15em] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lp-coral text-[13px] leading-none font-semibold text-ink"
                >
                  ×
                </span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-5xl">
            <span className={eyebrow}>{"// FAQ //"}</span>
            <h2 className={cn(h2, "mt-4")}>{example.role} resume FAQs</h2>
            <FaqAccordion entries={example.faqs} className="mt-8 md:mt-10" />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <span className={eyebrow}>{"// Keep exploring //"}</span>
            <h2 className={cn(h2, "mt-4")}>Related resume examples</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/resume-examples/${item.slug}`}
                  className="group rounded-[22px] bg-canvas px-6 py-6 transition hover:-translate-y-0.5"
                >
                  <span className="block font-editorial text-[22px] leading-[1.15] tracking-[-0.015em] text-ink">
                    {item.role}
                  </span>
                  <span className="mt-2 block text-[13.5px] leading-relaxed text-ink-soft">
                    {item.aka[0]}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[13.5px] font-medium text-ink transition-all group-hover:gap-3">
                    See example
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 mb-6 rounded-[28px] bg-canvas px-6 py-14 text-center sm:px-10 lg:rounded-[35px] lg:py-20">
          <h2 className={cn(h2, "mx-auto max-w-[20ch]")}>
            Write your {example.role.toLowerCase()} resume
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-ink-soft">
            Start from a template, get AI help tightening every bullet, and
            export an ATS-ready PDF. Free to start, and no card at any point.
          </p>
          <Link href="/dashboard" className={cn(btnPrimary, "mt-8")}>
            Start your resume
          </Link>
        </section>
      </Column>
    </ContentPage>
  );
}
