"use client";

// The hero: the product, working, rather than a picture of it.
//
// It plays as five acts, the way somebody actually builds a resume — type your
// details, bring in your experience, pick a template, let the AI sharpen it,
// download it — with a lower third naming the act you're watching. Each act
// hands the next one a document that is further along, so the page in the
// middle grows from a blank sheet to something finished in one continuous take.
//
// That page is the real <ResumePreview> reading real ResumeData — the same
// component the editor and the PDF use — so every edit the demo makes shows up
// the way it would for a user. The panels around it are the app's own, and the
// pointer is the same arrow the floating avatars wear further down the page.
//
// The whole thing is laid out at a fixed size and scaled to whatever width the
// hero column has, so nothing reflows between breakpoints.

import { memo, useCallback, useEffect, useRef, useState } from "react";

import { PersonalIcon } from "@/components/editor/section-icons";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { Field, Input } from "@/components/ui/fields";
import {
  CameraIcon,
  CheckIcon,
  PlusIcon,
  TranslateIcon,
} from "@/components/ui/icons";
import {
  ArticleIcon,
  DownloadIcon,
  MagicIcon,
  PencilIcon,
} from "@/components/ui/svg-icons";
import { avatarUrl } from "@/lib/avatar";
import { isTimelineSection, PAGE_SIZES } from "@/lib/defaults";
import { SECTION_TITLES, type LanguageCode } from "@/lib/i18n";
import { applyTemplate, getTemplate, TEMPLATES } from "@/lib/templates";
import type { ResumeData, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GalleryIcon } from "./duotone";
import { CursorTag } from "./marks";
import { SAMPLE_RESUME, sampleWithTemplate } from "./sample-resume";

/* -------------------------------------------------------------------------- */
/* The script                                                                 */
/* -------------------------------------------------------------------------- */

const PAPER_W = 540;
const STAGE_W = 820;
const STAGE_H = 838;

/** How long the pointer takes to reach whatever it's going to press. Shared
 *  with the cursor's own CSS transition — if the two drift apart the arrow
 *  clicks before it has arrived, or lingers after. */
const TRAVEL = 420;

/** The pause on a change of act, and the unit the whole script is paced in. */
const BEAT = 380;

/** The finished document every act is working towards. */
const FULL = SAMPLE_RESUME;

/** Where it starts: a blank sheet. Nothing in the header, no sections. */
const BLANK: ResumeData = {
  ...FULL,
  personal: {
    ...FULL.personal,
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    photo: undefined,
    links: [],
  },
  sections: [],
  settings: { ...FULL.settings },
};

type ActId = "details" | "sections" | "template" | "write" | "export";

const ACTS: { id: ActId; label: string }[] = [
  { id: "details", label: "Start with your details" },
  { id: "sections", label: "Bring in your experience" },
  { id: "template", label: "Pick a template" },
  { id: "write", label: "Let the AI sharpen it" },
  { id: "export", label: "Download and send it" },
];

type FieldKey = "fullName" | "title" | "email" | "phone";

/** Typed out one by one in the first act. Labels and placeholders are the
 *  editor's own, and the values are the sample's — so what lands in the form is
 *  exactly what appears on the page. */
const FIELDS: { key: FieldKey; label: string; placeholder: string }[] = [
  { key: "fullName", label: "Full name", placeholder: "First and last name" },
  {
    key: "title",
    label: "Professional title",
    placeholder: "Target position or current role",
  },
  { key: "email", label: "Email", placeholder: "Enter email" },
  { key: "phone", label: "Phone", placeholder: "Enter Phone" },
];

/** The second act, as four presses. Each one takes the document up to that many
 *  of the sample's sections, so the page fills from the top down. */
const SECTION_STEPS: { label: string; take: number }[] = [
  { label: "Summary", take: 1 },
  { label: "Experience", take: 2 },
  { label: "Education", take: 3 },
  { label: "Skills, languages, certificates", take: FULL.sections.length },
];

