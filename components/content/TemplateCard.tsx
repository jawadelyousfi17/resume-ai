// One template in a grid. Shared by the client-side gallery on
// /resume-templates and the server-rendered collection pages, so a card looks
// and links the same wherever it appears.

import Link from "next/link";

import type { Template } from "@/lib/templates";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Link href={`/resume-templates/${template.id}`} className="group block">
      <span className="block overflow-hidden rounded-xl bg-white shadow-[var(--shadow-panel)] ring-1 ring-black/5 transition group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-paper)]">
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
          alt={`${template.name} resume template`}
          loading="lazy"
          decoding="async"
          width={1588}
          height={2256}
          className="block w-full"
          style={{
            aspectRatio: "210 / 297",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </span>
      <span className="mt-3 block text-[16px] font-extrabold text-ink">
        {template.name}
      </span>
      <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
        {template.short}
      </span>
    </Link>
  );
}
