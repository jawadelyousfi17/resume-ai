"use client";

// The hero: the product, working, rather than a picture of it.
//
// The page in the middle is the real <ResumePreview> reading real ResumeData —
// the same component the editor and the PDF use — so every edit the demo makes
// shows up the way it would for a user. The cards around it are the app's own
// panels, and the pointer is the same arrow the floating avatars wear further
// down the page.
//
// The whole thing is laid out at a fixed size and scaled to whatever width the
// hero column has, so nothing reflows between breakpoints.

import { useCallback, useEffect, useRef, useState } from "react";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { CheckIcon, TranslateIcon } from "@/components/ui/icons";
import {
  ArticleIcon,
  DownloadIcon,
  IdCardIcon,
  MagicIcon,
  PencilIcon,
} from "@/components/ui/svg-icons";
import { avatarUrl } from "@/lib/avatar";
import { isTimelineSection, PAGE_SIZES } from "@/lib/defaults";
import { SECTION_TITLES, type LanguageCode } from "@/lib/i18n";
import { applyTemplate, getTemplate } from "@/lib/templates";
import type { ResumeData, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GalleryIcon } from "./duotone";
import { CursorTag } from "./marks";
import { sampleWithTemplate } from "./sample-resume";

/* -------------------------------------------------------------------------- */
/* The script                                                                 */
/* -------------------------------------------------------------------------- */

const PAPER_W = 540;
const STAGE_W = 820;
const STAGE_H = 1090;

/** What the assistant offers in place of the first bullet. */
const REWRITES = [
  "- Cut time-to-first-report from **11 minutes to under 2** by rebuilding the reporting suite around one query",
  "- Rebuilt the reporting suite end to end, taking time-to-first-report from **11 minutes to under 2**",
  "- Took reporting from **11 minutes to under 2** — a redesign four product teams now build on",
];

const AVATARS = ["Amara Diaz", "Amara D.", "A. Diaz"];

/** Distinct enough that switching between them is unmistakable. */
const LOOKS: TemplateId[] = ["atlas", "onyx", "meridian", "portrait"];

/** One translation is enough to make the point; the app ships ten. */
const TRANSLATED: LanguageCode = "fr";

/** What the translated page reads as. The real feature sends the document
 *  through the model; the hero only has to show what comes back. */
const FRENCH = {
  summary:
    "Designer produit senior : je transforme des flux de données complexes en interfaces claires, utilisables au quotidien.",
  bullet:
    "- Réduit le délai du premier rapport de **11 minutes à moins de 2** en refondant l'outil de reporting",
};

type ToolId =
  "rewrite" | "summary" | "template" | "translate" | "avatar" | "download";

const TOOLS: { id: ToolId; label: string; Icon: typeof MagicIcon }[] = [
  { id: "rewrite", label: "Improve this bullet", Icon: MagicIcon },
  { id: "summary", label: "Tailor the summary", Icon: ArticleIcon },
  { id: "template", label: "Change template", Icon: GalleryIcon },
  { id: "translate", label: "Translate the page", Icon: TranslateIcon },
  { id: "avatar", label: "New avatar", Icon: IdCardIcon },
];

const TAILORED =
  "Senior product designer who turns dense, data-heavy workflows into something calm enough to use every day.";

/** Swaps the first highlight of the first job. */
function withBullet(data: ResumeData, bullet: string): ResumeData {
  const next = structuredClone(data);
  const section = next.sections.find(isTimelineSection);
  const item = section?.items[0];
  if (item) {
    const lines = item.highlights.split("\n");
    lines[0] = bullet;
    item.highlights = lines.join("\n");
  }
  return next;
}

function withSummary(data: ResumeData, content: string): ResumeData {
  const next = structuredClone(data);
  const section = next.sections.find((s) => s.type === "summary");
  if (section?.type === "summary") section.content = content;
  return next;
}

function withPhoto(data: ResumeData, seed: string): ResumeData {
  const next = structuredClone(data);
  next.personal.photo = avatarUrl(seed);
  return next;
}

/** The same document, re-rendered by another template. */
function withLook(data: ResumeData, id: TemplateId): ResumeData {
  const next = structuredClone(data);
  applyTemplate(next.settings, getTemplate(id));
  return next;
}

/** Switching language re-titles every heading the user hasn't renamed —
 *  exactly what the Customize panel does. */
function withLanguage(data: ResumeData, code: LanguageCode): ResumeData {
  const next = structuredClone(data);
  next.settings.language = code;
  // The sample's headings are all stock, so every one of them moves — which is
  // the point of the step. In the editor a heading someone typed themselves is
  // left alone; `isDefaultTitle` is what decides that.
  for (const section of next.sections) {
    section.title = SECTION_TITLES[code][section.type];
  }
  return withBullet(withSummary(next, FRENCH.summary), FRENCH.bullet);
}

/* -------------------------------------------------------------------------- */
/* The demo                                                                   */
/* -------------------------------------------------------------------------- */

const BASE = sampleWithTemplate("atlas");

