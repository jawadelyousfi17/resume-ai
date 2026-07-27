"use client";

// The template chosen on the way into the editor.
//
// The resume itself is written while the gallery is still open — by the time
// anything is picked the row exists, so opening it is a page load and nothing
// more. What can't be written that early is the choice itself, so it travels
// here and the editor applies it as it opens. One save, no waiting, and no
// round trip between picking and typing.
//
// sessionStorage rather than localStorage: this is one navigation's worth of
// state. It shouldn't outlive the tab, and two tabs starting a resume at the
// same time shouldn't fight over one slot.

import { isTemplateId } from "./templates";
import type { TemplateId } from "./types";

const KEY = "resumeai:pending-template";

export function setPendingTemplate(id: TemplateId) {
  try {
    window.sessionStorage.setItem(KEY, id);
  } catch {
    // Private mode, or a full store. The resume keeps the default template,
    // which the Customize panel can still change.
  }
}

/** Reads it and clears it: the editor consumes the choice as it opens, so a
 *  refresh doesn't re-apply a template that has since been changed. */
export function takePendingTemplate(): TemplateId | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return raw && isTemplateId(raw) ? raw : null;
  } catch {
    return null;
  }
}
