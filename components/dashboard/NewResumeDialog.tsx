"use client";

// The fork in the road when you add a resume: type it yourself, or hand over
// one you already have and let the AI read it in.

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { ResumeData } from "@/lib/types";

/** What the browser will offer in its file picker. Word documents are absent
 *  on purpose — nothing here can read one, and the API says so plainly. */
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.txt,.md";

export function NewResumeDialog({
  open,
  onOpenChange,
  creating = false,
  onScratch,
  onImported,
  canImport = true,
  onImportBlocked,
  /** The resume's language, so extracted headings come out in it. */
  language,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** True while the resume is being written and its editor opened. */
  creating?: boolean;
  onScratch: () => void;
  onImported: (resume: { name: string; data: ResumeData }) => void;
  /** False for guests — reading a file costs a model call, so it needs an
   *  account. The card then offers to sign in rather than failing a request. */
  canImport?: boolean;
  onImportBlocked?: () => void;
  language?: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);

  const handleFile = async (file: File) => {
    setReading(true);
    const toastId = toast.loading("Reading your resume…", {
      description: "Our AI is pulling out your details.",
    });

    try {
      const form = new FormData();
      form.set("file", file);
      if (language) form.set("language", language);

      const res = await fetch("/api/import", { method: "POST", body: form });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        name?: string;
        data?: ResumeData;
      };

      if (!res.ok || !payload.data) {
        throw new Error(payload.error || `Server error ${res.status}`);
      }

      toast.success("Imported — check it over", {
        id: toastId,
        description: "Anything the AI misread is yours to fix.",
      });
      onImported({
        name: payload.name ?? "Imported Resume",
        data: payload.data,
      });
    } catch (err) {
      toast.error("Couldn't import that file", {
        id: toastId,
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setReading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !reading && !creating && onOpenChange(next)}
    >
      <DialogContent fullScreen className="max-w-[520px] p-7 sm:max-w-[520px]">
        <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink max-sm:text-center">
          Add a resume
        </DialogTitle>
        <DialogDescription className="sr-only">
          Start a blank resume, or upload one to import.
        </DialogDescription>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={onScratch}
            disabled={reading || creating}
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

          {/* The filled row: importing is the faster path, so it reads as the
              primary action rather than the alternative. */}
          <button
            type="button"
            onClick={() =>
              canImport ? fileInput.current?.click() : onImportBlocked?.()
            }
            disabled={reading || creating}
            className="flex w-full items-center gap-4 rounded-xl bg-navy px-6 py-5 text-left text-[17px] font-bold text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            <span
              className={`text-[24px] leading-none ${reading ? "animate-pulse" : ""}`}
            >
              {reading ? "✨" : "📄"}
            </span>
            {reading
              ? "Reading…"
              : canImport
                ? "Upload a resume"
                : "Sign in to upload"}
            {/* Which formats is the one thing worth saying — it saves a
                round trip to a rejected file. */}
            {!reading && canImport && (
              <span className="ml-auto pl-3 text-[13.5px] font-medium text-white/55">
                PDF, image, text
              </span>
            )}
          </button>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset so picking the same file twice still fires a change.
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
