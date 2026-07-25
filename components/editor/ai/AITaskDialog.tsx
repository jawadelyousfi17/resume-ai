"use client";

// One AI task, start to finish, in a dialog: pick what it needs to know, watch
// it work, then decide whether to keep the answer. The panel behind it stays a
// wall of cards.

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResume } from "@/lib/store";
import { useGeneration } from "@/lib/ai/use-generation";
import { AI_TASKS, type AITaskId } from "@/lib/ai/tasks";
import { applyHighlights, applySkills, applySummary } from "@/lib/ai/apply";
import { parseLines } from "@/lib/ai/parse";
import { timelineEntries, type EntryOption } from "@/lib/ai/entries";
import { MarkdownView } from "@/components/ui/markdown-view";
import { CheckIcon } from "@/components/ui/icons";
import { language, LANGUAGES, type LanguageCode } from "@/lib/i18n";

/** Tasks that ask something before they can start. The rest begin the moment
 *  the dialog opens — there's nothing to configure. */
type Choice = "language" | "entry" | null;

function choiceFor(task: AITaskId): Choice {
  if (task === "translate") return "language";
  if (task === "highlights") return "entry";
  return null;
}

export function AITaskDialog({
  task,
  onClose,
}: {
  /** The open task, or null when the dialog is closed. */
  task: AITaskId | null;
  onClose: () => void;
}) {
  if (!task) return null;
  // Keyed on the task, so opening a different one mounts a fresh dialog rather
  // than carrying the last answer across.
  return <TaskDialog key={task} task={task} onClose={onClose} />;
}