/** Distinct enough that switching between them is unmistakable. */
const LOOKS: TemplateId[] = ["atlas", "onyx", "meridian", "portrait"];

/** Rendered once, at module scope: these four never change, and re-rendering a
 *  page preview on every tick of the walk-through would be wasteful. */
const SWATCHES = LOOKS.map((id) => ({
  id,
  name: getTemplate(id).name,
  data: sampleWithTemplate(id),
}));

/** What the assistant offers in place of the first bullet. */
const REWRITES = [
  "- Cut time-to-first-report from **11 minutes to under 2** by rebuilding the reporting suite around one query",
  "- Rebuilt the reporting suite end to end, taking time-to-first-report from **11 minutes to under 2**",
  "- Took reporting from **11 minutes to under 2** — a redesign four product teams now build on",
];

const TAILORED =
  "Senior product designer who turns dense, data-heavy workflows into something calm enough to use every day.";

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

type ToolId = "rewrite" | "summary" | "translate";

/** Both icon sets are shaped the same from the outside: a component that takes
 *  a className and paints in the current colour. */
type Glyph = React.ComponentType<{ className?: string }>;

const TOOLS: { id: ToolId; label: string; Icon: Glyph }[] = [
  { id: "rewrite", label: "Improve this bullet", Icon: MagicIcon },
  { id: "summary", label: "Tailor the summary", Icon: ArticleIcon },
  { id: "translate", label: "Translate the page", Icon: TranslateIcon },
];

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

/** Where the tour ends up, and what a reader who has asked for reduced motion
 *  is shown instead of the walk-through: the finished article, in English. */
const DONE = withSummary(
  withBullet(withLook({ ...FULL }, LOOKS[0]), REWRITES[1]),
  TAILORED,
);

/* -------------------------------------------------------------------------- */
/* The demo                                                                   */
/* -------------------------------------------------------------------------- */

