"use client";

// The AI tab: a conversation about the resume that is open beside it.
//
// This used to be a menu of cards, one per whole-document task. The tasks
// themselves haven't gone anywhere — `AITaskDialog` still runs them, and the
// suggestions below open the same ones by asking for them in words — but the
// way in is now a sentence, because "shorten my summary and move education
// under experience" was never going to be a card.
//
// The empty state follows the assistant layout: a round mark, a greeting, one
// big composer, and a few suggestions under it. Two deliberate departures from
// that design, both because this is a side panel rather than a page:
// suggestions stack in one column (which is what the design itself does under
// 760px), and the attach / image / file buttons are absent — the agent reads
// the document beside it and takes no uploads, and a control that does nothing
// is worse than one that isn't there.

import { useEffect, useMemo, useRef, useState } from "react";
import { useResume } from "@/lib/store";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { usePlan } from "@/components/plan/PlanProvider";
import { AGENT_LIMITS } from "@/lib/ai/agent";
import { useAgent, type ChatEntry } from "@/lib/ai/use-agent";
import { MarkdownView } from "@/components/ui/markdown-view";
import { MagicIcon } from "@/components/ui/svg-icons";

/**
 * The assistant's own gradient, fixed rather than themed.
 *
 * Everything structural on this panel — paper, ink, hairlines — comes from the
 * theme, so the tab still belongs to whichever one is on. This one mark does
 * not: it reads as the assistant's own colour the way a product logo does, and
 * a slate-brand theme would otherwise leave it grey.
 */
const ORB =
  "bg-[radial-gradient(circle_at_36%_25%,rgba(255,255,255,.78),transparent_10%),linear-gradient(145deg,#72d6f7_0%,#0e9ddd_55%,#168ee0_100%)]";

/** Suggestions, as a title and the line under it. More than fit at once, so
 *  "Refresh" has somewhere to go. */
const SUGGESTIONS = [
  { title: "Summary", blurb: "Write the opening paragraph from the roles already on the page.", ask: "Write me a professional summary" },
  { title: "Sharpen", blurb: "Turn duties into achievements on your most recent role.", ask: "Sharpen the bullets on my most recent role" },
  { title: "Critique", blurb: "A straight answer on what a recruiter would skip past.", ask: "What's holding this resume back?" },
  { title: "ATS", blurb: "Lay it out so an applicant tracking system parses it cleanly.", ask: "Make this ATS-friendly" },
  { title: "Skills", blurb: "Group the skills your experience already evidences.", ask: "Suggest skills my experience backs up" },
  { title: "Shorten", blurb: "Get it onto one page without losing what matters.", ask: "Cut this down to one page" },
  { title: "Design", blurb: "A template and type that suit the field you're in.", ask: "Pick a template that suits my field" },
  { title: "Order", blurb: "Put the sections that carry the application first.", ask: "Reorder my sections so the strongest comes first" },
];

