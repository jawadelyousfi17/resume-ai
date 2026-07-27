// Pure renderer for the resume document.
//
// Every template goes through this one component: `lib/templates` describes
// the layout decisions — header shape, heading treatment, where dates sit, how
// tag sections column up — and the markup below reads that descriptor. One
// renderer means a change to spacing or typography lands on all of them, and
// no template can quietly drift away from the rest.
//
// All typographic sizes are em-relative to the configured base font size, so
// the whole document scales with the Customize controls. No interactivity —
// reusable for the marketing pages and for screenshotting.

import type {
  EducationSection,
  ExperienceSection,
  PageFormat,
  PersonalDetails,
  ResumeData,
  ResumeSettings,
  Section,
  SkillsSection,
  SummarySection,
} from "@/lib/types";
import {
  contactOrder,
  DEFAULT_SETTINGS,
  isTagGroupSection,
  PAGE_SIZES,
  showsDates,
} from "@/lib/defaults";
import { fontStack } from "@/lib/fonts";
import { isRtl, levelLabel } from "@/lib/i18n";
import { getTemplate, tagColumns, type Template } from "@/lib/templates";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";
/** The grey a banded heading sits on. */
const BAND = "#eceef1";
/** The hairline that divides two columns when nothing is filled in behind. */
const LINE = "#d8dce2";

/**
 * Black or white — whichever can be read on the given fill.
 *
 * A template that paints its header in the accent has no idea what the accent
 * will be: it ships as amber or mint, and the Customize panel can move it
 * anywhere. Rec. 709 luma decides, so a bright band gets ink and a dark one
 * gets paper without the template having to say.
 */
function readableOn(hex: string): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return "#ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  if ([r, g, b].some(Number.isNaN)) return "#ffffff";
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? INK : "#ffffff";
}

/**
 * The document's three ink colours.
 *
 * Defaults unless the resume overrides them: a template decides the shapes, the
 * Customize panel decides the colours. `muted` is derived from the body colour
 * rather than asked for separately — a custom ink with the stock grey beside it
 * reads as a mistake, and nobody wants to pick three greys by hand.
 */
function inks(s: ResumeSettings) {
  return {
    ink: s.headingColor ?? INK,
    body: s.textColor ?? BODY,
    muted: s.textColor ? fade(s.textColor, 0.72) : MUTED,
  };
}

/** A colour at reduced strength, as an rgba() — works on any background,
 *  which an 8-digit hex over an image would not. */
