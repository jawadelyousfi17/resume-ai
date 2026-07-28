"use client";

// The tailoring, held above the tab that shows it — same reasoning as the
// review: a panel dies when you leave its tab, and a paid call that takes half
// a minute shouldn't die with it. The posting, the report and where the person
// has got to in the flow all live here.
//
// The flow is: read the posting (`report`), decide how to go about it
// (`choose`), optionally answer questions about experience the resume didn't
// show (`interview`), then rewrite and score again (`done`). Each stage is
// entered by pressing something — nothing here touches the document until
// somebody asks it to.
//
// What the report does *not* hold is any copy of the resume's own text. Every
// field the panel reads is read straight out of the document, so there is no
// second version of it to drift, go stale, or be written back over something
// newer.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  appendSkills,
  readField,
  writeField,
  type TailorReport,
} from "@/lib/ai/tailoring";
import type { ApplyResult, TailorAnswer } from "@/lib/ai/tailor-apply";
import type { ResumeData } from "@/lib/types";
import { useResume } from "@/lib/store";
import { usePlan } from "@/components/plan/PlanProvider";
import { ScanSweep } from "@/components/ui/scan-sweep";

/** Where in the tailoring the person is. */
export type Stage = "form" | "report" | "choose" | "interview" | "done";

/** What a finished run changed, for the screen that reports it. */
export interface Outcome {
  changed: number;
  addedSkills: string[];
  stillMissing: string[];
  /** The score before, and after re-reading the rewritten resume. */
  before: number;
  after: number;
}

interface TailorValue {
  posting: string;
  setPosting: (value: string) => void;
  report: TailorReport | null;
  stage: Stage;
  setStage: (stage: Stage) => void;
  busy: boolean;
  /** What the assistant is doing, for the screen that waits on it. */
  busyLabel: string;
  error: string | null;
  run: (posting: string) => void;
  /** Rewrite the resume, optionally from what the person just told us, then
   *  score it again. Lands on the `done` stage. */
  tailor: (answers?: TailorAnswer[]) => void;
  outcome: Outcome | null;
  /** What a keyed field holds right now, or null if it has since been deleted. */
  field: (key: string) => string | null;
  setField: (key: string, value: string) => void;
  reset: () => void;
}

const TailorContext = createContext<TailorValue | null>(null);

