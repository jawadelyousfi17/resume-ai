"use client";

// The Review tab: the AI reads the finished document and reports back with a
// score per area, the mistakes it found in the writing, and what to change
// first. It runs on request rather than on open — it's a slow, paid call, and
// a review of a resume you're halfway through typing is noise.
//
// This is the view only. The review itself lives in ReviewSession, above the
// tabs, so leaving this one doesn't throw it away.

import { useResume } from "@/lib/store";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import {
  applyFix,
  REVIEW_CATEGORIES,
  type IssueKind,
  type ReviewReport,
} from "@/lib/ai/review";
import { CheckIcon } from "@/components/ui/icons";
import {
  AwardIcon,
  MagicIcon as SparklesIcon,
} from "@/components/ui/svg-icons";
import { useReview, type FixState } from "./ReviewSession";

/** How a score reads, and the colour it reads in. Deliberately unforgiving in
 *  the middle — a resume that scores 65 has work left in it. */
function band(score: number) {
  if (score >= 80) return { color: "#16a34a", label: "Strong" };
  if (score >= 60) return { color: "#d97706", label: "Getting there" };
  if (score >= 40) return { color: "#ea580c", label: "Needs work" };
  return { color: "#e11d48", label: "Early days" };
}

const KIND_LABELS: Record<IssueKind, string> = {
  spelling: "Spelling",
  grammar: "Grammar",
  punctuation: "Punctuation",
  consistency: "Consistency",
};

const PRIORITY_LABELS = {
  high: {
    label: "Fix first",
    blurb: "The changes that move the needle most",
    bar: "bg-danger",
  },
  medium: {
    label: "Worth doing",
    blurb: "Real improvements, once the big ones are done",
    bar: "bg-brand",
  },
  low: {
    label: "Polish",
    blurb: "Small things, if you have the time",
    bar: "bg-ink-faint",
  },
} as const;