function fade(hex: string, alpha: number): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  if ([r, g, b].some(Number.isNaN)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Everything the blocks need, gathered once rather than threaded field by
 *  field through six components. */
interface Ctx {
  settings: ResumeSettings;
  template: Template;
  /** True on a dark surface — a dark rail, or a page printed dark — where
   *  every colour has to invert. */
  onDark?: boolean;
  /** True inside the narrow column, which is too tight for two of anything. */
  rail?: boolean;
}

export function ResumePreview({
  data,
  format = "A4",
}: {
  data: ResumeData;
  format?: PageFormat;
}) {
  const { personal, sections } = data;
  const minHeight = PAGE_SIZES[format].height;
  const s = data.settings ?? DEFAULT_SETTINGS;

  const isEmpty =
    !personal.fullName &&
    !personal.title &&
    !personal.email &&
    sections.length === 0;

  if (isEmpty) {
    return (
      <div
        style={{ minHeight }}
        className="flex h-full flex-col items-center justify-center px-16 text-center"
      >
        <p className="text-lg font-semibold text-ink-faint">
          Your resume preview
        </p>
        <p className="mt-2 max-w-xs text-sm text-ink-faint">
          Fill in your details on the left and watch your resume build itself
          here in real time.
        </p>
      </div>
    );
  }

  const template = getTemplate(s.template);
  // A page printed dark inverts everything on it, exactly as a dark rail does
  // — so it travels as the same flag rather than a second one.
  const darkPage = template.page === "dark";
  const ctx: Ctx = { settings: s, template, onDark: darkPage };
  const rtl = isRtl(s.language);

  const page: React.CSSProperties = {
    // The chosen typeface wins outright. Picking a template already writes its
    // preferred family into settings, so overriding again here only had the
    // effect of pinning every serif template to one stack.
    fontFamily: fontStack(s.fontFamily),
    fontSize: `${s.fontSize}pt`,
    lineHeight: s.lineHeight,
    color: darkPage ? "rgba(255,255,255,0.82)" : inks(s).body,
    // The paper: the template's own if it has one, then whatever the document
    // asks for. An image covers the sheet and sits over the colour, so a
    // photograph that doesn't quite fill the page still lands on something
    // deliberate rather than on white.
    backgroundColor: darkPage ? s.accent : s.pageColor,
    backgroundImage: s.pageImage ? `url("${s.pageImage}")` : undefined,
    backgroundSize: s.pageImage ? "cover" : undefined,
    backgroundPosition: s.pageImage ? "center" : undefined,
    backgroundRepeat: s.pageImage ? "no-repeat" : undefined,
    minHeight,
    // Right-to-left languages flip the whole document: headings, contact rows,
    // list markers and the date column all follow the text direction.
    direction: rtl ? "rtl" : undefined,
    textAlign: rtl ? "right" : undefined,
  };

  const pad = `${s.marginY}mm ${s.marginX}mm`;

  // ---- two-column layouts ------------------------------------------------
  if (template.sidebar !== "none") {
    const rail = sections.filter(
      (section) => isTagGroupSection(section) || section.type === "summary",
    );
    const main = sections.filter(
      (section) => !isTagGroupSection(section) && section.type !== "summary",
    );

    const dark = template.sidebar === "dark";
    // A ruled rail is the same two columns with nothing painted behind them —
    // a hairline on the inner edge does the dividing instead.
    const ruled = template.sidebar === "rule";
    const onRight = template.sidebarSide === "right";
    const railCtx: Ctx = { ...ctx, onDark: dark || darkPage, rail: true };
    const railPad = `${s.marginY}mm ${Math.max(s.marginX * 0.72, 8)}mm`;

    const aside = (
      <aside
        key="rail"
        style={{
          width: dark ? "34%" : ruled ? "30%" : "31%",
          backgroundColor: dark
            ? s.accent
            : ruled
              ? undefined
              : `${s.accent}14`,
          color: dark ? "rgba(255,255,255,0.86)" : undefined,
          padding: railPad,
          borderRight: ruled && !onRight ? `1px solid ${LINE}` : undefined,
          borderLeft: ruled && onRight ? `1px solid ${LINE}` : undefined,
        }}
        className="shrink-0"
      >
        {template.sidebarHeader === "inside" && (
          <Header personal={personal} ctx={railCtx} stacked />
        )}
        {rail.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            ctx={railCtx}
            index={i}
          />
        ))}
      </aside>
    );

    const column = (
      <div key="main" style={{ padding: railPad }} className="min-w-0 flex-1">
        {main.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            ctx={ctx}
            index={i}
          />
        ))}
      </div>
    );

    const columns = (
      <div className="flex flex-1 items-stretch">
        {onRight ? [column, aside] : [aside, column]}
      </div>
    );

    // A header that spans both columns sits above them; one that belongs to
    // the rail is rendered inside it, and the columns run the full height.
    if (template.sidebarHeader === "inside") {
      return (
        <div
          dir={rtl ? "rtl" : undefined}
          style={page}
          className="flex items-stretch"
        >
          {columns}
        </div>
      );
    }

    return (
      <div dir={rtl ? "rtl" : undefined} style={page} className="flex flex-col">
        <div style={{ padding: pad, paddingBottom: 0 }}>
          <Header personal={personal} ctx={ctx} />
        </div>
        {columns}
      </div>
    );
  }

  // ---- single column -----------------------------------------------------
  return (
    <div
      dir={rtl ? "rtl" : undefined}
      style={page}
      className="flex items-stretch"
    >
      {template.edgeStrip && (
        <div
          aria-hidden="true"
          style={{ width: "7%", backgroundColor: s.accent }}
          className="shrink-0"
        />
      )}

      <div className="min-w-0 flex-1">
        {/* A banded header bleeds to the page edge, so it pads itself. */}
        <div
          style={{ padding: template.headerBand ? 0 : pad, paddingBottom: 0 }}
        >
          <Header personal={personal} ctx={ctx} />
        </div>
        {/* No top padding either way: an unbanded header is padded by the
            block above it, and a banded one ends in its own margin. Letting the
            page margin apply here as well opened a hole under the band. */}
        <div style={{ padding: pad, paddingTop: 0 }}>
          {sections.map((section, i) => (
            <SectionBlock
              key={section.id}
              section={section}
              ctx={ctx}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- header

function Header({
  personal,
  ctx,
  stacked,
}: {
  personal: PersonalDetails;
  ctx: Ctx;
  /** Inside a narrow rail: everything on its own line. */
  stacked?: boolean;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { ink: INK, muted: MUTED } = inks(s);
  const centered = t.headerAlign === "center" && !stacked;

  // A band painted in the accent itself decides its own type colour; a tinted
  // one is pale by construction, so ink is always right on it.
  const solidBand = t.headerBand && t.headerBandStyle === "accent" && !stacked;
  const bandInk = solidBand ? readableOn(s.accent) : null;
  const nameColor = bandInk ?? (onDark ? "#ffffff" : INK);
  const bleedPhoto = solidBand && t.photoBleed && !!personal.photo;

  const identity = (
    <>
      <div
        className={
          t.headerInlineTitle && !stacked
            ? "flex flex-wrap items-baseline gap-x-3"
            : ""
        }
      >
        {personal.fullName && (
          <span
            style={{
              fontSize: stacked ? "1.6em" : "1.95em",
              color: nameColor,
              lineHeight: 1.08,
            }}
            className="block font-extrabold tracking-tight"
          >
            {personal.fullName}
          </span>
        )}
        {personal.title && (
          <span
            style={{
              fontSize: t.headerInlineTitle && !stacked ? "1.15em" : "1.12em",
              color: bandInk
                ? bandInk
                : onDark
                  ? "rgba(255,255,255,0.75)"
                  : t.headerBand
                    ? MUTED
                    : s.accent,
              marginTop: t.headerInlineTitle && !stacked ? 0 : "0.15em",
            }}
            className={
              t.headerInlineTitle && !stacked ? "italic" : "block font-medium"
            }
          >
            {personal.title}
          </span>
        )}
      </div>
      <ContactList
        personal={personal}
        ctx={ctx}
        stacked={stacked}
        centered={centered}
        ink={bandInk}
      />
    </>
  );

  // The bleeding photo belongs to the band, not to the name block, so it's
  // pulled out of the row the other layouts build.
  const photo = bleedPhoto ? null : (
    <Avatar personal={personal} ctx={ctx} stacked={stacked} />
  );

  const inner = stacked ? (
    <div className="mb-5">
      {photo}
      {identity}
    </div>
  ) : centered ? (
    <div className="text-center">
      {photo && <div className="flex justify-center">{photo}</div>}
      {identity}
    </div>
  ) : (
    <div className="flex items-center gap-5">
      {t.photo === "left" && photo}
      <div className="min-w-0 flex-1">{identity}</div>
      {t.photo === "right" && photo}
    </div>
  );

  const marginBottom = `${1.25 * ctx.template.density}em`;
  const bandPad = `${s.marginY * 0.8}mm ${s.marginX}mm`;

  if (t.headerBand && !stacked) {
    const body = (
      <div style={{ padding: bandPad }} className="min-w-0 flex-1">
        {inner}
      </div>
    );

    return (
      <header
        style={{
          backgroundColor: solidBand ? s.accent : `${s.accent}1f`,
          marginBottom,
        }}
        className="flex items-stretch"
      >
        {bleedPhoto && personal.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={personal.photo}
            alt=""
            aria-hidden="true"
            style={{ width: "26%", objectFit: "cover" }}
            className="shrink-0 self-stretch bg-black/10"
          />
        )}
        {body}
      </header>
    );
  }

  // A ruled box is drawn around the name block alone — the rest of the page
  // keeps its margins.
  const boxed = t.headerBox && !stacked;

  return (
    <header
      style={{
        marginBottom,
        paddingTop: t.headerRule ? "0.7em" : undefined,
        paddingBottom: t.headerRule ? "0.7em" : undefined,
        borderTop: t.headerRule ? `1px solid ${s.accent}55` : undefined,
        borderBottom: t.headerRule ? `1px solid ${s.accent}55` : undefined,
      }}
    >
      {boxed ? (
        <div
          style={{
            border: `1.4px solid ${onDark ? "rgba(255,255,255,0.6)" : INK}`,
            padding: "1.1em 1.4em",
          }}
        >
          {inner}
        </div>
      ) : (
        inner
      )}
    </header>
  );
}

function Avatar({
  personal,
  ctx,
  stacked,
}: {
  personal: PersonalDetails;
  ctx: Ctx;
  stacked?: boolean;
}) {
  const { template: t } = ctx;
  // Only a photo the person actually uploaded. A template reserving space for
  // one is a layout that adapts, not a demand — inventing a placeholder put a
  // stranger's face on somebody's resume.
  if (t.photo === "none" || !personal.photo) return null;

  const size = stacked ? "9.5em" : "6.4em";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={personal.photo}
      alt=""
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: t.photoShape === "circle" ? "50%" : "0.35em",
        objectFit: "cover",
        marginBottom: stacked ? "1.1em" : undefined,
      }}
      className="shrink-0 bg-black/5"
    />
  );
}

/** The small marks beside each contact row. Kept local and tiny so the
 *  preview stays self-contained and legible at 8pt. */
function ContactIcon({ kind, color }: { kind: string; color: string }) {
  const common = {
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { flexShrink: 0, marginTop: "0.15em" },
  };

  if (kind === "email") {
    return (
      <svg {...common}>
        <rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.4" />
        <path d="m2.4 4.4 5.6 4 5.6-4" />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg {...common}>
        <path d="M5.2 2.4 6.6 5.2 5.3 6.5a8 8 0 0 0 4.2 4.2l1.3-1.3 2.8 1.4v2.2c0 .6-.5 1.1-1.1 1A11.5 11.5 0 0 1 2 3.5c0-.6.4-1.1 1-1.1z" />
      </svg>
    );
  }
  if (kind === "location") {
    return (
      <svg {...common}>
        <path d="M8 14.2s5-4.4 5-8a5 5 0 0 0-10 0c0 3.6 5 8 5 8Z" />
        <circle cx="8" cy="6.2" r="1.8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6.6 9.4a2.8 2.8 0 0 0 4 0l2-2a2.8 2.8 0 1 0-4-4l-.7.7" />
      <path d="M9.4 6.6a2.8 2.8 0 0 0-4 0l-2 2a2.8 2.8 0 1 0 4 4l.7-.7" />
    </svg>
  );
}

function ContactList({
  personal,
  ctx,
  stacked,
  centered,
  ink,
}: {
  personal: PersonalDetails;
  ctx: Ctx;
  stacked?: boolean;
  centered?: boolean;
  /** Forced colour, where the header sits on a solid band. */
  ink?: string | null;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { muted: MUTED } = inks(s);
  const color = ink ?? (onDark ? "rgba(255,255,255,0.72)" : MUTED);

  const contacts = [
    ...contactOrder(personal)
      .map((field) => ({ kind: field, value: personal[field] }))
      .filter((c) => c.value),
    ...personal.links
      .map((l) => ({ kind: "link", value: l.url || l.label }))
      .filter((c) => c.value),
  ];

  if (contacts.length === 0) return null;

  const base: React.CSSProperties = {
    fontSize: "0.86em",
    color,
    marginTop: "0.75em",
  };

  // A rail: one per line, no icons competing for the narrow width.
  if (stacked) {
    return (
      <div style={{ ...base, marginBottom: "0.4em" }} className="space-y-1.5">
        {contacts.map((c, i) => (
          <p key={i} className="flex items-start gap-2 break-words">
            <ContactIcon kind={c.kind} color={color} />
            <span className="min-w-0 break-words">{c.value}</span>
          </p>
        ))}
      </div>
    );
  }

  // A two-column grid with icons.
  if (t.headerContacts === "grid") {
    return (
      <div
        style={base}
        className={`grid gap-x-8 gap-y-1.5 sm:grid-cols-2 ${centered ? "justify-items-center" : ""}`}
      >
        {contacts.map((c, i) => (
          <span key={i} className="flex items-start gap-2">
            <ContactIcon kind={c.kind} color={color} />
            <span className="min-w-0 break-words">{c.value}</span>
          </span>
        ))}
      </div>
    );
  }

  // One flowing row.
  return (
    <div style={base} className={centered ? "text-center" : undefined}>
      {contacts.map((c, i) => (
        <span key={i}>
          {i > 0 && (
            <span style={{ margin: "0 0.45em", color: `${s.accent}80` }}>
              •
            </span>
          )}
          {c.value}
        </span>
      ))}
    </div>
  );
}

// -------------------------------------------------------------- headings

function SectionHeading({
  children,
  ctx,
  index = 0,
}: {
  children: string;
  ctx: Ctx;
  /** Position in its column, for the templates that count sections off. */
  index?: number;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { ink: INK } = inks(s);

  // The template sets the default; the Customize control still overrides it.
  const caps = s.headingStyle === "uppercase" || t.headingCaps;
  const text = caps ? children.toUpperCase() : children;

  const type: React.CSSProperties = {
    fontSize: "1.02em",
    letterSpacing: caps ? "0.06em" : undefined,
    // A heading colour the document asks for beats the template's accent
    // headings — it was picked to be obeyed. The rule under it stays accent,
    // so the template's character survives the override.
    color: onDark
      ? "#ffffff"
      : (s.headingColor ?? (t.headingAccentRule ? s.accent : INK)),
    textAlign: t.headingAlign === "center" ? "center" : undefined,
  };

  const ruleFor = onDark
    ? "rgba(255,255,255,0.35)"
    : t.headingAccentRule
      ? s.accent
      : INK;

  // 01, 02, 03 — or the same number inside a drawn circle.
  const mark =
    t.headingNumber === "none" ? null : (
      <span
        style={{
          color: onDark ? "rgba(255,255,255,0.65)" : s.accent,
          marginInlineEnd: "0.5em",
          ...(t.headingNumber === "circle"
            ? {
                display: "inline-flex",
                width: "1.6em",
                height: "1.6em",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: `1px solid currentColor`,
                fontSize: "0.72em",
              }
            : { fontSize: "0.9em" }),
        }}
        aria-hidden="true"
      >
        {t.headingNumber === "circle"
          ? index + 1
          : String(index + 1).padStart(2, "0")}
      </span>
    );

  const label = (
    <>
      {mark}
      {text}
    </>
  );

  // Reversed out of a solid label, sized to the words rather than the column.
  if (t.headingStyle === "chip") {
    return (
      <h2 style={{ marginBottom: "0.6em", ...type, color: undefined }}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: onDark ? "rgba(255,255,255,0.15)" : INK,
            color: onDark ? "#ffffff" : "#ffffff",
            padding: "0.24em 0.75em",
            fontSize: "0.88em",
            letterSpacing: "0.08em",
          }}
          className="font-bold"
        >
          {label}
        </span>
      </h2>
    );
  }

  // A short heavy stub, the width of a word or two.
  if (t.headingStyle === "underline-short") {
    return (
      <h2 style={{ ...type, marginBottom: "0.55em" }} className="font-bold">
        {label}
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: "2.4em",
            height: "0.2em",
            marginTop: "0.3em",
            marginInline: t.headingAlign === "center" ? "auto" : undefined,
            backgroundColor: ruleFor,
          }}
        />
      </h2>
    );
  }

  // A rule above and a rule below.
  if (t.headingStyle === "rules") {
    return (
      <h2
        style={{
          ...type,
          borderTop: `1.2px solid ${ruleFor}`,
          borderBottom: `1.2px solid ${ruleFor}`,
          padding: "0.18em 0",
          marginBottom: "0.55em",
        }}
        className="font-bold"
      >
        {label}
      </h2>
    );
  }

  if (t.headingStyle === "band") {
    return (
      <h2
        style={{
          ...type,
          backgroundColor: onDark ? "rgba(255,255,255,0.12)" : BAND,
          padding: "0.3em 0.7em",
          marginBottom: "0.6em",
        }}
        className="font-bold"
      >
        {label}
      </h2>
    );
  }

  if (t.headingStyle === "plain" && s.headingStyle === "plain") {
    return (
      <h2 style={{ ...type, marginBottom: "0.45em" }} className="font-bold">
        {label}
      </h2>
    );
  }

  return (
    <h2
      style={{
        ...type,
        borderBottom: `1.2px solid ${ruleFor}`,
        paddingBottom: "0.22em",
        marginBottom: "0.55em",
      }}
      className="font-bold"
    >
      {label}
    </h2>
  );
}

