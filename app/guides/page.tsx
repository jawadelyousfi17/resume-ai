import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { panel } from "@/components/landing/ui";
import { GUIDES } from "@/lib/content/guides";
import { HOME, abs, breadcrumbList } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume Guides — Writing, Formatting and ATS | meniacv",
  description:
    "Practical guides to writing a resume: bullet points, summaries, formats, ATS parsing, career changes and applying abroad.",
  alternates: { canonical: "/guides" },
};

const TRAIL = [HOME, { name: "Guides", path: "/guides" }];

export default function GuidesIndexPage() {
  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Resume guides",
              description: metadata.description,
              url: abs("/guides"),
              hasPart: GUIDES.map((guide) => ({
                "@type": "Article",
                headline: guide.title,
                description: guide.description,
                url: abs(`/guides/${guide.slug}`),
              })),
            },
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader
          title="Resume guides"
          intro="How to write the thing, not how to decorate it. Each guide is the advice we'd give someone sitting next to us — specific, opinionated, and free of the filler that makes most resume advice useless."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className={cn(panel, "px-6 py-5 transition hover:ring-ink/15")}
            >
              <span className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                {guide.eyebrow}
              </span>
              <span className="mt-2 block text-[17px] leading-snug font-extrabold text-ink">
                {guide.title}
              </span>
              <span className="mt-2 block text-[14px] leading-relaxed text-ink-soft">
                {guide.description}
              </span>
            </Link>
          ))}
        </div>

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
