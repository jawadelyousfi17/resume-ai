// Translating a finished resume into another language.
//
// Rather than asking for a rewritten document — which invites the model to
// restructure, merge, or drop things — the document is taken apart into keyed
// strings, only those are translated, and the results are written back onto
// the original. Structure, ids, dates and ordering can't drift, because the
// model never sees them.

import {
  isCredentialSection,
  isTagGroupSection,
  isTimelineSection,
} from "@/lib/defaults";
import { isMarkdownEmpty } from "@/lib/markdown";
import { language, type LanguageCode } from "@/lib/i18n";
import type { ResumeData } from "@/lib/types";

export interface TranslatableString {
  /** Stable address of this string inside the document. */
  key: string;
  text: string;
}

/**
 * Every string on the resume worth translating.
 *
 * Deliberately absent: employers, schools, URLs, emails, phone numbers and
 * dates. Those are either proper nouns or machine-readable, and translating
 * them does damage.
 */
export function collectStrings(data: ResumeData): TranslatableString[] {
  const out: TranslatableString[] = [];
  const add = (key: string, text: string) => {
    if (text && text.trim()) out.push({ key, text });
  };

  add("personal.title", data.personal.title);
  add("personal.location", data.personal.location);

  for (const section of data.sections) {
    add(`${section.id}.title`, section.title);

    if (section.type === "summary") {
      if (!isMarkdownEmpty(section.content)) {
        add(`${section.id}.content`, section.content);
      }
    } else if (isTimelineSection(section)) {
      for (const item of section.items) {
        add(`${section.id}.${item.id}.role`, item.role);
        add(`${section.id}.${item.id}.location`, item.location);
        if (!isMarkdownEmpty(item.highlights)) {
          add(`${section.id}.${item.id}.highlights`, item.highlights);
        }
      }
    } else if (isCredentialSection(section)) {
      for (const item of section.items) {
        add(`${section.id}.${item.id}.degree`, item.degree);
        add(`${section.id}.${item.id}.location`, item.location);
        if (!isMarkdownEmpty(item.description)) {
          add(`${section.id}.${item.id}.description`, item.description);
        }
      }
    } else if (isTagGroupSection(section)) {
      for (const item of section.items) {
        add(`${section.id}.${item.id}.name`, item.name);
      }
    }
  }

  return out;
}

/**
 * Writes translations back onto the document.
 *
 * A key the model didn't return leaves the original in place, so a partial
 * answer degrades into a partly-translated resume rather than a broken one.
 */
export function applyTranslations(
  data: ResumeData,
  translations: Map<string, string>,
  target: LanguageCode,
): ResumeData {
  const next = structuredClone(data);
  const take = (key: string, current: string) =>
    translations.get(key)?.trim() || current;

  next.personal.title = take("personal.title", next.personal.title);
  next.personal.location = take("personal.location", next.personal.location);

  for (const section of next.sections) {
    section.title = take(`${section.id}.title`, section.title);

    if (section.type === "summary") {
      section.content = take(`${section.id}.content`, section.content);
    } else if (isTimelineSection(section)) {
      for (const item of section.items) {
        const at = `${section.id}.${item.id}`;
        item.role = take(`${at}.role`, item.role);
        item.location = take(`${at}.location`, item.location);
        item.highlights = take(`${at}.highlights`, item.highlights);
      }
    } else if (isCredentialSection(section)) {
      for (const item of section.items) {
        const at = `${section.id}.${item.id}`;
        item.degree = take(`${at}.degree`, item.degree);
        item.location = take(`${at}.location`, item.location);
        item.description = take(`${at}.description`, item.description);
      }
    } else if (isTagGroupSection(section)) {
      for (const item of section.items) {
        item.name = take(`${section.id}.${item.id}.name`, item.name);
      }
    }
  }

  // Dates, proficiency labels and text direction all follow the setting.
  next.settings = { ...next.settings, language: target };
  return next;
}

/** One entry per string sent, echoing its key. */
export const TRANSLATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "text"],
        properties: {
          key: {
            type: "string",
            description: "Copy the key exactly as given. Do not translate it.",
          },
          text: { type: "string", description: "The translated text." },
        },
      },
    },
  },
} as const;

export function translationPrompt(target: LanguageCode) {
  const { english } = language(target);

  return {
    system: `You translate resume content into ${english}.

- Return one entry per item you were given, echoing its key character for character. The key is an address, not content — never translate or alter it.
- Translate the text and nothing else. Do not add, remove, summarise, reorder, or improve anything.
- Leave proper nouns alone: employers, schools, product names, programming languages, frameworks, and tools keep their original form. "Senior Engineer at Monzo using Kubernetes" translates the job title, not Monzo or Kubernetes.
- Place names take their usual ${english} form where one exists, and stay as written where it doesn't.
- Preserve Markdown exactly: a line starting with "- " stays a bullet, **bold** stays bold, and the number of bullets never changes.
- Use the register a ${english}-language resume is written in.`,

    user: (items: TranslatableString[]) =>
      `Translate each item's text into ${english}.\n\n<items>\n${JSON.stringify(items)}\n</items>`,
  };
}
