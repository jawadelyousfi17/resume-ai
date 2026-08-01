// How an example resume is dressed, in one place.
//
// The example page renders the document through a switcher — a template and an
// accent — and "Start from this example" has to open exactly what was on
// screen. Two code paths doing that separately is how they drift: the page
// showed Source Serif and the editor opened in whatever the template's preset
// was, because only one of them knew about the substitution.
//
// So both call this. The preview passes what the controls are set to, and
// /start passes what the URL carried; the same function answers both.

import { applyTemplate, getTemplate } from "../templates";
import type { FontFamily, ResumeData, TemplateId } from "../types";

/**
 * The typeface every example is shown in, whichever template is selected.
 *
 * The switcher is demonstrating layout. Left to their own presets, half the
 * templates would swap the typeface at the same time and the change would read
 * as a different font rather than a different page.
 */
export const EXAMPLE_FONT: FontFamily = "source-serif";

export interface ExampleLook {
  /** The template selected, or undefined for the one the example was written
   *  in — which is already on `data.settings`. */
  template?: TemplateId;
  /** A chosen accent as `#rrggbb`, or undefined to keep whatever the template
   *  was designed around. */
  accent?: string;
}

/** The example as it should appear — and as it should open in the editor. */
export function applyExampleLook(
  data: ResumeData,
  look: ExampleLook = {},
): ResumeData {
  const next: ResumeData = { ...data, settings: { ...data.settings } };

  applyTemplate(next.settings, getTemplate(look.template ?? next.settings.template));
  // After `applyTemplate`, which sets the template's own font and accent.
  next.settings.fontFamily = EXAMPLE_FONT;
  if (look.accent) next.settings.accent = look.accent;

  return next;
}
