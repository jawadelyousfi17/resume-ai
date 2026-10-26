import { TEMPLATES } from "@/lib/templates";

import { Avatar, Star } from "./marks";
import { eyebrow, FLOAT, h2, sectionGap, shell } from "./ui";

// "Don't take our word for it": a rule-topped metric, one enormous number,
// then a picture beside the words of people who used it.
//
// Placeholder social proof, like before: the quotes are illustrative and not
// attributed to any review platform, and the 4.7 is a stand-in for a real
// average. Swap both for real ones — and keep them out of the page's
// structured data until then, where an unbacked rating is penalised.
const RATING = 4.7;

const QUOTES = [
  {
    quote:
      "Completely free, no watermark, and the export is clean. That's all I wanted.",
    name: "Isabel R.",
    role: "Data Analyst",
  },
  {
    quote:
      "The tailoring pass saved me a whole evening per application. My reply rate went up within a fortnight.",
    name: "Priya N.",
    role: "Product Designer",
  },
  {
    quote:
      "Switching templates didn't break a single line. I compared four and shipped the one that read best.",
    name: "Tomás L.",
    role: "Finance Associate",
  },
];

function MetricLabel({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-divider pb-3">
      <strong className="text-[15px] font-semibold text-ink tabular-nums">
        {value}
      </strong>
      <span className="text-[11.5px] tracking-[0.06em] text-ink-soft uppercase">
        {label}
      </span>
    </div>
  );
}

export function Stories() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <span className={eyebrow}>{"// What People Say //"}</span>
      <h2 className={`${h2} mt-4`}>Don&apos;t take our word for it.</h2>

      <div className="mt-8">
        <MetricLabel value={`${RATING} ★`} label="Average rating" />
      </div>
      {/* The number is the picture here; it's also said in words below it. */}
      <p
        aria-hidden="true"
        className="py-4 font-editorial text-[clamp(64px,16vw,230px)] leading-[0.95] font-normal tracking-[-0.04em] text-ink"
      >
        100,000+
      </p>
      <MetricLabel value="100k+" label="Resumes built" />

      <div className="mt-8 grid gap-4 md:grid-cols-[1.94fr_1fr]">
        {/* Picture: the same resume before and after, and what it led to.
            Decorative — the quotes beside it carry the words. */}
        <div
          aria-hidden="true"
          inert
          className="relative h-[400px] overflow-hidden rounded-[18px] bg-lp-blue select-none lg:h-[460px]"
        >
          {/* A soft light behind the pages. */}
          <div className="absolute top-1/2 left-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45" />

          {/* Before: the draft, faded and set back. */}
          <figure className="absolute top-14 left-[8%] w-[170px] rotate-[-7deg] opacity-70 lg:left-[12%] lg:w-[200px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/templates/${TEMPLATES[0].id}.png`}
              alt=""
              loading="lazy"
              className="w-full bg-white grayscale shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]"
            />
            <figcaption className="absolute -top-3 -left-3 flex items-center gap-1.5 rounded-full bg-white py-1 pr-3 pl-1 text-[11px] font-medium text-ink-soft ring-1 ring-divider">
              <b className="grid h-6 w-6 place-items-center rounded-full bg-lp-pink text-[11px] font-bold text-ink">
                62
              </b>
              Before
            </figcaption>
          </figure>

          {/* After: the finished page, in front. */}
          <figure className="absolute top-8 left-[34%] w-[210px] rotate-[3deg] lg:left-[36%] lg:w-[250px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/templates/${TEMPLATES[4].id}.png`}
              alt=""
              loading="lazy"
              className="w-full bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
            />
            <figcaption className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-ink py-1 pr-3 pl-1 text-[11px] font-medium text-white">
              <b className="grid h-6 w-6 place-items-center rounded-full bg-lp-mint text-[11px] font-bold text-ink">
                86
              </b>
              After
            </figcaption>
          </figure>

          {/* What came of it: the applications, as a little funnel. */}
          <div
            className={`absolute top-6 right-6 hidden w-[200px] rounded-[14px] bg-white p-4 sm:block ${FLOAT}`}
          >
            <div className="flex items-baseline justify-between">
              <strong className="text-[12px] font-semibold text-ink">
                Applications
              </strong>
              <span className="text-[10px] text-ink-faint">This month</span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["Sent", 24, 100, "bg-canvas"],
                ["Replies", 9, 38, "bg-lp-blue"],
                ["Interviews", 3, 13, "bg-lp-mint"],
              ].map(([label, n, w, bg]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-[10.5px] text-ink-soft">
                    {label}
                    <b className="font-semibold text-ink tabular-nums">{n}</b>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-canvas">
                    <span
                      className={`block h-full rounded-full ${bg === "bg-canvas" ? "bg-ink/15" : bg}`}
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The score's move, as a figure. */}
          <div className="absolute bottom-6 left-6 rounded-[14px] bg-white p-3.5 ring-1 ring-divider">
            <span className="text-[10px] tracking-wide text-ink-soft uppercase">
              Resume score
            </span>
            <strong className="mt-1 flex items-baseline gap-2 font-editorial text-[34px] leading-none font-normal text-ink">
              86
              <span className="rounded-full bg-lp-mint px-1.5 py-0.5 font-sans text-[11px] font-semibold">
                +24
              </span>
            </strong>
          </div>

          <span
            className={`absolute right-6 bottom-[86px] hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] text-ink sm:flex ${FLOAT}`}
          >
            <span className="h-2 w-2 rounded-full bg-[#2b9e7c]" />
            Offer accepted
          </span>

          <span
            className={`absolute right-6 bottom-6 flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-[12px] leading-tight text-ink ${FLOAT}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 21S1 14 1 7a6 6 0 0 1 11-3A6 6 0 0 1 23 7c0 7-11 14-11 14"
                fill="#f44463"
              />
            </svg>
            Landed it! Starting
            <br />
            next month
          </span>
        </div>

        {/* Words: the brown card, quotes on white inside it. */}
        <div className="flex flex-col rounded-[18px] bg-lp-brown p-6 lg:p-7">
          <h3 className="font-editorial text-[28px] leading-[1.1] font-normal tracking-[-0.02em] text-white lg:text-[32px]">
            Loved by job seekers
          </h3>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-white/70">
            <span className="flex gap-0.5 text-[#f5a623]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5" />
              ))}
            </span>
            {RATING} out of 5
          </p>

          <ul className="mt-5 flex-1 space-y-2.5 rounded-[14px] bg-white p-4">
            {QUOTES.map((q) => (
              <li
                key={q.name}
                className="border-b border-divider pb-3 last:border-b-0 last:pb-0"
              >
                <blockquote className="text-[13px] leading-[1.5] text-ink">
                  “{q.quote}”
                </blockquote>
                <p className="mt-2 flex items-center gap-2 text-[11.5px] text-ink-soft">
                  <Avatar name={q.name} className="h-6 w-6" />
                  <span className="font-semibold text-ink">{q.name}</span>
                  {q.role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
