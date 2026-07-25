// Pure renderer for the resume document. Given ResumeData (including
// customization settings), produces the formatted A4 content. All typographic
// sizes are em-relative to the configured base font size, so the whole document
// scales with the Customize controls. No interactivity — reusable for export.

import type {
  EducationSection,
  ExperienceSection,
  HeadingStyle,
  PersonalDetails,
  PageFormat,
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
import { getTemplate, type Template } from "@/lib/templates";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";

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

  const rtl = isRtl(s.language);
  const page: React.CSSProperties = {
    fontFamily: FONT_STACKS[s.fontFamily],
    fontSize: `${s.fontSize}pt`,
    lineHeight: s.lineHeight,
    color: BODY,
    // Right-to-left languages flip the whole document: headings, contact
    // rows, list markers and the date column all follow the text direction.
    direction: rtl ? "rtl" : undefined,
    textAlign: rtl ? "right" : undefined,
  };

  // The sidebar rail bleeds to the page edge, so that layout pads its two
  // columns individually rather than padding the page as a whole.
  if (template.layout === "sidebar") {
    const rail = sections.filter(isTagGroupSection);
    const main = sections.filter((section) => !isTagGroupSection(section));

    return (
      <div
        dir={rtl ? "rtl" : undefined}
        style={{ ...page, minHeight }}
        className="flex items-stretch"
      >
        <aside
          style={{
            width: "31%",
            backgroundColor: `${s.accent}0f`,
            padding: `${s.marginY}mm ${Math.max(s.marginX * 0.7, 8)}mm`,
          }}
          className="shrink-0"
        >
          <ContactList personal={personal} accent={s.accent} stacked />
          {rail.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              settings={s}
              template={template}
            />
          ))}
        </aside>

        <div
          style={{ padding: `${s.marginY}mm ${s.marginX}mm` }}
          className="min-w-0 flex-1"
        >
          <Header personal={personal} settings={s} template={template} nameOnly />
          {main.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              settings={s}
              template={template}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      dir={rtl ? "rtl" : undefined}
      style={{ ...page, padding: `${s.marginY}mm ${s.marginX}mm` }}
    >
      <Header personal={personal} settings={s} template={template} />
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          settings={s}
          template={template}
        />
      ))}
    </div>
  );
}

