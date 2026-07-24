// Turns ResumeData into a complete, pdflatex-compatible .tex document using a
// clean single-column resume template driven by the resume's Customize
// settings (accent, font, size, line height, margins, heading style).
// Everything is escaped so arbitrary user text can't break compilation.

import type {
  EducationSection,
  ExperienceSection,
  ResumeData,
  ResumeSettings,
  Section,
  SkillsSection,
  SummarySection,
} from "./types";
import { DEFAULT_SETTINGS } from "./defaults";
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
  const lines: string[] = [];

  if (p.fullName) {
    lines.push(
      `{\\fontsize{${pt(s.fontSize * 2)}}{${pt(s.fontSize * 2.1)}}\\selectfont\\bfseries\\color{ink} ${escapeLatex(p.fullName)}}\\\\[3pt]`,
    );
  }
  if (p.title) {
    lines.push(
      `{\\fontsize{${pt(s.fontSize * 1.12)}}{${pt(s.fontSize * 1.3)}}\\selectfont\\color{accent} ${escapeLatex(p.title)}}\\\\[5pt]`,
    );
  }

  const contacts = [
    p.email && link(`mailto:${p.email}`, p.email),
    p.phone && escapeLatex(p.phone),
    p.location && escapeLatex(p.location),
    ...p.links.map((l) => (l.url || l.label ? link(l.url, l.label) : "")),
  ].filter(Boolean);

  if (contacts.length) {
    lines.push(`{\\small\\color{muted} ${contacts.join(SEP)}}`);
  }

  return lines.join("\n");
}

function summaryBlock(section: SummarySection, s: ResumeSettings): string {
  if (!section.content) return "";
  return [
    sectionTitle(section.title, s),
    escapeLatex(section.content.trim()).replace(/\n+/g, "\\\\\n"),
  ].join("\n");
}

function experienceBlock(section: ExperienceSection, s: ResumeSettings): string {
  const items = section.items.filter(
    (i) => i.role || i.company || i.bullets.some(Boolean),
  );
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = formatRange(item.startDate, item.endDate, item.current);
      const bullets = item.bullets.filter(Boolean);
      const parts: string[] = [];

      const heading = `\\textbf{${escapeLatex(item.role)}}`;
      parts.push(
        range
          ? `${heading}\\hfill{\\small\\color{muted} ${escapeLatex(range)}}\\\\`
          : `${heading}\\\\`,
      );

      const sub = [item.company, item.location].filter(Boolean).map(escapeLatex);
      if (sub.length) parts.push(`{\\color{muted} ${sub.join(", ")}}`);

      if (bullets.length) {
        parts.push(
          "\\begin{itemize}",
          ...bullets.map((b) => `  \\item ${escapeLatex(b)}`),
          "\\end{itemize}",
        );
      }
      return parts.join("\n");
    })
    .join("\n\n\\smallskip\n");

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function educationBlock(section: EducationSection, s: ResumeSettings): string {
  const items = section.items.filter((i) => i.degree || i.school);
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = formatRange(item.startDate, item.endDate);
      const parts: string[] = [];
      const heading = `\\textbf{${escapeLatex(item.degree)}}`;
      parts.push(
        range
          ? `${heading}\\hfill{\\small\\color{muted} ${escapeLatex(range)}}\\\\`
          : `${heading}\\\\`,
      );
      const sub = [item.school, item.location].filter(Boolean).map(escapeLatex);
      if (sub.length) parts.push(`{\\color{muted} ${sub.join(", ")}}`);
      if (item.description) parts.push(`\\\\ ${escapeLatex(item.description)}`);
      return parts.join("\n");
    })
    .join("\n\n\\smallskip\n");

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function skillsBlock(section: SkillsSection, s: ResumeSettings): string {
  const groups = section.groups.filter((g) => g.skills.length > 0);
  if (!groups.length) return "";

  const body = groups
    .map((g) => {
      const skills = g.skills.map(escapeLatex).join(", ");
      return g.name
        ? `\\textbf{${escapeLatex(g.name)}:} ${skills}\\\\`
        : `${skills}\\\\`;
    })
    .join("\n");

  return `${sectionTitle(section.title, s)}\n${body}`;
}

function sectionBlock(section: Section, s: ResumeSettings): string {
  switch (section.type) {
    case "summary":
      return summaryBlock(section, s);
    case "experience":
      return experienceBlock(section, s);
    case "education":
      return educationBlock(section, s);
    case "skills":
      return skillsBlock(section, s);
  }
}

function preamble(s: ResumeSettings): string {
  const hex = s.accent.replace(/^#/, "").toUpperCase();
  const family =
    s.fontFamily === "sans"
      ? "\\renewcommand{\\familydefault}{\\sfdefault}"
      : s.fontFamily === "mono"
        ? "\\renewcommand{\\familydefault}{\\ttdefault}"
        : ""; // serif → default roman
  const rule =
    s.headingStyle === "plain" ? "" : "[{\\color{accent!30}\\titlerule}]";

  return [
    "\\documentclass[11pt,a4paper]{article}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage[utf8]{inputenc}",
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
    family,
    "\\setcounter{secnumdepth}{0}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "",
    "\\setlist[itemize]{leftmargin=1.2em, itemsep=1pt, topsep=2pt, label=\\textcolor{muted}{\\textbullet}}",
    `\\titleformat{\\section}{\\fontsize{${pt(s.fontSize * 1.12)}}{${pt(s.fontSize * 1.3)}}\\selectfont\\bfseries\\color{accent}}{}{0em}{}${rule}`,
    `\\titlespacing{\\section}{0pt}{${pt(s.fontSize * 1.1)}pt}{${pt(s.fontSize * 0.5)}pt}`,
  ].join("\n");
}

export function generateLatex(resume: {
  name: string;
  data: ResumeData;
}): string {
  const s = resume.data.settings ?? DEFAULT_SETTINGS;

  const blocks = resume.data.sections
    .map((section) => sectionBlock(section, s))
    .filter(Boolean)
    // Strip any trailing line-breaks so a block can't end with "\\" right
    // before the next \section or \end{document}.
    .map((b) => b.replace(/(?:\\\\\s*)+$/, ""))
    .join("\n\n");

  return [
    `% ${resume.name} — generated by ResumeAI`,
    preamble(s),
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
