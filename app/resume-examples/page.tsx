import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqAccordion,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { ExampleGallery } from "@/components/content/ExampleGallery";
import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  panelFlat,
} from "@/components/landing/ui";
import { exampleArt } from "@/lib/content/example-art";
import type { FaqEntry } from "@/lib/content/guides";
import {
  EXAMPLES_BY_CATEGORY,
  RESUME_EXAMPLES,
} from "@/lib/content/resume-examples";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

/** The year the title advertises.
 *
 *  Derived rather than typed, because a hardcoded "(2026)" is still sitting
 *  there in March 2027 telling everyone the page is a year stale — and the
 *  count beside it went wrong the moment an example was added. Both now come
 *  from the source. This is evaluated at build time, so a redeploy rolls the
 *  year over; the content is rebuilt often enough that this is the right
 *  tradeoff against making the page dynamic. */
const YEAR = new Date().getUTCFullYear();

export const metadata: Metadata = {
  title: `Resume & CV Examples for ${RESUME_EXAMPLES.length} Jobs (${YEAR}) | meniacv`,
  description:
    "Full resume and CV examples for software developers, nurses, marketers, analysts and more — each with sample bullet points, ATS keywords and the mistakes that cost interviews.",
  alternates: { canonical: "/resume-examples" },
};

/** Advice about using examples at all, which is a question people genuinely
 *  have and which no individual role page is the right place to answer. */
const HOW_TO_USE: { heading: string; body: string }[] = [
  {
    heading: "Copy the structure, not the sentences",
    body: "Every example here is written to a pattern: what you owned, what you did, and the number that moved. That pattern transfers to any job. The wording shouldn't — a recruiter who has read forty resumes this week recognises borrowed phrasing immediately, and it reads worse than plain language of your own.",
  },
  {
    heading: "Steal the metrics you'd forgotten you had",
    body: "The most useful part of a good example is the reminder that a number exists. Most people have a dozen quantifiable results in their history and put none of them on the page. Read the example for your role and treat each metric as a prompt: do I know this figure for my own work?",
  },
  {
    heading: "Match the example to the posting, not to your job title",
    body: "Titles are inconsistent between companies. If your title is Software Engineer but the posting describes frontend work, the frontend example is the one to follow. Read the posting's own language and lead with whichever half of your experience it actually asks for.",
  },
  {
    heading: "Keep every claim defensible",
    body: "The keyword banks on these pages are there to be selected from, not copied wholesale. A skill you can't discuss for two minutes in an interview is worse than a gap, because it converts an unknown into a demonstrated overstatement.",
  },
];

const FAQS: FaqEntry[] = [
  {
    question: "Are these resume examples free to use?",
    answer:
      "Yes. Every example on this site is free to read, and every template is free to use in the editor with unlimited PDF exports and no watermark. There's no paywall between you and a finished resume.",
  },
  {
    question: "Should I copy a resume example word for word?",
    answer:
      "No. Copy the structure — the way bullets lead with ownership and end with a result — and write the content from your own work. Recruiters read hundreds of resumes and recognise template language, and a generic page performs worse than a plain one written honestly.",
  },
  {
    question: "How long should my resume be?",
    answer:
      "One page for most people up to about eight to ten years of experience, two once you have enough substance that the second page isn't padding. Nursing, academia and senior technical roles routinely run to two pages; early-career resumes almost never should.",
  },
  {
    question: "Will these examples pass an applicant tracking system?",
    answer:
      "The structure will. Every example uses standard section headings, a single column of content, real text rather than images, and conventional date formats — which is what parsers need. The other half is keyword relevance to the specific posting, which is why each page includes a keyword bank for its role.",
  },
  {
    question: "What if my job isn't listed here?",
    answer:
      "Use the closest example in the same field — the writing pattern is the transferable part, and the advice about metrics, scope and keywords applies to essentially any role. The general guides cover the rest, and the ATS score tool reviews whatever you write regardless of job title.",
  },
  {
    question: "Do I need a different resume for every application?",
    answer:
      "Not a different resume, but a tailored one. Change the summary, reorder the skills to match the posting's priorities, and promote the bullets that match what's being asked for. That's usually fifteen minutes of work and it's the single highest-return thing you can do.",
  },
];

const TRAIL = [HOME, { name: "Resume examples", path: "/resume-examples" }];

export default function ResumeExamplesIndexPage() {
  return (
    <ContentPage surface="white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Resume examples",
              description: metadata.description,
              url: abs("/resume-examples"),
              hasPart: RESUME_EXAMPLES.map((example) => ({
                "@type": "Article",
                headline: `${example.role} resume example`,
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
        {/* The same hero as /resume-templates: what the page is on the left,
            what it looks like on the right, and one column on a phone. */}
        <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          <div>
            <PageHeader
              title="Resume &amp; CV examples"
              intro="A complete, rendered resume for each of these jobs — not a fragment, and not a stock photo of one. Each page also carries the bullet-point patterns that work in that field, the keywords an applicant tracking system is matching against, and the mistakes that quietly cost people interviews."
            />

            <div className="mt-6 flex flex-nowrap gap-3 sm:mt-8 sm:flex-wrap">
              <Link href="/dashboard" className={cn(btnPrimary, btnCompact)}>
                Start your resume
              </Link>
              <Link
                href="/resume-ats-score"
                className={cn(btnQuiet, btnCompact)}
              >
                Check your ATS score
              </Link>
            </div>
          </div>

          {/* Decorative: the examples themselves are the illustration, and
              they're a scroll away. Cropped to the middle 80% of the square
              and multiplied into the page for the same reasons as the
              templates hero — see that page. */}
          <Image
            src="/images/examples-hero.png"
            alt=""
            width={1254}
            height={1254}
            priority
            sizes="(min-width: 1024px) 330px, 60vw"
            className="mx-auto aspect-[1254/1003] w-full max-w-[330px] max-lg:hidden object-cover object-center mix-blend-multiply [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
          />
        </div>

        {/* Tabs rather than six stacked sections: the fields are alternatives,
            and a reader wants theirs, not a scroll past four others. Only what
            a card prints crosses into the client — see ExampleGallery. */}
        <ExampleGallery
          groups={EXAMPLES_BY_CATEGORY.map((group) => ({
            id: group.id,
            label: group.label,
            blurb: group.blurb,
            examples: group.examples.map((example) => ({
              slug: example.slug,
              role: example.role,
              aka: example.aka.join(" · "),
              art: exampleArt(example.slug),
            })),
          }))}
        />

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            How to use a resume example without sounding like one
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {HOW_TO_USE.map((item) => (
              <div key={item.heading} className={cn(panelFlat, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {item.heading}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqAccordion entries={FAQS} />
        </section>

        <ContentCta flat />
      </Column>
    </ContentPage>
  );
}
