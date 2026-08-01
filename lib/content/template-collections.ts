// The template collection landing pages: /ats-friendly-resume-templates and
// its siblings.
//
// These are the filter buttons on /resume-templates given real URLs. The
// filtering itself already exists — `inCategory` in lib/templates.ts works the
// bucket out from the descriptor — so a collection is a category plus the copy
// that makes the page worth landing on.
//
// Why root-level `{modifier}-resume-templates` rather than
// `/resume-templates/{modifier}`: five of the template ids are `modern`,
// `minimal`, `classic`, `compact` and `sidebar`, so half the obvious child
// slugs are already detail pages. Root level also exact-matches the phrase
// people actually search, and matches the ecosystem pages (/latex-…, /canva-…)
// that live at the root for the same reason.

import type { TemplateCategory } from "@/lib/templates";
import type { FaqEntry } from "@/lib/content/guides";

export interface TemplateCollection {
  /** The path, without a leading slash. */
  slug: string;
  /** Which bucket of the gallery this shows. */
  category: TemplateCategory;
  /** H1. */
  title: string;
  /** <title>. The count is appended at render time so it can't go stale. */
  metaTitle: (count: number) => string;
  description: string;
  /** The paragraph under the H1. */
  intro: string;
  /** The unique body copy. Two or three sections, ~200 words total — the
   *  thing that stops this being a filtered grid with a heading on it. */
  sections: { heading: string; body: string[] }[];
  faqs: FaqEntry[];
  /** Sibling collections worth offering instead, by slug. */
  related: string[];
}

