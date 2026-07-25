import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  JsonLd,
  PageHeader,
} from "@/components/content/ContentShell";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import { sampleWithTemplate } from "@/components/landing/sample-resume";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ id: template.id }));
}

export async function generateMetadata(
  props: PageProps<"/resume-templates/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return {};

  const title = `${template.name} Resume Template — Free and ATS-Ready | resumeai`;
  return {
    title,
    description: template.description,
    alternates: { canonical: `/resume-templates/${template.id}` },
    openGraph: {
      title,
      description: template.description,
      url: `/resume-templates/${template.id}`,
      images: [`/templates/${template.id}.png`],
    },
  };
}

/** What each layout decision means, in words, for the detail page. */
function traits(id: string) {
  const t = getTemplate(id as never);
  const list: string[] = [];

  list.push(t.font === "serif" ? "Serif typeface" : "Sans-serif typeface");
  list.push(
    t.sidebar === "dark"
      ? "Two columns with a dark rail"
      : t.sidebar === "tint"
        ? "Two columns with a tinted rail"
        : "Single column",
  );
  list.push(
    t.photo === "none" ? "No photo" : "Includes an avatar or photo",
  );
  list.push(
    t.headingStyle === "band"
      ? "Headings on a tinted bar"
      : t.headingStyle === "plain"
        ? "Headings with no rule"
        : "Headings over a full-width rule",
  );
  list.push(
    t.dates === "left-column"
      ? "Dates in their own left column"
      : "Dates right-aligned against each role",
  );

  return list;
}

export default async function TemplateDetailPage(
  props: PageProps<"/resume-templates/[id]">,
) {
  const { id } = await props.params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const others = TEMPLATES.filter((t) => t.id !== template.id).slice(0, 6);

  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `${template.name} resume template`,
          description: template.description,
          image: `/templates/${template.id}.png`,
          isPartOf: { "@type": "ItemList", name: "resumeai resume templates" },
        }}
      />

      <Column className="max-w-[900px]">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Templates", href: "/resume-templates" },
            { label: template.name },
          ]}
        />

        <PageHeader
          eyebrow="Template"
          title={`${template.name} resume template`}
          intro={template.description}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Use this template
          </Link>
          <Link href="/resume-templates" className={btnQuiet}>
            See all templates
          </Link>
        </div>

        {/* The live render, not a picture of one. This is also what the
            screenshot script captures for the gallery thumbnails. */}
        <div className="mt-10 flex justify-center">
          <div
            data-template-page
            className="resume-page overflow-hidden rounded-xl bg-white shadow-[var(--shadow-paper)] ring-1 ring-black/5"
            style={{ width: PAGE_SIZES.A4.width, maxWidth: "100%" }}
          >
            <ResumePreview data={sampleWithTemplate(template.id)} />
          </div>
        </div>

        <section className={cn(panel, "mt-10 px-6 py-5")}>
          <h2 className="text-[17px] font-extrabold text-ink">
            What defines this layout
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {traits(template.id).map((trait) => (
              <li
                key={trait}
                className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                />
                {trait}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-faint">
            Every one of these is a setting, not a constraint — accent colour,
            font, size, spacing and page margins stay yours under Customize, and
            switching template later re-renders what you&rsquo;ve written rather
            than starting it over.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Other templates
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.id}
                href={`/resume-templates/${other.id}`}
                className={cn(panel, "px-5 py-4 transition hover:ring-ink/15")}
              >
                <span className="block text-[15px] font-extrabold text-ink">
                  {other.name}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                  {other.description}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <ContentCta />
      </Column>
    </ContentPage>
  );
}
