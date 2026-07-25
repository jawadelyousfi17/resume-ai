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
  FONT_STACKS,
  isTagGroupSection,
  PAGE_SIZES,
  showsDates,
} from "@/lib/defaults";
import { isRtl, levelLabel } from "@/lib/i18n";
import { getTemplate, tagColumns, type Template } from "@/lib/templates";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty } from "@/lib/markdown";
import { avatarUrl } from "@/lib/avatar";
import { MarkdownView } from "@/components/ui/markdown-view";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";
/** The grey a banded heading sits on. */
const BAND = "#eceef1";

/** Everything the blocks need, gathered once rather than threaded field by
 *  field through six components. */
interface Ctx {
  settings: ResumeSettings;
  template: Template;
  /** True inside a dark rail, where every colour has to invert. */
  onDark?: boolean;
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
  const ctx: Ctx = { settings: s, template };
  const rtl = isRtl(s.language);

  const page: React.CSSProperties = {
    // The template owns the typeface; the font control still picks the exact
    // stack within that family.
    fontFamily: FONT_STACKS[template.font === "serif" ? "serif" : s.fontFamily],
    fontSize: `${s.fontSize}pt`,
    lineHeight: s.lineHeight,
    color: BODY,
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
    const railCtx: Ctx = { ...ctx, onDark: dark };
    const railPad = `${s.marginY}mm ${Math.max(s.marginX * 0.72, 8)}mm`;

    const columns = (
      <div className="flex flex-1 items-stretch">
        <aside
          style={{
            width: dark ? "34%" : "31%",
            backgroundColor: dark ? s.accent : `${s.accent}14`,
            color: dark ? "rgba(255,255,255,0.86)" : undefined,
            padding: railPad,
          }}
          className="shrink-0"
        >
          {template.sidebarHeader === "inside" && (
            <Header personal={personal} ctx={railCtx} stacked />
          )}
          {rail.map((section) => (
            <SectionBlock key={section.id} section={section} ctx={railCtx} />
          ))}
        </aside>

        <div style={{ padding: railPad }} className="min-w-0 flex-1">
          {main.map((section) => (
            <SectionBlock key={section.id} section={section} ctx={ctx} />
          ))}
        </div>
      </div>
    );

    // A header that spans both columns sits above them; one that belongs to
    // the rail is rendered inside it, and the columns run the full height.
    if (template.sidebarHeader === "inside") {
      return (
        <div dir={rtl ? "rtl" : undefined} style={page} className="flex items-stretch">
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
    <div dir={rtl ? "rtl" : undefined} style={page} className="flex items-stretch">
      {template.edgeStrip && (
        <div
          aria-hidden="true"
          style={{ width: "7%", backgroundColor: s.accent }}
          className="shrink-0"
        />
      )}

      <div className="min-w-0 flex-1">
        {/* A banded header bleeds to the page edge, so it pads itself. */}
        <div style={{ padding: template.headerBand ? 0 : pad, paddingBottom: 0 }}>
          <Header personal={personal} ctx={ctx} />
        </div>
        <div style={{ padding: pad, paddingTop: template.headerBand ? undefined : 0 }}>
          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} ctx={ctx} />
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
  const centered = t.headerAlign === "center" && !stacked;
  const nameColor = onDark ? "#ffffff" : INK;

  const identity = (
    <>
      <div
        className={t.headerInlineTitle && !stacked ? "flex flex-wrap items-baseline gap-x-3" : ""}
      >
        {personal.fullName && (
          <span
            style={{ fontSize: stacked ? "1.6em" : "1.95em", color: nameColor, lineHeight: 1.08 }}
            className="block font-extrabold tracking-tight"
          >
            {personal.fullName}
          </span>
        )}
        {personal.title && (
          <span
            style={{
              fontSize: t.headerInlineTitle && !stacked ? "1.15em" : "1.12em",
              color: onDark ? "rgba(255,255,255,0.75)" : t.headerBand ? MUTED : s.accent,
              marginTop: t.headerInlineTitle && !stacked ? 0 : "0.15em",
            }}
            className={
              t.headerInlineTitle && !stacked
                ? "italic"
                : "block font-medium"
            }
          >
            {personal.title}
          </span>
        )}
      </div>
      <ContactList personal={personal} ctx={ctx} stacked={stacked} centered={centered} />
    </>
  );

  const photo = <Avatar personal={personal} ctx={ctx} stacked={stacked} />;

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

  if (t.headerBand) {
    return (
      <header
        style={{
          backgroundColor: `${s.accent}1f`,
          padding: `${s.marginY * 0.8}mm ${s.marginX}mm`,
          marginBottom,
        }}
      >
        {inner}
      </header>
    );
  }

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
      {inner}
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
  if (t.photo === "none") return null;

  // An uploaded photo wins; otherwise DiceBear fills the frame so the layout
  // reads as designed rather than showing an empty circle.
  const src = personal.photo || avatarUrl(personal.fullName);
  const size = stacked ? "9.5em" : "6.4em";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
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
}: {
  personal: PersonalDetails;
  ctx: Ctx;
  stacked?: boolean;
  centered?: boolean;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const color = onDark ? "rgba(255,255,255,0.72)" : MUTED;

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
            <span style={{ margin: "0 0.45em", color: `${s.accent}80` }}>•</span>
          )}
          {c.value}
        </span>
      ))}
    </div>
  );
}

// -------------------------------------------------------------- headings

