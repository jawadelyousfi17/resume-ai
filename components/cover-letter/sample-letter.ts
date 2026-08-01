// The letter the template picker draws in each design.
//
// Sample content rather than the letter being edited: sixteen thumbnails of
// somebody's real three-page draft would be slow to render and, worse, would
// each show a different amount of it. Fixed copy at fixed settings means the
// only thing that differs between two thumbnails is the design.

import { DEFAULT_LETTER_SETTINGS } from "@/lib/cover-letter";
import { applyLetterTemplate, type LetterTemplate } from "@/lib/letter-templates";
import type { CoverLetterData } from "@/lib/types";

const SAMPLE: Omit<CoverLetterData, "settings"> = {
  sender: {
    fullName: "Dana Okoro",
    title: "Product Designer",
    email: "dana@okoro.design",
    phone: "+44 7700 900 118",
    location: "Manchester",
  },
  recipient: {
    name: "Hiring Manager",
    role: "",
    company: "Northbank Studio",
    address: "12 Wharf Street\nLeeds LS1 4HR",
  },
  role: "Product Designer",
  jobDescription: "",
  date: "14 March 2026",
  greeting: "Dear Hiring Manager,",
  body: "I've spent six years designing the parts of software people use when they're in a hurry — checkout flows, booking screens, the forms nobody wants to fill in twice. Northbank's work on the transit app is the clearest example I've seen of that done well.\n\nAt Meridian I rebuilt an onboarding flow that four in ten people abandoned. It now finishes at eighty-one per cent, and the research behind it is still what the team reaches for.\n\nI'd welcome the chance to talk it through.",
  closing: "Sincerely,",
  signature: "Dana Okoro",
};

/** The sample letter set in one template, at the default page settings. */
export function sampleLetter(t: LetterTemplate): CoverLetterData {
  const settings = { ...DEFAULT_LETTER_SETTINGS };
  applyLetterTemplate(settings, t);
  // Deep enough: the renderer reads these, and a shared object handed to
  // sixteen thumbnails is one edit away from being a bug.
  return {
    ...SAMPLE,
    sender: { ...SAMPLE.sender },
    recipient: { ...SAMPLE.recipient },
    settings,
  };
}
