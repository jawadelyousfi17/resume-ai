// Turns ResumeData into a complete .tex document.
//
// This reads the same `lib/templates` descriptor the on-screen preview does,
// so the PDF is the template the user picked rather than a generic rendering
// of their content. Where the two can't match exactly — a web layout and a
// typesetter don't agree on everything — the PDF follows the same decisions:
// same header shape, same heading treatment, same place for dates, same
// column count for skills.
//
// Everything is escaped so arbitrary user text can't break compilation.
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
import { getTemplate, tagColumns, type Template } from "./templates";
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

/** Everything the block writers need, resolved once. */
interface Ctx {
  s: ResumeSettings;
  t: Template;
  /** True while writing the contents of a dark rail. */
  onDark?: boolean;
}

const heading = (title: string, ctx: Ctx) => {
  const caps = ctx.s.headingStyle === "uppercase" || ctx.t.headingCaps;
  const text = escapeLatex(caps ? title.toUpperCase() : title);
  return `\\rsection{${text}}`;
};

/** Muted text, which has to lighten rather than darken inside a dark rail. */
const muted = (ctx: Ctx) => (ctx.onDark ? "railmuted" : "muted");

// ------------------------------------------------------------------ header

function headerBlock(data: ResumeData, ctx: Ctx): string {
  const { s, t } = ctx;
  const p = data.personal;
  const lines: string[] = [];

  const nameSize = `\\fontsize{${pt(s.fontSize * 1.95)}}{${pt(s.fontSize * 2.05)}}\\selectfont`;
  const titleSize = `\\fontsize{${pt(s.fontSize * 1.12)}}{${pt(s.fontSize * 1.3)}}\\selectfont`;
  const nameColor = ctx.onDark ? "white" : "ink";
  const titleColor = ctx.onDark ? "railmuted" : t.headerBand ? "muted" : "accent";

  const name = p.fullName
    ? `{${nameSize}\\bfseries\\color{${nameColor}} ${escapeLatex(p.fullName)}}`
    : "";
  const title = p.title
    ? `{${titleSize}\\color{${titleColor}} ${
        t.headerInlineTitle ? `\\itshape ${escapeLatex(p.title)}` : escapeLatex(p.title)
      }}`
    : "";

  // The title either sits beside the name or under it.
  if (name && title && t.headerInlineTitle) {
    lines.push(`${name}\\hspace{0.6em}${title}\\\\[4pt]`);
  } else {
    if (name) lines.push(`${name}\\\\[3pt]`);
    if (title) lines.push(`${title}\\\\[5pt]`);
  }

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
    const colour = muted(ctx);
    if (t.headerContacts === "grid" && !ctx.onDark) {
      // Two columns, filled row by row, so long addresses don't push the
      // whole row out of the text block.
      const rows: string[] = [];
      for (let i = 0; i < contacts.length; i += 2) {
        rows.push([contacts[i], contacts[i + 1] ?? ""].join(" & "));
      }
      lines.push(
        `{\\small\\color{${colour}}\\begin{tabular}{@{}p{0.48\\linewidth}p{0.48\\linewidth}@{}}`,
        `${rows.join("\\\\[1.5pt]\n")}`,
        "\\end{tabular}}",
      );
    } else if (ctx.onDark) {
      lines.push(`{\\small\\color{${colour}}${contacts.join("\\\\[2pt]\n")}}`);
    } else {
      lines.push(`{\\small\\color{${colour}} ${contacts.join(SEP)}}`);
    }
  }

  let body = lines.join("\n");

  if (t.headerAlign === "center" && !ctx.onDark) {
    body = `\\begin{center}\n${body}\n\\end{center}`;
  }

  if (t.headerRule) {
    body = [
      "{\\color{accent!50}\\rule{\\linewidth}{0.4pt}}\\\\[6pt]",
      body,
      "\\\\[6pt]{\\color{accent!50}\\rule{\\linewidth}{0.4pt}}",
    ].join("\n");
  }

  // A banded header bleeds to the page edge, which means stepping outside the
  // text block and painting the full paper width.
  if (t.headerBand && !ctx.onDark) {
    return [
      "\\noindent\\hspace*{-\\hoffsetleft}%",
      `\\colorbox{band}{\\begin{minipage}{\\dimexpr\\paperwidth-2\\fboxsep\\relax}`,
      `\\vspace{2pt}\\hspace*{\\hoffsetleft}\\begin{minipage}{\\dimexpr\\linewidth-2\\hoffsetleft\\relax}`,
      body,
      "\\end{minipage}\\vspace{4pt}",
      "\\end{minipage}}\\par\\vspace{10pt}",
    ].join("\n");
  }

  return `${body}\\par\\vspace{8pt}`;
}

