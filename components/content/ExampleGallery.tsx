"use client";

// The examples on /resume-examples, filtered by field.
//
// A row of tabs on a rule, the way a set of tabs has always looked: the active
// one carries a thick underline and the rest are quiet. Filtering happens in
// the browser over a list that is known at build time — twenty-odd examples is
// nothing to hold in memory, and it keeps the page static.
//
// "All" is the default on purpose, and it matters for more than taste: the
// server renders whatever is selected, so with everything selected every
// example is in the HTML for a crawler to find. A page whose links only exist
// after a click is a page with no links.
//
// The cards carry only what a card shows. The examples themselves are large
// documents — a whole sample resume, the keyword banks, the prose — and none
// of that belongs in a client bundle.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { panelFlat } from "@/components/landing/ui";
import { cn } from "@/lib/utils";

export interface ExampleCard {
  slug: string;
  role: string;
  /** The other titles the same job is advertised under, already joined. */
  aka: string;
  /** The card's illustration, or null where none is drawn for that role yet.
   *  Decided on the server — see lib/content/example-art. */
  art: string | null;
}

export interface ExampleGroup {
  id: string;
  label: string;
  blurb: string;
  examples: ExampleCard[];
}

export function ExampleGallery({ groups }: { groups: ExampleGroup[] }) {
  const [active, setActive] = useState<string>("all");

  const current = groups.find((group) => group.id === active) ?? null;
  const shown = current
    ? current.examples
    : groups.flatMap((group) => group.examples);

  return (
    <>
      {/* A row of six tabs wraps into three lines on a phone and pushes the
          examples off the screen — so there it scrolls instead. The rule runs
          the full width underneath either way. */}
      <div className="mt-10 border-b border-black/10">
        <div className="scroll-slim -mx-5 flex gap-7 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Tab active={active === "all"} onClick={() => setActive("all")}>
            All
          </Tab>
          {groups.map((group) => (
            <Tab
              key={group.id}
              active={active === group.id}
              onClick={() => setActive(group.id)}
            >
              {group.label}
            </Tab>
          ))}
        </div>
      </div>

      {current && (
        <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
          {current.blurb}
        </p>
      )}

      {/* `items-start`: the art is being drawn a few roles at a time, and a
          stretched grid gives a card with no band the height of one that has
          it — a card that is mostly empty. Left to their own heights the row
          is uneven, which reads far better than a void. */}
      <div className="mt-6 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((example) => (
          <Link
            key={example.slug}
            href={`/resume-examples/${example.slug}`}
            className={cn(
              panelFlat,
              "overflow-hidden transition hover:ring-ink/25",
            )}
          >
            {/* Decorative — the role is right underneath it in text, so alt
                text would only repeat it. Not every role has art drawn yet;
                those cards are the same card without a band. */}
            {example.art && (
              <Image
                src={example.art}
                alt=""
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                className="block w-full border-b border-black/[0.07] bg-field/40"
              />
            )}

            {/* The role and what else it's called, and nothing else. The
                description repeated the same sentence twenty-seven times over
                — "a resume example with the keywords hiring teams screen for"
                — which is the page's own promise, not a reason to pick one
                card over its neighbour. It still leads each role's own page,
                where it's the answer to a question that has been asked. */}
            <span className="block px-6 py-5">
              <span className="block text-[17px] leading-snug font-extrabold text-ink">
                {example.role}
              </span>
              <span className="mt-1.5 block text-[12.5px] leading-relaxed font-semibold text-ink-faint">
                {example.aka}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

/** One tab: the label, and the bar under the one you're on. The bar sits on
 *  the rule rather than above it — `-mb-px` pulls it down onto the line. */
function Tab({
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
        "-mb-px shrink-0 border-b-[3px] pb-3 text-[15.5px] font-bold whitespace-nowrap transition",
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink-faint hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
