"use client";

// The review, held above the tab that shows it.
//
// The editor unmounts a panel the moment you leave its tab, so a review kept
// inside the panel died on the way to Content and back — a half-minute of
// waiting and a paid call, thrown away by a click. It lives here instead,
// alongside the editor itself: switching tabs now leaves the report where it
// was, and a review started before the switch carries on running.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useResume } from "@/lib/store";
import { usePlan } from "@/components/plan/PlanProvider";
import { ScanSweep } from "@/components/ui/scan-sweep";
import type { ReviewReport } from "@/lib/ai/review";

/** What became of a correction once Fix was pressed. `stale` means the line
 *  had already moved on — the person edited it while the report sat there. */
export type FixState = "fixed" | "stale";

interface ReviewValue {
  report: ReviewReport | null;
  /** True from the moment Run is pressed until the answer lands, wherever in
   *  the editor you happen to be standing. */
  busy: boolean;
  error: string | null;
  run: () => void;
  /** Which issues have been applied, by their index in `report.issues`. Kept
   *  here so the Fix buttons don't forget on the way out of the tab. */
  fixes: Record<number, FixState>;
  recordFixes: (fixes: Record<number, FixState>) => void;
}

const ReviewContext = createContext<ReviewValue | null>(null);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const { data } = useResume();
  const plan = usePlan();

  const [report, setReport] = useState<ReviewReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fixes, setFixes] = useState<Record<number, FixState>>({});
  const controller = useRef<AbortController | null>(null);

  // Only fires when the editor itself goes, not on a tab change.
  useEffect(() => () => controller.current?.abort(), []);

  const run = useCallback(() => {
    // Asked here rather than on each button that starts a review: there are
    // several, and the answer must be the same from all of them. A refusal
    // puts the upgrade card up and nothing is sent.
    if (!plan.ask("review")) return;

    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;

    setBusy(true);
    setError(null);

    void (async () => {
      try {
        const res = await fetch("/api/ai/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
          signal: ctrl.signal,
        });
        const payload = (await res.json().catch(() => ({}))) as
          (ReviewReport & { error?: string }) | { error?: string };
        if (!res.ok || !("scores" in payload)) {
          throw new Error(payload.error || `Server error ${res.status}`);
        }
        setReport(payload);
        // A new report indexes its issues afresh, so what was fixed under the
        // old one means nothing under this one.
        setFixes({});
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "The review failed");
      } finally {
        // An aborted run has been replaced by a newer one, which has already
        // set this back — leave it to it.
        if (!ctrl.signal.aborted) setBusy(false);
      }
    })();
  }, [data, plan]);

  const recordFixes = useCallback((applied: Record<number, FixState>) => {
    setFixes((current) => ({ ...current, ...applied }));
  }, []);

  const value = useMemo(
    () => ({ report, busy, error, run, fixes, recordFixes }),
    [report, busy, error, run, fixes, recordFixes],
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export function useReview(): ReviewValue {
  const value = useContext(ReviewContext);
  if (!value) throw new Error("useReview must be used inside a ReviewProvider");
  return value;
}

/** The page being read: a band of light sweeping down the preview. The panel
 *  doing the work is on the other side of the editor — or not on screen at
 *  all — so without this the half of the screen the person is looking at gives
 *  no sign that anything is happening.
 *
 *  Purely decorative: `aria-hidden`, and it never takes a click. */
export function ScanOverlay() {
  const { busy } = useReview();
  if (!busy) return null;

  // Square, like the paper underneath it — a rounded scan floating over sharp
  // corners reads as a separate pane rather than light crossing the page.
  return <ScanSweep />;
}
