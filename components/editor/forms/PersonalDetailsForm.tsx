"use client";

import { useRef } from "react";
import { useResume } from "@/lib/store";
import { Field, Input, Label } from "@/components/ui/fields";
import { CameraIcon, PlusIcon, XIcon } from "@/components/ui/icons";
import type { ContactLink } from "@/lib/types";

const LINK_PRESETS = ["LinkedIn", "Website", "GitHub", "Twitter", "Portfolio"];

export function PersonalDetailsForm() {
  const { data, update } = useResume();
  const { personal } = data;
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof personal>(
    key: K,
    value: (typeof personal)[K],
  ) => update((d) => void (d.personal[key] = value));

  const onPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => set("photo", reader.result as string);
    reader.readAsDataURL(file);
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

  const usedLabels = new Set(personal.links.map((l) => l.label));
  const availablePresets = LINK_PRESETS.filter((p) => !usedLabels.has(p));

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
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

        <div className="shrink-0">
          <Label>Photo</Label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-field text-ink-faint transition hover:bg-field/70"
          >
            {personal.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={personal.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <CameraIcon className="h-7 w-7" />
            )}
          </button>
          {personal.photo && (
            <button
              type="button"
              onClick={() => set("photo", undefined)}
              className="mt-1 block w-[92px] text-center text-[11px] font-medium text-danger"
            >
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPhoto(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <Field label="Email">
        <Input
          type="email"
          value={personal.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="Enter email"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <Input
            value={personal.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Enter Phone"
          />
        </Field>
        <Field label="Location">
          <Input
            value={personal.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City, Country"
          />
        </Field>
      </div>

      {personal.links.length > 0 && (
        <div className="space-y-2.5">
          {personal.links.map((link) => (
            <div key={link.id} className="flex items-end gap-2">
              <div className="w-32 shrink-0">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(link.id, { label: e.target.value })}
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
