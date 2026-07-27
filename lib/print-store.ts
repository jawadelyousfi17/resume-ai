import "server-only";

// A brief hand-off between the export route and the page the browser prints.
//
// Printing works by pointing a headless browser at a real page in this app, so
// the PDF comes out of the same React component and the same stylesheet as the
// on-screen preview. That means the document has to be reachable over HTTP for
// a moment — and it can't come from the database, because a guest's resume
// only exists in their browser.
//
// So the export route parks the document here under a single-use token, the
// print page claims it, and it's gone. Tokens are random, expire in a minute,
// and can only be redeemed once.

import type { CoverLetterData, PageFormat, ResumeData } from "./types";

/** Two kinds of document print through the same pipeline. The tag is what the
 *  print page reads to know which renderer to reach for. */
export type PrintJob =
  | { kind: "resume"; data: ResumeData; format: PageFormat }
  | { kind: "letter"; data: CoverLetterData; format: PageFormat };

const TTL_MS = 60_000;

type Entry = PrintJob & { expires: number };

/** Module state, which Next preserves across requests in one server process.
 *  Held on globalThis so a dev-mode module reload doesn't strand a job that a
 *  browser is on its way to collect. */
const jobs: Map<string, Entry> =
  (globalThis as { __printJobs?: Map<string, Entry> }).__printJobs ??
  ((globalThis as { __printJobs?: Map<string, Entry> }).__printJobs = new Map());

function sweep() {
  const now = Date.now();
  for (const [token, entry] of jobs) {
    if (entry.expires <= now) jobs.delete(token);
  }
}

export function createPrintJob(job: PrintJob): string {
  sweep();
  const token = crypto.randomUUID();
  jobs.set(token, { ...job, expires: Date.now() + TTL_MS });
  return token;
}

/** Reads a job and removes it — a token is good for exactly one render. */
export function claimPrintJob(token: string): PrintJob | null {
  sweep();
  const entry = jobs.get(token);
  if (!entry) return null;
  jobs.delete(token);

  // The expiry is bookkeeping for the sweep, not part of the job.
  const { expires, ...job } = entry;
  void expires;
  return job;
}
