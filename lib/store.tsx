"use client";

// Editor-scoped state. Loads one resume by id, exposes a mutable-style
// `update(draft => ...)` API, and debounce-persists changes to localStorage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ResumeData } from "./types";
import { getResume, renameResume, saveResumeData } from "./storage";
import { DEFAULT_SETTINGS } from "./defaults";

type SaveState = "idle" | "saving" | "saved";

interface ResumeContextValue {
  id: string;
  name: string;
  data: ResumeData;
  saveState: SaveState;
  /** Apply a mutation against a structural clone of the current data. */
  update: (mutator: (draft: ResumeData) => void) => void;
  setName: (name: string) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<ResumeData | null>(null);
  const [name, setNameState] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount / id change.
  useEffect(() => {
    const resume = getResume(id);
    if (resume) {
      // Back-fill settings for resumes saved before customization existed.
      setData({
        ...resume.data,
        settings: { ...DEFAULT_SETTINGS, ...resume.data.settings },
      });
      setNameState(resume.name);
      setStatus("ready");
    } else {
      setStatus("missing");
    }
  }, [id]);

  const scheduleSave = useCallback(
    (next: ResumeData) => {
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveResumeData(id, next);
        setSaveState("saved");
      }, 500);
    },
    [id],
  );

  const update = useCallback(
    (mutator: (draft: ResumeData) => void) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        mutator(next);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const setName = useCallback(
    (value: string) => {
      setNameState(value);
      renameResume(id, value);
    },
    [id],
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (status === "missing") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 text-ink-soft">
        <p className="text-lg font-bold text-ink">Resume not found</p>
        <a
          href="/"
          className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"
        >
          Back to My Resumes
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-dvh items-center justify-center text-ink-soft">
        Loading…
      </div>
    );
  }

  return (
    <ResumeContext.Provider
      value={{ id, name, data, saveState, update, setName }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
