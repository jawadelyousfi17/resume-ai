// The renderer behind the standalone landing pages — /cv-templates,
// /ai-resume-builder, /canva-resume-templates and the rest.
//
// They all have the same shape: a header, some prose in sections, an optional
// grid of templates or links, questions, and a way onward. Writing that once
// means a new landing is a content entry rather than a new page component, and
// the schema graph can't be forgotten on one of them.

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
import { TemplateCard } from "@/components/content/TemplateCard";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import type { Landing } from "@/lib/content/landings";
import {
  HOME,
  ORGANIZATION,
  abs,
  breadcrumbList,
  faqPage,
} from "@/lib/seo/schema";
import { TEMPLATES, templatesIn } from "@/lib/templates";
import { cn } from "@/lib/utils";

export function landingMetadata(landing: Landing) {
  const url = `/${landing.slug}`;
  return {
    title: landing.metaTitle,
    description: landing.description,
    keywords: landing.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: landing.metaTitle,
      description: landing.description,
      url,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: landing.metaTitle,
      description: landing.description,
    },
  };
}

export function EditorialLanding({ landing }: { landing: Landing }) {
  const templates = landing.showTemplates
    ? landing.showTemplates === "all"
      ? TEMPLATES.slice(0, 9)
      : templatesIn(landing.showTemplates).slice(0, 9)
    : [];

  const trail = [HOME, { name: landing.title, path: `/${landing.slug}` }];

  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: landing.title,
              description: landing.description,
              datePublished: landing.updated,
              dateModified: landing.updated,
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              mainEntityOfPage: abs(`/${landing.slug}`),
            },
            faqPage(landing.faqs),
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title={landing.title}
          intro={landing.intro}
          updated={landing.updated}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            {landing.cta}
          </Link>
          {landing.secondary && (
            <Link href={landing.secondary.href} className={btnQuiet}>
              {landing.secondary.label}
            </Link>
          )}
        </div>

        {templates.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

        {landing.sections.map((section) => (
          <section key={section.heading} className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className={cn(
                  "mt-4 text-[16px] leading-[1.75] text-ink-soft",
                  measure,
                )}
              >
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-5 space-y-2">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex gap-3 text-[16px] leading-[1.7] text-ink-soft",
                      measure,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {landing.links && landing.links.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              {landing.linksHeading ?? "Where to go next"}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {landing.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(panel, "px-5 py-4 transition hover:ring-ink/15")}
                >
                  <span className="block text-[15px] font-extrabold text-ink">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                    {link.note}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqList entries={landing.faqs} />
        </section>

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
