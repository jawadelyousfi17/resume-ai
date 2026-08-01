import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqAccordion,
  JsonLd,
  PageHeader,
  measure,
} from "@/components/content/ContentShell";
import { LetterTemplateGallery } from "@/components/content/LetterTemplateGallery";
import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  panel,
  panelFlat,
} from "@/components/landing/ui";
import {
  LETTER_PARTS,
  LETTER_PATTERNS,
  TEMPLATE_FAQS,
} from "@/lib/content/cover-letters";
import {
  LETTER_FAMILIES,
  LETTER_TEMPLATES,
  letterFamily,
} from "@/lib/letter-templates";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cover Letter Templates — Free, Matching Designs | meniacv",
  description:
    "Free cover letter templates you can edit and export as a real PDF — plain, stationery, bold and decorated, in serif and sans. Plus the five arguments a letter has to make.",
  keywords: [
    "cover letter template",
    "free cover letter template",
    "cover letter format",
    "cover letter example template",
    "career change cover letter",
  ],
  alternates: { canonical: "/cover-letter/templates" },
};

const TRAIL = [
  HOME,
  { name: "Cover letters", path: "/cover-letter" },
  { name: "Templates", path: "/cover-letter/templates" },
];

/** Read from the descriptors the builder actually renders, so this page can't
 *  come to promise designs the picker doesn't have. */
const DESIGNS = LETTER_TEMPLATES;

export default function CoverLetterTemplatesPage() {
  return (
    <ContentPage surface="white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Cover letter templates",
              description: metadata.description,
              url: abs("/cover-letter/templates"),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: LETTER_TEMPLATES.length,
                itemListElement: LETTER_TEMPLATES.map((template, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: `${template.name} cover letter template`,
                  description: template.description,
                  url: abs(`/cover-letter/templates/${template.id}`),
                })),
              },
            },
            faqPage(TEMPLATE_FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Cover letter templates"
          intro={`${DESIGNS.length} designs, every one a live render rather than a mock-up. Pick one now and change your mind later: switching design re-renders what you've written rather than starting it over. Then scroll past them — a letter is judged on the argument it makes, and the five that matter are written out below.`}
        />

        <div className="mt-6 flex flex-nowrap gap-3 sm:mt-8 sm:flex-wrap">
          <Link href="/cover-letters" className={cn(btnPrimary, btnCompact)}>
            Start a cover letter
          </Link>
          <Link
            href="/cover-letter/examples"
            className={cn(btnQuiet, btnCompact)}
          >
            See full examples
          </Link>
        </div>

        <LetterTemplateGallery />

        {/* The filter buttons above are client state and can't be linked to or
            crawled. The families are the same set cut a different way, and
            each design sits in exactly one of them. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Browse by set
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LETTER_FAMILIES.map((family) => (
              <div key={family.id} className={cn(panelFlat, "px-5 py-4")}>
                <span className="block text-[15px] font-extrabold text-ink">
                  {family.label}
                </span>
                <span className="mt-1 block text-[13px] font-semibold text-ink-faint">
                  {letterFamily(family.id).length} designs
                </span>
                <span className="mt-2 block text-[13.5px] leading-relaxed text-ink-soft">
                  {family.blurb}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Choosing between them
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            The design is the smallest decision on this page. Nobody has been
            hired for their letterhead, and the half-second a design buys you is
            spent the moment the first sentence starts. What it can do is match
            the resume behind it — the builder inherits your typeface, accent
            colour and margins from whichever resume you draft against, so the
            two arrive looking like one application.
          </p>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            If the letter is going into a plain-text box rather than being
            attached — which is how a lot of applications actually arrive — take
            anything from the plain set and spend the time on the opening
            paragraph instead. That is the part that survives losing all its
            formatting.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            The structure, once
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            Underneath every pattern below is the same four paragraphs. If you
            only take one thing from this page, take this:
          </p>
          <ol className="mt-5 grid gap-3 md:grid-cols-2">
            {LETTER_PARTS.map((part, i) => (
              <li key={part.name} className={cn(panel, "px-6 py-5")}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[13px] font-bold text-ink-faint">
                    {i + 1}
                  </span>
                  <h3 className="text-[16.5px] font-extrabold text-ink">
                    {part.name}
                  </h3>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {part.purpose}
                </p>
              </li>
            ))}
          </ol>
          <p className={cn("mt-5 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            The{" "}
            <Link
              href="/cover-letter"
              className="font-bold text-brand underline underline-offset-4"
            >
              hub page
            </Link>{" "}
            covers what each paragraph is for in detail, and how each one
            characteristically goes wrong.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Five situations, five arguments
          </h2>
          <div className="mt-6 space-y-5">
            {LETTER_PATTERNS.map((pattern) => (
              <article
                key={pattern.id}
                id={pattern.id}
                className={cn(panel, "scroll-mt-24 px-6 py-6")}
              >
                <h3 className="text-[19px] font-extrabold tracking-tight text-ink">
                  {pattern.situation}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed font-semibold text-ink-faint">
                  {pattern.when}
                </p>
                <ul className="mt-4 space-y-2">
                  {pattern.approach.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-cream px-5 py-4">
                  <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                    Opening paragraph
                  </p>
                  <p className="mt-2.5 text-[15.5px] leading-[1.7] text-ink">
                    {pattern.opening}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqAccordion entries={TEMPLATE_FAQS} />
        </section>

        <ContentCta
          flat
          heading="Write it in the editor"
          body="Pick a design, draft from your resume, and export a real-text PDF that matches it."
        />
      </Column>
    </ContentPage>
  );
}
