"use client";

// The AI Tools tab: the four whole-document tasks, and a review step before
// anything is written into the resume.

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useResume } from "@/lib/store";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { useGeneration } from "@/lib/ai/use-generation";
import { AI_TASKS, PANEL_TASKS, type AITaskId } from "@/lib/ai/tasks";
import { applyHighlights, applySkills, applySummary } from "@/lib/ai/apply";
import { parseLines } from "@/lib/ai/parse";
import { isTimelineSection } from "@/lib/defaults";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";
import {
  AlignIcon,
  BulbIcon,
  CheckIcon,
  ChevronDownIcon,
  SparklesIcon,
  TagIcon,
  TranslateIcon,
  WandIcon,
} from "@/components/ui/icons";
import { language, LANGUAGES, type LanguageCode } from "@/lib/i18n";

/** One glyph per tool row. Lives here rather than in `lib/ai/tasks.ts`, which
 *  the API route imports and which therefore stays free of components. */
const TASK_ICONS: Record<
  AITaskId,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  summary: AlignIcon,
  highlights: WandIcon,
  skills: TagIcon,
  review: BulbIcon,
  translate: TranslateIcon,
  polish: SparklesIcon,
};

interface EntryOption {
  sectionId: string;
  itemId: string;
  label: string;
  ready: boolean;
}

