"use client";

// The Tailor tab: paste one posting, see how the resume answers it, and take
// the rewrites you want.
//
// It reads like the Review tab on purpose — score, verdict, then a list of
// specific changes with a button on each — because it is the same act: the AI
// reads the whole document and reports back. The difference is that a review
// tells you what is wrong, and this one hands you the corrected field.

import { useState } from "react";
import { toast } from "@/components/ui/toast";

import { useAuthDialog } from "@/components/auth/AuthDialog";
import { CheckIcon } from "@/components/ui/icons";
import { Input, Textarea } from "@/components/ui/fields";
import { ArticleIcon, MagicIcon, PencilIcon } from "@/components/ui/svg-icons";
import { MIN_POSTING_CHARS, type TailorEdit } from "@/lib/ai/tailoring";
import { addJob } from "@/lib/job-board";
import { useResume } from "@/lib/store";
import { matchResume, verdict as wordVerdict } from "@/lib/tailor";
import { cn } from "@/lib/utils";

import { useTailor, type EditState } from "./TailorSession";

/** How a fit score reads, and the colour it reads in — the review's bands, so
 *  a number means the same thing in both tabs. */
function band(score: number) {
  if (score >= 80) return { color: "#16a34a", label: "Strong fit" };
  if (score >= 60) return { color: "#d97706", label: "Worth applying" };
  if (score >= 40) return { color: "#ea580c", label: "Some way off" };
  return { color: "#e11d48", label: "Long shot" };
}

const PRIORITY = {
  high: { label: "Change first", bar: "bg-danger" },
  medium: { label: "Worth doing", bar: "bg-brand" },
  low: { label: "Polish", bar: "bg-ink-faint" },
} as const;

export function TailorPanel() {
  const { data, guest } = useResume();
  const auth = useAuthDialog();
  const { posting, setPosting, report, busy, error, run, reset } = useTailor();

  if (guest) {
    return (
      <div className="space-y-3">
        <Heading />
        <div className="rounded-2xl bg-panel p-6 text-center shadow-[var(--shadow-panel)]">
          <MagicIcon className="mx-auto h-6 w-6 text-purple" />
          <h3 className="mt-3 text-[17px] font-extrabold text-ink">
            Sign in to tailor your resume
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            Tailoring rewrites the page against one posting. It comes with an
            account — and the resume you&rsquo;ve started comes with you.
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
        <PostingForm
          posting={posting}
          setPosting={setPosting}
          error={error}
          onRun={() => run(posting)}
          canRun={Boolean(data.sections.length)}
        />
      )}

      {busy && <Working />}

      {report && !busy && <Report onChange={reset} />}
    </div>
  );
}

