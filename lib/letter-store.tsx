"use client";

// Editor-scoped state for a cover letter. Same contract as lib/store.tsx —
// seeded with the document the server loaded, then debounce-persists every
// change — minus the guest branch: a letter is drafted from a resume by the
// assistant, and that needs an account either way.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { CoverLetter, CoverLetterData, PageFormat } from "./types";
import {
  renameCoverLetterAction,
  saveCoverLetterDataAction,
  setCoverLetterFormatAction,
} from "@/app/actions/cover-letters";

type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DEBOUNCE_MS = 700;

interface LetterContextValue {
  id: string;
  name: string;
  data: CoverLetterData;
  format: PageFormat;
  /** The resume this letter was drafted from, if it came from one. */
  resumeId: string | null;
  saveState: SaveState;
  update: (mutator: (draft: CoverLetterData) => void) => void;
  /** Replaces the whole document — what the AI draft applies through. */
  replace: (next: CoverLetterData) => void;
  setName: (name: string) => void;
  setFormat: (format: PageFormat) => void;
}

const LetterContext = createContext<LetterContextValue | null>(null);

export function LetterProvider({
  letter,
  children,
}: {
  /** Loaded and ownership-checked on the server — see app/cover-letters/[id]. */
  letter: CoverLetter;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<CoverLetterData>(letter.data);
  const [name, setNameState] = useState(letter.name);
  const [format, setFormatState] = useState<PageFormat>(letter.format);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The edit the timer is holding, so leaving the editor can flush it rather
  // than drop it.
  const unsaved = useRef<CoverLetterData | null>(null);

  const id = letter.id;

  const report = useCallback(
    (result: { ok: true } | { ok: false; error: string }) => {
      if (result.ok) {
        setSaveState("saved");
        return;
      }
      setSaveState("error");
      toast.error("Couldn't save your changes", { description: result.error });
    },
    [],
  );

  const scheduleSave = useCallback(
    (next: CoverLetterData) => {
      setSaveState("saving");
      unsaved.current = next;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        unsaved.current = null;
        report(await saveCoverLetterDataAction(id, next));
      }, SAVE_DEBOUNCE_MS);
    },
    [id, report],
  );

  const update = useCallback(
    (mutator: (draft: CoverLetterData) => void) => {
      setData((prev) => {
        const next = structuredClone(prev);
        mutator(next);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const replace = useCallback(
    (next: CoverLetterData) => {
      setData(next);
      scheduleSave(next);
    },
    [scheduleSave],
  );

  const setFormat = useCallback(
    (value: PageFormat) => {
      setFormatState(value);
      setSaveState("saving");
      void setCoverLetterFormatAction(id, value).then(report);
    },
    [id, report],
  );

  const setName = useCallback(
    (value: string) => {
      setNameState(value);
      setSaveState("saving");
      if (nameTimer.current) clearTimeout(nameTimer.current);
      nameTimer.current = setTimeout(async () => {
        report(await renameCoverLetterAction(id, value));
      }, SAVE_DEBOUNCE_MS);
    },
    [id, report],
  );

  // Leaving the editor shouldn't cost whatever was typed in the last few
  // hundred milliseconds. The request outlives the component.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (nameTimer.current) clearTimeout(nameTimer.current);
      if (unsaved.current) void saveCoverLetterDataAction(id, unsaved.current);
    };
  }, [id]);

  // Closing the tab can't be awaited, so ask before it takes an edit with it.
  useEffect(() => {
    if (saveState !== "saving") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saveState]);

  return (
    <LetterContext.Provider
      value={{
        id,
        name,
        data,
        format,
        resumeId: letter.resumeId,
        saveState,
        update,
        replace,
        setName,
        setFormat,
      }}
    >
      {children}
    </LetterContext.Provider>
  );
}

export function useLetter() {
  const ctx = useContext(LetterContext);
  if (!ctx) throw new Error("useLetter must be used within a LetterProvider");
  return ctx;
}
