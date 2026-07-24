"use client";

import { WandIcon, SparklesIcon } from "@/components/ui/icons";

export function StubPanel({ kind }: { kind: "customize" | "ai" }) {
  const config =
    kind === "customize"
      ? {
          icon: <WandIcon className="h-6 w-6" />,
          title: "Customize",
          body: "Templates, fonts, colors, spacing, and layout controls land here next. Your content is safe — this only changes how the resume looks.",
        }
      : {
          icon: <SparklesIcon className="h-6 w-6" />,
          title: "AI Tools",
          body: "Rewrite bullet points, generate a summary, and tailor your resume to a job description — powered by Claude. Coming in the next pass.",
        };

  return (
    <div className="rounded-2xl bg-panel p-8 text-center shadow-[var(--shadow-panel)]">
      <div className="mx-auto flex items-center justify-center text-purple">
        {config.icon}
      </div>
      <h2 className="mt-4 text-xl font-extrabold text-ink">{config.title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">
        {config.body}
      </p>
      <span className="mt-4 inline-block rounded-full bg-cream px-3 py-1 text-[12px] font-bold text-ink-soft">
        Coming soon
      </span>
    </div>
  );
}