function Heading() {
  return (
    <div className="px-1 pt-1 pb-2">
      <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink">
        Which job is this for?
      </h2>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step one: the posting                                                      */
/* -------------------------------------------------------------------------- */

function PostingForm({
  posting,
  setPosting,
  error,
  onRun,
  canRun,
}: {
  posting: string;
  setPosting: (value: string) => void;
  error: string | null;
  onRun: () => void;
  canRun: boolean;
}) {
  const { data } = useResume();
  const [source, setSource] = useState<"paste" | "link">("paste");
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const ready = posting.trim().length >= MIN_POSTING_CHARS;
  // The word-level score costs nothing, so it lands the moment there's enough
  // text to score — before anything is spent on the real thing.
  const preview = ready ? matchResume(data, posting) : null;

  const fetchPosting = async () => {
    if (!url.trim()) return;
    setFetching(true);
    try {
      const res = await fetch("/api/job-posting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const payload = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !payload.text) throw new Error(payload.error);
      setPosting(payload.text);
      setSource("paste");
    } catch (err) {
      toast.error("Couldn't read that link", {
        description:
          err instanceof Error && err.message
            ? err.message
            : "Paste the description instead.",
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-panel p-5 shadow-[var(--shadow-panel)]">
        <div className="flex gap-1 rounded-xl bg-field p-1">
          {(["paste", "link"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSource(option)}
              className={cn(
                "h-9 flex-1 rounded-lg text-[14px] font-bold transition",
                source === option
                  ? "bg-panel text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {option === "paste" ? "Paste the posting" : "From a link"}
            </button>
          ))}
        </div>

        {source === "paste" ? (
          <Textarea
            value={posting}
            onChange={(e) => setPosting(e.target.value)}
            placeholder="Paste the whole posting — responsibilities, requirements, the lot."
            // `field-sizing-content` grows the box with what's in it, and a
            // posting is long — so it's capped and scrolls instead.
            className="mt-4 max-h-[260px] min-h-[190px] overflow-y-auto"
          />
        ) : (
          <div className="mt-4 flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="flex-1"
            />
            <button
              type="button"
              onClick={fetchPosting}
              disabled={fetching}
              className="h-12 shrink-0 rounded-xl bg-navy px-5 text-[14.5px] font-bold text-white transition disabled:opacity-60"
            >
              {fetching ? "Reading…" : "Read it"}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-[13.5px] leading-relaxed font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onRun}
          disabled={!ready || !canRun}
          className="btn-gradient mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold disabled:cursor-not-allowed disabled:opacity-45"
        >
          <MagicIcon className="h-5 w-5" />
          Tailor my resume
        </button>

        <p className="mt-2.5 text-center text-[12.5px] text-ink-faint">
          {!canRun
            ? "Write the resume first — there's nothing to tailor yet."
            : ready
              ? "Takes around half a minute. Nothing changes until you apply it."
              : "Paste a few paragraphs of the posting to start."}
        </p>
      </section>

      {preview && <KeywordPreview posting={posting} result={preview} />}
    </div>
  );
}

/** The free, word-level read — shown while the paid one is still a choice. */
function KeywordPreview({
  posting,
  result,
}: {
  posting: string;
  result: ReturnType<typeof matchResume>;
}) {
  const words = wordVerdict(result.score);

  return (
    <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
      <div className="flex items-center gap-2">
        <ArticleIcon className="h-[18px] w-[18px] text-ink-faint" />
        <h3 className="text-[14px] font-extrabold text-ink">
          Keyword check — free, no AI
        </h3>
        <span className="ml-auto text-[15px] font-extrabold text-brand">
          {result.score}%
        </span>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
        <span className="font-bold text-ink">{words.label}.</span> {words.copy}
      </p>

      {result.missing.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {result.missing.slice(0, 10).map((term) => (
            <li
              key={term.term}
              className="rounded-lg bg-field px-2.5 py-1.5 text-[12.5px] font-bold text-ink-soft"
            >
              {term.term}
            </li>
          ))}
        </ul>
      )}

      <TrackButton posting={posting} title={result.title} />
    </section>
  );
}

function TrackButton({
  posting,
  title,
}: {
  posting: string;
  title: string | null;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      disabled={saved}
      onClick={() => {
        addJob({
          company: title ?? "Saved from the tailor",
          role: title ?? "",
          location: "",
          salary: "",
          url: "",
          notes: posting.slice(0, 400),
        });
        setSaved(true);
        toast.success("Added to your job tracker");
      }}
      className="mt-4 rounded-lg bg-field px-3.5 py-2 text-[13.5px] font-bold text-ink transition hover:bg-black/[0.06] disabled:opacity-60"
    >
      {saved ? "On the board ✓" : "Track this job"}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Step two: the report                                                       */
/* -------------------------------------------------------------------------- */

function Working() {
  return (
    <div className="rounded-2xl bg-panel px-6 py-8 text-center shadow-[var(--shadow-panel)]">
      <p className="text-[16px] font-extrabold text-ink">
        Reading the posting against your resume…
      </p>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">
        Judging the fit, then rewriting the fields that should change.
      </p>
      <div
        className="ai-progress-track mt-5 h-1.5 w-full"
        role="progressbar"
        aria-label="Tailoring"
      >
        <span />
      </div>
    </div>
  );
}

function Report({ onChange }: { onChange: () => void }) {
  const { report, applied, applyAll } = useTailor();
  if (!report) return null;

  const { color, label } = band(report.fit);
  const left = report.edits.filter((_, i) => !applied[i]).length;

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
        <div className="flex items-center gap-5">
          <ScoreRing value={report.fit} color={color} />
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyAll}
            disabled={left === 0}
            className="btn-gradient inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14.5px] font-bold disabled:opacity-45"
          >
            <CheckIcon className="h-[18px] w-[18px]" />
            {left === 0 ? "All applied" : `Apply all ${left}`}
          </button>
          <button
            type="button"
            onClick={onChange}
            className="h-11 rounded-xl bg-field px-4 text-[14px] font-bold text-ink transition hover:bg-black/[0.06]"
          >
            Another job
          </button>
        </div>
      </section>

      {report.gaps.length > 0 && <Gaps gaps={report.gaps} />}

      <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
        <h3 className="text-[17px] font-extrabold text-ink">
          {report.edits.length} rewrite{report.edits.length === 1 ? "" : "s"}
        </h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
          Each one replaces a single field. Read it, then take it or leave it.
        </p>

        <ul className="mt-4 space-y-3">
          {report.edits.map((edit, index) => (
            <EditRow
              key={`${edit.key}-${index}`}
              edit={edit}
              index={index}
              state={applied[index]}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function Gaps({ gaps }: { gaps: string[] }) {
  return (
    <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
      <h3 className="text-[15px] font-extrabold text-ink">
        What the posting wants and the resume doesn&rsquo;t show
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
        Not written into anything — tailoring never claims experience you
        haven&rsquo;t got.
      </p>
      <ul className="mt-3 space-y-2">
        {gaps.map((gap) => (
          <li
            key={gap}
            className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft"
          >
            <span
              aria-hidden="true"
              className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
            />
            {gap}
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditRow({
  edit,
  index,
  state,
}: {
  edit: TailorEdit;
  index: number;
  state?: EditState;
}) {
  const { apply } = useTailor();
  const [open, setOpen] = useState(false);
  const priority = PRIORITY[edit.priority];

  return (
    <li className="overflow-hidden rounded-xl bg-field/60 ring-1 ring-black/5">
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span
          className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", priority.bar)}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[14.5px] font-extrabold text-ink">
              {edit.where}
            </span>
            <span className="text-[12px] font-bold text-ink-faint uppercase">
              {priority.label}
            </span>
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
            {edit.why}
          </p>
        </div>

        {state === "applied" ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-soft px-2.5 py-1.5 text-[12.5px] font-bold text-brand">
            <CheckIcon className="h-3.5 w-3.5" />
            Applied
          </span>
        ) : state === "stale" ? (
          <span className="shrink-0 text-[12.5px] font-bold text-ink-faint">
            Moved on
          </span>
        ) : (
          <button
            type="button"
            onClick={() => apply(index)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-navy px-3.5 text-[13.5px] font-bold text-white transition hover:opacity-90"
          >
            <PencilIcon className="h-4 w-4" />
            Apply
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full border-t border-black/5 px-4 py-2 text-left text-[12.5px] font-bold text-ink-faint transition hover:text-ink"
      >
        {open ? "Hide the wording" : "See before and after"}
      </button>

      {open && (
        <div className="space-y-2 border-t border-black/5 px-4 py-3">
          <Wording label="Now" text={edit.before} tone="before" />
          <Wording label="Tailored" text={edit.after} tone="after" />
        </div>
      )}
    </li>
  );
}

function Wording({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "before" | "after";
}) {
  return (
    <div>
      <p className="text-[11.5px] font-extrabold tracking-wide text-ink-faint uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 rounded-lg px-3 py-2 text-[13.5px] leading-relaxed whitespace-pre-wrap",
          tone === "after"
            ? "bg-brand-soft text-ink"
            : "bg-panel text-ink-soft line-through decoration-ink-faint/40",
        )}
      >
        {text}
      </p>
    </div>
  );
}

/** The same ring the review draws, for the same reason: a bare number out of
 *  100 reads like a mark on a test. */
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
      <span className="absolute inset-0 grid place-items-center text-[24px] font-extrabold text-ink">
        {value}
      </span>
    </div>
  );
}
