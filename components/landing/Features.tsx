import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  FileTextIcon,
  GridIcon,
  PlusIcon,
} from "@/components/ui/icons";

import { Avatar } from "./marks";
import { btnMini, btnPrimary, Eyebrow, panel } from "./ui";

/* -------------------------------------------------------------------------- */
/* Mock 1 — match-score chart                                                 */
/* -------------------------------------------------------------------------- */

// Relative bar heights, 0-100. Index 3 is the highlighted version.
const BARS = [45, 52, 38, 100, 61, 30, 56, 42, 67, 34, 49];
const TEAM = ["Ada Chen", "Marco Silva", "Ines Bakker", "Ray Osei"];

function ScoreChart() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-field p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[13.5px] font-bold text-ink">
          Northwind Inc.
          <ChevronDownIcon className="h-4 w-4 text-ink-faint" />
        </span>
        <span className="flex -space-x-1.5">
          {TEAM.map((name, i) => (
            <Avatar
              key={name}
              name={name}
              seed={i + 1}
              className="h-[22px] w-[22px] text-[8px] ring-2 ring-field"
            />
          ))}
        </span>
      </div>

      <div className="mt-5 flex flex-1 gap-3">
        <div className="flex w-6 shrink-0 flex-col justify-between py-0.5 text-[9.5px] font-bold text-ink-faint">
          <span>10k</span>
          <span>6k</span>
          <span>3k</span>
          <span>0</span>
        </div>
        <div className="flex h-[132px] flex-1 items-end gap-[3.5%] border-b border-field-border">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-[3px] ${
                i === 3 ? "bg-brand" : "bg-ink-faint/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mock 2 — assist toggles                                                    */
/* -------------------------------------------------------------------------- */

const TOGGLES = [
  { label: "Rewrite bullet points", on: true },
  { label: "Grammar and tone", on: true },
  { label: "Keyword matching", on: true },
  { label: "ATS compatibility", on: true },
  { label: "Length warnings", on: false },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-block h-[18px] w-8 rounded-full ${
        on ? "bg-brand" : "bg-ink-faint/35"
      }`}
    >
      <span
        className={`absolute top-[3px] h-3 w-3 rounded-full bg-white ${
          on ? "right-[3px]" : "left-[3px]"
        }`}
      />
    </span>
  );
}

function AssistPanel() {
  return (
    <div className="rounded-t-2xl bg-field px-4 pt-4 pb-2 sm:px-5">
      <div className="flex items-center justify-between border-b border-field-border pb-3">
        <span className="text-[13px] font-bold text-ink">
          AI assist settings
        </span>
        <button type="button" className={btnMini}>
          Save
        </button>
      </div>
      <ul>
        {TOGGLES.map((t) => (
          <li
            key={t.label}
            className="flex items-center justify-between border-b border-field-border py-3.5 last:border-0"
          >
            <span
              className={`text-[12px] font-bold ${
                t.on ? "text-ink-soft" : "text-ink-faint"
              }`}
            >
              {t.label}
            </span>
            <Toggle on={t.on} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mock 3 — version activity                                                  */
/* -------------------------------------------------------------------------- */

function ActivityPanel() {
  return (
    <div className="rounded-t-2xl bg-field px-4 pt-4 pb-2 sm:px-5">
      <div className="flex items-center justify-between border-b border-field-border pb-3">
        <span className="text-[13px] font-bold text-ink">Activity</span>
        <button type="button" className={btnMini}>
          <PlusIcon className="h-3 w-3" /> New version
        </button>
      </div>

      <div className="space-y-2.5 pt-3">
        <div className="rounded-xl bg-panel p-2.5 ring-1 ring-black/5">
          <div className="flex items-center gap-1.5">
            <Avatar name="Ada Chen" seed={1} className="h-4 w-4 text-[7px]" />
            <span className="text-[11.5px] font-bold text-ink">Ada Chen</span>
          </div>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">
            Tailored{" "}
            <span className="font-bold text-brand">@Senior Engineer</span> for
            Northwind — 92% keyword match
          </p>
        </div>

        <div className="rounded-xl bg-panel p-2.5 ring-1 ring-black/5">
          <div className="flex items-center gap-1.5">
            <Avatar
              name="Marco Silva"
              seed={2}
              className="h-4 w-4 text-[7px]"
            />
            <span className="text-[11.5px] font-bold text-ink">
              Marco Silva
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-ink-soft">
            <FileTextIcon className="h-3.5 w-3.5 text-danger" />
            Exported resume-northwind.pdf
          </p>
        </div>

        <div className="rounded-xl bg-panel p-2.5 ring-1 ring-black/5">
          <div className="flex items-center gap-1.5">
            <Avatar name="Ines Bakker" seed={3} className="h-4 w-4 text-[7px]" />
            <span className="text-[11.5px] font-bold text-ink">
              Ines Bakker
            </span>
          </div>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">
            Restored the Editorial template on v3
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

export function Features() {
  return (
    <section id="features" className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col items-center text-center">
          <Eyebrow icon={<GridIcon className="h-3.5 w-3.5" />}>Features</Eyebrow>

          <h2 className="mt-5 max-w-[18ch] text-[30px] leading-[1.15] font-extrabold tracking-tight text-ink sm:text-[38px]">
            Everything you need to turn a blank page into an offer
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-ink-soft">
            Draft faster, tailor per role and export anywhere — with an editor
            that keeps your formatting recruiter-ready the whole way through.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {/* Wide card */}
          <div className={cn(panel, "p-2")}>
            <div className="grid gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="flex flex-col justify-center px-4 py-6 sm:px-7 sm:py-10">
                <h3 className="text-[22px] font-extrabold tracking-tight text-ink">
                  Application dashboard
                </h3>
                <p className="mt-3 max-w-[42ch] text-[14px] leading-[1.65] text-ink-soft">
                  See how each version of your resume scores against the role
                  you&apos;re targeting, and which one is actually getting
                  replies.
                </p>
                <a
                  href="#"
                  className={cn(btnPrimary, "mt-6 h-10 self-start text-[14px]")}
                >
                  Explore all
                </a>
              </div>
              <ScoreChart />
            </div>
          </div>

          {/* Paired cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Smart suggestions",
                copy: "Rewrite bullet points, fix tone and match keywords without ever leaving the field you're editing.",
                panel: <AssistPanel />,
              },
              {
                title: "Version history",
                copy: "Tailor a copy per role, compare versions and export the one that fits — all tracked in one place.",
                panel: <ActivityPanel />,
              },
            ].map((card) => (
              <div
                key={card.title}
                className={cn(
                  panel,
                  "relative flex h-[430px] flex-col overflow-hidden sm:h-[460px]",
                )}
              >
                <div className="px-6 pt-8 text-center">
                  <h3 className="text-[22px] font-extrabold tracking-tight text-ink">
                    {card.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[38ch] text-[13.5px] leading-[1.6] text-ink-soft">
                    {card.copy}
                  </p>
                </div>
                <div className="mt-6 px-3 sm:px-4">{card.panel}</div>
                {/* The mock runs off the bottom of the card; fade it out so the
                    clip reads as intentional. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-panel to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
