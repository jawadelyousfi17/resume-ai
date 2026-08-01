"use client";

// The job tracker: one column per stage, one card per application.
//
// Laid out as a kanban board — a pill toolbar above it, then five washed
// columns of white cards. Each column's wash and the dot beside its name are
// mixed from theme tokens, so the board follows the palette rather than
// carrying a second one of its own.
//
// Cards are dragged between columns on a desktop and moved from the card's own
// menu on a phone — the same pairing the editor uses for reordering, because
// HTML5 drag events never fire from a finger.

import { useState, useSyncExternalStore } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  DotsIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/svg-icons";
import { CheckIcon, SearchIcon } from "@/components/ui/icons";
import { formatRelative } from "@/lib/relative-time";
import {
  addJob,
  arrange,
  jobsServerSnapshot,
  jobsSnapshot,
  moveJob,
  onJobsChange,
  removeJob,
  SORTS,
  stage as stageMeta,
  STAGES,
  stageLabel,
  updateJob,
  type Job,
  type JobSort,
  type JobStage,
} from "@/lib/job-board";
import { cn } from "@/lib/utils";

import { JobDialog, type JobFormValues } from "./JobDialog";

export function JobBoard() {
  const jobs = useSyncExternalStore(
    onJobsChange,
    jobsSnapshot,
    jobsServerSnapshot,
  );

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<JobSort>("manual");

  // The card being dragged, and the column the pointer is currently over.
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<JobStage | null>(null);

  // Either a new card in a given column, or an existing one being edited.
  const [editing, setEditing] = useState<
    { job: Job } | { stage: JobStage } | null
  >(null);

  const shown = arrange(jobs, { query, sort });

  const drop = (to: JobStage, before?: string) => {
    if (dragId) moveJob(dragId, to, before);
    setDragId(null);
    setOverStage(null);
  };

  const save = (values: JobFormValues) => {
    if (editing && "job" in editing) updateJob(editing.job.id, values);
    else addJob({ ...values, stage: editing?.stage ?? "saved" });
    setEditing(null);
  };

  const searching = Boolean(query.trim());

  return (
    <>
      {/* Off-screen rather than removed on a phone: the board needs the rows
          more than the reader needs the heading repeated, but the page still
          has to have an <h1>. */}
      <div className="mb-4 max-sm:sr-only">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Job Tracker
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-soft sm:text-[15px]">
          {jobs.length === 0
            ? "Every application in one place, from saved to signed."
            : `${jobs.length} application${jobs.length === 1 ? "" : "s"} — saved in this browser.`}
        </p>
      </div>

      <Toolbar
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
        onAdd={() => setEditing({ stage: "saved" })}
      />

      {/* A phone can't hold five columns side by side, and it can't drag —
          so there it's one list at a time, switched with the chips above it,
          and a card moves through a menu. */}
      <MobileBoard
        jobs={shown}
        onEdit={(job) => setEditing({ job })}
        onAdd={(stage) => setEditing({ stage })}
      />

      <div className="hidden md:block">
        {/* The board reclaims the page's own padding, and on a monitor wider
            than the app's 7xl cap it reaches into the margin on the right — the
            columns get the whole screen while the sidebar stays put. The 10px
            keeps it clear of the scrollbar, which `100vw` counts and the layout
            doesn't. */}
        <div className="scroll-slim mt-4 -ml-4 mr-[calc(min(0px,(1600px-100vw)/2)-6px)] flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-4 sm:-ml-10 sm:mr-[calc(min(0px,(1600px-100vw)/2)-30px)] sm:px-5 lg:-ml-14 lg:mr-[calc(min(0px,(1600px-100vw)/2)-46px)] lg:px-6">
          {STAGES.map((column) => {
            const cards = shown.filter((job) => job.stage === column.id);
            const over = overStage === column.id && dragId;

            return (
              <section
                key={column.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverStage(column.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(column.id);
                }}
                className={cn(
                  "flex min-h-[300px] min-w-[204px] flex-1 snap-start flex-col rounded-xl p-2.5 transition",
                  column.tint,
                  over && "ring-2 ring-brand/50 ring-inset",
                )}
              >
                <header className="mb-2.5 flex items-center gap-2 px-1">
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", column.dot)}
                    aria-hidden="true"
                  />
                  <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
                    {column.label}
                  </h2>
                  <span className="rounded-full bg-panel/70 px-1.5 text-[12px] font-bold text-ink-soft tabular-nums">
                    {cards.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing({ stage: column.id })}
                    aria-label={`Add a job to ${column.label}`}
                    className="-mr-0.5 ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft transition hover:bg-panel/70 hover:text-ink"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </header>

                <div className="flex flex-1 flex-col gap-2">
                  {cards.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      dragging={dragId === job.id}
                      onDragStart={() => setDragId(job.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverStage(null);
                      }}
                      onDropBefore={() => drop(column.id, job.id)}
                      onEdit={() => setEditing({ job })}
                    />
                  ))}

                  {cards.length === 0 &&
                    (searching ? (
                      <p className="flex flex-1 items-center justify-center px-3 text-center text-[12.5px] font-semibold text-ink-faint">
                        Nothing here matches
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditing({ stage: column.id })}
                        className="flex min-h-[80px] flex-1 items-center justify-center rounded-lg border-2 border-dashed border-ink-faint/30 px-3 text-center text-[12.5px] font-semibold text-ink-faint transition hover:border-brand/40 hover:text-brand"
                      >
                        {column.hint}
                      </button>
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {editing && (
        <JobDialog
          job={"job" in editing ? editing.job : undefined}
          stage={"stage" in editing ? editing.stage : undefined}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

/** Search, sort, and the one primary action — all pills on the page
 *  background, the way the reference board reads. */
function Toolbar({
  query,
  onQuery,
  sort,
  onSort,
  onAdd,
}: {
  query: string;
  onQuery: (value: string) => void;
  sort: JobSort;
  onSort: (value: JobSort) => void;
  onAdd: () => void;
}) {
  return (
    // The right edge follows the board's, which reaches past the app's width
    // cap on a wide monitor — so the button lines up with the last column.
    <div className="flex flex-wrap items-center gap-2 mr-[calc(min(0px,(1600px-100vw)/2)+10px)] sm:mr-[calc(min(0px,(1600px-100vw)/2)-10px)] lg:mr-[calc(min(0px,(1600px-100vw)/2)-22px)]">
      <div className="relative w-full min-w-0 sm:w-auto sm:max-w-[300px] sm:flex-none">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search company, role, notes"
          aria-label="Search applications"
          className="h-10 w-full rounded-full bg-panel pr-4 pl-10 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/70"
        />
      </div>

      <span className="hidden pl-1 text-[13.5px] font-semibold text-ink-soft sm:inline">
        Sort by:
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-panel px-4 text-[14px] font-bold text-ink"
          >
            {SORTS.find((s) => s.id === sort)?.label}
            <ChevronDownIcon className="h-4 w-4 text-ink-soft" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {SORTS.map((option) => (
            <DropdownMenuItem key={option.id} onClick={() => onSort(option.id)}>
              {option.label}
              {option.id === sort && (
                <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-brand" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        onClick={onAdd}
        className="btn-fill ml-auto hidden h-10 items-center gap-2 rounded-full px-5 text-[14px] font-bold sm:inline-flex"
      >
        <PlusIcon className="h-[18px] w-[18px]" />
        Add a job
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The phone                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * One stage at a time.
 *
 * Five columns on a 390px screen means either five unreadable strips or a
 * sideways scroll that hides most of the board — so the columns become a row
 * of chips, and the one you pick fills the screen. There is no dragging here:
 * a card moves from its own menu, which is the only thing a finger can do
 * reliably.
 */
function MobileBoard({
  jobs,
  onEdit,
  onAdd,
}: {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onAdd: (stage: JobStage) => void;
}) {
  const [selected, setSelected] = useState<JobStage>("saved");
  const cards = jobs.filter((job) => job.stage === selected);
  const current = stageMeta(selected);

  return (
    <div className="md:hidden">
      {/* The stages, with what's in them. Scrolls, but each chip is small
          enough that most of the row is on screen at once. */}
      <div className="scroll-slim -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {STAGES.map((option) => {
          const count = jobs.filter((job) => job.stage === option.id).length;
          const on = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={on}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-bold transition",
                on ? "bg-navy text-white" : "bg-panel text-ink-soft",
              )}
            >
              <span
                className={cn("h-2 w-2 shrink-0 rounded-full", option.dot)}
                aria-hidden="true"
              />
              {option.label}
              <span
                className={cn(
                  "text-[13px]",
                  on ? "text-white/60" : "text-ink-faint",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className={cn("mt-3 rounded-2xl p-3", current.tint)}>
        <div className="flex items-center gap-2 px-1 pb-2">
          <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
            {current.label}
          </h2>
          <span className="text-[13px] font-bold text-ink-faint">
            {cards.length}
          </span>
        </div>

        {cards.length === 0 ? (
          <button
            type="button"
            onClick={() => onAdd(selected)}
            className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-ink-faint/30 text-[13.5px] font-semibold text-ink-faint"
          >
            {current.hint} — add one
          </button>
        ) : (
          <ul className="space-y-2">
            {cards.map((job) => (
              <li key={job.id}>
                <MobileJobCard job={job} onEdit={() => onEdit(job)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => onAdd(selected)}
        className="btn-fill mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold"
      >
        <PlusIcon className="h-5 w-5" />
        Add to {current.label}
      </button>
    </div>
  );
}

/** The same card, without the drag and with the move where a thumb expects it. */
function MobileJobCard({ job, onEdit }: { job: Job; onEdit: () => void }) {
  const next = STAGES[STAGES.findIndex((s) => s.id === job.stage) + 1];

  return (
    <article className="rounded-xl bg-panel p-3.5">
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={onEdit}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-[15.5px] leading-tight font-extrabold tracking-tight text-ink">
            {job.company}
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] font-medium text-ink-soft">
            {job.role || "Role not set"}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${job.company} options`}
              className="-mt-1 -mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-faint"
            >
              <DotsIcon className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            {STAGES.filter((s) => s.id !== job.stage).map((s) => (
              <DropdownMenuItem
                key={s.id}
                onClick={() => moveJob(job.id, s.id)}
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", s.dot)}
                  aria-hidden="true"
                />
                {s.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeJob(job.id)}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(job.location || job.salary) && (
        <p className="mt-2 truncate text-[12.5px] font-semibold text-ink-faint">
          {[job.location, job.salary].filter(Boolean).join(" · ")}
        </p>
      )}

      {job.notes && (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
          {job.notes}
        </p>
      )}

      <footer className="mt-3 flex items-center gap-2">
        <span className="min-w-0 truncate text-[12px] font-medium text-ink-faint">
          {formatRelative(job.updatedAt)}
        </span>

        {/* The move you'll want nine times in ten, one tap away. */}
        {next && (
          <button
            type="button"
            onClick={() => moveJob(job.id, next.id)}
            className="ml-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-field px-3.5 text-[13px] font-bold text-ink"
          >
            {next.label}
            <ChevronDownIcon className="h-4 w-4 -rotate-90 text-ink-soft" />
          </button>
        )}
      </footer>
    </article>
  );
}

function JobCard({
  job,
  dragging,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onEdit,
}: {
  job: Job;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropBefore: () => void;
  onEdit: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropBefore();
      }}
      className={cn(
        "group flex cursor-grab flex-col rounded-lg bg-panel p-3 transition active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-[14.5px] leading-tight font-extrabold tracking-tight text-ink">
            {job.company}
          </span>
          <span className="mt-0.5 block truncate text-[13px] font-medium text-ink-soft">
            {job.role || "Role not set"}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${job.company} options`}
              className="-mt-0.5 -mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-ink"
            >
              <DotsIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>

            {/* The way to move a card on a touch screen, where nothing can be
                dragged. */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            {STAGES.filter((s) => s.id !== job.stage).map((s) => (
              <DropdownMenuItem
                key={s.id}
                onClick={() => moveJob(job.id, s.id)}
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", s.dot)}
                  aria-hidden="true"
                />
                {s.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeJob(job.id)}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(job.location || job.salary) && (
        <p className="mt-2 truncate text-[12px] font-semibold text-ink-faint">
          {[job.location, job.salary].filter(Boolean).join(" · ")}
        </p>
      )}

      {job.notes && (
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">
          {job.notes}
        </p>
      )}

      <footer className="mt-2.5 flex items-center gap-2">
        <span className="min-w-0 truncate text-[12px] font-medium text-ink-faint">
          {formatRelative(job.updatedAt)}
        </span>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto shrink-0 rounded-full bg-field px-2.5 py-1 text-[12px] font-bold text-ink-soft transition hover:text-ink"
          >
            Posting
          </a>
        )}
      </footer>

      <span className="sr-only">In {stageLabel(job.stage)}</span>
    </article>
  );
}