export function HeroDemo() {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Zero until it has been measured, which is also what "hidden" reads as.
  const [scale, setScale] = useState(0);

  const [data, setData] = useState<ResumeData>(BLANK);
  const [act, setAct] = useState<ActId>("details");
  const [typing, setTyping] = useState<FieldKey | null>(null);
  const [added, setAdded] = useState(0);
  const [look, setLook] = useState<TemplateId | null>(null);
  const [tool, setTool] = useState<ToolId | null>(null);
  const [suggestion, setSuggestion] = useState(REWRITES[0]);
  const [applied, setApplied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);

  // Where the pointer is, in stage pixels, and whether it's on screen.
  const [cursor, setCursor] = useState({ x: 640, y: 620, on: false });
  const [clicking, setClicking] = useState(false);

  // Every element the pointer can visit, by name. One map rather than a ref
  // apiece: the cast changes with the act, and the walk-through only ever
  // reaches for whatever is currently on stage.
  const marks = useRef<Record<string, HTMLElement | null>>({});

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
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 1600);
  };

  /** Everything in the header that isn't typed: the photo, the city, the
   *  links. They arrive together once the four fields are filled. */
  const finishHeader = useCallback(() => {
    setData((d) => ({
      ...d,
      personal: {
        ...d.personal,
        photo: avatarUrl(FULL.personal.fullName),
        location: FULL.personal.location,
        links: FULL.personal.links,
      },
    }));
  }, []);

  const addSections = useCallback((step: number) => {
    const { take, label } = SECTION_STEPS[step];
    setAdded(step + 1);
    setData((d) => ({
      ...d,
      sections: structuredClone(FULL.sections.slice(0, take)),
    }));
    flash(`${label} added`);
  }, []);

  /** Applies a template. The document is untouched — only its rendering. */
  const restyle = useCallback((id: TemplateId) => {
    setLook(id);
    setData((d) => withLook(d, id));
    flash(`${getTemplate(id).name} template`);
  }, []);

  // The three AI steps land the moment they're pressed. There was a staged
  // pause and a skeleton here, which is honest about what a model costs — but
  // the demo isn't the product's latency, it's the product's shape, and a
  // spinner in a hero is just time the reader spends watching nothing.
  const improve = useCallback((index: number) => {
    setTool("rewrite");
    setApplied(false);
    setSuggestion(REWRITES[index % REWRITES.length]);
  }, []);

  const replace = useCallback((bullet: string) => {
    setData((d) => withBullet(d, bullet));
    setApplied(true);
    flash("Bullet replaced");
  }, []);

  const tailor = useCallback(() => {
    setTool("summary");
    setData((d) => withSummary(d, TAILORED));
    flash("Summary tailored");
  }, []);

  const translate = useCallback(() => {
    setTool("translate");
    setData((d) => withLanguage(d, TRANSLATED));
    flash("Translated to French");
  }, []);

  /** The export, staged. The real one builds a PDF server-side; here it only
   *  needs to say that it is unlimited and unwatermarked. */
  const download = useCallback(async () => {
    setSaving(true);
    await sleep(620);
    setSaving(false);
    flash("resume.pdf — no watermark");
  }, []);

  const reset = useCallback(() => {
    setData(BLANK);
    setAct("details");
    setTyping(null);
    setAdded(0);
    setLook(null);
    setTool(null);
    setApplied(false);
    setSaving(false);
    setSuggestion(REWRITES[0]);
    setToast(null);
  }, []);

  /** What a reader who'd rather not watch anything move gets instead. */
  const settle = useCallback(() => {
    setData(DONE);
    setAct("export");
    setAdded(SECTION_STEPS.length);
    setLook(LOOKS[0]);
  }, []);

  const replay = () => {
    reset();
    setPlaying(true);
  };

  /* ---------------------------------------------------------------------- */
  /* The walk-through                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!playing) return;
    // Hidden — the phone layout drops it — so there is nothing to walk through.
    if (!scale) return;

    let live = true;
    const cancelled = () => !live;

    /** Moves the pointer onto an element and presses it. */
    const press = async (name: string, run: () => void | Promise<void>) => {
      const el = marks.current[name];
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

      await sleep(TRAVEL);
      if (cancelled()) return;
      setClicking(true);
      await sleep(110);
      if (cancelled()) return;
      setClicking(false);
      await run();
    };

    /** Types a value into the page, two characters at a time. Per character
     *  would re-render the whole document forty times a second for no visible
     *  gain — at this size the eye reads it as typing either way. */
    const write = async (key: FieldKey) => {
      const value = FULL.personal[key];
      setTyping(key);
      for (let i = 3; i < value.length; i += 3) {
        if (cancelled()) return;
        const slice = value.slice(0, i);
        setData((d) => ({ ...d, personal: { ...d.personal, [key]: slice } }));
        await sleep(30);
      }
      if (cancelled()) return;
      setData((d) => ({ ...d, personal: { ...d.personal, [key]: value } }));
      setTyping(null);
    };

    /** Moves to the next act and gives the panel a beat to settle. */
    const scene = async (id: ActId) => {
      setAct(id);
      setCursor((c) => ({ ...c, on: false }));
      await sleep(BEAT);
    };

    const loop = async () => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        settle();
        return;
      }

      while (live) {
        reset();
        await sleep(500);
        if (cancelled()) return;

        /* 1 — the details, typed into a blank page. */
        for (const field of FIELDS) {
          await press(`field:${field.key}`, () => write(field.key));
          if (cancelled()) return;
          await sleep(110);
        }
        finishHeader();
        await sleep(560);
        if (cancelled()) return;

        /* 2 — the document itself, a section at a time. */
        await scene("sections");
        if (cancelled()) return;
        for (let i = 0; i < SECTION_STEPS.length; i++) {
          await press(`section:${i}`, () => addSections(i));
          if (cancelled()) return;
          await sleep(210);
        }
        await sleep(340);

        /* 3 — the same document, wearing two different templates. */
        await scene("template");
        if (cancelled()) return;
        await press("look:2", () => restyle(LOOKS[2]));
        if (cancelled()) return;
        await sleep(620);
        await press("look:0", () => restyle(LOOKS[0]));
        if (cancelled()) return;
        await sleep(700);

        /* 4 — the writing. */
        await scene("write");
        if (cancelled()) return;
        await press("tool:rewrite", () => improve(1));
        if (cancelled()) return;
        await sleep(460);
        await press("replace", () => replace(REWRITES[1]));
        if (cancelled()) return;
        await sleep(520);
        await press("tool:summary", () => tailor());
        if (cancelled()) return;
        await sleep(620);
        await press("tool:translate", () => translate());
        if (cancelled()) return;
        await sleep(720);

        /* 5 — out the door. */
        await scene("export");
        if (cancelled()) return;
        await press("download", () => download());
        if (cancelled()) return;
        await sleep(1100);

        setCursor((c) => ({ ...c, on: false }));
        await sleep(800);
      }
    };

    void loop();
    return () => {
      live = false;
    };
  }, [
    playing,
    scale,
    reset,
    settle,
    finishHeader,
    addSections,
    restyle,
    improve,
    replace,
    tailor,
    translate,
    download,
  ]);

  /** Any hand on the controls stops the tour where it stands. */
  const takeOver = () => setPlaying(false);

  const paperH = Math.round(
    (PAPER_W * PAGE_SIZES.A4.height) / PAGE_SIZES.A4.width,
  );
  const step = ACTS.findIndex((a) => a.id === act);

  return (
    <div
      ref={shellRef}
      className="w-full"
      style={{ height: STAGE_H * scale }}
      aria-label="A resume being built in meniacv, step by step"
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
          className="absolute top-0 left-0 overflow-hidden rounded-2xl bg-white shadow-[0_34px_68px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/5"
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

        {/* The panel for whichever act is playing. The frame stays put and
            only its contents change, so the eye stays on the page. */}
        <div className="absolute top-0 right-0 flex w-[300px] flex-col rounded-2xl bg-panel p-4 shadow-[var(--shadow-panel)] ring-1 ring-black/5">
          <div
            key={act}
            className="animate-in fade-in slide-in-from-right-3 duration-200"
          >
            {act === "details" && (
              <Panel icon={PersonalIcon} title="Personal details">
                {/* The editor's own form, down to the components: <Field> and
                    <Input> from ui/fields, the photo circle beside the name,
                    the ring the field wears while it has focus. The inputs are
                    read-only because the tour is doing the typing — everything
                    else about them is what a user gets in the editor. */}
                <div className="space-y-2">
                  {FIELDS.map((field, i) => {
                    const input = (
                      <div
                        ref={(el) => {
                          marks.current[`field:${field.key}`] = el;
                        }}
                        className="min-w-0 flex-1"
                      >
                        <Field label={field.label}>
                          <Input
                            readOnly
                            value={data.personal[field.key]}
                            placeholder={field.placeholder}
                            className={cn(
                              "text-[15px] transition",
                              typing === field.key && "ring-2 ring-ink/80",
                            )}
                          />
                        </Field>
                      </div>
                    );

                    // The photo sits beside the first field, the way it sits
                    // beside the first two in the editor.
                    return i > 0 ? (
                      <div key={field.key}>{input}</div>
                    ) : (
                      <div key={field.key} className="flex items-end gap-3">
                        {input}
                        <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-field text-ink-faint">
                          {data.personal.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={data.personal.photo}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CameraIcon className="h-5 w-5" />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            )}

            {act === "sections" && (
              <Panel icon={PlusIcon} title="Add your sections">
                <div className="space-y-1.5">
                  {SECTION_STEPS.map((section, i) => {
                    const done = i < added;
                    return (
                      <button
                        key={section.label}
                        type="button"
                        ref={(el) => {
                          marks.current[`section:${i}`] = el;
                        }}
                        onClick={() => {
                          takeOver();
                          addSections(i);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13.5px] font-bold transition",
                          done
                            ? "bg-brand-soft/60 text-ink"
                            : "text-ink-soft hover:bg-black/[0.04]",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-lg transition",
                            done
                              ? "bg-brand text-white"
                              : "bg-field text-ink-faint",
                          )}
                        >
                          {done ? (
                            <CheckIcon className="h-3.5 w-3.5" />
                          ) : (
                            <PlusIcon className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span className="leading-tight">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Note>Drag them into any order you like.</Note>
              </Panel>
            )}

            {act === "template" && (
              <Panel icon={GalleryIcon} title="Choose a template">
                <div className="grid grid-cols-2 gap-2.5">
                  {SWATCHES.map((swatch, i) => (
                    <button
                      key={swatch.id}
                      type="button"
                      ref={(el) => {
                        marks.current[`look:${i}`] = el;
                      }}
                      onClick={() => {
                        takeOver();
                        restyle(swatch.id);
                      }}
                      className="group text-left"
                    >
                      <div
                        className={cn(
                          "overflow-hidden rounded-lg ring-1 transition",
                          look === swatch.id
                            ? "ring-2 ring-brand"
                            : "ring-black/10 group-hover:ring-black/25",
                        )}
                      >
                        <Swatch data={swatch.data} />
                      </div>
                      <span
                        className={cn(
                          "mt-1 block text-[12px] font-bold",
                          look === swatch.id ? "text-brand" : "text-ink-soft",
                        )}
                      >
                        {swatch.name}
                      </span>
                    </button>
                  ))}
                </div>
                <Note>{`${TEMPLATES.length} templates, and switching never touches a word you wrote.`}</Note>
              </Panel>
            )}

            {act === "write" && (
              <Panel icon={MagicIcon} title="Help me write">
                <div className="space-y-1">
                  {TOOLS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      ref={(el) => {
                        marks.current[`tool:${id}`] = el;
                      }}
                      onClick={() => {
                        takeOver();
                        if (id === "rewrite") improve(Date.now() % 3);
                        if (id === "summary") tailor();
                        if (id === "translate") translate();
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
                <Note>It writes from your resume — never from thin air.</Note>
              </Panel>
            )}

            {act === "export" && (
              <Panel icon={DownloadIcon} title="Ready to send">
                <ul className="space-y-2">
                  {[
                    "Selectable text, ATS-ready",
                    "A4 or US Letter",
                    "No watermark, ever",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2 text-[13.5px] font-bold text-ink-soft"
                    >
                      <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                      {line}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  ref={(el) => {
                    marks.current["download"] = el;
                  }}
                  onClick={() => {
                    takeOver();
                    void download();
                  }}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-[14px] font-bold text-white transition hover:bg-navy/90"
                >
                  <DownloadIcon
                    className={cn("h-5 w-5", saving && "animate-bounce")}
                  />
                  {saving ? "Building PDF…" : "Download PDF"}
                </button>
                <p className="mt-2 text-center text-[12px] font-medium text-ink-faint">
                  Unlimited downloads on the free plan
                </p>
              </Panel>
            )}
          </div>
        </div>

        {/* The rewrite, and the button that lands it on the page. It belongs to
            one act, so it arrives with it rather than sitting there empty. */}
        {act === "write" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 absolute top-[556px] left-[110px] z-20 w-[470px] overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)] ring-1 ring-black/5 duration-200">
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
              {/* Keyed on the text so a new suggestion fades in rather than
                  swapping in place — the only motion this step needs now that
                  nothing is being waited for. */}
              <p
                key={suggestion}
                className="animate-in fade-in text-[14px] leading-[1.55] text-ink duration-200"
              >
                {suggestion.replace(/^- /, "").replace(/\*\*/g, "")}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  ref={(el) => {
                    marks.current["replace"] = el;
                  }}
                  onClick={() => {
                    takeOver();
                    replace(suggestion);
                  }}
                  className="btn-gradient h-10 rounded-xl px-5 text-[13.5px] font-bold"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    takeOver();
                    improve(REWRITES.indexOf(suggestion) + 1);
                  }}
                  className="h-10 rounded-xl px-4 text-[13.5px] font-bold text-ink-soft transition hover:text-ink"
                >
                  Try another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The chapter card. It says what you're watching and nothing else —
            no rail of segments filling up, which turned the hero into a thing
            with a remaining duration rather than a thing to watch. The whole
            card is keyed on the act, so each one cuts in as a unit. */}
        <div
          key={act}
          className="animate-in fade-in slide-in-from-bottom-2 absolute top-[772px] left-0 flex items-center gap-4 duration-300"
        >
          <span className="text-[52px] leading-none font-black tracking-tighter text-ink/15 tabular-nums">
            {String(step + 1).padStart(2, "0")}
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] font-extrabold tracking-[0.14em] text-ink-faint uppercase">
              meniacv
            </span>
            <span className="text-[21px] leading-tight font-extrabold tracking-tight text-ink">
              {ACTS[step]?.label}
            </span>
          </span>
        </div>

        {/* What just happened */}
        <div
          className={cn(
            "absolute top-[716px] right-0 z-30 flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-bold whitespace-nowrap text-white shadow-lg transition",
            toast ? "opacity-100" : "translate-y-2 opacity-0",
          )}
          role="status"
        >
          <CheckIcon className="h-4 w-4 text-brand" />
          {toast ?? ""}
        </div>

        {/* Taking the controls stops the tour; this is the way back into it. */}
        {!playing && (
          <button
            type="button"
            onClick={replay}
            className="animate-in fade-in absolute top-[404px] right-0 z-30 flex h-10 items-center gap-2 rounded-xl bg-panel px-4 text-[13px] font-bold text-ink-soft shadow-[var(--shadow-panel)] ring-1 ring-black/5 transition hover:text-ink"
          >
            Replay the walk-through
          </button>
        )}

        {/* The pointer — the same arrow the hero avatars wear. */}
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-40 transition-[transform,opacity] ease-out",
            cursor.on ? "opacity-100" : "opacity-0",
          )}
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            transitionDuration: `${TRAVEL}ms`,
          }}
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

/* -------------------------------------------------------------------------- */
/* Panel furniture                                                            */
/* -------------------------------------------------------------------------- */

/** One act's panel: a title, the controls, and a line of reassurance. Fixed
 *  height so the frame doesn't jump between acts. */
function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: Glyph;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[340px] flex-col">
      <p className="flex items-center gap-2 text-[14px] font-extrabold text-ink">
        <Icon className="h-5 w-5 text-brand" />
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-[12px] leading-relaxed font-medium text-ink-faint">
      {children}
    </p>
  );
}

/**
 * A template, as a thumbnail of the real thing rather than a mockup of it.
 *
 * Cropped to the top of the page: that's where two templates differ most, and
 * a whole A4 sheet at this size is four grey smudges. The width is the grid
 * cell's — 300 panel, less 32 of padding, less the 10 gap, halved — because the
 * page has to be scaled by a number, and nothing here needs measuring.
 *
 * Memoised: these four never change, while the document beside them re-renders
 * on every tick of the walk-through.
 */
const SWATCH_W = 129;

const Swatch = memo(function Swatch({ data }: { data: ResumeData }) {
  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{ aspectRatio: "210 / 170" }}
      aria-hidden="true"
    >
      <div
        className="resume-page absolute top-0 left-0 origin-top-left"
        style={{
          width: PAGE_SIZES.A4.width,
          transform: `scale(${SWATCH_W / PAGE_SIZES.A4.width})`,
        }}
      >
        <ResumePreview data={data} />
      </div>
    </div>
  );
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
