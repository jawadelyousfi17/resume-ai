"use client";

// Collapsible card used for every editable block in the Content tab. Open, a
// section reads as a list: full-bleed entry rows divided by hairlines, closed
// off by a footer that carries the section's own controls.

import { useEffect, useRef, useState } from "react";
import { CalendarIcon, CalendarOffIcon } from "@/components/ui/icons";
import {
  ChevronDownIcon,
  DragIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/svg-icons";
import type { DragProps } from "./reorder";
import { NudgeButtons } from "./NudgeButtons";

export function SectionCard({
  icon: Icon,
  title,
  open,
  onToggle,
  onRename,
  drag,
  flush,
  footer,
  children,
}: {
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  title: string;
  open: boolean;
  onToggle: () => void;
  /** Enables the "Edit Heading" pill next to the title. */
  onRename?: (title: string) => void;
  /** Drag-to-reorder props, from `useListDrag`. Omitted for the cards that
   *  don't move — personal details is always first. */
  drag?: DragProps;
  /** Content supplies its own padding — for the full-bleed entry rows. */
  flush?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [renaming, setRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  return (
    <div
      // The whole card is the drop target, so a section can be dropped onto a
      // neighbour whether that neighbour is open or collapsed.
      onDragOver={drag ? (e) => e.preventDefault() : undefined}
      onDragEnter={drag?.onDragEnter}
      onDrop={
        drag
          ? (e) => {
              e.preventDefault();
              drag.onDragEnd();
            }
          : undefined
      }
      className={`overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)] transition ${
        drag?.dragging ? "opacity-40" : ""
      }`}
    >
      <div
        className="flex cursor-pointer items-center gap-3 px-5 py-5"
        onClick={() => !renaming && onToggle()}
      >
        {/* Personal details can't move, but it keeps the handle's gutter so
            every card's title starts on the same line. */}
        {!drag && <span className="-ml-2 w-6 shrink-0" aria-hidden="true" />}

        {drag && (
          <span
            draggable
            tabIndex={0}
            role="button"
            onClick={(e) => e.stopPropagation()}
            onDragStart={drag.onDragStart}
            onDragEnd={drag.onDragEnd}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                drag.onNudge(e.key === "ArrowUp" ? -1 : 1);
              }
            }}
            aria-label={`Reorder ${title}`}
            title="Drag to reorder, or press ↑ / ↓"
            className="-ml-2 hidden h-9 w-6 shrink-0 cursor-grab items-center justify-center rounded-lg text-ink-faint transition hover:text-ink active:cursor-grabbing md:inline-flex"
          >
            <DragIcon className="h-[18px] w-[18px]" />
          </span>
        )}

        {drag && (
          <NudgeButtons
            onNudge={drag.onNudge}
            label={title}
            className="-ml-1 mr-1"
          />
        )}

        {Icon && <Icon className="h-6 w-6 shrink-0 text-ink" />}

        {renaming && onRename ? (
          <input
            ref={inputRef}
            defaultValue={title}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              const next = e.target.value.trim();
              if (next) onRename(next);
              setRenaming(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                e.currentTarget.value = title;
                e.currentTarget.blur();
              }
            }}
            className="min-w-0 flex-1 rounded-lg bg-field px-3 py-1 text-[22px] font-bold tracking-tight text-ink outline-none ring-2 ring-ink/80"
          />
        ) : (
          <>
            <p className="min-w-0 shrink truncate text-[22px] font-bold tracking-tight text-ink">
              {title}
            </p>
            {open && onRename && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRenaming(true);
                }}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-field px-4 py-2.5 text-[15px] font-bold text-ink transition hover:bg-black/[0.06]"
              >
                <PencilIcon className="h-[18px] w-[18px]" />
                Edit Heading
              </button>
            )}
            <span className="flex-1" />
          </>
        )}

        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <>
          {/* Flush content draws its own dividers, one per row. */}
          <div
            className={flush ? "" : "border-t border-black/5 px-5 pb-5 pt-4"}
          >
            {children}
          </div>
          {footer}
        </>
      )}
    </div>
  );
}

/** The row under a section's entries: dates toggle, add, delete. */
export function SectionFooter({
  showDates,
  onToggleDates,
  onAddEntry,
  onDelete,
}: {
  /** Omitted for sections whose entries carry no dates. */
  showDates?: boolean;
  onToggleDates?: () => void;
  /** Omitted for the summary, which is prose rather than a list. */
  onAddEntry?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-black/5 px-5 py-4">
      <div className="flex-1">
        {onToggleDates && (
          <FooterIcon
            label={
              showDates
                ? "Hide dates in this section"
                : "Show dates in this section"
            }
            active={showDates}
            onClick={onToggleDates}
          >
            {showDates ? (
              <CalendarIcon className="h-[18px] w-[18px]" />
            ) : (
              <CalendarOffIcon className="h-[18px] w-[18px]" />
            )}
          </FooterIcon>
        )}
      </div>

      {onAddEntry && (
        <button
          type="button"
          onClick={onAddEntry}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-black/10 px-6 py-3 text-[15px] font-bold text-ink transition hover:border-brand/40 hover:text-brand"
        >
          <PlusIcon className="h-5 w-5" />
          Add Entry
        </button>
      )}

      <div className="flex flex-1 justify-end">
        <FooterIcon label="Delete section" danger onClick={onDelete}>
          <TrashIcon className="h-[18px] w-[18px]" />
        </FooterIcon>
      </div>
    </div>
  );
}

function FooterIcon({
  label,
  danger,
  active,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-field transition hover:bg-black/[0.06] ${
        danger ? "text-ink-soft hover:text-danger" : ""
      } ${active === false ? "text-ink-faint" : "text-ink"}`}
    >
      {children}
    </button>
  );
}

/** Sits in its own panel beneath the open card, as its own step — except on a
 *  phone, where the screen is already one white sheet and a panel would only
 *  draw a box on it. */
export function DoneButton({
  onClick,
  flat = false,
}: {
  onClick: () => void;
  flat?: boolean;
}) {
  if (flat) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="btn-fill flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition active:scale-[0.995]"
      >
        ✓ Done
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-panel p-3 shadow-[var(--shadow-panel)]">
      <button
        type="button"
        onClick={onClick}
        className="btn-fill flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition hover:brightness-[1.03] active:scale-[0.995]"
      >
        ✓ Done
      </button>
    </div>
  );
}
