// A guide, dressed in the landing page's art direction: serif headlines, an
// outlined eyebrow, pale canvas panels, pastel labels and pill buttons.
//
// Presentational only — app/guides/[slug]/page.tsx does the lookups and the
// schema, and hands the results in.

import Image from "next/image";
import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentPage,
  FaqAccordion,
} from "@/components/content/ContentShell";
import { ArticleRail } from "@/components/content/ArticleRail";
import type { RailLink } from "@/components/content/OnThisPage";
import { TemplateCard } from "@/components/content/TemplateCard";
import {
  ArrowRight,
  btnCompact,
  btnPrimary,
  btnQuiet,
  eyebrow,
  h2,
  panelFlat,
  tag,
} from "@/components/landing/ui";
import { Avatar } from "@/components/landing/marks";
import { CheckIcon } from "@/components/ui/icons";
import type { Guide } from "@/lib/content/guides";
import type { Crumb } from "@/lib/seo/schema";
import type { Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The tick beside a line — the hero's blue disc. */
function Tick() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.2em] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lp-accent text-white"
    >
      <CheckIcon className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

/** Serif section heading, a step down from the landing's own. */
const sectionHeading =
  "font-editorial text-[30px] leading-[1.12] font-normal tracking-[-0.02em] text-ink sm:text-[36px]";

