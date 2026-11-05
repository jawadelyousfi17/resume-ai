// The column beside a long article, in the landing page's look: the outline
// and a call to action travel with the reader, and the link cards wait at the
// foot. Shared by the guides and the resume examples.
//
// Sticky is confined to its own box, so it stops above the cards instead of
// covering them, and nothing needs a scrollbar or gets cropped.

import Link from "next/link";

import { OnThisPage, type RailLink } from "@/components/content/OnThisPage";
import { ArrowRight, btnPrimary, tag } from "@/components/landing/ui";
import { cn } from "@/lib/utils";

export interface RailCard {
  label: string;
  tone: "coral" | "blue" | "pink" | "mint";
  links: { href: string; text: string }[];
}

export function ArticleRail({
  links,
  cta,
  cards,
}: {
  links: RailLink[];
  cta: { title: string; body: string; label: string; href: string };
  cards: RailCard[];
}) {
  return (
    <aside className="mt-14 flex flex-col gap-4 lg:mt-1 lg:w-[340px] lg:shrink-0 lg:self-stretch">
      <div className="flex-1">
        <div className="space-y-4 lg:sticky lg:top-26">
          <div className="rounded-[22px] bg-canvas px-4 py-5">
            <OnThisPage variant="landing" links={links} />
          </div>

          <section className="rounded-[22px] bg-lp-blue px-5 py-6">
            <p className="font-editorial text-[26px] leading-[1.1] tracking-[-0.02em] text-ink">
              {cta.title}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
              {cta.body}
            </p>
            <Link
              href={cta.href}
              prefetch={false}
              className={cn(btnPrimary, "mt-5 h-11 w-full min-w-0")}
            >
              {cta.label}
            </Link>
          </section>
        </div>
      </div>

      {cards.map((card) => (
        <section
          key={card.label}
          className="rounded-[22px] bg-canvas px-5 py-5"
        >
          <span className={tag(card.tone)}>{card.label}</span>
          <ul className="mt-3 divide-y divide-divider">
            {card.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-start justify-between gap-3 py-3 text-[14px] leading-snug font-medium text-ink first:pt-1 last:pb-1"
                >
                  {link.text}
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