function SectionHeading({ children, ctx }: { children: string; ctx: Ctx }) {
  const { settings: s, template: t, onDark } = ctx;

  // The template sets the default; the Customize control still overrides it.
  const caps = s.headingStyle === "uppercase" || t.headingCaps;
  const text = caps ? children.toUpperCase() : children;

  const type: React.CSSProperties = {
    fontSize: "1.02em",
    letterSpacing: caps ? "0.06em" : undefined,
    color: onDark ? "#ffffff" : t.headingAccentRule ? s.accent : INK,
    textAlign: t.headingAlign === "center" ? "center" : undefined,
  };

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
        {text}
      </h2>
    );
  }

  if (t.headingStyle === "plain" && s.headingStyle === "plain") {
    return (
      <h2 style={{ ...type, marginBottom: "0.45em" }} className="font-bold">
        {text}
      </h2>
    );
  }

  const ruleColor = onDark
    ? "rgba(255,255,255,0.35)"
    : t.headingAccentRule
      ? s.accent
      : INK;

  return (
    <h2
      style={{
        ...type,
        borderBottom: `1.2px solid ${ruleColor}`,
        paddingBottom: "0.22em",
        marginBottom: "0.55em",
      }}
      className="font-bold"
    >
      {text}
    </h2>
  );
}

function SectionBlock({ section, ctx }: { section: Section; ctx: Ctx }) {
  const wrap: React.CSSProperties = {
    marginBottom: `${1.15 * ctx.template.density}em`,
  };

  switch (section.type) {
    case "summary":
      return <SummaryBlock section={section} ctx={ctx} wrap={wrap} />;
    case "experience":
    case "projects":
    case "volunteering":
      return <ExperienceBlock section={section} ctx={ctx} wrap={wrap} />;
    case "education":
    case "certifications":
    case "awards":
      return <EducationBlock section={section} ctx={ctx} wrap={wrap} />;
    case "skills":
    case "languages":
    case "interests":
      return <TagBlock section={section} ctx={ctx} wrap={wrap} />;
  }
}

// ----------------------------------------------------------------- blocks

function SummaryBlock({
  section,
  ctx,
  wrap,
}: {
  section: SummarySection;
  ctx: Ctx;
  wrap: React.CSSProperties;
}) {
  if (isMarkdownEmpty(section.content)) return null;
  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx}>{section.title}</SectionHeading>
      <MarkdownView
        md={section.content}
        style={{
          fontSize: "0.95em",
          color: ctx.onDark ? "rgba(255,255,255,0.8)" : BODY,
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
  const { template: t, onDark } = ctx;
  const color = onDark ? "rgba(255,255,255,0.6)" : "#6b7280";
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
}: {
  section: ExperienceSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const items = section.items.filter(
    (i) => !i.hidden && (i.role || i.company || !isMarkdownEmpty(i.highlights)),
  );
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx}>{section.title}</SectionHeading>
      <div style={{ display: "grid", rowGap: `${0.7 * t.density}em` }}>
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(item.startDate, item.endDate, item.current, s.language, s.dateFormat)
            : "";

          const heading = (
            <p style={{ fontSize: "1em", color: onDark ? "#fff" : INK }}>
              <span className="font-bold">{item.role}</span>
              {item.role && item.company && (
                <span style={{ color: onDark ? "rgba(255,255,255,0.7)" : MUTED }}>
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
                style={{ display: "grid", gridTemplateColumns: "9em 1fr", columnGap: "1em" }}
              >
                <Meta range={range} location={item.location} ctx={ctx} align="left" />
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
                <Meta range={range} location={item.location} ctx={ctx} align="right" />
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
}: {
  section: EducationSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
}) {
  const { settings: s, template: t, onDark } = ctx;
  const items = section.items.filter((i) => !i.hidden && (i.degree || i.school));
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading ctx={ctx}>{section.title}</SectionHeading>
      <div style={{ display: "grid", rowGap: `${0.55 * t.density}em` }}>
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(item.startDate, item.endDate, false, s.language, s.dateFormat)
            : "";

          const heading = (
            <p style={{ fontSize: "1em", color: onDark ? "#fff" : INK }}>
              <span className="font-bold">{item.degree}</span>
              {item.degree && item.school && (
                <span style={{ color: onDark ? "rgba(255,255,255,0.7)" : MUTED }}>
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
                style={{ display: "grid", gridTemplateColumns: "9em 1fr", columnGap: "1em" }}
              >
                <Meta range={range} location={item.location} ctx={ctx} align="left" />
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
                <Meta range={range} location={item.location} ctx={ctx} align="right" />
              </div>
              {body}
            </div>
          );
        })}
      </div>
    </section>
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
}: {
  section: SkillsSection;
  ctx: Ctx;
  wrap: React.CSSProperties;
}) {
  const { settings: s, template: t, onDark } = ctx;
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
                  <span style={{ margin: "0 0.5em", color: `${s.accent}66` }}>|</span>
                )}
                <span className="font-medium">{item.name}</span>
                {level && (
                  <span style={{ color: MUTED }}> ({level})</span>
                )}
              </span>
            );
          })}
        </p>
      );
    }

    // Name on the left, a proficiency meter on the right.
    if (t.tags === "dots") {
      return (
        <div
          style={{ fontSize: size, color, display: "grid", columnGap: "2.5em", rowGap: "0.35em" }}
          className="sm:grid-cols-2"
        >
          {items.map((item) => (
            <span key={item.id} className="flex items-center justify-between gap-3">
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
                  <span style={{ color: onDark ? "rgba(255,255,255,0.6)" : MUTED }}>
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
      <SectionHeading ctx={ctx}>{section.title}</SectionHeading>
      {inner()}
    </section>
  );
}
