// One template in a grid. Shared by the client-side gallery on
// /resume-templates and the server-rendered collection pages, so a card looks
// and links the same wherever it appears.
//
// The card is a sheet of paper and is drawn as one: square corners, a hairline
// edge, and nothing on top of it until the pointer arrives. Rounding was the
// one detail that read as "screenshot in a UI" rather than "page you could
// print" — paper doesn't have a radius.

import Link from "next/link";

import type { Template } from "@/lib/templates";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="group">
      {/* The frame is its own box so the hover action lands on the paper and
          not on the name underneath it. */}
      <div className="relative">
        <Link
          href={`/resume-templates/${template.id}`}
          // `overflow-hidden` with the page scaled a hair over its box: the
          // outermost ring of pixels in the screenshot is antialiased edge,
          // and cropping it is what keeps the corners looking cut rather than
          // softened. A fraction of a percent — nothing in the render moves
          // enough to see.
          className="block overflow-hidden border border-black/[0.09] bg-white transition group-hover:border-black/20 group-hover:shadow-[var(--shadow-paper)]"
        >
        {/* Screenshots of the real render, captured off each template's own
            page by scripts/shoot-templates.mjs. The alt text is generated from
            the template's own name, so a new template inherits it. */}
        {/* Intrinsic size as attributes as well as an aspect ratio: the ratio
            holds the box once CSS has loaded, and the attributes hold it before
            that, which is the window CLS is actually measured in. Every
            screenshot is captured at this size by scripts/shoot-templates.mjs. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/templates/${template.id}.png`}
          alt={`${template.name} resume and CV template`}
          loading="lazy"
          decoding="async"
          width={1588}
          height={2256}
          // Scaled from the centre, so all four edges are cropped by the same
          // sliver rather than one of them staying put.
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
            template's own page, one tap away. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/45 to-transparent pt-16 pb-5 opacity-0 transition group-hover:opacity-100 max-lg:hidden">
          <Link
            href={`/start?template=${template.id}`}
            // /start writes a resume, so it runs on the press and never on a
            // hover — see app/start/page.tsx.
            prefetch={false}
            className="pointer-events-auto inline-flex h-11 items-center justify-center bg-white px-5 text-[14.5px] font-bold text-ink transition hover:bg-black/[0.04]"
          >
            Use this template
          </Link>
        </div>
      </div>

      <Link href={`/resume-templates/${template.id}`} className="block">
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
