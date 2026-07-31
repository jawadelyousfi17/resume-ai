// The standalone landing pages: CV vocabulary, the ecosystem pages, and the
// AI builder page.
//
// Two rules held throughout, because both are ways to lose trust in one visit:
//
// 1. Nothing here promises a feature the product doesn't have. The Word page
//    argues the PDF case rather than implying a .docx export exists, and there
//    is deliberately no LaTeX page — the LaTeX generator was removed (see the
//    note at the top of lib/pdf.ts) even though lib/plans.ts still lists it.
// 2. The CV pages are not the resume pages with a word swapped. CV and resume
//    mean different documents in different countries, and a reader who lands
//    on /cv-templates from a British or continental search is asking a
//    different question from someone who searched "resume template".

import type { FaqEntry } from "@/lib/content/guides";
import type { TemplateCategory } from "@/lib/templates";

export interface Landing {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  intro: string;
  updated: string;
  cta: string;
  secondary?: { label: string; href: string };
  /** Show a grid of templates: a category, or the first nine of everything. */
  showTemplates?: TemplateCategory | "all";
  sections: { heading: string; body: string[]; list?: string[] }[];
  linksHeading?: string;
  links?: { label: string; href: string; note: string }[];
  faqs: FaqEntry[];
}

const UPDATED = "2026-07-31";

