import Image from "next/image";
import Link from "next/link";

import { CheckIcon, DownloadIcon } from "@/components/ui/icons";
import { TEMPLATES } from "@/lib/templates";

import { Avatar, Star } from "./marks";
import { btnCompact, btnPrimary, btnQuiet, FLOAT, shell } from "./ui";

// The page in the hero. Ledger is the one the editor opens on and the first in
// the library, so the hero shows what a new resume actually looks like.
const HERO_TEMPLATE = "ledger";

export function Hero() {
  return (
    <section
      className={`${shell} grid items-center gap-14 pt-10 pb-6 md:grid-cols-2 lg:pt-16`}
    >
      <div>
        {/* Placeholder, like the reviews further down: swap in the real
            average when there are real reviews behind it. */}
        <p className="flex items-center gap-2 text-[14px] text-ink-soft">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-lp-accent text-white">
            <Star className="h-3 w-3" />
          </span>
          <span>
            <strong className="font-semibold text-ink">4.7</strong> from job
            seekers
          </span>
        </p>

        {/* The keyword is in the h1 — it's what the page ranks for. */}
        <h1 className="mt-6 font-editorial text-[46px] leading-[1.03] font-normal tracking-[-0.035em] text-ink sm:text-[58px] lg:text-[70px]">
          Build a resume that gets you hired
        </h1>

        <p className="mt-6 max-w-[440px] text-[16px] leading-[1.62] text-ink-soft">
          ATS-friendly templates, AI writing, an instant review and clean PDF
          downloads — your first resume is free forever.
        </p>

        <div className="mt-8 flex flex-nowrap gap-3">
          <Link href="/dashboard" className={`${btnPrimary} ${btnCompact}`}>
            Get Started — For Free!
          </Link>
          <Link
            href="/resume-templates"
            className={`${btnQuiet} ${btnCompact}`}
          >
            Browse templates
          </Link>
        </div>
      </div>

      {/* The picture: a page and the things around it. Decorative — the copy
          beside it already says all of it — and inert, since every "button"
          in it is drawn. */}
      <div
        aria-hidden="true"
        inert
        className="relative mx-auto h-[470px] w-full max-w-[540px] select-none sm:h-[530px]"
      >
        {/* The wash behind it: soft, irregular, slightly turned. */}
        <div className="absolute inset-x-[6%] top-[4%] bottom-[2%] rotate-[-4deg] rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-canvas" />

        {/* The page, as a tall card. */}
        <article
          className={`absolute top-0 left-1/2 w-[250px] -translate-x-1/2 overflow-hidden rounded-[22px] bg-white ring-1 ring-divider sm:left-[54%] sm:w-[270px] ${FLOAT}`}
        >
          <div className="relative h-[300px] overflow-hidden sm:h-[330px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/templates/${HERO_TEMPLATE}.png`}
              alt=""
              width={1588}
              height={2256}
              fetchPriority="high"
              decoding="async"
              className="w-full"
            />
            <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-ink ring-1 ring-divider">
              A4
            </span>
          </div>
          <div className="border-t border-divider p-3.5">
            <span className="mx-auto mb-3 block h-1 w-8 rounded-full bg-divider" />
            <div className="flex items-center gap-2.5">
              <Avatar name="Amara Diaz" className="h-9 w-9 rounded-[8px]" />
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-ink">
                  Amara Diaz — Product Designer
                </p>
                <p className="text-[11.5px] text-ink-soft">ATS score 92</p>
              </div>
            </div>
            <span className="btn-fill mt-3 flex h-9 items-center justify-center gap-1.5 text-[12.5px] font-semibold">
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </span>
          </div>
        </article>

        {/* Stars, pinned to the page's shoulder. */}
        <div
          className={`absolute top-[14%] left-[6%] flex gap-0.5 rounded-full bg-white px-2.5 py-1.5 text-ink ring-1 ring-divider sm:left-[12%] ${FLOAT}`}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-3.5 w-3.5" />
          ))}
        </div>

        {/* What it promises, as ticked chips. */}
        <div className="absolute top-[6%] right-0 hidden flex-col gap-1.5 sm:flex">
          {["ATS-friendly", "No watermark"].map((b) => (
            <span
              key={b}
              className={`flex items-center gap-1.5 rounded-full bg-white py-1 pr-3 pl-1 text-[11.5px] text-ink ring-1 ring-divider ${FLOAT}`}
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-lp-accent text-white">
                <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {b}
            </span>
          ))}
        </div>

        {/* The AI, as a small card on the left. */}
        <article
          className={`absolute top-[33%] left-0 hidden w-[140px] overflow-hidden rounded-[16px] bg-lp-blue sm:block ${FLOAT}`}
        >
          <Image
            src="/images/landing/feature-ai-writing.png"
            alt=""
            width={1254}
            height={1254}
            sizes="140px"
            className="h-[118px] w-full object-contain p-2"
          />
          <span className="btn-fill mx-2 mb-2 flex h-7 items-center justify-center text-[11px] font-semibold">
            Rewrite with AI
          </span>
        </article>

        {/* A number worth saying, in the accent. */}
        <div className="absolute right-[1%] bottom-[24%] hidden w-[128px] rounded-[16px] bg-lp-accent p-3.5 text-white sm:block">
          <span className="text-[9.5px] tracking-wide text-white/75">
            — CHOOSE FROM
          </span>
          <strong className="mt-1 block font-editorial text-[32px] leading-none font-normal">
            {TEMPLATES.length}
          </strong>
          <p className="mt-1 text-[11px] leading-tight text-white/85">
            free templates
          </p>
        </div>

        {/* Skills, as tags being added. */}
        <div
          className={`absolute bottom-[5%] left-[2%] hidden rounded-[14px] bg-white p-3 ring-1 ring-divider sm:block ${FLOAT}`}
        >
          <strong className="text-[11.5px] font-semibold text-ink">
            Add skills to your resume
          </strong>
          <div className="mt-2 flex gap-1.5">
            {["Figma", "Research", "SQL"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-canvas px-2 py-0.5 text-[10.5px] text-ink ring-1 ring-divider"
              >
                + {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
