"use client";

// Adding a job, or editing one. The same dialog either way — the only thing
// that changes is what it opens with and what the button says.

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { stageLabel, type Job, type JobStage } from "@/lib/job-board";

export type JobFormValues = {
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  notes: string;
};

const empty: JobFormValues = {
  company: "",
  role: "",
  location: "",
  salary: "",
  url: "",
  notes: "",
};

export function JobDialog({
  job,
  stage,
  onSave,
  onClose,
}: {
  /** Present when editing; absent when adding. */
  job?: Job;
  /** The column the card is being added to. */
  stage?: JobStage;
  onSave: (values: JobFormValues) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<JobFormValues>(
    job
      ? {
          company: job.company,
          role: job.role,
          location: job.location ?? "",
          salary: job.salary ?? "",
          url: job.url ?? "",
          notes: job.notes ?? "",
        }
      : empty,
  );

  const set = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => setValues((v) => ({ ...v, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.company.trim()) return;
    onSave({ ...values, company: values.company.trim() });
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent fullScreen className="max-w-[520px] p-7 sm:max-w-[520px]">
        <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink max-sm:text-center">
          {job ? "Edit application" : "Add a job"}
        </DialogTitle>
        <DialogDescription className="text-[14px] text-ink-soft">
          {job
            ? `In ${stageLabel(job.stage)}. Only the company is required.`
            : `Goes into ${stageLabel(stage ?? "saved")}. Only the company is required.`}
        </DialogDescription>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <Input
                autoFocus
                required
                value={values.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Northwind"
              />
            </Field>
            <Field label="Role">
              <Input
                value={values.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Senior Product Designer"
              />
            </Field>
            <Field label="Location">
              <Input
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Remote"
              />
            </Field>
            <Field label="Salary">
              <Input
                value={values.salary}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="$120–140k"
              />
            </Field>
          </div>

          <Field label="Link to the posting">
            <Input
              type="url"
              value={values.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="Notes">
            <Textarea
              value={values.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Who referred you, what they asked, what to follow up on…"
              className="min-h-[96px]"
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="btn-gradient h-12 flex-1 rounded-xl text-[15px] font-bold"
            >
              {job ? "Save changes" : "Add to the board"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-xl px-5 text-[15px] font-bold text-ink-soft transition hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
