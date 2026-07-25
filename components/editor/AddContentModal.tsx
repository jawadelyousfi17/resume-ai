"use client";

import { SECTION_META } from "@/lib/defaults";
import type { SectionType } from "@/lib/types";
import { SECTION_ICONS } from "./section-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AddContentModal({
  existingTypes,
  onAdd,
  onClose,
}: {
  existingTypes: Set<SectionType>;
  onAdd: (type: SectionType) => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-5xl gap-6 rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-ink">
            Add content
          </DialogTitle>
          <DialogDescription className="text-[15px] text-ink-soft">
            Choose a section to add to your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_META.map((meta) => {
            const disabled = !meta.multiple && existingTypes.has(meta.type);
            const Icon = SECTION_ICONS[meta.type];
            return (
              <button
                key={meta.type}
                type="button"
                disabled={disabled}
                onClick={() => onAdd(meta.type)}
                className="group flex gap-3 rounded-2xl bg-field p-5 text-left transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-field"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-ink">
                    {meta.title}
                    {disabled && (
                      <span className="ml-2 text-[11px] font-semibold text-ink-faint">
                        Added
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink-soft">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
