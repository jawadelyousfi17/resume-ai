"use client";

// "Import my resume", at the top of the Content tab.
//
// The same reader the dashboard uses, pointed at the resume that's already
// open: whatever the model finds replaces the personal details and every
// section, and the design — template, accent, font, page — is left exactly as
// it was, because a PDF has nothing to say about it and the user chose it.
//
// It sits above the fields rather than behind a menu because the people who
// need it need it before they type anything: they came here with a resume and
// don't want to copy it out by hand. Once there is work on the page, the
// button asks first — an import is a replacement, and the only thing worse
// than typing a resume out twice is having it overwritten.

import { useRef, useState } from "react";

import { ImportScan } from "@/components/dashboard/ImportScan";
import { usePlan } from "@/components/plan/PlanProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanBadge } from "@/components/ui/plan-badge";
import { UploadIcon } from "@/components/ui/svg-icons";
import { toast } from "@/components/ui/toast";
import { cheapestPlanWith } from "@/lib/plans";
import {
  IMPORT_ACCEPT,
  importAccepts,
  readResumeFile,
  type ImportedResume,
} from "@/lib/import-resume";
import { useResume } from "@/lib/store";
import type { ResumeData } from "@/lib/types";

/** Whether there's anything on the page worth asking about before it goes. */
function written(data: ResumeData): boolean {
  const { fullName, title, email, phone, location, links } = data.personal;
  return (
    data.sections.length > 0 ||
    Boolean(fullName || title || email || phone || location) ||
    links.length > 0
  );
}

export function ImportResume() {
  const { data, update } = useResume();
  const plan = usePlan();
  const canImport = plan.allows("import");

  const fileInput = useRef<HTMLInputElement>(null);
  // The file is held for as long as it's being read: it's what the scan shows.
  const [reading, setReading] = useState<File | null>(null);
  // A chosen file waiting on an answer about the work it would replace.
  const [confirming, setConfirming] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => {
    // Reading a file costs a model call, so the refusal — the upgrade card, or
    // the way in for a guest — happens on the click, before anything is
    // uploaded and before a picker opens over the top of it.
    if (!canImport) return void plan.ask("import");
    fileInput.current?.click();
  };

  /** Everything the file said, over everything that was there. */
  const apply = (imported: ImportedResume) => {
    update((d) => {
      d.personal = {
        ...imported.data.personal,
        // Neither of these can come out of a PDF, and both were set here: a
        // photo was uploaded, and the contact order was dragged into place.
        photo: d.personal.photo,
        contactOrder: d.personal.contactOrder,
      };
      d.sections = imported.data.sections;
    });

    toast.success("Imported — check it over", {
      description: "Anything the AI misread is yours to fix.",
    });
  };

  const read = async (file: File) => {
    setReading(file);
    try {
      apply(await readResumeFile(file, data.settings.language));
    } catch (err) {
      toast.error("Couldn't import that file", {
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setReading(null);
    }
  };

  /** A file has been chosen, one way or another. */
  const take = (file: File) => {
    if (!importAccepts(file)) {
      return toast.error("Can't read that kind of file", {
        description: "A PDF, an image or a text file, please.",
      });
    }
    if (written(data)) return setConfirming(file);
    void read(file);
  };

  if (reading) {
    return (
      <div className="rounded-2xl bg-panel p-4 shadow-[var(--shadow-panel)] ring-1 ring-black/5">
        <ImportScan file={reading} />
      </div>
    );
  }

  return (
    <>
      {/* The whole card takes a drop, not just the button — aiming at a target
          is the part of drag and drop people get wrong. */}
      <div
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("Files")) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (!file) return;
          if (!canImport) return void plan.ask("import");
          take(file);
        }}
        className={`rounded-2xl border-2 border-dashed p-1 transition ${
          dragging
            ? "border-brand bg-brand-soft/40"
            : "border-ink-faint/40 bg-panel/40"
        }`}
      >
        <button
          type="button"
          onClick={pick}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition hover:bg-black/[0.03]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <UploadIcon className="h-5 w-5" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15.5px] font-bold text-ink">
              {plan.plan === null && !canImport
                ? "Sign in to import your resume"
                : "Import my resume"}
            </span>
            {/* Which formats is the one thing worth saying — it saves a round
                trip to a rejected file. */}
            <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">
              {dragging
                ? "Drop it here"
                : "Upload a PDF, an image or a text file and the AI fills in every field below."}
            </span>
          </span>

          {/* On a plan without it, the same spot names the plan that has it, so
              the row answers "and then what?" before it's pressed. */}
          {!canImport && plan.plan !== null && (
            <PlanBadge plan={cheapestPlanWith("import").id} className="ml-auto" />
          )}
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={IMPORT_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Reset so picking the same file twice still fires a change.
          e.target.value = "";
          if (file) take(file);
        }}
      />

      <Dialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <DialogContent className="max-w-[420px] p-7 sm:max-w-[420px]">
          <DialogTitle className="text-[21px] font-extrabold tracking-tight text-ink">
            Replace what&rsquo;s on this resume?
          </DialogTitle>
          <DialogDescription className="text-[14.5px] leading-relaxed text-ink-soft">
            Everything the file contains takes the place of the details and
            sections you have now. Your template and design stay as they are.
          </DialogDescription>

          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className="rounded-lg px-5 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:bg-black/[0.04]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const file = confirming;
                setConfirming(null);
                if (file) void read(file);
              }}
              className="rounded-lg bg-navy px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90"
            >
              Import and replace
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