export function AIPanel() {
  const { data, guest, update } = useResume();
  const auth = useAuthDialog();
  const gen = useGeneration();

  const [task, setTask] = useState<AITaskId | null>(null);
  const [entryId, setEntryId] = useState("");
  const [applied, setApplied] = useState(false);

  // Translate answers with a whole document rather than a stream, so it has
  // its own small piece of state instead of riding on `gen`.
  const current = language(data.settings.language);
  const [target, setTarget] = useState<LanguageCode>(
    () => LANGUAGES.find((l) => l.code !== current.code)!.code,
  );
  const [translating, setTranslating] = useState(false);

  /** Every timeline entry, flagged with whether it has anything to rewrite. */
  const entries = useMemo<EntryOption[]>(
    () =>
      data.sections.flatMap((section) =>
        isTimelineSection(section)
          ? section.items
              .filter((i) => !i.hidden)
              .map((item) => ({
                sectionId: section.id,
                itemId: item.id,
                label:
                  [item.role, item.company].filter(Boolean).join(" · ") ||
                  "Untitled entry",
                ready: !isMarkdownEmpty(item.highlights),
              }))
          : [],
      ),
    [data.sections],
  );

  const selected =
    entries.find((e) => e.itemId === entryId) ??
    entries.find((e) => e.ready) ??
    null;

  /** Runs the translation and applies it in one step: there is nothing
   *  readable to review between the two, and the preview shows the result. */
  const translate = async () => {
    setTranslating(true);
    const toastId = toast.loading(
      `Translating into ${language(target).english}…`,
    );

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, target }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: typeof data;
      };
      if (!res.ok || !payload.data) {
        throw new Error(payload.error || `Server error ${res.status}`);
      }

      const translated = payload.data;
      update((draft) => {
        draft.personal = translated.personal;
        draft.sections = translated.sections;
        draft.settings = translated.settings;
      });

      toast.success(`Translated into ${language(target).english}`, {
        id: toastId,
        description: "Check the preview — undo with your browser if it's off.",
      });
    } catch (err) {
      toast.error("Couldn't translate this resume", {
        id: toastId,
        description: err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setTranslating(false);
    }
  };

  const blocked = (which: AITaskId): string | null => {
    if (which === "highlights") {
      if (!entries.length) return "Add a role under Content first.";
      if (!selected?.ready) return "Write a highlight on an entry first.";
    }
    if (which === "summary" && !data.sections.length) {
      return "Add some experience first — the summary is drawn from it.";
    }
    if (which === "translate" && !data.sections.length) {
      return "There's nothing written here to translate yet.";
    }
    return null;
  };

  const start = (which: AITaskId) => {
    if (which === "translate") {
      void translate();
      return;
    }
    setTask(which);
    setApplied(false);
    gen.run({
      task: which,
      data,
      target:
        which === "highlights" && selected
          ? { sectionId: selected.sectionId, itemId: selected.itemId }
          : undefined,
    });
  };

  const apply = () => {
    const text = gen.text.trim();
    if (!task || !text) return;

    update((draft) => {
      if (task === "summary") applySummary(draft, text);
      else if (task === "skills") applySkills(draft, text);
      else if (task === "highlights" && selected) {
        applyHighlights(
          draft,
          { sectionId: selected.sectionId, itemId: selected.itemId },
          text,
        );
      }
    });
    setApplied(true);
  };

  const back = () => {
    gen.reset();
    setTask(null);
    setApplied(false);
  };

  // Every tool here spends money per call, so it needs an account. Guests get
  // the whole editor; this one tab asks them to sign in first.
  if (guest) {
    return (
      <div className="space-y-3">
        <div className="px-1 pt-1 pb-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink">
            What would you like to do?
          </h2>
        </div>

        <div className="rounded-2xl bg-panel p-6 text-center shadow-[var(--shadow-panel)]">
          <SparklesIcon className="mx-auto h-6 w-6 text-purple" />
          <h3 className="mt-3 text-[17px] font-extrabold text-ink">
            Sign in to write with Claude
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            The writing tools come with an account. The resume you&rsquo;ve
            started comes with you when you sign in.
          </p>
          <button
            type="button"
            onClick={() => auth.open("signup")}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-purple px-4 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90"
          >
            Log in or sign up
          </button>
        </div>

        <div className="space-y-3 opacity-50">
          {PANEL_TASKS.map((which) => {
            const meta = AI_TASKS[which];
            const Icon = TASK_ICONS[which];
            return (
              <div
                key={which}
                className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-6 w-6 shrink-0 text-ink" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-extrabold text-ink">
                      {meta.label}
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                      {meta.blurb}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (task && (gen.busy || gen.text || gen.error)) {
    return (
      <ResultView
        task={task}
        gen={gen}
        applied={applied}
        target={task === "highlights" ? selected?.label : undefined}
        onApply={apply}
        onRegenerate={() => start(task)}
        onBack={back}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="px-1 pt-1 pb-2">
        <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink">
          What would you like to do?
        </h2>
      </div>

      <div className="space-y-3">
        {PANEL_TASKS.map((which) => {
          const meta = AI_TASKS[which];
          const Icon = TASK_ICONS[which];
          const reason = blocked(which);
          return (
            <div
              key={which}
              className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-6 w-6 shrink-0 text-ink" />

                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-extrabold text-ink">
                    {meta.label}
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                    {meta.blurb}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => start(which)}
                  disabled={Boolean(reason) || (which === "translate" && translating)}
                  title={reason ?? undefined}
                  className="shrink-0 rounded-xl border border-ink/15 px-5 py-3 text-[14.5px] font-bold text-ink transition hover:border-ink/40 hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink-faint disabled:hover:bg-transparent"
                >
                  {which === "translate" && translating
                    ? "Translating…"
                    : `${meta.action} now`}
                </button>
              </div>

              {which === "translate" && (
                <div className="relative mt-4">
                  <select
                    aria-label="Translate into"
                    value={target}
                    onChange={(e) => setTarget(e.target.value as LanguageCode)}
                    className="w-full appearance-none rounded-xl bg-field px-4 py-2.5 pr-10 text-[14px] font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/80"
                  >
                    {/* English names only. A native name in a right-to-left
                        script gets reordered by the browser's bidi pass
                        inside an <option>, which reads as a broken or
                        missing entry. */}
                    {LANGUAGES.filter((l) => l.code !== current.code).map(
                      (l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.english}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                </div>
              )}

              {which === "highlights" && entries.length > 0 && (
                <div className="relative mt-4">
                  <select
                    value={selected?.itemId ?? ""}
                    onChange={(e) => setEntryId(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-field px-4 py-2.5 pr-10 text-[14px] font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/80"
                  >
                    {entries.map((entry) => (
                      <option key={entry.itemId} value={entry.itemId}>
                        {entry.label}
                        {entry.ready ? "" : " — no highlights yet"}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                </div>
              )}

              {reason && (
                <p className="mt-3 text-[12.5px] font-medium text-ink-faint">
                  {reason}
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function ResultView({
  task,
  gen,
  applied,
  target,
  onApply,
  onRegenerate,
  onBack,
}: {
  task: AITaskId;
  gen: ReturnType<typeof useGeneration>;
  applied: boolean;
  target?: string;
  onApply: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}) {
  const meta = AI_TASKS[task];
  const text = gen.text.trim();
  const canApply = meta.output !== "prose" && Boolean(text) && !gen.busy;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[14px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
        >
          <ChevronDownIcon className="h-4 w-4 rotate-90" />
          AI Tools
        </button>
        <span className="truncate text-[14px] font-bold text-ink">
          {meta.label}
          {target && (
            <span className="font-medium text-ink-faint"> · {target}</span>
          )}
        </span>
      </div>

      <div className="rounded-2xl bg-panel p-5 shadow-[var(--shadow-panel)]">
        {gen.error ? (
          <p className="text-[14px] leading-relaxed text-danger">{gen.error}</p>
        ) : (
          <Suggestion task={task} text={gen.text} streaming={gen.busy} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {gen.busy && (
          <button
            type="button"
            onClick={gen.cancel}
            className="rounded-lg bg-field px-3.5 py-2 text-[14px] font-bold text-ink transition hover:bg-black/[0.06]"
          >
            Stop
          </button>
        )}

        {canApply &&
          (applied ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-soft px-3.5 py-2 text-[14px] font-bold text-brand">
              <CheckIcon className="h-4 w-4" />
              Applied
            </span>
          ) : (
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple px-3.5 py-2 text-[14px] font-bold text-white transition hover:opacity-90"
            >
              <CheckIcon className="h-4 w-4" />
              Apply to resume
            </button>
          ))}

        {!gen.busy && (
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded-lg px-3.5 py-2 text-[14px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
          >
            {gen.error ? "Try again" : "Regenerate"}
          </button>
        )}

        {!gen.busy && text && (
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(text)}
            className="rounded-lg px-3.5 py-2 text-[14px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}

/** Renders the answer the way its task shapes it. */
function Suggestion({
  task,
  text,
  streaming,
}: {
  task: AITaskId;
  text: string;
  streaming: boolean;
}) {
  const meta = AI_TASKS[task];

  if (!text) {
    return (
      <p className="text-[14px] font-medium text-ink-faint">
        Reading your resume…
      </p>
    );
  }

  if (meta.output === "prose") {
    return (
      <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-ink">
        {text}
        {streaming && <Caret />}
      </p>
    );
  }

  if (task === "skills") {
    // Mid-stream the last line is usually half-written; showing the parse is
    // still clearer than raw text, and it settles as the rest arrives.
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {parseLines(text).map((skill, i) => (
          <span
            key={i}
            className="rounded-lg bg-purple-soft px-2.5 py-1 text-[13px] font-medium text-purple"
          >
            {skill}
          </span>
        ))}
        {streaming && <Caret />}
      </div>
    );
  }

  return (
    <div className="text-[14px] leading-relaxed text-ink">
      <MarkdownView md={text} />
      {streaming && <Caret />}
    </div>
  );
}

const Caret = () => (
  <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-purple" />
);