export const LANDINGS: Landing[] = [
  /* ------------------------------------------------------------------ CV */
  {
    slug: "cv-templates",
    title: "CV templates",
    metaTitle: "Free CV Templates — UK, European and Academic Formats | meniacv",
    description:
      "Free CV templates you can edit and download as a PDF, plus what a CV actually means in the UK, across Europe and in academia — three different documents that share a name.",
    keywords: [
      "cv template",
      "free cv template",
      "cv templates uk",
      "curriculum vitae template",
      "cv format",
    ],
    intro:
      "A CV is not one document. In the UK it is what Americans call a resume; in continental Europe it is that plus a photo and personal details; in academia it is an unabridged record that can run to fifteen pages. These templates cover the first two — and the section below is about telling which one you have been asked for.",
    updated: UPDATED,
    cta: "Build your CV",
    secondary: { label: "CV examples", href: "/cv-examples" },
    showTemplates: "all",
    sections: [
      {
        heading: "Three documents, one word",
        body: [
          "This is the single most useful thing to know before you start, because getting it wrong is not a style error — it is answering a different question from the one you were asked.",
        ],
        list: [
          "UK, Ireland, Australia, New Zealand, South Africa: a CV is a two-page career summary. It is what the US calls a resume, and the words are interchangeable. No photo, no date of birth, no marital status.",
          "Continental Europe — Germany, France, Spain, Italy, the Netherlands and most of the rest: a CV is the same document plus a photo, and often nationality and date of birth. Two pages is normal rather than indulgent.",
          "Academia and research, everywhere: a CV is a complete record — every publication, grant, conference, course taught and committee served. There is no length limit and no editing for brevity. This is a genuinely different document and a two-page template is the wrong tool for it.",
          "The US and Canada outside academia: nobody says CV. If a North American employer asks for one, they mean a resume, and sending fifteen pages will end the application.",
        ],
      },
      {
        heading: "What changes between them",
        body: [
          "Length is the obvious one, and the least interesting. The substantive differences are what you are expected to disclose and how much of your history is expected to survive editing.",
          "A UK CV is edited hard: two pages, most relevant material first, everything older than a decade compressed to a line. A German Lebenslauf is closer to a complete record in reverse-chronological order, with gaps expected to be accounted for rather than quietly closed. A French CV is typically one page and noticeably more formal in register than a British one.",
          "The practical approach if you are applying across countries is to keep one master document and cut a version per market, rather than trying to write something that satisfies all of them. A document that hedges between conventions reads as belonging to none.",
        ],
      },
      {
        heading: "Photo or no photo",
        body: [
          "Include one for Germany, France, Spain, Italy, Austria, Switzerland, and most of continental Europe, Asia and Latin America. Leave it off for the UK, Ireland, the US, Canada and Australia, where many employers strip photos before review and some will not consider an application that includes one.",
          "When you do include one, the technical rule matters more than the aesthetic one: never put text inside the image. A name or contact detail rendered as part of a graphic does not exist to any parser.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "CV examples",
        href: "/cv-examples",
        note: "Complete CVs by role, with the conventions each country expects.",
      },
      {
        label: "CV maker",
        href: "/cv-maker",
        note: "What the editor does, and what it costs — which is nothing to start.",
      },
      {
        label: "ATS-friendly templates",
        href: "/ats-friendly-resume-templates",
        note: "The single-column subset, for applications going through a portal.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a CV and a resume?",
        answer:
          "It depends entirely on where you are. In the UK, Ireland, Australia and New Zealand they mean the same thing — a two-page career summary. In the US and Canada, a resume is that two-page summary and a CV is an exhaustive academic record. In continental Europe, a CV is the standard job-application document and usually includes a photo and some personal details a UK or US employer would never ask for.",
      },
      {
        question: "How long should a CV be?",
        answer:
          "Two pages for almost every non-academic application, in every country that uses the word. One page if you are early career. An academic CV has no limit and routinely runs to ten pages or more, because its job is completeness rather than persuasion — but that is a different document from the one these templates produce.",
      },
      {
        question: "Should a CV include a photo?",
        answer:
          "In continental Europe, yes — its absence is noticed. In the UK, Ireland, the US, Canada and Australia, no: many employers prefer applications without one for bias reasons and some systems remove them automatically. Follow the convention of the country the job is in.",
      },
      {
        question: "Are these CV templates free?",
        answer:
          "Yes. Every template is free to use with unlimited PDF downloads and no watermark, on the free plan, with no card. The paid plans add AI writing, more documents and translation — none of which you need to produce a finished CV here.",
      },
      {
        question: "Do I need a different CV for each country?",
        answer:
          "If you are applying across conventions, yes — but it is a cut of one master document rather than a rewrite. Change the length, add or remove the photo and personal details, and adjust the register. Keeping one source and exporting variants is much less work than maintaining several, and it is what the editor is built for.",
      },
    ],
  },
  {
    slug: "cv-maker",
    title: "CV maker",
    metaTitle: "Free CV Maker — Build and Download a CV Online | meniacv",
    description:
      "A free online CV maker: live preview, every template unlocked, AI writing help, and a real-text PDF with no watermark. No card to start.",
    keywords: [
      "cv maker",
      "free cv maker",
      "cv builder",
      "online cv maker",
      "make a cv online",
    ],
    intro:
      "Write once, see it laid out as you type, and download a PDF that an applicant tracking system can actually read. The free plan keeps one CV forever with unlimited downloads and no watermark, which is more than most builders give you before asking for a card.",
    updated: UPDATED,
    cta: "Start your CV",
    secondary: { label: "See the templates", href: "/cv-templates" },
    sections: [
      {
        heading: "What it does",
        body: [
          "The editor shows a live render of the actual document rather than an approximation of it. Every template is a set of layout decisions applied to the same content, so switching between them re-renders what you have written instead of asking you to start over — you can write first and decide how it looks afterwards.",
        ],
        list: [
          "Live preview that matches the PDF exactly, because it is the same renderer",
          "All 32 templates on every plan, including the free one",
          "Full control of accent colour, typeface, size, line height and margins",
          "Real-text PDF export, unlimited, with no watermark on any plan",
          "Ten languages to write in, including right-to-left Arabic",
          "Works without an account — your draft is kept in the browser, and signing in later brings it with you",
        ],
      },
      {
        heading: "What the AI does, and what it won't",
        body: [
          "The assistant rewrites what you have written. It sharpens a summary, turns a responsibility into an achievement, and tightens a bullet that runs long. It works from what is already on the page rather than from a prompt, which is the difference between help and invention.",
          "What it will not do is supply facts you did not give it. Where a stronger sentence would need a number you have not provided, it writes the sentence without one rather than making the number up. That constraint is deliberate: a CV that impresses and then collapses in the interview is worse than a plain one.",
          "Nothing you write is used to train a model. Your CV is sent to produce the response you asked for and nothing else.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "One CV is free forever, with every template and unlimited watermark-free PDF downloads. There is no trial period and nothing expires.",
          "The paid plans add the writing tools, more documents at once, importing an existing file, the scored review and translation. They are described in full on the pricing page, and there is no checkout yet — while that is true, the first hundred accounts get the top plan free for a year.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "CV templates",
        href: "/cv-templates",
        note: "The layouts, and what a CV means in each country.",
      },
      {
        label: "CV examples",
        href: "/cv-examples",
        note: "Complete documents by role, written to the pattern.",
      },
      {
        label: "Pricing",
        href: "/pricing",
        note: "What is free, what is not, and exactly where the line is.",
      },
    ],
    faqs: [
      {
        question: "Is this CV maker really free?",
        answer:
          "Yes, for one CV. All 32 templates, full layout control, and unlimited PDF downloads with no watermark, without a card and without a trial that expires. The paid plans add AI writing, more documents and translation.",
      },
      {
        question: "Do I need an account to make a CV?",
        answer:
          "No. You can write, preview and download a PDF without signing in — the draft is kept in your browser. Signing in later brings that document with you rather than starting again.",
      },
      {
        question: "Can I download my CV as a Word document?",
        answer:
          "No. Export is a real-text PDF, which is what almost every employer and applicant tracking system wants, and it is the format that guarantees your layout survives the trip. If a specific employer insists on .docx, this is not the right tool for that application.",
      },
      {
        question: "Will my CV pass an ATS?",
        answer:
          "The document will parse: real text, standard headings, conventional dates, and a single column on most of the templates. The two-column ones are worth checking with the copy-paste test. The other half of passing is keyword relevance to the specific posting, which is writing rather than formatting.",
      },
    ],
  },
  /* ----------------------------------------------------------- ecosystem */
  {
    slug: "canva-resume-templates",
    title: "Canva resume templates: the honest comparison",
    metaTitle: "Canva Resume Templates vs a Real Builder — What to Know | meniacv",
    description:
      "Canva resume templates look excellent and parse badly. What goes wrong in an applicant tracking system, when Canva is genuinely the right choice, and the alternative.",
    keywords: [
      "canva resume templates",
      "canva resume",
      "canva cv template",
      "is canva good for resumes",
    ],
    intro:
      "Canva makes the best-looking resume templates available anywhere, and that is not a backhanded compliment — the design work is genuinely good. The problem is what happens between the download and the recruiter, and it is worth understanding before you spend an evening on one.",
    updated: UPDATED,
    cta: "Try the alternative free",
    secondary: {
      label: "ATS-friendly templates",
      href: "/ats-friendly-resume-templates",
    },
    showTemplates: "modern",
    sections: [
      {
        heading: "What goes wrong",
        body: [
          "Canva is a graphic design tool, and a resume made in one is built the way a poster is: as positioned elements on a canvas rather than as a document with a reading order. That distinction is invisible on screen and decisive in a parser.",
        ],
        list: [
          "Text in boxes. Canva lays out text in independently positioned frames. Extraction order follows the file rather than the visual layout, so a sidebar can end up interleaved into a job description.",
          "Icons and graphics carrying meaning. A phone icon next to a number is fine; a skills chart, a proficiency ring or a timeline graphic contributes nothing at all, because there is no text in it.",
          "Text rendered as an image. Some elements flatten on export. Anything flattened is invisible to the system, and if your name goes that way you are unreachable.",
          "Custom section headings. Design templates like inventive headings — \"Where I've Made an Impact\" — and a parser matching on \"Experience\" files that content nowhere.",
          "Two and three column layouts, which are the norm in Canva's resume category and the single most common cause of a mangled parse.",
        ],
      },
      {
        heading: "When Canva is the right answer",
        body: [
          "There are real cases, and pretending otherwise would be the same dishonesty in the other direction. If you are applying directly to a person — a founder, a hiring manager whose email you have, a small studio with no applicant tracking system — nothing is parsing your file and a beautifully designed page is a genuine advantage.",
          "The same applies to portfolio-adjacent fields where the document is partly a work sample: graphic design, art direction, illustration, brand. In those roles a plain page is itself a signal, and the parsing risk is worth taking.",
          "What does not work is using a Canva template for a portal application at a large company and hoping. That is the case where the design costs you rather than helping.",
        ],
      },
      {
        heading: "The middle path",
        body: [
          "The templates here are designed rather than default — real typographic decisions, accent colours, banded and chipped headings — but they are built as documents, so the export is real text in a sensible reading order. That is the whole proposition: most of the visual benefit, none of the parsing risk.",
          "If you have already built something in Canva that you like, the most useful thing to do is export it, copy the text out of the PDF, and read what comes back. That tells you in ten seconds whether the version a recruiter's system sees resembles the one you designed.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "ATS-friendly templates",
        href: "/ats-friendly-resume-templates",
        note: "The single-column set, for anything going through a portal.",
      },
      {
        label: "Modern templates",
        href: "/modern-resume-templates",
        note: "Contemporary layouts that still export as real text.",
      },
      {
        label: "The ATS guide",
        href: "/guides/ats-friendly-resume",
        note: "What these systems actually do, minus the folklore.",
      },
    ],
    faqs: [
      {
        question: "Are Canva resume templates ATS-friendly?",
        answer:
          "Mostly not, and the reason is structural rather than aesthetic. Canva builds pages as positioned elements rather than as documents, so extraction order is unreliable, and its resume category leans heavily on multi-column layouts and infographic elements that carry no text. Some simple single-column Canva templates parse acceptably; the ones people choose it for generally do not.",
      },
      {
        question: "How do I check if my Canva resume parses?",
        answer:
          "Export the PDF, select all the text, and paste it into a plain text file. What survives is roughly what a parser sees. If your job titles and dates are intact and in order, you are fine. If the sidebar has landed in the middle of a job description, or your name is missing entirely, that is what the employer's system receives.",
      },
      {
        question: "Is Canva or a resume builder better?",
        answer:
          "Canva is better when a human opens your file directly and design is part of the pitch. A builder is better when the file goes into a system first, which covers most applications at companies above about fifty people. The honest split is by destination rather than by taste.",
      },
      {
        question: "Can I import a Canva resume here?",
        answer:
          "You can import the PDF you exported from it. The assistant reads a PDF, an image or a text file into the editor — your details, roles, bullet points, education and skills — so you are not retyping. Importing is part of the Basic plan.",
      },
    ],
  },
  {
    slug: "google-docs-resume-templates",
    title: "Google Docs resume templates",
    metaTitle: "Google Docs Resume Templates — The Five, and the Limits | meniacv",
    description:
      "What Google Docs' built-in resume templates actually give you, where they run out, and how to get a better-looking document that still parses cleanly.",
    keywords: [
      "google docs resume template",
      "google docs resume",
      "free google docs resume templates",
      "resume template google docs",
    ],
    intro:
      "Google Docs ships five resume templates — Swiss, Serif, Coral, Spearmint and Modern Writer — and they are genuinely fine. They parse well, they cost nothing, and they are three clicks away. It is worth being clear about where they stop.",
    updated: UPDATED,
    cta: "Try something with more range",
    secondary: { label: "See all templates", href: "/resume-templates" },
    showTemplates: "minimal",
    sections: [
      {
        heading: "What Google Docs does well",
        body: [
          "It parses. The built-in templates are single-column, they use standard headings, and everything on the page is real text — which is most of what an applicant tracking system needs. If your only question is whether a Google Docs resume will survive a portal, the answer is yes.",
          "It is also collaborative in a way nothing else here is. If someone is reviewing your resume for you, comment threads on the actual document beat a list of suggestions in an email, and that is a real advantage during a job search.",
        ],
      },
      {
        heading: "Where it runs out",
        body: [
          "Five templates is five templates. They are competent and they are also instantly recognisable, which matters more than it should when a recruiter is reading their fortieth application of the week.",
          "The bigger issue is that a word processor does not know it is laying out a resume. Changing template means reformatting by hand rather than re-rendering. Keeping dates aligned across ten roles is manual work that comes undone the moment you add an eleventh. Tailoring to a posting means duplicating the file and editing both copies forever. None of these are hard individually; together they are the reason a resume stops being updated.",
          "There is also no help with the writing, which is the part most people are actually stuck on. A blank Google Doc and a blank sheet of paper pose exactly the same problem.",
        ],
      },
      {
        heading: "Moving across",
        body: [
          "Download your Google Doc as a PDF and import it — the assistant reads it into structured fields, so your history arrives as data rather than as a block of text you have to retype. From there, switching template is one click, tailoring is a copy rather than a fork, and the alignment stays correct because it is rendered rather than typed.",
          "If Google Docs is working for you, though, it is working. It is a legitimate answer, which is more than can be said for a lot of what gets recommended.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "Simple templates",
        href: "/simple-resume-templates",
        note: "The closest equivalent to the Google Docs house style, with more choice.",
      },
      {
        label: "ATS-friendly templates",
        href: "/ats-friendly-resume-templates",
        note: "The parser-safe subset, for portal applications.",
      },
      {
        label: "How to write a resume",
        href: "/guides/how-to-write-a-resume",
        note: "The part a blank document doesn't help with.",
      },
    ],
    faqs: [
      {
        question: "Are Google Docs resume templates ATS-friendly?",
        answer:
          "Yes. All five built-ins are single-column with standard headings and real text, which is what a parser needs. They are among the safer starting points available, and considerably safer than most design-tool templates.",
      },
      {
        question: "How many resume templates does Google Docs have?",
        answer:
          "Five: Swiss, Serif, Coral, Spearmint and Modern Writer. There are third-party template galleries that offer more, but their quality and their parsing behaviour vary enormously and many reintroduce the multi-column problem the built-ins avoid.",
      },
      {
        question: "Should I send my resume as a Google Doc link?",
        answer:
          "No. Download it as a PDF and attach that. A link depends on your sharing settings being right, it can expose your edit history, and it tells the employer when you opened it. A PDF is the format that behaves predictably at the other end.",
      },
      {
        question: "Can I import a Google Docs resume here?",
        answer:
          "Yes, via PDF. Download from Google Docs as a PDF and the assistant reads it into the editor as structured content rather than a wall of text. Importing is part of the Basic plan.",
      },
    ],
  },
  {
    slug: "word-resume-templates",
    title: "Word resume templates, and whether you need one",
    metaTitle: "Word Resume Templates — PDF vs .docx, Honestly | meniacv",
    description:
      "Whether you actually need a Word resume template in 2026, what .docx costs you at the other end, and the cases where it is still the right answer.",
    keywords: [
      "word resume template",
      "microsoft word resume template",
      "resume template docx",
      "pdf or word resume",
    ],
    intro:
      "Being straight about this up front: meniacv exports PDF, not .docx, and there is no Word export planned that we would promise you today. That makes this page an argument rather than a download — here is when PDF is the better answer, and when it genuinely is not.",
    updated: UPDATED,
    cta: "Build a PDF resume free",
    secondary: { label: "See all templates", href: "/resume-templates" },
    sections: [
      {
        heading: "Why PDF is usually right",
        body: [
          "A .docx renders differently on every machine that opens it. Fonts substitute, margins shift, a two-page document becomes three, and the page a recruiter sees is not the page you built. This is not a rare edge case — it is the normal behaviour of a format designed to be re-editable rather than to be final.",
          "PDF fixes the layout and still contains real, extractable text, which is the combination applicant tracking systems need. The old advice that PDFs do not parse is roughly fifteen years out of date; every mainstream system reads them, and most employers now prefer them.",
          "There is a second reason that gets less attention: a .docx carries metadata and revision history. Sending one hands over more about how the document was made than most people intend.",
        ],
      },
      {
        heading: "When you genuinely need .docx",
        body: [
          "Some situations are real and no amount of arguing changes them.",
        ],
        list: [
          "The posting explicitly asks for a Word document. Send what is asked for — this is a filter, not a preference.",
          "You are working through a recruitment agency. Agencies routinely reformat candidates into their own house template and add a cover sheet, and they need an editable file to do it.",
          "An old internal portal that rejects PDF uploads. These still exist, mostly in the public sector and in large organisations running long-lived systems.",
          "Someone else has to edit the document — a career advisor, a university careers service, a colleague doing a rewrite rather than a review.",
        ],
      },
      {
        heading: "What to do if you need one",
        body: [
          "Use Microsoft's own templates through Word or Office Online, or Google Docs with a download to .docx. Both give you an editable file and both are free. Keep it single column and use standard headings, because the parsing rules are the same regardless of format.",
          "The tempting workaround — export a PDF here and convert it — is not one we would recommend. PDF-to-Word conversion produces a document held together with text boxes and manual line breaks, which parses worse than either format on its own and falls apart the moment anyone edits it. If you need Word, start in Word.",
          "For everything else, which is most applications, a PDF is the file to send.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "ATS-friendly templates",
        href: "/ats-friendly-resume-templates",
        note: "Single-column layouts that parse whatever the format debate.",
      },
      {
        label: "The ATS guide",
        href: "/guides/ats-friendly-resume",
        note: "What actually breaks a parse, format aside.",
      },
      {
        label: "FAQ",
        href: "/faq",
        note: "What the editor does and doesn't support, in full.",
      },
    ],
    faqs: [
      {
        question: "Should I send my resume as a PDF or a Word document?",
        answer:
          "PDF, unless you have been asked for Word. PDF preserves your layout exactly, still contains extractable text, and carries less metadata. Send .docx when the posting asks for it, when an agency needs to reformat you, or when a legacy portal refuses PDF uploads.",
      },
      {
        question: "Can I download a Word resume from meniacv?",
        answer:
          "No. Export is a real-text PDF and there is no .docx export. If a specific application requires Word, use Microsoft's own templates or Google Docs with a .docx download — this is not the right tool for that one.",
      },
      {
        question: "Do applicant tracking systems reject PDFs?",
        answer:
          "Essentially never, and the belief that they do is around fifteen years out of date. Every mainstream system reads PDF. What breaks a parse is structure — multiple columns, text inside images, invented headings — and those break a Word document exactly as thoroughly.",
      },
      {
        question: "Can I convert a PDF resume to Word?",
        answer:
          "You can, but it is a bad idea. Converters rebuild the page out of text boxes and manual breaks, producing a file that parses worse than either original format and that comes apart as soon as it is edited. If you need a Word document, build it in Word.",
      },
    ],
  },
  /* ----------------------------------------------------------- AI builder */
  {
    slug: "ai-resume-builder",
    title: "AI resume builder",
    metaTitle: "Free AI Resume Builder — Writes From Your History | meniacv",
    description:
      "An AI resume builder that rewrites what you wrote instead of inventing a career. Live preview, ATS-ready templates, real-text PDF export, and nothing used to train a model.",
    keywords: [
      "ai resume builder",
      "ai resume writer",
      "resume ai",
      "ai resume generator",
      "free ai resume builder",
    ],
    intro:
      "Most AI resume tools generate a plausible resume for a job title. That is the wrong product: it produces a document that reads well, describes someone who does not exist, and falls apart in the first interview. This one works the other way round — it starts from what you actually did and makes the sentences better.",
    updated: UPDATED,
    cta: "Try it free",
    secondary: { label: "See the templates", href: "/resume-templates" },
    showTemplates: "ats",
    sections: [
      {
        heading: "What it does",
        body: [
          "The assistant operates on the content already in your editor, field by field, rather than generating a document from a prompt. That constraint is the design, not a limitation we are apologising for.",
        ],
        list: [
          "Rewrites a bullet point so it leads with ownership and ends with a result",
          "Drafts a summary from the history you have already entered",
          "Tightens anything running long, without dropping the specifics",
          "Reads an existing resume out of a PDF, image or text file into structured fields",
          "Scores the whole page across impact, clarity, completeness, language and ATS fit",
          "Tailors a copy to one posting — reordering and re-emphasising, not fabricating",
          "Translates a finished resume into 40+ languages",
        ],
      },
      {
        heading: "What it will not do",
        body: [
          "It will not invent a number. Where a stronger sentence would need a metric you have not supplied, it writes the sentence without one rather than inserting a plausible figure. An invented 30% is the single most common way an AI-written resume ends a candidacy, because the interview asks about it.",
          "It will not give you a job you did not have, a tool you have not used, or a degree you did not finish. Everything it produces is traceable to something you typed.",
          "It will not make the resume sound like a machine wrote it, provided you read what comes back. The most common tell is not the vocabulary — it is uniformity, every bullet the same length and rhythm. Keep the ones that sound like you and rewrite the ones that do not.",
        ],
      },
      {
        heading: "Your resume is never used to train a model",
        body: [
          "Nothing you write here becomes training data. Your document is sent to produce the response you asked for and nothing else, it is not retained for training by us or by the model provider, and there is no setting you have to find and switch off.",
          "For a document containing your full employment history, your contact details and often your address, that is not a minor feature. It is the reason to use a tool that says so plainly over one that does not mention it.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "Building, previewing and exporting a resume is free — one document, every template, unlimited watermark-free PDFs, no card. The AI writing tools are part of the Basic plan at $9 a month, or $3 a month billed yearly, and translation is part of Ultimate.",
          "There is no checkout yet. While that is true the first hundred accounts are given Ultimate free for a year.",
        ],
      },
    ],
    linksHeading: "Related",
    links: [
      {
        label: "The AI resume guide",
        href: "/guides/ai-resume-builder",
        note: "How to use these tools without producing something generic.",
      },
      {
        label: "Resume review",
        href: "/resume-review",
        note: "The scored review, and how it compares to a human reader.",
      },
      {
        label: "ATS score",
        href: "/resume-ats-score",
        note: "What a score measures and how to raise yours.",
      },
    ],
    faqs: [
      {
        question: "Is there a free AI resume builder?",
        answer:
          "Building and exporting a resume here is free, including all 32 templates and unlimited watermark-free PDFs. The AI writing tools specifically are part of the Basic plan at $9 a month, or $3 a month billed yearly. Tools advertising completely free AI writing generally recoup it at the download, with a watermark or a paywall on the export.",
      },
      {
        question: "Can employers tell if AI wrote my resume?",
        answer:
          "They can often tell when AI wrote it unedited, and the tell is rarely vocabulary — it is uniformity. Every bullet the same length, every sentence the same rhythm, and no specifics that could only belong to you. AI used to sharpen your own material does not read that way, because the substance underneath is yours.",
      },
      {
        question: "Will an AI-written resume pass an ATS?",
        answer:
          "Parsing has nothing to do with who wrote the text — it is about structure, and the templates here handle that. Where AI genuinely helps is the other half: matching the vocabulary of the posting, which is what the tailoring tool does by re-emphasising what you already have rather than adding claims.",
      },
      {
        question: "Is my resume used to train the AI?",
        answer:
          "No. It is sent to produce the response you asked for and is not used for training, by us or by the model provider. Your documents stay in your account and you can delete them at any time.",
      },
      {
        question: "Can AI write my resume from scratch?",
        answer:
          "It can, and you should not want it to. A resume generated from a job title is a description of a plausible stranger — it interviews badly and it is why so much AI-written material reads as interchangeable. Enter your real history first, however roughly, and use the assistant to make it read well.",
      },
    ],
  },
];

export const getLanding = (slug: string): Landing | undefined =>
  LANDINGS.find((landing) => landing.slug === slug);
