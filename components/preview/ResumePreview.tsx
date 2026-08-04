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
import type { IconKind } from "@/lib/types";
import {
  contactOrder,
  DEFAULT_SETTINGS,
  isTagGroupSection,
  PAGE_SIZES,
  showsDates,
  TAG_SEPARATORS,
} from "@/lib/defaults";
import { fontStack } from "@/lib/fonts";
import { isRtl, levelLabel } from "@/lib/i18n";
import { getTemplate, tagColumns, type Template } from "@/lib/templates";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";
import { ContactIcon, linkIcon } from "./contact-icons";

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
  paged = false,
}: {
  data: ResumeData;
  format?: PageFormat;
  /**
   * The document is being fragmented into real pages — see the `@page` block in
   * app/print/[token]. The page box then supplies the bottom margin on every
   * sheet and the top margin from the second one on, so the document must stop
   * padding its own foot or the last page gets the margin twice. Page one still
   * pads its own head, which is what lets a banded header bleed to the edge.
   */
  paged?: boolean;
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
    // A short resume still fills a sheet. Paged, the page box has already taken
    // its bottom margin out of the first sheet, so asking for the full height
    // here would push a blank second page out of a half-empty first one.
    minHeight: paged ? `calc(${minHeight}px - ${s.marginY}mm)` : minHeight,
    // Right-to-left languages flip the whole document: headings, contact rows,
    // list markers and the date column all follow the text direction.
    direction: rtl ? "rtl" : undefined,
    textAlign: rtl ? "right" : undefined,
  };

  /** The foot the document pads for itself — nothing, once the page box is
   *  putting a margin under every sheet rather than only under the last. */
  const padBottom = paged ? 0 : s.marginY;

  /**
   * A padding box, always as longhands.
   *
   * Never `{ padding: "…", paddingTop: 0 }`. React diffs inline styles key by
   * key: on a re-render where only the shorthand changed it writes `padding`
   * and leaves `paddingTop` alone — but the shorthand has just reset every
   * longhand, so the override is gone until the node is mounted again. Dragging
   * the margin slider opened a hole under the header that a reload closed.
   */
  const box = (
    top: number,
    x: number,
    bottom: number,
  ): React.CSSProperties => ({
    paddingTop: `${top}mm`,
    paddingRight: `${x}mm`,
    paddingBottom: `${bottom}mm`,
    paddingLeft: `${x}mm`,
  });

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
    // A header spanning both columns has already paid the top margin, so the
    // columns underneath must not pay it again — the single-column layout
    // zeroes its own top padding for exactly this reason. Left in, the two
    // stacked and the space under the header grew with the margin slider until
    // it read as a hole. A header living inside the rail keeps it: there the
    // rail's padding is the only top margin there is.
    const railTop = template.sidebarHeader === "inside" ? s.marginY : 0;
    const railPad = box(railTop, Math.max(s.marginX * 0.72, 8), padBottom);

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
          ...railPad,
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
      <div
        key="main"
        style={railPad}
        className="min-w-0 flex-1"
      >
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

    // `min-w-0`: a column-flex item's automatic minimum is its min-content
    // width, so without this the widest unbreakable thing in either column —
    // a date that can't wrap, most often — would push the row past the paper
    // instead of the column giving way. See the grid tracks in the blocks,
    // which are bounded for the same reason.
    const columns = (
      <div className="flex min-w-0 flex-1 items-stretch">
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
        <div style={box(s.marginY, s.marginX, 0)}>
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
          style={
            template.headerBand
              ? { padding: 0 }
              : box(s.marginY, s.marginX, 0)
          }
        >
          <Header personal={personal} ctx={ctx} />
        </div>
        {/* No top padding either way: an unbanded header is padded by the
            block above it, and a banded one ends in its own margin. Letting the
            page margin apply here as well opened a hole under the band. */}
        <div style={box(0, s.marginX, padBottom)}>
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

/**
 * Where a contact row points, if anywhere.
 *
 * Chromium turns an `<a href>` into a real PDF link annotation, so this is
 * what makes an exported resume's email and profiles clickable rather than
 * text a recruiter has to retype. A bare `github.com/x` or `x@y.com` is what
 * people actually type, so the scheme is inferred rather than demanded.
 */
function contactHref(kind: string, value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (kind === "email") return v.includes("@") ? `mailto:${v}` : undefined;
  // Everything a dialler would reject, gone: spaces, brackets, dashes.
  if (kind === "phone") {
    const dial = v.replace(/[^\d+]/g, "");
    return dial.length >= 4 ? `tel:${dial}` : undefined;
  }
  if (kind === "location") return undefined;
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  // A handle on its own is not an address; a host with a dot in it is.
  return /^[\w-]+(\.[\w-]+)+(\/|$)/.test(v) ? `https://${v}` : undefined;
}

/** The value, linked if it can be. Inherits its colour and stays undecorated:
 *  a blue underline is a web convention, not a resume one. */
function ContactValue({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a
      href={href}
      className={className}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      {children}
    </a>
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
  // Absent on resumes saved before the choice existed, which all showed the
  // house set — so that stays the default rather than the first pack.
  const iconStyle = s.iconStyle ?? DEFAULT_SETTINGS.iconStyle ?? "solid";

  const contacts: {
    icon: IconKind;
    value: string;
    href?: string;
  }[] = [
    ...contactOrder(personal)
      .filter((field) => personal[field])
      .map((field) => ({
        icon: field as IconKind,
        value: personal[field],
        href: contactHref(field, personal[field]),
      })),
    ...personal.links
      .filter((l) => l.url || l.label)
      .map((l) => {
        const value = l.url || l.label;
        return {
          // Both fields decide the mark: the address names the site, and the
          // label names it too when someone pasted the address into the label.
          icon: linkIcon(`${l.label} ${l.url}`),
          value,
          href: contactHref("link", l.url || l.label),
        };
      }),
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
            <ContactIcon kind={c.icon} style={iconStyle} color={color} />
            <ContactValue href={c.href} className="min-w-0 break-words">
              {c.value}
            </ContactValue>
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
            <ContactIcon kind={c.icon} style={iconStyle} color={color} />
            <ContactValue href={c.href} className="min-w-0 break-words">
              {c.value}
            </ContactValue>
          </span>
        ))}
      </div>
    );
  }

  // One flowing row. `<wbr>` after each bullet for the same reason as the
  // inline skills line: the dots are spaced with a margin, not with spaces, so
  // without it the row is one word and a long address or URL pushes it off the
  // page instead of wrapping.
  return (
    <div
      style={base}
      className={`break-words ${centered ? "text-center" : ""}`}
    >
      {contacts.map((c, i) => (
        <span key={i}>
          {i > 0 && (
            <>
              <span style={{ margin: "0 0.45em", color: `${s.accent}80` }}>
                •
              </span>
              <wbr />
            </>
          )}
          <ContactValue href={c.href}>{c.value}</ContactValue>
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

  // The range never breaks — "Sep 2021 –" over "Present" reads as two dates.
  // Everything around it can, and has to: a column that refuses to give way
  // pushes the entry, its section and the whole page wider than the paper,
  // and the overflow is what gets cut off at the right edge.
  if (t.dates === "right-inline") {
    return (
      <p style={style}>
        <span className="whitespace-nowrap">{range}</span>
        {range && location && <span>{"  |  "}</span>}
        {location}
      </p>
    );
  }

  return (
    <div style={style}>
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
      {/* `minmax(0, 1fr)`, not the implicit `auto`: an auto track is floored
          at its items' min-content width, so one entry too wide to fit would
          widen the track — and with it the section, the column and the page. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          rowGap: `${0.7 * t.density}em`,
        }}
      >
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
                  gridTemplateColumns: "9em minmax(0, 1fr)",
                  columnGap: "1em",
                }}
              >
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="left"
                />
                {/* Pinned to the second track rather than left to fall there.
                    An entry with no date and no location renders no <Meta> at
                    all, and auto-placement then dropped the entry itself into
                    the 9em date column — a project without dates came out as a
                    ribbon of one-word lines down the left edge. */}
                <div className="min-w-0" style={{ gridColumn: 2 }}>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          rowGap: `${0.55 * t.density}em`,
        }}
      >
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
                  gridTemplateColumns: "9em minmax(0, 1fr)",
                  columnGap: "1em",
                }}
              >
                <Meta
                  range={range}
                  location={item.location}
                  ctx={ctx}
                  align="left"
                />
                {/* Pinned to the second track rather than left to fall there.
                    An entry with no date and no location renders no <Meta> at
                    all, and auto-placement then dropped the entry itself into
                    the 9em date column — a project without dates came out as a
                    ribbon of one-word lines down the left edge. */}
                <div className="min-w-0" style={{ gridColumn: 2 }}>
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

  // What the template drew, unless the document has asked for something else.
  // A template is a starting point here rather than a rule: the same skills
  // read very differently as four columns, as one flowing line, or as meters,
  // and which one fits depends on how many there are.
  const layout = s.tagStyle && s.tagStyle !== "auto" ? s.tagStyle : t.tags;
  const separator =
    TAG_SEPARATORS[s.tagSeparator ?? "pipe"] ?? TAG_SEPARATORS.pipe;

  const inner = () => {
    // One flowing line, separator-delimited.
    //
    // The separator is spaced with a margin rather than with spaces, which
    // leaves the whole list as one unbreakable word — it could only wrap where
    // a skill happened to contain a space, and everything past the last of
    // those ran off the right edge of the paper. `<wbr>` puts the break
    // opportunity back after each one, without touching the spacing.
    if (layout === "inline") {
      return (
        <p style={{ fontSize: size, color }} className="break-words">
          {items.map((item, i) => {
            const level = levelLabel(section.type, item.level, s.language);
            return (
              <span key={item.id}>
                {i > 0 && (
                  <>
                    <span
                      style={{
                        // A comma belongs to the word before it; every other
                        // mark stands between the two.
                        margin:
                          separator === "," ? "0 0.35em 0 0" : "0 0.5em",
                        color: `${s.accent}66`,
                      }}
                    >
                      {separator}
                    </span>
                    <wbr />
                  </>
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
    if (layout === "bars") {
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
    if (layout === "dots") {
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

    // Bulleted columns — but never in a rail. A template asking for four of
    // them means four across the width of the paper; four across a 30% column
    // leaves each one narrower than the word in it, and every skill spilled
    // out past the right edge of the page.
    const cols = ctx.rail ? 1 : tagColumns(layout);
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
              <span className="min-w-0 break-words">
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
