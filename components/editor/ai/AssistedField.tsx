"use client";

// A long-form field with the writing assistant attached: label, editor, and
// the review bar that appears once Claude has rewritten it.
//
// The suggestion is shown *in* the field, replacing what's there, so the change
// can be read where it will land. It never reaches the document until the user
// keeps it — until then the store still holds their own words, which is what
// makes "Revert" and "Try again" exact rather than approximate.

import { useResume } from "@/lib/store";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { useGeneration } from "@/lib/ai/use-generation";
import type { AIRequest } from "@/lib/ai/tasks";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { CheckIcon, SparklesIcon, XIcon } from "@/components/ui/icons";

export function AssistedField({
  label,
  value,
  onChange,
  request,
  placeholder,
  minHeight,
  disabled,
  disabledHint,
  assistLabel = "Improve with AI",
}: {
  label: string;
  /** Markdown held in the document. */
  value: string;
  onChange: (markdown: string) => void;
  /** Built at click time so it sees the field as it stands. */
  request: () => Omit<AIRequest, "data">;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
  /** Why the assistant can't run yet — shown as the button's tooltip. */
  disabledHint?: string;
  assistLabel?: string;
}) {
  const { data, guest } = useResume();
  const auth = useAuthDialog();
  const gen = useGeneration();

  const reviewing = !gen.busy && gen.status === "done" && Boolean(gen.text.trim());
  // Whatever the field should show: the suggestion while there is one, the
  // document's own text otherwise.
  const showing = gen.busy || reviewing ? gen.text : value;

  const start = () => gen.run({ ...request(), data });

  // The assistant costs money per call, so it needs an account. Say so where
  // the button is rather than letting the request come back a 401.
  if (guest) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[14px] font-bold text-ink">{label}</span>
          <button
            type="button"
            onClick={() => auth.open("signup")}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-bold text-purple transition hover:bg-purple-soft"
          >
            <SparklesIcon className="h-4 w-4" />
            Sign in to use AI
          </button>
        </div>
        <MarkdownEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minHeight={minHeight}
        />
      </div>
    );
  }

  const keep = () => {
    onChange(gen.text.trim());
    gen.reset();
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[14px] font-bold text-ink">{label}</span>
        <button
          type="button"
          onClick={gen.busy ? gen.cancel : start}
          disabled={disabled && !gen.busy}
          title={disabled && !gen.busy ? disabledHint : undefined}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-bold text-purple transition hover:bg-purple-soft disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent"
        >
          <SparklesIcon className={`h-4 w-4 ${gen.busy ? "animate-pulse" : ""}`} />
          {gen.busy ? "Stop" : reviewing ? "Rewrite again" : assistLabel}
        </button>
      </div>

      <MarkdownEditor
        value={showing}
        onChange={onChange}
        placeholder={placeholder}
        minHeight={minHeight}
        editable={!gen.busy && !reviewing}
        className={
          gen.busy
            ? "ai-streaming ai-swap"
            : reviewing
              ? "ai-review ai-swap"
              : undefined
        }
      />

      {gen.error && (
        <div className="mt-2 flex items-start justify-between gap-3 rounded-xl bg-field px-3.5 py-2.5">
          <p className="text-[13px] leading-relaxed text-danger">{gen.error}</p>
          <button
            type="button"
            onClick={gen.reset}
            className="shrink-0 rounded-md p-1 text-ink-faint transition hover:bg-black/5 hover:text-ink"
            aria-label="Dismiss"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {(gen.busy || reviewing) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-purple-soft/50 px-3 py-2.5">
          <span className="mr-auto text-[12.5px] font-bold text-purple">
            {gen.busy ? "Claude is rewriting this…" : "Suggested rewrite"}
          </span>

          {reviewing && (
            <>
              <button
                type="button"
                onClick={keep}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple px-3 py-1.5 text-[13px] font-bold text-white transition hover:opacity-90"
              >
                <CheckIcon className="h-4 w-4" />
                Keep
              </button>
              <button
                type="button"
                onClick={gen.reset}
                className="rounded-lg px-3 py-1.5 text-[13px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
              >
                Revert
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
