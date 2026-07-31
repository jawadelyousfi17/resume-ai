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
} from "@/components/content/ContentShell";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import { REVIEW_CATEGORIES } from "@/lib/ai/review";
import type { FaqEntry } from "@/lib/content/guides";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { CURRENT_YEAR } from "@/lib/seo/year";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Resume ATS Score — Check How Your Resume Scores (${CURRENT_YEAR}) | meniacv`,
  description:
    "What an ATS score actually measures, what applicant tracking systems really do with your resume, and how to raise your score on formatting, keywords and impact.",
  keywords: [
    "resume ats score",
    "ats score checker",
    "ats resume checker",
    "check ats score",
    "ats resume test",
    "applicant tracking system score",
  ],
  alternates: { canonical: "/resume-ats-score" },
};

/** What a parser does with the page, in the order it does it. This is the
 *  part most advice skips, and it's what makes the formatting rules obvious
 *  rather than arbitrary. */
const PARSE_STEPS: { step: string; detail: string }[] = [
  {
    step: "Extracts the text",
    detail:
      "The PDF is read as a stream of characters. Anything that isn't text — a logo, an icon, a skills chart, a headshot, a name inside an image — contributes nothing at all, because there is nothing there to extract.",
  },
  {
    step: "Finds the sections",
    detail:
      "It looks for headings it recognises: Experience, Education, Skills. Invent a heading — \"Where I've Made an Impact\" — and the content underneath it may land nowhere, or in the wrong field.",
  },
  {
    step: "Splits your history into records",
    detail:
      "Each job becomes a row with a title, an employer and a date range. This is the step that breaks most often, and it's why unusual date formats and two-column layouts cause real damage.",
  },
  {
    step: "Matches against the posting",
    detail:
      "The parsed text is compared to the requisition — skills, titles, tools, years. This produces the ranking a recruiter sorts by, which is the closest thing to an actual \"ATS score\".",
  },
  {
    step: "Hands a human a sorted list",
    detail:
      "A recruiter opens the top of the pile and reads. Nothing was auto-rejected; you were simply ranked below the people who read as a closer match, and nobody got as far as your resume.",
  },
];

/** The scoring rubric, in plain language. Mirrors REVIEW_CATEGORIES so the
 *  page can't describe a category the product doesn't score. */
const CATEGORY_ADVICE: Record<string, string> = {
  impact:
    "Does each bullet end in a result? Scope, numbers and outcomes score; a list of responsibilities doesn't. This is the category most resumes lose the most points on, and the easiest to fix in an afternoon.",
  clarity:
    "Can a stranger skim the page in ten seconds and know what you do? Long paragraphs, buried job titles, jargon from one company's internal vocabulary, and sentences that take two readings all cost you here.",
  completeness:
    "Is anything missing that a recruiter would go looking for — dates, locations, a summary, education, a link? Gaps in the record are read as omissions, and unexplained ones raise questions you're not there to answer.",
  language:
    "Typos, tense that shifts mid-bullet, inconsistent punctuation, and agreement errors. This is the category with the least excuse and the most damage per instance, because it's read as carelessness rather than as inexperience.",
  ats: "Does the document parse cleanly, and does it use the words the field uses? Single column, standard headings, real text, conventional dates — plus the vocabulary of the posting you're actually answering.",
};

/** Concrete, checkable formatting rules. */
const FORMAT_RULES: { rule: string; why: string }[] = [
  {
    rule: "One column of content",
    why: "A two-column layout can be read left-to-right across both columns, interleaving your skills into the middle of a job description. It's the single most common cause of a mangled parse.",
  },
  {
    rule: "Standard section headings",
    why: "\"Experience\", \"Education\", \"Skills\". A parser matches on these strings; a creative heading may leave everything beneath it unclassified.",
  },
  {
    rule: "Real text, never images",
    why: "Text inside a graphic is invisible to every parser. If your name, contact details or skills sit inside an image, they don't exist as far as the system is concerned.",
  },
  {
    rule: "Consistent, conventional dates",
    why: "\"Mar 2022 – Present\" parses reliably. Mixed formats, seasons, or a date range written only in a graphic timeline frequently don't, and a job with no parsed dates can drop out of the record entirely.",
  },
  {
    rule: "PDF, unless told otherwise",
    why: "Modern systems read PDF fine and it preserves your layout. Send the format the posting asks for when it asks; export from a real editor rather than scanning or screenshotting.",
  },
  {
    rule: "Job titles a human would recognise",
    why: "\"Growth Ninja\" matches nothing. If your internal title is unusual, put the conventional equivalent on the page and keep the real one alongside it if you like.",
  },
  {
    rule: "No headers, footers or text boxes for anything important",
    why: "Content in a document header or a floating text box is often dropped. Contact details are the usual casualty, which turns a good application into an unreachable one.",
  },
  {
    rule: "Spell out acronyms once",
    why: "A posting may search for \"Search Engine Optimisation\" while you wrote \"SEO\", or the reverse. Writing \"SEO (search engine optimisation)\" once matches both without padding the page.",
  },
];

const FAQS: FaqEntry[] = [
  {
    question: "What is a good ATS score?",
    answer:
      "There's no universal number, because no two applicant tracking systems score the same way and most don't produce a score you'd ever see. A score from a checker like ours is a proxy: it tells you whether your resume parses cleanly and reads well against the role. Above 80 means the document isn't holding you back; below 60 usually means something structural is wrong.",
  },
  {
    question: "Do applicant tracking systems really reject resumes automatically?",
    answer:
      "Almost never automatically, despite how often that's claimed. The system parses your resume, ranks it against the requisition, and shows a recruiter a sorted list. The real failure mode isn't rejection — it's a bad parse that loses your job titles or dates, leaving you unrankable and therefore unread.",
  },
  {
    question: "How do I check my resume's ATS score for free?",
    answer:
      "Building, previewing and exporting a resume on meniacv is free. The scored AI review — the part that reads the whole page and grades it across five categories — is part of the Basic plan at $9 a month, or $3 a month billed yearly. You can also self-check most of it: save your PDF, copy all the text out of it, and paste it into a plain text file. What survives is roughly what a parser sees.",
  },
  {
    question: "Does using a template hurt my ATS score?",
    answer:
      "Not inherently — it depends entirely on the template's structure. Every template on meniacv renders as real text in a parseable structure, and the plainer single-column ones are the safest choice for heavily automated pipelines. What causes problems is text inside images, columns that interleave, and decorative charts standing in for words.",
  },
  {
    question: "How many keywords should I include?",
    answer:
      "Enough to match the posting honestly, and no more. Keyword stuffing is detectable by any human reader and increasingly by the systems themselves, and it wastes the space that should be carrying your results. Take the terms that are genuinely true of you, put them where they belong in context, and stop.",
  },
  {
    question: "Should I use the exact wording from the job posting?",
    answer:
      "For skills, tools and titles, yes — matching the posting's vocabulary is precisely what improves ranking, and it costs nothing to write \"PostgreSQL\" where you'd have written \"Postgres\". Don't copy whole responsibility sentences from the posting into your experience, though; that reads as mimicry to the human who follows.",
  },
  {
    question: "Will a photo lower my ATS score?",
    answer:
      "It contributes nothing to the parse and, in the US, UK and Canada, many employers prefer resumes without one for bias reasons. In much of continental Europe a photo is conventional. Follow the norm where you're applying, and never put text inside the image.",
  },
];

const TRAIL = [HOME, { name: "Resume ATS score", path: "/resume-ats-score" }];

export default function ResumeAtsScorePage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: "Resume ATS score: what it measures and how to raise it",
              description: metadata.description,
              datePublished: "2026-07-29",
              dateModified: "2026-07-29",
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              mainEntityOfPage: abs("/resume-ats-score"),
            },
            faqPage(FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Resume ATS score"
          intro="Most of what's written about applicant tracking systems is wrong, and the wrong parts make people anxious about things that don't matter while ignoring the one that does. Here's what these systems actually do to your resume, what a score is really measuring, and how to raise yours."
          updated="2026-07-29"
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Score my resume
          </Link>
          <Link href="/guides/ats-friendly-resume" className={btnQuiet}>
            Read the ATS guide
          </Link>
        </div>

        <article className="mt-12 max-w-[72ch] space-y-4">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            What an &ldquo;ATS score&rdquo; actually is
          </h2>
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            No applicant tracking system hands you a score. What they produce
            internally is a ranking: your resume is parsed into structured
            fields, compared against the requisition, and placed in an ordered
            list that a recruiter works down from the top. There is no number,
            no threshold, and in almost every case no automatic rejection.
          </p>
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            So a score from any checker — ours included — is a proxy. It answers
            two questions that genuinely determine whether you get read: does
            this document survive being taken apart by a machine, and does it
            read as a strong match once a person opens it? Both are worth
            measuring. Neither is a secret number inside the employer&rsquo;s
            software.
          </p>
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            That distinction matters because it changes what you should work on.
            The anxious version of ATS advice has people stripping their resume
            of anything visual and stuffing it with keywords. The useful version
            is narrower: make the structure boring, make the words match the
            posting, and spend the rest of your effort on the part a human
            reads.
          </p>
        </article>

        {/* The parse, step by step. Makes the formatting rules obvious rather
            than a list of superstitions to memorise. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            What happens to your resume, in order
          </h2>
          <ol className="mt-6 space-y-3">
            {PARSE_STEPS.map((item, i) => (
              <li
                key={item.step}
                className={cn(panel, "flex gap-5 px-6 py-5")}
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[26px] leading-none font-extrabold text-brand/30"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16.5px] font-extrabold text-ink">
                    {item.step}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-[72ch] text-[15px] leading-relaxed text-ink-faint">
            Step three is where resumes are quietly lost. A layout that
            interleaves columns, or dates a parser can&rsquo;t read, produces a
            record with missing employers and no timeline — and a candidate with
            no parsed history ranks below everyone whose history parsed.
          </p>
        </section>

        {/* The rubric, straight from what the product scores. */}
        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            The five things we score, and how to win points on each
          </h2>
          <p className="mt-3 max-w-[72ch] text-[16px] leading-[1.75] text-ink-soft">
            The AI review in the editor reads your whole resume and grades it
            out of 100 overall, plus a score in each of these five categories
            with a sentence on why it isn&rsquo;t higher. Formatting is only one
            of the five, which is roughly the weight it deserves.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {REVIEW_CATEGORIES.map((category) => (
              <div key={category.id} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {category.label}
                </h3>
                <p className="mt-1 text-[13.5px] font-semibold text-brand">
                  {category.blurb}
                </p>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {CATEGORY_ADVICE[category.id]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            The formatting rules that actually matter
          </h2>
          <p className="mt-3 max-w-[72ch] text-[16px] leading-[1.75] text-ink-soft">
            Eight rules, each with the reason attached — because a rule you
            understand is one you can apply to a case this list doesn&rsquo;t
            cover.
          </p>
          <dl className="mt-6 grid gap-3 md:grid-cols-2">
            {FORMAT_RULES.map((item) => (
              <div key={item.rule} className={cn(panel, "px-6 py-5")}>
                <dt className="text-[16px] font-extrabold text-ink">
                  {item.rule}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.why}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* The free manual test. Genuinely useful, and it costs us nothing to
            tell people how to do it without the product. */}
        <section className={cn(panel, "mt-16 px-7 py-7")}>
          <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-ink">
            The 30-second test you can run yourself, free
          </h2>
          <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
            Open your resume PDF, select all the text, and paste it into a plain
            text editor. What you get is approximately what a parser sees.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Is anything missing entirely? That content is inside an image, and no system will ever read it.",
              "Is the order scrambled — skills landing inside a job description? Your columns are interleaving.",
              "Are your job titles, employers and dates all present and adjacent to each other?",
              "Are your name, email and phone number in the text, rather than in a document header?",
            ].map((check) => (
              <li
                key={check}
                className="flex gap-3 text-[15.5px] leading-[1.7] text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                />
                {check}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-ink-faint">
            If all four pass, your resume parses. Everything left is about the
            writing — which is the half that decides whether the recruiter who
            opens it wants to talk to you.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Getting a score in the editor
          </h2>
          <div className="mt-5 max-w-[72ch] space-y-4">
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              The Review tab reads the whole document and returns a report:
              a score out of 100, the five category scores with a note on each,
              every spelling and grammar mistake it found quoted with the
              correction, and a prioritised list of what to fix first.
            </p>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              The proofreading notes are checked against your actual text
              before you see them, so a correction always points at something
              really on the page — an invented typo wastes more of your time
              than a missed one. Fixes can be applied in place, one at a time,
              so you stay in control of your own wording.
            </p>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              Writing, previewing and exporting a resume is free, with no
              watermark. The scored review comes with the Basic plan — $9 a
              month, or $3 a month billed yearly — alongside the AI writing
              tools and the ability to tailor a copy per role.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/dashboard" className={btnPrimary}>
              Score my resume
            </Link>
            <Link href="/pricing" className={btnQuiet}>
              See pricing
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            ATS score FAQs
          </h2>
          <FaqList entries={FAQS} />
        </section>

        {/* Where to go next. The ATS topic fans out into three pages, and a
            reader who landed here from search usually wants one of them. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Keep going
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/guides/ats-friendly-resume",
                title: "ATS-friendly resumes",
                body: "The formatting guide in full: what parses, what doesn't, and why.",
              },
              {
                href: "/resume-review",
                title: "Resume review",
                body: "What a useful critique covers, and how to read feedback without rewriting everything.",
              },
              {
                href: "/resume-examples",
                title: "Resume examples",
                body: "Full examples for 26 jobs, each with its own keyword bank.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(panel, "px-6 py-5 transition hover:ring-ink/15")}
              >
                <span className="block text-[16px] font-extrabold text-ink">
                  {item.title}
                </span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-soft">
                  {item.body}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <ContentCta
          heading="Fix it in the editor, then score it again"
          body="Live preview, AI help tightening every bullet, and an ATS-ready PDF. Free to start, and no card at any point."
        />
      </Column>
    </ContentPage>
  );
}