export function ReviewPanel() {
  const { data, guest } = useResume();
  const auth = useAuthDialog();
  const { report, busy, error, run } = useReview();

  // The review costs a model call, so it needs an account — the same deal the
  // AI Tools tab offers.
  if (guest) {
    return (
      <div className="space-y-3">
        <Heading />
        <div className="rounded-2xl bg-panel p-6 text-center shadow-[var(--shadow-panel)]">
          <AwardIcon className="mx-auto h-6 w-6 text-purple" />
          <h3 className="mt-3 text-[17px] font-extrabold text-ink">
            Sign in to have your resume reviewed
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            The review comes with an account. The resume you&rsquo;ve started
            comes with you when you sign in.
          </p>
          <button
            type="button"
            onClick={() => auth.open("signup")}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-purple px-4 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90"
          >
            Log in or sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Heading />

      {!report && !busy && (
        <div className="rounded-2xl bg-panel px-6 py-8 text-center shadow-[var(--shadow-panel)]">
          <AwardIcon className="mx-auto h-7 w-7 text-purple" />
          <h3 className="mt-3 text-[18px] font-extrabold text-ink">
            Have our AI read it properly
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            It scores the resume area by area, proofreads every line, and tells
            you what to change first — against what it actually says, not
            generic advice.
          </p>

          {error && (
            <p className="mx-auto mt-4 max-w-sm text-[13.5px] leading-relaxed font-medium text-danger">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={run}
            disabled={!data.sections.length}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple px-5 py-3 text-[15px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <SparklesIcon className="h-[18px] w-[18px]" />
            {error ? "Try again" : "Run the review"}
          </button>

          <p className="mt-3 text-[12.5px] text-ink-faint">
            {data.sections.length
              ? "Takes around half a minute."
              : "Add some content first — there's nothing to review yet."}
          </p>
        </div>
      )}

      {busy && <Working />}

      {report && !busy && (
        <Report report={report} error={error} onRerun={run} />
      )}
    </div>
  );
}

function Heading() {
  return (
    <div className="px-1 pt-1 pb-2">
      <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink">
        How does it hold up?
      </h2>
    </div>
  );
}

function Working() {
  return (
    <div className="rounded-2xl bg-panel px-6 py-8 text-center shadow-[var(--shadow-panel)]">
      <p className="text-[16px] font-extrabold text-ink">
        Reading your resume…
      </p>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">
        Scoring it, proofreading every line, and working out what matters most.
      </p>
      <div
        className="ai-progress-track mt-5 h-1.5 w-full"
        role="progressbar"
        aria-label="Reviewing"
      >
        <span />
      </div>
    </div>
  );
}

function Report({
  report,
  error,
  onRerun,
}: {
  report: ReviewReport;
  error: string | null;
  onRerun: () => void;
}) {
  return (
    <div className="space-y-3">
      <Overall report={report} error={error} onRerun={onRerun} />
      <Scores report={report} />
      <Issues report={report} />
      <Advice report={report} />
    </div>
  );
}

function Overall({
  report,
  error,
  onRerun,
}: {
  report: ReviewReport;
  error: string | null;
  onRerun: () => void;
}) {
  const { color, label } = band(report.overall);

  return (
    <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
      <div className="flex items-center gap-5">
        <ScoreRing value={report.overall} color={color} />
        <div className="min-w-0 flex-1">
          <p
            className="text-[13px] font-extrabold tracking-wide uppercase"
            style={{ color }}
          >
            {label}
          </p>
          <p className="mt-1 text-[14.5px] leading-relaxed font-medium text-ink">
            {report.verdict}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-[13px] font-medium text-danger">{error}</p>
      )}

      <button
        type="button"
        onClick={onRerun}
        className="mt-4 rounded-lg bg-field px-3.5 py-2 text-[14px] font-bold text-ink transition hover:bg-black/[0.06]"
      >
        Review again
      </button>
    </section>
  );
}

/** The score as a ring, because a bare number out of 100 reads like a mark on
 *  a test and this is meant to be read at a glance. */
function ScoreRing({ value, color }: { value: number; color: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-[86px] w-[86px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-black/[0.06]"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[26px] font-extrabold tracking-tight text-ink">
        {value}
      </span>
    </div>
  );
}

function Scores({ report }: { report: ReviewReport }) {
  // Driven by the catalogue rather than the response, so the areas always read
  // in the same order however they came back.
  const byId = new Map(report.scores.map((s) => [s.id, s]));

  return (
    <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
      <SectionTitle>Scores</SectionTitle>

      <div className="mt-4 space-y-4">
        {REVIEW_CATEGORIES.map((category) => {
          const score = byId.get(category.id);
          if (!score) return null;
          const { color } = band(score.score);

          return (
            <div key={category.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[14.5px] font-bold text-ink">
                  {category.label}
                </span>
                <span
                  className="text-[14.5px] font-extrabold tabular-nums"
                  style={{ color }}
                >
                  {score.score}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score.score}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              {score.note && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  {score.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Issues({ report }: { report: ReviewReport }) {
  const { update } = useResume();
  const { fixes, recordFixes } = useReview();

  /** Applies one correction, or several, in a single edit to the document. */
  const fix = (indexes: number[]) => {
    const results: Record<number, FixState> = {};
    update((draft) => {
      for (const i of indexes) {
        if (fixes[i]) continue;
        const issue = report.issues[i];
        results[i] = applyFix(draft, issue.key, issue.quote, issue.fix)
          ? "fixed"
          : "stale";
      }
    });
    recordFixes(results);
  };

  const outstanding = report.issues.map((_, i) => i).filter((i) => !fixes[i]);

  return (
    <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
      <div className="flex items-baseline justify-between gap-3">
        <SectionTitle>Spelling &amp; grammar</SectionTitle>
        {outstanding.length > 1 && (
          <button
            type="button"
            onClick={() => fix(outstanding)}
            className="text-[13px] font-bold text-brand transition hover:opacity-75"
          >
            Fix all {outstanding.length}
          </button>
        )}
      </div>

      {report.issues.length === 0 ? (
        <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft">
          <CheckIcon className="h-4 w-4 text-brand" />
          Nothing caught — the writing reads clean.
        </p>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {report.issues.map((issue, i) => {
            const state = fixes[i];
            return (
              <li
                key={i}
                className={`border-l-2 pl-3.5 ${
                  state === "fixed" ? "border-brand/40" : "border-danger/30"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11.5px] font-bold ${
                      state === "fixed"
                        ? "bg-brand-soft text-brand"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {KIND_LABELS[issue.kind]}
                  </span>
                  <span className="min-w-0 truncate text-[12.5px] font-semibold text-ink-faint">
                    {issue.where}
                  </span>
                </div>

                {/* The wrong text and the right text, side by side — reading
                    the correction is the whole point of the entry. */}
                <p className="mt-1.5 text-[14px] leading-relaxed">
                  <span className="text-ink-soft line-through decoration-danger/50">
                    {issue.quote}
                  </span>
                  <span className="px-1.5 text-ink-faint">→</span>
                  <span className="font-semibold text-ink">{issue.fix}</span>
                </p>

                {issue.note && (
                  <p className="mt-1 text-[13px] text-ink-soft">{issue.note}</p>
                )}

                <div className="mt-2">
                  {state === "fixed" ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand">
                      <CheckIcon className="h-4 w-4" />
                      Fixed
                    </span>
                  ) : state === "stale" ? (
                    <span className="text-[13px] font-medium text-ink-faint">
                      That line has changed — fix it by hand.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fix([i])}
                      className="rounded-lg bg-field px-3 py-1.5 text-[13px] font-bold text-ink transition hover:bg-black/[0.06]"
                    >
                      Fix
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** The order the groups read in, worst first. */
const PRIORITY_ORDER = ["high", "medium", "low"] as const;

function Advice({ report }: { report: ReviewReport }) {
  if (!report.advice.length) return null;

  return (
    <>
      {PRIORITY_ORDER.map((priority) => {
        const items = report.advice.filter((a) => a.priority === priority);
        if (!items.length) return null;
        const { label, blurb, bar } = PRIORITY_LABELS[priority];

        // A card per group rather than one list with a chip on every row: the
        // thing you want to know is what to do first, and that's a heading —
        // so it reads as one, in full ink, rather than as another faint label.
        return (
          <section
            key={priority}
            className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-9 w-1.5 shrink-0 rounded-full ${bar}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[16.5px] leading-tight font-extrabold tracking-tight text-ink">
                  {label}
                </h3>
                <p className="mt-0.5 text-[12.5px] text-ink-soft">{blurb}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-field px-2.5 py-1 text-[13px] font-extrabold text-ink-soft tabular-nums">
                {items.length}
              </span>
            </div>

            <ul className="mt-4 space-y-4">
              {items.map((item, i) => (
                <li key={i}>
                  <p className="text-[15px] font-extrabold text-ink">
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                      {item.detail}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[12px] font-extrabold tracking-wide text-ink-faint uppercase">
      {children}
    </h3>
  );
}
