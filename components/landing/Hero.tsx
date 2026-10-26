import Link from "next/link";

import { CheckIcon } from "@/components/ui/icons";

import { Avatar } from "./marks";
import { HeroShowcase } from "./HeroShowcase";
import { ArrowRight, btnCompact, btnQuiet, shell } from "./ui";

// The page in the showcase. Ledger is the one the editor opens on and the
// first in the library, so the hero shows what a new resume actually looks
// like.
const HERO_TEMPLATE = "ledger";

const FACES = ["Priya Nair", "Tomas Ruiz", "Ada Chen", "Jonas Weber"];

/** The free plan, in three words each — what used to be a section of its own. */
const PROMISES = ["Free forever", "No watermark", "Unlimited PDFs"];

export function Hero() {
  return (
    <section className={`${shell} pt-10 text-center lg:pt-16`}>
      {/* The keyword line is the h1 — it's what the page ranks for — and the
          big claim under it is the h2, sized as the headline. */}
      <h1 className="inline-flex items-center gap-2 rounded-full bg-panel py-1 pr-3.5 pl-1 text-[13px] font-medium text-ink-soft ring-1 ring-divider">
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11.5px] font-semibold text-white">
          Free
        </span>
        Online resume builder
      </h1>

      <h2 className="mx-auto mt-6 max-w-[16ch] text-[42px] leading-[1.02] font-bold tracking-[-0.04em] text-ink sm:text-[56px] lg:text-[72px]">
        Build a job-winning resume
      </h2>

      <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-[1.6] text-ink-soft lg:text-[19px]">
        Pick a template, write with AI, and download a clean PDF in minutes.
      </p>

      <div className="mt-8 flex flex-nowrap justify-center gap-3">
        <Link
          href="/dashboard"
          className={`btn-fill ${btnCompact} inline-flex h-12 min-w-[9.5rem] items-center justify-center gap-2 px-6 text-[15px] font-semibold transition lg:text-base`}
        >
          Start for free
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/resume-templates" className={`${btnQuiet} ${btnCompact}`}>
          Browse templates
        </Link>
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px] text-ink-soft">
        {PROMISES.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <CheckIcon className="h-4 w-4 text-brand" strokeWidth={2.25} />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-12 lg:mt-16">
        <HeroShowcase template={HERO_TEMPLATE} />
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <span className="flex -space-x-2">
          {FACES.map((name) => (
            <Avatar
              key={name}
              name={name}
              className="h-8 w-8 ring-2 ring-panel"
            />
          ))}
        </span>
        <p className="text-[14px] font-medium text-ink-soft">
          Trusted by <span className="font-semibold text-ink">100k+</span> job
          seekers
        </p>
      </div>
    </section>
  );
}
