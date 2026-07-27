import {
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  SparklesIcon,
} from "@/components/ui/icons";

import { h2, lede, sectionGap, shell } from "./ui";

/* -------------------------------------------------------------------------- */
/* Step visuals                                                               */
/* -------------------------------------------------------------------------- */

// A stand-in page: enough ruled lines to read as a resume at thumbnail size,
// without paying for a full <ResumePreview> four times over.
function MiniPage({
  selected,
  band,
  centered,
}: {
  selected?: boolean;
  band?: boolean;
  centered?: boolean;
}) {
  const line = (w: string, key: number) => (
    <span
      key={key}
      className="mt-1 block h-[3px] rounded-full bg-ink-faint/25"
      style={{ width: w }}
    />
  );

  return (
    <span
      className={`block aspect-[210/297] flex-1 rounded-lg bg-white p-2.5 transition ${
        selected ? "ring-2 ring-brand" : "ring-1 ring-black/8"
      }`}
    >
      <span
        className={`block ${centered ? "text-center" : ""} ${
          band ? "rounded-sm bg-brand-soft p-1.5" : ""
        }`}
      >
        <span
          className="inline-block h-[6px] rounded-full bg-ink/70"
          style={{ width: "58%" }}
        />
      </span>
      <span
        className="mt-2 block h-[4px] rounded-full bg-brand"
        style={{ width: "38%" }}
      />
      {["92%", "78%", "85%"].map((w, i) => line(w, i))}
      <span
        className="mt-2.5 block h-[4px] rounded-full bg-brand"
        style={{ width: "38%" }}
      />
      {["88%", "70%"].map((w, i) => line(w, i + 10))}
    </span>
  );
}

function ChooseTemplate() {
  return (
    <div className="flex gap-3 p-6 sm:gap-4 sm:p-8">
      <MiniPage />
      <MiniPage selected band />
      <MiniPage centered />
    </div>
  );
}

function AddContent() {
  return (
    <div className="space-y-3 p-6 sm:p-8">
      <div className="rounded-xl bg-field p-3">
        <p className="text-[10.5px] font-bold text-ink-faint uppercase">Role</p>
        <p className="mt-1 text-[13px] font-bold text-ink">
          Senior Product Designer
        </p>
      </div>
      <div className="rounded-xl bg-field p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold text-ink-faint uppercase">
            Highlights
          </p>
          <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[10px] font-bold text-brand">
            <SparklesIcon className="h-3 w-3" />
            Improve
          </span>
        </div>
        <ul className="mt-2 space-y-1.5">
          {[
            "Led the reporting redesign, cutting time-to-report to 2 min",
            "Built the design system used by 4 product teams",
          ].map((t) => (
            <li
              key={t}
              className="flex gap-1.5 text-[12px] leading-snug text-ink-soft"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Customize() {
  const swatches = ["#2563eb", "#0ea5e9", "#0d9488", "#7c3aed", "#e11d48"];
  return (
    <div className="space-y-4 p-6 sm:p-8">
      <div>
        <p className="text-[11px] font-bold text-ink">Accent colour</p>
        <div className="mt-2 flex gap-2">
          {swatches.map((c, i) => (
            <span
              key={c}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: c,
                boxShadow:
                  i === 0 ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : undefined,
              }}
            >
              {i === 0 && <CheckIcon className="h-3.5 w-3.5 text-white" />}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-ink">Section headings</p>
        <div className="mt-2 flex gap-2">
          {["Underline", "Plain", "Uppercase"].map((label, i) => (
            <span
              key={label}
              className={`flex-1 rounded-lg border px-2 py-2 text-center text-[11px] font-bold ${
                i === 0
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-field-border bg-field text-ink-soft"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-ink">Font size</p>
          <span className="text-[11px] font-bold text-ink-soft">10.5 pt</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-field">
          <div className="h-1.5 w-[45%] rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
}

function Download() {
  return (
    <div className="space-y-3 p-6 sm:p-8">
      <div className="flex items-center gap-3 rounded-xl bg-field p-3.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
          <FileTextIcon className="h-5 w-5 text-danger" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-ink">amara-diaz.pdf</p>
          <p className="text-[11px] text-ink-soft">A4 · 1 page · 148 KB</p>
        </div>
        <span className="btn-gradient inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold">
          <DownloadIcon className="h-3.5 w-3.5" />
          Download
        </span>
      </div>
      {[
        { name: "amara-diaz.tex", note: "LaTeX source" },
        { name: "amara-diaz-northwind.pdf", note: "Tailored · 2 days ago" },
      ].map((f) => (
        <div
          key={f.name}
          className="flex items-center gap-3 rounded-xl bg-field p-3"
        >
          <FileTextIcon className="h-4 w-4 shrink-0 text-ink-faint" />
          <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-ink">
            {f.name}
          </p>
          <p className="shrink-0 text-[11px] text-ink-soft">{f.note}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    title: "1. Choose a template",
    copy: "Pick one of five professionally designed templates — or bend any of them until it's yours. Switching later never touches your content.",
    visual: <ChooseTemplate />,
  },
  {
    title: "2. Add your experience",
    copy: "Fill in your resume with guidance at every field. Import an existing PDF or DOCX to start with everything already in place.",
    visual: <AddContent />,
  },
  {
    title: "3. Customize layout & design",
    copy: "Adjust type, spacing, margins and colour until the page feels like you. Full control, with the formatting kept safe underneath.",
    visual: <Customize />,
  },
  {
    title: "4. Download unlimited PDFs",
    copy: "Your draft saves automatically. Export a clean, text-based PDF — or the LaTeX source — as often as you need, watermark-free.",
    visual: <Download />,
  },
];

export function HowItWorks() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <h2 className={h2}>Create a professional resume in minutes</h2>
      <p className={lede}>
        maniacv makes it easy to write and edit your resume. Here&apos;s how it
        works:
      </p>

      <div className="mt-12 space-y-14 lg:mt-16 lg:space-y-20">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="grid grid-cols-1 items-center gap-6 md:gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-16 xl:gap-20"
          >
            <div
              // Alternating sides keeps four near-identical rows from reading as
              // a list of screenshots.
              className={`w-full max-w-[560px] overflow-hidden rounded-[26px] bg-panel shadow-[0_20px_48px_-30px_rgba(15,23,42,0.45)] ring-1 ring-black/5 ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              {step.visual}
            </div>
            <div>
              <h3 className="text-[24px] leading-none font-extrabold tracking-tight text-ink sm:text-[30px] lg:text-[36px] xl:text-[42px]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[560px] text-[16px] leading-[1.7] text-ink-soft lg:mt-5 lg:text-[19px] lg:leading-[1.75]">
                {step.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
