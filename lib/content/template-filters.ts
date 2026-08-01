// The browse pages under /templates — one per filter in the gallery's filter
// row.
//
// These are the same client-side filters that have always been on
// /resume-templates, given real URLs. The row is rendered as links rather than
// buttons, so every cut of the catalogue is a page a person can bookmark and a
// crawler can reach, and the filtered grid is in the server-rendered HTML
// rather than behind a click.
//
// Why /templates/{filter} and not /resume-templates/{filter}: five template
// ids are `modern`, `minimal`, `classic`, `compact` and `sidebar`, so half the
// obvious child slugs are already detail pages under /resume-templates/[id].
//
// The relationship to lib/content/template-collections.ts: those six pages are
// editorial — long-form arguments that happen to end in a grid, and they own
// the phrases people search. Where a filter here shows the same set as one of
// them, it canonicalises to it (`canonicalTo`) rather than competing with it.
// The eight without a `canonicalTo` are cuts nothing else covers.

import type { FaqEntry } from "@/lib/content/guides";
import { type TemplateCategory, templatesIn } from "@/lib/templates";

export interface TemplateFilter {
  /** The last segment of /templates/{slug}. */
  slug: string;
  /** The filter button. Short enough for a chip. */
  label: string;
  /** The bucket in lib/templates.ts this shows. */
  category: TemplateCategory;
  /** H1. */
  title: string;
  /** <title>. The count is passed in so it can't go stale. */
  metaTitle: (count: number) => string;
  description: string;
  /** The paragraph under the H1. */
  intro: string;
  /** The copy that makes this more than a filtered grid. */
  sections: { heading: string; body: string[] }[];
  faqs: FaqEntry[];
  /** In the row above the grid. Six of them — the cuts most people arrive
   *  wanting — because a sticky bar of fourteen is a menu, not a filter. The
   *  rest live in the index under the grid. */
  primary?: boolean;
  /** Sibling filters worth offering, by slug. */
  related: string[];
  /** The editorial page that owns this subject, where one exists. */
  seeAlso?: { label: string; href: string; note: string };
  /** Set where an existing page shows the same templates for the same query.
   *  That page is the canonical one; this stays a usable browse view. */
  canonicalTo?: string;
}