// ------------------------------------------------------------------ blocks

function summaryBlock(section: SummarySection, ctx: Ctx): string {
  if (isMarkdownEmpty(section.content)) return "";
  return [
    heading(section.title, ctx),
    markdownToLatex(section.content, escapeLatex),
  ].join("\n");
}

/** The dates-and-place run, in whichever shape the template asks for. */
function metaText(range: string, location: string, ctx: Ctx): string {
  const parts = [range, location].filter(Boolean).map(escapeLatex);
  if (!parts.length) return "";
  const colour = muted(ctx);

  if (ctx.t.dates === "right-inline") {
    return `{\\small\\color{${colour}}${parts.join(" $|$ ")}}`;
  }

  // Stacked. `\\` inside a tabular cell would end the row, so the lines are
  // stacked inside a box instead.
  const side = ctx.t.dates === "left-column" ? "l" : "r";
  return parts.length > 1
    ? `{\\small\\color{${colour}}\\shortstack[${side}]{${parts.join("\\\\")}}}`
    : `{\\small\\color{${colour}}${parts[0]}}`;
}

/** One entry, laid out per the template's date style. Callers supply the
 *  entry's title line and its body; only the geometry differs. */
function entry(
  title: string,
  meta: string,
  body: string,
  ctx: Ctx,
): string {
  if (!meta) {
    return [title + "\\\\", body].filter(Boolean).join("\n");
  }

  if (ctx.t.dates === "left-column") {
    // A fixed narrow column of dates, then the entry beside it.
    return [
      "\\begin{tabularx}{\\linewidth}{@{}>{\\raggedright\\arraybackslash}p{7.6em}X@{}}",
      `${meta} & ${title}`,
      body ? `\\\\ & ${body}` : "",
      "\\end{tabularx}",
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Title on the left, dates hard right, body underneath at full width.
  return [
    "\\begin{tabularx}{\\linewidth}{@{}X>{\\raggedleft\\arraybackslash}p{11em}@{}}",
    `${title} & ${meta}`,
    "\\end{tabularx}",
    body,
  ]
    .filter(Boolean)
    .join("\n");
}

function experienceBlock(section: ExperienceSection, ctx: Ctx): string {
  const { s } = ctx;
  const items = section.items.filter(
    (i) => !i.hidden && (i.role || i.company || !isMarkdownEmpty(i.highlights)),
  );
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = showsDates(section)
        ? formatRange(item.startDate, item.endDate, item.current, s.language, s.dateFormat)
        : "";

      const title = [
        item.role ? `\\textbf{${escapeLatex(item.role)}}` : "",
        item.company
          ? `${item.role ? ", " : ""}\\textit{${escapeLatex(item.company)}}`
          : "",
      ].join("");

      const highlights = isMarkdownEmpty(item.highlights)
        ? ""
        : markdownToLatex(item.highlights, escapeLatex);

      return entry(title, metaText(range, item.location, ctx), highlights, ctx);
    })
    .join("\n\n\\smallskip\n");

  return `${heading(section.title, ctx)}\n${body}`;
}

function educationBlock(section: EducationSection, ctx: Ctx): string {
  const { s } = ctx;
  const items = section.items.filter((i) => !i.hidden && (i.degree || i.school));
  if (!items.length) return "";

  const body = items
    .map((item) => {
      const range = showsDates(section)
        ? formatRange(item.startDate, item.endDate, false, s.language, s.dateFormat)
        : "";

      const title = [
        item.degree ? `\\textbf{${escapeLatex(item.degree)}}` : "",
        item.school
          ? `${item.degree ? ", " : ""}\\textit{${escapeLatex(item.school)}}`
          : "",
      ].join("");

      const description = isMarkdownEmpty(item.description)
        ? ""
        : markdownToLatex(item.description, escapeLatex);

      return entry(title, metaText(range, item.location, ctx), description, ctx);
    })
    .join("\n\n\\smallskip\n");

  return `${heading(section.title, ctx)}\n${body}`;
}