export const TEMPLATE_COLLECTIONS: TemplateCollection[] = [
  {
    slug: "ats-friendly-resume-templates",
    category: "ats",
    title: "ATS-friendly resume templates",
    metaTitle: (n) =>
      `${n} ATS-Friendly Resume & CV Templates — Parser-Safe | meniacv`,
    description:
      "Single-column resume and CV templates that parse cleanly in applicant tracking systems. Free to use, real-text PDF export, no watermark — plus how to check any resume yourself in ten seconds.",
    intro:
      "Every template on this site exports real text, which is most of what an applicant tracking system needs. These are the ones that also avoid the two things that genuinely break a parse: a sidebar that interleaves when the text is extracted, and a dark page that nothing reads cleanly off.",
    sections: [
      {
        heading: "What makes a template ATS-safe",
        body: [
          "Almost everything written about ATS compatibility is about fear rather than mechanics. The mechanics are simple: the system extracts a stream of characters from your PDF, looks for headings it recognises, splits your history into title/employer/date records, and ranks the result against the posting. Nothing gets auto-rejected. What happens instead is that a bad parse loses your job titles or your dates, and an unrankable resume is one nobody reads.",
          "Two layout decisions actually threaten that. A two-column layout can be read straight across both columns, dropping your skills list into the middle of a job description. And a dark page — however well it renders — puts a rendering step between the parser and the text. The filter behind this page excludes both, along with edge strips, which is why it is smaller than the full gallery.",
        ],
      },
      {
        heading: "Check it yourself in ten seconds",
        body: [
          "You do not need a checker for the structural half of this. Export your PDF, select all the text, and paste it into a plain text file. What survives is approximately what a parser sees. If your name is missing, your dates have collapsed, or your skills have landed inside a job description, you have found a real problem — and it will be one of the two above.",
          "The half a template cannot do for you is keyword relevance to the specific posting. That is writing, not layout, and it is where the remaining effort should go.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are two-column resume templates bad for ATS?",
        answer:
          "Not automatically, but they are the layout that fails most often. The risk is text extracting left-to-right across both columns rather than down one and then the other, which interleaves your sidebar into your job descriptions. Run the copy-paste check on the exported PDF and you will know in ten seconds whether yours is affected.",
      },
      {
        question: "Do these templates cost anything?",
        answer:
          "No. Every template here is free to use in the editor with unlimited PDF downloads and no watermark, on the free plan, without a card. The paid plans add AI writing, more resumes and translation — none of which you need to use one of these templates.",
      },
      {
        question: "Will a photo hurt my ATS score?",
        answer:
          "It contributes nothing to the parse either way. The real consideration is regional: in the US, UK and Canada many employers prefer resumes without one, while in much of continental Europe a photo is conventional. Never put text inside the image, because that text does not exist as far as any parser is concerned.",
      },
    ],
    related: ["simple-resume-templates", "professional-resume-templates"],
  },
  {
    slug: "simple-resume-templates",
    category: "minimal",
    title: "Simple resume templates",
    metaTitle: (n) =>
      `${n} Simple Resume & CV Templates — Clean, Free, ATS-Ready | meniacv`,
    description:
      "Plain single-column resume and CV templates with no sidebar, no photo and nothing decorative. Free, editable, and exported as a real-text PDF.",
    intro:
      "One column, no photo, no tinted bands, nothing that draws the eye away from the words. These are the templates for when the writing is the point and the page should get out of its way.",
    sections: [
      {
        heading: "Simple is a strategy, not a fallback",
        body: [
          "A plain resume is often read as the safe choice you make when you cannot design. It is closer to the opposite. Recruiters spend seconds on the first pass, and everything decorative on the page is competing for those seconds against the two things that decide the outcome: what you did, and what changed because of it. A template with a colour rail and a skills chart has spent your reader's attention on furniture.",
          "It also travels well. A simple layout survives being printed in black and white, being read on a phone, being pasted into an internal system, and being parsed by software written in 2009. The more design a template carries, the more of those situations degrade it.",
        ],
      },
      {
        heading: "When to pick something else",
        body: [
          "If you are in a visual field — design, art direction, front-of-house creative work — a page that demonstrates no visual judgement is itself a signal, and one of the modern layouts will serve you better. The same goes if you are applying somewhere that has asked for a photo, which is conventional across much of continental Europe.",
          "For everyone else, the honest advice is that template choice is the smallest decision on this page. Pick one of these, and spend the time you saved rewriting your bullet points so each one ends in a result.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best simple resume template?",
        answer:
          "Any of the ones on this page, and the difference between them is smaller than the difference a rewritten bullet point makes. If you want the decision made for you: Ledger. It is a single serif column with banded headings, it prints well, and it parses cleanly.",
      },
      {
        question: "Is a simple resume too boring for a creative job?",
        answer:
          "For a visual role, possibly — a designer's resume is itself a work sample, and a page showing no typographic judgement says something. Everywhere else, plain reads as confident rather than boring, because it leaves nothing between the reader and what you have actually done.",
      },
      {
        question: "Can I add colour to a simple template later?",
        answer:
          "Yes. Accent colour, font family, size, line height and margins are all controls under Customize, and they apply on top of whichever template you have chosen. Changing template later re-renders what you have written rather than starting it over.",
      },
    ],
    related: ["ats-friendly-resume-templates", "modern-resume-templates"],
  },
  {
    slug: "modern-resume-templates",
    category: "modern",
    title: "Modern resume templates",
    metaTitle: (n) =>
      `${n} Modern Resume & CV Templates — Free and ATS-Ready | meniacv`,
    description:
      "Contemporary sans-serif resume and CV templates with clean hierarchy and real-text PDF export. Free to use, fully customisable, no watermark.",
    intro:
      "Sans-serif typefaces and contemporary hierarchy — the look most technology, product and startup hiring reads as current. Every one still exports as real text, so modern here is about type and spacing rather than about decoration a parser cannot read.",
    sections: [
      {
        heading: "What actually reads as modern",
        body: [
          "Modern is mostly typeface and spacing, not ornament. A sans-serif face, generous line height, clear separation between sections, and a restrained accent colour will read as current in any industry. A resume that looks dated is usually a serif face set tight with underlined headings — not a resume that lacks a skills chart.",
          "This is worth saying because the templates marketed hardest as modern tend to be the ones carrying infographic elements: proficiency meters, timelines, circular skill ratings. Those are the parts that parse worst and communicate least. A five-dot meter next to \"Python\" tells a reader nothing they can act on, where one bullet describing what you built with it tells them everything.",
        ],
      },
      {
        heading: "Modern without the parsing risk",
        body: [
          "Several templates here use a sidebar, which is the one layout choice with real consequences for applicant tracking systems — the text can extract across both columns rather than down each in turn. That does not make them unusable. It makes them worth checking: export the PDF, copy the text out, and confirm it reads in a sensible order.",
          "If the role is likely to be screened heavily by software, the ATS-friendly collection is the same aesthetic with the sidebar removed.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are modern resume templates ATS-friendly?",
        answer:
          "The typography is irrelevant to a parser — sans-serif and serif extract identically. What matters is column count and whether the text is real. The single-column templates in this collection are as safe as anything on the site; the two-column ones are worth running the copy-paste check on.",
      },
      {
        question: "Should I use a modern template for a corporate job?",
        answer:
          "A clean sans-serif layout is safe almost everywhere now, including finance and law. What still reads as out of place in conservative industries is colour used heavily, a photo where the local convention is not to include one, and anything resembling an infographic.",
      },
      {
        question: "Can I change the font on a modern template?",
        answer:
          "Yes. Each template ships with a typeface it was designed around, but font family stays a control under Customize, along with size, line height, margins and accent colour. The live preview and the exported PDF follow them together.",
      },
    ],
    related: ["simple-resume-templates", "two-column-resume-templates"],
  },
  {
    slug: "professional-resume-templates",
    category: "classic",
    title: "Professional resume templates",
    metaTitle: (n) =>
      `${n} Professional Resume & CV Templates — Free, ATS-Ready | meniacv`,
    description:
      "Classic serif resume and CV templates for finance, law, academia, healthcare and government. Free, editable and exported as a real-text PDF.",
    intro:
      "Serif typefaces and conventional structure — the register that finance, law, academia, healthcare and government hiring still expect. Formal, unfashionable on purpose, and none the worse for it.",
    sections: [
      {
        heading: "Where formality is still the right call",
        body: [
          "There are fields where a contemporary layout reads as not understanding the field. Law firms, academic departments, hospital systems, government agencies and much of finance have a house style that has not moved in twenty years, and matching it is a signal of fit rather than a lack of imagination. A serif face, standard headings and no colour is the correct answer to a question those readers are genuinely asking.",
          "It also ages well. A resume you will update over a decade is better set in something that was not fashionable in any particular year, because the alternative is a document that reads as dated the moment its style cycles out.",
        ],
      },
      {
        heading: "Formal is not the same as crowded",
        body: [
          "The failure mode of a professional resume is not being too plain — it is being too dense. Conventional structure invites people to keep adding, and a two-page wall of nine-point type with quarter-inch margins is harder to read than any design choice could make it. The margins and line height on these templates are set where they are deliberately.",
          "If your field expects two pages, take them. Nursing, academia and senior technical roles routinely run to two. What should not happen is a second page created by shrinking the type on the first.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the most professional resume format?",
        answer:
          "Reverse-chronological, single column, standard section headings, and a serif or restrained sans-serif face. That is what nearly every conservative field expects and what every applicant tracking system parses most reliably. Functional and skills-based formats raise questions about what is being left out.",
      },
      {
        question: "Should a professional resume have a photo?",
        answer:
          "In the US, UK, Canada and Australia, no — many employers prefer resumes without one for bias reasons, and some systems strip them. Across much of continental Europe, and in parts of Asia and Latin America, a photo is conventional and its absence is noticed. Follow the norm where you are applying.",
      },
      {
        question: "One page or two?",
        answer:
          "One page up to roughly eight to ten years of experience, two once the second page carries substance rather than padding. Academia, nursing and senior technical roles are the usual exceptions and run longer without penalty. Early-career resumes almost never justify a second page.",
      },
    ],
    related: ["ats-friendly-resume-templates", "simple-resume-templates"],
  },
  {
    slug: "two-column-resume-templates",
    category: "two-column",
    title: "Two-column resume templates",
    metaTitle: (n) =>
      `${n} Two-Column Resume & CV Templates — Free | meniacv`,
    description:
      "Two-column and sidebar resume and CV templates, free to use and edit — plus an honest account of when a sidebar costs you and how to check yours parses.",
    intro:
      "A sidebar buys you density: skills, languages, contact details and tools move out of the main flow, and the space left over goes to your experience. It also carries the one layout risk worth taking seriously. Both halves of that are covered below.",
    sections: [
      {
        heading: "The tradeoff, stated plainly",
        body: [
          "A two-column layout is the only common design choice that can actively break your application. When a parser extracts text from the PDF, it may read straight across the page rather than down one column and then the other — which drops your skills list into the middle of a job description and can lose the title and dates on a role entirely. An unrankable resume does not get rejected; it simply never reaches a person.",
          "This is not universal. Plenty of modern systems handle columns correctly, and plenty of people are hired every week from two-column resumes. But you cannot tell which system is on the other end of an application, and the failure is silent.",
        ],
      },
      {
        heading: "How to use one anyway",
        body: [
          "Check it. Export the PDF, select all the text, paste it into a plain text file, and read what comes out. If your history is intact and in order, the template parses and you can stop worrying. If it is interleaved, switch to a single-column template — your writing is untouched by the change, because a template is a rendering choice rather than a container.",
          "A reasonable middle path is to keep a two-column version for applications sent directly to a person and a single-column version for anything going through a portal. Both render from the same content.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do two-column resumes get rejected by ATS?",
        answer:
          "Not rejected — misparsed, which is worse because it is silent. The system extracts text in the wrong order, your job titles and dates may not land in the right fields, and you rank low enough that no recruiter reaches you. The copy-paste check on your exported PDF tells you within ten seconds whether yours is affected.",
      },
      {
        question: "What should go in the sidebar?",
        answer:
          "Things that are lists rather than narrative: contact details, skills, tools, languages, certifications. Never put your experience there. If a parse does go wrong, losing a skills list is recoverable — losing your employment history is not.",
      },
      {
        question: "Can I switch to one column later?",
        answer:
          "At any time, and it costs you nothing. Templates re-render the same content, so switching is a single change and your writing is untouched. This is exactly why keeping both versions is practical.",
      },
    ],
    related: ["ats-friendly-resume-templates", "modern-resume-templates"],
  },
  {
    slug: "resume-templates-with-photo",
    category: "photo",
    title: "Resume templates with a photo",
    metaTitle: (n) =>
      `${n} Resume & CV Templates With a Photo — Free and Editable | meniacv`,
    description:
      "Free resume and CV templates with a photo or avatar — the norm on a continental European CV — plus where a photo is expected, where it works against you, and how to get the picture itself right.",
    intro:
      "A photo on a resume is a regional convention, not a matter of taste — expected in much of Europe, discouraged in the US and UK, and irrelevant to every parser. These are the templates that make room for one properly.",
    sections: [
      {
        heading: "Where a photo helps and where it costs you",
        body: [
          "In Germany, France, Spain, Italy, much of continental Europe and in parts of Asia and Latin America, a photo is conventional and leaving it off is noticed. In the US, the UK, Canada, Ireland and Australia the convention runs the other way: many employers actively prefer resumes without one, some larger organisations strip them before a recruiter sees the file, and a photo can put your application into a slower compliance path.",
          "So the decision is not about your photo. It is about where you are applying, and the answer changes per application. If you are applying across regions, keep two versions — the template switch takes one click and the content is shared.",
        ],
      },
      {
        heading: "Getting the picture right",
        body: [
          "A bad photo is worse than no photo. Plain background, head and shoulders, natural light, current within a couple of years, and dressed roughly as you would for the interview. Not a cropped wedding photo, not a holiday shot, not a selfie.",
          "One technical point that matters more than any of the above: never put text inside the image. Your name, contact details or job title rendered as part of a graphic do not exist as far as an applicant tracking system is concerned, and that is a genuinely application-ending mistake rather than a stylistic one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I put a photo on my resume?",
        answer:
          "It depends entirely on where you are applying. Conventional across much of continental Europe, Asia and Latin America; discouraged in the US, UK, Canada and Australia, where many employers prefer resumes without one for bias reasons. Follow the norm of the country the job is in, not the country you are in.",
      },
      {
        question: "Does a photo affect ATS parsing?",
        answer:
          "The photo itself contributes nothing to the parse in either direction — it is simply ignored. What breaks things is text inside the image. Anything rendered as part of a graphic is invisible to every parser, so your name and contact details must be real text on the page.",
      },
      {
        question: "What kind of photo works best?",
        answer:
          "Head and shoulders, plain uncluttered background, even natural light, a neutral or slight expression, and clothing matching what you would wear to the interview. Recent enough to look like you. The bar is a professional identification photo rather than a portrait session.",
      },
    ],
    related: ["professional-resume-templates", "modern-resume-templates"],
  },
];

export const getCollection = (slug: string): TemplateCollection | undefined =>
  TEMPLATE_COLLECTIONS.find((c) => c.slug === slug);
