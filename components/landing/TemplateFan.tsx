"use client";

// The template carousel: a row of pages that scrolls one card at a time.
//
// The pages themselves are rendered on the server and handed in as `children`,
// so this file never pulls <ResumePreview> and the template engine into the
// client bundle — it only moves the row.

import Link from "next/link";
import { Children, useEffect, useRef } from "react";

import { ArrowRight } from "./ui";

const GAP = 24; // matches `gap-6` on the track

export function TemplateFan({
  children,
  names,
  total,
}: {
  children: React.ReactNode;
  names: string[];
  total: number;
}) {
  const cards = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);

  // Open in the middle of the row rather than against its left edge, so the
  // deck reads as centred on the page with cards running off both sides. The
  // section sits well below the fold, so this lands long before it's seen.
  useEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  // Native scrolling does the work — the arrows just nudge it by one card, so
  // a trackpad swipe or a drag behaves exactly the same as a click.
  const step = (direction: number) => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    el.scrollBy({
      left: direction * (card.clientWidth + GAP),
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={track}
        // `safe center` centres the row when the whole deck fits and falls
        // back to the left edge when it doesn't, so nothing is ever stranded
        // off the scrollable area.
        className="lp-bleed-row scroll-slim flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [justify-content:safe_center]"
      >
        {cards.map((card, i) => (
          <div key={i} className="shrink-0 snap-center">
            {card}
            <p className="mt-3 text-center text-[14px] font-bold text-ink">
              {names[i]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-panel p-1.5 shadow-[var(--shadow-panel)] ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous template"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-field hover:text-ink sm:h-11 sm:w-11"
          >
            <ArrowRight className="h-4 w-4 rotate-180 sm:h-[18px] sm:w-[18px]" />
          </button>

          <Link
            href="/resume-templates"
            className="px-2 text-[15px] font-bold text-ink sm:px-3 sm:text-[18px]"
          >
            {`Choose from ${total} templates`}
          </Link>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next template"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-field hover:text-ink sm:h-11 sm:w-11"
          >
            <ArrowRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
