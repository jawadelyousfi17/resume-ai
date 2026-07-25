import { TEMPLATES } from "@/lib/templates";

import { Avatar } from "./marks";
import { h2, lede, sectionGap, shell } from "./ui";

// Illustrative quotes, not attributed to any review platform — swap them for
// real ones (with the reviewer's permission) when there are some to show.
const QUOTES = [
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
  {
    quote:
      "Every feature I needed and nothing I didn't. Easily the builder I'd recommend to anyone applying for jobs right now.",
    name: "Aayan M.",
    role: "Recent Graduate",
  },
];

const STATS = [
  { value: "100K+", label: "Resumes built" },
  { value: `${TEMPLATES.length}`, label: "Templates, all free" },
  { value: "40+", label: "Languages supported" },
];

export function Testimonials() {
  return (
    <section className={sectionGap}>
      <div className={shell}>
        <h2 className={h2}>
          Loved &amp; trusted
          <br className="block md:hidden" /> by job seekers everywhere
        </h2>
        <p className={lede}>
          People use resumeai to get the boring part over with quickly, so they
          can spend their evening on the application itself.
        </p>
      </div>

      {/* Scrolls horizontally; snapping keeps a card aligned to the shell. */}
      <div className="scroll-slim mt-10 snap-x snap-mandatory overflow-x-auto pb-2 lg:mt-12">
        <div className="flex w-max gap-4 px-5 sm:gap-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1180px)/2))]">
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-3xl bg-panel p-6 shadow-[var(--shadow-panel)] ring-1 ring-black/5 sm:w-[360px] lg:w-[420px] lg:p-8"
            >
              <blockquote className="grow text-[15px] leading-[1.8] text-ink-soft italic lg:text-base">
                {q.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <Avatar name={q.name} seed={i} className="h-11 w-11 text-sm" />
                <div>
                  <p className="text-[15px] font-bold text-ink">{q.name}</p>
                  <p className="text-[13px] text-ink-soft">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className={`${shell} mt-12 lg:mt-16`}>
        <div className="grid gap-8 rounded-2xl bg-panel px-6 py-11 shadow-[var(--shadow-panel)] ring-1 ring-black/5 sm:grid-cols-3">
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
