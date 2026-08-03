"use client";

// The guides on /guides, filtered by topic.
//
// A row of pills over a grid of picture-led cards. Filtering happens in the
// browser over a list known at build time — forty-odd guides is nothing to
// hold in memory, and it keeps the page static.
//
// "All" is the default on purpose, and for more than taste: whatever is
// selected is what the server rendered, so with everything selected every
// guide is in the HTML for a crawler to follow. A page whose links only exist
// after a click is a page with no links.
//
// The cards carry only what a card shows. A guide is a long document — the
// sections, the FAQs, the rewrites — and none of that belongs in a client
// bundle.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface GuideCard {
  slug: string;
  title: string;
  description: string;
  /** What the guide calls itself — shown on the card as a chip. */
  eyebrow: string;
  /** Which filter it answers to, or null if its eyebrow has no topic. */
  topic: string | null;
  /** ISO date, already formatted for display by the server: a date rendered
   *  in the browser is a date rendered in the reader's locale, and the two
   *  disagree often enough to blank the card on hydration. */
  updated: string;
  updatedLabel: string;
  author: string;
  minutes: number;
  /** The card's illustration, or null where none is drawn yet. Decided on the
   *  server — see lib/content/guide-art. */
  art: string | null;
}

export function GuideGallery({
  guides,
  chips,
}: {
  guides: GuideCard[];
  chips: { id: string; label: string; count: number }[];
}) {
  const [active, setActive] = useState<string>("all");

  const shown =
    active === "all" ? guides : guides.filter((g) => g.topic === active);

  return (
    <>
      {/* Pills rather than tabs: this row sits over a grid of pictures, and a
          rule under it would cut the page in half. On a phone it scrolls
          instead of wrapping to three lines. */}
      <div className="scroll-slim -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <Pill active={active === "all"} onClick={() => setActive("all")}>
          All
        </Pill>
        {chips.map((chip) => (
          <Pill
            key={chip.id}
            active={active === chip.id}
            onClick={() => setActive(chip.id)}
          >
            {chip.label}
          </Pill>
        ))}
      </div>

      {/* `items-start`: the illustrations are drawn a few guides at a time, and
          a card with no picture shouldn't stretch to the height of one that
          has. */}
      <div className="mt-8 grid items-start gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group"
          >
            {/* Decorative — the title is directly underneath, so alt text
                would only say it twice. */}
            {guide.art && (
              <Image
                src={guide.art}
                alt=""
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                className="mb-4 block aspect-[16/9] w-full rounded-2xl bg-field/40 object-cover ring-1 ring-black/[0.06] transition group-hover:ring-ink/20"
              />
            )}

            {/* Everything on a card is set in the page's own ink rather than
                a grey: at 12 and 14px, "quiet" reads as "washed out", and the
                only thing a lighter grey buys is a card you have to lean in
                to. The hierarchy is carried by size and weight instead. */}
            <span className="inline-flex items-center rounded-full bg-field px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-ink uppercase">
              {guide.eyebrow}
            </span>

            <span className="mt-3 block text-[12.5px] font-semibold text-ink-soft">
              {guide.author}
              <Dot />
              <time dateTime={guide.updated}>{guide.updatedLabel}</time>
              <Dot />
              {guide.minutes} min read
            </span>

            <span className="mt-2 block text-[19px] leading-snug font-extrabold text-ink group-hover:underline group-hover:decoration-ink/25 group-hover:underline-offset-4">
              {guide.title}
            </span>

            {/* Two lines, then it stops: the cards sit in rows, and a
                description that runs to five lines on one of them drags the
                row it is in out of line with every other. */}
            {/* No `block` beside `line-clamp-2`: the clamp works by setting
                `display: -webkit-box`, and a display utility after it wins. */}
            <span className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink">
              {guide.description}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

/** The separator in the meta line. Decorative, so it is hidden rather than
 *  read out between three facts that are already three phrases. */
function Dot() {
  return (
    <span aria-hidden="true" className="px-1.5 text-ink-soft/60">
      ·
    </span>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-bold whitespace-nowrap transition",
        active
          ? "bg-brand-soft text-brand ring-1 ring-brand/30"
          : "text-ink ring-1 ring-black/[0.09] hover:ring-ink/25",
      )}
    >
      {children}
    </button>
  );
}
