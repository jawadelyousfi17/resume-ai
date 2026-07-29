import type { Metadata } from "next";
import Link from "next/link";

import {
  Column,
  ContentCta,
  ContentPage,
  FaqList,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import type { FaqEntry } from "@/lib/content/guides";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume Review — Get Your Resume Checked & Scored (2026) | meniacv",
  description:
    "What a useful resume review actually covers, a self-review checklist you can run in ten minutes, and how to act on feedback without rewriting the whole page.",
  keywords: [
    "resume review",
    "free resume review",
    "resume feedback",
    "resume critique",
    "resume checker",
    "get resume reviewed",
  ],
  alternates: { canonical: "/resume-review" },
};

/** The self-review pass, in the order that wastes the least effort. Ordering
 *  matters here: fixing commas on a bullet you're about to delete is the
 *  classic way to spend an hour and improve nothing. */
const PASSES: { title: string; question: string; detail: string }[] = [
  {
    title: "The ten-second pass",
    question: "Can a stranger tell what you do and how senior you are?",
    detail:
      "Look at the top third only. Your name, your title, your summary, and the first job. If those four don't establish what kind of work you want and roughly what level you're at, nothing further down will rescue it — a recruiter's first pass really is about this long.",
  },
  {
    title: "The so-what pass",
    question: "Does every bullet end in a result?",
    detail:
      "Read each bullet and ask what changed because of it. \"Responsible for the reporting pipeline\" answers nothing. \"Rebuilt the reporting pipeline, cutting the monthly close from nine days to three\" answers it completely. Any bullet with no answer either needs a number or needs cutting.",
  },
  {
    title: "The evidence pass",
    question: "Could you defend each claim for two minutes?",
    detail:
      "Point at where every fact came from. A skill you can't discuss, a metric you can't source, a tool you used once — each is a liability, because the interview is going to test exactly the things the resume asserts most confidently.",
  },
  {
    title: "The relevance pass",
    question: "Is the top of the page about the job you're applying for?",
    detail:
      "Read the posting, then your resume, and check that the first things a reader meets are the things the posting asks for. Reordering skills and promoting the right bullets takes fifteen minutes and does more than any rewrite.",
  },
  {
    title: "The cut pass",
    question: "What's the weakest 20% of this page?",
    detail:
      "Find it and delete it. The 2016 internship, the line about being a fast learner, the fourth bullet on your oldest job, the interests section. Space is the scarcest thing on a resume, and weak content doesn't just fail to help — it dilutes the strong lines around it.",
  },
  {
    title: "The proofreading pass",
    question: "Is anything actually misspelled or inconsistent?",
    detail:
      "Last, deliberately. Read it aloud, or read it backwards from the last bullet, which breaks the pattern-matching that makes you skip your own typos. Check tense consistency, punctuation at the end of bullets, and that dates and job titles are formatted the same way throughout.",
  },
];

/** Honest comparison. A page selling an AI review shouldn't pretend the
 *  alternatives don't have real advantages. */
const SOURCES: { source: string; good: string; limit: string }[] = [
  {
    source: "Someone who hires for your role",
    good: "The most valuable feedback available. They know what the market pays for, which claims sound inflated, and what their own screening process filters on.",
    limit: "Hard to get, slow, and a single person's taste. Ask two if you can, and weight agreement over any individual opinion.",
  },
  {
    source: "A friend outside your field",
    good: "Unbeatable for clarity. If they can't explain what you do after ten seconds, your jargon is a problem no domain expert would have noticed.",
    limit: "They can't judge whether your achievements are impressive, and they'll tend to reassure you rather than critique you.",
  },
  {
    source: "An AI review",
    good: "Immediate, consistent, unembarrassed, and repeatable — you can act on it and re-run it as many times as you like. Good at proofreading, at spotting bullets with no outcome, and at ranking what to fix first.",
    limit: "It doesn't know your industry's hiring politics or what your specific target company values. It reads the page, not the market.",
  },
  {
    source: "A paid resume writer",
    good: "Useful if writing is genuinely the blocker, and some are excellent at structure and positioning.",
    limit: "Expensive, variable in quality, and the result often reads in someone else's voice — which becomes a problem in the interview, where you have to sound like the person who wrote it.",
  },
];