export function HeroDemo() {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Zero until it has been measured, which is also what "hidden" reads as.
  const [scale, setScale] = useState(0);

  const [data, setData] = useState<ResumeData>(BASE);
  const [tool, setTool] = useState<ToolId | null>(null);
  const [suggestion, setSuggestion] = useState(REWRITES[0]);
  const [thinking, setThinking] = useState(false);
  const [applied, setApplied] = useState(false);
  const [, setLook] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);

  // Where the pointer is, in stage pixels, and whether it's on screen.
  const [cursor, setCursor] = useState({ x: 640, y: 760, on: false });
  const [clicking, setClicking] = useState(false);

  const toolRefs = useRef<Record<ToolId, HTMLButtonElement | null>>({
    rewrite: null,
    summary: null,
    template: null,
    translate: null,
    avatar: null,
    download: null,
  });
  const replaceRef = useRef<HTMLButtonElement>(null);
  const downloadRef = useRef<HTMLButtonElement>(null);

  /* The stage is drawn at one size and scaled to the column it lands in. */
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const fit = () => setScale(Math.min(1, shell.clientWidth / STAGE_W));
    const ro = new ResizeObserver(fit);
    ro.observe(shell);
    fit();
    return () => ro.disconnect();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Actions — each one is also a real button, so the demo can be taken over */
  /* ---------------------------------------------------------------------- */

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 2200);
  };

  const improve = useCallback(async (index: number) => {
    setTool("rewrite");
    setApplied(false);
    setThinking(true);
    await sleep(900);
    setSuggestion(REWRITES[index % REWRITES.length]);
    setThinking(false);
  }, []);

  const replace = useCallback((bullet: string) => {
    setData((d) => withBullet(d, bullet));
    setApplied(true);
    flash("Bullet replaced");
  }, []);

  const tailor = useCallback(async () => {
    setTool("summary");
    setThinking(true);
    await sleep(900);
    setThinking(false);
    setData((d) => withSummary(d, TAILORED));
    flash("Summary tailored");
  }, []);

  /** Cycles the template. The document is untouched — only its rendering. */
  const restyle = useCallback(() => {
    setTool("template");
    setLook((i) => {
      const next = (i + 1) % LOOKS.length;
      setData((d) => withLook(d, LOOKS[next]));
      flash(`${getTemplate(LOOKS[next]).name} template`);
      return next;
    });
  }, []);

  const translate = useCallback(async () => {
    setTool("translate");
    setThinking(true);
    await sleep(1000);
    setThinking(false);
    setData((d) => withLanguage(d, TRANSLATED));
    flash("Translated to French");
  }, []);

  /** The export, staged. The real one builds a PDF server-side; here it only
   *  needs to say that it is unlimited and unwatermarked. */
  const download = useCallback(async () => {
    setTool("download");
    setSaving(true);
    await sleep(1100);
    setSaving(false);
    flash("resume.pdf — no watermark");
  }, []);

  const reface = useCallback((index: number) => {
    setTool("avatar");
    setData((d) => withPhoto(d, AVATARS[index % AVATARS.length]));
    flash("New avatar");
  }, []);

  const reset = useCallback(() => {
    setData(BASE);
    setTool(null);
    setThinking(false);
    setApplied(false);
    setSaving(false);
    setLook(0);
    setSuggestion(REWRITES[0]);
    setToast(null);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* The walk-through                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!playing) return;
    // Hidden — the phone layout drops it — so there is nothing to walk through.
    if (!scale) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let live = true;
    const cancelled = () => !live;

    /** Moves the pointer onto an element and presses it. */
    const press = async (
      ref: React.RefObject<HTMLElement | null>,
      run: () => void | Promise<void>,
    ) => {
      const el = ref.current;
      const stage = stageRef.current;
      if (!el || !stage) return;

      const box = el.getBoundingClientRect();
      const frame = stage.getBoundingClientRect();
      const s = frame.width / STAGE_W;
      setCursor({
        x: (box.left - frame.left + box.width * 0.4) / s,
        y: (box.top - frame.top + box.height * 0.55) / s,
        on: true,
      });

      await sleep(820);
      if (cancelled()) return;
      setClicking(true);
      await sleep(160);
      if (cancelled()) return;
      setClicking(false);
      await run();
    };

    const toolRef = (id: ToolId) => ({ current: toolRefs.current[id] });

    const loop = async () => {
      while (live) {
        reset();
        await sleep(1100);
        if (cancelled()) return;

        await press(toolRef("rewrite"), () => improve(1));
        if (cancelled()) return;
        await sleep(1150);

        await press(replaceRef, () => replace(REWRITES[1]));
        if (cancelled()) return;
        await sleep(1250);

        await press(toolRef("summary"), () => tailor());
        if (cancelled()) return;
        await sleep(1500);

        await press(toolRef("template"), () => restyle());
        if (cancelled()) return;
        await sleep(1500);

        await press(toolRef("translate"), () => translate());
        if (cancelled()) return;
        await sleep(1700);

        await press(toolRef("avatar"), () => reface(1));
        if (cancelled()) return;
        await sleep(1400);

        await press(downloadRef, () => download());
        if (cancelled()) return;
        await sleep(1900);

        setCursor((c) => ({ ...c, on: false }));
        await sleep(1600);
      }
    };

    void loop();
    return () => {
      live = false;
    };
  }, [
    playing,
    scale,
    improve,
    replace,
    tailor,
    restyle,
    translate,
    reface,
    download,
    reset,
  ]);

  const paperH = Math.round(
    (PAPER_W * PAGE_SIZES.A4.height) / PAGE_SIZES.A4.width,
  );

  return (
    <div
      ref={shellRef}
      className="w-full"
      style={{ height: STAGE_H * scale }}
      aria-label="A resume being edited in maniacv"
    >
      <div
        ref={stageRef}
        className="relative origin-top-left"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
        }}
      >
        {/* The page */}
        <div
          className="absolute top-[62px] left-0 overflow-hidden rounded-2xl bg-white shadow-[0_34px_68px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/5"
          style={{ width: PAPER_W, height: paperH }}
        >
          <div
            className="resume-page absolute top-0 left-0 origin-top-left"
            style={{
              width: PAGE_SIZES.A4.width,
              transform: `scale(${PAPER_W / PAGE_SIZES.A4.width})`,
            }}
          >
            <ResumePreview data={data} />
          </div>
        </div>

        {/* Everything the editor can do to the page, in one panel */}
        <div className="absolute top-0 right-0 w-[300px] rounded-2xl bg-panel p-4 shadow-[var(--shadow-panel)] ring-1 ring-black/5">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-ink">
            <MagicIcon className="h-5 w-5 text-brand" />
            Help me write
          </p>

          <div className="mt-3 space-y-1">
            {TOOLS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                ref={(el) => {
                  toolRefs.current[id] = el;
                }}
                onClick={() => {
                  setPlaying(false);
                  if (id === "rewrite") void improve(Date.now() % 3);
                  if (id === "summary") void tailor();
                  if (id === "template") restyle();
                  if (id === "translate") void translate();
                  if (id === "avatar") reface(Date.now() % 3);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[14px] font-bold transition",
                  tool === id
                    ? "bg-brand-soft text-brand"
                    : "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* The one thing that isn't writing: getting the page out. */}
          <button
            type="button"
            ref={(el) => {
              downloadRef.current = el;
              toolRefs.current.download = el;
            }}
            onClick={() => {
              setPlaying(false);
              void download();
            }}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-[14px] font-bold text-white transition hover:bg-navy/90"
          >
            <DownloadIcon
              className={cn("h-5 w-5", saving && "animate-bounce")}
            />
            {saving ? "Building PDF…" : "Download PDF"}
          </button>
          <p className="mt-2 text-center text-[12px] font-medium text-ink-faint">
            Unlimited, no watermark
          </p>
        </div>

        {/* The rewrite, and the button that lands it on the page */}
        <div className="absolute top-[790px] left-[130px] w-[460px] overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3">
            <PencilIcon className="h-[18px] w-[18px] text-brand" />
            <span className="text-[13.5px] font-extrabold text-ink">
              Suggested bullet
            </span>
            {applied && (
              <span className="ml-auto flex items-center gap-1 text-[12px] font-bold text-brand">
                <CheckIcon className="h-3.5 w-3.5" />
                Applied
              </span>
            )}
          </div>

          <div className="px-4 py-4">
            {thinking ? (
              <div className="space-y-2" aria-hidden="true">
                <span className="block h-3 w-full animate-pulse rounded-full bg-field" />
                <span className="block h-3 w-[86%] animate-pulse rounded-full bg-field" />
                <span className="block h-3 w-[62%] animate-pulse rounded-full bg-field" />
              </div>
            ) : (
              <p className="text-[14px] leading-[1.55] text-ink">
                {suggestion.replace(/^- /, "").replace(/\*\*/g, "")}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                ref={replaceRef}
                onClick={() => {
                  setPlaying(false);
                  replace(suggestion);
                }}
                className="btn-gradient h-10 rounded-xl px-5 text-[13.5px] font-bold"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  void improve(REWRITES.indexOf(suggestion) + 1);
                }}
                className="h-10 rounded-xl px-4 text-[13.5px] font-bold text-ink-soft transition hover:text-ink"
              >
                Try another
              </button>
            </div>
          </div>
        </div>

        {/* What just happened */}
        <div
          className={cn(
            "absolute top-[10px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition",
            toast ? "opacity-100" : "-translate-y-2 opacity-0",
          )}
          role="status"
        >
          <CheckIcon className="h-4 w-4 text-brand" />
          {toast ?? ""}
        </div>

        {/* The pointer — the same arrow the hero avatars wear. */}
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-40 transition-[transform,opacity] duration-[820ms] ease-out",
            cursor.on ? "opacity-100" : "opacity-0",
          )}
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          aria-hidden="true"
        >
          <CursorTag className="h-7 w-6 text-ink drop-shadow-[0_2px_3px_rgba(15,23,42,0.35)]" />
          {clicking && (
            <span className="absolute -top-1 -left-1 h-8 w-8 animate-ping rounded-full bg-brand/30" />
          )}
        </div>
      </div>
    </div>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
