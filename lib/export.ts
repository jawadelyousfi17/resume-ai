// Client-side download helpers for the generated resume artifacts.

import { toast } from "sonner";

import type { PageFormat, ResumeData } from "@/lib/types";

/** Trigger a browser download of a Blob under the given filename. */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Download a string as a .tex file. */

/** Turn a resume name into a safe file base, e.g. "Resume 1" -> "resume-1". */
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "resume"
  );
}

/**
 * Build a resume's PDF on the server and hand it to the browser, reporting
 * both outcomes as it goes.
 *
 * The editor's Download button and the dashboard card's shortcut both come
 * through here, so a resume downloads the same way — and says the same thing —
 * wherever it was pressed from.
 */
export async function downloadResumePdf(resume: {
  name: string;
  data: ResumeData;
  format: PageFormat;
}) {
  const toastId = toast.loading("Building your PDF…");
  try {
    const res = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: resume.data, format: resume.format }),
    });
    if (!res.ok) {
      const info = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(info.error || `Server error ${res.status}`);
    }

    const filename = `${slugify(resume.name)}.pdf`;
    downloadBlob(filename, await res.blob());
    toast.success(`Downloaded ${filename}`, { id: toastId });
  } catch (err) {
    toast.error("Couldn't build the PDF", {
      id: toastId,
      description: err instanceof Error ? err.message.slice(0, 160) : undefined,
    });
  }
}
