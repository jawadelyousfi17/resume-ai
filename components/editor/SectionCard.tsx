"use client";

// Collapsible card used for every editable block in the Content tab.

import {
  BulbIcon,
  ChevronDownIcon,
  DragIcon,
  TrashIcon,
} from "@/components/ui/icons";

export function SectionCard({
  title,
  subtitle,
  icon,
  open,
  onToggle,
  onDelete,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)]">
      <div
        className="flex cursor-pointer items-center gap-3 px-5 py-4"
        onClick={onToggle}
      >
        <DragIcon className="h-5 w-5 shrink-0 text-ink-faint" />
        {icon && <span className="shrink-0 text-ink-soft">{icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold text-ink">{title}</p>
          {subtitle && (
            <p className="truncate text-[13.5px] text-ink-soft">{subtitle}</p>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger"
            aria-label="Delete section"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="group/card border-t border-black/5 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

/** A hint line that stays visible until the user hovers into the card body,
 *  then fades out of the way. */
export function HoverTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[13.5px] font-medium text-ink-soft transition-opacity duration-200 group-hover/card:opacity-0">
      <BulbIcon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function DoneButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold shadow-sm transition hover:brightness-[1.03] active:scale-[0.995]"
    >
      ✓ Done
    </button>
  );
}
