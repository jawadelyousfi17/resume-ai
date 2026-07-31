import type { Metadata } from "next";
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
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import {
  LETTER_PARTS,
  LETTER_PATTERNS,
  TEMPLATE_FAQS,
} from "@/lib/content/cover-letters";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cover Letter Templates — Free Structures for Any Situation | meniacv",
  description:
    "Free cover letter templates: the standard application, career change, no experience, referral and speculative. The structure that works, with a written opening for each.",
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

/** The three header layouts the letter builder actually offers. Naming them
 *  honestly matters — a page promising a gallery of designs would be selling a
 *  picker that doesn't exist. */
const HEADER_STYLES: { name: string; detail: string }[] = [
  {
    name: "Stacked",
    detail:
      "Your name and contact details in a block at the top left, the recipient beneath. The conventional business-letter arrangement, and the safest choice for formal fields.",
  },
  {
    name: "Banner",
    detail:
      "Name across a tinted band in your accent colour, contact details beneath it. Matches the resume templates with banded headers, and pairs a letter to a resume visually.",
  },
  {
    name: "Minimal",
    detail:
      "Name and a single contact line, nothing else. Best when the letter is going into a plain-text paste box, or when you want the first thing read to be the opening sentence.",
  },
];

export default function CoverLetterTemplatesPage() {
  return (
    <ContentPage>
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
                numberOfItems: LETTER_PATTERNS.length,
                itemListElement: LETTER_PATTERNS.map((pattern, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: pattern.situation,
                  description: pattern.when,
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
          intro="A cover letter has one layout and it has not changed in decades — which means a template's value isn't in its design, it's in the shape of the argument. These are the five situations that need a different argument, each with a written opening you can work from."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Start a cover letter
          </Link>
          <Link href="/cover-letter/examples" className={btnQuiet}>
            See full examples
          </Link>
        </div>

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
            Header layouts
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            The letter builder offers three ways to set the top of the page.
            Everything else — typeface, accent colour, size, spacing and margins
            — is inherited from the resume you draft the letter against, so the
            two documents match without any work.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {HEADER_STYLES.map((style) => (
              <div key={style.name} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {style.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {style.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={TEMPLATE_FAQS} />
        </section>

        <ContentCta
          heading="Write it in the editor"
          body="Pick a header, draft from your resume, and export a real-text PDF that matches it."
        />
      </Column>
    </ContentPage>
  );
}