function SectionBlock({
  section,
  ctx,
  index = 0,
}: {
  section: Section;
  ctx: Ctx;
  /** Position in its column. Only the numbered templates read it. */
  index?: number;
}) {
  const wrap: React.CSSProperties = {
    marginBottom: `${1.15 * ctx.template.density}em`,
  };
  const props = { ctx, wrap, index };

  switch (section.type) {
    case "summary":
      return <SummaryBlock section={section} {...props} />;
    case "experience":
    case "projects":
    case "volunteering":
      return <ExperienceBlock section={section} {...props} />;
    case "education":
    case "certifications":
    case "awards":
      return <EducationBlock section={section} {...props} />;
    case "skills":
    case "languages":
    case "interests":
      return <TagBlock section={section} {...props} />;
  }
}

// ----------------------------------------------------------------- blocks

function SummaryBlock({
  section,
  ctx,
  wrap,
  index,
}: {
  section: SummarySection;
  ctx: Ctx;
  wrap: React.CSSProperties;
  index: number;
}) {
  if (isMarkdownEmpty(section.content)) return null;

  // Some templates open on the profile rather than lead up to it: same text,
  // set at display size and in full ink, as a statement.
  const big = ctx.template.bigSummary && !ctx.rail;

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx} index={index}>
        {section.title}
      </SectionHeading>
      <MarkdownView
        md={section.content}
        style={{
          fontSize: big ? "1.5em" : "0.95em",
          lineHeight: big ? 1.3 : undefined,
          color: ctx.onDark
            ? big
              ? "#ffffff"
              : "rgba(255,255,255,0.8)"
            : big
              ? inks(ctx.settings).ink
              : inks(ctx.settings).body,
        }}
      />
    </section>
  );
}

