"use client";

// The fork in the road when you add a resume: type it yourself, or hand over
// one you already have and let the AI read it in.

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ImportScan } from "@/components/dashboard/ImportScan";
import { usePlan } from "@/components/plan/PlanProvider";
import { PlanBadge } from "@/components/ui/plan-badge";
import { cheapestPlanWith } from "@/lib/plans";
import { TemplatePicker } from "@/components/editor/CustomizePanel";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import {
  IMPORT_ACCEPT,
  importAccepts,
  readResumeFile,
} from "@/lib/import-resume";
import type { Template } from "@/lib/templates";
import type { ResumeData } from "@/lib/types";

export function NewResumeDialog({
  open,
  onOpenChange,
  creating = false,
  onScratch,
  onScratchOpen,
  onScratchCancel,
  onImported,
  onImportBlocked,
  /** The resume's language, so extracted headings come out in it. */
  language,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** True while the resume is being written and its editor opened. */
  creating?: boolean;
  /** Called with the template that was chosen for it. */
  onScratch: (template: Template) => void;
  /** The gallery has opened — the resume can start being written now. */
  onScratchOpen?: () => void;
  /** The gallery was dismissed without a choice; whatever was started for it
   *  should be undone. */
  onScratchCancel?: () => void;
  onImported: (resume: { name: string; data: ResumeData }) => void;
  /** Called when the file was turned away before it was read — the dialog
   *  behind the refusal should get out of the way. */
  onImportBlocked?: () => void;
  language?: string;
}) {
  // Reading a file costs a model call, so it's on the paid plans and needs an
  // account. Both refusals happen here, on the click — nothing is uploaded and
  // nothing is read to find out what we already know.
  const plan = usePlan();
  const canImport = plan.allows("import");

  /** The way in, or the upgrade card, and word to whoever opened this. */
  const refuseImport = () => {
    onImportBlocked?.();
    plan.ask("import");
  };

  const fileInput = useRef<HTMLInputElement>(null);
  // "Start from scratch" asks what it should look like before anything else.
  // The gallery is the same one the editor shows, so the choice is made
  // against real renders rather than a list of names.
  const [choosing, setChoosing] = useState(false);
  // The file is held for as long as it's being read: it's what the scan shows.
  const [reading, setReading] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  // Dragging over a child fires `dragleave` on the parent, so the state is a
  // depth count rather than a flag — otherwise the overlay flickers off the
  // moment the pointer crosses the button underneath it.
  const dragDepth = useRef(0);

  // A file dropped next to the dialog rather than on it would otherwise open
  // in the tab, throwing away whatever was on screen. While the dialog is up,
  // a missed drop does nothing at all.
  useEffect(() => {
    if (!open) return;
    const block = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", block);
    window.addEventListener("drop", block);
    return () => {
      window.removeEventListener("dragover", block);
      window.removeEventListener("drop", block);
    };
  }, [open]);

  const handleFile = async (file: File) => {
    setReading(file);
    const toastId = toast.loading("Reading your resume…", {
      description: "Our AI is pulling out your details.",
    });

    try {
      const imported = await readResumeFile(file, language);

      toast.success("Imported — check it over", {
        id: toastId,
        description: "Anything the AI misread is yours to fix.",
      });
      onImported(imported);
    } catch (err) {
      toast.error("Couldn't import that file", {
        id: toastId,
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setReading(null);
    }
  };

  /** Files only — a dragged link or selection shouldn't light the dialog up. */
  const hasFiles = (e: React.DragEvent) =>
    e.dataTransfer.types.includes("Files");

  const busy = Boolean(reading) || creating;

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (busy) return;

    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!canImport) return refuseImport();
    if (!importAccepts(file)) {
      return toast.error("Can't read that kind of file", {
        description: "A PDF, an image or a text file, please.",
      });
    }
    void handleFile(file);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (reading || creating) return;
        if (!next && choosing) {
          setChoosing(false);
          onScratchCancel?.();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        fullScreen
        className="max-w-[520px] p-7 sm:max-w-[520px]"
        // Anywhere on the dialog takes a drop, not just the button — aiming at
        // a target is the part of drag and drop people get wrong.
        onDragEnter={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => hasFiles(e) && e.preventDefault()}
        onDragLeave={() => {
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={onDrop}
      >
        {/* `pointer-events-none` matters: the overlay must not swallow the
            drop it's inviting. */}
        {dragging && !busy && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center rounded-xl bg-panel/95 p-4">
            <div className="grid h-full w-full place-items-center rounded-xl border-2 border-dashed border-brand text-center">
              <div>
                <p className="text-[28px] leading-none">📄</p>
                <p className="mt-3 text-[18px] font-bold text-ink">
                  Drop it here
                </p>
                <p className="mt-1 text-[13.5px] text-ink-soft">
                  PDF, image or text
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink max-sm:text-center">
          Add a resume
        </DialogTitle>
        <DialogDescription className="sr-only">
          Start a blank resume, or upload one to import.
        </DialogDescription>

        {/* While the AI reads the file, the choice is gone — so the dialog
            shows the page being read instead of two disabled buttons. */}
        {reading ? (
          <div className="mt-7 mb-2">
            <ImportScan file={reading} />
          </div>
        ) : (
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setChoosing(true);
                onScratchOpen?.();
              }}
              disabled={creating}
              className="flex w-full items-center gap-4 rounded-xl border border-field-border px-6 py-5 text-left text-[17px] font-bold text-ink transition hover:border-ink/30 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Spinner className="h-6 w-6 text-ink-soft" />
                  Creating your resume…
                </>
              ) : (
                <>
                  <span className="text-[24px] leading-none">📝</span>
                  Start from scratch
                </>
              )}
            </button>

            {/* The filled row: importing is the faster path, so it reads as
                the primary action rather than the alternative. */}
            <button
              type="button"
              onClick={() =>
                canImport ? fileInput.current?.click() : refuseImport()
              }
              disabled={creating}
              className="flex w-full items-center gap-4 rounded-xl bg-navy px-6 py-5 text-left text-[17px] font-bold text-white transition hover:bg-navy/90 disabled:opacity-60"
            >
              <span className="text-[24px] leading-none">📄</span>
              {plan.plan === null && !canImport
                ? "Sign in to upload"
                : "Upload a resume"}
              {/* Which formats is the one thing worth saying — it saves a
                  round trip to a rejected file. On a plan without it, the same
                  spot names the plan that has it, so the row still answers
                  "and then what?" before it's pressed. */}
              {canImport ? (
                <span className="ml-auto pl-3 text-[13.5px] font-medium text-white/55">
                  PDF, image, text
                </span>
              ) : (
                plan.plan !== null && (
                  <PlanBadge
                    plan={cheapestPlanWith("import").id}
                    className="ml-auto"
                  />
                )
              )}
            </button>

            {/* Nobody discovers a drop target that says nothing. */}
            {canImport && (
              <p className="pt-1 text-center text-[13px] text-ink-soft max-sm:hidden">
                …or drop a file anywhere on this box
              </p>
            )}
          </div>
        )}

        <input
          ref={fileInput}
          type="file"
          accept={IMPORT_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset so picking the same file twice still fires a change.
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </DialogContent>

      {/* Sits over this dialog rather than replacing it: cancelling the
          gallery leaves you back at the fork, not out of the flow. */}
      <TemplatePicker
        open={choosing}
        onOpenChange={(next) => {
          setChoosing(next);
          if (!next) onScratchCancel?.();
        }}
        selectedId={DEFAULT_SETTINGS.template}
        accent={DEFAULT_SETTINGS.accent}
        onPick={(template) => {
          setChoosing(false);
          onScratch(template);
        }}
      />
    </Dialog>
  );
}
