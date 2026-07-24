"use client";

import { useResume } from "@/lib/store";
import type { EditorTab } from "./TopBar";

export function OverviewPanel({ onTab }: { onTab: (t: EditorTab) => void }) {
  const { data } = useResume();
  const { personal, sections } = data;

  const rows = [
    {
      label: "Personal details",
      value: personal.fullName || "Not added yet",
      ok: Boolean(personal.fullName && personal.email),
    },
    ...sections.map((s) => ({
      label: s.title,
      value:
        s.type === "summary"
          ? s.content
            ? "Written"
            : "Empty"
          : s.type === "skills"
            ? `${s.groups.reduce((n, g) => n + g.skills.length, 0)} skills`
            : `${s.items.length} ${s.items.length === 1 ? "entry" : "entries"}`,
      ok: true,
    })),
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-panel p-6 shadow-[var(--shadow-panel)]">
        <h2 className="text-xl font-extrabold text-ink">Overview</h2>
        <p className="mt-1 text-[14px] text-ink-soft">
          A quick snapshot of what your resume contains.
        </p>

        <div className="mt-4 divide-y divide-black/5">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    row.ok ? "bg-emerald-500" : "bg-ink-faint/50"
                  }`}
                />
                <span className="text-[15px] font-semibold text-ink">
                  {row.label}
                </span>
              </div>
              <span className="text-[13px] text-ink-soft">{row.value}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onTab("content")}
          className="btn-gradient mt-4 w-full rounded-xl py-3 text-[15px] font-bold transition hover:brightness-[1.03]"
        >
          Edit content
        </button>
      </div>
    </div>
  );
}
