"use client";

// Where a signed-out visitor's resume lives: one document, in this browser's
// localStorage, never on the server. Signing in imports it and clears it — see
// `importGuestResumeAction` and components/dashboard/GuestImport.
//
// The cap is one resume on purpose. It's the whole difference between guest
// and account, so it's enforced here rather than left to the UI to remember.

import { createEmptyResume, migrateResumeData } from "./defaults";
import { GUEST_RESUME_ID } from "./guest-id";
import type { PageFormat, Resume, ResumeData } from "./types";

const KEY = "resumeai:guest:v1";

export { GUEST_RESUME_ID, GUEST_RESUME_LIMIT } from "./guest-id";

// useSyncExternalStore calls getSnapshot on every render and compares by
// identity, so parsing fresh each time would loop forever. Cache against the
// raw string: same JSON, same object.
let cachedRaw: string | null = null;
let cached: Resume | null = null;

/** The guest resume as a stable reference. Safe to call on every render. */
export function guestResumeSnapshot(): Resume | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = readGuestResume();
  return cached;
}

/** What the server renders with — a guest resume only exists in a browser. */
export const guestServerSnapshot = (): Resume | null => null;

export function readGuestResume(): Resume | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Resume;
    if (!parsed?.data?.personal || !Array.isArray(parsed.data.sections)) {
      return null;
    }
    // Same shape-repair the server does on load, so a guest resume saved by an
    // older build opens rather than throwing.
    return {
      ...parsed,
      id: GUEST_RESUME_ID,
      data: migrateResumeData(parsed.data),
    };
  } catch {
    return null;
  }
}

function write(resume: Resume) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(resume));
  // Other tabs showing the dashboard should notice; `storage` only fires in
  // the *other* tabs, which is exactly what we want.
  window.dispatchEvent(new Event("resumeai:guest-changed"));
}

/** Creates the guest resume, or returns the existing one — a guest never has
 *  two. */
export function createGuestResume(name = "My Resume"): Resume {
  const existing = readGuestResume();
  if (existing) return existing;

  const resume = { ...createEmptyResume(name), id: GUEST_RESUME_ID };
  write(resume);
  return resume;
}

/** Stores a complete document as the guest's one resume, replacing whatever
 *  was there. Used when a resume is created with content already in it. */
export function replaceGuestResume(input: {
  name: string;
  data: ResumeData;
}): Resume {
  const resume: Resume = {
    ...createEmptyResume(input.name),
    id: GUEST_RESUME_ID,
    data: input.data,
  };
  write(resume);
  return resume;
}

function patch(changes: Partial<Resume>): Resume | null {
  const existing = readGuestResume();
  if (!existing) return null;
  const next = { ...existing, ...changes, updatedAt: Date.now() };
  write(next);
  return next;
}

export const saveGuestResumeData = (data: ResumeData) => patch({ data });
export const renameGuestResume = (name: string) => patch({ name });
export const setGuestResumeFormat = (format: PageFormat) => patch({ format });

export function deleteGuestResume() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("resumeai:guest-changed"));
}

/** Subscribes to guest-resume changes from this tab and from others. */
export function onGuestResumeChange(listener: () => void): () => void {
  window.addEventListener("resumeai:guest-changed", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("resumeai:guest-changed", listener);
    window.removeEventListener("storage", listener);
  };
}
