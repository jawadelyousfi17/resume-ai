// The hero's picture: a finished page, and around it the things that got it
// there — the review's score, an AI rewrite waiting to be accepted, the match
// against a posting, the PDF ready to go.
//
// The page is a real template render; the cards are drawn from the app's own
// tokens, so they look like the panels they stand for. All of it decoration:
// hidden from assistive tech and inert, because the heading beside it already
// says what this is, and a reader walking floating cards would hear numbers
// that belong to nobody.

import Image from "next/image";

const CARD =
  "absolute rounded-[14px] bg-panel text-left ring-1 ring-divider shadow-[0_18px_50px_-18px_rgba(17,17,17,0.28)]";

/** Generated paper icons shared with the feature grid. */
function HeroIcon({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <Image
      src={`/images/landing/feature-${name}.png`}
      alt=""
      width={1280}
      height={1280}
      sizes={`${size}px`}
      style={{ width: size, height: size }}
      className="shrink-0 object-contain"
    />
  );
}

export function HeroShowcase({ template }: { template: string }) {
  return (
    <div
      aria-hidden="true"
      inert
      className="relative mx-auto h-[440px] max-w-[1040px] overflow-hidden rounded-[24px] bg-canvas ring-1 ring-divider select-none sm:h-[520px] lg:h-[580px]"
    >
      {/* A faint dot grid: the canvas the editor puts a page on. */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(var(--app-divider) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* The page, rising out of the bottom edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/templates/${template}.png`}
        alt=""
        width={1588}
        height={2256}
        fetchPriority="high"
        decoding="async"
        className="absolute top-12 left-1/2 w-[300px] -translate-x-1/2 bg-white shadow-[0_24px_60px_-20px_rgba(17,17,17,0.35)] sm:w-[360px] lg:top-14 lg:w-[420px]"
      />

      {/* The page fades into the canvas rather than being cut by the edge —
          under the cards, which sit on top of it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />

      {/* Review score — top left. */}
      <div className={`${CARD} top-10 left-[4%] hidden w-[240px] p-4 md:block lg:top-14 lg:left-[6%]`}>
        <div className="flex items-center gap-3">
          <HeroIcon name="resume-review" size={64} />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-positive uppercase">
              Strong · 86
            </p>
            <p className="text-[14px] font-bold text-ink">Resume review</p>
            <p className="mt-0.5 inline-flex rounded-full bg-positive/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-positive tabular-nums">
              62 → 86
            </p>
          </div>
        </div>
        <div className="mt-3.5 space-y-2">
          {[
            ["Impact", 90],
            ["Clarity", 84],
            ["Keywords", 78],
          ].map(([label, v]) => (
            <div key={label} className="flex items-center gap-2 text-[11px]">
              <span className="w-14 text-ink-soft">{label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
                <span
                  className="block h-full rounded-full bg-brand"
                  style={{ width: `${v}%` }}
                />
              </span>
              <span className="w-5 text-right font-medium text-ink tabular-nums">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI rewrite — top right. */}
      <div className={`${CARD} top-24 right-[4%] hidden w-[270px] p-4 md:block lg:top-28 lg:right-[5%]`}>
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-brand">
          <HeroIcon name="ai-writing" size={48} />
          AI rewrite
        </p>
        <p className="mt-2.5 text-[12px] leading-[1.5] text-ink-faint line-through decoration-ink-faint/60">
          Worked on the reporting tool.
        </p>
        <p className="mt-1.5 text-[12.5px] leading-[1.5] font-medium text-ink">
          Redesigned reporting, cutting time-to-first-report from 11 minutes to
          under 2.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="btn-fill px-3 py-1.5 text-[11.5px] font-semibold">
            Accept
          </span>
          <span className="btn-soft px-3 py-1.5 text-[11.5px] font-semibold">
            Skip
          </span>
        </div>
      </div>

      {/* Match against a posting — lower left. */}
      <div className={`${CARD} bottom-16 left-[8%] hidden w-[220px] p-3.5 md:block lg:bottom-20 lg:left-[11%]`}>
        <div className="flex items-center gap-2.5">
          <HeroIcon name="job-match" size={56} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-ink-soft">Job match</p>
            <p className="text-[14px] font-bold text-ink tabular-nums">
              48% <span className="font-normal text-ink-faint">→</span> 92%
            </p>
          </div>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-canvas">
          <div className="h-full w-[92%] rounded-full bg-brand" />
        </div>
      </div>

      {/* PDF ready — lower right. */}
      <div className={`${CARD} right-[9%] bottom-14 hidden items-center gap-3 p-3 md:flex lg:right-[12%] lg:bottom-16`}>
        <HeroIcon name="pdf-download" size={56} />
        <div>
          <p className="text-[12.5px] font-semibold text-ink">Amara_Diaz.pdf</p>
          <p className="flex items-center gap-1 text-[11px] text-positive">
            No watermark
          </p>
        </div>
      </div>

      {/* On a phone the corners are too tight for four cards — one score,
          pinned to the page, says the same thing. */}
      <div className={`${CARD} bottom-6 left-1/2 flex w-[230px] -translate-x-1/2 items-center gap-3 p-3 md:hidden`}>
        <HeroIcon name="resume-review" size={64} />
        <div>
          <p className="text-[13.5px] font-bold text-ink">Resume review</p>
          <p className="mt-0.5 inline-flex rounded-full bg-positive/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-positive tabular-nums">
            62 → 86
          </p>
        </div>
      </div>

    </div>
  );
}