/** The dates-and-place column, wherever the template puts it. */
function Meta({
  range,
  location,
  ctx,
  align,
}: {
  range: string;
  location: string;
  ctx: Ctx;
  align: "left" | "right";
}) {
  const { settings: s, template: t, onDark } = ctx;
  const color = onDark ? "rgba(255,255,255,0.6)" : fade(inks(s).body, 0.8);
  const style: React.CSSProperties = {
    fontSize: "0.85em",
    color,
    textAlign: align,
  };

  if (!range && !location) return null;

  if (t.dates === "right-inline") {
    return (
      <p style={style} className="shrink-0 whitespace-nowrap">
        {[range, location].filter(Boolean).join("  |  ")}
      </p>
    );
  }

  return (
    <div style={style} className={t.dates === "right" ? "shrink-0" : undefined}>
      {range && <p className="whitespace-nowrap">{range}</p>}
      {location && <p>{location}</p>}
    </div>
  );
}

function ExperienceBlock({
  section,
  ctx,
  wrap,
  index,
}: {
  section: ExperienceSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
  index: number;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { ink: INK, body: BODY, muted: MUTED } = inks(s);
  const items = section.items.filter(
    (i) => !i.hidden && (i.role || i.company || !isMarkdownEmpty(i.highlights)),
  );
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx} index={index}>
        {section.title}
      </SectionHeading>
      <div style={{ display: "grid", rowGap: `${0.7 * t.density}em` }}>
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(
                item.startDate,
                item.endDate,
                item.current,
                s.language,
                s.dateFormat,
              )
            : "";

          const heading = t.entryTitleChip ? (
            <p style={{ fontSize: "1em" }}>
              <Chip ctx={ctx}>
                {[item.role, item.company].filter(Boolean).join(", ")}
              </Chip>
            </p>
          ) : (
            <p style={{ fontSize: "1em", color: onDark ? "#fff" : INK }}>
              <span className="font-bold">{item.role}</span>
              {item.role && item.company && (
                <span
                  style={{ color: onDark ? "rgba(255,255,255,0.7)" : MUTED }}
                >
                  {", "}
                </span>
              )}
              <span
                style={{ color: onDark ? "rgba(255,255,255,0.8)" : BODY }}
                className="italic"
              >
                {item.company}
              </span>
            </p>
          );

          const body = !isMarkdownEmpty(item.highlights) && (
            <MarkdownView
              md={item.highlights}
              style={{
                fontSize: "0.95em",
                color: onDark ? "rgba(255,255,255,0.8)" : BODY,
              }}
            />
          );

          // Dates get their own column to the left of the entry.
          if (t.dates === "left-column") {
            return (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "9em 1fr",
                  columnGap: "1em",
                }}
              >
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="left"
                />
                <div className="min-w-0">
                  {heading}
                  {body}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">{heading}</div>
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="right"
                />
              </div>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EducationBlock({
  section,
  ctx,
  wrap,
  index,
}: {
  section: EducationSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
  index: number;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { ink: INK, body: BODY, muted: MUTED } = inks(s);
  const items = section.items.filter(
    (i) => !i.hidden && (i.degree || i.school),
  );
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx} index={index}>
        {section.title}
      </SectionHeading>
      <div style={{ display: "grid", rowGap: `${0.55 * t.density}em` }}>
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(
                item.startDate,
                item.endDate,
                false,
                s.language,
                s.dateFormat,
              )
            : "";

          const heading = t.entryTitleChip ? (
            <p style={{ fontSize: "1em" }}>
              <Chip ctx={ctx}>
                {[item.degree, item.school].filter(Boolean).join(", ")}
              </Chip>
            </p>
          ) : (
            <p style={{ fontSize: "1em", color: onDark ? "#fff" : INK }}>
              <span className="font-bold">{item.degree}</span>
              {item.degree && item.school && (
                <span
                  style={{ color: onDark ? "rgba(255,255,255,0.7)" : MUTED }}
                >
                  {", "}
                </span>
              )}
              <span
                style={{ color: onDark ? "rgba(255,255,255,0.8)" : BODY }}
                className="italic"
              >
                {item.school}
              </span>
            </p>
          );

          const body = !isMarkdownEmpty(item.description) && (
            <MarkdownView
              md={item.description}
              style={{
                fontSize: "0.9em",
                color: onDark ? "rgba(255,255,255,0.72)" : MUTED,
              }}
            />
          );

          if (t.dates === "left-column") {
            return (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "9em 1fr",
                  columnGap: "1em",
                }}
              >
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="left"
                />
                <div className="min-w-0">
                  {heading}
                  {body}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">{heading}</div>
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="right"
                />
              </div>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** An entry's title, reversed out of a solid block. Inline rather than a
 *  band, so a long role wraps to a second chip-width line instead of stretching
 *  the block across a column of white space. */
function Chip({ children, ctx }: { children: string; ctx: Ctx }) {
  if (!children) return null;
  return (
    <span
      style={{
        backgroundColor: ctx.onDark
          ? "rgba(255,255,255,0.16)"
          : inks(ctx.settings).ink,
        color: "#ffffff",
        padding: "0.12em 0.45em",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
      className="font-bold"
    >
      {children}
    </span>
  );
}

/** Five dots, filled to the stated level. */
function Dots({ level, ctx }: { level: number; ctx: Ctx }) {
  const { settings: s, onDark } = ctx;
  const filled = onDark ? "rgba(255,255,255,0.9)" : s.accent;
  const empty = onDark ? "rgba(255,255,255,0.25)" : "#d5d9e0";

  return (
    <span className="flex shrink-0 items-center gap-[0.3em]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: "0.45em",
            height: "0.45em",
            borderRadius: "50%",
            // A four-step scale shown on five dots: 4 fills them all.
            backgroundColor: i <= Math.round((level / 4) * 5) ? filled : empty,
          }}
        />
      ))}
    </span>
  );
}

