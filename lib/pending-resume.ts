"use client";

// The hand-off between "choose a template" and the editor.
//
// Picking a template used to mean waiting: a row was written, then the editor
// loaded it. Nothing about that wait is useful — the document is a blank page
// the browser can build itself — so it builds it, parks it here, and the
// editor opens on it straight away. The insert happens once you're already
// typing; see /resume/new.
//
// sessionStorage rather than localStorage: this is one navigation's worth of
// state. It shouldn't outlive the tab, and two tabs starting a resume at the
// same time shouldn't fight over one slot.

import { createEmptyResume } from "./defaults";
import { applyTemplate, type Template } from "./templates";
import type { PageFormat, ResumeData } from "./types";

const KEY = "resumeai:pending";

export interface PendingResume {
  format: PageFormat;
  data: ResumeData;
}

/** A blank document wearing the chosen template. */
export function draftWithTemplate(template: Template): PendingResume {
  const draft = createEmptyResume();
  applyTemplate(draft.data.settings, template);
  return { format: draft.format, data: draft.data };
}

export function setPendingResume(pending: PendingResume) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(pending));
  } catch {
    // Private mode, or a full store. The editor falls back to a blank page.
  }
}

/** Reads it and clears it: opening the editor consumes the hand-off, so a
 *  refresh doesn't start a second resume from the same draft. */
export function takePendingResume(): PendingResume | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingResume;
    if (!parsed?.data?.personal || !Array.isArray(parsed.data.sections)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
