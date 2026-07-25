"use client";

// Paces a streamed answer out at reading speed.
//
// The API sends whatever the model produces, in bursts — a sentence can land
// in one frame and then nothing for half a second. Rendering that raw reads as
// stuttering. This keeps a reveal cursor that chases the received text at a
// steady rate, so the answer types itself out however lumpy the stream is.

import { useEffect, useRef, useState } from "react";

/** Characters a second while the answer is still arriving. */
const STREAMING_CPS = 55;
/** Once the stream closes there's nothing left to wait for, so catch up. */
const FINISHING_CPS = 700;
/** Keeps the reveal from drifting far behind a fast model: the further it
 *  lags, the faster it types. */
const CATCHUP_GAIN = 3;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * The portion of `full` revealed so far.
 *
 * Returns `full` untouched when the reader has asked for reduced motion —
 * animation is the decoration here, the text is the point.
 */
export function useTypewriter(full: string, streaming: boolean): string {
  const reduced = prefersReducedMotion();
  const [count, setCount] = useState(0);
  const revealed = useRef(0);

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const target = full.length;

      // A new answer, or a reset, rewinds the cursor rather than leaving it
      // past the end of a shorter string.
      if (revealed.current > target) revealed.current = target;

      if (revealed.current < target) {
        const seconds = (now - previous) / 1000;
        const backlog = target - revealed.current;
        const rate = streaming
          ? STREAMING_CPS + backlog * CATCHUP_GAIN
          : FINISHING_CPS;

        revealed.current = Math.min(
          target,
          revealed.current + Math.max(1, Math.ceil(rate * seconds)),
        );
        setCount(revealed.current);
      } else if (!streaming) {
        // Caught up and nothing more is coming — stop burning frames.
        return;
      }

      previous = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [full, streaming, reduced]);

  if (reduced) return full;
  return full.slice(0, count);
}
