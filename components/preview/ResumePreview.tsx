// Pure renderer for the resume document. Given ResumeData (including
// customization settings), produces the formatted A4 content. All typographic
// sizes are em-relative to the configured base font size, so the whole document
// scales with the Customize controls. No interactivity — reusable for export.

import type {
  EducationSection,
  ExperienceSection,
  HeadingStyle,
  PersonalDetails,
  ResumeData,
  ResumeSettings,
  Section,
  SkillsSection,
  SummarySection,
} from "@/lib/types";
import { DEFAULT_SETTINGS, FONT_STACKS } from "@/lib/defaults";
import { formatRange } from "@/lib/format";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";

export function ResumePreview({ data }: { data: ResumeData }) {
  const { personal, sections } = data;
  const s = data.settings ?? DEFAULT_SETTINGS;

  const isEmpty =
    !personal.fullName &&
    !personal.title &&
    !personal.email &&
    sections.length === 0;

  if (isEmpty) {
    return (
      <div className="flex h-full min-h-[1123px] flex-col items-center justify-center px-16 text-center">
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

  return (
    <div
      style={{
        fontFamily: FONT_STACKS[s.fontFamily],
        fontSize: `${s.fontSize}pt`,
        lineHeight: s.lineHeight,
        padding: `${s.marginY}mm ${s.marginX}mm`,
        color: BODY,
      }}
    >
      <Header personal={personal} accent={s.accent} />
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} settings={s} />
      ))}
    </div>
  );
}

function Header({
  personal,
  accent,
}: {
  personal: PersonalDetails;
  accent: string;
}) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    ...personal.links.map((l) => l.url || l.label),
  ].filter(Boolean);

  return (
    <header
      style={{ marginBottom: "1.3em" }}
      className="flex items-start justify-between gap-6"
    >
      <div className="min-w-0">
        {personal.fullName && (
          <div
            style={{ fontSize: "2em", color: INK, lineHeight: 1.05 }}
            className="font-extrabold tracking-tight"
          >
            {personal.fullName}
          </div>
        )}
        {personal.title && (
          <div
            style={{ fontSize: "1.12em", color: accent, marginTop: "0.15em" }}
            className="font-medium"
          >
            {personal.title}
          </div>
        )}
        {contacts.length > 0 && (
          <div
            style={{ fontSize: "0.86em", color: MUTED, marginTop: "0.5em" }}
          >
            {contacts.map((c, i) => (
              <span key={i}>
                {i > 0 && <span style={{ margin: "0 0.4em", color: "#c4c9d1" }}>•</span>}
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
      {personal.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={personal.photo}
          alt=""
          className="shrink-0 rounded-full object-cover"
          style={{ height: "7em", width: "7em" }}
        />
      )}
    </header>
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
}: {
  section: Section;
  settings: ResumeSettings;
}) {
  switch (section.type) {
    case "summary":
      return <SummaryBlock section={section} settings={settings} />;
    case "experience":
      return <ExperienceBlock section={section} settings={settings} />;
    case "education":
      return <EducationBlock section={section} settings={settings} />;
    case "skills":
      return <SkillsBlock section={section} settings={settings} />;
  }
}

const sectionWrap: React.CSSProperties = { marginBottom: "1.3em" };

function SummaryBlock({
  section,
  settings,
}: {
  section: SummarySection;
  settings: ResumeSettings;
}) {
  if (!section.content) return null;
  return (
    <section style={sectionWrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <p style={{ fontSize: "0.95em", color: BODY, whiteSpace: "pre-line" }}>
        {section.content}
      </p>
    </section>
  );
}

function ExperienceBlock({
  section,
  settings,
}: {
  section: ExperienceSection;
  settings: ResumeSettings;
}) {
  const items = section.items.filter(
    (i) => i.role || i.company || i.bullets.some(Boolean),
  );
  if (items.length === 0) return null;

  return (
    <section style={sectionWrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <div className="space-y-3">
        {items.map((item) => {
          const range = formatRange(item.startDate, item.endDate, item.current);
          const bullets = item.bullets.filter(Boolean);
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
              {bullets.length > 0 && (
                <ul
                  style={{ fontSize: "0.95em", color: BODY, marginTop: "0.25em" }}
                  className="list-disc space-y-0.5 pl-4 marker:text-[#9ca3af]"
                >
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
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
}: {
  section: EducationSection;
  settings: ResumeSettings;
}) {
  const items = section.items.filter((i) => i.degree || i.school);
  if (items.length === 0) return null;

  return (
    <section style={sectionWrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <div className="space-y-3">
        {items.map((item) => {
          const range = formatRange(item.startDate, item.endDate);
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
              {item.description && (
                <p
                  style={{ fontSize: "0.9em", color: MUTED, whiteSpace: "pre-line", marginTop: "0.15em" }}
                >
                  {item.description}
                </p>
              )}
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
}: {
  section: SkillsSection;
  settings: ResumeSettings;
}) {
  const groups = section.groups.filter((g) => g.skills.length > 0);
  if (groups.length === 0) return null;

  return (
    <section style={sectionWrap}>
      <SectionHeading accent={settings.accent} style={settings.headingStyle}>
        {section.title}
      </SectionHeading>
      <div className="space-y-1.5">
        {groups.map((g) => (
          <p key={g.id} style={{ fontSize: "0.95em", color: BODY }}>
            {g.name && (
              <span style={{ color: INK }} className="font-semibold">
                {g.name}:{" "}
              </span>
            )}
            {g.skills.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