const FAQS: FaqEntry[] = [
  {
    question: "How do I get a free resume review?",
    answer:
      "The self-review passes on this page are the same checks a good reviewer runs, and they cost nothing but ten minutes. Beyond that: ask someone who hires for your target role, post in a professional community in your field, or use the AI review in the editor. Building and exporting a resume on meniacv is free; the scored AI review is part of the Basic plan at $9 a month, or $3 a month billed yearly.",
  },
  {
    question: "What does a good resume review actually check?",
    answer:
      "Five things, in this order of importance: whether the top third establishes what you do, whether each bullet has a result in it, whether anything a recruiter needs is missing, whether the writing is clean, and whether the document parses and matches the posting. A review that only finds typos has looked at the least important layer.",
  },
  {
    question: "Is an AI resume review any good?",
    answer:
      "For proofreading, for finding bullets with no outcome, and for ranking what to fix first, it's genuinely useful and much faster than a person. What it can't do is tell you what your target company values or whether a claim will read as inflated in your specific industry. Use it for the document, and a human who hires in your field for the positioning.",
  },
  {
    question: "How is a review different from an ATS score?",
    answer:
      "An ATS score is mostly about whether the machine can read your resume and whether it matches the posting's vocabulary. A review is about whether a person who reads it wants to interview you. They overlap — our review scores both, with formatting as one of five categories — but the second question is the one that decides the outcome.",
  },
  {
    question: "How much feedback should I actually act on?",
    answer:
      "Take everything factual — typos, missing dates, unparseable formatting — without debate. Weight opinions on wording by whether the reviewer hires for your role. Where two reviewers disagree, keep your own version; a resume rewritten to satisfy every opinion ends up in nobody's voice, including yours.",
  },
  {
    question: "Should I have a different resume for each application?",
    answer:
      "Tailored, not different. Keep one strong master resume and adjust the summary, the order of your skills, and which bullets sit at the top of each role. That's fifteen minutes per application and it's the highest-return work available to you.",
  },
  {
    question: "How often should I review my resume?",
    answer:
      "Once before each application round, and once whenever something notable happens at work — a launch, a promotion, a number you'd otherwise forget. The second habit is the one that matters: most people lose their best material simply because they didn't write it down while it was fresh.",
  },
];

