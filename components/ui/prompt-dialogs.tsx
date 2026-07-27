"use client";

// Renaming and confirming a delete, asked properly. `window.prompt` and
// `window.confirm` freeze the tab, can't be styled, and on some browsers come
// with a "don't let this page create more dialogs" checkbox that silently
// disables the feature.
//
// Both take a name rather than a document, so resumes and cover letters ask
// the same question the same way.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/fields";

const cancelButton =
  "rounded-lg px-4 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:text-ink";

export function RenameDialog({
  title = "Rename",
  /** The current name, or null when the dialog is closed. */
  name,
  onClose,
  onRename,
}: {
  title?: string;
  name: string | null;
  onClose: () => void;
  onRename: (name: string) => void;
}) {
  if (name === null) return null;
  // Keyed on the name so the field starts from it each time the dialog opens
  // — no effect syncing state to a prop.
  return (
    <RenameForm
      key={name}
      title={title}
      name={name}
      onClose={onClose}
      onRename={onRename}
    />
  );
}

function RenameForm({
  title,
  name: initial,
  onClose,
  onRename,
}: {
  title: string;
  name: string;
  onClose: () => void;
  onRename: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const trimmed = name.trim();

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-7 sm:max-w-[420px]">
        <DialogTitle className="text-[21px] font-extrabold tracking-tight text-ink">
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Give this document a new name.
        </DialogDescription>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (trimmed) onRename(trimmed);
          }}
        >
          <Input
            autoFocus
            value={name}
            maxLength={80}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            // Replacing the whole name is the usual reason to open this, so it
            // starts selected and one keystroke away.
            onFocus={(e) => e.currentTarget.select()}
          />

          <div className="flex justify-end gap-1">
            <button type="button" onClick={onClose} className={cancelButton}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!trimmed}
              className="rounded-lg bg-navy px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-navy/90 disabled:opacity-40"
            >
              Rename
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeleteDialog({
  title,
  /** What's being deleted, or null when the dialog is closed. */
  name,
  onClose,
  onDelete,
}: {
  title: string;
  name: string | null;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (name === null) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-7 sm:max-w-[420px]">
        <DialogTitle className="text-[21px] font-extrabold tracking-tight text-ink">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[14.5px] leading-relaxed text-ink-soft">
          &ldquo;{name}&rdquo; will be gone for good, along with everything in
          it. This can&rsquo;t be undone.
        </DialogDescription>

        <div className="flex justify-end gap-1">
          <button type="button" onClick={onClose} className={cancelButton}>
            Cancel
          </button>
          {/* Not autofocused: the destructive one shouldn't be what Enter hits
              the moment the dialog appears. */}
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg bg-danger px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-danger/90"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
