"use client";

// Editor-scoped state. Seeded with the resume that was already loaded, then
// debounce-persists every change — through the resume Server Actions for a
// signed-in user, or into localStorage for a guest. The editor itself never
// learns which, it just calls `update`.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { PageFormat, Resume, ResumeData } from "./types";
import {
  renameResumeAction,
  saveResumeDataAction,
  setResumeFormatAction,
} from "@/app/actions/resumes";
import {
  renameGuestResume,
  saveGuestResumeData,
  setGuestResumeFormat,
} from "./guest";

type SaveState = "idle" | "saving" | "saved" | "error";

/** How long to sit on a change before writing it. Long enough that typing a
 *  sentence is one request, short enough that a closed tab loses nothing. */
const SAVE_DEBOUNCE_MS = 700;

interface ResumeContextValue {
  id: string;
  name: string;
  data: ResumeData;
  /** The paper the resume is laid out for. */
  format: PageFormat;
  saveState: SaveState;
  /** True when this resume lives in the browser, not the database. */
  guest: boolean;
  /** Apply a mutation against a structural clone of the current data. */
  update: (mutator: (draft: ResumeData) => void) => void;
  setName: (name: string) => void;
  setFormat: (format: PageFormat) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

const OK = { ok: true } as const;
const GONE = {
  ok: false as const,
  error: "This resume is no longer in your browser's storage.",
};

/** Guest equivalent of `saveResumeDataAction`. */
function saveResumeDataAction_guest(next: ResumeData) {
  return saveGuestResumeData(next) ? OK : GONE;
}

export function ResumeProvider({
  resume,
  guest = false,
  children,
}: {
  /** Loaded and ownership-checked on the server — see app/resume/[id] — or
   *  read from localStorage when `guest`. */
  resume: Resume;
  guest?: boolean;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<ResumeData>(resume.data);
  const [name, setNameState] = useState(resume.name);
  const [format, setFormatState] = useState<PageFormat>(resume.format);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The edit the timer is holding, if any — kept so leaving the editor can
  // flush it instead of dropping it. localStorage used to make this free.
  const unsaved = useRef<ResumeData | null>(null);

  const id = resume.id;

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

  /** Where a change goes. A guest's resume never leaves the browser, so its
   *  writes are local, immediate, and can't fail. */
  const persist = useRef({
    data: (next: ResumeData) =>
      guest
        ? Promise.resolve(saveResumeDataAction_guest(next))
        : saveResumeDataAction(id, next),
    name: (next: string) =>
      guest
        ? Promise.resolve(renameGuestResume(next) ? OK : GONE)
        : renameResumeAction(id, next),
    format: (next: PageFormat) =>
      guest
        ? Promise.resolve(setGuestResumeFormat(next) ? OK : GONE)
        : setResumeFormatAction(id, next),
  });

  const scheduleSave = useCallback(
    (next: ResumeData) => {
      setSaveState("saving");
      unsaved.current = next;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        unsaved.current = null;
        report(await persist.current.data(next));
      }, SAVE_DEBOUNCE_MS);
    },
    [report],
  );

  const update = useCallback(
    (mutator: (draft: ResumeData) => void) => {
      setData((prev) => {
        const next = structuredClone(prev);
        mutator(next);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const setFormat = useCallback(
    (value: PageFormat) => {
      setFormatState(value);
      setSaveState("saving");
      void persist.current.format(value).then(report);
    },
    [report],
  );

  const setName = useCallback(
    (value: string) => {
      setNameState(value);
      setSaveState("saving");
      // Debounced like the document itself — the title is usually typed, not
      // pasted.
      if (nameTimer.current) clearTimeout(nameTimer.current);
      nameTimer.current = setTimeout(async () => {
        report(await persist.current.name(value));
      }, SAVE_DEBOUNCE_MS);
    },
    [report],
  );

  // Leaving the editor — back to the dashboard, say — shouldn't cost whatever
  // was typed in the last few hundred milliseconds, so send it now. The
  // request outlives the component.
  useEffect(() => {
    const write = persist.current.data;
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (nameTimer.current) clearTimeout(nameTimer.current);
      if (unsaved.current) void write(unsaved.current);
    };
  }, []);

  // Closing the tab can't be awaited, so ask before it takes an edit with it.
  useEffect(() => {
    if (saveState !== "saving") return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saveState]);

  return (
    <ResumeContext.Provider
      value={{
        id,
        name,
        data,
        format,
        guest,
        saveState,
        update,
        setName,
        setFormat,
      }}
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