export function TailorProvider({ children }: { children: React.ReactNode }) {
  const { data, update } = useResume();
  const plan = usePlan();

  const [posting, setPosting] = useState("");
  const [report, setReport] = useState<TailorReport | null>(null);
  const [stage, setStage] = useState<Stage>("form");
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const controller = useRef<AbortController | null>(null);

  // The document as it stands, for callbacks that would otherwise hold the
  // copy they were created with. Synced in an effect rather than during render,
  // which React forbids.
  const latest = useRef(data);
  useEffect(() => {
    latest.current = data;
  });

  // Only fires when the editor itself goes, not on a tab change.
  useEffect(() => () => controller.current?.abort(), []);

  /** One posting read, returning the report or throwing. */
  const readPosting = useCallback(
    async (text: string, body: ResumeData, signal: AbortSignal) => {
      const res = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: body, posting: text }),
        signal,
      });
      const payload = (await res.json().catch(() => ({}))) as
        | TailorReport
        | { error?: string };

      if (!res.ok || !("rewrites" in payload)) {
        throw new Error(
          ("error" in payload && payload.error) || `Server error ${res.status}`,
        );
      }
      return payload;
    },
    [],
  );

  const run = useCallback(
    (text: string) => {
      // One gate for every way in, same as the review's.
      if (!plan.ask("tailor")) return;

      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;

      setBusy(true);
      setBusyLabel("Reading the posting against your resume…");
      setError(null);
      setOutcome(null);

      void (async () => {
        try {
          setReport(await readPosting(text, latest.current, ctrl.signal));
          setStage("report");
        } catch (err) {
          if (ctrl.signal.aborted) return;
          setError(err instanceof Error ? err.message : "The tailoring failed.");
        } finally {
          if (!ctrl.signal.aborted) setBusy(false);
        }
      })();
    },
    [plan, readPosting],
  );

  /**
   * The rewrite itself, then a fresh reading of what came out.
   *
   * Two calls on purpose: the second one re-reads the rewritten resume from
   * scratch rather than asking the first to mark its own work, which is the
   * only way the new score means the same thing the old one did.
   */
  const tailor = useCallback(
    (answers?: TailorAnswer[]) => {
      if (!plan.ask("tailor")) return;

      const before = report?.fit ?? 0;
      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;

      setBusy(true);
      setBusyLabel(
        answers?.length
          ? "Working what you told us into your resume…"
          : "Rewriting your resume for this job…",
      );
      setError(null);

      void (async () => {
        try {
          const res = await fetch("/api/ai/tailor/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: latest.current,
              posting,
              // The report's own reading of the posting goes with it, so the
              // rewrite works down a list rather than deciding for a second
              // time what this job is asking for — and so nothing on it is
              // quietly skipped.
              requirements: report?.requirements ?? [],
              answers: answers ?? [],
            }),
            signal: ctrl.signal,
          });
          const payload = (await res.json().catch(() => ({}))) as
            | ApplyResult
            | { error?: string };

          if (!res.ok || !("edits" in payload)) {
            throw new Error(
              ("error" in payload && payload.error) ||
                `Server error ${res.status}`,
            );
          }

          // One pass over the document for the lot, so the preview doesn't
          // animate through sixteen intermediate states. The rewritten
          // document is captured on the way past: the rescore below has to
          // read what came out, and `latest` doesn't catch up until React has
          // re-rendered, which is not something to race against.
          let changed = 0;
          let added: string[] = [];
          let rewritten: ResumeData | null = null;
          update((draft) => {
            changed = 0;
            for (const edit of payload.edits) {
              if (writeField(draft, edit.key, edit.after)) changed++;
            }
            added = appendSkills(draft, payload.addSkills);
            rewritten = draft;
          });

          if (ctrl.signal.aborted) return;

          // Score the resume that came out. A failure here costs the number,
          // not the rewrite — which has already landed and is worth keeping.
          // Back to reading: the writing is done and on the page behind the
          // overlay, and carrying on drawing lines over it would say otherwise.
          setBusyLabel("Scoring the new version…");
          let after = before;
          try {
            const fresh = await readPosting(
              posting,
              rewritten ?? latest.current,
              ctrl.signal,
            );
            setReport(fresh);
            after = fresh.fit;
          } catch {
            if (ctrl.signal.aborted) return;
          }

          setOutcome({
            changed,
            addedSkills: added,
            stillMissing: payload.stillMissing,
            before,
            after,
          });
          setStage("done");
        } catch (err) {
          if (ctrl.signal.aborted) return;
          setError(err instanceof Error ? err.message : "The rewrite failed.");
        } finally {
          if (!ctrl.signal.aborted) setBusy(false);
        }
      })();
    },
    [plan, posting, report, update, readPosting],
  );

  const field = useCallback((key: string) => readField(data, key), [data]);

  const setField = useCallback(
    (key: string, value: string) => {
      update((draft) => void writeField(draft, key, value));
    },
    [update],
  );

  const reset = useCallback(() => {
    controller.current?.abort();
    setReport(null);
    setError(null);
    setOutcome(null);
    setStage("form");
    setBusy(false);
  }, []);

  return (
    <TailorContext.Provider
      value={{
        posting,
        setPosting,
        report,
        stage,
        setStage,
        busy,
        busyLabel,
        error,
        run,
        tailor,
        outcome,
        field,
        setField,
        reset,
      }}
    >
      {children}
    </TailorContext.Provider>
  );
}

export function useTailor() {
  const ctx = useContext(TailorContext);
  if (!ctx) throw new Error("useTailor must be used within a TailorProvider");
  return ctx;
}

/**
 * The scan the tailor draws over the paper while it works — reading the
 * posting, rewriting the page, or scoring what came out.
 *
 * Square, like the page underneath: a rounded overlay floating over sharp
 * corners reads as a separate pane rather than as something happening to the
 * document. Rendered from the editor shell rather than the panel, so it stays
 * up if you wander off to another tab while it runs.
 */
export function TailorOverlay() {
  const { busy } = useTailor();
  return busy ? <ScanSweep /> : null;
}
