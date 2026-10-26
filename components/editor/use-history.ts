"use client";

// Undo and redo for the whole document.
//
// The store has no history of its own — it holds one document and saves it.
// This watches that document from outside and keeps the versions it passes
// through, and stepping back is `replace` with an older one: saved like any
// other edit, so an undo survives a reload.
//
// A burst of edits is one step. Typing a sentence changes the document once a
// keystroke, and nobody wants to undo it a letter at a time.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeData } from "@/lib/types";

/** Edits closer together than this are folded into the same step. */
const BURST_MS = 800;
/** How far back it goes. Each entry is a whole document. */
const DEPTH = 100;

export function useHistory(
  data: ResumeData,
  replace: (next: ResumeData) => void,
) {
  const past = useRef<ResumeData[]>([]);
  const future = useRef<ResumeData[]>([]);
  const current = useRef(data);
  const lastEdit = useRef(0);
  // Set while our own `replace` is on its way back as `data`, so stepping
  // through history isn't itself recorded as an edit.
  const stepping = useRef(false);
  // The stacks live in refs; this is what the buttons render from.
  const [depth, setDepth] = useState({ back: 0, forward: 0 });
  const sync = useCallback(
    () =>
      setDepth({ back: past.current.length, forward: future.current.length }),
    [],
  );

  useEffect(() => {
    if (data === current.current) return;
    if (stepping.current) {
      stepping.current = false;
      current.current = data;
      return;
    }
    const now = Date.now();
    if (now - lastEdit.current > BURST_MS) {
      past.current.push(current.current);
      if (past.current.length > DEPTH) past.current.shift();
    }
    lastEdit.current = now;
    future.current = [];
    current.current = data;
    sync();
  }, [data, sync]);

  const step = useCallback(
    (from: React.RefObject<ResumeData[]>, to: React.RefObject<ResumeData[]>) => {
      const target = from.current.pop();
      if (!target) return;
      to.current.push(current.current);
      stepping.current = true;
      // The next edit starts a step of its own rather than joining whatever
      // burst preceded the undo.
      lastEdit.current = 0;
      replace(target);
      sync();
    },
    [replace, sync],
  );

  const undo = useCallback(() => step(past, future), [step]);
  const redo = useCallback(() => step(future, past), [step]);

  // ⌘Z / ⇧⌘Z, and Ctrl+Y. Not inside a text field: there the browser's own
  // undo is working on the characters, which is what the keys mean there.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return {
    undo,
    redo,
    canUndo: depth.back > 0,
    canRedo: depth.forward > 0,
  };
}
