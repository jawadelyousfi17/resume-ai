// Questions about the product itself. The writing-advice questions live with
// their guides in ./guides — these are the ones about maniacv.

import type { FaqEntry } from "./guides";

export interface FaqGroup {
  title: string;
  entries: FaqEntry[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Getting started",
    entries: [
      {
        question: "Do I need an account to use maniacv?",
        answer:
          "No. You can build one resume, preview it live and download the PDF without signing in — it's kept in your browser. Sign in when you want more than one, or when you want it saved to your account rather than to this device.",
      },
      {
        question: "What happens to my resume if I sign in later?",
        answer:
          "It comes with you. The resume you built as a guest is saved to your account the moment you sign in, and the local copy is only cleared once that has succeeded.",
      },
      {
        question: "Can I import a resume I already have?",
        answer:
          "Yes. Upload a PDF, an image or a text file and Claude reads it into the editor — your details, roles, bullet points, education and skills. Word documents aren't supported yet; export to PDF first.",
      },
      {
        question: "Is there a free plan?",
        answer:
          "Building, previewing and exporting a resume is free. An account removes the one-resume limit and unlocks the AI writing tools.",
      },
    ],
  },
  {
    title: "The AI writing tools",
    entries: [
      {
        question: "Which model does maniacv use?",
        answer:
          "Claude Sonnet 5, from Anthropic. It's used for writing help, resume review, importing an existing resume and translation.",
      },
      {
        question: "Will the AI invent things about me?",
        answer:
          "It's instructed not to, and the tools are built around that constraint. The writing tools work only from what's already on your resume — they sharpen wording rather than supply facts, and where a stronger line would need a number you haven't given, they write it without one. Read every suggestion before you keep it.",
      },
      {
        question: "Does my resume get used to train an AI model?",
        answer:
          "No. Your resume is sent to Anthropic's API to produce a response and is not used for model training.",
      },
      {
        question: "Why do the AI tools need an account?",
        answer:
          "Each use costs a model call. Tying that to an account is what keeps it available rather than rate-limited into uselessness.",
      },
      {
        question: "Can I translate my resume?",
        answer:
          "Yes, into ten languages. Translation keeps the structure, dates and employer names exactly as they are and rewrites only the content, then switches month names and proficiency labels to match.",
      },
    ],
  },
  {
    title: "Formatting and export",
    entries: [
      {
        question: "Is the exported PDF ATS-friendly?",
        answer:
          "Yes. Exports are typeset with LaTeX into single-column, real-text PDFs with conventional section headings — which is what applicant tracking systems parse most reliably.",
      },
      {
        question: "Can I export the LaTeX source?",
        answer:
          "Yes. The download menu offers both a compiled PDF and the .tex source, so you can take the document elsewhere.",
      },
      {
        question: "A4 or US Letter?",
        answer:
          "Both. Page size is a setting under Customize, and the live preview and the PDF follow it.",
      },
      {
        question: "Which languages are supported?",
        answer:
          "English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Chinese and Arabic. The language sets section headings, month names, proficiency labels and text direction — Arabic renders the whole document right-to-left.",
      },
    ],
  },
];

/** Flattened, for the FAQPage structured data. */
export const ALL_FAQS: FaqEntry[] = FAQ_GROUPS.flatMap((group) => group.entries);
