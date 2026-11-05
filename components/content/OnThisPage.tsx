"use client";

// The rail beside a long article: every section, and which one you're in.
//
// Not a card. It sits on the page as a list against a hairline, because a
// panel here competes with the article it's indexing — the reader's eye should
// land on the prose and use this only when it goes looking.
//
// The active section is worked out from scroll position rather than from the
// URL hash: a hash only changes when a link is clicked, and most people arrive
// at a section by scrolling to it. The rule is the one people expect from a
// table of contents — the last heading to have passed the top of the window is
// the one you're reading.

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface RailLink {
  /** The `id` of the heading this points at. */
  id: string;
  label: string;
}

/** How far below the top of the window a heading counts as "reached". Clears
 *  the sticky site header, so a heading tucked under it isn't called current. */
const OFFSET = 120;

export function OnThisPage({
  links,
  className,
  variant = "rule",
}: {
  links: RailLink[];
  className?: string;
  /** `landing` is the landing page's look: a serif title and rows that mark
   *  the current section with a blue dot instead of a rule. */
  variant?: "rule" | "landing";
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Read on a frame rather than on the event: scroll fires far more often
    // than the screen refreshes, and every read here forces layout.
    let frame = 0;

    const measure = () => {
      frame = 0;

      let current: string | null = null;
      for (const link of links) {
        const heading = document.getElementById(link.id);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top <= OFFSET) current = link.id;
      }

      // Above the first heading — nothing is being read yet, so nothing is
      // marked. At the very bottom the last section wins even if its heading
      // is off screen, which is the one case the rule above gets wrong.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActive(atEnd ? (links.at(-1)?.id ?? current) : current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [links]);

  if (variant === "landing") {
    return (
      <nav aria-label="On this page" className={className}>
        <p className="font-editorial text-[22px] leading-none tracking-[-0.02em] text-ink">
          On this page
        </p>
        <ul className="mt-4 space-y-0.5">
          {links.map((link) => {
            const on = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-[14px] leading-snug transition",
                    on
                      ? "font-semibold text-ink"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full transition",
                      on ? "bg-lp-accent" : "bg-divider",
                    )}
                  />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="On this page" className={className}>
      <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
        On this page
      </p>

      {/* The rule is the list's own left edge; each row paints its segment of
          it when active, so the marker can't drift out of line with the text
          the way an absolutely positioned one would. */}
      <ul className="mt-3">
        {links.map((link) => {
          const on = active === link.id;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "block border-l-2 py-1.5 pl-4 text-[14px] leading-snug font-bold transition",
                  on
                    ? "border-brand text-brand"
                    : "border-divider text-ink-faint hover:border-ink/30 hover:text-ink",
                )}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