const PER_PAGE = 3;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function AIPanel() {
  const { guest, data } = useResume();
  const auth = useAuthDialog();
  const plan = usePlan();
  const { chat, busy, send, stop, undo, reset } = useAgent();
  const [draft, setDraft] = useState("");
  const [page, setPage] = useState(0);
  const foot = useRef<HTMLDivElement>(null);

  const firstName = data.personal.fullName.trim().split(/\s+/)[0] ?? "";

  const shown = useMemo(() => {
    const start = (page * PER_PAGE) % SUGGESTIONS.length;
    return Array.from(
      { length: PER_PAGE },
      (_, i) => SUGGESTIONS[(start + i) % SUGGESTIONS.length]!,
    );
  }, [page]);

  // Follow the conversation as it grows, but only while it is growing — a
  // scroll on every keystroke would fight someone reading back.
  useEffect(() => {
    foot.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.length, busy]);

  const submit = (text: string) => {
    if (!text.trim() || busy) return;
    if (!plan.ask("ai")) return;
    setDraft("");
    void send(text);
  };

  if (guest) {
    return (
      <div className="mx-auto max-w-[520px] pt-10 text-center">
        <Orb className="mx-auto h-[74px] w-[74px] text-[29px]" />
        <h2 className="mt-6 text-[26px] leading-tight font-semibold tracking-[-.042em] text-ink">
          Sign in to write with AI
        </h2>
        <p className="mx-auto mt-3.5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
          The assistant edits your resume as you talk to it. The one you&rsquo;ve
          started comes with you when you sign in.
        </p>
        <button
          type="button"
          onClick={() => auth.open("signup")}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-purple px-5 text-[14.5px] font-bold text-white transition hover:opacity-90"
        >
          Log in or sign up
        </button>
      </div>
    );
  }

  // Before the first message the panel is a landing page: mark, greeting, one
  // big composer, suggestions. After it, the transcript takes the room and the
  // composer drops to the bottom where a chat box belongs.
  if (!chat.length) {
    return (
      <div className="mx-auto w-full max-w-[720px] pt-[clamp(24px,9vh,88px)]">
        <div className="text-center">
          <Orb className="mx-auto h-[88px] w-[88px] text-[34px]" />
          <h2 className="mt-6 text-[clamp(30px,2.9vw,42px)] leading-[1.15] font-semibold tracking-[-.042em] text-ink">
            {greeting()}
            {firstName ? `, ${firstName}!` : "!"}
          </h2>
          <p className="mt-4 mb-10 text-[16px] tracking-[-.01em] text-ink-soft">
            Ask for a change and it gets made on the page beside you.
          </p>
        </div>

        <Composer
          draft={draft}
          setDraft={setDraft}
          onSubmit={submit}
          busy={busy}
          onStop={stop}
          showModelRow
        />

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {shown.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => submit(item.ask)}
              className="min-h-[104px] rounded-xl border border-black/[0.07] bg-black/[0.015] px-5 pt-5 pb-4 text-left transition hover:-translate-y-px hover:bg-black/[0.035]"
            >
              <strong className="mb-2 block text-[14px] font-semibold text-ink">
                {item.title}
              </strong>
              <span className="block text-[12.5px] leading-[1.5] text-ink-soft">
                {item.blurb}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="mt-5 flex w-fit items-center gap-1.5 text-[12.5px] text-ink-soft transition hover:text-ink"
        >
          Refresh prompts
          <RefreshIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-[720px] flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-2.5">
          <Orb className="h-9 w-9 text-[15px]" />
          <span className="text-[16px] font-semibold tracking-[-.015em] text-ink">
            Assistant
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-2.5 py-1.5 text-[13px] font-bold text-ink-soft transition hover:bg-black/[0.04] hover:text-ink"
        >
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-3">
        {chat.map((entry) => (
          <Turn key={entry.id} entry={entry} onUndo={() => undo(entry.id)} />
        ))}
        <div ref={foot} />
      </div>

      <div className="shrink-0">
        <Composer
          draft={draft}
          setDraft={setDraft}
          onSubmit={submit}
          busy={busy}
          onStop={stop}
        />
      </div>
    </div>
  );
}

/** The assistant's mark. One shape, two sizes — the hero and the header. */
function Orb({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-[rgba(0,131,200,.75)] text-white shadow-[inset_0_1px_5px_rgba(255,255,255,.75),0_2px_4px_rgba(18,132,191,.15)] ${ORB} ${className}`}
    >
      <MagicIcon className="h-[0.52em] w-[0.52em]" />
    </span>
  );
}

function Composer({
  draft,
  setDraft,
  onSubmit,
  busy,
  onStop,
  showModelRow = false,
}: {
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: (text: string) => void;
  busy: boolean;
  onStop: () => void;
  showModelRow?: boolean;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(draft);
      }}
      className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-black/[0.02] shadow-[0_2px_8px_rgba(17,24,39,.025)]"
    >
      {showModelRow && (
        <div className="flex h-[76px] items-center gap-3.5 px-5">
          <Orb className="h-[42px] w-[42px] text-[15px]" />
          <div className="min-w-0 text-left">
            <div className="text-[15px] leading-[1.35] font-medium text-ink">
              Reads and edits this resume
            </div>
            <div className="mt-0.5 text-[12.5px] leading-[1.35] text-ink-faint">
              Every change it makes can be undone
            </div>
          </div>
        </div>
      )}

      <div className="relative m-1 min-h-[186px] rounded-[20px] border border-black/[0.07] bg-panel px-5 pt-5 pb-[62px] shadow-[0_2px_4px_rgba(26,32,44,.03)]">
        <textarea
          value={draft}
          onChange={(event) =>
            setDraft(event.target.value.slice(0, AGENT_LIMITS.message))
          }
          // Enter sends, because this is a chat box; a newline is still on
          // Shift, which is what every other one does too.
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit(draft);
            }
          }}
          rows={3}
          placeholder="Ask for a change, or a second opinion…"
          aria-label="Ask the assistant"
          className="block h-[92px] w-full resize-none bg-transparent text-[15px] leading-[1.5] text-ink outline-none placeholder:text-ink-faint"
        />

        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop"
            className="absolute right-3.5 bottom-3.5 grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:opacity-90"
          >
            <span className="h-3 w-3 rounded-[2px] bg-white" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className={`absolute right-3 bottom-2.5 grid h-11 w-11 place-items-center rounded-full text-white shadow-[inset_0_1px_2px_rgba(255,255,255,.75),0_2px_7px_rgba(10,153,220,.28)] transition disabled:opacity-40 ${ORB}`}
          >
            <SendIcon className="h-[17px] w-[17px]" />
          </button>
        )}
      </div>
    </form>
  );
}

function Turn({ entry, onUndo }: { entry: ChatEntry; onUndo: () => void }) {
  if (entry.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-[15px] leading-relaxed text-white">
          {entry.text}
        </p>
      </div>
    );
  }

  const applied = entry.edits.filter((edit) => !edit.isError).length;
  const thinking = entry.pending && !entry.text;

  return (
    <div className="flex gap-3">
      {/* The mark breathes while the turn is open and settles when it lands,
          so the panel reads as busy without a spinner in it. */}
      <Orb
        className={`mt-0.5 h-8 w-8 text-[13px] ${entry.pending ? "ai-streaming" : ""}`}
      />

      <div className="min-w-0 flex-1 space-y-2.5">
        {thinking ? (
          <Thinking />
        ) : (
          entry.text && (
            // `ai-answer` fades each block in as it arrives — the same
            // treatment the review and the tailor give their answers.
            <div className="ai-answer text-[15px] leading-relaxed text-ink">
              <MarkdownView md={entry.text} blockSpacing="0.6em" />
              {entry.pending && (
                <span
                  aria-hidden="true"
                  className="ai-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full bg-ink"
                />
              )}
            </div>
          )
        )}

        {entry.edits.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-black/[0.015]">
            <ul>
              {entry.edits.map((edit, index) => (
                <li
                  key={`${edit.id}-${index}`}
                  // Each receipt rises in as it lands, staggered so a turn
                  // that made four edits reads as four things happening
                  // rather than one block appearing.
                  style={{
                    animation: "ai-rise 260ms ease-out both",
                    animationDelay: `${Math.min(index, 6) * 60}ms`,
                  }}
                  className="flex items-start gap-2.5 border-b border-black/[0.05] px-3.5 py-2.5 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-white ${
                      edit.isError ? "bg-ink-faint" : ORB
                    }`}
                  >
                    {edit.isError ? (
                      <span className="block h-[7px] w-[1.5px] rounded-full bg-white" />
                    ) : (
                      <TickIcon className="h-2.5 w-2.5" />
                    )}
                  </span>
                  <span
                    className={`text-[13.5px] leading-snug ${
                      edit.isError ? "text-ink-faint" : "text-ink-soft"
                    }`}
                  >
                    {edit.summary}
                  </span>
                </li>
              ))}
            </ul>

            {/* The turn's own full stop: what changed, and the way back. */}
            {entry.before && !entry.pending && (
              <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-black/[0.02] px-3.5 py-2">
                <span className="text-[12.5px] font-semibold text-ink-soft">
                  {applied} {applied === 1 ? "change" : "changes"} applied
                </span>
                <button
                  type="button"
                  onClick={onUndo}
                  className="rounded-lg px-2.5 py-1 text-[12.5px] font-bold text-ink-soft transition hover:bg-black/[0.05] hover:text-ink"
                >
                  Undo
                </button>
              </div>
            )}
          </div>
        )}

        {entry.error && (
          <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[14px] leading-relaxed text-red-700">
            {entry.error}
          </p>
        )}
      </div>
    </div>
  );
}

/** A turn that has started but written nothing yet.
 *
 *  The bar is the app's own indeterminate track — one request, answered when
 *  it's answered — rather than a spinner or a percentage it couldn't honour. */
function Thinking() {
  return (
    <div className="space-y-2 pt-1">
      <p className="text-[14px] font-medium text-ink-faint">
        Reading your resume
        <span className="ai-caret ml-0.5">…</span>
      </p>
      <span className="ai-progress-track block h-1 w-28">
        <span />
      </span>
    </div>
  );
}

function TickIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m4 12.5 5.5 5.5L20 7"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The two glyphs the app's own icon sets don't carry. Inline rather than
   imported: a webfont for two shapes is a network request and a flash. */

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 3 10.5 13.5M21 3l-6.5 18-4-8.5L2 8.5 21 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 11a8 8 0 1 0-.6 4M20 4v7h-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
