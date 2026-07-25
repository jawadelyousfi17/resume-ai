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
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Resume Templates — Free, ATS-Ready Layouts | resumeai",
  description:
    "Professional resume templates you can edit and export as a real PDF — serif and sans, single and two-column, with or without a photo. Every one is ATS-readable.",
  alternates: { canonical: "/resume-templates" },
};

const FAQS = [
  {
    question: "Are these templates ATS-friendly?",
    answer:
      "Yes. Every template exports to a real-text, conventionally-headed PDF, which is what applicant tracking systems parse. The two-column layouts are the ones to check — copy the text out of the exported PDF and confirm it reads in a sensible order.",
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
      "All of them render in ten languages, including right-to-left Arabic, which flips the whole document. PDF export for non-Latin scripts needs a matching font installed on the server.",
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

      <Column className="max-w-[900px]">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Templates" }]}
        />
        <PageHeader
          eyebrow="Templates"
          title="Resume templates"
          intro="Every one is a render of the same document, so you can compare them like for like. Pick one now and change your mind later — switching template re-renders what you've written rather than starting it over."
        />

        {/* Screenshots of the real render, captured off each template's own
            page by scripts/shoot-templates.mjs. */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TEMPLATES.map((template) => (
            <Link
              key={template.id}
              href={`/resume-templates/${template.id}`}
              className="group block"
            >
              <span className="block overflow-hidden rounded-xl bg-white shadow-[var(--shadow-panel)] ring-1 ring-black/5 transition group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-paper)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/templates/${template.id}.png`}
                  alt={`${template.name} resume template`}
                  loading="lazy"
                  className="block w-full"
                  style={{ aspectRatio: "210 / 297", objectFit: "cover", objectPosition: "top" }}
                />
              </span>
              <span className="mt-3 block text-[16px] font-extrabold text-ink">
                {template.name}
              </span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
                {template.description}
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Choosing between them
          </h2>
          <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
            Template choice is the smallest decision on this page. No layout
            rescues weak bullet points, and no recruiter has ever hired someone
            for their margins. If you are undecided, take Ledger and spend the
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
          body="Open the editor, write one entry, and switch between them to see the difference."
        />
      </Column>
    </ContentPage>
  );
}
