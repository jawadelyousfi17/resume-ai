// One page per filter in the gallery's filter row: /templates/ats,
// /templates/creative, /templates/one-page and the rest.
//
// The layout is /resume-templates with the filter already applied — same hero,
// same filter row, same search, same grid — plus copy about that particular
// cut. The whole point of the URL is that the filtered set is in the HTML,
// so these are prerendered and the row below the hero navigates between them.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Column,
  ContentPage,
  FaqAccordion,
  JsonLd,
  measure,
} from "@/components/content/ContentShell";
import { ClosingPanel, SectionHead } from "@/components/content/Editorial";
import { TemplateBrowseHero } from "@/components/content/TemplateBrowseHero";
import { TemplateFilterIndex } from "@/components/content/TemplateFilterIndex";
import { TemplateGallery } from "@/components/content/TemplateGallery";
import { chipsWithIcons } from "@/lib/content/filter-icons";
import {
  TEMPLATE_FILTERS,
  filterChips,
  getFilter,
} from "@/lib/content/template-filters";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { TEMPLATES, templatesIn } from "@/lib/templates";

// The fourteen filters are the whole set — anything else under /templates is
// a 404 rather than a page built on request.
export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_FILTERS.map((filter) => ({ filter: filter.slug }));
}

export async function generateMetadata(
  props: PageProps<"/templates/[filter]">,
): Promise<Metadata> {
  const { filter: slug } = await props.params;
  const filter = getFilter(slug);
  if (!filter) return {};

  const count = templatesIn(filter.category).length;
  const title = filter.metaTitle(count);
  // Where an editorial page already covers this cut for the same query, it is
  // the canonical one — these pages stay useful to a person without competing
  // with it in an index.
  const url = filter.canonicalTo ?? `/templates/${filter.slug}`;

  return {
    title,
    description: filter.description,
    alternates: { canonical: url },
    openGraph: { title, description: filter.description, url },
    twitter: {
      card: "summary_large_image",
      title,
      description: filter.description,
    },
  };
}

export default async function Page(props: PageProps<"/templates/[filter]">) {
  const { filter: slug } = await props.params;
  const filter = getFilter(slug);
  if (!filter) notFound();

  const templates = templatesIn(filter.category);
  const path = `/templates/${filter.slug}`;
  const related = filter.related
    .map(getFilter)
    .filter((item) => item !== undefined);

  const trail = [
    HOME,
    { name: "Resume templates", path: "/resume-templates" },
    { name: filter.title, path },
  ];

  return (
    <ContentPage surface="white" landing>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: filter.title,
              description: filter.description,
              url: abs(path),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: templates.length,
                itemListElement: templates.map((template, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: `${template.name} resume template`,
                  description: template.description,
                  image: abs(`/templates/${template.id}.png`),
                })),
              },
            },
            faqPage(filter.faqs),
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <TemplateBrowseHero title={filter.title} intro={filter.intro} />

        <p className="mt-8 text-[14px] text-ink-soft">
          {templates.length} of our {TEMPLATES.length} templates
          {templates.length === 1 ? " matches" : " match"} this filter. Every
          one is free to use, with unlimited watermark-free PDF downloads.
        </p>

        <TemplateGallery
          chips={chipsWithIcons(filterChips())}
          active={filter.slug}
          category={filter.category}
        />

        <TemplateFilterIndex active={filter.slug} />

        {filter.sections.map((section) => (
          <section key={section.heading} className="mt-20">
            <h2 className="font-editorial text-[30px] leading-[1.12] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className={`mt-5 text-[17px] leading-[1.75] text-ink ${measure}`}
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {filter.seeAlso && (
          <Link
            href={filter.seeAlso.href}
            className="mt-10 block rounded-[22px] bg-canvas px-6 py-6 transition hover:-translate-y-0.5"
          >
            <span className="block font-editorial text-[22px] leading-[1.15] tracking-[-0.015em] text-ink">
              {filter.seeAlso.label}
            </span>
            <span className="mt-2 block text-[14px] leading-relaxed text-ink-soft">
              {filter.seeAlso.note}
            </span>
          </Link>
        )}

        <section className="mt-20">
          <div className="mx-auto max-w-5xl">
            <SectionHead label="FAQ" title="Common questions" />
            <FaqAccordion entries={filter.faqs} className="mt-8 md:mt-10" />
          </div>
        </section>

        {/* The full index is above the copy; these three are the ones worth
            offering to someone who has read to the bottom and is still not
            sure this was the right cut. */}
        {related.length > 0 && (
          <section className="mt-20">
            <SectionHead label="Nearby" title="Nearby filters" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/templates/${item.slug}`}
                  className="rounded-[22px] bg-canvas px-6 py-6 transition hover:-translate-y-0.5"
                >
                  <span className="block font-editorial text-[22px] leading-[1.15] tracking-[-0.015em] text-ink">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-[13px] text-ink-soft">
                    {templatesIn(item.category).length} templates
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ClosingPanel
          title="Try one of them"
          body="Open the editor, write one entry, and switch between them to see the difference."
        />
      </Column>
    </ContentPage>
  );
}