function TaskDialog({
  task,
  onClose,
}: {
  task: AITaskId;
  onClose: () => void;
}) {
  const { data, update } = useResume();
  const gen = useGeneration();

  const [entry, setEntry] = useState<EntryOption | null>(null);
  const [target, setTarget] = useState<LanguageCode | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [applied, setApplied] = useState(false);

  const meta = AI_TASKS[task];
  const needs = choiceFor(task);
  const current = language(data.settings.language);
  const entries = timelineEntries(data);

  // Tasks with nothing to ask start the moment they open. `data` is
  // deliberately not a dependency: re-running on every keystroke of the resume
  // would restart the request mid-answer.
  useEffect(() => {
    if (!choiceFor(task)) gen.run({ task, data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runHighlights = (chosen: EntryOption) => {
    setEntry(chosen);
    gen.run({
      task: "highlights",
      data,
      target: { sectionId: chosen.sectionId, itemId: chosen.itemId },
    });
  };

  const runTranslate = async (code: LanguageCode) => {
    setTarget(code);
    setTranslating(true);

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, target: code }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: typeof data;
      };
      if (!res.ok || !payload.data) {
        throw new Error(payload.error || `Server error ${res.status}`);
      }

      const next = payload.data;
      update((draft) => {
        draft.personal = next.personal;
        draft.sections = next.sections;
        draft.settings = next.settings;
      });
      setTranslated(true);
    } catch (err) {
      toast.error("Couldn't translate this resume", {
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
      // Back to the language list, so it can be tried again or abandoned.
      setTarget(null);
    } finally {
      setTranslating(false);
    }
  };

  const apply = () => {
    const text = gen.text.trim();
    if (!task || !text) return;

    update((draft) => {
      if (task === "summary") applySummary(draft, text);
      else if (task === "skills") applySkills(draft, text);
      else if (task === "highlights" && entry) {
        applyHighlights(
          draft,
          { sectionId: entry.sectionId, itemId: entry.itemId },
          text,
        );
      }
    });
    setApplied(true);
  };

  const busy = gen.busy || translating;
  const close = () => {
    gen.cancel();
    onClose();
  };

  if (!task || !meta) return null;

  // Which of the three faces the dialog is showing.
  const awaitingChoice =
    (needs === "language" && !target) || (needs === "entry" && !entry);

  return (
    <Dialog open onOpenChange={(next) => !next && !busy && close()}>
      <DialogContent className="max-w-[520px] p-7 sm:max-w-[520px]">
        <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink">
          {awaitingChoice && needs === "language"
            ? "Translate into"
            : awaitingChoice && needs === "entry"
              ? "Which role?"
              : meta.label}
        </DialogTitle>
        <DialogDescription className="sr-only">{meta.blurb}</DialogDescription>

        {awaitingChoice ? (
          needs === "language" ? (
            <ChoiceList>
              {LANGUAGES.filter((l) => l.code !== current.code).map((l) => (
                <ChoiceButton
                  key={l.code}
                  glyph={l.flag}
                  label={l.english}
                  onClick={() => void runTranslate(l.code)}
                />
              ))}
            </ChoiceList>
          ) : (
            <ChoiceList>
              {entries.map((option) => (
                <ChoiceButton
                  key={option.itemId}
                  glyph="💼"
                  label={option.label}
                  hint={option.ready ? undefined : "no highlights yet"}
                  disabled={!option.ready}
                  onClick={() => runHighlights(option)}
                />
              ))}
            </ChoiceList>
          )
        ) : (
          <div className="mt-6">
            {/* Translate answers with a whole document, so there's nothing to
                stream — the bar is all the progress there is to show. */}
            {task === "translate" ? (
              <TranslateProgress
                done={translated}
                target={target ? language(target).english : ""}
              />
            ) : (
              <>
                {gen.busy && <ProgressBar />}
                <div className="mt-4 max-h-[46vh] overflow-y-auto rounded-xl bg-panel p-5">
                  {gen.error ? (
                    <p className="text-[14px] leading-relaxed text-danger">
                      {gen.error}
                    </p>
                  ) : (
                    <Suggestion
                      task={task}
                      text={gen.text}
                      streaming={gen.busy}
                    />
                  )}
                </div>
              </>
            )}

            <Actions
              task={task}
              gen={gen}
              applied={applied}
              translating={translating}
              translated={translated}
              onApply={apply}
              onRegenerate={() =>
                task === "highlights" && entry
                  ? runHighlights(entry)
                  : gen.run({ task, data })
              }
              onRetryLanguage={() => setTarget(null)}
              onClose={close}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** The big-button list, same shape as the "Add a resume" dialog. */
function ChoiceList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 max-h-[52vh] space-y-2.5 overflow-y-auto pr-0.5">
      {children}
    </div>
  );
}

function ChoiceButton({
  glyph,
  label,
  hint,
  disabled,
  onClick,
}: {
  glyph: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-4 rounded-xl border border-field-border px-6 py-5 text-left text-[17px] font-bold text-ink transition hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-field-border"
    >
      <span className="text-[24px] leading-none">{glyph}</span>
      <span className="min-w-0 truncate">{label}</span>
      {hint && (
        <span className="ml-auto shrink-0 pl-3 text-[13.5px] font-medium text-ink-faint">
          {hint}
        </span>
      )}
    </button>
  );
}

function ProgressBar() {
  return (
    <div
      className="ai-progress-track h-1.5 w-full"
      role="progressbar"
      aria-label="Working"
    >
      <span />
    </div>
  );
}

function TranslateProgress({
  done,
  target,
}: {
  done: boolean;
  target: string;
}) {
  if (done) {
    return (
      <div className="rounded-xl bg-panel p-6 text-center">
        <CheckIcon className="mx-auto h-6 w-6 text-purple" />
        <p className="mt-3 text-[16px] font-extrabold text-ink">
          Translated into {target}
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          It&rsquo;s already in the preview. Anything that reads oddly is yours
          to fix.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-panel p-6 text-center">
      <p className="text-[16px] font-extrabold text-ink">
        Translating into {target}…
      </p>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">
        Rewriting every section. This takes a moment.
      </p>
      <div className="mt-4">
        <ProgressBar />
      </div>
    </div>
  );
}

function Actions({
  task,
  gen,
  applied,
  translating,
  translated,
  onApply,
  onRegenerate,
  onRetryLanguage,
  onClose,
}: {
  task: AITaskId;
  gen: ReturnType<typeof useGeneration>;
  applied: boolean;
  translating: boolean;
  translated: boolean;
  onApply: () => void;
  onRegenerate: () => void;
  onRetryLanguage: () => void;
  onClose: () => void;
}) {
  const meta = AI_TASKS[task];
  const text = gen.text.trim();

  if (task === "translate") {
    return (
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        {translated && (
          <button
            type="button"
            onClick={onRetryLanguage}
            className="rounded-lg px-3.5 py-2 text-[14px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
          >
            Another language
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={translating}
          className="rounded-lg bg-navy px-4 py-2 text-[14px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {translating ? "Working…" : "Done"}
        </button>
      </div>
    );
  }

  // "prose" tasks — the review — are read, not applied.
  const canApply = meta.output !== "prose" && Boolean(text) && !gen.busy;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
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

      <button
        type="button"
        onClick={onClose}
        className="ml-auto rounded-lg px-3.5 py-2 text-[14px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
      >
        {applied ? "Done" : "Close"}
      </button>
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