export const TEMPLATE_FILTERS: TemplateFilter[] = [
  {
    slug: "simple",
    label: "Simple",
    category: "simple",
    title: "Simple resume templates",
    metaTitle: (n) => `${n} Simple Resume Templates — Free and ATS-Ready | meniacv`,
    description:
      "Plain single-column resume templates with no sidebar and no photo. Free to edit, exported as a real-text PDF, and readable by every applicant tracking system.",
    intro:
      "One column, no photo, nothing down the side of the page. A banded heading or a tinted name block is still allowed here — this is plain rather than stripped bare, which is what most people mean when they ask for something simple.",
    sections: [
      {
        heading: "Plain is a decision, not a default",
        body: [
          "A recruiter's first pass over a resume is measured in seconds, and everything decorative on the page is competing for those seconds against the only two things that decide the outcome: what you did, and what changed because of it. A colour rail and a row of skill meters have spent your reader's attention on furniture.",
          "Plain also travels. A single column survives being printed in black and white, read on a phone, pasted into an internal system and parsed by software written in 2009. Every layer of design a template carries is another situation in which it degrades.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a simple resume template too plain for a good job?",
        answer:
          "Outside visual fields, plain reads as confident rather than empty — there is nothing between the reader and what you have done. The exception is design, art direction and front-of-house creative work, where the page is itself a work sample.",
      },
      {
        question: "Can I add colour to one of these later?",
        answer:
          "Yes. Accent colour, font family, size, line height and margins are controls under Customize and apply on top of whichever template you have picked. Changing template re-renders what you have written rather than starting it over.",
      },
    ],
    primary: true,
    related: ["minimalist", "one-column", "ats"],
    seeAlso: {
      label: "Simple resume templates — the long version",
      href: "/simple-resume-templates",
      note: "When plain is the right call, and when it isn't.",
    },
    canonicalTo: "/simple-resume-templates",
  },
  {
    slug: "word",
    label: "Word",
    category: "word",
    title: "Word-friendly resume templates",
    metaTitle: (n) => `${n} Word-Style Resume Templates — Free, PDF Export | meniacv`,
    description:
      "Single-column resume templates that reproduce faithfully if you have to rebuild them in Microsoft Word — no rails, no meters, no reversed panels. Free to edit here, exported as PDF.",
    intro:
      "Straight about this up front: meniacv exports PDF, not .docx. What this page filters for is the layouts that survive being rebuilt in Word if you genuinely need a Word file — a single column of body text, standard headings, and nothing that would become a text box.",
    sections: [
      {
        heading: "What breaks when a layout meets Word",
        body: [
          "Word is fine at a column of text and poor at everything else. Sidebars become tables or floating frames that move the moment anyone edits above them, meter bars become images, reversed heading chips become shaded paragraphs that print grey on the wrong printer, and a photo bled into a header band becomes an anchor that follows the paragraph it was attached to. Every template on this page avoids all of that, which is why it is a smaller list than the full gallery.",
          "The tempting shortcut — export a PDF here and convert it — is the one thing worth ruling out. PDF-to-Word conversion produces a document held together with text boxes and manual line breaks: it parses worse than either format alone and falls apart the moment someone types in it. If you need Word, build it in Word.",
        ],
      },
      {
        heading: "When you actually need .docx",
        body: [
          "Four situations, and they are real: the posting explicitly asks for a Word document; you are going through a recruitment agency that will reformat you into its own house template; an old internal portal rejects PDF uploads; or someone else has to edit the file for you. Send what is asked for.",
          "For everything else — which is most applications — PDF is the better file. It renders identically everywhere, it still contains real extractable text, and it does not carry the revision history and author metadata that a .docx hands over along with your experience.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I download these as a Word document?",
        answer:
          "No. Export here is PDF, and there is no .docx export we would promise you today. If you need an editable Word file, build it in Word or Google Docs directly — keep it single column with standard headings and it will parse the same as anything else.",
      },
      {
        question: "Do employers prefer Word or PDF?",
        answer:
          "PDF, in almost every case. The advice that applicant tracking systems cannot read PDFs is about fifteen years out of date; every mainstream system reads them, and a PDF is the only way to be sure the page a recruiter sees is the page you built.",
      },
    ],
    related: ["google-docs", "ats", "one-column"],
    seeAlso: {
      label: "Word resume templates — PDF vs .docx",
      href: "/word-resume-templates",
      note: "The full argument, including when .docx is the right answer.",
    },
    canonicalTo: "/word-resume-templates",
  },
  {
    slug: "creative",
    label: "Creative",
    category: "creative",
    title: "Creative resume templates",
    metaTitle: (n) => `${n} Creative Resume Templates — Free and Editable | meniacv`,
    description:
      "Resume templates that make a visual argument: dark pages, edge strips, numbered sections, reversed heading chips and proficiency meters. Free to edit and export as a real-text PDF.",
    intro:
      "Dark pages, colour rails, numbered sections, reversed headings, meters. These are the templates that look like something rather than getting out of the way — useful when the page is itself a work sample, and a liability when it is being read by a machine first.",
    sections: [
      {
        heading: "Where a creative layout earns its place",
        body: [
          "In design, art direction, front-of-house creative work and parts of marketing, a resume showing no visual judgement is itself a signal. The page is the first thing you have made that the reader has seen, and a competent, restrained piece of layout says something a paragraph about attention to detail cannot. Portfolio-adjacent applications, direct approaches and anything going to a named person by email are where these do their work.",
          "The register matters more than the ornament. A dark page or a colour rail reads as considered; five different accent colours, a pie chart of your skills and a timeline graphic read as a template that was picked rather than chosen. If a design element does not carry information, it is costing you space.",
        ],
      },
      {
        heading: "The part worth knowing before you pick one",
        body: [
          "Proficiency meters are the weakest thing on any of these pages. A four-of-five bar next to \"Python\" tells a reader nothing they can act on — everyone rates themselves four — where one bullet describing what you built with it tells them everything. Where a template offers meters, treat them as decoration and put the substance in your experience.",
          "The other consideration is mechanical. A dark page and a two-column rail are the two layout decisions that can genuinely cost you a parse in an applicant tracking system. If the role is being screened by software, keep a single-column version alongside this one — same content, one click, nothing rewritten.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are creative resume templates bad for ATS?",
        answer:
          "The decoration is ignored; what matters is whether the text extracts in a sensible order. A dark page and a sidebar are the two risks. Export the PDF, copy the text out into a plain file, and read what comes back — that check takes ten seconds and settles it.",
      },
      {
        question: "Should I use a creative template outside a design job?",
        answer:
          "Sparingly. Marketing, media, education and startups will read it as personality; law, finance, medicine, government and most large corporates will read it as not knowing the register. When in doubt, the conservative choice costs you nothing and the flamboyant one can.",
      },
    ],
    related: ["modern", "picture", "two-column"],
  },
  {
    slug: "one-column",
    label: "One column",
    category: "one-column",
    title: "One-column resume templates",
    metaTitle: (n) => `${n} One-Column Resume Templates — Free, Parser-Safe | meniacv`,
    description:
      "Single-column resume templates with no sidebar, so the text extracts in the order it was written. Free to edit, unlimited PDF downloads, no watermark.",
    intro:
      "No sidebar, no rail, nothing running down the edge of the page — one column of content from the name block to the last line. This is the single layout decision with real mechanical consequences, and this is the safe side of it.",
    sections: [
      {
        heading: "Why the column count is the one that matters",
        body: [
          "When an applicant tracking system reads your PDF, it extracts a stream of characters and then tries to split that stream into records: title, employer, dates, description. A single column gives it exactly the order you wrote. A two-column layout can be read straight across the page instead of down each column in turn, which drops your skills list into the middle of a job description and can detach a role from its dates entirely.",
          "Nothing gets auto-rejected for this. What happens is quieter: the parse comes out scrambled, you rank below people with worse experience and cleaner extraction, and no one ever tells you. A single column removes the failure mode rather than mitigating it.",
        ],
      },
      {
        heading: "What you give up",
        body: [
          "Density. A sidebar moves skills, tools, languages and contact details out of the main flow and hands the space back to your experience, which is genuinely useful on a crowded page. Without one, the same material has to earn its place inline — usually as a short skills line rather than a column of them.",
          "That is a smaller loss than it sounds. Most resumes are not short of space so much as long on things that could be cut: a summary repeating the bullets below it, skills nobody screens for, a section of hobbies. One column tends to force that edit, which is not the worst thing a template can do for you.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a one-column resume better than two?",
        answer:
          "Mechanically, yes — it removes the only common layout risk to a parse. Visually it is a matter of taste, and plenty of people are hired every week from two-column resumes. If the application is going through a portal rather than to a person, take the single column.",
      },
      {
        question: "How do I check my own resume parses in order?",
        answer:
          "Export the PDF, select all the text, and paste it into a plain text file. What survives is approximately what a parser sees. If your name is missing, your dates have collapsed or your skills have landed inside a job description, you have found a real problem.",
      },
    ],
    related: ["ats", "simple", "two-column"],
  },
  {
    slug: "one-page",
    label: "One page",
    category: "compact",
    title: "One-page resume templates",
    metaTitle: (n) => `${n} One-Page Resume Templates — Compact and Free | meniacv`,
    description:
      "Compact resume templates set tight enough to hold a full history on a single page without shrinking the type. Free to edit and export as a real-text PDF.",
    intro:
      "Tighter section spacing and a denser rhythm, so a real history fits on one page without dropping to eight-point type or quarter-inch margins. These are the layouts to reach for when you have more to say than a spacious template will hold.",
    sections: [
      {
        heading: "One page is a length, not a rule",
        body: [
          "The advice to keep every resume to a single page is US convention flattened into law. It is right for most people up to roughly eight to ten years of experience, and wrong the moment the second page carries substance rather than padding. Academia, nursing, senior technical and most of continental Europe run longer as a matter of course, and a CV is not expected to be short at all.",
          "Where the rule does hold is early career. A graduate resume spread over two pages is nearly always one page of content and one page of formatting, and the reader notices which is which.",
        ],
      },
      {
        heading: "How to actually get there",
        body: [
          "In order: cut the summary if it repeats the bullets under it, cut roles more than about fifteen years old down to a line each, cut skills nobody screens for, and cut every bullet that describes a duty rather than a result. That is usually a third of the page, and none of it was doing any work.",
          "Only then reach for the layout. A compact template, slightly tighter line height and margins pulled in a little will buy you several more lines. What should not happen is a second page rescued by shrinking the type — nine-point text with no air around it is harder to read than any design choice could make it, and reads as someone who could not decide what mattered.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should my resume be one page or two?",
        answer:
          "One page up to roughly eight to ten years of experience; two once the second page carries substance. Academia, nursing and senior technical roles are the usual exceptions and run longer without penalty. Early-career resumes almost never justify a second page.",
      },
      {
        question: "Can I make any template fit on one page?",
        answer:
          "Largely, yes — font size, line height, margins and section spacing are all controls under Customize, and the live preview shows the page break as you move them. The templates here simply start from a tighter setting, so you have less to claw back.",
      },
    ],
    related: ["simple", "ats", "professional"],
  },
  {
    slug: "picture",
    label: "Picture",
    category: "photo",
    title: "Resume templates with a picture",
    metaTitle: (n) => `${n} Resume Templates With a Picture — Free and Editable | meniacv`,
    description:
      "Resume and CV templates with a photo or avatar, the norm on a continental European CV — plus where a picture is expected and where it works against you.",
    intro:
      "A picture on a resume is a regional convention rather than a matter of taste: expected across much of Europe, discouraged in the US and UK, and invisible to every parser either way. These are the templates that make room for one properly instead of pasting it into a corner.",
    sections: [
      {
        heading: "Where a picture helps and where it costs you",
        body: [
          "In Germany, France, Spain, Italy and much of continental Europe, and in parts of Asia and Latin America, a photo is conventional and leaving it off is noticed. In the US, UK, Canada, Ireland and Australia the convention runs the other way: many employers prefer resumes without one for bias reasons, some larger organisations strip them before a recruiter sees the file, and a photo can route your application into a slower compliance path.",
          "So the decision is not about your photograph. It is about where you are applying, and the answer changes per application. If you are applying across regions, keep two versions — switching template takes one click and the content is shared.",
        ],
      },
      {
        heading: "Getting the picture itself right",
        body: [
          "A bad photo is worse than no photo. Head and shoulders, plain background, even light, current within a couple of years, dressed roughly as you would for the interview. Not a cropped wedding photo, not a holiday shot, not a selfie with the background blurred by a phone.",
          "One technical point outranks all of that: never put text inside the image. A name, a job title or contact details rendered as part of a graphic do not exist as far as any parser is concerned, and that is an application-ending mistake rather than a stylistic one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I put a picture on my resume?",
        answer:
          "Follow the convention of the country the job is in, not the one you are in. Conventional across much of continental Europe, Asia and Latin America; discouraged in the US, UK, Canada and Australia, where many employers prefer resumes without one.",
      },
      {
        question: "Does a photo affect ATS parsing?",
        answer:
          "The image contributes nothing in either direction — it is simply ignored. What breaks things is text inside the image, which is invisible to every parser. Your name and contact details must be real text on the page.",
      },
    ],
    primary: true,
    related: ["two-column", "modern", "creative"],
    seeAlso: {
      label: "Resume templates with a photo",
      href: "/resume-templates-with-photo",
      note: "The same set, with more on regional convention.",
    },
    canonicalTo: "/resume-templates-with-photo",
  },
  {
    slug: "professional",
    label: "Professional",
    category: "professional",
    title: "Professional resume templates",
    metaTitle: (n) => `${n} Professional Resume Templates — Free, ATS-Ready | meniacv`,
    description:
      "Conservative resume templates for law, finance, medicine, government and academia — no photo, no meters, no chips, nothing that reads as out of register. Free and ATS-readable.",
    intro:
      "The conservative register, whatever the typeface: a light page, conventional headings, no photo, no proficiency meters, no reversed chips and no numbered sections. What is left is the document those fields expect to receive.",
    sections: [
      {
        heading: "Register is a signal of fit",
        body: [
          "Law firms, academic departments, hospital systems, government agencies and much of finance have a house style that has not moved in twenty years. Matching it is not a lack of imagination — it is evidence that you have read the room, and those readers are genuinely asking. A resume that arrives looking like a startup landing page answers a question nobody asked.",
          "It also ages well. A document you will update over a decade is better set in something that was not fashionable in any particular year, because the alternative reads as dated the moment its style cycles out.",
        ],
      },
      {
        heading: "Formal is not the same as crowded",
        body: [
          "The failure mode of a professional resume is not plainness, it is density. Conventional structure invites people to keep adding, and a two-page wall of nine-point type with quarter-inch margins is harder to read than any design decision could make it. The margins and line height on these templates are set where they are on purpose.",
          "If your field expects two pages, take them — nursing, academia and senior technical roles routinely run to two. What should not happen is a second page created by shrinking the type on the first.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the most professional resume format?",
        answer:
          "Reverse-chronological, single column, standard section headings, and a serif or restrained sans-serif face. That is what conservative fields expect and what every applicant tracking system parses most reliably. Functional and skills-based formats raise questions about what is being left out.",
      },
      {
        question: "Do these templates work for a CV as well?",
        answer:
          "Yes. Outside North America the same document is called a CV, and every template here renders one — the difference is length and what you include, not the layout. Academic CVs simply run longer and add publications, teaching and funding.",
      },
    ],
    primary: true,
    related: ["classic", "corporate", "ats"],
    seeAlso: {
      label: "Professional resume templates — the long version",
      href: "/professional-resume-templates",
      note: "Where formality is still the right call, in more detail.",
    },
    canonicalTo: "/professional-resume-templates",
  },
  {
    slug: "classic",
    label: "Classic",
    category: "classic",
    title: "Classic resume templates",
    metaTitle: (n) => `${n} Classic Resume Templates — Serif and Free | meniacv`,
    description:
      "Serif resume and CV templates in the traditional register — the look finance, law, academia and healthcare hiring still expect. Free to edit and export as a real-text PDF.",
    intro:
      "Serif typefaces and conventional structure. A classic resume is not an old one — it is a document that has stopped trying to be of its moment, which is exactly what makes it readable in five years' time.",
    sections: [
      {
        heading: "What a serif face is actually doing",
        body: [
          "Nothing mechanical: a parser extracts serif and sans-serif identically, and no system has ever preferred one. What a serif face changes is register. It carries the conventions of printed documents — books, contracts, journals — and in fields whose working life is still made of those documents it reads as native rather than as a design decision.",
          "It also holds up at small sizes on paper better than most sans faces, which matters if your resume is going to be printed and read across a table rather than scrolled.",
        ],
      },
      {
        heading: "Classic without looking dated",
        body: [
          "The difference between traditional and stale is spacing. A serif face set tight, with underlined headings and text running to the edge of the paper, is the look people mean when they say a resume looks old. The same face with generous line height, clear section separation and honest margins reads as considered.",
          "That is why the templates here vary in heading treatment rather than in typeface — a rule, a band, small caps, or nothing at all. The typography is the constant; the structure is where you choose.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a serif resume harder for an ATS to read?",
        answer:
          "No. Typeface is irrelevant to text extraction — what matters is that the text is real rather than an image, and that the layout does not scramble its order. A serif single-column resume is as safe as anything on this site.",
      },
      {
        question: "What is the difference between classic and professional here?",
        answer:
          "Classic is about the typeface: every template on this page is set in a serif. Professional is about register — no photo, no meters, no chips — and includes sans-serif layouts that are just as conservative.",
      },
    ],
    related: ["professional", "corporate", "simple"],
  },
  {
    slug: "corporate",
    label: "Corporate",
    category: "corporate",
    title: "Corporate resume templates",
    metaTitle: (n) => `${n} Corporate Resume Templates — Structured and Free | meniacv`,
    description:
      "Structured business resume templates with ruled or banded headers and clearly separated sections — the internal-document look large organisations read fastest. Free and ATS-readable.",
    intro:
      "Visible structure: a ruled or banded name block, headings that are obviously headings, and sections a reader can find without reading. This is the look of a document produced inside a large organisation, and in large organisations that is a compliment.",
    sections: [
      {
        heading: "Structure is what gets skimmed well",
        body: [
          "A corporate hiring process is a queue. Your resume is read by a recruiter with fifty others open, then forwarded to a hiring manager who reads it between meetings, then possibly printed for a panel. Every one of those readings is a skim, and a skim is served by rules, bands and unambiguous section boundaries — furniture that tells the eye where to stop.",
          "That is the whole argument for a banded heading. It is not decoration; it is a landmark. The templates on this page all carry at least one — a ruled header, a boxed name block, or headings set on a tinted bar — while keeping everything a parser can trip on out of the way.",
        ],
      },
      {
        heading: "Where the line is",
        body: [
          "Structure stops helping when it becomes ornament. Numbered sections, reversed chips and proficiency meters are excluded from this filter for that reason: they add visual noise that reads as a template rather than as a document, and two of the three parse badly.",
          "If your target is finance, law or government specifically, the professional filter is the stricter cut — same discipline, minus the banded furniture.",
        ],
      },
    ],
    faqs: [
      {
        question: "What makes a resume look corporate?",
        answer:
          "Structure rather than colour: a clearly delimited header, headings that are visually distinct from body text, consistent alignment, and sections in the order a reader expects. Restraint everywhere else — one accent colour at most, no graphics, no meters.",
      },
      {
        question: "Will a banded header cause parsing problems?",
        answer:
          "No. A tint or a rule behind real text is invisible to a parser — it extracts the characters, not the background. The two things that do cause problems are a sidebar that interleaves and text that only exists inside an image.",
      },
    ],
    related: ["professional", "classic", "modern"],
  },
  {
    slug: "minimalist",
    label: "Minimalist",
    category: "minimal",
    title: "Minimalist resume templates",
    metaTitle: (n) => `${n} Minimalist Resume Templates — Free and ATS-Ready | meniacv`,
    description:
      "The strictest cut of the catalogue: one column, no photo, no bands, no rails, nothing decorative. Free to edit, real-text PDF export, no watermark.",
    intro:
      "The strictest filter here. No photo, no sidebar, no header band, no edge strip, no reversed headings — type, space and rules, and nothing else on the page.",
    sections: [
      {
        heading: "What is left when you remove everything",
        body: [
          "Typography and spacing, which is all a resume ever really had. With no furniture to lean on, the hierarchy has to come from size, weight and the distance between things — and when that is done properly, the page reads faster than any banded, ruled, colour-railed version of the same content.",
          "It is also the most honest layout to write into. A minimalist template gives a weak bullet point nowhere to hide, which is uncomfortable for about ten minutes and useful for the rest of your career.",
        ],
      },
      {
        heading: "Minimalist versus simple",
        body: [
          "Simple, on this site, allows a tinted header or a banded heading — plain, but not bare. Minimalist removes those too. In practice the difference is a handful of templates and a slightly quieter page; if you cannot decide, take a simple one and turn the accent colour down.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a minimalist resume boring?",
        answer:
          "Only if the writing is. With no decoration to carry the page, everything depends on the bullets — which is where a reader's attention should have been anyway. In visual fields, a page showing no typographic judgement can itself be a signal; everywhere else it reads as confident.",
      },
      {
        question: "Are these the best templates for ATS?",
        answer:
          "They are all in the ATS-safe set, but so are many templates with more going on. Parsing depends on column count and real text, not on austerity — a banded heading costs you nothing.",
      },
    ],
    related: ["simple", "ats", "one-column"],
  },
  {
    slug: "modern",
    label: "Modern",
    category: "modern",
    title: "Modern resume templates",
    metaTitle: (n) => `${n} Modern Resume Templates — Free and ATS-Ready | meniacv`,
    description:
      "Contemporary sans-serif resume templates with clean hierarchy and real-text PDF export. Free to use, fully customisable, no watermark.",
    intro:
      "Sans-serif typefaces and contemporary hierarchy — the look technology, product and startup hiring reads as current. Modern here means type and spacing rather than decoration a parser cannot read.",
    sections: [
      {
        heading: "What actually reads as modern",
        body: [
          "Mostly typeface and spacing, not ornament. A sans-serif face, generous line height, clear separation between sections and a restrained accent colour will read as current in any industry. A resume that looks dated is usually a serif face set tight with underlined headings — not one that lacks a skills chart.",
          "Worth saying because the templates marketed hardest as modern are the ones carrying infographic elements: proficiency meters, timelines, circular ratings. Those parse worst and communicate least. A five-dot meter beside \"Python\" tells a reader nothing; one bullet describing what you built with it tells them everything.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are modern resume templates ATS-friendly?",
        answer:
          "Typography is irrelevant to a parser — sans and serif extract identically. What matters is column count and whether the text is real. The single-column templates here are as safe as anything on the site; run the copy-paste check on the two-column ones.",
      },
      {
        question: "Is a sans-serif resume acceptable in a conservative field?",
        answer:
          "A clean sans-serif layout is safe almost everywhere now, including finance and law. What still reads as out of place is heavy use of colour, a photo where local convention is against one, and anything resembling an infographic.",
      },
    ],
    primary: true,
    related: ["creative", "corporate", "two-column"],
    seeAlso: {
      label: "Modern resume templates — the long version",
      href: "/modern-resume-templates",
      note: "Modern without the parsing risk, in more detail.",
    },
    canonicalTo: "/modern-resume-templates",
  },
  {
    slug: "ats",
    label: "ATS",
    category: "ats",
    title: "ATS resume templates",
    metaTitle: (n) => `${n} ATS Resume Templates — Parser-Safe and Free | meniacv`,
    description:
      "Single-column, light-page resume templates that parse cleanly in applicant tracking systems — plus how to check any resume yourself in ten seconds. Free, no watermark.",
    intro:
      "Every template on this site exports real text, which is most of what an applicant tracking system needs. These are the ones that also avoid the two things that genuinely break a parse: a sidebar that interleaves when the text is extracted, and a dark page that nothing reads cleanly off.",
    sections: [
      {
        heading: "What an ATS actually does",
        body: [
          "It extracts a stream of characters from your PDF, looks for headings it recognises, splits your history into title, employer, date and description records, and ranks the result against the posting. Nothing is auto-rejected. What happens instead is that a bad parse loses your job titles or your dates, and an unrankable resume is one nobody reads.",
          "Two layout decisions threaten that: a two-column layout that can be read straight across both columns, and a dark page that puts a rendering step between the parser and the text. This filter excludes both, along with edge strips, which is why it is smaller than the full gallery.",
        ],
      },
      {
        heading: "Check yours in ten seconds",
        body: [
          "Export the PDF, select all the text, and paste it into a plain text file. What survives is approximately what a parser sees. If your name is missing, your dates have collapsed, or your skills have landed inside a job description, you have found a real problem — and it will be one of the two above.",
          "The half a template cannot do for you is keyword relevance to the specific posting. That is writing, not layout, and it is where the remaining effort should go.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a special ATS template?",
        answer:
          "You need a single column, real text and conventional headings. That is it. Templates sold as \"ATS-optimised\" are usually plain templates with a markup; the optimisation that matters happens in your bullet points.",
      },
      {
        question: "Does a PDF parse worse than a Word file?",
        answer:
          "No — that advice is about fifteen years out of date. Every mainstream system reads PDFs, and a PDF is the only way to guarantee the page a recruiter sees matches the page you built. Send .docx only when it is explicitly asked for.",
      },
    ],
    primary: true,
    related: ["one-column", "simple", "professional"],
    seeAlso: {
      label: "ATS-friendly resume templates",
      href: "/ats-friendly-resume-templates",
      note: "The same set, with the full mechanics written out.",
    },
    canonicalTo: "/ats-friendly-resume-templates",
  },
  {
    slug: "two-column",
    label: "Two column",
    category: "two-column",
    title: "Two-column resume templates",
    metaTitle: (n) => `${n} Two-Column Resume Templates — Free and Editable | meniacv`,
    description:
      "Two-column and sidebar resume templates, free to use and edit — plus an honest account of when a sidebar costs you and how to check yours parses.",
    intro:
      "A sidebar buys you density: skills, languages, contact details and tools move out of the main flow, and the space left over goes to your experience. It also carries the one layout risk worth taking seriously. Both halves of that are below.",
    sections: [
      {
        heading: "The tradeoff, stated plainly",
        body: [
          "A two-column layout is the only common design choice that can actively break an application. When a parser extracts the text, it may read straight across the page rather than down one column and then the other — dropping your skills list into the middle of a job description and sometimes losing a role's title and dates entirely. An unrankable resume is not rejected; it simply never reaches a person.",
          "This is not universal. Plenty of modern systems handle columns correctly and plenty of people are hired every week from two-column resumes. But you cannot tell which system is on the other end, and the failure is silent.",
        ],
      },
      {
        heading: "How to use one anyway",
        body: [
          "Check it. Export the PDF, select all the text, paste it into a plain text file, and read what comes out. If your history is intact and in order, the template parses and you can stop worrying. If it is interleaved, switch to a single-column template — your writing is untouched by the change.",
          "A reasonable middle path: keep a two-column version for applications sent directly to a person, and a single-column version for anything going through a portal. Both render from the same content.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should go in the sidebar?",
        answer:
          "Lists rather than narrative: contact details, skills, tools, languages, certifications. Never your experience. If a parse does go wrong, losing a skills list is recoverable — losing your employment history is not.",
      },
      {
        question: "Can I switch to one column later?",
        answer:
          "At any time, and it costs nothing. Templates re-render the same content, so switching is a single change and your writing is untouched. That is exactly why keeping both versions is practical.",
      },
    ],
    primary: true,
    related: ["one-column", "picture", "modern"],
    seeAlso: {
      label: "Two-column resume templates",
      href: "/two-column-resume-templates",
      note: "The same set, with the parsing tradeoff in full.",
    },
    canonicalTo: "/two-column-resume-templates",
  },
  {
    slug: "google-docs",
    label: "Google Docs",
    category: "google-docs",
    title: "Google Docs-style resume templates",
    metaTitle: (n) => `${n} Google Docs-Style Resume Templates — Free | meniacv`,
    description:
      "Single-column resume templates in the register Google Docs does well, for anyone weighing Docs against a dedicated editor. Free to edit here, exported as a real-text PDF.",
    intro:
      "Google Docs ships five resume templates and they are genuinely fine — they parse, they cost nothing, they are three clicks away. These are the layouts here in the same register: a single column, standard headings, nothing that would need a table to build.",
    sections: [
      {
        heading: "What Docs does well, and where it stops",
        body: [
          "For a single column of text with clear headings, Docs is perfectly adequate, and the five built-in templates are used successfully by a very large number of people. Where it stops is everything structural. Two columns means a table, and a table in Docs fights you every time you edit a cell. Consistent spacing between sections means remembering to apply the same paragraph style each time. Changing the typeface across a finished document means selecting all and hoping nothing else moves.",
          "The other limit is range: five templates is five, and enough people use them that a recruiter has seen all five this week. Nothing about that costs you an interview, but it is worth knowing what your page looks like in the pile.",
        ],
      },
      {
        heading: "If you are moving off Docs",
        body: [
          "The content transfers by rewriting rather than importing, which sounds worse than it is — a resume is a few hundred words, and retyping it is the fastest edit most people ever give it. What you get back is a layout that does not drift: section spacing, heading treatment and margins are settings rather than habits, and the exported PDF is identical every time.",
          "If you need to hand someone an editable file at the end, keep the Docs copy for that. Export here is PDF, which is the file to send in almost every other case.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I download these to Google Docs?",
        answer:
          "No — export here is PDF. These are the templates that match what Docs does well, for anyone deciding between the two. If you need an editable Docs file at the end of the process, build it there directly.",
      },
      {
        question: "Are Google Docs resume templates ATS-friendly?",
        answer:
          "The built-in five are, and so is anything else that is a single column of real text with conventional headings. The risk in Docs comes from the workarounds — text boxes, tables used as columns, drawings — not from Docs itself.",
      },
    ],
    related: ["word", "simple", "ats"],
    seeAlso: {
      label: "Google Docs resume templates",
      href: "/google-docs-resume-templates",
      note: "What the built-in five give you, and where they run out.",
    },
    canonicalTo: "/google-docs-resume-templates",
  },
];

export const getFilter = (slug: string): TemplateFilter | undefined =>
  TEMPLATE_FILTERS.find((f) => f.slug === slug);

/** The filter row, reduced to what the browser needs: a label, a link and a
 *  count. Built on the server so the page copy above stays out of the client
 *  bundle. */
export interface FilterChip {
  slug: string;
  label: string;
  title: string;
  count: number;
  primary: boolean;
}

export const filterChips = (): FilterChip[] =>
  TEMPLATE_FILTERS.map((f) => ({
    slug: f.slug,
    label: f.label,
    title: f.title,
    count: templatesIn(f.category).length,
    primary: f.primary === true,
  }));
