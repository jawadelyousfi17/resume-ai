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
  COVER_LETTER_EXAMPLES,
  EXAMPLE_FAQS,
} from "@/lib/content/cover-letters";
import { getExample } from "@/lib/content/resume-examples";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { CURRENT_YEAR } from "@/lib/seo/year";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Cover Letter Examples — Full Letters by Job (${CURRENT_YEAR}) | meniacv`,
  description:
    "Complete cover letter examples for software engineers, nurses, product managers, marketers, teachers and support roles — each paired with a matching resume example.",
  keywords: [
    "cover letter examples",
    "cover letter sample",
    "example cover letter",
    "cover letter for job application",
  ],
  alternates: { canonical: "/cover-letter/examples" },
};

const TRAIL = [
  HOME,
  { name: "Cover letters", path: "/cover-letter" },
  { name: "Examples", path: "/cover-letter/examples" },
];

export default function CoverLetterExamplesPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Cover letter examples",
              description: metadata.description,
              url: abs("/cover-letter/examples"),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: COVER_LETTER_EXAMPLES.length,
                itemListElement: COVER_LETTER_EXAMPLES.map((example, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: `${example.role} cover letter example`,
                  url: abs(`/cover-letter/examples#${example.id}`),
                })),
              },
            },
            faqPage(EXAMPLE_FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Cover letter examples"
          intro="Complete letters, not fragments. Each one follows the same four paragraphs, each contains a story with a number in it, and each has a paragraph about the employer that could not be pasted into a letter to anyone else — which is the entire difference between a letter that helps and one that wastes your afternoon."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Write yours
          </Link>
          <Link href="/cover-letter/templates" className={btnQuiet}>
            Templates by situation
          </Link>
        </div>

        <nav aria-label="Examples" className="mt-10">
          <ul className="flex flex-wrap gap-2.5">
            {COVER_LETTER_EXAMPLES.map((example) => (
              <li key={example.id}>
                <a
                  href={`#${example.id}`}
                  className={cn(
                    panel,
                    "inline-flex px-4 py-2 text-[14px] font-bold text-ink transition hover:ring-ink/15",
                  )}
                >
                  {example.role}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-8">
          {COVER_LETTER_EXAMPLES.map((example) => {
            const resume = getExample(example.resumeSlug);
            return (
              <article
                key={example.id}
                id={example.id}
                className="scroll-mt-24"
              >
                <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
                  {example.role} cover letter
                </h2>
                <p
                  className={cn(
                    "mt-2 text-[15px] leading-relaxed text-ink-soft",
                    measure,
                  )}
                >
                  {example.note}
                </p>

                {/* The letter itself, set on paper rather than in a panel, so it
                    reads as the document it is. */}
                <div className="mt-5 rounded-xl bg-white px-7 py-8 shadow-[var(--shadow-paper)] ring-1 ring-black/5 sm:px-10 sm:py-10">
                  <p className="text-[15.5px] leading-[1.75] text-ink">
                    {example.greeting}
                  </p>
                  {example.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-4 text-[15.5px] leading-[1.8] text-ink"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <p className="mt-6 text-[15.5px] leading-[1.75] text-ink">
                    {example.closing}
                  </p>
                  <p className="mt-1 text-[15.5px] leading-[1.75] font-semibold text-ink">
                    [Your name]
                  </p>
                </div>

                {resume && (
                  <p className="mt-3 text-[14.5px] text-ink-soft">
                    Pairs with the{" "}
                    <Link
                      href={`/resume-examples/${resume.slug}`}
                      className="font-bold text-brand underline underline-offset-4"
                    >
                      {resume.role.toLowerCase()} resume example
                    </Link>
                    .
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={EXAMPLE_FAQS} />
        </section>

        <ContentCta
          heading="Draft yours from your resume"
          body="The assistant starts from what you've already written, so the letter has your real history in it rather than a blank page."
        />
      </Column>
    </ContentPage>
  );
}
