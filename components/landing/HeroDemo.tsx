// The page the hero shows.
//
// It's one of the cards from the templates section, at the same settings — the
// full sample resume laid out with Atlas. Same document, same renderer, so the
// hero and the strip further down can never disagree about what a maniacv
// resume looks like.

import { Avatar } from "./marks";
import { ResumePaper } from "./ResumePaper";
import { sampleWithTemplate } from "./sample-resume";

// Two columns with the avatar in the header — it fills the page and reads as a
// designed document at hero size. Any id from TEMPLATES works here.
const HERO_TEMPLATE = "atlas" as const;

export function HeroDemo() {
  return (
    <div className="relative">
      <ResumePaper
        data={sampleWithTemplate(HERO_TEMPLATE)}
        size="hero"
        className="shadow-[0_34px_68px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/5"
      />

      {/* Social proof, tucked onto the page's top corner. */}
      <div className="absolute -top-5 -left-4 z-20 flex w-[220px] items-center gap-3 rounded-2xl border border-black/5 bg-panel px-3.5 py-2.5 shadow-[var(--shadow-paper)] sm:-left-10 lg:-left-20 lg:w-[250px]">
        <Avatar name="Andrew Irwin" className="h-9 w-9" />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-ink">Andrew Irwin</p>
          <p className="text-[11px] text-ink-soft">Product Manager</p>
        </div>
      </div>
    </div>
  );
}
