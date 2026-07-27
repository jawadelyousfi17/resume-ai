// Client-side download helpers for the generated resume artifacts.

import { toast } from "@/components/ui/toast";

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
 * What a failed compile means, in words.
 *
 * 429 is the renderer saying you've asked for too many too quickly — it is a
 * wait, not a fault, and telling someone their PDF "couldn't be built" when it
 * can be built in a minute sends them off to fix a document that isn't broken.
 * `Retry-After` is a count of seconds when the limiter sends one.
 */
export async function compileError(res: Response): Promise<{
  message: string;
  detail?: string;
}> {
  if (res.status === 429) {
    const seconds = Number(res.headers.get("Retry-After"));
    return {
      message: "Too many downloads just now",
      detail:
        seconds > 0
          ? `Try again in ${seconds < 60 ? `${seconds} seconds` : "a minute or two"}.`
          : "Give it a minute and try again — nothing has been lost.",
    };
  }

  const info = (await res.json().catch(() => ({}))) as { error?: string };
  return {
    message: "Couldn't build the PDF",
    detail: info.error?.slice(0, 160) || `Server error ${res.status}`,
  };
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
      const { message, detail } = await compileError(res);
      toast.error(message, { id: toastId, description: detail });
      return;
    }

    const filename = `${slugify(resume.name)}.pdf`;
    downloadBlob(filename, await res.blob());
    toast.success(`Downloaded ${filename}`, { id: toastId });
  } catch (err) {
    // Never reached the renderer at all — offline, or the request was cut.
    toast.error("Couldn't build the PDF", {
      id: toastId,
      description: err instanceof Error ? err.message.slice(0, 160) : undefined,
    });
  }
}