function ContactList({
  personal,
  accent,
  stacked,
}: {
  personal: PersonalDetails;
  accent: string;
  stacked?: boolean;
}) {
  const contacts = [
    ...contactOrder(personal).map((field) => personal[field]),
    ...personal.links.map((l) => l.url || l.label),
  ].filter(Boolean);

  if (contacts.length === 0) return null;

  if (stacked) {
    return (
      <div
        style={{ fontSize: "0.86em", color: MUTED, marginBottom: "1.3em" }}
        className="space-y-1"
      >
        {contacts.map((c, i) => (
          <p key={i} className="break-words">
            {c}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div style={{ fontSize: "0.86em", color: MUTED, marginTop: "0.5em" }}>
      {contacts.map((c, i) => (
        <span key={i}>
          {i > 0 && (
            <span style={{ margin: "0 0.4em", color: `${accent}80` }}>•</span>
          )}
          {c}
        </span>
      ))}
    </div>
  );
}

function Header({
  personal,
  settings,
  template,
  nameOnly,
}: {
  personal: PersonalDetails;
  settings: ResumeSettings;
  template: Template;
  /** Sidebar layout renders contacts in the rail instead. */
  nameOnly?: boolean;
}) {
  const accent = settings.accent;
  const centered = template.header === "centered";
  const band = template.header === "band";

  const nameColor = template.nameColor === "accent" ? accent : INK;

  const identity = (
    <>
      {personal.fullName && (
        <div
          style={{ fontSize: "2em", color: nameColor, lineHeight: 1.05 }}
          className="font-extrabold tracking-tight"
        >
          {personal.fullName}
        </div>
      )}
      {personal.title && (
        <div
          style={{
            fontSize: "1.12em",
            color: band ? MUTED : accent,
            marginTop: "0.15em",
          }}
          className="font-medium"
        >
          {personal.title}
        </div>
      )}
      {!nameOnly && !band && (
        <ContactList personal={personal} accent={accent} />
      )}
    </>
  );

  if (band) {
    return (
      <header style={{ marginBottom: `${1.3 * template.density}em` }}>
        <div
          style={{
            backgroundColor: `${accent}14`,
            borderLeft: `3px solid ${accent}`,
            padding: "0.7em 0.9em",
          }}
          className="flex items-start justify-between gap-6"
        >
          <div className="min-w-0">{identity}</div>
          <Photo personal={personal} />
        </div>
        {!nameOnly && (
          <div style={{ marginTop: "0.45em" }}>
            <ContactList personal={personal} accent={accent} />
          </div>
        )}
      </header>
    );
  }

  return (
    <header
      style={{
        marginBottom: `${1.3 * template.density}em`,
        paddingBottom: template.headerRule ? "0.7em" : undefined,
        borderTop: template.headerRule ? `1px solid ${accent}55` : undefined,
        paddingTop: template.headerRule ? "0.7em" : undefined,
        borderBottom: template.headerRule ? `1px solid ${accent}55` : undefined,
      }}
      className={
        centered
          ? "text-center"
          : "flex items-start justify-between gap-6"
      }
    >
      {centered ? (
        <div>{identity}</div>
      ) : (
        <>
          <div className="min-w-0">{identity}</div>
          <Photo personal={personal} />
        </>
      )}
    </header>
  );
}

function Photo({ personal }: { personal: PersonalDetails }) {
  if (!personal.photo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={personal.photo}
      alt=""
      className="shrink-0 rounded-full object-cover"
      style={{ height: "7em", width: "7em" }}
    />
  );
}

function SectionHeading({
  children,
  accent,
  style,
}: {
  children: React.ReactNode;
  accent: string;
  style: HeadingStyle;
}) {
  const base: React.CSSProperties = {
    fontSize: "1em",
    color: accent,
    marginBottom: "0.5em",
    paddingBottom: "0.15em",
  };
  if (style === "underline") {
    base.borderBottom = `1px solid ${accent}66`;
  } else if (style === "uppercase") {
    base.borderBottom = `1px solid ${accent}66`;
    base.textTransform = "uppercase";
    base.letterSpacing = "0.08em";
  }
  return (
    <div style={base} className="font-bold">
      {children}
    </div>
  );
}

function SectionBlock({
  section,
  settings,
  template,
}: {
  section: Section;
  settings: ResumeSettings;
  template: Template;
}) {
  // Templates set the vertical rhythm; everything else is per-block.
  const wrap: React.CSSProperties = {
    marginBottom: `${1.3 * template.density}em`,
  };

  switch (section.type) {
    case "summary":
      return <SummaryBlock section={section} settings={settings} wrap={wrap} />;
    case "experience":
    case "projects":
    case "volunteering":
      return (
        <ExperienceBlock section={section} settings={settings} wrap={wrap} />
      );
    case "education":
    case "certifications":
    case "awards":
      return (
        <EducationBlock section={section} settings={settings} wrap={wrap} />
      );
    case "skills":
    case "languages":
    case "interests":
      return <SkillsBlock section={section} settings={settings} wrap={wrap} />;
  }
}

function SummaryBlock({
  section,
  settings,
  wrap,
}: {
  section: SummarySection;
  settings: ResumeSettings;
  wrap: React.CSSProperties;
}) {
  if (isMarkdownEmpty(section.content)) return null;
  return (
    <section style={wrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <MarkdownView
        md={section.content}
        style={{ fontSize: "0.95em", color: BODY }}
      />
    </section>
  );
}

function ExperienceBlock({
  section,
  settings,
  wrap,
}: {
  section: ExperienceSection;
  settings: ResumeSettings;
  wrap: React.CSSProperties;
}) {
  const items = section.items.filter(
    (i) => !i.hidden && (i.role || i.company || !isMarkdownEmpty(i.highlights)),
  );
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <div className="space-y-3">
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(item.startDate, item.endDate, item.current, settings.language, settings.dateFormat)
            : "";
          return (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p style={{ fontSize: "1em", color: INK }} className="font-semibold">
                  {item.role}
                  {item.role && item.company && (
                    <span style={{ color: MUTED }} className="font-normal">
                      {" · "}
                    </span>
                  )}
                  <span style={{ color: BODY }} className="font-medium">
                    {item.company}
                  </span>
                </p>
                {range && (
                  <p
                    style={{ fontSize: "0.85em", color: "#6b7280" }}
                    className="shrink-0"
                  >
                    {range}
                  </p>
                )}
              </div>
              {item.location && (
                <p
                  style={{ fontSize: "0.85em", color: "#6b7280" }}
                  className="italic"
                >
                  {item.location}
                </p>
              )}
              <MarkdownView
                md={item.highlights}
                style={{ fontSize: "0.95em", color: BODY }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EducationBlock({
  section,
  settings,
  wrap,
}: {
  section: EducationSection;
  settings: ResumeSettings;
  wrap: React.CSSProperties;
}) {
  const items = section.items.filter((i) => !i.hidden && (i.degree || i.school));
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <div className="space-y-3">
        {items.map((item) => {
          const range = showsDates(section)
            ? formatRange(item.startDate, item.endDate, false, settings.language, settings.dateFormat)
            : "";
          return (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p style={{ fontSize: "1em", color: INK }} className="font-semibold">
                  {item.degree}
                </p>
                {range && (
                  <p
                    style={{ fontSize: "0.85em", color: "#6b7280" }}
                    className="shrink-0"
                  >
                    {range}
                  </p>
                )}
              </div>
              <p style={{ fontSize: "0.95em", color: BODY }}>
                {item.school}
                {item.school && item.location && (
                  <span style={{ color: "#6b7280" }}> · {item.location}</span>
                )}
              </p>
              <MarkdownView
                md={item.description}
                style={{ fontSize: "0.9em", color: MUTED, marginTop: "0.15em" }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SkillsBlock({
  section,
  settings,
  wrap,
}: {
  section: SkillsSection;
  settings: ResumeSettings;
  wrap: React.CSSProperties;
}) {
  const items = section.items.filter((i) => !i.hidden && i.name.trim());
  if (items.length === 0) return null;

  return (
    <section style={wrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      {/* One flowing line: a resume shouldn't spend a row per skill. Levels
          ride alongside the name they qualify. */}
      <p style={{ fontSize: "0.95em", color: BODY }}>
        {items.map((item, i) => {
          const level = levelLabel(section.type, item.level, settings.language);
          return (
            <span key={item.id}>
              {i > 0 && <span style={{ color: MUTED }}> · </span>}
              {item.name}
              {level && (
                <span style={{ color: MUTED, fontSize: "0.9em" }}>
                  {" "}
                  ({level})
                </span>
              )}
            </span>
          );
        })}
      </p>
    </section>
  );
}
