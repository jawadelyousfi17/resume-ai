// The contract between the AI panel and `POST /api/ai`. Kept free of any
// server-only imports so both sides can share it.

import type { ResumeData } from "@/lib/types";

export type AITaskId =
  /** Write the professional summary paragraph. */
  | "summary"
  /** Rewrite the highlights of one timeline entry. */
  | "highlights"
  /** Propose skill groups backed by the rest of the resume. */
  | "skills"
  /** Critique the resume, or compare it against a job posting. */
  | "review"
  /** Rewrite the whole document in another language. */
  | "translate"
  /** Rewrite one snippet in place — the inline assist. */
  | "polish";

/** How the model was told to shape its answer, which is what tells the UI how
 *  to parse it and what "apply" means. */
export type AIOutputKind =
  /** Markdown, in the same subset the editor writes. Applied as-is. */
  | "markdown"
  /** One item per line — parsed before it's applied. */
  | "lines"
  /** Free-form advice — read, don't apply. */
  | "prose"
  /** A whole resume, returned at once rather than streamed. */
  | "document";

export interface AITaskMeta {
  id: AITaskId;
  label: string;
  blurb: string;
  output: AIOutputKind;
  /** Verb on the button that starts it. */
  action: string;
}

export const AI_TASKS: Record<AITaskId, AITaskMeta> = {
  summary: {
    id: "summary",
    label: "Professional summary",
    blurb: "Draft the opening paragraph from the roles and skills already on the resume.",
    output: "markdown",
    action: "Write",
  },
  highlights: {
    id: "highlights",
    label: "Rewrite highlights",
    blurb: "Tighten the bullet points of one role — same facts, sharper wording.",
    output: "markdown",
    action: "Rewrite",
  },
  skills: {
    id: "skills",
    label: "Suggest skills",
    blurb: "Group the skills your experience already demonstrates.",
    output: "lines",
    action: "Suggest",
  },
  review: {
    id: "review",
    label: "Review my resume",
    blurb: "A prioritised list of what's holding the resume back, biggest first.",
    output: "prose",
    action: "Review",
  },
  translate: {
    id: "translate",
    label: "Translate resume",
    blurb: "Rewrite the whole resume in another language, structure intact.",
    output: "document",
    action: "Translate",
  },
  polish: {
    id: "polish",
    label: "Improve with AI",
    blurb: "Rewrite this text.",
    output: "markdown",
    action: "Improve",
  },
};

/** The tasks that stream text back from `POST /api/ai`. Translate is absent:
 *  it answers with a whole document from its own endpoint. */
export type StreamingTaskId = Exclude<AITaskId, "translate">;

/** The tasks the AI Tools tab offers, in the order it offers them. */
export const PANEL_TASKS: AITaskId[] = [
  "summary",
  "highlights",
  "skills",
  "review",
  "translate",
];

export interface AIRequest {
  task: AITaskId;
  /** The whole document — the model needs the surrounding context to write
   *  anything that sounds like the same person. */
  data: ResumeData;
  /** Posting the user is targeting. Steers wording on every task. */
  jobDescription?: string;
  /** Free-form nudge from the user ("keep it to two sentences"). */
  instruction?: string;
  /** Which entry `highlights` rewrites. */
  target?: { sectionId: string; itemId: string };
  /** The snippet `polish` rewrites. */
  text?: string;
  /** Where that snippet came from, e.g. "Highlight for Designer at Acme". */
  context?: string;
}

/** Input caps, enforced on the server and mirrored in the UI. */
export const LIMITS = {
  jobDescription: 12_000,
  instruction: 600,
  text: 4_000,
  /** Serialized resume; a guard against a pathological document, not a target. */
  brief: 60_000,
} as const;