/** Five dots, filled to the stated level — the printed form of the preview's
 *  proficiency meter. */
function dots(level: number, ctx: Ctx): string {
  const filled = Math.round((Math.min(Math.max(level, 0), 4) / 4) * 5);
  const on = ctx.onDark ? "white" : "accent";
  const off = ctx.onDark ? "railmuted" : "dotempty";

  return Array.from({ length: 5 }, (_, i) =>
    i < filled
      ? `{\\color{${on}}$\\bullet$}`
      : `{\\color{${off}}$\\bullet$}`,
  ).join("\\,");
}

function tagBlock(section: SkillsSection, ctx: Ctx): string {
  const { s, t } = ctx;
  const items = section.items.filter((i) => !i.hidden && i.name.trim());
  if (!items.length) return "";

  const label = (item: (typeof items)[number]) => {
    const level = levelLabel(section.type, item.level, s.language);
    const name = escapeLatex(item.name.trim());
    return level
      ? `${name} {\\small\\color{${muted(ctx)}}(${escapeLatex(level)})}`
      : name;
  };

  let body: string;

  if (t.tags === "inline") {
    body = items
      .map(label)
      .join(` {\\color{${muted(ctx)}}$|$} `);
  } else if (t.tags === "dots") {
    // Name left, meter right, two per row.
    const cells = items.map(
      (item) => `${escapeLatex(item.name.trim())} & ${dots(item.level ?? 3, ctx)}`,
    );
    const rows: string[] = [];
    for (let i = 0; i < cells.length; i += 2) {
      rows.push([cells[i], cells[i + 1] ?? " & "].join(" & "));
    }
    body = [
      "\\begin{tabularx}{\\linewidth}{@{}Xl@{\\hspace{2em}}Xl@{}}",
      rows.join("\\\\[2pt]\n"),
      "\\end{tabularx}",
    ].join("\n");
  } else {
    // A grid of bulleted cells, filled row by row.
    const cols = tagColumns(t.tags);
    const cells = items.map((item) => `\\textcolor{${muted(ctx)}}{\\tiny$\\bullet$}~${label(item)}`);
    const rows: string[] = [];
    for (let i = 0; i < cells.length; i += cols) {
      const row = cells.slice(i, i + cols);
      while (row.length < cols) row.push("");
      rows.push(row.join(" & "));
    }
    body = [
      `\\begin{tabularx}{\\linewidth}{@{}${"X".repeat(cols)}@{}}`,
      rows.join("\\\\[2.5pt]\n"),
      "\\end{tabularx}",
    ].join("\n");
  }

  return `${heading(section.title, ctx)}\n${body}`;
}

function sectionBlock(section: Section, ctx: Ctx): string {
  switch (section.type) {
    case "summary":
      return summaryBlock(section, ctx);
    case "experience":
    case "projects":
    case "volunteering":
      return experienceBlock(section, ctx);
    case "education":
    case "certifications":
    case "awards":
      return educationBlock(section, ctx);
    case "skills":
    case "languages":
    case "interests":
      return tagBlock(section, ctx);
  }
}

