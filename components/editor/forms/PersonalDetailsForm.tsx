"use client";

import { useRef, useState } from "react";
import { useResume } from "@/lib/store";
import { contactOrder } from "@/lib/defaults";
import { NudgeButtons } from "../NudgeButtons";
import { Field, Input, Label } from "@/components/ui/fields";
import { CameraIcon, ChevronUpDownIcon } from "@/components/ui/icons";
import { PlusIcon, CloseIcon as XIcon } from "@/components/ui/svg-icons";
import { Spinner } from "@/components/ui/spinner";
import { removePhoto, uploadPhoto } from "@/lib/upload-image";
import type { ContactField, ContactLink } from "@/lib/types";

const LINK_PRESETS = ["LinkedIn", "Website", "GitHub", "Twitter", "Portfolio"];

const CONTACT_ROWS: Record<
  ContactField,
  { label: string; placeholder: string; type?: string }
> = {
  email: { label: "Email", placeholder: "Enter email", type: "email" },
  phone: { label: "Phone", placeholder: "Enter Phone" },
  location: { label: "Location", placeholder: "City, Country" },
};

export function PersonalDetailsForm() {
  const { data, update, guest } = useResume();
  const { personal } = data;
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof personal>(
    key: K,
    value: (typeof personal)[K],
  ) => update((d) => void (d.personal[key] = value));

  const order = contactOrder(personal);

  /** Moves `field` into the slot currently occupied by `target`. */
  const moveTo = (field: ContactField, target: ContactField) => {
    if (field === target) return;
    update((d) => {
      const next = contactOrder(d.personal);
      const from = next.indexOf(field);
      const to = next.indexOf(target);
      if (from < 0 || to < 0) return;
      next.splice(from, 1);
      next.splice(to, 0, field);
      d.personal.contactOrder = next;
    });
  };

  /** One slot up (-1) or down (+1) — keyboard equivalent of a drag. */
  const nudge = (field: ContactField, delta: number) => {
    const target = order[order.indexOf(field) + delta];
    if (target) moveTo(field, target);
  };

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const onPhoto = async (file: File) => {
    setPhotoError(null);
    setPhotoBusy(true);
    const previous = personal.photo;
    try {
      set("photo", await uploadPhoto(file, { guest }));
      // Only once the new one is in place, so a failed upload leaves the old
      // photo on the resume rather than nothing.
      void removePhoto(previous);
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : "That photo couldn't be added.",
      );
    } finally {
      setPhotoBusy(false);
    }
  };

  const clearPhoto = () => {
    const previous = personal.photo;
    set("photo", undefined);
    setPhotoError(null);
    void removePhoto(previous);
  };

  const addLink = (label: string) => {
    const link: ContactLink = { id: crypto.randomUUID(), label, url: "" };
    update((d) => void d.personal.links.push(link));
  };

  const updateLink = (id: string, patch: Partial<ContactLink>) =>
    update((d) => {
      const link = d.personal.links.find((l) => l.id === id);
      if (link) Object.assign(link, patch);
    });

  const removeLink = (id: string) =>
    update((d) => {
      d.personal.links = d.personal.links.filter((l) => l.id !== id);
    });

  const [dragField, setDragField] = useState<ContactField | null>(null);

  const usedLabels = new Set(personal.links.map((l) => l.label));
  const availablePresets = LINK_PRESETS.filter((p) => !usedLabels.has(p));

  return (
    // Groups (identity, contacts, links, add-details) sit further apart than
    // the fields within each group.
    <div className="space-y-10">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Field label="Full name">
            <Input
              value={personal.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Enter your title, first- and last name"
            />
          </Field>
          <Field label="Professional title">
            <Input
              value={personal.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Target position or current role"
            />
          </Field>
        </div>

        {/* 117px squares up with the two fields beside it: each is a 21px
            label + 8px gap + 50px input (158), plus the 8px gap between
            them, less this column's own label (29) and Remove row (20). */}
        <div className="flex shrink-0 flex-col">
          <Label>Photo</Label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoBusy}
            className="group relative flex h-[117px] w-[117px] items-center justify-center overflow-hidden rounded-full bg-field text-ink-faint transition hover:bg-field/70"
          >
            {photoBusy ? (
              <Spinner className="h-6 w-6" />
            ) : personal.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={personal.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <CameraIcon className="h-9 w-9" />
            )}
          </button>
          {/* Row is reserved either way so the circle doesn't resize on upload. */}
          <span className="mt-1 block min-h-4 w-[117px] text-center text-[11px] font-medium leading-4 text-danger">
            {photoError ? (
              <span className="block leading-4">{photoError}</span>
            ) : (
              personal.photo && (
                <button type="button" onClick={clearPhoto}>
                  Remove
                </button>
              )
            )}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onPhoto(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {order.map((field) => {
          const row = CONTACT_ROWS[field];
          return (
            <div
              key={field}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => dragField && moveTo(dragField, field)}
              onDrop={(e) => {
                e.preventDefault();
                setDragField(null);
              }}
              className={`flex items-end gap-2 ${
                dragField === field ? "opacity-50" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <Field label={row.label}>
                  <Input
                    type={row.type}
                    value={personal[field]}
                    onChange={(e) => set(field, e.target.value)}
                    placeholder={row.placeholder}
                  />
                </Field>
              </div>
              <button
                type="button"
                draggable
                onDragStart={() => setDragField(field)}
                onDragEnd={() => setDragField(null)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    nudge(field, e.key === "ArrowUp" ? -1 : 1);
                  }
                }}
                className="mb-1 hidden h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-ink active:cursor-grabbing md:inline-flex"
                aria-label={`Reorder ${row.label}`}
                title="Drag to reorder, or press ↑ / ↓"
              >
                <ChevronUpDownIcon className="h-[18px] w-[18px]" />
              </button>

              <NudgeButtons
                onNudge={(delta) => nudge(field, delta)}
                label={row.label}
                className="mb-1"
              />
            </div>
          );
        })}
      </div>

      {personal.links.length > 0 && (
        <div className="space-y-2.5">
          {personal.links.map((link) => (
            <div key={link.id} className="flex items-end gap-2">
              <div className="w-32 shrink-0">
                <Input
                  value={link.label}
                  onChange={(e) =>
                    updateLink(link.id, { label: e.target.value })
                  }
                  placeholder="Label"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="mb-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger"
                aria-label="Remove link"
              >
                <XIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="mb-2 text-[13px] font-bold text-ink">Add details</p>
        <div className="flex flex-wrap gap-2">
          {availablePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addLink(preset)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-field px-3 py-2 text-[13px] font-medium text-ink-soft transition hover:bg-field/60 hover:text-ink"
            >
              <PlusIcon className="h-4 w-4" />
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
