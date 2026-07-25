"use client";

// Drives one request to `/api/ai`, accumulating the streamed answer so the UI
// can render it as it arrives.

import { useCallback, useEffect, useRef, useState } from "react";
import type { AIRequest } from "./tasks";

export type GenerationStatus = "idle" | "streaming" | "done" | "error";

export function useGeneration() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  // A request outliving its panel would keep streaming into nothing.
  useEffect(() => () => controller.current?.abort(), []);

  const run = useCallback(async (request: AIRequest) => {
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;

    setText("");
    setError(null);
    setStatus("streaming");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const info = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(info.error || `Server error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setText(acc);
      }
      acc += decoder.decode();

      if (!acc.trim()) {
        throw new Error("The assistant returned nothing. Try again, or add a note about what you want.");
      }
      setText(acc);
      setStatus("done");
    } catch (err) {
      // A cancel is a user action, not a failure — leave whatever streamed in.
      if (ctrl.signal.aborted) {
        setStatus((s) => (s === "streaming" ? "done" : s));
        return;
      }
      setError(err instanceof Error ? err.message : "The assistant failed");
      setStatus("error");
    }
  }, []);

  const cancel = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    setText("");
    setError(null);
    setStatus("idle");
  }, []);

  return {
    text,
    status,
    error,
    busy: status === "streaming",
    run,
    cancel,
    reset,
  };
}
