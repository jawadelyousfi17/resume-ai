// Factories and defaults for cover letters, and the one piece of formatting a
// letter needs that a resume doesn't: the date line.

import { DEFAULT_SETTINGS } from "./defaults";
import { language, type LanguageCode } from "./i18n";
import type {
  CoverLetter,
  CoverLetterData,
  CoverLetterSettings,
  Resume,
} from "./types";

const uid = () => crypto.randomUUID();

export const DEFAULT_LETTER_SETTINGS: CoverLetterSettings = {
  template: "classic",
  language: DEFAULT_SETTINGS.language,
  accent: DEFAULT_SETTINGS.accent,
  fontFamily: DEFAULT_SETTINGS.fontFamily,
  // A letter is read as prose rather than scanned, so it starts a little
  // larger and more open than a resume does.
  fontSize: 11,
  lineHeight: 1.5,
  marginX: 20,
  marginY: 20,
  showDate: true,
};

export const DEFAULT_GREETING = "Dear Hiring Manager,";
export const DEFAULT_CLOSING = "Sincerely,";

export function createEmptyCoverLetterData(): CoverLetterData {
  return {
    sender: { fullName: "", title: "", email: "", phone: "", location: "" },
    recipient: { name: "", role: "", company: "", address: "" },
    role: "",
    jobDescription: "",
    date: "",
    greeting: DEFAULT_GREETING,
    body: "",
    closing: DEFAULT_CLOSING,
    signature: "",
    settings: { ...DEFAULT_LETTER_SETTINGS },
  };
}

export function createEmptyCoverLetter(name = "Cover letter"): CoverLetter {
  const now = Date.now();
  return {
    id: uid(),
    name,
    format: "A4",
    resumeId: null,
    createdAt: now,
    updatedAt: now,
    data: createEmptyCoverLetterData(),
  };
}

/**
 * A blank letter with the sender filled in from a resume.
 *
 * Copied rather than referenced: the letter prints its own header, and a
 * resume edited — or deleted — six months later must not silently change a
 * letter that has already been sent.
 */
export function letterFromResume(resume: Resume): CoverLetterData {
  const letter = createEmptyCoverLetterData();
  const { personal, settings } = resume.data;

  letter.sender = {
    fullName: personal.fullName,
    title: personal.title,
    email: personal.email,
    phone: personal.phone,
    location: personal.location,
  };
  letter.signature = personal.fullName;
  // The letter should look like it came from the same person as the resume.
  letter.settings = {
    ...letter.settings,
    language: settings.language ?? letter.settings.language,
    accent: settings.accent,
    fontFamily: settings.fontFamily,
  };

  return letter;
}

/** The date as it prints. A letter saved with an explicit date keeps it
 *  verbatim — someone may want "12 March" or nothing at all — and otherwise
 *  today's date is written out in the letter's own language. */
export function letterDate(
  stored: string,
  lang: LanguageCode | undefined,
  now = new Date(),
): string {
  if (stored.trim()) return stored.trim();
  return now.toLocaleDateString(language(lang).locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
