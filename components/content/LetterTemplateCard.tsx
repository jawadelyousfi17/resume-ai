// One cover letter design in a grid. The resume gallery's TemplateCard,
// pointed at the letter routes and the letter screenshots — same card, so the
// two galleries read as one product rather than two.
//
// The card is a sheet of paper and is drawn as one: square corners, a hairline
// edge, and nothing on top of it until the pointer arrives.

import Link from "next/link";

import type { LetterTemplate } from "@/lib/letter-templates";

export function LetterTemplateCard({
  template,
}: {
  template: LetterTemplate;
}) {
  return (
    <div className="group">
      {/* The frame is its own box so the hover action lands on the paper and
          not on the name underneath it. */}
      <div className="relative">
        <Link
          href={`/cover-letter/templates/${template.id}`}
          // `overflow-hidden` with the page scaled a hair over its box: the
          // outermost ring of pixels in the screenshot is antialiased edge,
          // and cropping it is what keeps the corners looking cut rather than
          // softened.
          className="block overflow-hidden border border-black/[0.09] bg-white transition group-hover:border-black/20 group-hover:shadow-[var(--shadow-paper)]"
        >
          {/* Screenshots of the real render, captured off each design's own
              page by scripts/shoot-letter-templates.mjs. Intrinsic size as
              attributes as well as an aspect ratio: the ratio holds the box
              once CSS has loaded, the attributes hold it before that. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/letter-templates/${template.id}.png`}
            alt={`${template.name} cover letter template`}
            loading="lazy"
            decoding="async"
            width={1588}
            height={2248}
            className="block w-full scale-[1.006]"
            style={{
              aspectRatio: "210 / 297",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </Link>

        {/* The action, on the paper rather than under it. Hidden where there
            is no pointer to hover with — a phone gets the same button on the
            design's own page, one tap away. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/45 to-transparent pt-16 pb-5 opacity-0 transition group-hover:opacity-100 max-lg:hidden">
          <Link
            href="/cover-letters"
            className="pointer-events-auto inline-flex h-11 items-center justify-center bg-white px-5 text-[14.5px] font-bold text-ink transition hover:bg-black/[0.04]"
          >
            Use this template
          </Link>
        </div>
      </div>

      <Link
        href={`/cover-letter/templates/${template.id}`}
        className="block"
      >
        <span className="mt-3 block text-[16px] font-extrabold text-ink">
          {template.name}
        </span>
        <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
          {template.short}
        </span>
      </Link>
    </div>
  );
}
