import type { Metadata } from "next";

import {
  Breadcrumbs,
  Column,
  ContentPage,
  JsonLd,
} from "@/components/content/ContentShell";
import { ClosingPanel, IndexHero } from "@/components/content/Editorial";
import { GuideGallery } from "@/components/content/GuideGallery";
import { guideArt } from "@/lib/content/guide-art";
import { authorFor, readingMinutes } from "@/lib/content/guide-meta";
import { topicChips, topicOf } from "@/lib/content/guide-topics";
import { GUIDES } from "@/lib/content/guides";
import { HOME, abs, breadcrumbList } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Resume Guides — Writing, Formatting and ATS | meniacv",
  description:
    "Practical guides to writing a resume: bullet points, summaries, formats, ATS parsing, career changes and applying abroad.",
  alternates: { canonical: "/guides" },
};

const TRAIL = [HOME, { name: "Guides", path: "/guides" }];

/** Dates are formatted here rather than in the browser: a date rendered
 *  client-side is rendered in the reader's locale, which disagrees with the
 *  server's often enough to blank the line on hydration. */
const stamp = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function GuidesIndexPage() {
  return (
    <ContentPage surface="white" landing>
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

        <IndexHero
          label="Guides"
          title="Resume guides"
          intro="How to write the thing, not how to decorate it. Each guide is the advice we'd give someone sitting next to us — specific, opinionated, and free of the filler that makes most resume advice useless."
          primary={{ label: "Start your resume", href: "/dashboard" }}
          secondary={{ label: "Browse examples", href: "/resume-examples" }}
          image="/images/guides-hero.png"
        />

        {/* Filtering is in the browser over cards the server already rendered
            — see GuideGallery. Everything a crawler needs is in the HTML. */}
        <GuideGallery
          chips={topicChips()}
          guides={GUIDES.map((guide) => ({
            slug: guide.slug,
            title: guide.title,
            description: guide.description,
            eyebrow: guide.eyebrow,
            topic: topicOf(guide.eyebrow),
            updated: guide.updated,
            updatedLabel: stamp(guide.updated),
            author: authorFor(guide.slug).name,
            minutes: readingMinutes(guide),
            art: guideArt(guide.slug),
          }))}
        />

        <ClosingPanel />
      </Column>
    </ContentPage>
  );
}
