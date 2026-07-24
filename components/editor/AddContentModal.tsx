"use client";

import { SECTION_META } from "@/lib/defaults";
import type { SectionType } from "@/lib/types";
import {
  BriefcaseIcon,
  CapIcon,
  FileTextIcon,
  StackIcon,
} from "@/components/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ICONS: Record<SectionType, React.ReactNode> = {
  summary: <FileTextIcon className="h-5 w-5" />,
  experience: <BriefcaseIcon className="h-5 w-5" />,
  education: <CapIcon className="h-5 w-5" />,
  skills: <StackIcon className="h-5 w-5" />,
};

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
      <DialogContent className="max-w-3xl gap-6 rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-ink">
            Add content
          </DialogTitle>
          <DialogDescription className="text-[15px] text-ink-soft">
            Choose a section to add to your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SECTION_META.map((meta) => {
            const disabled = !meta.multiple && existingTypes.has(meta.type);
            return (
              <button
                key={meta.type}
                type="button"
                disabled={disabled}
                onClick={() => onAdd(meta.type)}
                className="group flex gap-3 rounded-2xl bg-field p-5 text-left transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-field"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-brand">
                  {ICONS[meta.type]}
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
