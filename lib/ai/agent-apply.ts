"use client";

// Executing one tool call against the document.
//
// Every function here runs inside the store's `update(draft => …)`, so it
// mutates the draft in place — the same contract `lib/ai/apply.ts` has for the
// one-shot writing tools.
//
// Two things come back from a call. `summary` is the line the chat prints
// under the reply ("Summary rewritten"); `detail` is what the model reads on
// its next turn. They differ on purpose: the model needs the id it just
// created, and the person does not.

import {
  attachEntry,
  createSection,
  insertSection,
  isCredentialSection,
  isTagGroupSection,
  isTimelineSection,
  newEducationItem,
  newExperienceItem,
  newSkillItem,
} from "@/lib/defaults";
import { language } from "@/lib/i18n";
import {
  TEMPLATES,
  applyTemplate,
  getTemplate,
  inCategory,
  isTemplateId,
  type TemplateCategory,
} from "@/lib/templates";
import { FONTS } from "@/lib/fonts";
import type {
  DateFormat,
  HeadingStyle,
  IconStyle,
  ResumeData,
  Section,
  SectionType,
  TagLayout,
} from "@/lib/types";
import { locateField, readField, writeField } from "./tailoring";
import type { AgentToolCall, AgentToolResult } from "./agent";

/** A tool said no. Carries a sentence the model can act on. */
class ToolError extends Error {}

/**
 * Runs one call and reports what happened.
 *
 * Never throws: a bad id or a missing argument is ordinary — the model wrote
 * it from an outline that may be a turn out of date — and it recovers by
 * reading the error and trying again. A thrown exception would take the whole
 * conversation down instead.
 */
export function runToolCall(
  call: AgentToolCall,
  /**
   * Applies a mutation to the document the loop is working on.
   *
   * Deliberately not the store's `update`: several calls can arrive in one
   * turn, and the store's copy only catches up after React has re-rendered, so
   * a loop that read it back between calls would be a render behind. The
   * caller owns a working copy and pushes it to the store once the turn is
   * done.
   */
  apply: (mutator: (draft: ResumeData) => void) => void,
): AgentToolResult {
  try {
    // Read-only tools answer without touching the document.
    if (call.name === "list_templates") {
      return { id: call.id, edited: false, ...listTemplates(call.input) };
    }

    let outcome: Outcome | null = null;
    apply((draft) => {
      outcome = perform(call, draft);
    });

    const done = outcome as Outcome | null;
    if (!done) throw new ToolError("That edit didn't happen. Try again.");
    return { id: call.id, edited: true, summary: done.summary, detail: done.detail };
  } catch (err) {
    const message =
      err instanceof ToolError
        ? err.message
        : err instanceof Error
          ? err.message
          : "That edit failed.";
    return {
      id: call.id,
      edited: false,
      isError: true,
      summary: message,
      detail: message,
    };
  }
}

interface Outcome {
  summary: string;
  detail: string;
}

function perform(call: AgentToolCall, draft: ResumeData): Outcome {
  switch (call.name) {
    case "set_field":
      return setField(call.input, draft);
    case "set_skills":
      return setSkills(call.input, draft);
    case "add_section":
      return addSection(call.input, draft);
    case "remove_section":
      return removeSection(call.input, draft);
    case "move_section":
      return moveSection(call.input, draft);
    case "add_entry":
      return addEntry(call.input, draft);
    case "remove_entry":
      return removeEntry(call.input, draft);
    case "move_entry":
      return moveEntry(call.input, draft);
    case "set_design":
      return setDesign(call.input, draft);
    default:
      throw new ToolError(`There is no tool called ${call.name}.`);
  }
}

/* -------------------------------------------------------------------------- */
/* Reading arguments                                                          */
/* -------------------------------------------------------------------------- */

function str(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new ToolError(`\`${key}\` is required and must be a non-empty string.`);
  }
  return value;
}