export default function ResumeReviewPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: "Resume review: how to check your own resume properly",
              description: metadata.description,
              datePublished: "2026-07-29",
              dateModified: "2026-07-29",
              author: { "@type": "Organization", name: "meniacv" },
              publisher: { "@type": "Organization", name: "meniacv" },
              mainEntityOfPage: "/resume-review",
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Resume review",
                  item: "/resume-review",
                },
              ],
            },
          ],
        }}
      />

      <Column>
        <PageHeader
          title="Resume review"
          intro="Nobody can read their own resume properly — you know what you meant, so you can't see what's actually on the page. This is how to get around that: six passes you can run yourself in ten minutes, what to ask of a human reviewer, and where an AI review genuinely helps."
          updated="2026-07-29"
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Review my resume
          </Link>
          <Link href="/resume-ats-score" className={btnQuiet}>
            Check the ATS score
          </Link>
        </div>

        <article className="mt-12 max-w-[72ch] space-y-4">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Why you can&rsquo;t review your own resume
          </h2>
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            You read your resume with all the context intact. You know that
            &ldquo;owned the migration&rdquo; meant eighteen months, four teams
            and a database nobody else would touch. A stranger reads four words
            and moves on. That gap — between what you know and what the page
            says — is where almost every resume problem lives, and it&rsquo;s
            invisible from the inside.
          </p>
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            The way around it is to stop reading and start testing. Each pass
            below asks one question and ignores everything else, which is what
            makes it possible to see the page as a document rather than as a
            memory. Run them in order: proofreading first is the classic
            mistake, because you end up polishing sentences you were about to
            delete.
          </p>
        </article>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Six passes, in this order
          </h2>
          <ol className="mt-6 space-y-3">
            {PASSES.map((pass, i) => (
              <li key={pass.title} className={cn(panel, "flex gap-5 px-6 py-5")}>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[26px] leading-none font-extrabold text-brand/30"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16.5px] font-extrabold text-ink">
                    {pass.title}
                  </h3>
                  <p className="mt-1 text-[14.5px] font-semibold text-brand">
                    {pass.question}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {pass.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Who to ask, and what each is good for
          </h2>
          <p className="mt-3 max-w-[72ch] text-[16px] leading-[1.75] text-ink-soft">
            Every source of feedback is strong at something and blind to
            something else. Knowing which is which is what stops you weighting a
            friend&rsquo;s opinion on your seniority the same as a hiring
            manager&rsquo;s.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {SOURCES.map((item) => (
              <div key={item.source} className={cn(panel, "px-6 py-5")}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {item.source}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                  <span className="font-bold text-ink">Good for: </span>
                  {item.good}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  <span className="font-bold text-ink">Blind to: </span>
                  {item.limit}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            How to ask for a review that&rsquo;s worth having
          </h2>
          <div className="mt-5 max-w-[72ch] space-y-4">
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              &ldquo;Can you look at my resume?&rdquo; reliably produces
              &ldquo;looks good!&rdquo;, because it asks for reassurance rather
              than for work. Ask a narrow question instead and you get a usable
              answer.
            </p>
            <ul className="space-y-2">
              {[
                "Send the posting alongside it, and ask whether the top third answers it.",
                "Ask which two bullets are weakest, and to name them. Forcing a ranking defeats politeness.",
                "Ask what they'd guess my job level is from this page — a mismatch tells you the scope isn't reading.",
                "Ask what they'd cut to save five lines. Cuts are easier to give honestly than criticism.",
                "Ask what question they'd ask me in an interview. If it's not something you want to discuss, the page is pointing the wrong way.",
              ].map((ask) => (
                <li
                  key={ask}
                  className="flex gap-3 text-[16px] leading-[1.7] text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {ask}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            What the review in the editor gives you
          </h2>
          <div className="mt-5 max-w-[72ch] space-y-4">
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              The Review tab reads the whole document and returns a report
              rather than a stream of advice: a score out of 100, a one-sentence
              verdict, and a score for each of impact, clarity, completeness,
              spelling and grammar, and ATS formatting — each with a note on why
              it isn&rsquo;t higher.
            </p>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              Underneath that come two lists. Every writing mistake it found,
              quoted as you wrote it with the correction beside it and applicable
              in place; and a prioritised list of what to fix, biggest first, so
              you spend your effort where it moves the needle instead of on the
              first thing you happen to notice.
            </p>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              Every proofreading note is checked against your real text before
              it reaches you, so a correction always points at something
              genuinely on the page. It runs as often as you like — the useful
              pattern is review, fix the top two items, review again.
            </p>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              Writing, previewing and exporting a resume is free, with no
              watermark and no card. The scored review is part of the Basic plan
              at $9 a month, or $3 a month billed yearly.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/dashboard" className={btnPrimary}>
              Review my resume
            </Link>
            <Link href="/pricing" className={btnQuiet}>
              See pricing
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Resume review FAQs
          </h2>
          <FaqList entries={FAQS} />
        </section>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Keep going
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/resume-ats-score",
                title: "Resume ATS score",
                body: "What applicant tracking systems really do, and the rules that matter.",
              },
              {
                href: "/guides/resume-mistakes",
                title: "Common mistakes",
                body: "The errors that show up on most resumes, and what to do instead.",
              },
              {
                href: "/resume-examples",
                title: "Resume examples",
                body: "Full examples for 26 jobs, with the bullet patterns that work.",
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
          heading="Fix the top two things, then review again"
          body="Live preview, AI help tightening every bullet, and an ATS-ready PDF. Free to start, and no card at any point."
        />
      </Column>
    </ContentPage>
  );
}
