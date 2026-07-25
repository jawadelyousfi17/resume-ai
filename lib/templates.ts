// The five resume templates. A template is a layout + typographic
// personality; the Customize panel's settings (accent, size, spacing) stay
// user-owned on top of whichever template is selected.

import type { ResumeSettings, TemplateId } from "./types";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  /** Page structure: one flowing column, or a narrow rail beside a main column. */
  layout: "single" | "sidebar";
  /** How the name / title / contact block is presented. */
  header: "left" | "centered" | "band";
  /** Colour of the name itself. Everything else follows the accent. */
  nameColor: "ink" | "accent";
  /** Hairline under the whole header block. */
  headerRule: boolean;
  /** Multiplies the gap between sections, in em. */
  density: number;
  /** Applied to settings when the template is picked, unless the user has
   *  already moved that control away from its default. */
  presets: Pick<ResumeSettings, "fontFamily" | "headingStyle">;
}

export const TEMPLATES: Template[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Left-aligned header with underlined section rules. Safe everywhere.",
    layout: "single",
    header: "left",
    nameColor: "ink",
    headerRule: false,
    density: 1,
    presets: { fontFamily: "sans", headingStyle: "underline" },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Name on a tinted accent band, uppercase headings underneath.",
    layout: "single",
    header: "band",
    nameColor: "ink",
    headerRule: false,
    density: 1,
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "No rules at all. Space does the separating. Lots of white.",
    layout: "single",
    header: "left",
    nameColor: "ink",
    headerRule: false,
    density: 1.3,
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Contact and skills in a tinted rail, history in the main column.",
    layout: "sidebar",
    header: "left",
    nameColor: "accent",
    headerRule: false,
    density: 0.95,
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Serif type, centred header between rules. Reads like print.",
    layout: "single",
    header: "centered",
    nameColor: "ink",
    headerRule: true,
    density: 1.1,
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
];

export const getTemplate = (id: TemplateId | undefined): Template =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
