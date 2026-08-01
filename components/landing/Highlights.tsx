import Image from "next/image";

import { sectionGap, shell } from "./ui";

const ITEMS = [
  {
    art: "/images/landing/highlight-free.png",
    line1: "1st resume,",
    line2: "free forever",
  },
  {
    art: "/images/landing/highlight-privacy.png",
    line1: "Privacy-first,",
    line2: "your data stays yours",
  },
  {
    art: "/images/landing/highlight-downloads.png",
    line1: "Unlimited",
    line2: "PDF downloads",
  },
];

/** The three-up reassurance row directly under the hero. */
export function Highlights() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:max-w-6xl">
        {ITEMS.map(({ art, line1, line2 }) => (
          <div
            key={line1}
            className="flex items-center gap-5 sm:flex-col sm:gap-2 sm:text-center"
          >
            {/* Decorative — the claim is spelled out beside it. Beside, on a
                phone: three 16:9 bands stacked over their own text is a
                screenful of illustration before the page has said anything.
                Above the line from `sm` up, where there are three columns to
                fill. Blended into the page rather than framed, like the rest
                of the artwork on this surface. */}
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              sizes="(min-width: 640px) 300px, 140px"
              // See next.config.ts — 75 lands the white ground on 254.
              quality={95}
              className="w-[7.5rem] shrink-0 mix-blend-multiply sm:w-full sm:max-w-[240px] lg:max-w-[280px]"
            />
            <p className="text-xl leading-tight font-bold tracking-tight text-ink sm:text-lg md:text-xl lg:text-2xl lg:leading-snug">
              {line1}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {line2}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
