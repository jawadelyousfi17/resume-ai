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
import { OnThisPage } from "@/components/content/OnThisPage";
import { TemplateCard } from "@/components/content/TemplateCard";
import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  panelFlat,
} from "@/components/landing/ui";
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
import { cn } from "@/lib/utils";

/** The tick beside a checklist line. Drawn rather than imported, and the same
 *  one the role examples use — the two pages now share a layout, so they
 *  should share the mark as well. */
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

  return (
    <ContentPage surface="white">
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

      <Column>
        <Breadcrumbs trail={trail} />

        {/* The header sits on its own tinted field rather than on the page:
            a guide opens with an argument, and the band is what separates the
            argument's own introduction from the article that follows it. The
            tint is the brand's, at the strength the app uses behind a chip —
            enough to read as a surface, not enough to fight the illustration
            standing on it. */}
        <header className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-brand-soft/70 to-field px-6 py-8 ring-1 ring-black/[0.06] sm:mt-5 sm:px-10 sm:py-10 lg:flex lg:items-center lg:gap-10 lg:px-12">
          <div className="min-w-0 lg:flex-1">
            <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
              {guide.eyebrow}
            </p>
            <h1 className="mt-2 max-w-[26ch] text-[26px] leading-[1.15] font-extrabold tracking-tight text-ink sm:text-[32px] lg:text-[36px]">
              {guide.title}
            </h1>
            <p className="mt-2.5 max-w-[76ch] text-[15px] leading-relaxed text-ink sm:text-[16px]">
              {guide.intro}
            </p>

            {/* Who wrote it, when it was last true, and how long it takes —
                the three things a reader decides on before starting. */}
            <p className="mt-4 text-[13px] leading-relaxed font-semibold text-ink">
              {author.name}
              <span className="font-normal text-ink-soft">
                {" "}
                · {author.role}
              </span>
              <span aria-hidden="true" className="px-2 text-ink-soft/60">
                ·
              </span>
              <time
                dateTime={guide.updated}
                className="font-normal text-ink-soft"
              >
                Updated{" "}
                {new Date(`${guide.updated}T00:00:00Z`).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  },
                )}
              </time>
              <span aria-hidden="true" className="px-2 text-ink-soft/60">
                ·
              </span>
              <span className="font-normal text-ink-soft">
                {minutes} min read
              </span>
            </p>

            <div className="mt-5 flex flex-nowrap gap-3 sm:flex-wrap">
              <Link
                href="/dashboard"
                className={cn(btnPrimary, btnCompact, "h-11")}
              >
                Build your resume
              </Link>
              <Link
                href="/resume-ats-score"
                className={cn(btnQuiet, btnCompact, "h-11 bg-panel")}
              >
                Check your ATS score
              </Link>
            </div>
          </div>

          {/* The guide's own illustration, the one its card carries on
              /guides — arriving on the page you clicked and finding the same
              picture is how a link confirms it went where you meant.
              Decorative, so no alt text, and gone below `lg` where the words
              need the whole width. Not every guide is drawn yet. */}
          {art && (
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              priority
              sizes="380px"
              // Multiplied into the band rather than laid on it: the drawing
              // is on white, and a white rectangle over a tint is a sticker.
              className="aspect-[1338/753] w-[380px] shrink-0 scale-105 object-cover object-center mix-blend-multiply max-lg:hidden"
            />
          )}
        </header>

        {/* The answer before the argument. Someone who arrived from a search
            for one fact gets it here and can leave; the article underneath is
            for the reader who wants to know why. */}
        {guide.takeaways && (
          <section
            id="summary"
            className={cn(panelFlat, "mt-10 scroll-mt-24 px-6 py-6 sm:px-8")}
          >
            <h2 className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
              The short version
            </h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {guide.takeaways.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckMark />
                  <span className="text-[15px] leading-relaxed text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The prose keeps a reading measure; the width the page gains goes to
            the rail beside it rather than to longer lines. */}
        <div className="mt-14 lg:flex lg:items-start lg:gap-14">
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
                    className="mt-4 text-[16px] leading-[1.75] text-ink"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[16px] leading-[1.7] text-ink"
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
            <OnThisPage links={rail} />

            {related.length > 0 && (
              <section className="mt-8">
                <p className="text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase">
                  Read next
                </p>
                <ul className="mt-3 space-y-2.5">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/guides/${item.slug}`}
                        className="block text-[14.5px] leading-snug font-bold text-ink transition hover:text-brand"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8">
              <p className="text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase">
                See it applied
              </p>
              <div className="mt-3">
                <Link
                  href={`/resume-examples/${example.slug}`}
                  className="block text-[14.5px] leading-snug font-bold text-ink transition hover:text-brand"
                >
                  {example.role} resume example
                </Link>
              </div>
            </section>

            {/* The rail is sticky, so this rides down the article with the
                reader — the one place on the page where the action is in view
                at the moment the advice lands, rather than waiting at the
                bottom for someone who scrolled the whole way. */}
            <section className={cn(panelFlat, "mt-8 px-5 py-5")}>
              <p className="text-[15px] font-extrabold text-ink">
                Write it while you read
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">
                Live preview, AI help on every bullet, and an ATS-ready PDF. No
                card at any point.
              </p>
              <Link
                href="/dashboard"
                className={cn(btnPrimary, "mt-4 h-10 w-full text-[14px]")}
              >
                Start your resume
              </Link>
              <Link
                href="/resume-templates"
                className="mt-3 block text-center text-[13px] font-bold text-ink-soft transition hover:text-brand"
              >
                Browse templates
              </Link>
            </section>
          </aside>
        </div>

        {/* The argument, made in two sentences instead of two paragraphs. */}
        {guide.rewrites && (
          <section id="rewrites" className="mt-16 scroll-mt-24">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Before and after
            </h2>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink">
              The same facts, written twice. Nothing has been added to the
              right-hand column that was not already true on the left — which is
              the whole point, and the reason this is editing rather than
              invention.
            </p>
            <div className="mt-6 space-y-3">
              {guide.rewrites.map((rewrite) => (
                <div
                  key={rewrite.before}
                  className={cn(panelFlat, "px-6 py-5")}
                >
                  {rewrite.label && (
                    <p className="text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase">
                      {rewrite.label}
                    </p>
                  )}
                  <div className="mt-3 grid gap-4 md:grid-cols-2 md:gap-8">
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase">
                        Before
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft line-through decoration-ink-soft/40">
                        {rewrite.before}
                      </p>
                    </div>
                    <div className="max-md:border-t max-md:border-field-border max-md:pt-4">
                      <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                        After
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed font-semibold text-ink">
                        {rewrite.after}
                      </p>
                    </div>
                  </div>
                  {rewrite.note && (
                    <p className="mt-4 border-t border-field-border pt-3 text-[14px] leading-relaxed text-ink">
                      {rewrite.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* A real table, for the guides whose subject is a pair of things
            people confuse. Scrolls inside its own box on a phone rather than
            pushing the page sideways. */}
        {guide.compare && (
          <section id="compare" className="mt-16 scroll-mt-24">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {guide.compare.heading}
            </h2>
            {/* The table is 640px at its narrowest and scrolls inside its own
                box rather than pushing the page sideways. On a phone that is
                the right behaviour and an invisible one, so it gets a line
                saying so — the cut-off second column is otherwise just a
                column that appears to be missing. */}
            <p className="mt-3 text-[13px] font-semibold text-ink-soft sm:hidden">
              Scroll the table sideways to compare &rarr;
            </p>
            <div
              className={cn(panelFlat, "mt-4 overflow-x-auto sm:mt-6")}
              tabIndex={0}
              role="region"
              aria-label={guide.compare.heading}
            >
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-field-border">
                    {guide.compare.columns.map((column, i) => (
                      <th
                        key={column}
                        scope="col"
                        className={cn(
                          "px-6 py-4 text-[13px] font-bold tracking-[0.08em] uppercase",
                          i === 0 ? "text-ink-soft" : "text-brand",
                        )}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.compare.rows.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-field-border last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 align-top text-[14.5px] font-extrabold text-ink"
                      >
                        {row[0]}
                      </th>
                      <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-ink">
                        {row[1]}
                      </td>
                      <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-ink">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* What to do with all of the above, on your own page. */}
        {guide.checklist && (
          <section id="checklist" className="mt-16 scroll-mt-24">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {guide.checklist.heading}
            </h2>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink">
              Open your own resume beside this and work down it. Every line is
              something a reader or a parser acts on within the first pass.
            </p>
            <ul className="mt-6 grid gap-2 md:grid-cols-2">
              {guide.checklist.items.map((item) => (
                <li
                  key={item}
                  className={cn(panelFlat, "flex gap-3 px-5 py-4")}
                >
                  <CheckMark />
                  <span className="text-[15px] leading-relaxed text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The templates the guide argued for, not the same nine everywhere.
            Server-rendered, so the cut is in the HTML and every card is a
            crawlable link down into a template page. */}
        {templates.length > 0 && guide.templates && (
          <section id="templates" className="mt-16 scroll-mt-24">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {guide.templates.heading}
            </h2>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink">
              {guide.templates.blurb}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-7 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
            <div className="mt-9 flex flex-nowrap gap-3 sm:flex-wrap">
              <Link
                href="/resume-templates"
                className={cn(btnQuiet, btnCompact, "h-11")}
              >
                Browse all templates
              </Link>
              <Link
                href="/resume-examples"
                className={cn(btnQuiet, btnCompact, "h-11")}
              >
                See finished examples
              </Link>
            </div>
          </section>
        )}

        <section id="faqs" className="mt-16 scroll-mt-24">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqAccordion entries={guide.faqs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Related guides
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/guides/${item.slug}`}
                  className={cn(
                    panelFlat,
                    "px-5 py-4 transition hover:ring-ink/15",
                  )}
                >
                  <span className="block text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                    {item.eyebrow}
                  </span>
                  <span className="mt-2 block text-[15px] font-extrabold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ContentCta
          flat
          heading="Put it into practice"
          body="Start from any template above, get AI help tightening every bullet, and export an ATS-ready PDF. Free to start, and no card at any point."
        />
      </Column>
    </ContentPage>
  );
}
