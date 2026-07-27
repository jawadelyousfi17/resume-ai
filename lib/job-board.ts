"use client";

// The job tracker's store.
//
// Applications live in this browser, the same way a guest's resume does. That
// keeps the feature entirely client-side for now — no schema, no server round
// trip, and it works signed out. Moving it into Postgres later means swapping
// the four writers below for server actions; nothing in the board itself knows
// where the list is kept.

const KEY = "meniacv:jobs:v1";
const CHANGED = "meniacv:jobs-changed";

/** What the key was called before the name was spelled right. Read once, on
 *  the way past, so nobody loses a board to a typo fix. */
const LEGACY_KEY = "maniacv:jobs:v1";

function adoptLegacy(): string | null {
  const old = window.localStorage.getItem(LEGACY_KEY);
  if (!old) return null;
  window.localStorage.setItem(KEY, old);
  window.localStorage.removeItem(LEGACY_KEY);
  return old;
}

export type JobStage = "saved" | "applied" | "interview" | "offer" | "closed";

export interface Job {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
  stage: JobStage;
  createdAt: number;
  updatedAt: number;
}

export const STAGES: {
  id: JobStage;
  label: string;
  /** The dot beside the column name. Tokens only, so it follows the theme. */
  dot: string;
  /** The column's own wash. Five distinct hues, all mixed from theme tokens,
   *  so the board changes with the palette instead of fighting it. */
  tint: string;
  hint: string;
}[] = [
  {
    id: "saved",
    label: "Saved",
    dot: "bg-ink-faint",
    tint: "bg-ink-faint/15",
    hint: "Worth a look",
  },
  {
    id: "applied",
    label: "Applied",
    dot: "bg-brand",
    tint: "bg-brand/10",
    hint: "Sent",
  },
  {
    id: "interview",
    label: "Interviewing",
    dot: "bg-caution",
    tint: "bg-caution/12",
    hint: "Talking to them",
  },
  {
    id: "offer",
    label: "Offer",
    dot: "bg-positive",
    tint: "bg-positive/12",
    hint: "They said yes",
  },
  {
    id: "closed",
    label: "Closed",
    dot: "bg-danger/70",
    tint: "bg-danger/8",
    hint: "Over, either way",
  },
];

export const stage = (id: JobStage) =>
  STAGES.find((s) => s.id === id) ?? STAGES[0];

export const stageLabel = (id: JobStage) => stage(id).label;

/* -------------------------------------------------------------------------- */
/* Sorting and filtering                                                      */
/* -------------------------------------------------------------------------- */

export type JobSort = "manual" | "updated" | "company";

/** `manual` is the default and means "however you dragged them" — any other
 *  choice overrides the order dropping a card produces, which is why it isn't
 *  something the board falls into by accident. */
export const SORTS: { id: JobSort; label: string }[] = [
  { id: "manual", label: "Board order" },
  { id: "updated", label: "Last updated" },
  { id: "company", label: "Company" },
];

/** Applies the toolbar to the board. Sorting happens inside a column — the
 *  board is already grouped by stage, so a global order would mean nothing. */
export function arrange(
  jobs: Job[],
  { query, sort }: { query: string; sort: JobSort },
): Job[] {
  const needle = query.trim().toLowerCase();

  const matched = needle
    ? jobs.filter((job) =>
        [job.company, job.role, job.location, job.notes]
          .filter((field): field is string => Boolean(field))
          .some((field) => field.toLowerCase().includes(needle)),
      )
    : jobs;

  if (sort === "manual") return matched;

  // Copied before sorting: the array is the store's cached snapshot, and
  // sorting in place would mutate what every other reader sees.
  return [...matched].sort((a, b) =>
    sort === "company"
      ? a.company.localeCompare(b.company)
      : b.updatedAt - a.updatedAt,
  );
}

/* -------------------------------------------------------------------------- */
/* Reading                                                                    */
/* -------------------------------------------------------------------------- */

// useSyncExternalStore compares snapshots by identity, so the parse is cached
// against the raw string — same JSON, same array.
let cachedRaw: string | null = null;
let cached: Job[] = [];

const EMPTY: Job[] = [];

export function jobsSnapshot(): Job[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(KEY) ?? adoptLegacy();
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = parse(raw);
  return cached;
}

/** Nothing to render on the server: the list only exists in a browser. */
export const jobsServerSnapshot = (): Job[] => EMPTY;

function parse(raw: string | null): Job[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Job[];
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (job): job is Job =>
        !!job && typeof job.id === "string" && typeof job.company === "string",
    );
  } catch {
    return EMPTY;
  }
}

/** Fires for this tab's own writes and for another tab's. */
export function onJobsChange(listener: () => void) {
  window.addEventListener(CHANGED, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGED, listener);
    window.removeEventListener("storage", listener);
  };
}

/* -------------------------------------------------------------------------- */
/* Writing                                                                    */
/* -------------------------------------------------------------------------- */

function write(jobs: Job[]) {
  window.localStorage.setItem(KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event(CHANGED));
}

export type JobDraft = Omit<Job, "id" | "createdAt" | "updatedAt" | "stage"> &
  Partial<Pick<Job, "stage">>;

export function addJob(draft: JobDraft): Job {
  const now = Date.now();
  const job: Job = {
    ...draft,
    id: crypto.randomUUID(),
    stage: draft.stage ?? "saved",
    createdAt: now,
    updatedAt: now,
  };
  write([job, ...jobsSnapshot()]);
  return job;
}

export function updateJob(id: string, patch: Partial<Job>) {
  write(
    jobsSnapshot().map((job) =>
      job.id === id ? { ...job, ...patch, updatedAt: Date.now() } : job,
    ),
  );
}

export function removeJob(id: string) {
  write(jobsSnapshot().filter((job) => job.id !== id));
}

/**
 * Moves a job into `stage`, dropped in front of `before` when a card was
 * dropped onto one. Order inside a column is the order of the array, so the
 * move is a splice rather than a sort key.
 */
export function moveJob(id: string, stage: JobStage, before?: string) {
  const jobs = jobsSnapshot();
  const moving = jobs.find((job) => job.id === id);
  if (!moving) return;

  const rest = jobs.filter((job) => job.id !== id);
  const next = { ...moving, stage, updatedAt: Date.now() };
  const at = before ? rest.findIndex((job) => job.id === before) : -1;

  if (at === -1) rest.push(next);
  else rest.splice(at, 0, next);

  write(rest);
}
