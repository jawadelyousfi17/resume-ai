// The document behind "Start from this example" and "Use this template".
//
// Both buttons promise the same thing — a resume that opens looking like the
// page it was pressed on — and differ only in how much of it is written. An
// example brings its whole document, template and all; a template brings the
// look and nothing else. They meet here as one seed, and /start writes
// whichever it was handed.
//
// Deliberately not marked `server-only`: nothing here reads a session or the
// database, and the same two functions are what a future client-side flow
// would need.

import { applyExampleLook } from "./content/example-look";
import { getExample, toResumeData } from "./content/resume-examples";
import { createEmptyResume } from "./defaults";
import { applyTemplate, getTemplate, isTemplateId } from "./templates";
import type { ResumeData } from "./types";

export interface ResumeSeed {
  /** What the resume is called on the dashboard before it's renamed. */
  name: string;
  data: ResumeData;
}

/**
 * The example's own document.
 *
 * The very same `toResumeData` the example page renders with, so what the
 * editor opens on is what was on screen — the writing, the template, the font
 * and the accent it was designed around.
 */
export function seedFromExample(
  slug: string,
  /** What the page's switcher was showing when the button was pressed. Both
   *  optional; anything unrecognised falls back to the example's own. */
  look: { template?: string; accent?: string } = {},
): ResumeSeed | null {
  const example = getExample(slug);
  if (!example) return null;

  // Dressed by the same function the page's preview uses, and unconditionally
  // — not only when a switch was made. The page substitutes a typeface for
  // every template it shows, so a resume opened without that substitution
  // would differ from the one on screen even with nothing touched.
  const data = applyExampleLook(toResumeData(example), {
    template:
      look.template && isTemplateId(look.template) ? look.template : undefined,
    accent:
      look.accent && HEX.test(look.accent)
        ? `#${look.accent.replace("#", "")}`
        : undefined,
  });

  return {
    name: `${example.role} resume`,
    data,
  };
}

/** A colour, with or without its hash. Anything else is ignored rather than
 *  written into the document — this arrives in a URL. */
const HEX = /^#?[0-9a-f]{6}$/i;

/** A blank page in that template: the layout is what was asked for, and none
 *  of the words are ours to write. */
export function seedFromTemplate(id: string): ResumeSeed | null {
  if (!isTemplateId(id)) return null;

  const template = getTemplate(id);
  const { data } = createEmptyResume();
  // The same call the Customize panel makes, so the resume arrives with the
  // font, heading style and accent the template was drawn with.
  applyTemplate(data.settings, template);

  return { name: `${template.name} resume`, data };
}
