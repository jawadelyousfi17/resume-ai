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
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { sampleLetter } from "@/components/cover-letter/sample-letter";
import { PAGE_SIZES } from "@/lib/defaults";
import {
  LETTER_FAMILIES,
  LETTER_TEMPLATES,
  letterFamily,
} from "@/lib/letter-templates";
import type { LetterTemplate } from "@/lib/letter-templates";
import { HOME, abs, breadcrumbList } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LETTER_TEMPLATES.map((template) => ({ id: template.id }));
}

export async function generateMetadata(
  props: PageProps<"/cover-letter/templates/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const template = LETTER_TEMPLATES.find((t) => t.id === id);
  if (!template) return {};

  const title = `${template.name} Cover Letter Template — Free | meniacv`;
  return {
    title,
    description: `${template.description} Free to edit, and it exports as a real-text PDF that matches your resume.`,
    alternates: { canonical: `/cover-letter/templates/${template.id}` },
    openGraph: {
      title,
      description: template.description,
      url: `/cover-letter/templates/${template.id}`,
      images: [`/letter-templates/${template.id}.png`],
    },
  };
}

/** What each layout decision means, in words. Read off the descriptor for the
 *  same reason the filters are: a new design answers the question by existing. */
function traits(t: LetterTemplate): string[] {
  const list: string[] = [];

  list.push(t.font === "serif" ? "Serif typeface" : "Sans-serif typeface");

  list.push(
    t.header === "banner"
      ? "Name across a full-width colour band"
      : t.header === "block"
        ? "Name on a colour block, contacts in a panel beside it"
        : t.header === "minimal"
          ? "A one-line header"
          : t.header === "split"
            ? "Name one side, contacts the other"
            : t.header === "boxed"
              ? "The header inside a ruled box"
              : t.header === "footer"
                ? "Contacts printed at the foot of the page"
                : "Name, title and contacts stacked",
  );

  list.push(
    t.page === "dark"
      ? "Printed dark, with the type reversed out"
      : t.page === "tint"
        ? "Tinted paper"
        : "White paper",
  );

  if (t.edge !== "none") {
    list.push(
      t.edge === "wave"
        ? "Curved shapes at the corners"
        : t.edge === "strip"
          ? "A colour band down the edge"
          : t.edge === "frame" || t.edge === "double-frame"
            ? "A border drawn round the sheet"
            : t.edge === "band-top" || t.edge === "band-both"
              ? "A bar across the sheet"
              : t.edge === "diagonal"
                ? "A triangle filling one corner"
                : t.edge === "dots"
                  ? "A column of dots down the margin"
                  : t.edge === "wash"
                    ? "A tinted wash behind the header"
                    : t.edge === "notch"
                      ? "Right-angle marks in opposite corners"
                      : "A rule down the margin",
    );
  }

  if (t.monogram !== "none") list.push("Your initials as a mark");
  if (t.nameStyle === "display") list.push("The name set at display size");
  if (t.nameStyle === "tracked") list.push("The name in tracked capitals");
  if (t.justify) list.push("Justified paragraphs");
  if (t.indent) list.push("Indented first lines");
  if (t.signature === "script") list.push("The sign-off written, not typed");
  if (t.signOffBar) list.push("A bar across the foot, above the sign-off");

  return list;
}

export default async function LetterTemplatePage(
  props: PageProps<"/cover-letter/templates/[id]">,
) {
  const { id } = await props.params;
  const template = LETTER_TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const family = LETTER_FAMILIES.find((f) => f.id === template.family);
  const others = letterFamily(template.family)
    .filter((t) => t.id !== template.id)
    .slice(0, 6);

  const trail = [
    HOME,
    { name: "Cover letters", path: "/cover-letter" },
    { name: "Templates", path: "/cover-letter/templates" },
    {
      name: template.name,
      path: `/cover-letter/templates/${template.id}`,
    },
  ];

  return (
    <ContentPage>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              name: `${template.name} cover letter template`,
              description: template.description,
              url: abs(`/cover-letter/templates/${template.id}`),
              image: abs(`/letter-templates/${template.id}.png`),
            },
            breadcrumbList(trail),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title={`${template.name} cover letter template`}
          intro={template.description}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/cover-letters" className={btnPrimary}>
            Use this template
          </Link>
          <Link href="/cover-letter/templates" className={btnQuiet}>
            See all templates
          </Link>
        </div>

        {/* The live render, not a picture of one. This is also what the
            screenshot script captures for the gallery thumbnails — so the
            frame is a wrapper rather than the page itself, or its edge would
            be baked into every thumbnail. */}
        <div className="mt-10 flex justify-center">
          <div className="border border-black/[0.09] shadow-[var(--shadow-paper)]">
            <div
              data-letter-page
              className="resume-page overflow-hidden bg-white"
              style={{ width: PAGE_SIZES.A4.width, maxWidth: "100%" }}
            >
              <CoverLetterPreview data={sampleLetter(template)} />
            </div>
          </div>
        </div>

        <section className={cn(panel, "mt-10 px-6 py-5")}>
          <h2 className="text-[17px] font-extrabold text-ink">
            What defines this design
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {traits(template).map((trait) => (
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
            typeface, size, spacing and page margins stay yours under Customize,
            and switching design later re-renders what you&rsquo;ve written
            rather than starting it over.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            When to send {template.name}
          </h2>
          <p
            className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}
          >
            {advice(template)}
          </p>
          <p
            className={cn("mt-4 text-[16px] leading-[1.75] text-ink-soft", measure)}
          >
            Whatever you pick, the letter is read for what it says. A design
            buys you the half-second before that starts — it cannot buy the
            paragraph after it. If you are undecided, take Classic and spend the
            time on the opening sentence instead.
          </p>
        </section>

        {others.length > 0 && family && (
          <section className="mt-12">
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              More from {family.label.toLowerCase()}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/cover-letter/templates/${other.id}`}
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
        )}

        <ContentCta />
      </Column>
    </ContentPage>
  );
}

/** One paragraph on where a design belongs, from what it actually does rather
 *  than from a sentence written per template. */
function advice(t: LetterTemplate): string {
  if (t.page === "dark") {
    return `${t.name} prints the whole sheet dark, which is striking on a screen and expensive on a printer. Send it where the letter will be read as a file — a design studio, an agency, a startup — and pick something on white if you know it is going into a portal that flattens attachments or onto somebody's desk.`;
  }
  if (t.header === "banner" || t.header === "block" || t.nameStyle === "display") {
    return `${t.name} puts your name at a size nobody misses. That reads as confidence in creative, marketing and product roles, and as noise in law, medicine, finance and the civil service — where the safest thing on the page is the thing that looks like every other letter in the pile.`;
  }
  if (t.edge !== "none" || t.monogram !== "none") {
    return `${t.name} carries a piece of decoration, which is a small signal that you thought about the document. It suits agencies, studios and anywhere a portfolio is part of the application. Somewhere conservative, the same mark reads as a distraction — the plain set is there for exactly that.`;
  }
  if (t.font === "serif") {
    return `${t.name} is set in a serif, which still reads as the default voice of formal correspondence — law, academia, government, publishing, medicine. It is the safe choice in the places where being the safe choice is the point.`;
  }
  return `${t.name} is a plain letter with nothing between the reader and the words, which makes it the one to send when you do not know who is opening it or what they will open it with. It survives being pasted into a plain-text box, which is how a surprising number of applications actually arrive.`;
}
