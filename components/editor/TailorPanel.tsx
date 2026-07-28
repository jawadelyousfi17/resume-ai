"use client";

// The Tailor tab: paste one posting, see how the resume answers it, then tailor
// it — either from what's already on the page, or from what the person tells us
// when we ask.
//
// The report opens on the score and the job it is a score for, then folds into
// Keywords (the posting's own vocabulary, checked word by word) and Requirements
// fit (everything the posting asks for, each marked met, partly met or not
// shown, with the evidence behind it — the met ones included, because a list of
// nothing but failures tells someone less about where they stand than the same
// facts with their own credentials beside them).
//
// Under that is one button. Pressing it takes over the tab: two ways to go about
// the rewrite, then the rewrite, then the score again. Nothing here touches the
// document until it's pressed.

import { useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";

import { useAuthDialog } from "@/components/auth/AuthDialog";
import {
  BulbIcon,
  CheckIcon,
  TargetIcon,
  UserIcon,
} from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/fields";
import {
  ArticleIcon,
  ChevronDownIcon,
  MagicIcon,
} from "@/components/ui/svg-icons";
import { MIN_POSTING_CHARS, type TailorRequirement } from "@/lib/ai/tailoring";
import type { TailorAnswer } from "@/lib/ai/tailor-apply";
import { MatchGauge } from "./MatchGauge";
import { addJob } from "@/lib/job-board";
import { useResume } from "@/lib/store";
import { matchResume, verdict as wordVerdict } from "@/lib/tailor";
import { cn } from "@/lib/utils";

import { useTailor } from "./TailorSession";

/** How a fit score reads, and the colour it reads in — the review's bands, so
 *  a number means the same thing in both tabs. */
function band(score: number) {
  if (score >= 80) return { color: "#16a34a", label: "Strong fit" };
  if (score >= 60) return { color: "#d97706", label: "Worth applying" };
  if (score >= 40) return { color: "#ea580c", label: "Some way off" };
  return { color: "#e11d48", label: "Long shot" };
}

/** How a requirement reads at a glance. The glyph carries it in the row; the
 *  label is what a screen reader says and what the opened detail is prefixed
 *  with, so the meaning never rests on colour alone. */
const STATUS = {
  met: {
    glyph: "✓",
    label: "Met",
    chip: "bg-positive/15 text-positive",
    text: "text-positive",
  },
  partial: {
    glyph: "?",
    label: "Partly met",
    chip: "bg-caution/15 text-caution",
    text: "text-caution",
  },
  missing: {
    glyph: "✕",
    label: "Not shown",
    chip: "bg-danger/15 text-danger",
    text: "text-danger",
  },
} as const;

export function TailorPanel() {
  const { data, guest } = useResume();
  const auth = useAuthDialog();
  const { posting, setPosting, stage, busy, error, run, reset } = useTailor();

  if (guest) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-panel p-6 text-center shadow-[var(--shadow-panel)]">
          <MagicIcon className="mx-auto h-6 w-6 text-purple" />
          <h3 className="mt-3 text-[17px] font-extrabold text-ink">
            Sign in to tailor your resume
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed font-medium text-ink-soft">
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

  if (busy) return <Working />;

  return (
    <div className="space-y-3">
      {/* The form shows its errors inline, beside the field that caused them.
          Anything that fails later has no field to sit beside. */}
      {error && stage !== "form" && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-[13.5px] leading-relaxed font-medium text-danger">
          {error}
        </p>
      )}

      {stage === "form" && (
        <PostingForm
          posting={posting}
          setPosting={setPosting}
          error={error}
          onRun={() => run(posting)}
          canRun={Boolean(data.sections.length)}
        />
      )}

      {stage === "report" && <Report onChange={reset} />}
      {stage === "choose" && <Choose />}
      {stage === "interview" && <Interview />}
      {stage === "done" && <Done onChange={reset} />}
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
          Check my resume
        </button>

        <p className="mt-2.5 text-center text-[12.5px] font-medium text-ink-faint">
          {!canRun
            ? "Write the resume first — there's nothing to tailor yet."
            : ready
              ? "Takes around half a minute. Nothing on your resume changes on its own."
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

      <p className="mt-2 text-[13.5px] leading-relaxed font-medium text-ink-soft">
        <span className="font-bold text-ink">{words.label}.</span> {words.copy}
      </p>

      {result.missing.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {result.missing.slice(0, 10).map((term) => (
            <li
              key={term.term}
              className="rounded-lg bg-field px-2.5 py-1.5 text-[12.5px] font-bold text-ink-soft"
            >
              {term.label}
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

function Working() {
  const { busyLabel } = useTailor();

  return (
    <div className="rounded-2xl bg-panel px-6 py-8 text-center shadow-[var(--shadow-panel)]">
      <p className="text-[16px] font-extrabold text-ink">
        {busyLabel || "Working…"}
      </p>
      <p className="mt-1.5 text-[13.5px] font-medium text-ink-soft">
        This takes a little while. Leaving the tab won&rsquo;t stop it.
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

/* -------------------------------------------------------------------------- */
/* Step two: the report                                                       */
/* -------------------------------------------------------------------------- */

/** The score, the job it's for, and the verdict. Shared by the report and the
 *  screen at the end, which is the same card with a different number. */
function ScoreCard({
  score,
  children,
}: {
  score: number;
  children?: React.ReactNode;
}) {
  const { report } = useTailor();
  const { color, label } = band(score);
  const job = report?.job;

  return (
    <section className="rounded-2xl bg-panel px-5 pt-5 pb-6 shadow-[var(--shadow-panel)]">
      {job && (job.role || job.company) && (
        <p className="text-center text-[15px] leading-snug font-medium text-ink-soft">
          {job.role && (
            <span className="font-extrabold text-ink">{job.role}</span>
          )}
          {job.role && job.company && " at "}
          {job.company && (
            <span className="font-extrabold text-ink">{job.company}</span>
          )}
        </p>
      )}
      {job?.location && (
        <p className="mt-0.5 text-center text-[13px] font-medium text-ink-faint">
          {job.location}
        </p>
      )}

      <div className="mx-auto mt-2 max-w-[300px]">
        <MatchGauge value={score} color={color} />
      </div>

      <p
        className="text-center text-[13px] font-extrabold tracking-wide uppercase"
        style={{ color }}
      >
        {label}
      </p>

      {children}
    </section>
  );
}

function Report({ onChange }: { onChange: () => void }) {
  const { data } = useResume();
  const { report, posting, setStage } = useTailor();
  if (!report) return null;

  // Recomputed against the document as it stands rather than as it was read,
  // so the chips empty out while the person works. It costs nothing to redo.
  const keywords = matchResume(data, posting);

  return (
    <div className="space-y-3">
      <ScoreCard score={report.fit}>
        <button
          type="button"
          onClick={onChange}
          className="mx-auto mt-5 block h-10 rounded-xl bg-field px-4 text-[13.5px] font-bold text-ink transition hover:bg-black/[0.06]"
        >
          Another job
        </button>
      </ScoreCard>

      {report.summary && (
        <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
          <h3 className="text-[15px] font-extrabold text-ink">Match summary</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed font-medium text-ink-soft">
            {report.summary}
          </p>
        </section>
      )}

      <Keywords result={keywords} />

      <RequirementsFit requirements={report.requirements} />

      {/* Stays on screen while the report is read: the report is long, and the
          one thing to do about it shouldn't be at the end of a scroll. */}
      <button
        type="button"
        onClick={() => setStage("choose")}
        className="btn-gradient sticky bottom-3 z-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold shadow-lg"
      >
        <MagicIcon className="h-5 w-5" />
        Start tailoring
      </button>
    </div>
  );
}

/** A titled section that folds away, so a long report is a page of headings
 *  until you ask for more. */
function Section({
  title,
  count,
  blurb,
  defaultOpen = false,
  children,
}: {
  title: string;
  /** Shown beside the title — how many things are in here. */
  count?: string;
  blurb?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl bg-panel px-5 py-4 shadow-[var(--shadow-panel)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 py-1 text-left"
      >
        <h3 className="text-[17px] font-extrabold text-ink">{title}</h3>
        {count && (
          <span className="rounded-md bg-field px-1.5 py-0.5 text-[12px] font-bold text-ink-soft">
            {count}
          </span>
        )}
        <ChevronDownIcon
          className={cn(
            "ml-auto h-[18px] w-[18px] shrink-0 text-ink-faint transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="pt-1 pb-1">
          {blurb && (
            <p className="text-[13.5px] leading-relaxed font-medium text-ink-soft">
              {blurb}
            </p>
          )}
          {children}
        </div>
      )}
    </section>
  );
}

/** The posting's own vocabulary, matched word by word against the page. Free
 *  and instant, so it answers back the moment a rewrite lands. */
function Keywords({ result }: { result: ReturnType<typeof matchResume> }) {
  const { missing, matched } = result;

  return (
    <Section
      title="Keywords"
      count={`${matched.length}/${matched.length + missing.length}`}
      blurb="The words this posting leans on, checked against your page. Work in the ones you can honestly claim — a keyword you can't talk about in the interview costs you more than a missing one."
    >
      {missing.length > 0 && (
        <>
          <p className="mt-4 text-[12px] font-extrabold tracking-wide text-ink-faint uppercase">
            Missing
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {missing.map((term) => (
              <li
                key={term.term}
                className="rounded-lg bg-danger/10 px-2.5 py-1.5 text-[12.5px] font-bold text-ink"
              >
                {term.label}
              </li>
            ))}
          </ul>
        </>
      )}

      {matched.length > 0 && (
        <>
          <p className="mt-4 text-[12px] font-extrabold tracking-wide text-ink-faint uppercase">
            Already covered
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {matched.map((term) => (
              <li
                key={term.term}
                className="rounded-lg bg-field px-2.5 py-1.5 text-[12.5px] font-bold text-ink-soft"
              >
                {term.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

function RequirementsFit({
  requirements,
}: {
  requirements: TailorRequirement[];
}) {
  if (!requirements.length) return null;

  const key = requirements.filter((r) => r.kind === "key");
  const nice = requirements.filter((r) => r.kind === "nice");
  const met = requirements.filter((r) => r.status === "met").length;

  return (
    <Section
      title="Requirements fit"
      count={`${met}/${requirements.length}`}
      blurb="See which requirements from the posting you already meet, and where to add more evidence. It's fine not to meet all of them — cover as many as you honestly can."
      defaultOpen
    >
      {key.length > 0 && (
        <Group
          title="Key requirements"
          blurb="The qualifications this posting states outright. These are what a recruiter checks first."
          requirements={key}
        />
      )}
      {nice.length > 0 && (
        <Group
          title="Nice-to-haves"
          blurb="Not mandatory, but each one you can evidence makes the application stronger."
          requirements={nice}
        />
      )}
    </Section>
  );
}

function Group({
  title,
  blurb,
  requirements,
}: {
  title: string;
  blurb: string;
  requirements: TailorRequirement[];
}) {
  return (
    <div className="mt-5 border-t border-black/5 pt-4">
      <h4 className="text-[14.5px] font-extrabold text-ink">{title}</h4>
      <p className="mt-1 text-[13px] leading-relaxed font-medium text-ink-soft">
        {blurb}
      </p>

      <ul className="mt-3 space-y-1.5">
        {requirements.map((requirement) => (
          <RequirementRow
            key={requirement.requirement}
            requirement={requirement}
          />
        ))}
      </ul>
    </div>
  );
}

function RequirementRow({ requirement }: { requirement: TailorRequirement }) {
  const [open, setOpen] = useState(false);
  const status = STATUS[requirement.status];

  return (
    <li className="overflow-hidden rounded-xl bg-field/60 ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition hover:bg-black/[0.02]"
      >
        <span
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[13px] font-extrabold",
            status.chip,
          )}
          aria-hidden="true"
        >
          {status.glyph}
        </span>
        <span className="min-w-0 flex-1 text-[13.5px] leading-snug font-medium text-ink">
          {requirement.requirement}
        </span>
        <span className="sr-only">{status.label}</span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-ink-faint transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && requirement.detail && (
        <p className="border-t border-black/5 px-3.5 py-3 text-[13px] leading-relaxed font-medium text-ink-soft">
          <span className={cn("font-extrabold", status.text)}>
            {status.label}.{" "}
          </span>
          {requirement.detail}
        </p>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Step three: how to go about it                                             */
/* -------------------------------------------------------------------------- */

function Choose() {
  const { report, setStage, tailor } = useTailor();
  const open =
    report?.requirements.filter((r) => r.status !== "met").length ?? 0;

  return (
    <div className="space-y-3">
      <div className="px-1 pt-1 pb-1">
        <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-ink">
          How should we tailor it?
        </h2>
        <p className="mt-1 text-[13.5px] leading-relaxed font-medium text-ink-soft">
          Both rewrite your resume for this job. The difference is where the
          material comes from.
        </p>
      </div>

      <Option
        icon={<UserIcon className="h-5 w-5 text-purple" />}
        title="Tick what you've done"
        recommended
        blurb={
          open > 0
            ? `The ${open} thing${open === 1 ? "" : "s"} this posting wants that your resume doesn't show yet, as a checklist. Tick the ones you have and they go on — most people's resumes are missing the evidence, not the experience. Say where you used them and they go into the roles too.`
            : "Everything this posting wants that your resume doesn't spell out, as a checklist. Tick what you have and it goes on."
        }
        cta="Go through the checklist"
        onClick={() => setStage("interview")}
      />

      <Option
        icon={<TargetIcon className="h-5 w-5 text-brand" />}
        title="Rewrite it for me"
        blurb="No questions. We go through every requirement in the posting and make sure the ones your experience already backs are answered clearly and early — in this employer's own words, leading each section, with the rest cut back to make room. Anything you genuinely haven't done is left off and listed at the end."
        cta="Rewrite it now"
        onClick={() => tailor()}
      />

      <button
        type="button"
        onClick={() => setStage("report")}
        className="mx-auto block h-10 rounded-xl px-4 text-[13.5px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
      >
        Back to the report
      </button>
    </div>
  );
}

function Option({
  icon,
  title,
  blurb,
  cta,
  onClick,
  recommended = false,
}: {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  cta: string;
  onClick: () => void;
  recommended?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]",
        recommended && "ring-2 ring-purple/35",
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <h3 className="text-[17px] font-extrabold text-ink">{title}</h3>
        {recommended && (
          <span className="ml-auto rounded-md bg-purple-soft px-2 py-1 text-[11.5px] font-extrabold tracking-wide text-purple uppercase">
            Best results
          </span>
        )}
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed font-medium text-ink-soft">
        {blurb}
      </p>

      <button
        type="button"
        onClick={onClick}
        className={cn(
          "mt-4 flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-bold transition",
          recommended
            ? "btn-gradient"
            : "bg-field text-ink hover:bg-black/[0.06]",
        )}
      >
        {cta}
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Step four: the questions                                                   */
/* -------------------------------------------------------------------------- */

/** Skills are asked about separately from the requirements: a posting's loose
 *  vocabulary isn't a qualification, but it's where most of the honest
 *  additions come from — tools somebody has used and never thought to list. */
const SKILLS_QUESTION =
  "Tools and technologies from the posting that aren't on the resume";

function Interview() {
  const { data } = useResume();
  const { report, posting, setStage, tailor } = useTailor();

  const [have, setHave] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const open = useMemo(
    () => report?.requirements.filter((r) => r.status !== "met") ?? [],
    [report],
  );
  const missingWords = useMemo(
    () => matchResume(data, posting).missing.slice(0, 12),
    [data, posting],
  );

  const skillsTicked = Boolean(have[SKILLS_QUESTION]);
  const confirmed =
    open.filter((r) => have[r.requirement]).length + (skillsTicked ? 1 : 0);
  const total = open.length + (missingWords.length ? 1 : 0);

  const submit = () => {
    const list: TailorAnswer[] = open
      .filter((r) => have[r.requirement])
      .map((r) => ({
        requirement: r.requirement,
        confirmed: true,
        answer: answers[r.requirement] ?? "",
      }));

    if (skillsTicked) {
      list.push({
        requirement: SKILLS_QUESTION,
        confirmed: true,
        answer: answers[SKILLS_QUESTION] ?? "",
      });
    }
    tailor(list);
  };

  return (
    <div className="space-y-3">
      <div className="px-1 pt-1 pb-1">
        <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-ink">
          Which of these have you done?
        </h2>
        <p className="mt-1 text-[13.5px] leading-relaxed font-medium text-ink-soft">
          Tick everything this posting asks for that you actually have. A tick
          alone puts it in your skills, which is what a screening system reads.
          Add a line about where you used it and it goes into that job as well,
          which is what a person reads. Anything you leave unticked stays off
          the page.
        </p>
      </div>

      {open.map((requirement) => (
        <Question
          key={requirement.requirement}
          title={requirement.requirement}
          note={requirement.detail}
          badge={STATUS[requirement.status].label}
          have={Boolean(have[requirement.requirement])}
          onHave={(value) =>
            setHave((prev) => ({ ...prev, [requirement.requirement]: value }))
          }
          value={answers[requirement.requirement] ?? ""}
          onChange={(value) =>
            setAnswers((prev) => ({ ...prev, [requirement.requirement]: value }))
          }
          placeholder="Where did you use it? e.g. Two years at Acme — rebuilt their reporting on it and cut the monthly close from five days to two."
        />
      ))}

      {missingWords.length > 0 && (
        <Question
          title="Have you worked with these?"
          note="The posting keeps using these words and none of them are on your resume. Ticking puts the ones you name into your skills; saying where you used them gets them into the roles as well."
          have={skillsTicked}
          onHave={(value) =>
            setHave((prev) => ({ ...prev, [SKILLS_QUESTION]: value }))
          }
          value={answers[SKILLS_QUESTION] ?? ""}
          onChange={(value) =>
            setAnswers((prev) => ({ ...prev, [SKILLS_QUESTION]: value }))
          }
          placeholder="Which ones, and where? e.g. Docker and Postgres daily at Acme; Kubernetes on one migration project."
          chips={missingWords.map((t) => t.label)}
        />
      )}

      {/* Sticky for the same reason as the report's: there can be a dozen
          questions above this, and the count is what tells you how far in you
          are — which is worth nothing at the bottom of a long scroll. */}
      <section className="sticky bottom-3 z-10 rounded-2xl bg-panel px-5 py-5 shadow-lg ring-1 ring-black/5">
        <p className="text-center text-[13px] font-medium text-ink-faint">
          {confirmed} of {total} ticked
          {confirmed === 0 && " — tick at least one to add anything new"}
        </p>
        <button
          type="button"
          onClick={submit}
          disabled={confirmed === 0}
          className="btn-gradient mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold disabled:cursor-not-allowed disabled:opacity-45"
        >
          <MagicIcon className="h-5 w-5" />
          Tailor my resume
        </button>
        <button
          type="button"
          onClick={() => setStage("choose")}
          className="mx-auto mt-2 block h-10 rounded-xl px-4 text-[13.5px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
        >
          Back
        </button>
      </section>
    </div>
  );
}

function Question({
  title,
  note,
  badge,
  have,
  onHave,
  value,
  onChange,
  placeholder,
  chips,
}: {
  title: string;
  note?: string;
  badge?: string;
  /** They've said they have this. */
  have: boolean;
  onHave: (value: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  chips?: string[];
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)] transition",
        have && "ring-2 ring-positive/40",
      )}
    >
      <div className="flex items-start gap-2">
        <h3 className="min-w-0 flex-1 text-[15px] leading-snug font-extrabold text-ink">
          {title}
        </h3>
        {/* The reason this is being asked lives behind the bulb rather than
            under the question. Eight of these on screen, each with its own
            paragraph of why, buries the thing the person is actually here to
            do — which is type an answer. */}
        {note && (
          <span
            title={note}
            aria-label={note}
            tabIndex={0}
            className="shrink-0 cursor-help rounded-md p-1 text-ink-faint transition hover:bg-black/5 hover:text-ink"
          >
            <BulbIcon className="h-4 w-4" />
          </span>
        )}
        {badge && (
          <span className="shrink-0 rounded-md bg-field px-2 py-1 text-[11.5px] font-extrabold tracking-wide text-ink-faint uppercase">
            {badge}
          </span>
        )}
      </div>

      {chips && chips.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-lg bg-field px-2.5 py-1.5 text-[12.5px] font-bold text-ink-soft"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      <label className="mt-3 flex cursor-pointer items-center gap-2.5 rounded-xl bg-field px-3.5 py-3">
        <Checkbox
          checked={have}
          onCheckedChange={(next) => onHave(next === true)}
        />
        <span className="text-[13.5px] font-bold text-ink">
          I&rsquo;ve done this
        </span>
      </label>

      {/* The detail box only exists once they've said they have it. Asking
          "where did you use it?" under something they haven't done is a
          question with one honest answer, and it shouldn't be on screen. */}
      {have && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-2 max-h-[220px] min-h-[80px] overflow-y-auto"
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Step five: what came of it                                                 */
/* -------------------------------------------------------------------------- */

function Done({ onChange }: { onChange: () => void }) {
  const { outcome, report, setStage } = useTailor();
  if (!outcome || !report) return null;

  const gained = outcome.after - outcome.before;

  return (
    <div className="space-y-3">
      <ScoreCard score={outcome.after}>
        <p className="mt-3 text-center text-[14px] font-medium text-ink-soft">
          {gained > 0 ? (
            <>
              Up{" "}
              <span className="font-extrabold text-positive">
                {gained} point{gained === 1 ? "" : "s"}
              </span>{" "}
              from {outcome.before}%
            </>
          ) : gained < 0 ? (
            <>Down from {outcome.before}% — worth reading what changed</>
          ) : (
            <>Unchanged at {outcome.before}%</>
          )}
        </p>
      </ScoreCard>

      <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
        <div className="flex items-center gap-2">
          <CheckIcon className="h-[18px] w-[18px] text-positive" />
          <h3 className="text-[17px] font-extrabold text-ink">
            Your resume has been updated
          </h3>
        </div>
        <p className="mt-1.5 text-[13.5px] leading-relaxed font-medium text-ink-soft">
          {outcome.changed} section{outcome.changed === 1 ? "" : "s"} rewritten
          {outcome.addedSkills.length > 0 &&
            `, ${outcome.addedSkills.length} skill${
              outcome.addedSkills.length === 1 ? "" : "s"
            } added`}
          . It&rsquo;s all in the preview and in the Content tab — read it
          before you send it, and change anything that doesn&rsquo;t sound like
          you.
        </p>

        {outcome.addedSkills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {outcome.addedSkills.map((skill) => (
              <li
                key={skill}
                className="rounded-lg bg-positive/10 px-2.5 py-1.5 text-[12.5px] font-bold text-ink"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </section>

      {outcome.stillMissing.length > 0 && (
        <section className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
          <h3 className="text-[15px] font-extrabold text-ink">
            Still not on the page
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed font-medium text-ink-soft">
            You didn&rsquo;t have these, so they were left off. Plenty of people
            are hired without everything on the list — a gap costs you an
            interview, and something you can&rsquo;t back up costs you the job.
          </p>
          <ul className="mt-3 space-y-1.5">
            {outcome.stillMissing.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-field/60 px-3.5 py-2.5 text-[13.5px] leading-snug font-medium text-ink-soft ring-1 ring-black/5"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStage("report")}
          className="h-12 flex-1 rounded-xl bg-field px-4 text-[14px] font-bold text-ink transition hover:bg-black/[0.06]"
        >
          See the new report
        </button>
        <button
          type="button"
          onClick={onChange}
          className="h-12 flex-1 rounded-xl bg-field px-4 text-[14px] font-bold text-ink transition hover:bg-black/[0.06]"
        >
          Another job
        </button>
      </div>
    </div>
  );
}
