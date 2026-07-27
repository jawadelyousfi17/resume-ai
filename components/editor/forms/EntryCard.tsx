"use client";

// Shell around a single editable entry — one job, one degree, one skill
// group. Closed, it is one row in the section's list; opened, it takes over
// the whole editing column as its own panel, so only that entry is on screen.
// Its header carries the entry's own actions: an on-demand tip, a show/hide
// toggle, and delete.

import { createContext, useContext, useState } from "react";
import type { DragProps } from "../reorder";
import { NudgeButtons } from "../NudgeButtons";
import { BulbIcon, EyeOffIcon } from "@/components/ui/icons";
import { DragIcon, EyeIcon, TrashIcon } from "@/components/ui/svg-icons";

export type OpenEntry = { sectionId: string; itemId: string } | null;

const EntryEditContext = createContext<{
  openEntry: OpenEntry;
  setOpenEntry: (entry: OpenEntry) => void;
  /** The screen is already one white sheet — the mobile setup flow — so an
   *  open entry drops its panel rather than drawing a card on top of it. */
  flat?: boolean;
}>({ openEntry: null, setOpenEntry: () => {} });

export const EntryEditProvider = EntryEditContext.Provider;

/** Which entry, if any, has taken over the column. */
export function useEntryEdit() {
  return useContext(EntryEditContext);
}

/** Everything a form needs to render either its full list or just the one
 *  entry the user opened. */
export function useEntryList<T extends { id: string }>(
  sectionId: string,
  items: T[],
) {
  const { openEntry, setOpenEntry } = useEntryEdit();
  const editingId =
    openEntry && openEntry.sectionId === sectionId ? openEntry.itemId : null;

  return {
    /** The list to map over — every entry, or only the open one. */
    items: editingId ? items.filter((i) => i.id === editingId) : items,
    /** True while one entry owns the column. */
    editing: editingId !== null,
    isOpen: (id: string) => id === editingId,
    open: (id: string) => setOpenEntry({ sectionId, itemId: id }),
  };
}

/** Drag-to-reorder for the closed rows — the same hook the section list uses,
 *  so an entry and a section are dragged the same way. */
export { useListDrag as useEntryDrag } from "../reorder";

export function EntryCard({
  open,
  onOpen,
  title,
  summary,
  meta,
  tip,
  hidden,
  drag,
  onToggleHidden,
  onDelete,
  children,
}: {
  open: boolean;
  onOpen: () => void;
  /** Fallback label — "Entry 2" — when the entry has nothing typed in yet. */
  title: string;
  /** The entry's own words, shown on the closed row. */
  summary?: string;
  /** Second line on the closed row: dates, company, tag count. */
  meta?: string;
  /** Shown only after the user asks for it. */
  tip?: string;
  hidden?: boolean;
  /** Drag-to-reorder props for the closed row, from `useEntryDrag`. */
  drag?: DragProps;
  onToggleHidden?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}) {
  const [showTip, setShowTip] = useState(false);
  const { setOpenEntry, flat } = useEntryEdit();

  // Deleting the entry you are editing leaves nothing to edit — step back out.
  const remove = onDelete
    ? () => {
        if (open) setOpenEntry(null);
        onDelete();
      }
    : undefined;

  // The closed row carries only the hide toggle; deleting an entry is done
  // from inside it, where you can see what you are throwing away.
  const hideToggle = onToggleHidden && (
    <IconButton
      label={hidden ? "Show in resume" : "Hide from resume"}
      onClick={onToggleHidden}
    >
      {hidden ? (
        <EyeOffIcon className="h-[18px] w-[18px]" />
      ) : (
        <EyeIcon className="h-[18px] w-[18px]" />
      )}
    </IconButton>
  );

  if (!open) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={drag?.onDragEnter}
        onDrop={(e) => {
          e.preventDefault();
          drag?.onDragEnd();
        }}
        className={`flex items-center gap-2 border-t border-black/5 px-5 py-3 transition ${
          hidden ? "opacity-60" : ""
        } ${drag?.dragging ? "opacity-40" : ""}`}
      >
        {drag && (
          <span
            draggable
            tabIndex={0}
            role="button"
            onDragStart={drag.onDragStart}
            onDragEnd={drag.onDragEnd}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                drag.onNudge(e.key === "ArrowUp" ? -1 : 1);
              }
            }}
            aria-label="Reorder entry"
            title="Drag to reorder, or press ↑ / ↓"
            className="hidden h-9 w-6 shrink-0 cursor-grab items-center justify-center rounded-lg text-ink-faint transition hover:text-ink active:cursor-grabbing md:inline-flex"
          >
            <DragIcon className="h-[18px] w-[18px]" />
          </span>
        )}

        {drag && <NudgeButtons onNudge={drag.onNudge} label="entry" />}

        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 py-1 text-left transition hover:text-brand"
        >
          <span className="block truncate text-[17px] font-medium text-ink">
            {summary || title}
          </span>
          {meta && (
            <span className="mt-0.5 block truncate text-[13.5px] font-medium text-ink-faint">
              {meta}
            </span>
          )}
        </button>

        {hideToggle}
      </div>
    );
  }

  return (
    <div
      className={
        flat
          ? "overflow-hidden"
          : "overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)]"
      }
    >
      <div
        className={`flex items-center gap-1.5 px-5 pb-1 ${flat ? "pt-0" : "pt-5"}`}
      >
        {/* The step's own heading already names what is being edited. */}
        {flat ? (
          <span className="flex-1" />
        ) : (
          <p className="min-w-0 flex-1 truncate text-[22px] font-bold tracking-tight text-ink">
            Edit Entry
          </p>
        )}

        {tip && (
          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            aria-expanded={showTip}
            className={`mr-1 flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-bold transition hover:bg-black/5 ${
              showTip ? "text-brand" : "text-ink"
            }`}
          >
            <BulbIcon className="h-[18px] w-[18px]" />
            Get Tips
          </button>
        )}

        {hideToggle}

        {remove && (
          <IconButton label="Delete entry" danger onClick={remove}>
            <TrashIcon className="h-[18px] w-[18px]" />
          </IconButton>
        )}
      </div>

      <div className={`px-5 pb-6 ${flat ? "pt-3" : "pt-5"}`}>
        {showTip && tip && (
          <p className="mb-3 rounded-lg bg-brand-soft px-3 py-2 text-[13.5px] font-medium text-brand">
            {tip}
          </p>
        )}

        {hidden && (
          <p className="mb-3 text-[13px] font-semibold text-ink-faint">
            Hidden — this entry stays here but is left off the resume.
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

function IconButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-field text-ink-soft transition hover:bg-black/[0.06] ${
        danger ? "hover:text-danger" : "hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
