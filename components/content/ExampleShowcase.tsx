"use client";

// The example resume, and the two controls that change how it looks.
//
// Every one of these pages already said "switching template re-renders the
// same content rather than starting it over". This is that sentence, working:
// the same document, laid out five ways, in whichever accent, rendered by the
// component the editor and the PDF export use — so what's on screen is what
// the product would produce.
//
// The state lives here because the preview and the controls have to share it,
// which makes this the one client component on the page. The article, the
// checklist and the rest stay server-rendered and arrive as `children`.

import Link from "next/link";
import { useMemo, useState } from "react";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { btnCompact, btnPrimary, btnQuiet } from "@/components/landing/ui";
import { applyExampleLook } from "@/lib/content/example-look";
import { PAGE_SIZES } from "@/lib/defaults";
import type { ResumeData, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The accents offered here — the first five of the editor's own row, which is
 *  enough range to make the point without turning into a colour picker. */
const ACCENTS = ["#2563eb", "#0ea5e9", "#0d9488", "#7c3aed", "#0f172a"];

export function ExampleShowcase({
  data,
  slug,
  templates,
  children,
}: {
  /** The example as written, including the template it was designed in. */
  data: ResumeData;
  slug: string;
  /** The five on offer, the example's own first. */
  templates: { id: TemplateId; name: string }[];
  /** The left column above the controls — heading, blurb, checklist. */
  children: React.ReactNode;
}) {
  const [templateId, setTemplateId] = useState<TemplateId>(
    data.settings.template,
  );
  // Null means "whatever this template was designed in", so switching template
  // brings its own accent along until someone states a preference.
  const [accent, setAccent] = useState<string | null>(null);

  // The same transform /start applies when the button below is pressed, so
  // the resume that opens is the one being looked at — see lib/content/example-look.
  const shown = useMemo(
    () =>
      applyExampleLook(data, {
        template: templateId,
        accent: accent ?? undefined,
      }),
    [data, templateId, accent],
  );

  // Carries the choice into the editor: press it after switching and the
  // resume that opens is the one on screen, not the one the page shipped with.
  const startHref = (() => {
    const params = new URLSearchParams({ example: slug });
    if (templateId !== data.settings.template) params.set("template", templateId);
    if (accent) params.set("accent", accent.replace("#", ""));
    return `/start?${params}`;
  })();

  return (
    <div className="lg:flex lg:items-start lg:gap-12">
      <div className="min-w-0 lg:flex-1 lg:pt-2">
        {children}

        {/* No labels: a row of template names and a row of colour swatches
            say what they are, and "Template" / "Accent" beside them was two
            words of chrome on a page that is already dense. The names and the
            paragraph above carry the instruction. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {templates.map((template) => (
              <Chip
                key={template.id}
                on={template.id === templateId}
                onClick={() => setTemplateId(template.id)}
              >
                {template.name}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {ACCENTS.map((color) => {
              const on =
                (accent ?? shown.settings.accent).toLowerCase() ===
                color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccent(color)}
                  aria-label={`Accent ${color}`}
                  aria-pressed={on}
                  className={cn(
                    "h-6 w-6 rounded-full transition hover:scale-110",
                    // The ring is drawn outside the swatch so the colour is
                    // never cut into by its own selected state.
                    on && "ring-2 ring-ink/70 ring-offset-2 ring-offset-panel",
                  )}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-nowrap gap-3 sm:flex-wrap">
          <Link
            href={startHref}
            // /start writes a row, so it runs on the press and never on hover.
            prefetch={false}
            className={cn(btnPrimary, btnCompact)}
          >
            Start from this example
          </Link>
          <Link href="/resume-templates" className={cn(btnQuiet, btnCompact)}>
            Browse all templates
          </Link>
        </div>
      </div>

      {/* The page is a fixed 794px wide, so on anything narrower it scales
          down rather than pushing the row wider than the window. */}
      <div className="max-lg:mt-10 max-lg:flex max-lg:justify-center lg:w-[52%] lg:shrink-0">
        <div
          className="resume-page overflow-hidden border border-black/[0.09] bg-white shadow-[var(--shadow-paper)]"
          style={{ width: PAGE_SIZES.A4.width, maxWidth: "100%" }}
        >
          <ResumePreview data={shown} />
        </div>
      </div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "h-8 rounded-lg px-3 text-[13.5px] font-bold transition",
        on
          ? "bg-navy text-white"
          : "bg-field text-ink-soft hover:text-ink ring-1 ring-black/[0.07] ring-inset",
      )}
    >
      {children}
    </button>
  );
}
