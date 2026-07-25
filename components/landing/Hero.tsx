import Link from "next/link";

import { SparklesIcon } from "@/components/ui/icons";

import { Avatar, CursorTag, PARTNERS } from "./marks";
import { btnPrimary, btnQuiet } from "./ui";

// Floating "who's on the page" avatars. Positions are percentages of the hero
// box so they track the headline as it reflows; they're decorative, so they
// drop out entirely below lg where there's no room beside the text.
const FLOATERS = [
  {
    name: "Amara Diaz",
    pos: "left-[11%] top-[14%]",
    tag: "-right-2.5 -bottom-1",
  },
  {
    name: "Jonas Weber",
    pos: "right-[11%] top-[12%]",
    tag: "-left-2.5 -bottom-1 -scale-x-100",
  },
  { name: "Priya Nair", pos: "left-[16%] top-[54%]", tag: "-right-4 top-1/2" },
  {
    name: "Tomas Ruiz",
    pos: "right-[15%] top-[58%]",
    tag: "-left-4 top-1/2 -scale-x-100",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="lp-grid absolute inset-0" aria-hidden="true" />

      {/* Floating avatars */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        {FLOATERS.map((f, i) => (
          <div key={f.name} className={`absolute ${f.pos}`}>
            <Avatar
              name={f.name}
              seed={i}
              className="h-16 w-16 text-[15px] shadow-[var(--shadow-paper)] ring-4 ring-cream"
            />
            <CursorTag className={`absolute text-navy ${f.tag}`} />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-brand uppercase shadow-[var(--shadow-panel)]">
            <SparklesIcon className="h-3.5 w-3.5" />
            Built for speed
          </span>

          <h1 className="mt-6 max-w-[13ch] text-[40px] leading-[1.06] font-extrabold tracking-tight text-ink sm:text-[52px] lg:text-[58px]">
            One tool to{" "}
            <span className="underline decoration-accent-2 decoration-[6px] underline-offset-[10px]">
              write
            </span>{" "}
            resumes that get you hired
          </h1>

          <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.7] text-ink-soft">
            resumeai helps you draft, tailor and export faster — with AI writing
            help, a live preview and ATS-ready formatting that keeps every
            application sharp.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard" className={btnPrimary}>
              Start for Free
            </Link>
            <a href="#features" className={btnQuiet}>
              Get a Demo
            </a>
          </div>
        </div>
      </div>

      {/* Social proof rail */}
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-5 pb-16 sm:px-8 md:flex-row md:gap-10">
        <p className="max-w-[14ch] shrink-0 text-center text-[13.5px] leading-[1.45] font-bold text-ink-soft md:text-left">
          More than 100k+ job seekers hired
        </p>
        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-9 gap-y-5 md:justify-between">
          {PARTNERS.map(({ name, Glyph }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 text-[15px] font-bold tracking-tight text-ink-faint"
            >
              <Glyph className="h-[18px] w-[18px]" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
