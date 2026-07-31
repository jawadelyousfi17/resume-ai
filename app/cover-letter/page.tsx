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
  HUB_FAQS,
  LETTER_PARTS,
} from "@/lib/content/cover-letters";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How to Write a Cover Letter — Structure, Examples and Templates | meniacv",
  description:
    "What a cover letter is actually for, the four paragraphs that work, when it's worth writing one at all, and full examples by role. Free cover letter builder with AI writing help.",
  keywords: [
    "cover letter",
    "how to write a cover letter",
    "cover letter format",
    "cover letter structure",
    "what is a cover letter",
  ],
  alternates: { canonical: "/cover-letter" },
};

const TRAIL = [HOME, { name: "Cover letters", path: "/cover-letter" }];

const UPDATED = "2026-07-31";

/** When it's worth the half hour and when it isn't. Being straight about this
 *  is more useful than insisting every application needs one. */
const WORTH_IT: { verdict: string; cases: string[] }[] = [
  {
    verdict: "Write one",
    cases: [
      "The posting asks for it — this is a filter, and skipping it fails before anyone reads your resume",
      "You're changing field or job title and the jump needs explaining",
      "There's a gap, a short tenure, or a relocation that raises an obvious question",
      "Someone referred you and their name belongs in the first sentence",
      "The role is competitive enough that a marginal effort is worth making",
      "You're writing on spec, where the letter is the entire application",
    ],
  },
  {
    verdict: "Skip it",
    cases: [
      "A high-volume portal application to a role you already match exactly",
      "The posting says not to send one",
      "You'd be writing something generic — a form letter is worse than no letter",
      "You have an hour and your bullet points still don't have results in them; fix those first",
    ],
  },
];

export default function CoverLetterHubPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: "How to write a cover letter",
              description: metadata.description,
              datePublished: UPDATED,
              dateModified: UPDATED,
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              mainEntityOfPage: abs("/cover-letter"),
            },
            faqPage(HUB_FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Cover letters"
          intro="A cover letter does the one thing a resume structurally can't: connect a specific thing you did to a specific thing this employer needs, and explain anything that would otherwise raise a question. That's the whole job. Everything below is about doing it in under 350 words."
          updated={UPDATED}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Write a cover letter
          </Link>
          <Link href="/cover-letter/examples" className={btnQuiet}>
            See examples
          </Link>
          <Link href="/cover-letter/templates" className={btnQuiet}>
            Templates
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Is it worth writing one?
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            Not always, and advice that says otherwise is wasting your time. A
            cover letter is roughly half an hour done properly. Here is where
            that half hour returns something and where it doesn&rsquo;t.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {WORTH_IT.map((column) => (
              <div key={column.verdict} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {column.verdict}
                </h3>
                <ul className="mt-3 space-y-2">
                  {column.cases.map((item) => (
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
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            The four paragraphs
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            Every letter on this site follows the same shape, because it is the
            shape that survives being skimmed. Each part has one job, and each
            has a characteristic way of going wrong.
          </p>
          <div className="mt-6 space-y-4">
            {LETTER_PARTS.map((part, i) => (
              <div key={part.name} className={cn(panel, "px-6 py-5")}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[13px] font-bold text-ink-faint">
                    {i + 1}
                  </span>
                  <h3 className="text-[17px] font-extrabold text-ink">
                    {part.name}
                  </h3>
                </div>
                <p className="mt-2 text-[15.5px] leading-relaxed font-semibold text-ink">
                  {part.purpose}
                </p>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {part.detail}
                </p>
                <p className="mt-3 border-l-2 border-field-border pl-4 text-[14.5px] leading-relaxed text-ink-faint">
                  <span className="font-bold">How it goes wrong: </span>
                  {part.failure}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Examples by role
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            Full letters, each paired with the resume example for the same role
            so you can see how the two documents divide the work between them.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COVER_LETTER_EXAMPLES.map((example) => (
              <Link
                key={example.id}
                href={`/cover-letter/examples#${example.id}`}
                className={cn(panel, "px-5 py-4 transition hover:ring-ink/15")}
              >
                <span className="block text-[15px] font-extrabold text-ink">
                  {example.role}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                  {example.note}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={HUB_FAQS} />
        </section>

        <ContentCta
          heading="Draft it from your resume"
          body="The assistant writes from what's already in your resume, so the letter starts with your actual history rather than a blank page."
        />
      </Column>
    </ContentPage>
  );
}
