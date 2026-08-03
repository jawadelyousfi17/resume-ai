import type { Metadata } from "next";
import Image from "next/image";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  JsonLd,
} from "@/components/content/ContentShell";
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
    <ContentPage surface="white">
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

        {/* The title and the picture on one line, the way the role examples
            open — this is the same kind of index and should look like it.
            Below `lg` the picture goes and the words take the width. */}
        <header className="mt-4 sm:mt-6 lg:flex lg:items-center lg:gap-12">
          <div className="min-w-0 lg:flex-1">
            <h1 className="max-w-[16ch] text-[34px] leading-[1.08] font-extrabold tracking-tight text-ink sm:text-[48px] lg:text-[58px]">
              Resume guides
            </h1>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-ink sm:text-[18px]">
              How to write the thing, not how to decorate it. Each guide is the
              advice we&rsquo;d give someone sitting next to us — specific,
              opinionated, and free of the filler that makes most resume advice
              useless.
            </p>
          </div>

          {/* Decorative, and cropped the same way /resume-examples crops its
              own hero: multiplied into the page so the drawing's white ground
              disappears, and masked at the edges so it ends in the page
              rather than against it. */}
          <Image
            src="/images/guides-hero.png"
            alt=""
            width={1254}
            height={1254}
            priority
            sizes="(min-width: 1024px) 360px, 60vw"
            className="mx-auto aspect-square w-full max-w-[360px] object-cover object-center mix-blend-multiply max-lg:hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
          />
        </header>

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

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
