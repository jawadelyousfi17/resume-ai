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
import { ALL_FAQS, FAQ_GROUPS } from "@/lib/content/faq";
import { GUIDES } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "FAQ — resumeai",
  description:
    "Answers about accounts, the AI writing tools, privacy, PDF export, ATS compatibility and the languages resumeai supports.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <ContentPage>
      {/* One FAQPage covering every group — the format search engines read. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ALL_FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />

      <Column>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <PageHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          intro="What resumeai does, what it costs, what happens to your data, and what the AI will and won't do to your resume."
        />

        {FAQ_GROUPS.map((group) => (
          <section key={group.title} className="mt-12">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {group.title}
            </h2>
            <FaqList entries={group.entries} />
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Questions about writing a resume
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Those are answered in the guides — each one ends with the questions
            people actually ask about that topic.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex rounded-lg border border-black/10 bg-panel px-3 py-2 text-[13.5px] font-bold text-ink transition hover:border-ink/25"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
