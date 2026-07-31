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
import type { FaqEntry } from "@/lib/content/guides";
import {
  EXAMPLES_BY_CATEGORY,
  RESUME_EXAMPLES,
} from "@/lib/content/resume-examples";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CV Examples — Full CVs by Job, UK and European Formats | meniacv",
  description:
    "Complete CV examples for every major role, with the conventions each country expects — length, photo, personal details — and the bullet-point patterns that work.",
  keywords: [
    "cv examples",
    "cv example",
    "cv samples",
    "curriculum vitae example",
    "cv examples uk",
  ],
  alternates: { canonical: "/cv-examples" },
};

const TRAIL = [HOME, { name: "CV examples", path: "/cv-examples" }];

/** What changes between a UK CV, a continental one and a US resume. The
 *  documents below are the same content; this is what you adjust. */
const BY_REGION: { region: string; length: string; photo: string; note: string }[] = [
  {
    region: "UK & Ireland",
    length: "Two pages",
    photo: "No photo",
    note: "Identical in substance to a US resume. No date of birth, no marital status, no nationality. Referees available on request, and don't list them.",
  },
  {
    region: "Germany & Austria",
    length: "Two pages, sometimes more",
    photo: "Photo expected",
    note: "A Lebenslauf is closer to a complete record than an edited highlight reel. Gaps are expected to be accounted for rather than closed quietly, and a signed, dated version is still common.",
  },
  {
    region: "France",
    length: "One page",
    photo: "Photo usual",
    note: "Noticeably more formal in register than a British CV, and more compressed. Personal details at the top; a short accroche in place of a long summary.",
  },
  {
    region: "Netherlands & Nordics",
    length: "Two pages",
    photo: "Photo optional",
    note: "Direct and plainly written. The Dutch in particular read an over-polished CV with suspicion, so understatement works better here than anywhere else on this list.",
  },
  {
    region: "US & Canada",
    length: "One page, two if senior",
    photo: "Never",
    note: "Say resume, not CV — outside academia, a CV means something else entirely and sending fifteen pages ends the application.",
  },
];

const FAQS: FaqEntry[] = [
  {
    question: "Are a CV example and a resume example the same thing?",
    answer:
      "In the UK, Ireland and Australia, yes — the documents below are exactly what those markets mean by a CV. In continental Europe you would add a photo and some personal details. In the US and Canada, a CV means an exhaustive academic record, which is a genuinely different document from any of these.",
  },
  {
    question: "How long should a CV be?",
    answer:
      "Two pages for almost every non-academic application, one if you are early career, and one for France specifically. An academic CV has no upper limit because its purpose is completeness rather than persuasion — every publication, grant and conference, with no editing for brevity.",
  },
  {
    question: "Should I copy a CV example word for word?",
    answer:
      "No. Copy the structure — bullets that lead with what you owned and end with what changed — and write the content from your own history. Recruiters read hundreds of these and recognise borrowed phrasing immediately; it reads worse than plain language of your own.",
  },
  {
    question: "What personal details go on a CV?",
    answer:
      "Name, phone, email, city and a professional link, everywhere. Add a photo, date of birth and nationality for most of continental Europe. Never include your full street address, your marital status or your ID number for a UK, Irish or North American application — and never include a national insurance or social security number anywhere.",
  },
  {
    question: "What if my job isn't listed?",
    answer:
      "Use the closest one in the same field. The transferable part is the writing pattern rather than the job title, and the advice about metrics, scope and keywords applies to essentially any role.",
  },
];

export default function CvExamplesPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "CV examples",
              description: metadata.description,
              url: abs("/cv-examples"),
              hasPart: RESUME_EXAMPLES.map((example) => ({
                "@type": "Article",
                headline: `${example.role} CV example`,
                description: example.description,
                url: abs(`/resume-examples/${example.slug}`),
              })),
            },
            faqPage(FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="CV examples"
          intro="A complete, rendered document for each of these jobs. In the UK, Ireland and Australia these are CVs in the ordinary sense of the word; for a continental application you would add a photo and a few personal details, and the table below says exactly which. Nothing here is a fragment or a stock photo of one."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Build your CV
          </Link>
          <Link href="/cv-templates" className={btnQuiet}>
            CV templates
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            What to change by country
          </h2>
          <p className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}>
            The content of these examples travels. The conventions around it do
            not, and getting them wrong is the kind of error that gets noticed
            before anything you wrote does.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {BY_REGION.map((row) => (
              <div key={row.region} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {row.region}
                </h3>
                <p className="mt-1.5 text-[13px] font-bold text-ink-faint">
                  {row.length} · {row.photo}
                </p>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {row.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {EXAMPLES_BY_CATEGORY.map((group) => (
          <section key={group.id} className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {group.label}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {group.blurb}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.examples.map((example) => (
                <Link
                  key={example.slug}
                  href={`/resume-examples/${example.slug}`}
                  className={cn(panel, "px-6 py-5 transition hover:ring-ink/15")}
                >
                  <span className="block text-[17px] leading-snug font-extrabold text-ink">
                    {example.role}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] font-semibold text-ink-faint">
                    {example.aka.join(" · ")}
                  </span>
                  <span className="mt-2.5 block text-[14px] leading-relaxed text-ink-soft">
                    {example.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={FAQS} />
        </section>

        <ContentCta
          heading="Build it in the editor"
          body="One document, exported per market — change the length and the personal details rather than maintaining several files."
        />
      </Column>
    </ContentPage>
  );
}
