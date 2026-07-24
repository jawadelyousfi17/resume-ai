// localStorage-backed persistence. Everything lives under a single key as a
// map of resumes; helpers read/write the whole map. No backend, no auth.

import type { Resume, ResumeData } from "./types";
import { createEmptyResume } from "./defaults";

const KEY = "resumeai:v1";

type Store = Record<string, Resume>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function listResumes(): Resume[] {
  return Object.values(readStore()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getResume(id: string): Resume | null {
  return readStore()[id] ?? null;
}

export function createResume(name = "Resume 1"): Resume {
  const store = readStore();
  const resume = createEmptyResume(name);
  store[resume.id] = resume;
  writeStore(store);
  return resume;
}

/** Persist edited document data for an existing resume, bumping updatedAt. */
export function saveResumeData(id: string, data: ResumeData): Resume | null {
  const store = readStore();
  const existing = store[id];
  if (!existing) return null;
  const next: Resume = { ...existing, data, updatedAt: Date.now() };
  store[id] = next;
  writeStore(store);
  return next;
}

export function renameResume(id: string, name: string): Resume | null {
  const store = readStore();
  const existing = store[id];
  if (!existing) return null;
  const next: Resume = { ...existing, name, updatedAt: Date.now() };
  store[id] = next;
  writeStore(store);
  return next;
}

export function deleteResume(id: string) {
  const store = readStore();
  delete store[id];
  writeStore(store);
}

export function duplicateResume(id: string): Resume | null {
  const store = readStore();
  const source = store[id];
  if (!source) return null;
  const copy: Resume = {
    ...structuredClone(source),
    id: crypto.randomUUID(),
    name: `${source.name} (copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  store[copy.id] = copy;
  writeStore(store);
  return copy;
}
