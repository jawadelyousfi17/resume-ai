import { StackIcon } from "@/components/ui/icons";

import { ArrowRight, Eyebrow } from "./ui";

// Export targets and formats. `tone` is the chip colour; `label` is what the
// chip carries, so the rail reads without needing third-party logos.
const FORMATS = [
  { label: "PDF", tone: "bg-danger" },
  { label: "DOCX", tone: "bg-brand" },
  { label: "TeX", tone: "bg-[#0d9488]" },
  { label: "MD", tone: "bg-navy" },
  { label: "HTML", tone: "bg-[#d97706]" },
  { label: "JSON", tone: "bg-[#7c3aed]" },
  { label: "Docs", tone: "bg-[#0ea5e9]" },
  { label: "in", tone: "bg-[#0a66c2]" },
  { label: "PNG", tone: "bg-accent-2" },
  { label: "Box", tone: "bg-[#059669]" },
  { label: "ATS", tone: "bg-[#475569]" },
  { label: "Mail", tone: "bg-[#e11d48]" },
];

function Tile({ label, tone }: { label: string; tone: string }) {
  return (
    <span className="mx-2 flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-2xl bg-panel shadow-[var(--shadow-panel)]">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-black text-white ${tone}`}
      >
        {label}
      </span>
    </span>
  );
}

/** One looping rail. The tile list is rendered twice so -50% wraps seamlessly. */
function Rail({
  items,
  reverse,
}: {
  items: typeof FORMATS;
  reverse?: boolean;
}) {
  return (
    <div className="lp-rail-mask overflow-hidden">
      <div className={`lp-rail ${reverse ? "lp-rail-reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {items.map((f) => (
              <Tile key={f.label} label={f.label} tone={f.tone} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <section className="px-5 pb-14 sm:px-8 sm:pb-16">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-3xl bg-navy py-14 shadow-[var(--shadow-panel)] sm:py-16">
        <div className="flex flex-col items-center px-6 text-center">
          <Eyebrow tone="dark" icon={<StackIcon className="h-3.5 w-3.5" />}>
            Integrations
          </Eyebrow>

          <h2 className="mt-5 text-[30px] leading-[1.15] font-extrabold tracking-tight text-white sm:text-[38px]">
            Don&apos;t rebuild. Export.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-white/55">
            We know the pain of rewriting the same resume for every portal.
            Bring yours in once, then hand it back out in whatever format the
            application asks for.
          </p>

          <a
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 border-b border-white/30 pb-0.5 text-[14px] font-bold text-white transition-colors hover:border-white"
          >
            All formats
            <ArrowRight />
          </a>
        </div>

        <div className="mt-12 space-y-4">
          <Rail items={FORMATS} />
          <Rail items={[...FORMATS].reverse()} reverse />
        </div>
      </div>
    </section>
  );
}
