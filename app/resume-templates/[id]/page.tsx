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
  measure,
} from "@/components/content/ContentShell";
import { btnPrimary, btnQuiet, panel } from "@/components/landing/ui";
import { sampleForTemplate } from "@/components/landing/sample-resume";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { getTemplateNote } from "@/lib/content/template-notes";
import { PAGE_SIZES } from "@/lib/defaults";
import { HOME, abs, breadcrumbList } from "@/lib/seo/schema";
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

  const title = `${template.name} Resume & CV Template — Free, ATS-Ready | meniacv`;
  return {
    title,
    description: `${template.description} Free to edit and download as a PDF, as a resume or a CV.`,
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
  list.push(t.photo === "none" ? "No photo" : "Includes an avatar or photo");
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

/** The same document is called a CV across most of the English-speaking world
 *  outside North America, so every template here is also a CV template — but
 *  which kind depends on the layout, and that is worth saying per template
 *  rather than once. Derived from the descriptor for the same reason the
 *  category filters are: a new template answers the question by existing. */
function cvNote(id: string): string[] {
  const t = getTemplate(id as never);
  const lines: string[] = [];

  if (t.photo !== "none") {
    lines.push(
      `${t.name} carries a photo, which is what a continental European CV expects alongside the personal details a British one leaves out. For the UK, Ireland or Australia, turn the photo off in Customize — the layout closes up around it and the rest of the page is unchanged.`,
    );
  } else if (t.sidebar === "none" && t.font === "serif") {
    lines.push(
      `${t.name} is a single serif column with no photo, which is the closest thing here to an academic CV: the format that runs to as many pages as your publications, grants and teaching need. It is equally a British CV as it stands, where the document is a two-page career summary rather than a complete record.`,
    );
  } else if (t.sidebar === "none") {
    lines.push(
      `${t.name} needs nothing changed to serve as a UK, Irish or Australian CV — those markets mean by "CV" exactly what the US means by "resume", and this is already that document. Add a photo and personal details only if you are applying into continental Europe.`,
    );
  } else {
    lines.push(
      `${t.name} works as a British or Australian CV as it stands, where CV and resume name the same two-page document. The second column is the thing to check before sending: copy the text out of the exported PDF and confirm it reads in a sensible order.`,
    );
  }

  lines.push(
    t.density < 1
      ? `It is set tight, which helps on the two-page limit most non-academic CVs are read against.`
      : t.density > 1.1
        ? `It is set loose, so a CV running to the usual two pages will fill them comfortably — tighten the spacing in Customize if you need a third page's worth on two.`
        : `It sits at a normal density, which lands most histories on the two pages a non-academic CV is expected to fit.`,
  );

  return lines;
}

export default async function TemplateDetailPage(
  props: PageProps<"/resume-templates/[id]">,
) {
  const { id } = await props.params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const others = TEMPLATES.filter((t) => t.id !== template.id).slice(0, 6);
  const note = getTemplateNote(template.id);

  const trail = [
    HOME,
    { name: "Resume & CV templates", path: "/resume-templates" },
    { name: template.name, path: `/resume-templates/${template.id}` },
  ];

  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              name: `${template.name} resume template`,
              alternateName: `${template.name} CV template`,
              description: template.description,
              url: abs(`/resume-templates/${template.id}`),
              image: abs(`/templates/${template.id}.png`),
              isPartOf: {
                "@type": "ItemList",
                name: "meniacv resume templates",
                url: abs("/resume-templates"),
              },
            },
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title={`${template.name} resume & CV template`}
          intro={template.description}
        />

        {/* Opens a new resume already in this template rather than dropping
            them on the dashboard to find it again. Not prefetched — /start
            writes a row, so it runs on the press and nothing else. */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/start?template=${template.id}`}
            prefetch={false}
            className={btnPrimary}
          >
            Use this template
          </Link>
          <Link href="/resume-templates" className={btnQuiet}>
            See all templates
          </Link>
        </div>

        {/* The live render, not a picture of one. This is also what the
            screenshot script captures for the gallery thumbnails. */}
        <div className="mt-10 flex justify-center">
          {/* The frame is a wrapper, not the page: `data-template-page` is
              what the screenshot script captures, and an edge drawn on it
              would be baked into every thumbnail — where the gallery card
              draws an edge of its own. */}
          <div className="border border-black/[0.09] shadow-[var(--shadow-paper)]">
            <div
              data-template-page
              // Square, like the paper it stands for.
              className="resume-page overflow-hidden bg-white"
              style={{ width: PAGE_SIZES.A4.width, maxWidth: "100%" }}
            >
              <ResumePreview data={sampleForTemplate(template.id)} />
            </div>
          </div>
        </div>

        <section className={cn(panel, "mt-10 px-6 py-5")}>
          <h2 className="text-[17px] font-extrabold text-ink">
            What defines this layout
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="mt-4 max-w-[80ch] text-[14px] leading-relaxed text-ink-faint">
            Every one of these is a setting, not a constraint — accent colour,
            font, size, spacing and page margins stay yours under Customize, and
            switching template later re-renders what you&rsquo;ve written rather
            than starting it over.
          </p>
        </section>

        {/* Outside North America this is a CV, not a resume. Which kind it
            makes depends on the layout, so the answer is derived per template
            rather than repeated. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Using {template.name} as a CV
          </h2>
          <div className="mt-5 space-y-4">
            {cvNote(template.id).map((line) => (
              <p
                key={line.slice(0, 40)}
                className={cn(
                  "text-[16px] leading-[1.75] text-ink-soft",
                  measure,
                )}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-faint">
            More on the differences:{" "}
            <Link href="/cv-templates" className="underline hover:text-ink">
              CV templates
            </Link>{" "}
            and{" "}
            <Link href="/cv-examples" className="underline hover:text-ink">
              CV examples
            </Link>
            .
          </p>
        </section>

        {/* The part that makes this page its own rather than one more render
            of the same document. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Is {template.name} the right choice?
          </h2>
          <div className="mt-5 space-y-6">
            {(
              [
                ["Who it suits", note.suits],
                ["What it does to ATS parsing", note.parsing],
                ["At two pages", note.twoPages],
                ["Use something else if", note.instead],
              ] as const
            ).map(([heading, body]) => (
              <div key={heading}>
                <h3 className="text-[16.5px] font-extrabold text-ink">
                  {heading}
                </h3>
                <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
                  {body}
                </p>
              </div>
            ))}
          </div>
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
                  {other.short}
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
