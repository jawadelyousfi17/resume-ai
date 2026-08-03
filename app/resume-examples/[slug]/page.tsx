import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqAccordion,
  JsonLd,
} from "@/components/content/ContentShell";
import { ExampleShowcase } from "@/components/content/ExampleShowcase";
import { OnThisPage } from "@/components/content/OnThisPage";
import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  panelFlat,
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

/** The tick beside a checklist line. Drawn rather than imported: the app's
 *  icon set has no outlined check at this weight, and it's four points. */
function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.15em] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3">
        <path
          d="M3.5 8.5 6.5 11.5 12.5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

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
    <ContentPage surface="white">
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
        {/* Its own header rather than the shared <PageHeader>, because this
            page's subject is the resume below it, not the introduction. A
            step down in every size, and the date and the alternate titles on
            one line of meta instead of two stacked paragraphs — it went four
            blocks deep before anything you came for was on screen. */}
        <header className="mt-4 sm:mt-5 lg:flex lg:items-center lg:gap-10">
          <div className="min-w-0 lg:flex-1">
          <h1 className="max-w-[26ch] text-[26px] leading-[1.15] font-extrabold tracking-tight text-ink sm:text-[32px] lg:text-[36px]">
            {`${example.role} resume & CV example`}
          </h1>
          <p className="mt-2.5 max-w-[76ch] text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
            {example.intro}
          </p>

          <p className="mt-3 max-w-[76ch] text-[13px] leading-relaxed text-ink-faint">
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
            <span aria-hidden="true" className="px-2 text-ink-faint/50">
              ·
            </span>
            Also written as{" "}
            {example.aka.map((title, i) => (
              <span key={title}>
                {i > 0 && (i === example.aka.length - 1 ? " and " : ", ")}
                <span className="font-semibold text-ink-soft">{title}</span>
              </span>
            ))}
          </p>

          {/* Both buttons open a resume that already is the one below — same
              template, same words — and /start writes it. Nothing prefetches
              it: it's a row in the database, not a page. */}
          <div className="mt-5 flex flex-nowrap gap-3 sm:flex-wrap">
            <Link
              href={`/start?example=${example.slug}`}
              prefetch={false}
              className={cn(btnPrimary, btnCompact, "h-11")}
            >
              Build this resume
            </Link>
            <Link
              href="/resume-ats-score"
              className={cn(btnQuiet, btnCompact, "h-11")}
            >
              Check your ATS score
            </Link>
          </div>
          </div>

          {/* The role's own illustration, the one its card carries in the
              gallery — arriving on the page you clicked and finding the same
              picture is how a link confirms it went where you meant.
              Decorative, so no alt text, and gone below `lg` where the words
              need the whole width. */}
          {art && (
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              priority
              sizes="380px"
              // Cropped to the middle 80% on every side. The artwork is drawn
              // with a wide margin of its own, which read as a gap between it
              // and the words rather than as part of the picture.
              className="aspect-[1338/753] w-[380px] shrink-0 scale-105 object-cover object-center max-lg:hidden"
            />
          )}
        </header>

        {/* The first thing after the hero: the finished page on the right, and
            beside it the list of what has to be true of it.
            The two belong together — the checklist is abstract on its own and
            the resume is just a nice page without it, and read side by side
            each line has something to point at. On a phone the checklist comes
            first, since a column of prose is quicker to act on than a page of
            9pt type scaled to 390px.
            The render is live, not a picture: the same <ResumePreview> the
            editor and the PDF export use, so the example can't drift from what
            the product actually produces. */}
        <section id="example" className="mt-10 scroll-mt-24">
          <ExampleShowcase
            data={resume}
            slug={example.slug}
            templates={showcaseTemplates(example.template)}
          >
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              What this {example.role.toLowerCase()} resume gets right
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
              Every figure on it is invented; the shape is the point. Work down
              the list against your own page — each line is something a hiring
              manager checks for in the first ten seconds.
            </p>

            <ul className="mt-6 space-y-3">
              {example.looksFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckMark />
                  <span className="text-[15px] leading-relaxed text-ink-soft">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[14px] leading-relaxed text-ink-faint">
              Drawn in the{" "}
              <Link
                href="/resume-templates"
                className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
              >
                {template.name}
              </Link>{" "}
              template. Switch it below — the same content re-renders rather
              than starting over, which is what happens in the editor too.
            </p>
          </ExampleShowcase>
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

          {/* `top-26` rather than `top-24`: the header is 96px, so 24 parked
              the rail flush against its underside with nothing between them. */}
          <aside className="mt-12 lg:sticky lg:top-26 lg:mt-1 lg:w-[280px] lg:shrink-0">
            <OnThisPage
              links={[
                { id: "example", label: "The full example" },
                ...example.sections.map((section) => ({
                  id: anchor(section.heading),
                  label: section.heading,
                })),
                { id: "keywords", label: "Skills & ATS keywords" },
                { id: "mistakes", label: "Mistakes to avoid" },
              ]}
            />

            {/* Titles only. The descriptions were a second paragraph each in a
                280px column, which turned a list of four links into a wall
                beside the article — and the guide's own page says all of it
                anyway. */}
            {guides.length > 0 && (
              <section className="mt-8">
                <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                  Go deeper
                </p>
                <ul className="mt-3 space-y-2.5">
                  {guides.map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="block text-[14.5px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                      >
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Half the roles here have a written letter; the rest get the hub,
                which teaches the same four paragraphs. Either way every role
                page links into the cover letter pillar. */}
            <section className="mt-8">
              <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                Cover letter
              </p>
              <div className="mt-3">
                <Link
                  href={
                    letter
                      ? `/cover-letter/examples#${letter.id}`
                      : "/cover-letter"
                  }
                  className="block text-[14.5px] leading-snug font-bold text-ink-soft transition hover:text-brand"
                >
                  {letter
                    ? `${example.role} cover letter example`
                    : "How to write a cover letter"}
                </Link>
              </div>
            </section>
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
              <div key={group.group} className={cn(panelFlat, "px-6 py-5")}>
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
                  panelFlat,
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
          <FaqAccordion entries={example.faqs} />
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
                    panelFlat,
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
          flat
          heading={`Write your ${example.role.toLowerCase()} resume`}
          body="Start from a template, get AI help tightening every bullet, and export an ATS-ready PDF. Free to start, and no card at any point."
        />
      </Column>
    </ContentPage>
  );
}