export function GuideArticle({
  guide,
  jsonLd,
  trail,
  art,
  author,
  minutes,
  related,
  templates,
  example,
  rail,
}: {
  guide: Guide;
  jsonLd: React.ReactNode;
  trail: Crumb[];
  art: string | null | undefined;
  author: { name: string; role: string };
  minutes: number;
  related: Guide[];
  templates: Template[];
  example: { slug: string; role: string };
  rail: RailLink[];
}) {
  return (
    <ContentPage surface="white" landing>
      {jsonLd}

      <Column>
        <Breadcrumbs trail={trail} />

        <header className="mt-4 grid items-center gap-10 overflow-hidden rounded-[28px] bg-canvas px-6 py-10 sm:mt-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:rounded-[35px] lg:px-16 lg:py-14">
          <div className="min-w-0">
            <span className={eyebrow}>{`// ${guide.eyebrow} //`}</span>
            <h1 className="mt-5 font-editorial text-[38px] leading-[1.05] font-normal tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[58px]">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.62] text-ink-soft lg:text-[17px]">
              {guide.intro}
            </p>

            <div className="mt-7 flex items-center gap-3.5">
              <Avatar
                name={author.name}
                className="h-12 w-12 ring-2 ring-white"
              />
              <div className="min-w-0 text-[13.5px] leading-snug text-ink-soft">
                <p>
                  <strong className="font-semibold text-ink">
                    {author.name}
                  </strong>
                  {" · "}
                  {author.role}
                </p>
                <p className="mt-0.5">
                  <time dateTime={guide.updated}>
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
                  {" · "}
                  {minutes} min read
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-nowrap gap-3">
              <Link href="/dashboard" className={cn(btnPrimary, btnCompact)}>
                Build your resume
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

        <div className="mt-16 lg:flex lg:items-start lg:gap-14">
          <article className="min-w-0 flex-1 space-y-12">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2
                  id={anchor(section.heading)}
                  className={cn(sectionHeading, "scroll-mt-24")}
                >
                  {section.heading}
                </h2>
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
            links={rail.filter((link) => link.id !== "summary")}
            cta={{
              title: "Write it while you read",
              body: "Live preview, AI help on every bullet, and an ATS-ready PDF. No card at any point.",
              label: "Start your resume",
              href: "/dashboard",
            }}
            cards={[
              ...(related.length > 0
                ? [
                    {
                      label: "Read next",
                      tone: "pink" as const,
                      links: related.map((item) => ({
                        href: `/guides/${item.slug}`,
                        text: item.title,
                      })),
                    },
                  ]
                : []),
              {
                label: "See it applied",
                tone: "mint" as const,
                links: [
                  {
                    href: `/resume-examples/${example.slug}`,
                    text: `${example.role} resume example`,
                  },
                ],
              },
            ]}
          />
        </div>

        {guide.rewrites && (
          <section id="rewrites" className="mt-20 scroll-mt-24">
            <span className={eyebrow}>{"// Before & after //"}</span>
            <h2 className={cn(h2, "mt-4")}>Before and after</h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-ink-soft">
              The same facts, written twice. Nothing has been added to the
              right-hand column that was not already true on the left.
            </p>
            <div className="mt-8 space-y-4">
              {guide.rewrites.map((rewrite) => (
                <div
                  key={rewrite.before}
                  className="rounded-[22px] bg-canvas px-6 py-6 sm:px-9"
                >
                  {rewrite.label && (
                    <p className="text-[12px] font-medium text-ink-soft">
                      {rewrite.label}
                    </p>
                  )}
                  <div className="mt-3 grid gap-5 md:grid-cols-2 md:gap-10">
                    <div>
                      <span className={tag("coral")}>Before</span>
                      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft line-through decoration-ink-soft/40">
                        {rewrite.before}
                      </p>
                    </div>
                    <div>
                      <span className={tag("mint")}>After</span>
                      <p className="mt-3 text-[15.5px] leading-relaxed font-semibold text-ink">
                        {rewrite.after}
                      </p>
                    </div>
                  </div>
                  {rewrite.note && (
                    <p className="mt-5 border-t border-divider pt-4 text-[14.5px] leading-relaxed text-ink-soft">
                      {rewrite.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {guide.compare && (
          <section id="compare" className="mt-20 scroll-mt-24">
            <span className={eyebrow}>{"// Compared //"}</span>
            <h2 className={cn(h2, "mt-4")}>{guide.compare.heading}</h2>
            <p className="mt-3 text-[13px] font-semibold text-ink-soft sm:hidden">
              Scroll the table sideways to compare &rarr;
            </p>
            <div
              className={cn(panelFlat, "mt-6 overflow-x-auto sm:mt-8")}
              tabIndex={0}
              role="region"
              aria-label={guide.compare.heading}
            >
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink">
                    {guide.compare.columns.map((column, i) => (
                      <th
                        key={column}
                        scope="col"
                        className={cn(
                          "px-6 py-4 text-[12.5px] font-semibold tracking-[0.08em] uppercase",
                          i === 0 ? "text-ink-faint" : "text-ink",
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
                      className="border-b border-divider last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 align-top text-[14.5px] font-semibold text-ink"
                      >
                        {row[0]}
                      </th>
                      <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-ink-soft">
                        {row[1]}
                      </td>
                      <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-ink-soft">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {guide.checklist && (
          <section id="checklist" className="mt-20 scroll-mt-24">
            <span className={eyebrow}>{"// Checklist //"}</span>
            <h2 className={cn(h2, "mt-4")}>{guide.checklist.heading}</h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-ink-soft">
              Open your own resume beside this and work down it.
            </p>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {guide.checklist.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-[18px] bg-canvas px-5 py-4"
                >
                  <Tick />
                  <span className="text-[15px] leading-relaxed text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {templates.length > 0 && guide.templates && (
          <section id="templates" className="mt-20 scroll-mt-24">
            <span className={eyebrow}>{"// Templates //"}</span>
            <h2 className={cn(h2, "mt-4")}>{guide.templates.heading}</h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-ink-soft">
              {guide.templates.blurb}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-7 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
            <div className="mt-10 flex flex-nowrap gap-3">
              <Link
                href="/resume-templates"
                className={cn(btnQuiet, btnCompact)}
              >
                Browse all templates
              </Link>
              <Link
                href="/resume-examples"
                className={cn(btnQuiet, btnCompact)}
              >
                See finished examples
              </Link>
            </div>
          </section>
        )}

        <section id="faqs" className="mt-20 scroll-mt-24">
          <div className="mx-auto max-w-5xl">
            <span className={eyebrow}>{"// FAQ //"}</span>
            <h2 className={cn(h2, "mt-4")}>Common questions</h2>
            <FaqAccordion entries={guide.faqs} className="mt-8 md:mt-10" />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <span className={eyebrow}>{"// Keep reading //"}</span>
            <h2 className={cn(h2, "mt-4")}>Related guides</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/guides/${item.slug}`}
                  className="group rounded-[22px] bg-canvas px-6 py-6 transition hover:-translate-y-0.5"
                >
                  <span className={tag("pink")}>{item.eyebrow}</span>
                  <span className="mt-4 block font-editorial text-[22px] leading-[1.15] tracking-[-0.015em] text-ink">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-[13.5px] leading-relaxed text-ink-soft">
                    {item.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[13.5px] font-medium text-ink transition-all group-hover:gap-3">
                    Read guide
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 mb-6 rounded-[28px] bg-canvas px-6 py-14 text-center sm:px-10 lg:rounded-[35px] lg:py-20">
          <h2 className={cn(h2, "mx-auto max-w-[18ch]")}>
            Put it into practice
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-ink-soft">
            Start from any template, get AI help tightening every bullet, and
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
