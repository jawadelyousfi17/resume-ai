// The hero's demo reel: the pointer walks a toolbar — Generate, Edit,
// Template, Export — and the resume reacts to each click.
//
// What's on screen is real output: the layers are the same document rendered by
// the app's own <ResumePreview>. The motion is pure CSS keyframes, so this
// stays a server component and ships no JavaScript; the timing contract lives
// with the keyframes in globals.css.
//
// The whole reel is aria-hidden. It's a picture of an interface, not one, and
// a screen reader walking a toolbar that can't be operated would be worse than
// silence. The hero's real call to action sits beside it.

import {
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  GridIcon,
  PencilIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import type { TemplateId } from "@/lib/types";

import { Avatar } from "./marks";
import { ResumePaper } from "./ResumePaper";
import { sampleWithTemplate } from "./sample-resume";

// Two visibly different templates, swapped on the Template beat.
const REEL: TemplateId[] = ["ledger", "bergen"];

// Negative offsets that drop each piece into its own 2.5s beat of the 10s loop.
const BEAT = ["0s", "-7.5s", "-5s", "-2.5s"];

// The paper and the toolbar share a width so the cursor's percentage stops land
// on the middle of each control.
const WIDTH = "w-[290px] sm:w-[360px] lg:w-[430px] xl:w-[470px]";

const PILLS = [
  { label: "Generate", Icon: SparklesIcon },
  { label: "Edit", Icon: PencilIcon },
  { label: "Template", Icon: GridIcon },
  { label: "Export", Icon: DownloadIcon },
];

const CHIPS = [
  { label: "Generating", dots: true },
  { label: "Rewriting bullet", dots: true },
  { label: "New template", dots: false },
  { label: "Exported PDF", dots: false },
];

/** The pointer that does the clicking. */
function Cursor() {
  return (
    <span className="lp-demo-cursor pointer-events-none absolute top-[52%] z-30 -ml-[7px]">
      <svg
        viewBox="-0.5 -0.5 16 16"
        className="h-[18px] w-[18px] drop-shadow-[0_2px_3px_rgba(15,23,42,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.2403125 5.168374999999999c0.9875625 0.401125 0.9121875 1.82375 -0.11225 2.1181875l-5.1691875 1.4859375 -2.3609375 4.8326875000000005c-0.4679375 0.9576875 -1.8820625 0.784875 -2.1055625 -0.25725000000000003L1.0856875000000001 2.1243125c-0.18887500000000002 -0.8808125 0.6848124999999999 -1.6139375 1.5195 -1.275l10.635125 4.3190625Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1"
        />
      </svg>
    </span>
  );
}

export function HeroDemo() {
  return (
    <div className={`relative ${WIDTH}`} aria-hidden="true">
      {/* The page. One layer in flow to give the box its height, the other
          stacked on top and cross-faded. */}
      <div className="relative">
        {REEL.map((id, i) => (
          <div
            key={id}
            className="lp-demo-layer"
            style={{ animationDelay: i === 0 ? "0s" : "-5s" }}
          >
            <ResumePaper
              data={sampleWithTemplate(id)}
              size="hero"
              className="shadow-[0_34px_68px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/5"
            />
          </div>
        ))}

        {/* Beat 0 — the generating pass, clipped to the page. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <div className="lp-demo-sweep h-1/2 w-full bg-gradient-to-b from-transparent via-brand/25 to-transparent" />
        </div>

        {/* Beat 1 — the line being rewritten. */}
        <div
          className="lp-demo-beat absolute inset-x-[7%] top-[43%] z-10"
          style={{ animationDelay: BEAT[1] }}
        >
          <div className="rounded-lg bg-brand-soft/85 px-2.5 py-2 ring-1 ring-brand/40 backdrop-blur-[1px]">
            <p className="text-[10px] leading-snug font-semibold text-ink">
              Cut time-to-first-report from 11 minutes to under 2
              <span className="lp-demo-caret ml-px inline-block w-px align-middle text-brand">
                |
              </span>
            </p>
          </div>
        </div>

        {/* Beat 3 — the exported file. */}
        <div
          className="lp-demo-beat absolute inset-x-[8%] bottom-[7%] z-10"
          style={{ animationDelay: BEAT[3] }}
        >
          <div className="flex items-center gap-2.5 rounded-xl bg-panel p-2.5 shadow-[var(--shadow-paper)] ring-1 ring-black/5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/10">
              <FileTextIcon className="h-4 w-4 text-danger" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11.5px] font-bold text-ink">
                amara-diaz.pdf
              </p>
              <p className="text-[10px] text-ink-soft">A4 · 1 page · 148 KB</p>
            </div>
            <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
          </div>
        </div>

        {/* Status chip, one per beat, all in the same spot. */}
        {CHIPS.map((chip, i) => (
          <div
            key={chip.label}
            className="lp-demo-beat absolute -top-3 -right-3 z-20 flex items-center gap-1.5 rounded-xl bg-panel px-3 py-2 shadow-[var(--shadow-paper)] ring-1 ring-black/5 sm:-right-6"
            style={{ animationDelay: BEAT[i] }}
          >
            <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
            <span className="text-[12px] font-bold whitespace-nowrap text-ink">
              {chip.label}
            </span>
            {chip.dots && (
              <span className="flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="lp-demo-dot h-1 w-1 rounded-full bg-brand"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </div>
        ))}

        {/* Social proof, on the corner opposite the chip. */}
        <div className="absolute -top-5 -left-4 z-20 flex w-[220px] items-center gap-3 rounded-2xl border border-black/5 bg-panel px-3.5 py-2.5 shadow-[var(--shadow-paper)] sm:-left-10 lg:-left-20 lg:w-[250px]">
          <Avatar name="Andrew Irwin" seed={0} className="h-9 w-9 text-[11px]" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-ink">Andrew Irwin</p>
            <p className="text-[11px] text-ink-soft">Product Manager</p>
          </div>
        </div>
      </div>

      {/* The toolbar being clicked: a four-column grid, so the cursor's stops at
          12.5% / 37.5% / 62.5% / 87.5% sit on the middle of each control. */}
      <div className="relative mt-5">
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-panel p-1.5 shadow-[var(--shadow-panel)] ring-1 ring-black/5">
          {PILLS.map((pill, i) => (
            <span key={pill.label} className="relative block">
              <span
                className="lp-demo-ripple absolute inset-0 rounded-xl ring-4 ring-brand"
                style={{ animationDelay: BEAT[i] }}
              />
              <span
                className="lp-demo-pill flex h-10 items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold"
                style={{ animationDelay: BEAT[i] }}
              >
                <pill.Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{pill.label}</span>
              </span>
            </span>
          ))}
        </div>
        <Cursor />
      </div>
    </div>
  );
}