function TagBlock({
  section,
  ctx,
  wrap,
  index,
}: {
  section: SkillsSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
  index: number;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const { body: BODY, muted: MUTED } = inks(s);
  const items = section.items.filter((i) => !i.hidden && i.name.trim());
  if (items.length === 0) return null;

  const color = onDark ? "rgba(255,255,255,0.85)" : BODY;
  const size = "0.95em";

  const inner = () => {
    // One flowing line, pipe-separated.
    if (t.tags === "inline") {
      return (
        <p style={{ fontSize: size, color }}>
          {items.map((item, i) => {
            const level = levelLabel(section.type, item.level, s.language);
            return (
              <span key={item.id}>
                {i > 0 && (
                  <span style={{ margin: "0 0.5em", color: `${s.accent}66` }}>
                    |
                  </span>
                )}
                <span className="font-medium">{item.name}</span>
                {level && <span style={{ color: MUTED }}> ({level})</span>}
              </span>
            );
          })}
        </p>
      );
    }

    // Name over a bar filled to the level. Two across in the main column, one
    // in a rail — a half-width bar reads as a broken one.
    if (t.tags === "bars") {
      const track = onDark ? "rgba(255,255,255,0.22)" : `${s.accent}26`;
      const fill = onDark ? "rgba(255,255,255,0.9)" : s.accent;
      return (
        <div
          style={{
            fontSize: size,
            color,
            display: "grid",
            gridTemplateColumns: `repeat(${ctx.rail ? 1 : 2}, minmax(0, 1fr))`,
            columnGap: "1.6em",
            rowGap: "0.6em",
          }}
        >
          {items.map((item) => (
            <div key={item.id}>
              <p className="font-medium">{item.name}</p>
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  height: "0.34em",
                  marginTop: "0.3em",
                  backgroundColor: track,
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    // A four-step scale, and an unrated skill reads as full
                    // rather than as a bar somebody forgot to finish.
                    width: `${Math.min(100, ((item.level ?? 4) / 4) * 100)}%`,
                    backgroundColor: fill,
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Name on the left, a proficiency meter on the right.
    if (t.tags === "dots") {
      return (
        <div
          style={{
            fontSize: size,
            color,
            display: "grid",
            // One per row in a rail: half of a narrow column is not enough for
            // a name and five dots, and they were overprinting each other.
            gridTemplateColumns: ctx.rail
              ? "minmax(0, 1fr)"
              : "repeat(2, minmax(0, 1fr))",
            columnGap: "2.5em",
            rowGap: "0.35em",
          }}
        >
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="min-w-0">{item.name}</span>
              <Dots level={item.level ?? 3} ctx={ctx} />
            </span>
          ))}
        </div>
      );
    }

    // Bulleted columns.
    const cols = tagColumns(t.tags);
    return (
      <ul
        style={{
          fontSize: size,
          color,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          columnGap: "1.5em",
          rowGap: "0.3em",
        }}
      >
        {items.map((item) => {
          const level = levelLabel(section.type, item.level, s.language);
          return (
            <li key={item.id} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                style={{
                  marginTop: "0.55em",
                  width: "0.28em",
                  height: "0.28em",
                  borderRadius: "50%",
                  backgroundColor: onDark ? "rgba(255,255,255,0.6)" : "#9ca3af",
                }}
                className="shrink-0"
              />
              <span className="min-w-0">
                {item.name}
                {level && (
                  <span
                    style={{ color: onDark ? "rgba(255,255,255,0.6)" : MUTED }}
                  >
                    {" "}
                    ({level})
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx} index={index}>
        {section.title}
      </SectionHeading>
      {inner()}
    </section>
  );
}