// ------------------------------------------------------------------- fonts

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
function fontSetup(ctx: Ctx): string[] {
  const { s, t } = ctx;
  const { script } = language(s.language);
  // The template owns the typeface; the font control picks within it.
  const family: FontFamily = t.font === "serif" ? "serif" : s.fontFamily;

  if (script === "latin") {
    return [
      "\\usepackage[T1]{fontenc}",
      "\\usepackage[utf8]{inputenc}",
      family === "sans"
        ? "\\renewcommand{\\familydefault}{\\sfdefault}"
        : family === "mono"
          ? "\\renewcommand{\\familydefault}{\\ttdefault}"
          : "", // serif → default roman
    ];
  }

  const candidates = SCRIPT_FONTS[script][family];
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

// ---------------------------------------------------------------- preamble

/** The `\rsection` macro, which is where a template's heading style lives. */
function sectionMacro(ctx: Ctx): string[] {
  const { s, t } = ctx;
  const size = `\\fontsize{${pt(s.fontSize * 1.06)}}{${pt(s.fontSize * 1.25)}}\\selectfont`;
  const before = pt(s.fontSize * 1.15 * t.density);
  const after = pt(s.fontSize * 0.42);
  const align = t.headingAlign === "center" ? "c" : "l";

  // A rule that follows the accent when the template says so, and the heading
  // colour otherwise.
  const ruleColor = t.headingAccentRule ? "accent" : "ink";
  const textColor = t.headingAccentRule ? "accent" : "ink";

  if (t.headingStyle === "band") {
    return [
      "\\newcommand{\\rsection}[1]{%",
      `  \\par\\addvspace{${before}pt}%`,
      "  \\noindent\\colorbox{band}{\\makebox[\\dimexpr\\linewidth-2\\fboxsep\\relax]" +
        `[${align}]{${size}\\bfseries\\color{headingink}\\strut #1}}%`,
      `  \\par\\nobreak\\vspace{${after}pt}%`,
      "}",
    ];
  }

  if (t.headingStyle === "plain") {
    return [
      "\\newcommand{\\rsection}[1]{%",
      `  \\par\\addvspace{${before}pt}%`,
      `  \\noindent\\makebox[\\linewidth][${align}]{${size}\\bfseries\\color{${textColor}}#1}%`,
      `  \\par\\nobreak\\vspace{${after}pt}%`,
      "}",
    ];
  }

  return [
    "\\newcommand{\\rsection}[1]{%",
    `  \\par\\addvspace{${before}pt}%`,
    `  \\noindent\\makebox[\\linewidth][${align}]{${size}\\bfseries\\color{${textColor}}#1}%`,
    "  \\par\\nobreak\\vspace{1.5pt}%",
    `  \\noindent{\\color{${ruleColor}}\\rule{\\linewidth}{0.9pt}}%`,
    `  \\par\\nobreak\\vspace{${after}pt}%`,
    "}",
  ];
}

function preamble(ctx: Ctx, format: PageFormat): string {
  const { s, t } = ctx;
  const hex = s.accent.replace(/^#/, "").toUpperCase();

  // Two-column templates paint their rail behind the text block, so the text
  // block itself has to start clear of it.
  const railed = t.sidebar !== "none";
  const stripped = t.edgeStrip;
  const leftMargin = railed
    ? s.marginX
    : stripped
      ? s.marginX + 14
      : s.marginX;

  const lines = [
    `\\documentclass[11pt,${PAGE_SIZES[format].latex}]{article}`,
    ...fontSetup(ctx),
    `\\usepackage[top=${s.marginY}mm,bottom=${s.marginY}mm,left=${leftMargin}mm,right=${s.marginX}mm]{geometry}`,
    "\\usepackage{enumitem}",
    "\\usepackage{xcolor}",
    "\\usepackage{tabularx}",
    "\\usepackage{array}",
    "\\usepackage{anyfontsize}",
    "\\usepackage{eso-pic}",
    "\\usepackage[hidelinks]{hyperref}",
  ];

  if (railed) lines.push("\\usepackage{paracol}");

  lines.push(
    "",
    `\\definecolor{accent}{HTML}{${hex}}`,
    "\\definecolor{ink}{HTML}{0F172A}",
    "\\definecolor{muted}{HTML}{475569}",
    "\\definecolor{railmuted}{HTML}{C8D2DC}",
    "\\definecolor{dotempty}{HTML}{D5D9E0}",
    // The grey a banded heading sits on, and the tint behind a light rail.
    t.headingStyle === "band" || t.headerBand
      ? "\\definecolor{band}{HTML}{ECEEF1}"
      : "\\definecolor{band}{HTML}{ECEEF1}",
    t.sidebar === "dark"
      ? "\\colorlet{rail}{accent}"
      : "\\colorlet{rail}{accent!8}",
    // Banded headings keep dark type; on a dark rail they invert.
    "\\colorlet{headingink}{ink}",
    "",
    "\\setcounter{secnumdepth}{0}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "\\setlength{\\tabcolsep}{0pt}",
    "\\renewcommand{\\arraystretch}{1.05}",
    "",
    "\\setlist[itemize]{leftmargin=1.2em, itemsep=1pt, topsep=2pt, parsep=0pt, label=\\textcolor{muted}{\\textbullet}}",
    "",
    // The distance from the paper edge to the text block, which a full-bleed
    // header has to reach back across.
    "\\newlength{\\hoffsetleft}",
    "\\setlength{\\hoffsetleft}{\\dimexpr\\oddsidemargin+1in\\relax}",
    ...sectionMacro(ctx),
  );

  if (railed) {
    // The rail is painted behind everything, then paracol's left column is
    // sized to sit on top of it.
    lines.push(
      "",
      "\\columnratio{0.34}",
      "\\setlength{\\columnsep}{6mm}",
      "\\newlength{\\railwidth}",
      "\\setlength{\\railwidth}{\\dimexpr\\hoffsetleft+0.34\\textwidth+0.5\\columnsep\\relax}",
      "\\AddToShipoutPictureBG{\\AtPageLowerLeft{\\textcolor{rail}{\\rule{\\railwidth}{\\paperheight}}}}",
    );
  } else if (stripped) {
    lines.push(
      "",
      "\\newlength{\\stripwidth}",
      "\\setlength{\\stripwidth}{0.07\\paperwidth}",
      "\\AddToShipoutPictureBG{\\AtPageLowerLeft{\\textcolor{accent}{\\rule{\\stripwidth}{\\paperheight}}}}",
    );
  }

  return lines.filter((line) => line !== "").join("\n");
}

// ---------------------------------------------------------------- assembly

const trimBreaks = (block: string) => block.replace(/(?:\\\\\s*)+$/, "");

export function generateLatex(resume: {
  name: string;
  data: ResumeData;
  format?: PageFormat;
}): string {
  const s = resume.data.settings ?? DEFAULT_SETTINGS;
  const t = getTemplate(s.template);
  const ctx: Ctx = { s, t };
  const format = resume.format ?? "A4";

  const write = (sections: Section[], c: Ctx) =>
    sections
      .map((section) => sectionBlock(section, c))
      .filter(Boolean)
      .map(trimBreaks)
      .join("\n\n");

  let body: string;

  if (t.sidebar !== "none") {
    // The rail carries the short sections; the main column carries history.
    const railSections = resume.data.sections.filter(
      (section) =>
        section.type === "summary" ||
        ["skills", "languages", "interests"].includes(section.type),
    );
    const mainSections = resume.data.sections.filter(
      (section) => !railSections.includes(section),
    );

    const dark = t.sidebar === "dark";
    const railCtx: Ctx = { ...ctx, onDark: dark };

    const railHead =
      t.sidebarHeader === "inside" ? headerBlock(resume.data, railCtx) : "";
    const aboveHead =
      t.sidebarHeader === "above" ? headerBlock(resume.data, ctx) : "";

    body = [
      aboveHead,
      // Inside a dark rail every colour inverts, including the heading band.
      dark
        ? "\\begin{paracol}{2}\\colorlet{headingink}{white}\\color{white}"
        : "\\begin{paracol}{2}",
      railHead,
      write(railSections, railCtx),
      "\\switchcolumn",
      "\\colorlet{headingink}{ink}\\color{black}",
      write(mainSections, ctx),
      "\\end{paracol}",
    ]
      .filter(Boolean)
      .join("\n\n");
  } else {
    body = [headerBlock(resume.data, ctx), write(resume.data.sections, ctx)]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `% ${resume.name} — generated by ResumeAI`,
    preamble(ctx, format),
    "",
    "\\begin{document}",
    `\\fontsize{${pt(s.fontSize)}}{${pt(s.fontSize * s.lineHeight)}}\\selectfont`,
    "",
    body,
    "",
    "\\end{document}",
    "",
  ].join("\n");
}
