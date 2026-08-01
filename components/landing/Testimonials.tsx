import { TEMPLATES } from "@/lib/templates";

import { Avatar } from "./marks";
import { h2, sectionGap, shell } from "./ui";

// Illustrative quotes, not attributed to any review platform — swap them for
// real ones (with the reviewer's permission) when there are some to show.
type Quote = { quote: string; name: string; role: string };

const ROW_ONE: Quote[] = [
  {
    quote:
      "I absolutely love this. It has made a huge difference to my career and to a few of my friends'. Editing and customizing is genuinely easy.",
    name: "Siobhan K.",
    role: "Operations Lead",
  },
  {
    quote:
      "Completely free, no watermark, and the export is clean. The format looks sharp and reads clearly — that's all I wanted.",
    name: "Isabel R.",
    role: "Data Analyst",
  },
  {
    quote:
      "I tried it on a Sunday evening and had a polished, modern CV in about ten minutes. The AI suggestions actually sounded like me.",
    name: "Vaibhavi R.",
    role: "Marketing Manager",
  },
  {
    quote:
      "Used it for two resumes now. Super neat, the customization options are the right amount, and it just works.",
    name: "Abhinav C.",
    role: "Software Engineer",
  },
];

const ROW_TWO: Quote[] = [
  {
    quote:
      "Every feature I needed and nothing I didn't. Easily the builder I'd recommend to anyone applying for jobs right now.",
    name: "Aayan M.",
    role: "Recent Graduate",
  },
  {
    quote:
      "The tailoring pass against a job description saved me a whole evening per application. My reply rate went up within a fortnight.",
    name: "Priya N.",
    role: "Product Designer",
  },
  {
    quote:
      "Switching templates didn't break a single line of my content. I compared four of them side by side and shipped the one that read best.",
    name: "Tomás L.",
    role: "Finance Associate",
  },
  {
    quote:
      "I write cover letters I don't hate now. It keeps my voice and just fixes the shape of the thing, which is exactly the help I needed.",
    name: "Grace O.",
    role: "Account Manager",
  },
];

const STATS = [
  { value: "100K+", label: "Resumes built" },
  { value: `${TEMPLATES.length}`, label: "Templates, all free" },
  { value: "40+", label: "Languages supported" },
];

/** The opening quote glyph on each card — inline so the page ships no icon font. */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <path
        d="M0 18V9.6C0 4.3 3 .9 8.2 0l.9 2.9C6.4 3.7 5 5.3 5 7.6h3.6V18zm14.4 0V9.6c0-5.3 3-8.7 8.2-9.6l.9 2.9c-2.7.8-4.1 2.4-4.1 4.7H23V18z"
        fill="currentColor"
      />
    </svg>
  );
}

function Card({ q }: { q: Quote }) {
  return (
    <figure className="mx-2.5 flex w-[300px] shrink-0 flex-col justify-between rounded-3xl bg-panel p-6 ring-1 ring-black/[0.09] sm:mx-3 sm:w-[360px] lg:w-[420px] lg:p-8">
      <div>
        <QuoteMark className="h-5 w-7 text-brand lg:h-6 lg:w-8" />
        <blockquote className="mt-5 text-[17px] leading-[1.45] font-bold tracking-[-0.02em] text-ink lg:text-[20px]">
          {q.quote}
        </blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3.5">
        <Avatar name={q.name} className="h-12 w-12" />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold text-ink lg:text-[17px]">
            {q.name}
          </p>
          <p className="truncate text-[13px] text-ink-soft">{q.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * One drifting row. The track holds two identical halves so the -50% wrap is
 * invisible, and `reverse` flips the direction for the top row — the two rows
 * sliding opposite ways is what gives the block its motion.
 *
 * The rows run full-bleed, so a seamless loop needs each half to be at least
 * as wide as the window: four cards is only ~1800px, which a wide monitor
 * would tear open, so each half lists them twice (~3600px). Hovering pauses
 * the drift, and the row can still be dragged by hand — which is also the
 * fallback when the reader has asked for reduced motion.
 */
function Row({
  quotes,
  duration,
  reverse = false,
}: {
  quotes: Quote[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="lp-rail-mask scroll-slim overflow-x-auto">
      <div
        className={`lp-rail ${duration} ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex" aria-hidden={half === 1}>
            {[0, 1].map((copy) =>
              quotes.map((q) => <Card key={`${copy}-${q.name}`} q={q} />),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className={sectionGap}>
      <div className={`${shell} flex flex-col items-center text-center`}>
        {/* Placeholder social proof, same as the quotes below: the number is
            the one the stats row already claims, not a review-site rating. */}
        <span className="inline-flex items-center gap-3 rounded-full bg-navy py-1.5 pr-6 pl-1.5 text-[15px] font-bold text-white shadow-[0_18px_30px_rgba(32,26,46,0.18)]">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path
                d="m10 1.6 2.4 5 5.5.8-4 3.8.95 5.4L10 14l-4.85 2.6.95-5.4-4-3.8 5.5-.8z"
                fill="currentColor"
              />
            </svg>
          </span>
          Loved by 100K+ job seekers
        </span>

        <h2 className={`${h2} mt-9`}>
          Loved &amp; trusted
          <br className="block md:hidden" /> by job seekers everywhere
        </h2>
      </div>

      <div className="mt-10 grid gap-5 sm:gap-6 lg:mt-12">
        <Row quotes={ROW_ONE} duration="[--rail-duration:110s]" reverse />
        <Row quotes={ROW_TWO} duration="[--rail-duration:125s]" />
      </div>

      <div className={`${shell} mt-12 lg:mt-16`}>
        <div className="grid gap-8 rounded-2xl bg-panel px-6 py-11 ring-1 ring-black/[0.09] sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[34px] font-extrabold tracking-tight text-ink sm:text-[40px]">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] font-semibold text-ink-soft">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