const optionalStr = (input: Record<string, unknown>, key: string) => {
  const value = input[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

function int(input: Record<string, unknown>, key: string): number {
  const value = input[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new ToolError(`\`${key}\` must be a whole number, 0 or more.`);
  }
  return value;
}

function findSection(draft: ResumeData, id: string): Section {
  const section = draft.sections.find((s) => s.id === id);
  if (!section) {
    throw new ToolError(
      `No section with id ${id} — read the outline again for the current ids.`,
    );
  }
  return section;
}

/* -------------------------------------------------------------------------- */
/* Writing                                                                    */
/* -------------------------------------------------------------------------- */

function setField(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const key = str(input, "key");
  const value = input.value;
  if (typeof value !== "string") {
    throw new ToolError("`value` is required and must be a string.");
  }

  if (readField(draft, key) === null) {
    throw new ToolError(
      `\`${key}\` isn't a field on this resume — read the outline again for the current keys.`,
    );
  }

  const where = locateField(draft, key);
  if (!writeField(draft, key, value.trim())) {
    throw new ToolError(`Couldn't write to \`${key}\`.`);
  }

  return {
    summary: `${where} rewritten`,
    detail: `Wrote ${key}. It now reads: ${value.trim().slice(0, 400)}`,
  };
}

function setSkills(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  if (!isTagGroupSection(section)) {
    throw new ToolError(
      `${section.title} is a ${section.type} section — set_skills only works on skills, languages and interests.`,
    );
  }

  const raw = input.names;
  if (!Array.isArray(raw)) throw new ToolError("`names` must be an array of strings.");

  const names = raw
    .filter((name): name is string => typeof name === "string")
    .map((name) => name.trim())
    .filter(Boolean);
  if (!names.length) {
    throw new ToolError("`names` was empty — use remove_section to clear a section.");
  }

  // Levels are the person's own claim, so a name that survives the rewrite
  // keeps the one it had rather than being reset by an edit to the wording.
  const levels = new Map(
    section.items.map((item) => [item.name.trim().toLowerCase(), item.level]),
  );
  section.items = names.map((name) => {
    const level = levels.get(name.toLowerCase());
    return { id: crypto.randomUUID(), name, ...(level ? { level } : {}) };
  });

  return {
    summary: `${section.title} set to ${names.length} ${names.length === 1 ? "entry" : "entries"}`,
    detail: `${section.title} now lists: ${names.join(", ")}`,
  };
}

const SECTION_TYPES = new Set<string>([
  "summary",
  "experience",
  "projects",
  "volunteering",
  "education",
  "certifications",
  "awards",
  "skills",
  "languages",
  "interests",
]);

function addSection(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const type = str(input, "type");
  if (!SECTION_TYPES.has(type)) {
    throw new ToolError(`\`${type}\` isn't a section type.`);
  }
  if (type === "summary" && draft.sections.some((s) => s.type === "summary")) {
    throw new ToolError(
      "This resume already has a summary — write to its content field instead.",
    );
  }

  const section = createSection(
    type as SectionType,
    language(draft.settings.language).code,
  );
  const title = optionalStr(input, "title");
  if (title) section.title = title;

  insertSection(draft.sections, section);

  const items = "items" in section ? section.items : [];
  return {
    summary: `Added a ${section.title} section`,
    detail:
      `Added section ${section.id} ("${section.title}", type ${type}).` +
      (items.length
        ? ` It came with one blank entry, id ${items[0]!.id} — fill it in or remove it.`
        : ""),
  };
}

function removeSection(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  draft.sections = draft.sections.filter((s) => s.id !== section.id);
  return {
    summary: `Removed the ${section.title} section`,
    detail: `Deleted section ${section.id} ("${section.title}") and its entries.`,
  };
}

function moveSection(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  const to = int(input, "position");

  const rest = draft.sections.filter((s) => s.id !== section.id);
  const at = Math.min(to, rest.length);
  rest.splice(at, 0, section);
  draft.sections = rest;

  return {
    summary: `Moved ${section.title} to position ${at + 1}`,
    detail: `${section.title} is now section ${at} of ${rest.length}.`,
  };
}

function addEntry(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  if (section.type === "summary") {
    throw new ToolError(
      "A summary holds one paragraph, not entries — write to its content field.",
    );
  }

  const text = optionalStr(input, "text") ?? "";
  let label: string;

  if (isTimelineSection(section)) {
    const item = newExperienceItem();
    item.role = optionalStr(input, "role") ?? "";
    item.company = optionalStr(input, "company") ?? "";
    item.location = optionalStr(input, "location") ?? "";
    item.startDate = optionalStr(input, "start_date") ?? "";
    item.endDate = optionalStr(input, "end_date") ?? "";
    item.current = input.current === true;
    item.highlights = text;
    attachEntry(section, item);
    label = [item.role, item.company].filter(Boolean).join(" at ") || "an entry";
    return done(section, item.id, label);
  }

  if (isCredentialSection(section)) {
    const item = newEducationItem();
    item.degree = optionalStr(input, "degree") ?? "";
    item.school = optionalStr(input, "school") ?? "";
    item.location = optionalStr(input, "location") ?? "";
    item.startDate = optionalStr(input, "start_date") ?? "";
    item.endDate = optionalStr(input, "end_date") ?? "";
    item.description = text;
    attachEntry(section, item);
    label = [item.degree, item.school].filter(Boolean).join(" at ") || "an entry";
    return done(section, item.id, label);
  }

  const item = newSkillItem();
  item.name = optionalStr(input, "name") ?? "";
  if (!item.name) {
    throw new ToolError("`name` is required when adding to a skills-style section.");
  }
  attachEntry(section, item);
  return done(section, item.id, item.name);

  function done(target: Section, id: string, name: string): Outcome {
    const count = "items" in target ? target.items.length : 0;
    return {
      summary: `Added ${name} to ${target.title}`,
      detail: `Added entry ${id} to ${target.id} ("${target.title}"). It is entry ${count - 1} of ${count}.`,
    };
  }
}

function removeEntry(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  if (!("items" in section)) {
    throw new ToolError(`${section.title} has no entries to remove.`);
  }

  const id = str(input, "item_id");
  const item = section.items.find((i) => i.id === id);
  if (!item) {
    throw new ToolError(
      `No entry with id ${id} in ${section.title} — read the outline again.`,
    );
  }

  const name =
    ("role" in item && item.role) ||
    ("degree" in item && item.degree) ||
    ("name" in item && item.name) ||
    "an entry";

  // Spliced in place rather than reassigned: `items` is a union of three entry
  // arrays, and TypeScript can't see that a filtered copy is still whichever
  // one it started as.
  const items: { id: string }[] = section.items;
  items.splice(items.findIndex((i) => i.id === id), 1);
  return {
    summary: `Removed ${name} from ${section.title}`,
    detail: `Deleted entry ${id} from ${section.id}.`,
  };
}

function moveEntry(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const section = findSection(draft, str(input, "section_id"));
  if (!("items" in section)) {
    throw new ToolError(`${section.title} has no entries to reorder.`);
  }

  const id = str(input, "item_id");
  const from = section.items.findIndex((i) => i.id === id);
  if (from === -1) {
    throw new ToolError(`No entry with id ${id} in ${section.title}.`);
  }

  // `moveById` swaps two entries by id; the tool addresses the destination by
  // position, so this splices in place — same reason as removeEntry above.
  const items: { id: string }[] = section.items;
  const to = Math.min(int(input, "position"), items.length - 1);
  items.splice(to, 0, items.splice(from, 1)[0]!);

  return {
    summary: `Reordered ${section.title}`,
    detail: `Entry ${id} moved from position ${from} to ${to}.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Design                                                                     */
/* -------------------------------------------------------------------------- */

const CATEGORIES = new Set<string>([
  "ats",
  "classic",
  "modern",
  "minimal",
  "photo",
  "two-column",
  "compact",
]);

function listTemplates(input: Record<string, unknown>): Outcome {
  const category = str(input, "category");
  if (!CATEGORIES.has(category)) {
    throw new ToolError(`\`${category}\` isn't a template category.`);
  }

  // Capped: the gallery runs to hundreds, and a list that long crowds out the
  // resume itself in the model's context for no gain — it only needs enough to
  // choose from.
  const all = TEMPLATES.filter((t) => inCategory(t, category as TemplateCategory));
  const shown = all.slice(0, 40);

  return {
    summary: `Looked up ${category} templates`,
    detail:
      `${all.length} ${category} templates` +
      (shown.length < all.length ? `, first ${shown.length}` : "") +
      `:\n${shown.map((t) => `${t.id} — ${t.name}: ${t.short}`).join("\n")}`,
  };
}

const HEX = /^#[0-9a-f]{6}$/i;
const FONT_IDS = new Set<string>(FONTS.map((font) => font.id));
const HEADING_STYLES = new Set<string>(["underline", "plain", "uppercase"]);
const DATE_FORMATS = new Set<string>(["short", "long", "numeric", "iso"]);
const ICON_STYLES = new Set<string>(["solid", "line", "rounded", "classic", "none"]);
const TAG_STYLES = new Set<string>([
  "auto",
  "columns-1",
  "columns-2",
  "columns-3",
  "columns-4",
  "dots",
  "bars",
  "inline",
]);

function setDesign(input: Record<string, unknown>, draft: ResumeData): Outcome {
  const changed: string[] = [];
  const s = draft.settings;

  // The template goes first: applying one resets the look to its own choices,
  // so anything else in the same call has to land after it to survive.
  const template = optionalStr(input, "template");
  if (template) {
    if (!isTemplateId(template)) {
      throw new ToolError(
        `\`${template}\` isn't a template id — call list_templates for the real ones.`,
      );
    }
    applyTemplate(s, getTemplate(template));
    changed.push(`template to ${getTemplate(template).name}`);
  }

  const colour = (key: string, field: "accent" | "pageColor" | "textColor" | "headingColor", label: string) => {
    const value = optionalStr(input, key);
    if (!value) return;
    if (!HEX.test(value)) {
      throw new ToolError(`\`${key}\` must be a hex colour like "#2563eb".`);
    }
    s[field] = value;
    changed.push(`${label} to ${value}`);
  };
  colour("accent", "accent", "accent");
  colour("page_color", "pageColor", "page colour");
  colour("text_color", "textColor", "text colour");
  colour("heading_color", "headingColor", "heading colour");

  const font = optionalStr(input, "font_family");
  if (font) {
    if (!FONT_IDS.has(font)) throw new ToolError(`\`${font}\` isn't a font id.`);
    s.fontFamily = font as typeof s.fontFamily;
    changed.push(`font to ${font}`);
  }

  const number = (key: string, field: "fontSize" | "lineHeight" | "marginX" | "marginY", min: number, max: number, label: string) => {
    const value = input[key];
    if (value === undefined) return;
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
      throw new ToolError(`\`${key}\` must be a number between ${min} and ${max}.`);
    }
    s[field] = value;
    changed.push(`${label} to ${value}`);
  };
  number("font_size", "fontSize", 8, 14, "font size");
  number("line_height", "lineHeight", 1, 2, "line height");
  number("margin_x", "marginX", 5, 40, "side margins");
  number("margin_y", "marginY", 5, 40, "top and bottom margins");

  const pick = <T extends string>(key: string, allowed: Set<string>, set: (value: T) => void, label: string) => {
    const value = optionalStr(input, key);
    if (!value) return;
    if (!allowed.has(value)) throw new ToolError(`\`${value}\` isn't a valid ${key}.`);
    set(value as T);
    changed.push(`${label} to ${value}`);
  };
  pick<HeadingStyle>("heading_style", HEADING_STYLES, (v) => (s.headingStyle = v), "headings");
  pick<DateFormat>("date_format", DATE_FORMATS, (v) => (s.dateFormat = v), "date format");
  pick<IconStyle>("icon_style", ICON_STYLES, (v) => (s.iconStyle = v), "contact icons");
  pick<TagLayout>("tag_style", TAG_STYLES, (v) => (s.tagStyle = v), "skills layout");

  if (!changed.length) {
    throw new ToolError("No design properties were given, so nothing changed.");
  }

  return {
    summary: `Changed ${changed.length === 1 ? changed[0]! : `${changed.length} design settings`}`,
    detail: `Set ${changed.join(", ")}.`,
  };
}
