// Turns ResumeData into a complete .tex document using a clean single-column
// resume template driven by the resume's Customize settings (accent, font,
// size, line height, margins, heading style, language). Everything is escaped
// so arbitrary user text can't break compilation.
//
// Latin-script resumes use the classic 8-bit font encoding. Anything else is
// typeset through fontspec, which needs a Unicode engine — Tectonic is XeTeX,
// so that works, provided the server actually has a font covering the script.

import type {
  ContactField,
  FontFamily,
  PageFormat,
  EducationSection,
  ExperienceSection,
  ResumeData,
  ResumeSettings,
  Section,
  SkillsSection,
  SummarySection,
} from "./types";
import {
  contactOrder,
  DEFAULT_SETTINGS,
  PAGE_SIZES,
  showsDates,
} from "./defaults";
import { language, levelLabel, type Script } from "./i18n";
import { isMarkdownEmpty, markdownToLatex } from "./markdown";
import { getTemplate } from "./templates";
import { formatRange } from "./format";

/** Escape LaTeX special characters in a plain-text string. */
export function escapeLatex(input: string): string {
  if (!input) return "";
  return (
    input
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/([&%$#_{}])/g, "\\$1")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}")
      // Normalize common Unicode punctuation to LaTeX-safe equivalents so it
      // renders in the default font instead of dropping out.
      .replace(/—/g, "---")
      .replace(/–/g, "--")
      .replace(/…/g, "\\ldots{}")
      .replace(/[‘’‛]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/ /g, " ")
  );
}

function escapeUrl(url: string): string {
  return url.replace(/%/g, "\\%").replace(/#/g, "\\#");
}

function link(url: string, label: string): string {
  const display = escapeLatex(label || url);
  if (!url) return display;
  return `\\href{${escapeUrl(url)}}{${display}}`;
}

const SEP = " {\\color{muted}\\textbullet} ";
const pt = (n: number) => n.toFixed(1);

function sectionTitle(title: string, s: ResumeSettings): string {
  const t = s.headingStyle === "uppercase" ? title.toUpperCase() : title;
  return `\\section{${escapeLatex(t)}}`;
}

function header(data: ResumeData, s: ResumeSettings): string {
  const p = data.personal;
  const t = getTemplate(s.template);
  const lines: string[] = [];

  if (t.header === "centered") lines.push("\\begin{center}");
  if (t.headerRule) lines.push("{\\color{accent!50}\\rule{\\linewidth}{0.4pt}}\\\\[6pt]");

  if (p.fullName) {
    const nameColor = t.nameColor === "accent" ? "accent" : "ink";
    lines.push(
      `{\\fontsize{${pt(s.fontSize * 2)}}{${pt(s.fontSize * 2.1)}}\\selectfont\\bfseries\\color{${nameColor}} ${escapeLatex(p.fullName)}}\\\\[3pt]`,
    );
  }
  if (p.title) {
    lines.push(
      `{\\fontsize{${pt(s.fontSize * 1.12)}}{${pt(s.fontSize * 1.3)}}\\selectfont\\color{accent} ${escapeLatex(p.title)}}\\\\[5pt]`,
    );
  }

  // Same order the preview uses, so the PDF matches what's on screen.
  const contactValues: Record<ContactField, string> = {
    email: p.email ? link(`mailto:${p.email}`, p.email) : "",
    phone: p.phone ? escapeLatex(p.phone) : "",
    location: p.location ? escapeLatex(p.location) : "",
  };
  const contacts = [
    ...contactOrder(p).map((field) => contactValues[field]),
    ...p.links.map((l) => (l.url || l.label ? link(l.url, l.label) : "")),
  ].filter(Boolean);

  if (contacts.length) {
    lines.push(`{\\small\\color{muted} ${contacts.join(SEP)}}`);
  }

  if (t.headerRule) lines.push("\\\\[6pt]{\\color{accent!50}\\rule{\\linewidth}{0.4pt}}");
  if (t.header === "centered") lines.push("\\end{center}");

  return lines.join("\n");
}

function summaryBlock(section: SummarySection, s: ResumeSettings): string {
  if (isMarkdownEmpty(section.content)) return "";
  return [
    sectionTitle(section.title, s),
    markdownToLatex(section.content, escapeLatex),
  ].join("\n");
}

function experienceBlock(section: ExperienceSection, s: ResumeSettings): string {
  const items = section.items.filter(
    (i) => !i.hidden && (i.role || i.company || !isMarkdownEmpty(i.highlights)),
  );
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = showsDates(section)
        ? formatRange(item.startDate, item.endDate, item.current, s.language, s.dateFormat)
        : "";
      const parts: string[] = [];

      const heading = `\\textbf{${escapeLatex(item.role)}}`;
      parts.push(
        range
          ? `${heading}\\hfill{\\small\\color{muted} ${escapeLatex(range)}}\\\\`
          : `${heading}\\\\`,
      );

      const sub = [item.company, item.location].filter(Boolean).map(escapeLatex);
      if (sub.length) parts.push(`{\\color{muted} ${sub.join(", ")}}`);

      if (!isMarkdownEmpty(item.highlights)) {
        parts.push(markdownToLatex(item.highlights, escapeLatex));
      }
      return parts.join("\n");
    })
    .join("\n\n\\smallskip\n");

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function educationBlock(section: EducationSection, s: ResumeSettings): string {
  const items = section.items.filter((i) => !i.hidden && (i.degree || i.school));
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = showsDates(section)
        ? formatRange(item.startDate, item.endDate, false, s.language, s.dateFormat)
        : "";
      const parts: string[] = [];
      const heading = `\\textbf{${escapeLatex(item.degree)}}`;
      parts.push(
        range
          ? `${heading}\\hfill{\\small\\color{muted} ${escapeLatex(range)}}\\\\`
          : `${heading}\\\\`,
      );
      const sub = [item.school, item.location].filter(Boolean).map(escapeLatex);
      if (sub.length) parts.push(`{\\color{muted} ${sub.join(", ")}}`);
      if (!isMarkdownEmpty(item.description)) {
        parts.push(`\\\\ ${markdownToLatex(item.description, escapeLatex)}`);
      }
      return parts.join("\n");
    })
    .join("\n\n\\smallskip\n");

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function skillsBlock(section: SkillsSection, s: ResumeSettings): string {
  const items = section.items.filter((i) => !i.hidden && i.name.trim());
  if (!items.length) return "";

  // Matches the preview: one flowing line, each level in muted parentheses.
  const body = items
    .map((item) => {
      const level = levelLabel(section.type, item.level, s.language);
      const name = escapeLatex(item.name.trim());
      return level
        ? `${name} {\\small\\color{muted}(${escapeLatex(level)})}`
        : name;
    })
    .join(SEP);

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function sectionBlock(section: Section, s: ResumeSettings): string {
  switch (section.type) {
    case "summary":
      return summaryBlock(section, s);
    case "experience":
    case "projects":
    case "volunteering":
      return experienceBlock(section, s);
    case "education":
    case "certifications":
    case "awards":
      return educationBlock(section, s);
    case "skills":
    case "languages":
    case "interests":
      return skillsBlock(section, s);
  }
}

/** Fonts that cover each script, best first. Which of them a machine actually
 *  has varies wildly, so the document tries them in order at compile time
 *  rather than betting on one name. */
const SCRIPT_FONTS: Record<
  Exclude<Script, "latin">,
  Record<FontFamily, string[]>
> = {
  cyrillic: {
    sans: ["DejaVu Sans", "Noto Sans", "Liberation Sans", "Arial"],
    serif: ["DejaVu Serif", "Noto Serif", "Liberation Serif", "Times New Roman"],
    mono: ["DejaVu Sans Mono", "Noto Sans Mono", "Liberation Mono"],
  },
  cjk: {
    sans: [
      "Noto Sans CJK SC",
      "Noto Sans SC",
      "Source Han Sans SC",
      "WenQuanYi Zen Hei",
      "PingFang SC",
      "Microsoft YaHei",
    ],
    serif: [
      "Noto Serif CJK SC",
      "Source Han Serif SC",
      "Songti SC",
      "SimSun",
      "Noto Sans CJK SC",
    ],
    mono: ["Noto Sans Mono CJK SC", "Sarasa Mono SC", "Noto Sans CJK SC"],
  },
  arabic: {
    sans: ["Noto Sans Arabic", "Noto Naskh Arabic", "Amiri", "Geeza Pro", "Arial"],
    serif: ["Noto Naskh Arabic", "Amiri", "Scheherazade New", "Times New Roman"],
    mono: ["Noto Sans Mono Arabic", "Noto Sans Arabic", "Amiri"],
  },
};

/** Nests fontspec's font test so the first installed candidate wins. With none
 *  installed the document stops with a message naming what to install, which
 *  beats emitting a resume full of blank boxes. */
function fontChain(candidates: string[], options: string, script: Script): string {
  const setter = (font: string) => `\\setmainfont${options}{${font}}`;
  const missing =
    `\\PackageError{resumeai}{No ${script} font installed on the server. ` +
    `Install one of: ${candidates.join(", ")}}{}`;

  return candidates.reduceRight(
    (fallback, font) => `\\IfFontExistsTF{${font}}{${setter(font)}}{${fallback}}`,
    missing,
  );
}

/** The encoding and font setup for the resume's script. */
function fontSetup(s: ResumeSettings): string[] {
  const { script } = language(s.language);

  if (script === "latin") {
    return [
      "\\usepackage[T1]{fontenc}",
      "\\usepackage[utf8]{inputenc}",
      s.fontFamily === "sans"
        ? "\\renewcommand{\\familydefault}{\\sfdefault}"
        : s.fontFamily === "mono"
          ? "\\renewcommand{\\familydefault}{\\ttdefault}"
          : "", // serif → default roman
    ];
  }

  const candidates = SCRIPT_FONTS[script][s.fontFamily];
  const lines = ["\\usepackage{fontspec}"];

  if (script === "arabic") {
    // polyglossia sets the whole document right-to-left and applies Arabic
    // shaping; English stays available for Latin runs inside it.
    lines.push(
      "\\usepackage{polyglossia}",
      fontChain(candidates, "[Script=Arabic]", script),
      "\\setmainlanguage{arabic}",
      "\\setotherlanguage{english}",
    );
  } else {
    lines.push(fontChain(candidates, "", script));
  }

  return lines;
}

function preamble(s: ResumeSettings, format: PageFormat): string {
  const hex = s.accent.replace(/^#/, "").toUpperCase();
  const rule =
    s.headingStyle === "plain" ? "" : "[{\\color{accent!30}\\titlerule}]";

  return [
    `\\documentclass[11pt,${PAGE_SIZES[format].latex}]{article}`,
    ...fontSetup(s),
    `\\usepackage[top=${s.marginY}mm,bottom=${s.marginY}mm,left=${s.marginX}mm,right=${s.marginX}mm]{geometry}`,
    "\\usepackage{titlesec}",
    "\\usepackage{enumitem}",
    "\\usepackage{xcolor}",
    "\\usepackage{anyfontsize}",
    "\\usepackage[hidelinks]{hyperref}",
    "",
    `\\definecolor{accent}{HTML}{${hex}}`,
    "\\definecolor{ink}{HTML}{0F172A}",
    "\\definecolor{muted}{HTML}{475569}",
    "",
    "\\setcounter{secnumdepth}{0}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "",
    "\\setlist[itemize]{leftmargin=1.2em, itemsep=1pt, topsep=2pt, label=\\textcolor{muted}{\\textbullet}}",
    `\\titleformat{\\section}{\\fontsize{${pt(s.fontSize * 1.12)}}{${pt(s.fontSize * 1.3)}}\\selectfont\\bfseries\\color{accent}}{}{0em}{}${rule}`,
    `\\titlespacing{\\section}{0pt}{${pt(s.fontSize * 1.1)}pt}{${pt(s.fontSize * 0.5)}pt}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function generateLatex(resume: {
  name: string;
  data: ResumeData;
  format?: PageFormat;
}): string {
  const s = resume.data.settings ?? DEFAULT_SETTINGS;
  const format = resume.format ?? "A4";

  const blocks = resume.data.sections
    .map((section) => sectionBlock(section, s))
    .filter(Boolean)
    // Strip any trailing line-breaks so a block can't end with "\\" right
    // before the next \section or \end{document}.
    .map((b) => b.replace(/(?:\\\\\s*)+$/, ""))
    .join("\n\n");

  return [
    `% ${resume.name} — generated by ResumeAI`,
    preamble(s, format),
    "",
    "\\begin{document}",
    `\\fontsize{${pt(s.fontSize)}}{${pt(s.fontSize * s.lineHeight)}}\\selectfont`,
    "",
    header(resume.data, s),
    "",
    blocks,
    "",
    "\\end{document}",
    "",
  ].join("\n");
}
