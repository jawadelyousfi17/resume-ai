"use client";

// Handing a file to the reader.
//
// Two places do it: "Upload a resume" on the dashboard, which makes a new
// resume out of what comes back, and "Import my resume" in the editor, which
// pours it into the one already open. What a file may be, and how it's sent,
// is the same question in both — so it's answered here, and each caller is
// left with only the part that differs.
//
// The reading itself is the model's, behind /api/import: an account, a plan
// that includes importing, and a minute of its time.

import type { ResumeData } from "./types";

/** What the browser will offer in its file picker. Word documents are absent
 *  on purpose — nothing here can read one, and the API says so plainly. */
export const IMPORT_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.txt,.md";

/** The picker filters by `IMPORT_ACCEPT`; a dropped file has to be checked by
 *  hand. */
export const importAccepts = (file: File) =>
  IMPORT_ACCEPT.split(",").some((ext) =>
    file.name.toLowerCase().endsWith(ext.trim()),
  );

export interface ImportedResume {
  /** What the resume would be called, taken from whose it is. */
  name: string;
  data: ResumeData;
}

/**
 * Reads a file into a document.
 *
 * Throws with whatever the route said — a plan that doesn't include importing,
 * a file too large, a PDF with nothing in it — so every caller can put the
 * sentence straight into a toast rather than inventing one.
 */
export async function readResumeFile(
  file: File,
  /** The resume's language, so extracted headings come out in it. */
  language?: string,
): Promise<ImportedResume> {
  const form = new FormData();
  form.set("file", file);
  if (language) form.set("language", language);

  const res = await fetch("/api/import", { method: "POST", body: form });
  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
    name?: string;
    data?: ResumeData;
  };

  if (!res.ok || !payload.data) {
    throw new Error(payload.error || `Server error ${res.status}`);
  }

  return { name: payload.name ?? "Imported Resume", data: payload.data };
}
