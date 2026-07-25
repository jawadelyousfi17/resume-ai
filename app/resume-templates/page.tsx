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
import { panel } from "@/components/landing/ui";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume Templates — Five ATS-Ready Layouts | resumeai",
  description:
    "Five resume templates you can edit and export as a real PDF: Classic, Modern, Minimal, Sidebar and Editorial. All single-column-safe and ATS-readable.",
  alternates: { canonical: "/resume-templates" },
};

/** Which situation each layout is actually for — the thing a template gallery
 *  usually leaves you to guess. */
const SUITED_TO: Record<string, string> = {
  classic:
    "Any application where you don't want the layout to be the thing anyone notices. The safest choice, and the right default.",
  modern:
    "Roles where a little visual confidence helps — product, marketing, startups — without straying from a single readable column.",
  minimal:
    "Dense resumes. With no rules or fills competing for attention, more content fits before the page feels crowded.",
  sidebar:
    "People with a long skills or tools list that would otherwise eat the main column. Check the text order after export.",
  editorial:
    "Writing, research, academia and law, where serif type and a centred header read as appropriate rather than decorative.",
};

const FAQS = [
  {
    question: "Are these templates ATS-friendly?",
    answer:
      "Yes. Every template exports to a real-text, conventionally-headed PDF, which is what applicant tracking systems parse. The Sidebar layout is the one to check — copy the text out of the exported PDF and confirm it reads in a sensible order.",
  },
  {
    question: "Can I change a template after I've written my resume?",
    answer:
      "At any time. The template is a rendering choice, not a container — switching it re-renders the same content, and your writing is untouched.",
  },
  {
    question: "Can I change the fonts and colours?",
    answer:
      "Yes. Accent colour, font family, base size, line height and margins are all controls under Customize, and the live preview and the PDF follow them together.",
  },
  {
    question: "Do the templates work in other languages?",
    answer:
      "All five render in ten languages, including right-to-left Arabic, which flips the whole document. PDF export for non-Latin scripts needs a matching font installed on the server.",
  },
];

export default function ResumeTemplatesPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              name: "resumeai resume templates",
              itemListElement: TEMPLATES.map((template, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${template.name} resume template`,
                description: template.description,
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        }}
      />

      <Column>
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Templates" }]}
        />
        <PageHeader
          eyebrow="Templates"
          title="Resume templates"
          intro="Five layouts, all built on the same document. Pick one now and change your mind later — switching template re-renders what you've written rather than starting it over."
        />

        <div className="mt-10 space-y-3">
          {TEMPLATES.map((template) => (
            <article key={template.id} className={cn(panel, "px-6 py-5")}>
              <h2 className="text-[18px] font-extrabold text-ink">
                {template.name}
              </h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                {template.description}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-faint">
                <span className="font-bold text-ink-soft">Suited to: </span>
                {SUITED_TO[template.id]}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Choosing between them
          </h2>
          <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
            Template choice is the smallest decision on this page. No layout
            rescues weak bullet points, and no recruiter has ever hired someone
            for their margins. If you are undecided, take Classic and spend the
            time you saved on{" "}
            <Link
              href="/guides/resume-bullet-points"
              className="font-bold text-brand underline underline-offset-4"
            >
              rewriting your bullet points
            </Link>
            .
          </p>
          <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
            The one layout decision with real consequences is column count. A
            sidebar can confuse an applicant tracking system if the text
            extracts out of order — the{" "}
            <Link
              href="/guides/ats-friendly-resume"
              className="font-bold text-brand underline underline-offset-4"
            >
              ATS guide
            </Link>{" "}
            covers how to check yours in about ten seconds.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={FAQS} />
        </section>

        <ContentCta
          heading="Try a template"
          body="Open the editor, write one entry, and switch between all five to see the difference."
        />
      </Column>
    </ContentPage>
  );
}
