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
import { ALL_FAQS, FAQ_GROUPS } from "@/lib/content/faq";
import { GUIDES } from "@/lib/content/guides";
import { HOME, breadcrumbList, faqPage } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "FAQ — meniacv",
  description:
    "Answers about accounts, the AI writing tools, privacy, PDF export, ATS compatibility and the languages meniacv supports.",
  alternates: { canonical: "/faq" },
};

const TRAIL = [HOME, { name: "FAQ", path: "/faq" }];

export default function FaqPage() {
  return (
    <ContentPage>
      {/* One FAQPage covering every group — the format search engines read. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [faqPage(ALL_FAQS), breadcrumbList(TRAIL)],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Frequently asked questions"
          intro="What meniacv does, what it costs, what happens to your data, and what the AI will and won't do to your resume."
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
          <p
            className={`mt-3 text-[15px] leading-relaxed text-ink-soft ${measure}`}
          >
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
