"use client";

// The tailoring, held above the tab that shows it — same reasoning as the
// review: a panel dies when you leave its tab, and a paid call that takes half
// a minute shouldn't die with it. The posting, the report and which rewrites
// have been applied all live here.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { applyEdit, type TailorReport } from "@/lib/ai/tailoring";
import { useResume } from "@/lib/store";

/** What became of a rewrite once Apply was pressed. `stale` means the field
 *  had already moved on — it was edited while the report sat there. */
export type EditState = "applied" | "stale";

interface TailorValue {
  posting: string;
  setPosting: (value: string) => void;
  report: TailorReport | null;
  busy: boolean;
  error: string | null;
  run: (posting: string) => void;
  /** Applied rewrites, by their index in `report.edits`. */
  applied: Record<number, EditState>;
  apply: (index: number) => void;
  applyAll: () => void;
  reset: () => void;
}

const TailorContext = createContext<TailorValue | null>(null);

export function TailorProvider({ children }: { children: React.ReactNode }) {
  const { data, update } = useResume();

  const [posting, setPosting] = useState("");
  const [report, setReport] = useState<TailorReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<number, EditState>>({});
  const controller = useRef<AbortController | null>(null);

  // Only fires when the editor itself goes, not on a tab change.
  useEffect(() => () => controller.current?.abort(), []);

  const run = useCallback(
    (text: string) => {
      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;

      setBusy(true);
      setError(null);
      setApplied({});

      void (async () => {
        try {
          const res = await fetch("/api/ai/tailor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, posting: text }),
            signal: ctrl.signal,
          });
          const payload = (await res.json().catch(() => ({}))) as
            TailorReport | { error?: string };

          if (!res.ok || !("edits" in payload)) {
            throw new Error(
              ("error" in payload && payload.error) ||
                `Server error ${res.status}`,
            );
          }
          setReport(payload);
        } catch (err) {
          if (ctrl.signal.aborted) return;
          setError(
            err instanceof Error ? err.message : "The tailoring failed.",
          );
        } finally {
          if (!ctrl.signal.aborted) setBusy(false);
        }
      })();
    },
    [data],
  );

  /** Writes one rewrite onto the document, and records whether it landed. */
  const apply = useCallback(
    (index: number) => {
      const edit = report?.edits[index];
      if (!edit) return;

      let landed = false;
      update((draft) => {
        landed = applyEdit(draft, edit.key, edit.before, edit.after);
      });
      setApplied((prev) => ({
        ...prev,
        [index]: landed ? "applied" : "stale",
      }));
    },
    [report, update],
  );

  /** Everything not already applied, in one pass over the document. */
  const applyAll = useCallback(() => {
    if (!report) return;

    const results: Record<number, EditState> = {};
    update((draft) => {
      report.edits.forEach((edit, index) => {
        if (applied[index]) return;
        results[index] = applyEdit(draft, edit.key, edit.before, edit.after)
          ? "applied"
          : "stale";
      });
    });
    setApplied((prev) => ({ ...prev, ...results }));
  }, [report, applied, update]);

  const reset = useCallback(() => {
    controller.current?.abort();
    setReport(null);
    setError(null);
    setApplied({});
    setBusy(false);
  }, []);

  return (
    <TailorContext.Provider
      value={{
        posting,
        setPosting,
        report,
        busy,
        error,
        run,
        applied,
        apply,
        applyAll,
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
