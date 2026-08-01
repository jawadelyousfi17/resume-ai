// The written guides behind /guides/<slug>.
//
// Content lives here rather than in the page components so every guide gets
// the same layout, the same metadata, the same structured data and the same
// internal linking without any of it being retyped. Adding a guide is adding
// an entry to GUIDES — the route, sitemap and index page pick it up.

import type { TemplateCategory } from "@/lib/templates";

export interface GuideSection {
  heading: string;
  /** Paragraphs. */
  body: string[];
  /** An optional bulleted list rendered after the paragraphs. */
  list?: string[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * A before/after pair. These pages spend a lot of words arguing that a
 * responsibility should be rewritten as an outcome, and one pair of sentences
 * side by side makes the case faster than a paragraph about it does.
 */
export interface GuideRewrite {
  /** What kind of line this is — "Bullet point", "Summary", "Skill". */
  label?: string;
  before: string;
  after: string;
  /** One sentence on what changed, if it isn't self-evident. */
  note?: string;
}

/** A two-column comparison, for the guides whose whole subject is a pair of
 *  things people confuse. Rendered as a real table. */
export interface GuideCompare {
  heading: string;
  /** The row-label column header, then the two things being compared. */
  columns: [string, string, string];
  rows: [string, string, string][];
}

/** The template strip every guide carries: a cut of the gallery that follows
 *  from what the guide argued, rather than the same nine everywhere. */
export interface GuideTemplates {
  heading: string;
  blurb: string;
  category: TemplateCategory;
  /** How many to show. Six by default — two rows of three. */
  count?: number;
}

export interface Guide {
  slug: string;
  /** The <h1>. */
  title: string;
  /** The <title>, which can be longer and carry the brand. */
  metaTitle: string;
  description: string;
  eyebrow: string;
  /** ISO date, surfaced to readers and to search engines. */
  updated: string;
  intro: string;
  /** The answer, before the argument for it. Four or five lines, at the top,
   *  for the reader who came for one fact and is going to leave with it. */
  takeaways?: string[];
  sections: GuideSection[];
  /** Side-by-side rewrites, where the guide is about how something is written. */
  rewrites?: GuideRewrite[];
  /** A comparison table, where the guide is about two things people confuse. */
  compare?: GuideCompare;
  /** The actionable version of the guide: what to check on your own page. */
  checklist?: { heading: string; items: string[] };
  /** Which templates to show, and why these ones. */
  templates?: GuideTemplates;
  faqs: FaqEntry[];
  /** Slugs of two or three guides worth reading next. */
  related: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "ai-resume-builder",
    title: "How an AI resume builder actually helps",
    metaTitle: "AI Resume Builder — What It Can and Can't Do | meniacv",
    description:
      "What AI is genuinely good at when writing a resume, what it should never be trusted with, and how to use it without ending up with a generic document.",
    eyebrow: "AI writing",
    updated: "2026-07-25",
    intro:
      "Every resume tool now advertises AI. Most of them mean the same thing: a text box that generates plausible-sounding bullet points from a job title. That produces resumes that read well and say nothing. The useful version is narrower and much more valuable — a model that works only from what you have already written, and sharpens it.",
    takeaways: [
      "AI is an editor, not an author. It may rewrite what you gave it; it may not add facts.",
      "Ask for transformation — \"tighten this\", \"find the missing outcome\" — never generation from a job title.",
      "The quality of the output tracks the quality of your input almost exactly. Write the ugly version first.",
      "The tell recruiters notice is uniformity, not vocabulary: every bullet the same length and rhythm.",
      "Check the data policy before pasting a document carrying your full employment history into anything.",
    ],
    sections: [
      {
        heading: "What AI is genuinely good at",
        body: [
          "Editing is where a language model earns its place. You know what you did; you are just too close to it to see that \"was responsible for the payments service\" buries the achievement. A model has no such attachment, and rewriting that into \"Owned the payments service processing 2M transactions a month\" is exactly the kind of transformation it does reliably.",
          "The same applies to the jobs nobody enjoys: turning six years of history into a three-sentence summary, finding the skills your experience already demonstrates but never names, and reading a resume the way a stranger would in ten seconds.",
        ],
        list: [
          "Tightening a bullet you wrote into something sharper, same facts",
          "Drafting a summary from the roles already on the page",
          "Naming skills your experience proves but never states",
          "Reviewing the whole document and ranking what to fix first",
          "Translating a finished resume for an international application",
        ],
      },
      {
        heading: "What it should never be trusted with",
        body: [
          "Anything it cannot know. A model asked to write your experience from a job title will invent an employer, a metric, or a scope of work — not maliciously, but because that is what generating plausible text means. A resume with an invented number on it is a resume that falls apart in the interview.",
          "The rule worth holding a tool to: it may rewrite what you gave it, and it may not add facts. If you can't point at where a claim on your resume came from, it should not be there.",
        ],
      },
      {
        heading: "Give it something to work with",
        body: [
          "The quality of AI editing tracks the quality of the input almost exactly. \"Worked on the API\" gives a model nothing to sharpen, so it either returns the same sentence in different words or quietly invents specifics.",
          "Write the ugly version first. Scope, numbers, outcome, in whatever order they come out. \"Rewrote the checkout flow, took page load from 4s to under 1s, conversion went up about 18%\" is a rough sentence with everything that matters in it — and a model can turn that into a strong bullet without adding anything.",
        ],
      },
      {
        heading: "Keep your own voice",
        body: [
          "Accept edits selectively. If every bullet comes back in the same rhythm — verb, object, metric, verb, object, metric — the page starts to read as machine-written even though each line is technically fine. Keep a few of your own sentences. Variation is what makes a resume sound like a person.",
          "A practical habit: read the rewrite out loud. If it uses a word you wouldn't use in an interview, change it back. You will have to defend every line on that page in conversation.",
        ],
      },
    ],
    rewrites: [
      {
        label: "What a good prompt returns",
        before: "Was responsible for the payments service",
        after:
          "Owned the payments service processing 2M transactions a month, and cut failed-settlement retries from a manual on-call task to an automatic one",
        note:
          "Nothing was invented. The volume and the retry work were in the rough notes; the model reordered them into ownership first, outcome last.",
      },
      {
        label: "What a bad prompt returns",
        before: "Write me an impressive bullet for a marketing manager",
        after:
          "Drove a 47% increase in qualified pipeline through an integrated demand-generation strategy across paid, owned and earned channels",
        note:
          "Fluent, plausible, and entirely fabricated — the number, the channels and the strategy were all supplied by the model. This is the failure mode, not an example to copy.",
      },
    ],
    checklist: {
      heading: "Before you trust an AI edit",
      items: [
        "Every number in the output traces back to something you wrote",
        "Every employer, tool and job title is one you actually worked with",
        "At least two bullets still sound like you rather than like a model",
        "Bullet lengths vary — a page where all of them run to two lines reads as processed",
        "You can defend every claim on the page for two minutes in an interview",
        "Nothing has been added that you would have to walk back if asked",
        "You have checked whether the tool trains on what you paste into it",
      ],
    },
    templates: {
      heading: "Templates that stay out of the way",
      blurb:
        "AI editing improves the words, which only helps if the page lets them be read. These are the single-column layouts with nothing between the writing and the reader — and every one exports as real text.",
      category: "ats",
    },
    faqs: [
      {
        question: "Will a recruiter know my resume was written with AI?",
        answer:
          "They will if it reads like it — uniform sentence rhythm, buzzwords, and claims with no specifics. They won't if the content is yours and AI only tightened the wording. The tell is genericness, not the tool.",
      },
      {
        question: "Can AI write my resume from scratch?",
        answer:
          "It can produce something resume-shaped, but every fact in it will be invented. Use it to edit what you've written, not to supply the substance.",
      },
      {
        question: "Does AI-assisted writing hurt ATS performance?",
        answer:
          "No. Applicant tracking systems parse structure and keywords, and neither is affected by how the text was drafted. Formatting choices matter far more.",
      },
    ],
    related: ["how-to-write-a-resume", "resume-bullet-points", "ats-friendly-resume"],
  },

  {
    slug: "how-to-write-a-resume",
    title: "How to write a resume, step by step",
    metaTitle: "How to Write a Resume in {year} — Step-by-Step Guide | meniacv",
    description:
      "A practical order of operations for writing a resume from nothing: what goes on the page, what to cut, and how to make each line earn its space.",
    eyebrow: "Guide",
    updated: "2026-07-25",
    intro:
      "Most resume advice starts with formatting, which is the last thing that matters. Start with what you did, get it on the page in plain language, then shape it. This is the order that works.",
    takeaways: [
      "Write the experience section first. Everything else on the page is easier once it exists.",
      "One thought per bullet: what you did, at what scale, and what changed as a result.",
      "The summary is written last, from what is already on the page — never before it.",
      "One page under about ten years of experience, two beyond it.",
      "Cutting is the pass that improves it most. A line is charged against the attention available for the line under it.",
    ],
    sections: [
      {
        heading: "1. Dump everything first",
        body: [
          "Before worrying about wording, list every role, project, and responsibility you can remember, along with any number attached to it — team size, budget, users, latency, revenue, error rate, headcount you hired. Don't edit while you do this. You are building raw material.",
          "This stage is uncomfortable because it looks like a mess. That is fine. A messy list of true specifics beats a tidy page of vague claims, and everything after this is subtraction.",
        ],
      },
      {
        heading: "2. Decide what the resume is for",
        body: [
          "A resume is not a career history, it is an argument for one particular job. Pick the role you are actually applying for and let it decide what stays. The consultancy work is essential on one application and a distraction on another.",
          "If you are applying for materially different roles, keep separate versions. Tailoring beats a single document that hedges between two directions.",
        ],
      },
      {
        heading: "3. Write the experience section first",
        body: [
          "It is the section that gets read, so write it while you are fresh. For each role: what you owned, what you changed, and what the result was. Three to five bullets for recent roles, one or two for older ones.",
          "Lead every bullet with a verb and put the outcome where it can't be missed. \"Cut onboarding time from three weeks to four days by rebuilding the setup flow\" says more in one line than a paragraph of responsibilities.",
        ],
      },
      {
        heading: "4. Then the summary",
        body: [
          "Write the summary last, even though it sits first. Once the experience section exists, the summary is a distillation of it — two or three sentences on what you do, the ground you cover, and what you are strongest at.",
          "Skip the adjectives. \"Results-driven professional with a passion for excellence\" is invisible to a reader; \"Backend engineer, nine years, payments and identity systems in regulated fintech\" is not.",
        ],
      },
      {
        heading: "5. Education, skills, and the rest",
        body: [
          "Education goes near the bottom once you have a few years of experience, and near the top before that. List skills you could be interviewed on — a language you used once does not belong next to the one you have shipped production systems in.",
          "Everything else is optional and earns its place only if it supports the argument: projects if they show work your jobs don't, volunteering if it demonstrates relevant scope, languages if the role is international.",
        ],
      },
      {
        heading: "6. Cut it down",
        body: [
          "One page under ten years of experience, two beyond that. This constraint is what forces the quality up — when a line has to compete for space, the weak ones become obvious.",
          "Read it as a stranger would: ten seconds, top to bottom. If the most impressive thing you have done isn't visible in that pass, move it up.",
        ],
      },
      {
        heading: "Working from an example rather than a blank page",
        body: [
          "A blank page is the worst place to start, and it is where most of the difficulty in this process actually lives. Working from a finished resume in your own field is faster and produces a better first draft, because you can see what a real bullet looks like in your discipline before you try to write one.",
          "Use it for structure and register, not for content. What an example shows you is which sections that field expects, how much detail a bullet carries, what a summary sounds like at your level, and what kind of numbers people quote. What it must never supply is a claim — a bullet copied from someone else's resume is a fact about someone else, and it collapses in the first interview.",
          "The role examples on this site are written for exactly this: a complete document per job title, with the reasoning beside it, so you can see both what the page looks like and why it is built that way.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Step 1 — the raw note",
        before: "Handled customer complaints",
        after:
          "Handled the escalation queue for a 2M-user product — about 40 cases a week, at a 94% satisfaction score",
        note:
          "The first version is a duty. The second is the same duty with the volume and the result attached, which is all the rewrite pass ever does.",
      },
      {
        label: "Step 2 — the summary, written last",
        before:
          "Hard-working professional seeking a challenging role in a dynamic organisation",
        after:
          "Support lead, six years in B2B SaaS, currently running a four-person escalation team for a 2M-user product. Looking for a support management role at a company with a real product-feedback loop.",
        note:
          "Every clause in the second version came from a bullet already on the page. That is why it is written last.",
      },
    ],
    checklist: {
      heading: "The finished-page check",
      items: [
        "Your name, current title and city are readable in the first two seconds",
        "Experience is reverse-chronological, most recent first",
        "Three to five bullets on recent roles, one or two on older ones",
        "At least three bullets across the page end in something that changed",
        "The summary says something the chronology cannot",
        "No \"references available on request\", no objective, no full street address",
        "Consistent date format, tense and punctuation throughout",
        "It fits at eleven point with half-inch margins without compression",
      ],
    },
    templates: {
      heading: "Start from one of these",
      blurb:
        "A blank page is the hardest place to begin. These are the plain single-column layouts that suit almost any field — pick one, put your history in it, and spend the time you saved on the bullets.",
      category: "simple",
    },
    faqs: [
      {
        question: "How do I write a resume, step by step?",
        answer:
          "Dump everything you have done into a document first, without editing. Decide which job the resume is for. Write the experience section, one bullet per thing you did, each ending in what changed. Then write the summary from what is already on the page, add education and skills, and cut to one or two pages.",
      },
      {
        question: "How do I make a resume without AI?",
        answer:
          "The same way — the process above is entirely manual, and the hard part of it is remembering what you actually did and deciding what matters, neither of which a model can do for you. A template gives you the structure and an example in your field gives you the register; the writing is yours.",
      },
      {
        question: "Where can I find free resume samples?",
        answer:
          "The resume examples section here has a complete sample document for every major job title, with the reasoning beside it. Use them for structure, section order and the level of detail your field expects — never for the claims themselves, which have to be yours.",
      },
      {
        question: "How long should a resume be?",
        answer:
          "One page for under ten years of experience, two beyond that. Academic CVs are the exception and run longer by convention.",
      },
      {
        question: "Should I include a photo?",
        answer:
          "It depends on where you're applying. Photos are normal in much of continental Europe and the Middle East, and discouraged in the US, UK, Canada and Australia, where they raise discrimination concerns.",
      },
      {
        question: "Do I need a cover letter?",
        answer:
          "Only where one is asked for, and it should say something the resume can't — why this company, or an explanation the history needs. A cover letter that restates the resume is worse than none.",
      },
    ],
    related: ["resume-bullet-points", "resume-summary-examples", "resume-format"],
  },

  {
    slug: "ats-friendly-resume",
    title: "Writing an ATS-friendly resume",
    metaTitle: "ATS-Friendly Resume — What Actually Matters | meniacv",
    description:
      "What applicant tracking systems really do with your resume, which formatting choices break parsing, and how to stay readable to both software and people.",
    eyebrow: "Formatting",
    updated: "2026-07-25",
    intro:
      "Applicant tracking systems are widely misunderstood. They are not AI gatekeepers that reject you for a missing keyword — they are databases that parse your file into fields so a recruiter can search them. Most \"ATS optimisation\" advice is folklore. A few things genuinely matter.",
    takeaways: [
      "An applicant tracking system is a database with a workflow attached, not an AI judge.",
      "Nothing gets auto-rejected. What happens is a bad parse, a low rank, and a resume nobody opens.",
      "Two things genuinely break parsing: multiple columns, and text that is an image rather than text.",
      "Fonts, colour, margins and file name have no effect on the parse at all.",
      "Send a PDF unless the posting asks otherwise, and check it by copying the text out.",
    ],
    sections: [
      {
        heading: "What an ATS actually does",
        body: [
          "It takes your file, extracts the text, and tries to work out which part is your name, which is an employer, which is a date range. Recruiters then search that database. If parsing fails, your record is incomplete or garbled — that is the real failure mode, not a rejection algorithm.",
          "This reframes the whole problem. You are not trying to beat a filter. You are trying to be machine-readable.",
        ],
      },
      {
        heading: "What breaks parsing",
        body: [
          "Layout, almost always. Anything that makes the text hard to read in a straight line is a risk.",
        ],
        list: [
          "Contact details inside a header or footer, which some parsers never read",
          "Text inside images, including a name rendered as a logo",
          "Multi-column layouts, which can interleave into nonsense",
          "Tables used for layout rather than data",
          "Unusual section names — \"Where I've Been\" instead of \"Experience\"",
          "Dates written inconsistently between entries",
        ],
      },
      {
        heading: "What doesn't matter as much as people claim",
        body: [
          "Keyword density is the big one. Stuffing a skills section with every term from the posting does not raise a score, because there usually is no score — and a human reads the page immediately afterwards.",
          "Fonts, colour, and a tasteful accent are fine. So is a sidebar, provided the underlying text order still makes sense when read linearly. The test is not \"does it look plain\" but \"does the text extract cleanly\".",
        ],
      },
      {
        heading: "Do use the words in the posting",
        body: [
          "Not as stuffing — as accuracy. If the posting says \"incident response\" and you wrote \"on-call\", a recruiter searching the database for the former will not find you. Use the vocabulary of the industry you're applying into, where it honestly describes what you did.",
          "The honest constraint matters. A term on your resume is a term you can be asked about.",
        ],
      },
      {
        heading: "Send a PDF unless told otherwise",
        body: [
          "Modern systems parse PDFs fine, and a PDF is the only way to guarantee the recruiter sees the layout you designed. Send .docx only when the application explicitly asks for it.",
          "One caveat: the PDF has to contain real text. A scan or an exported image looks identical on screen and extracts as nothing at all.",
        ],
      },
      {
        heading: "What an applicant tracking system is, plainly",
        body: [
          "It is a database with a workflow attached. When you apply, the system stores your file, extracts text from it, tries to split that text into structured records — your name, contact details, and a title/employer/date triple for each job — and files you against the requisition. Recruiters then search, filter and move candidates through stages inside it.",
          "Workday, Greenhouse, Lever, iCIMS, Taleo, SuccessFactors and Ashby are the ones you will meet most often. They differ in quality, and the older enterprise systems are meaningfully worse at parsing than the newer ones, which is most of why advice about them is inconsistent — people are describing different software.",
          "The important part is what it is not. It is not an AI judging your worth, and it does not reject applications on a score. It is filing software. The damage it does is passive: a bad parse produces an incomplete record, an incomplete record ranks badly against the requisition, and a badly-ranked application is never opened by the person who would have liked it.",
        ],
      },
      {
        heading: "Resume checkers and scores",
        body: [
          "Tools that give your resume a score out of a hundred are checking a list of mechanical properties: is the text real, is the layout single-column, are the section headings recognisable, do the posting's terms appear, is there a date on every role. All of that is genuinely worth knowing, and it is roughly the same list as this page.",
          "What the score is not is a prediction. No checker has access to the employer's actual system, the requisition's weighting or the recruiter's judgement, so a number attached to your resume is a formatting checklist expressed as a percentage. Treat a low score as a prompt to find the specific problem, and ignore the number itself.",
          "Be sceptical of any checker whose result is a paid rewrite. The failure modes it reports are all things you can fix in ten minutes once you know what they are, and the copy-paste test on your exported PDF finds the serious ones for nothing. The review here reports what is structurally weak — missing outcomes, buried terms, sections in an order that works against you — rather than issuing a grade.",
        ],
      },
    ],
    compare: {
      heading: "ATS folklore against what actually happens",
      columns: ["Claim", "The folklore", "What is true"],
      rows: [
        [
          "Rejection",
          "The system scores you and auto-rejects below a threshold",
          "It builds a record and ranks it. A bad record ranks low and is never opened — no rejection is issued",
        ],
        [
          "Fonts",
          "Certain typefaces confuse the parser",
          "Parsers extract characters. Garamond and Arial produce an identical stream",
        ],
        [
          "Columns",
          "Two columns are always fatal",
          "They are the one real layout risk — text can extract across both — but many modern systems handle them. Check yours",
        ],
        [
          "Keywords",
          "More keywords means a higher score",
          "Only terms from the posting count, and only where they are true. Repetition is not weighted the way folklore assumes",
        ],
        [
          "File type",
          "PDFs cannot be read",
          "Modern systems read PDFs fine. What cannot be read is a PDF containing an image of text",
        ],
        [
          "White text",
          "Hidden keywords give you an edge",
          "Stripped by every modern parser, and read as deception when found. The cost is a discarded application",
        ],
      ],
    },
    checklist: {
      heading: "The ten-second parse check",
      items: [
        "Open the exported PDF, select all, and paste it into a plain text file",
        "Your name and contact details appear as text at the top",
        "Every job has its title, employer and dates intact and in order",
        "Nothing from a sidebar has landed inside a job description",
        "Section headings are the standard ones — Experience, Education, Skills",
        "No text lives inside an image, logo or designed header block",
        "The posting's own words for your real skills appear somewhere on the page",
        "Dates are in a consistent format with a month and a year",
      ],
    },
    templates: {
      heading: "Templates that parse cleanly",
      blurb:
        "Single column, real-text export, no dark pages and no sidebars to interleave. This is the cut of the gallery that removes both of the failure modes above — the rest is writing, not layout.",
      category: "ats",
      count: 9,
    },
    faqs: [
      {
        question: "What is an applicant tracking system?",
        answer:
          "A database with a hiring workflow attached. It stores your application, extracts the text, tries to build structured records from it — name, contact details, and a title, employer and date for each role — and files you against the job. Recruiters search and filter inside it. It is filing software, not a judge.",
      },
      {
        question: "Are AI resume checkers accurate?",
        answer:
          "They accurately report mechanical properties: whether your text is real, whether the layout is single-column, whether headings are recognisable, whether the posting's terms appear. They cannot predict an outcome, because they have no access to the employer's system or the recruiter's judgement. Use the findings, ignore the score, and be wary of any checker whose recommendation is a paid rewrite.",
      },
      {
        question: "Do ATS systems reject resumes automatically?",
        answer:
          "Rarely. Most are search-and-filter tools operated by a recruiter. Automatic knockouts exist for hard requirements like work authorisation, not for phrasing.",
      },
      {
        question: "Is a two-column resume ATS-safe?",
        answer:
          "Usually yes with modern parsers, but it's the single most common cause of scrambled extraction. If you use one, check that copying the text out of your PDF still reads in a sensible order.",
      },
      {
        question: "Should I put keywords in white text?",
        answer:
          "No. It's detectable, it's read as deception, and it will get your application discarded outright.",
      },
    ],
    related: ["ats-resume-keywords", "ats-resume-checklist", "resume-format"],
  },

  {
    slug: "ats-resume-keywords",
    title: "Finding the keywords that actually matter",
    metaTitle: "ATS Resume Keywords — How to Find and Use Them | meniacv",
    description:
      "How to pull the real keywords out of a job posting, where to put them so they count, and why stuffing a skills section does nothing.",
    eyebrow: "ATS",
    updated: "2026-07-29",
    intro:
      "Keyword advice is where ATS folklore does the most damage. The instruction people hear is \"add more keywords\", so they append forty terms to a skills section and wonder why nothing changes. Matching vocabulary does matter — but only certain words, and only in certain places.",
    takeaways: [
      "Only nouns are keywords: tools, systems, certifications, methods, job titles. Adjectives are not.",
      "Take them from the posting in front of you, not from a list of top keywords on the internet.",
      "A keyword counts in your experience bullets and your skills section, and is wasted anywhere else.",
      "Use the posting's exact form first, then the variant — \"React\" and \"React.js\" are two strings to a matcher.",
      "Tailoring is mostly reordering and cutting. Swapping words is the smallest part of it.",
    ],
    sections: [
      {
        heading: "Only some words are keywords",
        body: [
          "A recruiter searching a database searches for things a candidate either has or hasn't: a tool, a platform, a certification, a methodology, a job title, a language, a licence. Those are keywords. \"Detail-oriented\", \"team player\" and \"results-driven\" are not searched for by anyone, ever.",
          "So read a posting looking specifically for nouns. Named technologies, named frameworks, named qualifications, named systems. Everything else in the posting is context for how to write, not vocabulary to match.",
        ],
        list: [
          "Tools and platforms — Salesforce, Kubernetes, NetSuite, Epic",
          "Methodologies — Agile, Lean, MEDDICC, BPMN",
          "Certifications and licences — PMP, CPA, RN, Security+",
          "Domain terms — incident response, revenue recognition, TUPE",
          "Job titles, including the ones you'd call something else",
        ],
      },
      {
        heading: "Read the posting twice, for two different things",
        body: [
          "The first read is for the requirements list, which is where the hard filters live — years of experience, a specific certification, a named system. If you match those, the words should appear on your page in the posting's own form.",
          "The second read is for repetition. Whatever a posting says three times is what the role is actually about, regardless of what the requirements section claims. If \"stakeholder management\" appears in the summary, the responsibilities and the requirements, that's the job, and your resume should answer it in the top third rather than in a skills list at the bottom.",
        ],
      },
      {
        heading: "Where a keyword counts, and where it's wasted",
        body: [
          "A term in a skills section proves nothing except that you know the word. The same term inside a bullet, attached to something you did with it, is evidence. Both get parsed; only one survives the human read that follows.",
          "So the pattern that works is both: the term in your skills block so it's findable, and the term in a bullet so it's credible. \"Kubernetes\" in a list, and \"migrated 14 services to EKS with no unplanned downtime\" in the experience section. One matches the search, the other answers the interview question the search leads to.",
        ],
      },
      {
        heading: "Match the posting's exact form, then the variant",
        body: [
          "Recruiters search for strings, and strings don't reason. If the posting says \"Search Engine Optimisation\" and you wrote \"SEO\", a literal search may miss you. Write the acronym with its expansion once — \"SEO (search engine optimisation)\" — and both forms are on the page without repetition.",
          "The same applies to titles. If your internal title was \"Growth Ninja\" and the market calls it \"Performance Marketing Manager\", put the recognisable title on the page. Nobody searches for a job title that only exists inside one company.",
        ],
      },
      {
        heading: "The honesty constraint is the whole limit",
        body: [
          "Every keyword on your resume is a question you've agreed to answer. That's the real ceiling on this technique, and it's why stuffing fails even when it works: you get the interview and then spend it being found out on a tool you used once.",
          "The test is simple. For each term, could you talk for two minutes about something you did with it? If not, take it off. A resume with eight defensible keywords beats one with forty that collapse under a follow-up question.",
        ],
      },
      {
        heading: "What not to do",
        body: [
          "White text, hidden layers, keyword blocks behind images, and pasted chunks of the job description are all detectable, and all read as deception rather than as optimisation. The cost when found is not a lower ranking — it's a discarded application.",
          "Repeating the same term eight times doesn't help either. Most systems don't weight frequency the way the folklore assumes, and the human reading afterwards notices immediately.",
        ],
      },
      {
        heading: "Customising the whole resume, not just the words",
        body: [
          "Keyword matching is the smallest part of tailoring a resume to a job description, and treating it as the whole job is why so many \"customised\" resumes still read as generic. The terms get swapped, and the document underneath still argues for a different role.",
          "The larger moves are structural, and they take about fifteen minutes. Reorder your bullets within each job so the ones matching the posting's emphasis come first — a reader gives the top bullet of each role several times the attention of the fourth. Rewrite the summary to name the specific role. Promote or demote whole sections: a posting that leads on stakeholder management should not reach your management evidence on page two.",
          "Then cut. Every bullet that is irrelevant to this posting is competing for attention with the ones that are, and removing three of them does more than adding three keywords.",
        ],
        list: [
          "Rewrite the summary to name the role and the specific evidence that fits it",
          "Reorder bullets within each job so the relevant ones are first",
          "Promote the section the posting leads with — skills, projects, certifications",
          "Cut bullets that are irrelevant to this posting, even if they are good",
          "Adopt the posting's vocabulary for things you genuinely do",
          "Keep a master document with everything, and cut versions from it rather than editing one file forever",
        ],
      },
      {
        heading: "How much to tailor, realistically",
        body: [
          "Not every application deserves the full pass, and pretending otherwise is how people stop applying. A workable split: a master resume, two or three variants for the distinct kinds of role you are pursuing, and a fifteen-minute pass on the applications you actually care about.",
          "The variants do most of the work. If you are applying to both platform engineering and developer tooling roles, those are two documents with different emphasis, and having them already built means the per-application pass is genuinely fifteen minutes rather than an evening.",
          "Where tailoring pays most is the top third of the page — the summary and the first two bullets of your most recent role. That is what gets read on the first pass, and it is where a document written for this posting becomes visible.",
        ],
      },
    ],
    checklist: {
      heading: "The fifteen-minute tailoring pass",
      items: [
        "List every tool, system and named competency the posting mentions",
        "Cross off the ones you cannot honestly claim — what is left is your skills section",
        "Rewrite the summary to name this role specifically",
        "Reorder bullets within each job so the relevant ones come first",
        "Promote whichever section the posting leads with",
        "Cut bullets irrelevant to this posting, even the ones you like",
        "Use the posting's exact wording for skills you genuinely have",
        "Check nothing was added that you could not defend in an interview",
      ],
    },
    templates: {
      heading: "Layouts that keep your keywords findable",
      blurb:
        "A matched term only counts if it survives extraction. These are the single-column templates where a skills block stays a skills block instead of interleaving into a job description.",
      category: "ats",
    },
    faqs: [
      {
        question: "How do I customise my resume to a job description?",
        answer:
          "Swapping keywords is the smallest part. Rewrite the summary to name the role, reorder the bullets within each job so the ones matching the posting's emphasis come first, promote whichever section the posting leads with, and cut bullets that are irrelevant to this application. The vocabulary pass comes last.",
      },
      {
        question: "Should I tailor my resume for every application?",
        answer:
          "Not fully, or you will stop applying. Keep a master document and two or three variants for the distinct kinds of role you are pursuing, then spend fifteen minutes per application you genuinely care about — concentrated on the summary and the first two bullets of your most recent role, which is what gets read first.",
      },
      {
        question: "How many keywords should a resume have?",
        answer:
          "There's no target number. Match the requirements you genuinely meet, use the posting's wording for those, and stop. A resume that reads naturally with ten accurate terms outperforms one carrying forty, because the second one has spent the space it needed for results.",
      },
      {
        question: "Should I copy phrases from the job description?",
        answer:
          "Copy the vocabulary — tool names, methodologies, titles. Don't copy whole responsibility sentences into your experience section. A recruiter who has read the posting a hundred times recognises its own phrasing instantly, and it reads as mimicry rather than as a match.",
      },
      {
        question: "Do keywords in a skills section count?",
        answer:
          "For the parse, yes. For the human, barely. Put the term in your skills block so it's findable and in a bullet so it's believable; the combination is what converts a match into an interview.",
      },
      {
        question: "What if I don't have the keywords the posting asks for?",
        answer:
          "Don't invent them. Name the nearest thing you have honestly — an adjacent tool, a transferable method — and put your effort into the requirements you do meet. Applications where you match most of the list and are clearly strong beat applications where you claimed everything and can defend little.",
      },
    ],
    related: ["ats-friendly-resume", "ats-resume-checklist", "resume-bullet-points"],
  },

  {
    slug: "ats-resume-checklist",
    title: "The checklist to run before you submit",
    metaTitle: "ATS Resume Checklist — Check Before You Apply | meniacv",
    description:
      "A concrete pre-submit checklist: how to test that your resume parses, what to verify on the page, and the five-minute tailoring pass worth doing every time.",
    eyebrow: "ATS",
    updated: "2026-07-29",
    intro:
      "Everything else about ATS advice is theory. This is the part you actually run, on the file you're about to attach, in about ten minutes. It catches the failures that silently cost people interviews — an unreadable PDF, a missing phone number, a resume tailored to the last job you applied for.",
    takeaways: [
      "Run this on the file you are about to attach, not on the document you have been editing.",
      "The copy-paste test finds every serious parsing failure in about ten seconds.",
      "Most silent failures are mundane: a missing phone number, a file tailored to the last job you applied for.",
      "Read it out loud once. Your ear catches what your eye has stopped seeing.",
      "Ten minutes here is worth more than any amount of keyword theory.",
    ],
    sections: [
      {
        heading: "First, test the parse yourself",
        body: [
          "Open your exported PDF, select all the text, and paste it into a plain text editor. What survives is approximately what a parser extracts, and this single test catches most structural problems in thirty seconds.",
          "You're checking four things, and any failure here matters more than anything else on this page — because content a parser can't read is content that doesn't exist.",
        ],
        list: [
          "Nothing is missing entirely — anything absent is trapped inside an image",
          "The order is sensible, with no skills interleaved into a job description",
          "Every job has its title, employer and dates together and intact",
          "Your name, email and phone are in the text, not in a document header",
        ],
      },
      {
        heading: "Then check the page as a document",
        body: [
          "These are the failures that survive parsing but lose the human read. Work down the list on the rendered page, not on the text you just extracted.",
        ],
        list: [
          "Standard section headings: Experience, Education, Skills",
          "One column for the content that carries your history",
          "Dates formatted identically in every entry, with no gaps left unexplained",
          "A file name that identifies you — \"jane-okoro-resume.pdf\", not \"resume-final-v3.pdf\"",
          "Contact details correct, and an email address you actually check",
          "Links that resolve, and aren't pointing at a private repository",
          "One page unless you've genuinely outgrown it, two at most",
        ],
      },
      {
        heading: "The five-minute tailoring pass",
        body: [
          "This is the highest-return work available per minute spent, and most applicants skip it. You are not rewriting the resume — you are reordering it so the first things a reader meets are the things this posting asks for.",
          "Read the posting, then make three changes: adjust the summary's first sentence to name the role and its central requirement, reorder your skills so the posting's priorities come first, and promote the two bullets in your recent roles that most directly answer it.",
        ],
        list: [
          "Summary names the role you're applying for",
          "Skills reordered to match the posting's emphasis",
          "The two most relevant bullets moved to the top of their roles",
          "The posting's own words used for tools and titles you genuinely have",
          "Anything irrelevant to this application cut or demoted",
        ],
      },
      {
        heading: "The last read, out loud",
        body: [
          "Read the whole page aloud before attaching it. It's slow, it feels silly, and it catches things silent reading never does: a tense that shifts halfway through a bullet, a sentence that needs two attempts, a word you'd never say in an interview.",
          "That last one is the important one. Every line on the page is something you've agreed to discuss in your own voice, and anything that sounds unlike you when spoken will sound worse when a stranger asks you about it.",
        ],
      },
      {
        heading: "Common failures this catches",
        body: [
          "The pattern in almost every one of these is the same: the resume was fine, and the file wasn't. A layout that looked good and extracted as nonsense, a phone number in a header nobody parsed, a version tailored to a different company still naming that company in the summary.",
          "None of these are writing problems, which is why they survive so many drafts. They're the last ten minutes of work, and they're the ten minutes most applications don't get.",
        ],
        list: [
          "A scanned or image-based PDF that extracts as nothing at all",
          "Contact details in a header, making a good application unreachable",
          "A summary still naming the previous company you applied to",
          "A two-column layout interleaving skills into your job history",
          "A portfolio or GitHub link that 404s or requires access",
        ],
      },
    ],
    checklist: {
      heading: "Run this on the file you are about to send",
      items: [
        "Selectable text in the exported PDF, not an image",
        "Name, email, phone and city present and correct",
        "Every role has title, employer, location and dates",
        "Dates in one consistent format, with months where the gap matters",
        "Standard section headings a parser recognises",
        "Nothing from a sidebar interleaved into a job description",
        "The file is named with your own name, not \"resume.pdf\"",
        "It is tailored to this posting, not to the last one you applied to",
        "No typos in your own name, job titles or employer names",
        "It reads correctly out loud, start to finish",
      ],
    },
    templates: {
      heading: "Templates that pass this checklist by default",
      blurb:
        "Every item above about layout is already true of these — single column, real text, standard headings, no image-borne text. The rest of the list is about your content, which no template can do for you.",
      category: "ats",
    },
    faqs: [
      {
        question: "How do I know if my resume is ATS-readable?",
        answer:
          "Copy all the text out of your PDF and paste it into a plain text file. If everything is present, in a sensible order, with job titles and dates intact, it parses. That test is free and more reliable than most scoring tools, because it shows you the actual extraction rather than a guess about it.",
      },
      {
        question: "Does the file name matter?",
        answer:
          "Not to the parser, but it matters to the person who downloads forty of them. \"jane-okoro-resume.pdf\" is findable in a folder; \"resume-final-v3.pdf\" is one of a dozen identical files and reads as careless.",
      },
      {
        question: "Should I really tailor for every application?",
        answer:
          "For every application you actually care about, yes — and it's fifteen minutes, not an hour, because you're reordering rather than rewriting. If you're applying to fifty roles, tailor the ten that matter and send the master version to the rest.",
      },
      {
        question: "Is it worth checking my resume more than once?",
        answer:
          "Check the parse once per export, since that's when it can break, and run the tailoring pass once per application. The full review is worth repeating after any substantial edit — the useful rhythm is review, fix the top two things, review again.",
      },
    ],
    related: ["ats-friendly-resume", "ats-resume-keywords", "resume-mistakes"],
  },

  {
    slug: "resume-summary-examples",
    title: "Resume summary examples that aren't filler",
    metaTitle: "Resume Summary Examples & How to Write One | meniacv",
    description:
      "What a professional summary is for, a formula that works, and worked examples across engineering, design, marketing and career changes.",
    eyebrow: "Writing",
    updated: "2026-07-25",
    intro:
      "The summary is the most-skipped and most-wasted part of a resume. Skipped because it's hard; wasted because it usually contains no information. Two or three sentences at the top of the page is prime space — it should say something only you could say.",
    takeaways: [
      "Three sentences: what you are and at what level, your strongest evidence, and what you are aiming at.",
      "It is written last, from what is already on the page — never first.",
      "If it would only restate your job title, delete it and use the space for a bullet.",
      "\"Summary\", \"Professional Summary\" and \"Profile\" are interchangeable. Pick for the reader.",
      "Every clause should be specific enough that someone could ask a follow-up question about it.",
    ],
    sections: [
      {
        heading: "What it's for",
        body: [
          "The summary answers the question a reader forms in the first second: what is this person, and why am I looking at them for this role? It is orientation, not persuasion. Get that right and the rest of the page is read in the correct frame.",
          "It is not an objective statement. Nobody needs to be told you are seeking a challenging position with a forward-thinking company.",
        ],
      },
      {
        heading: "A formula that holds up",
        body: [
          "Sentence one: what you are and for how long, with the domain. Sentence two: the ground you cover, or your strongest evidence. Optional sentence three: what you are pointed at now.",
          "Every clause should be checkable against the rest of the resume. If the summary claims something the experience doesn't demonstrate, you have written a cover letter by accident.",
        ],
      },
      {
        heading: "Worked examples",
        body: [
          "Software engineer: \"Backend engineer with nine years on payments and identity systems in regulated fintech. Owned a ledger handling 2M transactions a month and cut authorisation latency from 800ms to under 200ms. Now looking for staff-level work on high-throughput infrastructure.\"",
          "Product designer: \"Product designer working on complex B2B tools — the kind with permission models and audit trails. Led the design system that took the company's four inconsistent products onto one component library. Strongest where research and interface work meet.\"",
          "Career changer: \"Secondary school teacher moving into instructional design, with a postgraduate certificate completed alongside four years of classroom work. Built the department's curriculum materials for 200 students and trained six colleagues on delivering them.\"",
        ],
      },
      {
        heading: "What to cut",
        body: [
          "Adjectives about yourself. \"Detail-oriented\", \"passionate\", \"hard-working\" and \"results-driven\" are claims nobody can verify and everybody makes, so they read as noise.",
          "Also cut the first person. \"I am a backend engineer\" wastes two words; resumes are written in an implied first person and every reader understands it.",
        ],
      },
      {
        heading: "What to call the section",
        body: [
          "Summary, Professional Summary, Profile and Professional Profile are interchangeable and none of them is wrong. Pick one, and pick it for the reader rather than for the parser — applicant tracking systems key on the experience, education and skills headings, and treat whatever sits above them as introductory text regardless of its label.",
          "\"Professional Summary\" is the safest choice in conservative fields, because it is the phrasing those readers expect. \"Summary\" is shorter and reads as more confident. \"Profile\" is common in the UK and Europe and slightly unusual in the US.",
          "What not to use: \"About Me\", which belongs on a personal website; \"Career Objective\", which announces you are about to write about what you want; and no heading at all, which leaves a floating paragraph that a reader has to classify before they can use it. One word of heading buys you the reader's orientation.",
        ],
      },
      {
        heading: "The professional summary at each stage",
        body: [
          "The three sentences do different work depending on where you are, and copying a senior template as a graduate is a common way to produce something that reads as inflated.",
          "Early career: what you are studying or have just finished, the one or two things you have actually done, and the role you are aiming at. Direction is the information, because the chronology has not yet supplied it.",
          "Mid-career: your discipline and years, your strongest piece of evidence, and the specialism or scale you want the reader to register. This is the version where naming a number — team size, revenue, users, volume — does the most work.",
          "Senior and executive: scope first, in the first clause. Revenue owned, headcount, geography, functions. A senior summary that opens with a philosophy of leadership rather than a size has spent the most valuable four lines on the page saying nothing checkable.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Mid-career",
        before:
          "Experienced professional with a proven track record of delivering results in fast-paced environments",
        after:
          "Backend engineer, eight years, currently on the payments team at a company processing about $400M a year. Spent the last two rebuilding settlement so it reconciles automatically. Looking for a staff role where the work is systems rather than features.",
      },
      {
        label: "Clinical",
        before:
          "Compassionate and dedicated nursing professional committed to delivering high-quality patient care",
        after:
          "Registered nurse with six years in acute medical-surgical care, currently on a 32-bed unit at a Level II trauma centre. Charge nurse two shifts a week and Epic superuser. Looking for a permanent day-shift role in an urban teaching hospital.",
      },
      {
        label: "Early career",
        before:
          "Recent graduate seeking a challenging position that will allow me to grow and develop my skills",
        after:
          "Final-year economics student graduating July 2027, dissertation on regional pricing dispersion, two years of weekend retail work alongside the degree. Looking for a graduate analyst role where the work is closer to data than to slides.",
      },
    ],
    checklist: {
      heading: "Does your summary earn its space?",
      items: [
        "Cover it with your hand — if nothing was lost, delete it",
        "It names a level and a number of years, not just a job title",
        "It carries one specific piece of evidence, not a list of adjectives",
        "It says what you are aiming at, where that is not obvious",
        "No \"detail-oriented\", \"passionate\", \"hard-working\" or \"results-driven\"",
        "No first person — resumes are written in an implied first person",
        "Three sentences, readable in about eight seconds",
        "Every claim in it is repeated as evidence further down the page",
      ],
    },
    templates: {
      heading: "Templates with room for a summary",
      blurb:
        "A summary needs three or four lines at the top of the page without crowding what follows. These layouts give it that, and keep the heading plain enough that a parser files it as introductory text rather than as experience.",
      category: "simple",
    },
    faqs: [
      {
        question: "What is a professional summary on a resume?",
        answer:
          "The three-sentence block at the top of the page saying what you are, what your strongest relevant evidence is, and what you are aiming at. \"Professional summary\", \"summary\" and \"profile\" are interchangeable labels for the same thing — the phrasing is a matter of register, not of function.",
      },
      {
        question: "What should I title my summary section?",
        answer:
          "\"Professional Summary\" in conservative fields, \"Summary\" everywhere else, \"Profile\" if you are writing for the UK or Europe. Applicant tracking systems key on your experience, education and skills headings and treat this block as introductory text whatever you call it, so choose for the human reader. Avoid \"About Me\" and \"Career Objective\".",
      },
      {
        question: "Summary or objective?",
        answer:
          "A summary, in almost every case. Objectives describe what you want; summaries describe what you offer, and only one of those is useful to the person reading.",
      },
      {
        question: "How long should a summary be?",
        answer:
          "Two or three sentences, forty to sixty words. Longer and it stops being scannable, which defeats the purpose.",
      },
      {
        question: "Do I need one at all?",
        answer:
          "It's optional but valuable when your history doesn't speak for itself — a career change, a specialism that isn't obvious from job titles, or a gap that context explains.",
      },
    ],
    related: ["how-to-write-a-resume", "career-change-resume", "ai-resume-builder"],
  },

  {
    slug: "resume-bullet-points",
    title: "Writing resume bullet points that land",
    metaTitle: "Resume Bullet Points — Action Verbs, Metrics, Examples | meniacv",
    description:
      "How to turn a list of responsibilities into evidence: the verb-scope-outcome pattern, finding numbers you didn't think you had, and before-and-after rewrites.",
    eyebrow: "Writing",
    updated: "2026-07-25",
    intro:
      "Bullet points are where a resume is won or lost. Most people write responsibilities — a description of the job as it appeared in the contract. Strong resumes write evidence: what changed because you were there.",
    takeaways: [
      "Write evidence, not responsibilities. What changed because you were there?",
      "The pattern: a verb, what you did with specifics, and the outcome or the scale.",
      "Three to five bullets on recent roles, one or two on older ones.",
      "Numbers exist in almost every job — volume, frequency, duration, people, money, time saved.",
      "Where no number exists, name the consequence: what became possible, or what stopped happening.",
    ],
    sections: [
      {
        heading: "Responsibilities vs. evidence",
        body: [
          "\"Responsible for the company's social media channels\" tells a reader your job title, which they already know. \"Grew the company's LinkedIn following from 2,000 to 30,000 in eighteen months, driving a third of inbound demo requests\" tells them what you can do.",
          "The difference is not seniority or luck. It is that the second sentence names an outcome and attaches a number to it.",
        ],
      },
      {
        heading: "The pattern",
        body: [
          "Verb, then scope, then outcome. \"Rebuilt the onboarding flow for 40,000 monthly signups, cutting drop-off by a third.\" Not every bullet has all three, but a bullet with none of them is doing no work.",
          "Open with a strong past-tense verb — Led, Rebuilt, Cut, Shipped, Negotiated, Migrated, Automated. Avoid the weak openers: Responsible for, Helped with, Worked on, Assisted in.",
        ],
      },
      {
        heading: "Finding numbers you think you don't have",
        body: [
          "Almost every role has quantities in it; most people just never wrote them down. Scale, frequency, time, money, and people are the five places to look.",
        ],
        list: [
          "How many users, customers, tickets, or requests did it touch?",
          "How often — daily, per release, per quarter?",
          "How much time did it save, and for how many people?",
          "What did it cost or earn, even approximately?",
          "How many people did you lead, train, or coordinate?",
        ],
      },
      {
        heading: "When you genuinely have no number",
        body: [
          "Describe the change instead of inventing a metric. \"Replaced a manual weekly reconciliation with an automated job, removing a recurring source of month-end errors\" has no number and still shows judgement and outcome.",
          "Never estimate upward to fill the gap. An invented figure is the easiest thing in the world to fall apart on when someone asks how it was measured.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Engineering",
        before: "Worked on improving site performance",
        after:
          "Cut largest-contentful-paint from 4.1s to 1.2s across the marketing site, lifting mobile conversion 12%",
      },
      {
        label: "Operations",
        before: "Helped with the migration to the new CRM",
        after:
          "Migrated 60,000 customer records to HubSpot with no reported data loss, and trained the 12-person sales team on the new workflow",
      },
      {
        label: "Management",
        before: "Responsible for managing a team",
        after:
          "Took over a team of six mid-project after the lead left, and shipped on the original date",
        note:
          "No number was available for the outcome, so the bullet names the consequence instead. That is the fallback when nothing was measured.",
      },
      {
        label: "Administrative",
        before: "Managed executive calendars and travel",
        after:
          "Managed four executive calendars averaging 35–45 meetings a week, and booked about 120 trips a year against a $480k travel budget",
      },
    ],
    checklist: {
      heading: "Run this over every bullet",
      items: [
        "It starts with a verb, not with \"responsible for\" or \"duties included\"",
        "It says what you specifically did, not what the team did",
        "It ends in a result, a scale, or a consequence",
        "It carries a number where one honestly exists",
        "It is under about thirty words and fits on two lines",
        "It is past tense for past roles, present for the current one",
        "You could answer \"can you give me an example?\" in five seconds",
        "It is not the same verb as the two bullets above it",
      ],
    },
    templates: {
      heading: "Templates that give bullets room",
      blurb:
        "A strong bullet runs to two lines. Templates that squeeze the body text to fit more on the page turn good writing into a wall — these keep the line height and margins where they should be.",
      category: "simple",
    },
    faqs: [
      {
        question: "How many bullets per job?",
        answer:
          "Three to five for recent and relevant roles, one or two for older ones. Depth belongs where the reader is paying most attention.",
      },
      {
        question: "Should bullets be full sentences?",
        answer:
          "They're fragments by convention — no leading pronoun, no full stop needed. Keep them under about thirty words so they stay scannable.",
      },
      {
        question: "Past or present tense?",
        answer:
          "Past tense for previous roles. Either works for your current one, as long as you're consistent within the entry.",
      },
    ],
    related: ["how-to-write-a-resume", "ai-resume-builder", "resume-mistakes"],
  },

  {
    slug: "resume-format",
    title: "Choosing a resume format",
    metaTitle: "Resume Format — Chronological, Functional or Hybrid | meniacv",
    description:
      "The three standard resume formats, which one suits your situation, and the layout decisions that follow — length, order, dates and section naming.",
    eyebrow: "Formatting",
    updated: "2026-07-25",
    intro:
      "Format is a smaller decision than the internet suggests, but the wrong one makes an otherwise good resume hard to read. There are three, and for most people the answer is the first.",
    takeaways: [
      "Reverse-chronological for nine people out of ten. It is what readers and parsers both expect.",
      "Functional — skills first, history hidden — is what recruiters read as concealment. Avoid it.",
      "The hybrid is the honest version of what people want from functional: a skills block above an intact timeline.",
      "Format is an ordering decision, not a design one. Any template renders any of them.",
      "Whatever you choose, keep a labelled employment history with titles, employers and dates.",
    ],
    sections: [
      {
        heading: "Reverse chronological",
        body: [
          "Most recent role first, working backwards. This is the default, it is what recruiters expect, and it parses cleanly. Use it unless you have a specific reason not to.",
          "Its strength is that it answers the reader's first question — what are you doing now — immediately. Its weakness is that it makes gaps and short tenures visible, which is not a reason to avoid it so much as something to be ready to explain.",
        ],
      },
      {
        heading: "Functional",
        body: [
          "Organised by skill rather than by job, with employment history reduced to a list at the bottom. It is widely disliked by recruiters, precisely because it obscures the timeline — which means it reads as an attempt to hide something even when it isn't.",
          "There is one situation where it genuinely helps: a portfolio career of short unrelated contracts where a chronological list would be noise. Even then, expect scepticism.",
        ],
      },
      {
        heading: "Hybrid",
        body: [
          "A short skills or highlights block at the top, then a normal reverse-chronological history underneath. This is the honest version of what the functional format tries to do, and it works well for career changes and for specialists whose job titles don't describe their work.",
          "Keep the top block short — four or five lines. It is a lens for reading the history, not a replacement for it.",
        ],
      },
      {
        heading: "Decisions that follow",
        body: [
          "Length: one page under ten years, two beyond. Dates: month and year, consistently, right-aligned so the eye can scan them as a column. Section order: whatever supports the argument, with experience above education once you have a career behind you.",
          "Name sections what they are called. \"Experience\", \"Education\", \"Skills\". Creativity in section naming costs you searchability and gains you nothing.",
        ],
      },
    ],
    compare: {
      heading: "The three formats, side by side",
      columns: ["", "Reverse-chronological", "Hybrid"],
      rows: [
        [
          "How it is ordered",
          "Roles newest first, each with bullets",
          "A short skills block, then roles newest first",
        ],
        [
          "Who it suits",
          "Almost everyone with a continuous career in one field",
          "Career changers, contractors, and anyone whose recent titles mislead",
        ],
        [
          "What a recruiter thinks",
          "Nothing — it is the expected shape, so it is invisible",
          "Nothing, provided the timeline underneath is intact",
        ],
        [
          "Parsing",
          "The safest possible structure",
          "Equally safe. The skills block is read as introductory text",
        ],
        [
          "Where it fails",
          "When your recent history argues against the job you want",
          "When the skills block grows until the timeline is an afterthought",
        ],
      ],
    },
    checklist: {
      heading: "Whichever format you picked",
      items: [
        "There is a clearly-labelled employment section with title, employer and dates",
        "Most recent role first, and it carries the most detail",
        "Section headings are the standard ones a parser recognises",
        "Education is above experience only if you are a student or recent graduate",
        "Dates are consistent, and gaps longer than a few months are accounted for",
        "Nothing is ordered by anything other than relevance or recency",
        "A stranger can reconstruct your career from the page in ten seconds",
      ],
    },
    templates: {
      heading: "Templates for a chronological resume",
      blurb:
        "The format is the ordering; the template is how it reads. These are the classic layouts that suit it best — dates in a consistent position, titles set above employers, and clear separation between roles.",
      category: "classic",
    },
    faqs: [
      {
        question: "Should I list months or just years?",
        answer:
          "Months and years. Years alone reads as concealing short tenures, and recruiters generally notice.",
      },
      {
        question: "How do I handle an employment gap?",
        answer:
          "Leave it visible and be ready to explain it in one sentence. Gaps are common and unremarkable; the attempt to disguise one is what draws attention.",
      },
      {
        question: "Can I use a two-column layout?",
        answer:
          "Yes, if the text still extracts in a sensible order. Copy the text out of your exported PDF and read it — if it interleaves the columns, use a single column instead.",
      },
    ],
    related: ["ats-friendly-resume", "ats-resume-checklist", "how-to-write-a-resume"],
  },

  {
    slug: "resume-mistakes",
    title: "Resume mistakes worth fixing first",
    metaTitle: "Common Resume Mistakes and How to Fix Them | meniacv",
    description:
      "The errors that actually cost interviews, ordered by how much damage they do — and what to do about each one.",
    eyebrow: "Review",
    updated: "2026-07-25",
    intro:
      "Not all resume mistakes are equal. A typo is embarrassing; a page of unquantified responsibilities is the reason you didn't get called. Here they are roughly in order of what they cost you.",
    takeaways: [
      "Describing duties instead of results is the mistake that costs the most, and the most common.",
      "Burying your best achievement below three routine bullets wastes the only pass most resumes get.",
      "One resume sent to every posting reads as one written for none of them.",
      "Filler — adjectives, references lines, objective statements — pushes real content off the page.",
      "Typos matter least of the serious mistakes, and are still worth ten minutes.",
    ],
    sections: [
      {
        heading: "Describing duties instead of results",
        body: [
          "The most expensive mistake, and the most common. A resume that lists what you were assigned reads as interchangeable with everyone else who held that title.",
          "The fix is mechanical: go through each bullet and ask \"what changed because I did this?\" If there is no answer, either find one or cut the line.",
        ],
      },
      {
        heading: "Burying the best thing you've done",
        body: [
          "Readers scan top to bottom and give the page seconds. Your strongest evidence sitting fourth in a list under your third job will not be seen.",
          "Reorder ruthlessly. The first bullet of your most recent role is the most valuable line on the resume — put your best there.",
        ],
      },
      {
        heading: "One resume for every application",
        body: [
          "A generic resume is optimised for no one. You do not need to rewrite it each time, but the summary and the top bullets of the most recent role should reflect the job you are applying for.",
          "Fifteen minutes of tailoring beats an hour of formatting.",
        ],
      },
      {
        heading: "Filler that pushes real content off the page",
        body: [
          "References available on request. Objective statements. Skill bars showing you at 80% in a language. A photo where photos aren't customary. Interests that could belong to anyone.",
          "Each of these takes space from something that would have helped, on a page where space is the binding constraint.",
        ],
      },
      {
        heading: "Inconsistency",
        body: [
          "Dates formatted three ways, a mix of past and present tense within one role, bullets that sometimes end in full stops. None of it is fatal individually; together it reads as carelessness on a document whose whole purpose is to demonstrate that you are not careless.",
          "Read the resume once looking only at the formatting, ignoring the words. It's the fastest proofread there is.",
        ],
      },
      {
        heading: "Typos, last",
        body: [
          "Last on the list because it is the least common cause of rejection, not because it doesn't matter. Read it backwards, read it out loud, or have somebody else read it — you cannot proofread your own writing forwards after the fourth pass.",
        ],
      },
    ],
    compare: {
      heading: "What each mistake actually costs",
      columns: ["Mistake", "What it costs", "The fix"],
      rows: [
        [
          "Duties instead of results",
          "The reader cannot tell whether you were good at the job",
          "Add what changed to the end of each bullet",
        ],
        [
          "Best work buried",
          "It is never read — the first pass is six to ten seconds",
          "Move it to the first bullet of your most recent role",
        ],
        [
          "One resume for everything",
          "You lose to anyone who spent fifteen minutes tailoring",
          "Keep a master and cut a version per role type",
        ],
        [
          "Filler and adjectives",
          "Real content gets pushed onto a second page or off the end",
          "Delete every claim you cannot evidence elsewhere",
        ],
        [
          "Inconsistency",
          "Reads as carelessness before the reader can say why",
          "One date format, one tense rule, one punctuation rule",
        ],
        [
          "Typos",
          "Embarrassment, and a fatal impression in detail-critical roles",
          "Read it out loud, then have someone else read it",
        ],
      ],
    },
    checklist: {
      heading: "The mistakes to check for",
      items: [
        "No bullet begins \"responsible for\" or \"duties included\"",
        "Your strongest achievement is in the top third of the page",
        "The page is visibly written for the posting you are sending it to",
        "No \"references available on request\", no objective, no skill rating bars",
        "No unsupported adjectives about your own character",
        "Date formats, tense and punctuation are consistent throughout",
        "Your own name, job titles and employers are spelled correctly",
        "Nothing on the page is untrue, including a degree described as finished",
      ],
    },
    templates: {
      heading: "Templates that do not create their own mistakes",
      blurb:
        "Some of the errors above are the template's fault rather than yours — skill meters, photo blocks where they are not wanted, layouts that tempt you to shrink the type. These have none of them.",
      category: "minimal",
    },
    faqs: [
      {
        question: "Is it bad to have a one-page resume with ten years of experience?",
        answer:
          "No, if it's dense with evidence. Two pages of strong content beats one page of padding, and one page of strong content beats two pages of anything.",
      },
      {
        question: "Should I explain why I left each job?",
        answer:
          "Not on the resume. That's a conversation, and the space is better spent on what you achieved while you were there.",
      },
      {
        question: "Do skill rating bars help?",
        answer:
          "No. \"Python 80%\" means nothing consistent to any reader, and it takes the room a concrete example would have used.",
      },
    ],
    related: ["resume-bullet-points", "ats-friendly-resume", "how-to-write-a-resume"],
  },

  {
    slug: "translate-your-resume",
    title: "Translating your resume for another country",
    metaTitle: "How to Translate a Resume for International Jobs | meniacv",
    description:
      "What changes when you apply abroad — beyond the words. Conventions on photos, personal details, length and qualifications, country by country.",
    eyebrow: "International",
    updated: "2026-07-25",
    intro:
      "Translating a resume is the easy half. The harder half is that resume conventions differ sharply between countries, and a perfectly translated document that follows the wrong conventions still reads as foreign.",
    takeaways: [
      "Translate the content, never the proper nouns. Employer and institution names stay as they are.",
      "Conventions matter more than vocabulary — a perfect translation in the wrong format still reads as foreign.",
      "Photo, date of birth and nationality are expected in much of Europe and unwelcome in the US and UK.",
      "Convert grades to the local scale, or state both. \"2:1\" and \"GPA 3.8\" each mean nothing to the other market.",
      "State your language level in a recognised frame — CEFR, or \"professional working\" — not as a bar chart.",
    ],
    sections: [
      {
        heading: "Translate the content, not the proper nouns",
        body: [
          "Job titles, responsibilities, and section headings should be in the target language. Employer names, product names, universities and technologies should not — \"Kubernetes\" is Kubernetes everywhere, and translating a company name makes it unsearchable.",
          "Where a qualification has no equivalent, give the original and a short gloss: the reader needs to know roughly what level it represents, not a false equivalence to their own system.",
        ],
      },
      {
        heading: "Conventions that change by country",
        body: [
          "These vary more than people expect, and getting them wrong is a visible signal that you didn't research the market.",
        ],
        list: [
          "Photos: normal in Germany, France, Spain and much of the Middle East; discouraged in the US, UK, Canada and Australia",
          "Date of birth and marital status: still common in parts of Europe and Asia, never included in the US or UK",
          "Length: two pages is standard in Germany; one page is the norm in the US",
          "Signature and date: expected on a German Lebenslauf, unheard of elsewhere",
          "The word itself: \"CV\" means a short resume in the UK and a long academic document in the US",
        ],
      },
      {
        heading: "Register matters",
        body: [
          "Resume language is more formal in French and German than in American English, where a direct, achievement-forward tone is expected. A literal translation of punchy US bullets into French can read as brash.",
          "This is the part machine translation misses most reliably. Read the result and ask whether it sounds like a document written in that language, or a document translated into it.",
        ],
      },
      {
        heading: "Say what your language level actually is",
        body: [
          "If you list languages, use a recognised scale rather than a personal estimate. In Europe the CEFR levels (A1 through C2) are widely understood; elsewhere \"native\", \"fluent\", \"conversational\" and \"basic\" are clear enough.",
          "Be honest about it. Overstating a language is the one exaggeration that gets discovered in the first thirty seconds of a phone screen.",
        ],
      },
    ],
    checklist: {
      heading: "Before you send it to another country",
      items: [
        "Employer and university names left untranslated, with a gloss if obscure",
        "Job titles rendered as the local equivalent, not word-for-word",
        "Photo included or removed to match the destination convention",
        "Date of birth and nationality included only where they are expected",
        "Grades converted to the local scale, or both stated",
        "Dates in the local order — day-month-year in Europe, month-day-year in the US",
        "Phone number in international format with a country code",
        "Language levels stated on a recognised scale",
        "Read by a native speaker of the destination language, if at all possible",
      ],
    },
    templates: {
      heading: "Templates for a European CV",
      blurb:
        "The layouts that make room for a photo and personal details properly, which is what a German, French, Spanish or Italian application expects. Switch to a plain one for the US, UK, Canada or Australia — the content is shared.",
      category: "photo",
    },
    faqs: [
      {
        question: "Should I send an English resume or a translated one?",
        answer:
          "Send it in the language of the job posting. If the posting is in English at a company in a non-English-speaking country, English is expected — but having a local-language version ready is rarely wasted.",
      },
      {
        question: "Is machine translation good enough?",
        answer:
          "For a first pass, yes — modern translation handles resume content well. Have a native speaker read it before you send it, particularly for register and job titles, which are where the errors cluster.",
      },
      {
        question: "Do I need to convert my qualifications?",
        answer:
          "Give the original name plus a short equivalence note. Claiming a direct equivalent you haven't had assessed can create problems later in the process.",
      },
    ],
    related: ["resume-format", "how-to-write-a-resume", "ai-resume-builder"],
  },

  {
    slug: "career-change-resume",
    title: "Writing a resume for a career change",
    metaTitle: "Career Change Resume — How to Write One | meniacv",
    description:
      "How to make experience from one field read as relevant to another: what to lead with, what to translate, and what to leave out.",
    eyebrow: "Situations",
    updated: "2026-07-25",
    intro:
      "A career-change resume has one job that a normal resume doesn't: it has to explain the connection. Left implicit, a reader will not do that work for you — they will see a mismatch and move on.",
    takeaways: [
      "The resume has to make the connection explicitly. A reader will not do that work for you.",
      "Make the argument in the summary — it is the only place on the page that can.",
      "Translate your experience into the target field's vocabulary rather than discarding it.",
      "Lead with proof of the new thing, not with enthusiasm for it.",
      "Cut the material that argues you belong in the field you are leaving.",
    ],
    sections: [
      {
        heading: "Make the argument at the top",
        body: [
          "This is the one case where a summary is not optional. Two or three sentences naming where you're coming from, where you're going, and what makes the move credible — a qualification, a project, relevant work you did inside your old role.",
          "Without it the reader has to reconstruct your reasoning from a job history that points somewhere else. Most won't.",
        ],
      },
      {
        heading: "Translate, don't discard",
        body: [
          "Your old experience is not irrelevant, it is described in the wrong vocabulary. A teacher has run projects to a deadline with fixed resources, presented to hostile audiences, and analysed performance data. A chef has managed a team under time pressure with tight margins and no room for defects.",
          "Go through each bullet and rewrite it in the language of the field you're entering, without changing what happened. What you are removing is jargon, not substance.",
        ],
      },
      {
        heading: "Lead with proof, not enthusiasm",
        body: [
          "Everybody changing fields is enthusiastic about it; enthusiasm is not evidence. A course you completed, a project you shipped, freelance work you took on, an internal transfer you engineered — these are what make the change believable.",
          "If you have such work, it may deserve its own section above your employment history. A hybrid layout exists precisely for this.",
        ],
      },
      {
        heading: "Cut the parts that argue against you",
        body: [
          "Detail from your old field that has no bearing on the new one takes space and reinforces the mismatch. Older roles can compress to a line each.",
          "Keep what shows scope, judgement, and outcomes — those transfer. Drop the domain specifics that don't.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Teacher moving into corporate training",
        before:
          "Taught Year 9 and Year 10 science to mixed-ability classes and marked coursework",
        after:
          "Designed and delivered a year-long curriculum to 120 learners across three ability bands, and rewrote the department's assessment framework — now used by six other instructors",
        note:
          "Same job. The second version is written in words a learning-and-development manager already uses.",
      },
      {
        label: "The summary that does the work",
        before:
          "Passionate teacher looking to transition into a new and exciting career in corporate training",
        after:
          "Instructional designer moving from secondary education, where I built curriculum for 120 learners a year and ran induction for 40 new staff. Certified in Articulate 360. Looking for an L&D role designing programmes rather than delivering someone else's.",
      },
    ],
    checklist: {
      heading: "Does your page make the case?",
      items: [
        "The summary names the field you are moving into, in its first clause",
        "The first thing after the summary is evidence for the new direction",
        "Job titles are kept honest, but described in the target field's language",
        "Skills are ordered for the new role, not for the old one",
        "Any relevant project, course or certification is visible without scrolling",
        "Bullets that only make sense inside your old industry have been cut or rewritten",
        "Nothing on the page assumes the reader knows your previous field",
        "A stranger in the new field can tell what you would be doing on day one",
      ],
    },
    templates: {
      heading: "Templates that support a skills-first opening",
      blurb:
        "A career change usually wants a short capability block above the timeline. These layouts carry one without turning into a functional resume — the employment history stays intact underneath, which is what keeps it credible.",
      category: "modern",
    },
    faqs: [
      {
        question: "Should I use a functional resume for a career change?",
        answer:
          "A hybrid is better. Fully functional layouts read as evasive; a short skills block above a normal chronological history gets the same benefit without the suspicion.",
      },
      {
        question: "How do I explain the change without a cover letter?",
        answer:
          "In the summary, in one sentence, framed as a direction rather than an apology. \"Moving into instructional design after four years teaching\" is enough.",
      },
      {
        question: "Do I need a new qualification first?",
        answer:
          "Not always — demonstrable work often counts for more. A qualification helps most in fields with formal entry requirements.",
      },
    ],
    related: ["resume-summary-examples", "resume-format", "how-to-write-a-resume"],
  },
  {
    slug: "chronological-resume-format",
    title: "The chronological resume format",
    metaTitle: "Chronological Resume Format — Template, Example and When to Use It | meniacv",
    description:
      "The reverse-chronological resume: what it is, why it's the default for almost everyone, how to lay one out, and the two situations where it works against you.",
    eyebrow: "Formatting",
    updated: "2026-07-31",
    intro:
      "Reverse-chronological is the format nine out of ten people should use and roughly ten out of ten actually do. That makes it worth understanding properly rather than defaulting into — because the format is not the interesting decision, but a few of the choices inside it are.",
    takeaways: [
      "Most recent role first, working backwards. It is what nine out of ten people should use.",
      "It is the safest structure for parsing, because the title/employer/date records are unambiguous.",
      "It works against you when your recent history points somewhere other than the job you want.",
      "Ten to fifteen years of detail; everything older compresses to a line or comes off.",
      "Gaps are only a problem when the reader fills them in themselves. Name them in one line.",
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "Your most recent role first, then the one before it, working backwards. Each entry carries a title, an employer, a location, a date range and a handful of bullet points. Education goes underneath unless you graduated within the last year or two.",
          "That is the whole format. Its dominance is not a matter of fashion: it answers the reader's first question — what are you doing now, and at what level — in the first two lines, and it gives an applicant tracking system exactly the shape it expects to parse.",
        ],
      },
      {
        heading: "Getting the details right",
        body: [
          "Within the format, a few decisions do real work. These are the ones that separate a chronological resume that reads well from one that is merely correctly ordered.",
        ],
        list: [
          "Lead each bullet with what you owned and end it with what changed. \"Responsible for\" is the phrase to search for and delete.",
          "Use a consistent date format throughout — \"Mar 2022 – Present\" parses reliably, seasons and graphical timelines do not.",
          "Put the strongest bullet first within each role. Readers skim the top of every block and skip the bottom of most of them.",
          "Give your current role three to five bullets and older roles two. Space should follow relevance, not seniority at the time.",
          "Compress anything older than about ten years to a single line, or drop it. Nobody is assessing you on a 2013 internship.",
          "Do not leave a role's dates off because the tenure was short. A missing date reads worse than a short one, and some parsers drop the entry entirely.",
        ],
      },
      {
        heading: "When it works against you",
        body: [
          "Two situations, and the honest answer in both is that the alternatives are worse rather than that chronological is fine.",
          "The first is a genuinely fragmented history — a decade of short unrelated contracts, where a strict list is noise rather than narrative. The second is a career change where your most recent role is the least relevant thing on the page, so the format leads with your weakest argument.",
          "For the first, a hybrid opening with a skills summary above the timeline usually solves it. For the second, the summary does the work: one sentence naming the direction, then the chronology beneath it. What neither case justifies is a fully functional resume, which recruiters read as concealment even when it is not.",
        ],
      },
      {
        heading: "Handling gaps",
        body: [
          "The format makes gaps visible, which people treat as a reason to avoid it. It is not. Gaps are far more common than the advice industry pretends, and an unexplained one is only a problem because the reader fills it in themselves.",
          "Use years rather than months if the gap is short and you would rather not draw the eye to it — that is presentation, not deception. For anything longer, one line naming it plainly is enough: caring responsibilities, study, illness, redundancy in a bad market. A named gap stops being a question.",
        ],
      },
      {
        heading: "Choosing a chronological template",
        body: [
          "Almost any resume template is a chronological template, which is why searching for one specifically returns a general gallery. The format is a decision about ordering, not about design — you are not looking for a special layout, you are looking for one that does not fight the ordering.",
          "In practice that means three things. Dates aligned consistently and visible without hunting, because in this format the timeline is the argument. Job titles set more prominently than employers, since the title is what a reader scans for. And enough vertical separation between roles that the eye can tell where one ends and the next begins — a dense block of six jobs with identical spacing is chronological in structure and unreadable in practice.",
          "A single column is the safe default. This format's whole value is that a parser can extract clean title/employer/date records from it, and a sidebar layout can interleave text across columns and destroy exactly that. If your role is likely to be screened by software, do not spend the advantage.",
        ],
        list: [
          "Dates in a consistent position, right-aligned or immediately after the employer",
          "Job title more prominent than the employer name",
          "Clear separation between roles — space, a rule, or a heading weight change",
          "Single column, so the title/employer/date records extract cleanly",
          "Room for three to five bullets on recent roles and one or two on older ones",
        ],
      },
    ],
    checklist: {
      heading: "Getting the chronology right",
      items: [
        "Most recent role first, and it carries the most bullets",
        "Every entry has a title, employer, location and dates",
        "One date format throughout, with months where a gap would otherwise show",
        "Ten to fifteen years of detail, older roles as one-line entries",
        "Job titles set more prominently than employer names",
        "Promotions shown within one employer, not as separate companies",
        "Any gap longer than a few months accounted for in a line",
        "Education below experience unless you graduated within about two years",
      ],
    },
    templates: {
      heading: "Chronological resume templates",
      blurb:
        "Dates in a consistent position, titles above employers, and enough separation between roles that the eye can tell where one ends. Single column, so the records extract cleanly — which is the whole advantage of this format.",
      category: "classic",
      count: 9,
    },
    faqs: [
      {
        question: "What is a chronological resume template?",
        answer:
          "Any standard resume template, effectively — the chronological format is an ordering decision rather than a design. What you want is a layout that supports it: dates in a consistent, visible position, job titles set more prominently than employers, clear separation between roles, and a single column so the records parse cleanly.",
      },
      {
        question: "What is a chronological resume?",
        answer:
          "A resume that lists your employment history from most recent to oldest, with each role carrying a title, employer, dates and bullet points. Strictly it is reverse-chronological; the two terms are used interchangeably and mean the same document.",
      },
      {
        question: "Is the chronological format best for ATS?",
        answer:
          "Yes. It is the shape parsers are built around — they are looking for title, employer and date range records, and this format supplies exactly that. Functional resumes, which bury or omit the timeline, are the ones that parse badly.",
      },
      {
        question: "How far back should a chronological resume go?",
        answer:
          "About ten to fifteen years of detail, and a single line or nothing for anything older. Relevance beats completeness: three well-described recent roles serve you better than eight thin ones stretching back to 2009.",
      },
      {
        question: "Should education go at the top or the bottom?",
        answer:
          "Bottom, unless you graduated in the last year or two, or you are in a field where the qualification is the entry ticket — medicine, law, academia. Otherwise your work is more interesting than your degree and should come first.",
      },
    ],
    related: ["resume-format", "functional-resume-format", "resume-length"],
  },
  {
    slug: "functional-resume-format",
    title: "The functional resume format, and why to be careful with it",
    metaTitle: "Functional Resume Format — When It Helps and When It Hurts | meniacv",
    description:
      "The skills-based resume format: how it's built, why recruiters distrust it, the narrow cases where it genuinely helps, and the hybrid that usually works better.",
    eyebrow: "Formatting",
    updated: "2026-07-31",
    intro:
      "The functional resume organises by skill instead of by job, with employment history reduced to a list at the bottom. It is recommended constantly to career changers and people with gaps, and it is usually the wrong advice. Here is what it actually does to a reader — and the narrow set of cases where it earns its place.",
    takeaways: [
      "Skill headings first, employment history reduced to a list at the bottom.",
      "Recruiters read a fully functional resume as concealment, because it usually is.",
      "It genuinely helps in a narrow set of cases — and even then the hybrid does it better.",
      "Parsers build records from title/employer/date triples. Remove those and the record is empty.",
      "The hybrid — a skills block above an intact timeline — is what most people actually want.",
    ],
    sections: [
      {
        heading: "How it is built",
        body: [
          "Instead of roles in reverse-chronological order, the body of the page is three or four skill headings — Project Management, Client Relationships, Data Analysis — each with bullet points drawn from anywhere in your history. Employers and dates appear once, compressed into a short list near the bottom.",
          "The theory is sound: it lets you lead with capability rather than with chronology, which is genuinely useful if your job titles undersell you.",
        ],
      },
      {
        heading: "Why recruiters distrust it",
        body: [
          "The problem is not that the format is ugly. It is that it removes the single thing a reader uses to calibrate everything else: when, and for how long, and in what context.",
          "A bullet that says \"led a team of twelve\" means something different if it was last year than if it was in 2016, and different again if it lasted three months rather than three years. Strip the timeline out and every claim floats free of the context that would let someone judge it. Recruiters know this, which is why the format is read as concealment — and the reader's guess about what is being concealed is almost always worse than the truth.",
          "There is a practical cost too. Applicant tracking systems parse into title/employer/date records. A functional resume gives them very little to work with, so it tends to rank poorly even before a human forms an opinion.",
        ],
      },
      {
        heading: "The cases where it genuinely helps",
        body: [
          "They exist and they are narrower than the advice suggests.",
        ],
        list: [
          "A portfolio career of many short, unrelated contracts, where a strict chronology is a wall of noise rather than a narrative.",
          "Military or public-sector transitions where the job titles are meaningless outside the institution and the skills need translating before anything else.",
          "Academic or research work being pitched into industry, where the relevant experience is spread across projects rather than jobs.",
          "Very early career, where you have coursework, projects and part-time work but no employment history that a chronological format could organise.",
        ],
      },
      {
        heading: "The hybrid, which is usually the right answer",
        body: [
          "If you reached this page because someone recommended a functional resume for a career change or a gap, the format you actually want is the hybrid — and it solves the same problem without the cost.",
          "A hybrid keeps the reverse-chronological history intact and puts a short skills section above it: three or four grouped capabilities with a line of evidence each, then the timeline underneath. The reader gets your argument first and the context immediately after, and the parser still finds the records it needs.",
          "That combination is what most people mean when they say a functional resume helped them. It is worth being precise about, because the fully functional version is the one that costs you interviews.",
        ],
      },
      {
        heading: "What one actually looks like",
        body: [
          "Concretely, for someone moving from teaching into corporate training. After the contact block and a short summary, the page runs three skill headings before it reaches any employer.",
          "Under \"Curriculum design\": built a semester-long curriculum for 120 students across three ability bands; rewrote the department's assessment framework, now used by six teachers. Under \"Facilitation and delivery\": taught 25 hours a week to groups of 30; ran the district's induction sessions for 40 new teachers across two years. Under \"Programme measurement\": introduced a tracking system that identified struggling students six weeks earlier than the previous process.",
          "Then, and this is the part that decides whether the document works, a plain employment history at the bottom: employer, title, location, dates. Three lines, no bullets. That block is what stops the format reading as concealment and what gives a parser the records it needs.",
        ],
      },
      {
        heading: "Templates for it, and the parsing cost",
        body: [
          "There is no special functional template to find. Any single-column layout produces one — you are choosing which sections go in which order, not which design to buy, and a template marketed as functional is a normal template with the headings renamed.",
          "What matters is that the layout keeps a clearly-labelled employment section at the bottom. Templates that drop the chronology entirely, or bury it in a sidebar, produce the version recruiters distrust and parsers mishandle: an applicant tracking system builds its record from title, employer and date triples, and a document without them can end up with an empty work-history field regardless of how much text is on the page.",
          "The practical consequence is that the hybrid is easier to build as well as more effective. Take a standard chronological template, add two or three skill groupings above the experience section, and you have the readable version of this format without giving up the structure everything downstream depends on.",
        ],
      },
    ],
    compare: {
      heading: "Functional against the hybrid",
      columns: ["", "Fully functional", "Hybrid"],
      rows: [
        [
          "Structure",
          "Skill headings, then a bare list of employers",
          "A short skills block, then a full reverse-chronological history",
        ],
        [
          "What a recruiter assumes",
          "Something is being hidden — a gap, a demotion, a short tenure",
          "Nothing. The timeline is right there",
        ],
        [
          "Parsing",
          "Often produces an empty work-history field",
          "Parses like any chronological resume",
        ],
        [
          "Career changers",
          "Makes the argument, and costs credibility making it",
          "Makes the same argument with the evidence intact",
        ],
        [
          "When it is right",
          "Very rarely — a first resume with no history at all",
          "Career changes, contracting, and misleading recent titles",
        ],
      ],
    },
    checklist: {
      heading: "If you are using this format anyway",
      items: [
        "There is a labelled employment history at the bottom with employer, title and dates",
        "Three or four skill groupings, not eight",
        "Each grouping carries specific evidence, not a list of adjectives",
        "Nothing in the skill groupings contradicts the timeline underneath",
        "The reader can still tell what you are doing now and where",
        "You have run the copy-paste check and the work history survived",
        "You have considered the hybrid, and have a reason for not using it",
      ],
    },
    templates: {
      heading: "Single-column templates for a skills-led layout",
      blurb:
        "There is no special functional template — you are choosing section order, not a design. These single-column layouts carry a skills block above the timeline without dropping the records a parser needs.",
      category: "one-column",
    },
    faqs: [
      {
        question: "What does a functional resume look like?",
        answer:
          "Contact details, a short summary, then three or four skill headings — each with bullets drawn from across your whole career rather than from one job — and finally a plain employment history at the bottom with employer, title and dates only. That last block is not optional; without it the format reads as concealment and parses badly.",
      },
      {
        question: "Is there a functional resume template?",
        answer:
          "Not really — any single-column template produces one, because the format is a decision about section order rather than about design. Start from a standard chronological layout, add your skill groupings above the experience section, and keep a labelled employment history at the bottom.",
      },
      {
        question: "What is a functional resume?",
        answer:
          "A resume organised by skill category rather than by job, with employment history compressed into a short list at the bottom. It is also called a skills-based resume, and the two terms mean the same thing.",
      },
      {
        question: "Do recruiters hate functional resumes?",
        answer:
          "Many actively dislike them, and the reason is specific rather than aesthetic: removing the timeline removes the context that makes any individual claim assessable. The format is read as hiding something, which is a costly assumption to invite even when there is nothing to hide.",
      },
      {
        question: "Is a functional resume good for career changers?",
        answer:
          "Usually not, despite being the standard recommendation. A hybrid — a short skills section above an intact chronological history — makes the same argument without triggering the same suspicion, and parses far better. Use the fully functional version only when your history is genuinely too fragmented to order.",
      },
      {
        question: "Do functional resumes work with ATS?",
        answer:
          "Poorly. Parsers are built to extract title, employer and date range records, and a functional resume deliberately supplies very few of them. Expect to rank low enough that a human may never reach your application.",
      },
    ],
    related: ["resume-format", "chronological-resume-format", "career-change-resume"],
  },
  {
    slug: "resume-length",
    title: "How long should a resume be?",
    metaTitle: "How Long Should a Resume Be? One Page vs Two ({year}) | meniacv",
    description:
      "One page or two, when a second page is justified, which fields expect longer, and what to cut when you're over — with the rule that actually decides it.",
    eyebrow: "Formatting",
    updated: "2026-07-31",
    intro:
      "One page for most people, two once the second page carries substance rather than padding. That is the whole answer, and the rest of this page is about the part people actually get stuck on: deciding which of your material is substance.",
    takeaways: [
      "One page under about ten years of experience, two beyond it.",
      "Two pages is not a penalty for senior candidates — compressing fifteen years deletes evidence.",
      "Three pages is normal only for academic CVs, US federal applications and some clinical roles.",
      "If it does not fit at eleven point with real margins, there is too much on it — cut, do not shrink.",
      "A second page must carry substance. Half a page of padding is worse than one full page.",
    ],
    sections: [
      {
        heading: "The rule, and the real rule",
        body: [
          "The conventional rule is one page up to about eight to ten years of experience, two beyond that. It is a decent approximation and it is not what actually decides the question.",
          "The real rule is that every line has to earn its place. A two-page resume where the second page is a 2011 internship, a list of hobbies and \"references available on request\" is worse than a one-page resume, because you have asked for twice the attention and returned less per line. A two-page resume where both pages are dense with recent, relevant, quantified work is better than cramming the same content onto one page at eight-point type.",
          "So the question is never \"am I allowed two pages\". It is \"is my weakest line better than nothing\". If it is not, cut it, and see what length you land on.",
        ],
      },
      {
        heading: "Where the conventions differ",
        body: [
          "Length expectations vary more by field and country than most advice admits.",
        ],
        list: [
          "US and Canada: one page is a genuine norm for early and mid-career, and going to two is noticed. Two is fine and expected at senior level.",
          "UK, Ireland, Australia: two pages is the standard CV length at essentially any level. A one-page UK CV can read as thin.",
          "Continental Europe: two pages, plus a photo and personal details.",
          "Nursing and healthcare: routinely two pages, because licensure, certifications and clinical settings all have to be listed and none of it is optional.",
          "Academia and research: no limit. An academic CV is a complete record and can run to fifteen pages or more — a different document entirely.",
          "Senior technical and executive roles: two pages, occasionally three, where the scope genuinely requires it.",
        ],
      },
      {
        heading: "What to cut first",
        body: [
          "In order, because doing this in the wrong order wastes an evening. Work down the list and stop when you fit.",
        ],
        list: [
          "\"References available on request.\" It is assumed, it has been assumed for thirty years, and it costs you a line.",
          "An objective statement. Replace it with a summary that says what you do, or delete it — an objective tells the employer what you want, which is not the question they are asking.",
          "Interests and hobbies, unless one is genuinely relevant to the role or the employer is known to care.",
          "Anything older than fifteen years, compressed to one line or removed.",
          "The fourth and fifth bullets on your oldest roles. Nobody reads that far into a 2016 job.",
          "Skills you cannot discuss for two minutes. These are liabilities as well as filler.",
          "Only then: tighten wording, reduce margins slightly, and consider a denser template.",
        ],
      },
      {
        heading: "If you are just over",
        body: [
          "The worst outcome is a second page holding three lines. It reads as a mistake rather than as a document, and it is the one length that looks careless at a glance.",
          "If you are two or three lines over, cut them — the material at the very bottom of a resume is by definition your weakest. If you are half a page over, take the whole second page and fill it properly, or cut back to one. Do not shrink the type to nine point and squeeze the margins to a quarter inch: a cramped one-page resume is harder to read than a comfortable two-page one, and readability is the thing you were protecting in the first place.",
        ],
      },
    ],
    compare: {
      heading: "How long yours should be",
      columns: ["Where you are", "Pages", "Why"],
      rows: [
        [
          "Student or first job",
          "One, and often not a full one",
          "A short honest page beats a padded one, and every reader knows what a first resume looks like",
        ],
        [
          "Up to ~10 years",
          "One",
          "The constraint is what forces the quality up — weak lines become obvious when space is scarce",
        ],
        [
          "10–20 years",
          "Two",
          "A second page carrying real scope is evidence. Compressing it onto one deletes that evidence",
        ],
        [
          "Executive",
          "Two, occasionally three",
          "Scope has to be stated, and board or public-company history takes room",
        ],
        [
          "Academic CV",
          "No limit",
          "It is a complete record rather than an argument — editing for brevity makes it incomplete",
        ],
        [
          "US federal",
          "Four to six",
          "Assessed against a written standard. Anything omitted cannot be credited",
        ],
      ],
    },
    checklist: {
      heading: "What to cut first, in order",
      items: [
        "Jobs older than about fifteen years with no bearing on this one",
        "\"References available on request\" and any objective statement",
        "Adjectives about yourself with nothing behind them",
        "Bullets that describe duties rather than outcomes",
        "The fourth and fifth bullet on roles older than your last two",
        "Skills that are assumed — Microsoft Office, email, internet research",
        "Anything irrelevant to the specific posting, however good it is",
        "High school, once you hold a degree",
      ],
    },
    templates: {
      heading: "Templates that fit more without shrinking the type",
      blurb:
        "Density is a spacing decision, not a font-size one. These compact layouts hold a full career at a readable size — which is the alternative to setting a good template at nine point to force two pages into one.",
      category: "compact",
    },
    faqs: [
      {
        question: "Should a resume be one page or two?",
        answer:
          "One page for most people up to roughly eight to ten years of experience, two once the second page carries real content rather than padding. The deciding question is whether your weakest line is better than nothing — cut everything that fails that test and take whatever length remains.",
      },
      {
        question: "Is a two-page resume acceptable?",
        answer:
          "Entirely, at mid-level and above, and it is the standard length in the UK, Ireland, Australia and continental Europe at any level. What is not acceptable is a second page created by padding, or one holding three orphaned lines.",
      },
      {
        question: "Can a resume be three pages?",
        answer:
          "Rarely, and only for genuinely senior roles, some technical positions with substantial publication or patent records, and healthcare where certifications are extensive. Academic CVs are the exception that proves the rule — they have no limit because they are a different document.",
      },
      {
        question: "Does a longer resume hurt my chances with an ATS?",
        answer:
          "No. Parsers do not penalise length and a longer document can match more keywords. The cost of length is entirely human: a recruiter's attention per line drops as the page count rises, so padding dilutes your strong material rather than adding to it.",
      },
    ],
    related: ["resume-format", "resume-mistakes", "resume-bullet-points"],
  },
  {
    slug: "linkedin-to-resume",
    title: "Turning your LinkedIn profile into a resume",
    metaTitle: "LinkedIn to Resume — How to Convert It Properly ({year}) | meniacv",
    description:
      "How to turn a LinkedIn profile into a real resume, why LinkedIn's own PDF export is a poor starting point, and what has to change between the two documents.",
    eyebrow: "Practical",
    updated: "2026-07-31",
    intro:
      "Your LinkedIn profile is the closest thing most people have to a written record of their career, which makes it the obvious place to start a resume. It is also a different document with a different job, and converting one to the other is more than a copy and paste.",
    takeaways: [
      "LinkedIn's own PDF export is a reasonable raw material and a poor finished product.",
      "A profile answers \"who is this person\"; a resume answers \"should we interview them, for this job\".",
      "Cut to two pages, rewrite the About section into a three-sentence summary, and add numbers.",
      "Drop endorsements, recommendations, the fifty-skill list and the photo where it is not conventional.",
      "Keep the facts consistent — titles, employers and dates. A recruiter will have both open.",
    ],
    sections: [
      {
        heading: "Why LinkedIn's own PDF export is not enough",
        body: [
          "LinkedIn will generate a PDF of your profile in two clicks, and it is worth understanding what you get. The export is a dump of profile fields in profile order — headline, about, experience, education, skills, and whatever else you have filled in — with LinkedIn's own typography and no editorial judgement applied.",
          "That produces three problems. It is untailored, so every application gets the same document. It is often far too long, because a profile has no length pressure and a resume does. And it carries profile-specific furniture — endorsements, recommendations, the full skills list — that has no place on a resume and dilutes the parts that do.",
          "It is a reasonable raw material and a poor finished product. Use it as the source, not as the output.",
        ],
      },
      {
        heading: "What has to change",
        body: [
          "The two documents answer different questions. A profile answers \"who is this person, generally\". A resume answers \"should we interview this person, for this job\". Almost everything that differs between them follows from that.",
        ],
        list: [
          "Cut to two pages at most. A profile listing every role since 2009 becomes a resume with ten to fifteen years of detail and a line for the rest.",
          "Rewrite the About section into a three-sentence summary aimed at one job, not at everyone who might look you up.",
          "Add numbers. LinkedIn descriptions are usually written in responsibility language; a resume needs outcomes, and this is where most of the work is.",
          "Drop the skills list down to the ten or twelve that are true and relevant. LinkedIn's fifty-skill list exists for search, not for reading.",
          "Remove endorsements, recommendations, follower counts and the profile photo unless you are applying somewhere a photo is conventional.",
          "Reorder for the posting. A profile has one fixed order; a resume should lead with whichever half of your experience the job actually asks for.",
        ],
      },
      {
        heading: "The fastest route",
        body: [
          "Export the PDF from LinkedIn — More, then Save to PDF, on your own profile — and import it here. The assistant reads it into structured fields, so your roles, dates, education and skills arrive as data rather than as a block of text to retype. From there the work is editorial rather than clerical.",
          "Then do the part that matters: go through each role and rewrite the bullets so they end in a result. That single pass is the whole difference between a profile printed out and a resume, and it is not something the export can do for you.",
        ],
      },
      {
        heading: "Keeping them in sync",
        body: [
          "They should not be identical, and trying to keep them so is wasted effort. The profile is your permanent, public, general record; the resume is a tailored argument for one job. It is entirely normal for the profile to be longer and broader.",
          "What should stay consistent is the facts — job titles, employers and dates. A recruiter will have both open, and a discrepancy in a date range is the kind of small thing that becomes a large thing.",
        ],
      },
    ],
    compare: {
      heading: "Profile and resume are different documents",
      columns: ["", "LinkedIn profile", "Resume"],
      rows: [
        [
          "Audience",
          "Anyone who looks you up, indefinitely",
          "One hiring manager, for one job, once",
        ],
        [
          "Length",
          "No pressure — every role since your first",
          "One or two pages, ten to fifteen years of detail",
        ],
        [
          "Voice",
          "First person, and it should sound like a person",
          "Implied first person, fragments, no pronouns",
        ],
        [
          "Tailoring",
          "One version, general by necessity",
          "Reordered and cut for each posting",
        ],
        [
          "Photo",
          "Expected everywhere",
          "Only where local convention wants one",
        ],
        [
          "Skills",
          "Fifty, for search",
          "Ten to twenty, for reading",
        ],
      ],
    },
    checklist: {
      heading: "Converting a profile into a resume",
      items: [
        "Cut to two pages at most, with ten to fifteen years of detail",
        "About section rewritten as a three-sentence summary aimed at one job",
        "Every role description rewritten so it ends in an outcome",
        "Skills cut from fifty to the ten or twelve that are true and relevant",
        "Endorsements, recommendations and follower counts removed",
        "Photo removed unless you are applying where one is conventional",
        "Sections reordered for the posting rather than in profile order",
        "Titles, employers and dates identical to the profile",
      ],
    },
    templates: {
      heading: "Templates to rebuild it in",
      blurb:
        "The export lands as a block of profile fields in LinkedIn's own typography. These are the layouts to put the content into once you have it — contemporary enough to read as current, and single column so it parses.",
      category: "modern",
    },
    faqs: [
      {
        question: "Can I download my LinkedIn profile as a resume?",
        answer:
          "You can — More, then Save to PDF, on your own profile — but the result is a profile dump rather than a resume: untailored, usually too long, and full of profile furniture like endorsements. Treat it as raw material to import and edit, not as a finished document to send.",
      },
      {
        question: "Should my resume match my LinkedIn profile exactly?",
        answer:
          "No, and it shouldn't. A profile is a general, permanent record; a resume is a tailored argument for one role and should be shorter and sharper. What must match is the factual layer — titles, employers and date ranges — because recruiters check.",
      },
      {
        question: "How do I convert LinkedIn to a resume quickly?",
        answer:
          "Export the PDF from LinkedIn and import it here; the assistant reads it into structured fields so nothing is retyped. Then do one pass rewriting each bullet to end in a result, and cut to two pages. The import takes a minute, the rewrite is the real work, and it is the part that decides the outcome.",
      },
      {
        question: "Should I put my LinkedIn URL on my resume?",
        answer:
          "Yes, if the profile is current and complete — it is the one link recruiters reliably click. Customise the URL first so it isn't a string of digits, and make sure what they find is consistent with what you sent.",
      },
    ],
    related: ["how-to-write-a-resume", "resume-bullet-points", "resume-length"],
  },
  {
    slug: "chatgpt-resume",
    title: "Using ChatGPT to write your resume",
    metaTitle: "ChatGPT Resume — Prompts That Work and Traps to Avoid | meniacv",
    description:
      "How to use ChatGPT on a resume without producing something generic: what to ask it, what never to trust it with, and the tells recruiters actually notice.",
    eyebrow: "AI writing",
    updated: "2026-07-31",
    intro:
      "ChatGPT is genuinely useful on a resume and genuinely dangerous on one, and the difference is entirely in what you ask it to do. Asked to write a resume, it produces a fluent description of a person who does not exist. Asked to improve one, it is a better editor than most people have access to.",
    takeaways: [
      "Ask for transformation, never generation. It may rewrite what you gave it; it may not add facts.",
      "Given a job title and nothing else, it will invent employers, metrics and scope — fluently.",
      "The recruiter-visible tell is uniformity: every bullet the same length, rhythm and construction.",
      "It has no idea what your industry values or what your target company is like.",
      "A resume carries your full employment history. Check what the service does with what you paste.",
    ],
    sections: [
      {
        heading: "The one rule",
        body: [
          "Never ask it to generate content. Always ask it to transform content you supply.",
          "That distinction sounds pedantic and it decides everything. \"Write me a resume for a marketing manager\" returns industry-standard filler with plausible numbers attached — and those numbers are invented, which means you either send a resume with fabricated metrics on it or spend longer correcting them than writing would have taken. \"Here is what I did; rewrite this bullet so it leads with ownership and ends with the result\" returns something true and better written.",
          "Everything below is a variation on that one rule.",
        ],
      },
      {
        heading: "Prompts that actually work",
        body: [
          "These assume you paste your own material in first. Each one asks for a transformation rather than an invention.",
        ],
        list: [
          "\"Rewrite this bullet so it starts with what I owned and ends with the measurable result. Do not add any numbers I haven't given you.\"",
          "\"Here are my three most recent roles. Draft a three-sentence summary aimed at this job posting: [paste]. Use only facts present above.\"",
          "\"Read this job posting and my resume. List the requirements the posting emphasises that my resume doesn't currently address.\"",
          "\"Which of these bullets have no outcome in them? Just list them — don't rewrite yet.\"",
          "\"Rewrite this to be about 25% shorter without losing any specific detail.\"",
          "\"What questions would an interviewer ask about the claims on this resume?\" — the fastest way to find the lines you can't defend.",
        ],
      },
      {
        heading: "What it gets wrong",
        body: [
          "Invented specifics are the serious failure. Asked for impressive bullets, a model will supply percentages, team sizes and revenue figures that look exactly like real ones. If any of those reach an interview, you are answering questions about work you did not do — and that is a much worse outcome than a plain resume.",
          "Uniformity is the subtler failure, and it is the actual tell recruiters notice. Not vocabulary — every bullet arriving at the same length, the same rhythm, the same verb-first construction, with no line that sounds like a particular person wrote it. A resume where every bullet is equally polished reads as processed. Keep the ones that sound like you.",
          "It also has no idea what your industry values, what your target company is like, or whether a claim that reads as impressive in one field reads as routine in another. It is editing prose, not advising you on a market.",
        ],
      },
      {
        heading: "The privacy question nobody asks",
        body: [
          "A resume contains your full name, contact details, employment history and often your address. Pasting it into a general-purpose chatbot means it goes wherever that service's data policy says it goes, and for consumer tiers that has historically included model training unless you found and changed a setting.",
          "This is worth thirty seconds of attention rather than none. Check the setting, or use a tool that states plainly what it does — the assistant here works from your resume to produce the response you asked for and does not use it for training, which is the answer you want from anything you hand your employment history to.",
        ],
      },
    ],
    rewrites: [
      {
        label: "The prompt that works",
        before:
          "Write a resume bullet for a project manager at a logistics company",
        after:
          "Here is a bullet I wrote: [paste]. Rewrite it so it starts with what I owned and ends with the measurable result. Do not add any numbers I have not given you.",
        note:
          "The first asks for invention and gets it. The second asks for an edit and can only work from what you supplied.",
      },
      {
        label: "What a good edit looks like",
        before: "Was in charge of the warehouse move",
        after:
          "Ran the relocation of a 40,000 sq ft warehouse across a single weekend, with no missed customer shipments on the Monday",
        note:
          "The size, the timeframe and the outcome were all in the writer's rough notes. The model reordered them; it did not supply them.",
      },
    ],
    checklist: {
      heading: "After any AI pass, verify",
      items: [
        "Every number traces back to something you wrote",
        "Every employer, tool and title is one you actually worked with",
        "Bullet lengths vary rather than all landing on two lines",
        "At least two lines still sound like you wrote them",
        "No superlatives you would not say out loud in an interview",
        "Nothing has been smoothed into a claim you cannot defend",
        "Training on your data is turned off, or the tool states it does not train",
      ],
    },
    templates: {
      heading: "Templates for the finished document",
      blurb:
        "Once the writing is sharp, the page should get out of its way. These plain single-column layouts add nothing between your bullets and the reader, and export as real text.",
      category: "simple",
    },
    faqs: [
      {
        question: "Can ChatGPT write a good resume?",
        answer:
          "It can write a good-sounding resume for a person who does not exist. Given your real material, it is an excellent editor — it turns responsibility language into outcomes, tightens what runs long, and spots bullets with no result in them. Ask for transformation, never generation.",
      },
      {
        question: "Can recruiters tell if ChatGPT wrote my resume?",
        answer:
          "Often, when it is used unedited, and the tell is uniformity rather than vocabulary — every bullet the same length and rhythm, with no specifics that could only be yours. Used to sharpen your own material it does not read that way, because the substance underneath is real.",
      },
      {
        question: "What's the best ChatGPT prompt for a resume?",
        answer:
          "Any prompt that hands it your content and asks for a specific transformation, with an explicit instruction not to invent facts. \"Rewrite this bullet to lead with ownership and end with the result; do not add numbers I haven't given you\" outperforms every generate-me-a-resume prompt ever written.",
      },
      {
        question: "Is it safe to paste my resume into ChatGPT?",
        answer:
          "Check the data controls first. A resume carries your full employment history and contact details, and consumer chatbot tiers have historically used conversations for training by default. Either turn that off or use a tool that states its position plainly.",
      },
    ],
    related: ["ai-resume-builder", "resume-bullet-points", "resume-summary-examples"],
  },
  {
    slug: "cv-vs-resume",
    title: "CV vs resume: the difference, and which one you were asked for",
    metaTitle: "CV vs Resume — What's the Difference? ({year}) | meniacv",
    description:
      "A CV and a resume are the same document in Britain and two different documents in America. What each word means where you are applying, and how to tell which one the posting wants.",
    eyebrow: "Vocabulary",
    updated: "2026-08-01",
    intro:
      "Almost every explanation of this starts with \"a CV is longer\" and stops there, which is wrong often enough to cost people applications. The honest answer is that CV and resume are not two documents — they are one word that means different things in different countries, plus a genuinely separate academic document that happens to share the name. Sort out which of the three you have been asked for and the rest of the decision makes itself.",
    takeaways: [
      "In the UK, Ireland, Australia and most of the Commonwealth, a CV is a resume. Same document, different word.",
      "In the US and Canada outside academia, a CV request almost always means a resume.",
      "A real academic CV is an unabridged record with no length limit — a genuinely different document.",
      "The only structural difference is selection: a resume is edited for one job, an academic CV is complete by design.",
      "Continental Europe expects the same two pages plus a photo, and often nationality and date of birth.",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "In the United States and Canada, a resume is a one-to-two-page summary of your career aimed at a specific job, and a CV means an unabridged academic record — publications, grants, teaching, committees — used almost exclusively for university, research and medical posts. Outside academia, an American employer who writes \"CV\" almost always means resume.",
          "In the UK, Ireland, Australia, New Zealand, South Africa and most of the Commonwealth, CV is simply the word for the document. It is two pages, it is tailored to the job, and it is what an American would call a resume. Nobody there says resume. There is no separate shorter document that a CV is being contrasted with.",
          "In continental Europe, a CV is that same two-page document plus a photo and, in many countries, your nationality and date of birth. In Germany it is a Lebenslauf and it is expected to account for your time rather than edit it down.",
        ],
        list: [
          "US / Canada, industry: they mean a resume. One to two pages, tailored.",
          "US / Canada, academia or research: they mean a real CV. No length limit.",
          "UK, Ireland, Australia, NZ, India, South Africa: CV is the word for a resume.",
          "Germany, France, Spain, Italy, Netherlands: CV, with a photo, often two pages.",
          "Anywhere, if the posting says \"resume\": send a resume, whatever your local word is.",
        ],
      },
      {
        heading: "The one real difference: selection",
        body: [
          "Strip away the vocabulary and there is exactly one structural difference between an academic CV and everything else on this page, and it is not length. It is whether you are allowed to leave things out.",
          "A resume — and a British CV, and a German Lebenslauf — is an argument. You are selecting the material that makes the case for this job and cutting the rest, and a reader assumes anything present is there because it was relevant. An academic CV is a record. Every paper, every conference, every course you taught, in full, because the reader is assessing a body of work rather than a fit for one post. Editing an academic CV down for brevity does not make it a better document; it makes it an incomplete one.",
          "This is why the length rule keeps failing people. The academic CV is long because it is complete, not because CVs are long. A two-page British CV is short because it is selective, and it is still called a CV.",
        ],
      },
      {
        heading: "How to tell which one a posting wants",
        body: [
          "Read the employer, not the noun. A software company in Berlin asking for a CV wants two pages with a photo. A software company in Austin asking for a CV wants a resume and used the wrong word. A university department in either city asking for a CV wants the full academic record, and will usually say so somewhere else in the posting by asking for a publication list or a research statement.",
          "The tiebreaker that almost always works: look at what else is being requested. Cover letter, references and a portfolio point at an industry application. Publication list, teaching statement, research statement or names of three academic referees point at a real CV. If a job asks for a CV and a one-page cover letter and nothing else, it is not asking for fifteen pages.",
          "When you genuinely cannot tell, send the two-page version. An American reader receiving a tight two pages sees a normal resume. An academic reader receiving one will ask for more. The reverse — sending fifteen pages to a recruiter — ends the application without a reply.",
        ],
      },
      {
        heading: "What changes when you cross a border",
        body: [
          "Personal details are the part that surprises people most. A US resume carries no photo, no date of birth, no marital status and no nationality, and including them can route your application into a slower compliance path or get it discarded. A Spanish or Italian CV that omits all of them reads as incomplete.",
          "Dates and grades need translating too, not just words. \"GPA 3.8\" means nothing to a British reader and \"2:1\" means nothing to an American one. Give the local equivalent, or state the classification and the scale together.",
          "The pragmatic approach for anyone applying across markets is one master document and a cut per market, rather than a single file trying to satisfy every convention. A document that hedges between them reads as belonging to none of them.",
        ],
        list: [
          "Photo: continental Europe yes, UK and North America no.",
          "Date of birth and nationality: normal in much of Europe, never in the US or UK.",
          "Length: two pages almost everywhere except a genuine academic CV.",
          "References: \"available on request\" is dead everywhere — omit the line entirely.",
          "Grades: convert to the local scale or state both.",
        ],
      },
      {
        heading: "What to actually do next",
        body: [
          "Whichever word the posting used, the writing problem is the same for everything except an academic CV: two pages at most, reverse-chronological, and every bullet ending in something that changed. The template you choose matters far less than whether your history is selected for this job.",
          "If you are writing for the UK or Europe, the CV templates here are built for those conventions, with and without a photo. If you are writing for the US, the same templates with the photo left off are a resume — because, structurally, that is all the difference amounts to.",
        ],
      },
    ],
    compare: {
      heading: "What actually changes between them",
      columns: ["", "US resume", "UK / European CV"],
      rows: [
        [
          "Length",
          "One page under ten years, two beyond",
          "Two pages is standard, and normal rather than indulgent",
        ],
        [
          "Photo",
          "No — many employers strip or reject them",
          "No in the UK and Ireland; yes across most of continental Europe",
        ],
        [
          "Personal details",
          "Name, email, phone, city. Nothing else",
          "Often date of birth and nationality in Germany, France, Spain and Italy",
        ],
        [
          "Selection",
          "Edited hard for one specific posting",
          "Also edited, except in Germany where the record is expected to be complete",
        ],
        [
          "Grades",
          "GPA, where it is strong and recent",
          "Degree classification — a 2:1, a first — on the local scale",
        ],
        [
          "The word used",
          "Resume. \"CV\" means the academic document",
          "CV. Nobody says resume, and there is no shorter document it contrasts with",
        ],
      ],
    },
    checklist: {
      heading: "Before you send either one",
      items: [
        "You have worked out which of the three documents was actually requested",
        "Length matches — two pages for industry, unabridged only for academia",
        "Photo included or removed to match the country the job is in",
        "Date of birth and nationality present only where they are conventional",
        "Grades converted to the local scale, or both stated",
        "No \"references available on request\" — the line is dead in every market",
        "Dates in the local order, and a phone number with a country code",
      ],
    },
    templates: {
      heading: "CV and resume templates",
      blurb:
        "The same templates serve both, which is the practical proof of everything above — one document under two names. The photo is the only structural thing that changes, and it is a setting rather than a different template.",
      category: "professional",
      count: 9,
    },
    faqs: [
      {
        question: "What is the difference between a CV and a resume?",
        answer:
          "It depends on where you are. In the UK, Ireland, Australia and most of the Commonwealth, a CV is a resume — same two-page document, different word. In the US and Canada, a resume is the one-to-two-page career summary used for every industry job, and a CV means the unabridged academic record used for university and research posts. The real difference is selection: a resume is edited for a specific job, an academic CV is complete by design.",
      },
      {
        question: "Is a CV the same as a resume?",
        answer:
          "Outside North America, yes — they are two words for the same document and you can use whichever one the posting used. Inside North America and inside academia anywhere, no: a CV there is a complete record of your scholarly work with no length limit, and sending one to a corporate recruiter will end the application.",
      },
      {
        question: "What does CV stand for?",
        answer:
          "Curriculum vitae, Latin for \"course of life\". The full phrase is worth knowing mainly because it explains the academic version — a document meant to record a career rather than pitch for one job. In everyday British and European use it has lost that sense entirely and just means resume.",
      },
      {
        question: "Should I send a CV or a resume to a US employer?",
        answer:
          "A resume, unless the role is academic, research or clinical faculty. If a US industry posting asks for a CV, it is using the word loosely — send one to two pages, no photo, no date of birth, tailored to the posting. Nobody has ever been rejected for sending a good resume to a request for a CV.",
      },
      {
        question: "Is a CV longer than a resume?",
        answer:
          "Only the academic one. A British or European CV is two pages, which is exactly the length of an American resume. The \"CVs are longer\" rule comes from comparing an academic CV to an industry resume and generalising from it, which is why it misleads so consistently.",
      },
      {
        question: "Can I use the same document for both?",
        answer:
          "For a British CV and a US resume, yes — take the photo and personal details off and you have converted it. For an academic CV, no. That is a genuinely different document with different content and no length limit, and the two-page version is not a shortened form of it.",
      },
    ],
    related: ["resume-format", "resume-length", "how-to-write-a-resume"],
  },
  {
    slug: "what-is-a-resume",
    title: "What a resume is, what it is for, and how to spell it",
    metaTitle: "What Is a Resume? Definition, Purpose and Spelling ({year}) | meniacv",
    description:
      "A resume is a one-to-two-page argument for why you should get one specific job — not a record of everything you have done. What belongs on one, and the three accepted spellings.",
    eyebrow: "Basics",
    updated: "2026-08-01",
    intro:
      "A resume is a one-to-two-page document that argues you should be interviewed for one particular job. That definition does more work than it looks like it does, because almost every bad resume is bad for the same reason: it was written as a record of a career rather than as an argument for a role. Everything else — length, format, what to include — follows from which of those two things you think you are writing.",
    takeaways: [
      "A resume is a one-to-two-page argument that you should be interviewed for one specific job.",
      "It selects. Something being true about your career is not, on its own, a reason for it to be on the page.",
      "Five sections do almost all the work: contact, summary, experience, education, skills.",
      "Resume, résumé and resumé are all accepted. Be consistent, and name the file with your own name.",
      "The first pass is six to ten seconds. Design for that, then for the careful second read.",
    ],
    sections: [
      {
        heading: "The definition, and why it matters",
        body: [
          "The word comes from the French résumé, meaning summary, and the etymology is the whole point. A resume summarises. It selects. Something being true about your career is not a reason for it to be on the page; the reason is that it helps a stranger decide, in under a minute, that talking to you is worth an hour of their time.",
          "That reader is not reading in the sense you mean when you say reading. The first pass is six to ten seconds and it is a scan for disqualifiers and signals: does this person do roughly this job, at roughly this level, recently, somewhere plausible. A resume is designed for that pass first and the careful second read after.",
        ],
      },
      {
        heading: "What a resume contains",
        body: [
          "There is more consensus here than the volume of advice suggests. Five sections do almost all the work, and the arguments are about ordering, not membership.",
        ],
        list: [
          "Contact details: name, email, phone, city. Not your full street address.",
          "A summary: three sentences on who you are and what you are aiming at. Optional, but strong when it is specific.",
          "Experience: reverse-chronological, most recent first, each job with bullets that end in outcomes.",
          "Education: degree, institution, year. It moves to the top only while you are a student or a recent graduate.",
          "Skills: the tools and named competencies that a reader or a parser would search for.",
        ],
      },
      {
        heading: "What a resume is not",
        body: [
          "It is not a job description. \"Responsible for managing the reporting process\" describes a role that existed; it says nothing about whether you were good at it. The version that works names what you owned and what changed: the same fact, rewritten as evidence.",
          "It is not your complete history. Ten to fifteen years of relevant experience is the working horizon, with anything older compressed to a line or dropped. A first job from 2004 that has nothing to do with what you do now is costing you space and telling the reader nothing.",
          "It is not an autobiography, and it is not a CV in the academic sense. There is no obligation to be complete, and completeness actively hurts — every irrelevant line dilutes the relevant ones.",
        ],
      },
      {
        heading: "Résumé, resume or resumé?",
        body: [
          "All three are in use and none of them will cost you a job. \"Resume\" with no accents is standard in American professional writing and is what almost every job posting uses. \"Résumé\" with both accents is the original French and is the most formally correct. \"Resumé\" with one accent is a hybrid that is common but has the least justification.",
          "Pick one and be consistent, and if you are filing the document, name the file with your own name rather than the word — \"Jordan-Alvarez-Resume.pdf\" is found again three weeks later, \"resume.pdf\" is one of forty files with that name in a recruiter's downloads folder.",
          "The pronunciation is REZ-oo-may, three syllables, which is worth knowing only because it distinguishes it in speech from the verb resume, meaning to continue. They are the same letters and unrelated words.",
        ],
      },
      {
        heading: "How long, and in what format",
        body: [
          "One page up to roughly ten years of experience, two pages after that, and a third page essentially never outside academia. Two pages is not a failure — a senior engineer or a nurse with fifteen years of clinical history compressed onto one page has deleted the evidence, not tightened the writing.",
          "Send a PDF unless the posting asks for something else, because a PDF is the only format that reaches the reader looking the way you left it. The one thing that matters technically is that the text is real text rather than an image of text, which is true of any PDF exported from a real editor and false of a scan or a screenshot.",
        ],
      },
    ],
    compare: {
      heading: "Résumé, resume or resumé",
      columns: ["Spelling", "Where it is used", "Verdict"],
      rows: [
        [
          "Resume",
          "Standard in American professional writing, and in nearly every job posting",
          "The safe default. Use it unless you have a reason not to",
        ],
        [
          "Résumé",
          "The original French, common in formal and academic writing",
          "The most formally correct, and never wrong",
        ],
        [
          "Resumé",
          "A hybrid, widely seen and rarely defended",
          "Accepted, with the least justification of the three",
        ],
      ],
    },
    checklist: {
      heading: "Does yours meet the definition?",
      items: [
        "A stranger can name your job, level and field after ten seconds",
        "Every line is there because it helps this application, not because it is true",
        "Contact details are name, email, phone and city — no street address",
        "Experience is reverse-chronological with outcomes attached",
        "Education sits below experience unless you are a student",
        "Skills are specific and checkable rather than adjectives",
        "It is one page, or two with a second page that carries substance",
        "The file is a real-text PDF named with your own name",
      ],
    },
    templates: {
      heading: "What a resume looks like",
      blurb:
        "Every one of these is the five sections above, laid out. Nothing exotic and nothing to get wrong — pick one, and the shape of the document is decided.",
      category: "simple",
    },
    faqs: [
      {
        question: "What is a resume?",
        answer:
          "A one-to-two-page document arguing that you should be interviewed for one specific job. It summarises your work history, education and skills, selected for relevance to that role rather than recorded in full. The word is French for summary, and the selection is the point.",
      },
      {
        question: "How do you spell resume?",
        answer:
          "All three of resume, résumé and resumé are accepted. \"Resume\" without accents is standard in American professional usage and appears in nearly every job posting; \"résumé\" with both accents is the original French form and the most formally correct. Consistency within your own document matters more than the choice.",
      },
      {
        question: "What should a resume include?",
        answer:
          "Contact details, an optional summary, your work experience in reverse-chronological order, education, and skills. Certifications get their own section where they are licensing requirements. Everything else — hobbies, references, photographs, an objective statement — is optional at best and usually worth the space it frees up.",
      },
      {
        question: "How long should a resume be?",
        answer:
          "One page under about ten years of experience, two pages beyond it. The exceptions that legitimately run longer are academic CVs, federal applications in the US, and clinical nursing roles where licences and rotations have to be listed. A third page in a normal industry application is almost always padding.",
      },
      {
        question: "What is the difference between a resume and a CV?",
        answer:
          "In the UK and most of the Commonwealth, none — CV is simply the local word. In the US and in academia everywhere, a CV is an unabridged scholarly record with no length limit, while a resume is the selective two-page document used for industry jobs.",
      },
    ],
    related: ["what-to-put-on-a-resume", "cv-vs-resume", "how-to-write-a-resume"],
  },
  {
    slug: "what-to-put-on-a-resume",
    title: "What to put on a resume — and what to take off",
    metaTitle: "What to Put on a Resume: Every Section, Ranked ({year}) | meniacv",
    description:
      "The five sections that do the work, the four that are situational, and the seven things still appearing on resumes that stopped helping years ago.",
    eyebrow: "Basics",
    updated: "2026-08-01",
    intro:
      "Most resumes are not missing anything. They are carrying things that stopped earning their space — an objective statement written in 1998 phrasing, a references line, a skills list padded with \"hard-working\", a job from three careers ago. The useful version of this question is not what to add. It is what each line is doing for a reader who has six seconds, and what to cut when the answer is nothing.",
    takeaways: [
      "Five sections always belong: contact, summary, experience, education, skills.",
      "Four are situational: certifications, projects, publications and languages.",
      "Take off the references line, the objective, your street address, skill bars and unsupported adjectives.",
      "The test for anything uncertain: what would a hiring manager do differently having read it?",
      "Space is not free. A line is charged against the attention available for the line under it.",
    ],
    sections: [
      {
        heading: "The five that always belong",
        body: [
          "These are not negotiable, and in this order for most people.",
        ],
        list: [
          "Name and contact details: name, email, phone, city and country. A LinkedIn URL if the profile is current. A portfolio or GitHub if the work is relevant.",
          "Summary: three sentences naming what you do, at what level, and what you are aiming at. Cut it if it would only restate your job title.",
          "Experience: every relevant role, reverse-chronological, with title, employer, location and dates. Three to five bullets on recent roles, one or two on older ones.",
          "Education: degree, institution, graduation year. Below experience unless you graduated within about two years.",
          "Skills: the specific tools, systems and named competencies for this field. Twelve to twenty, grouped, no ratings.",
        ],
      },
      {
        heading: "The four that depend on your field",
        body: [
          "Certifications deserve their own section when they are a licensing requirement — nursing, accounting, security, project management, trades. Buried inside education, an active RN licence or a CPA is doing a fraction of the work it should.",
          "Projects earn a section when your employment history does not yet demonstrate what you can do: students, career changers, and engineers whose best work is public. A project entry needs the same structure as a job — what you built, what you used, what happened.",
          "Publications, speaking and patents belong on academic, research and senior technical resumes and nowhere else. Volunteering belongs when it shows leadership, when it fills a gap, or when the employer is a nonprofit.",
          "Languages are worth listing when the role is customer-facing, international, or advertised in a country where you would be working in a second language. State a real level — \"conversational\", \"professional working\", \"native\" — rather than a bar chart.",
        ],
      },
      {
        heading: "What to take off",
        body: [
          "Each of these was standard once. None of them helps now, and several actively cost you.",
        ],
        list: [
          "\"References available on request\" — universally assumed, and the line spends a whole row saying nothing.",
          "An objective statement describing what you want from an employer. Replace it with a summary describing what you bring, or delete it.",
          "Your full street address. City and country is what anyone needs; the rest is an identity-theft surface on a document you email to strangers.",
          "Date of birth, marital status, nationality and a photo — on a US, UK, Canadian or Australian application. All four are normal in much of continental Europe.",
          "Skill rating bars. A five-dot meter next to \"Python\" is a self-assessment against an undefined scale, and no reader can act on it.",
          "Soft-skill adjectives with nothing behind them: hard-working, detail-oriented, team player, results-driven. Everyone claims them, so they carry no information.",
          "Jobs from more than fifteen years ago with no bearing on this one, and your high school once you have a degree.",
          "Anything untrue, including a degree \"in progress\" that stalled and a job title you gave yourself. This is the one item on the list that ends careers rather than applications.",
        ],
      },
      {
        heading: "The test for anything you are unsure about",
        body: [
          "Ask what a hiring manager would do differently having read it. If the honest answer is nothing, it is decoration. Hobbies usually fail this test — but \"volunteer wildfire responder, 6 seasons\" passes it easily, because it tells someone you can be relied on under pressure and almost nobody else on the shortlist has it.",
          "The second test is the space test. Everything on the page competes with everything else for the same six seconds. A line is not free because there is room for it; it is charged against the attention available for the line under it. That is why cutting is usually a bigger improvement than adding, and why the strongest resumes tend to be the ones that had the most taken out.",
        ],
      },
    ],
    compare: {
      heading: "What earns its space",
      columns: ["Section", "Include when", "Leave off when"],
      rows: [
        [
          "Summary",
          "It says something the chronology cannot",
          "It would only restate your job title and years",
        ],
        [
          "Certifications",
          "Your field licenses the work, or the posting names one",
          "They are course completions with no assessment behind them",
        ],
        [
          "Projects",
          "Your jobs do not yet demonstrate what you can do",
          "Your employment history already makes the case",
        ],
        [
          "Languages",
          "The role is customer-facing or international",
          "You would be embarrassed to be tested at the level implied",
        ],
        [
          "Volunteering",
          "It shows leadership, fills a gap, or the employer is a nonprofit",
          "It is a single afternoon three years ago",
        ],
        [
          "Hobbies",
          "One of them is demanding, sustained or genuinely unusual",
          "It is \"reading, travelling and socialising\"",
        ],
      ],
    },
    checklist: {
      heading: "Section by section",
      items: [
        "Contact: name, email, phone, city — plus LinkedIn if the profile is current",
        "Summary: three sentences, or nothing at all",
        "Experience: title, employer, location, dates, and outcome-led bullets",
        "Education: below experience unless you graduated within about two years",
        "Skills: twelve to twenty, grouped, no ratings",
        "Certifications: their own section where your field licenses them",
        "Projects: only where your employment history does not yet show what you can do",
        "Nothing untrue anywhere, including a degree described as finished",
      ],
    },
    templates: {
      heading: "Templates with the right sections",
      blurb:
        "Every layout here carries the five that always belong and makes room for the situational ones without inventing sections nobody reads. No skill meters, no infographic panels.",
      category: "simple",
    },
    faqs: [
      {
        question: "What should you put on a resume?",
        answer:
          "Contact details, a short summary, your work experience with outcome-led bullets, education, and a skills section. Add certifications if your field licenses them, and projects if your employment history does not yet show what you can do. Everything else is situational.",
      },
      {
        question: "What should you not put on a resume?",
        answer:
          "\"References available on request\", your full street address, skill rating bars, unsupported adjectives like hard-working or detail-oriented, an objective statement about what you want, and — in the US, UK, Canada and Australia — a photo, date of birth or marital status. Also anything untrue, which is the only item here that can end a career rather than an application.",
      },
      {
        question: "Should I put my address on my resume?",
        answer:
          "City and country only. Employers need to know whether you are local or would need to relocate, which a city answers. A full street address on a document you email to dozens of strangers is a privacy exposure that buys you nothing.",
      },
      {
        question: "Should I include hobbies on a resume?",
        answer:
          "Only when a specific one earns its line — something demanding, sustained, or genuinely unusual that says something a job description cannot. \"Reading, travelling, socialising\" describes everybody. Six seasons as a volunteer firefighter describes one person.",
      },
      {
        question: "Do I need an objective on my resume?",
        answer:
          "No. Objective statements describe what you want from the employer, which nobody screening applications is reading for. A summary that names what you do and what you are aiming at does the same job in the same space and is written from the reader's side.",
      },
    ],
    related: ["what-is-a-resume", "resume-mistakes", "resume-summary-examples"],
  },
  {
    slug: "what-a-good-resume-looks-like",
    title: "What a good resume actually looks like",
    metaTitle: "What Does a Good Resume Look Like? ({year}) | meniacv",
    description:
      "The visual and structural qualities every strong resume shares, what changed in the last few years, and how to check yours in the ten seconds a recruiter gives it.",
    eyebrow: "Formatting",
    updated: "2026-08-01",
    intro:
      "Asked what a good resume looks like, most people picture a layout. The layout is the smallest part of it. A good resume is one where a stranger can work out what you do, at what level, and whether you are worth an hour, in the time it takes to read a paragraph — and almost everything that achieves that is structural rather than decorative.",
    takeaways: [
      "One clear hierarchy, three type sizes, and reverse-chronological experience.",
      "Bullets that end in a result — three or four across the page changes how the whole thing reads.",
      "White space that survives a printer: margins at half an inch or more, line height above 1.15.",
      "The failure mode is density, not ugliness. If it does not fit at eleven point, cut content.",
      "Almost nothing has changed in fifteen years except competition, which pushes towards specificity.",
    ],
    sections: [
      {
        heading: "The ten-second test",
        body: [
          "Put your resume on a screen, look away, look back for a count of ten, and look away again. Write down what you retained. If it is not your current title, your seniority, your field and one thing you achieved, the page has failed the only test it routinely faces.",
          "This is not a metaphor for how recruiters read. It is close to literally how the first pass works when there are two hundred applications and an afternoon. Everything that survives that pass earns a second, slower read; nothing else is ever read at all.",
        ],
      },
      {
        heading: "What the good ones have in common",
        body: [
          "Set beside each other, strong resumes across every industry share the same small set of properties, and none of them is a design choice.",
        ],
        list: [
          "A single clear hierarchy: name largest, section headings next, job titles above employers, body text uniform. Three type sizes, not seven.",
          "Reverse-chronological experience, so the reader's eye lands on now rather than on 2016.",
          "Bullets that end in a result. Not every one — three or four across the page is enough to change how the whole thing reads.",
          "Numbers where numbers exist, and honest approximations where they do not. \"About 40 hours a month\" beats no figure and beats an invented one.",
          "White space that survives contact with a printer. Margins no tighter than half an inch, line height above 1.15.",
          "One page under a decade of experience, two after. Never a third that exists to hold a 2007 job.",
          "Consistency in the small things: date formats, tense, punctuation at the end of bullets. Inconsistency reads as carelessness before the reader can articulate why.",
        ],
      },
      {
        heading: "What has actually changed",
        body: [
          "Less than the advice industry implies. The objective statement died and was replaced by the summary. The references line disappeared. Full street addresses came off. Skills sections got more specific and stopped being lists of adjectives. Applicant tracking systems made single-column layouts the safe default. That is roughly the complete list of changes over fifteen years.",
          "What did not change: reverse-chronological order, one to two pages, outcomes over responsibilities, PDF as the delivery format. Anyone telling you the fundamentals have been overturned by AI screening is selling something. Parsers made the format more conservative, not less.",
          "The one genuinely new pressure is volume. AI has made it trivial to apply to two hundred jobs, so employers receive far more applications per opening than they used to and the first pass is faster and harsher than it was. That pushes in the direction of specificity: a resume visibly written for this posting stands out in a stack where most were written for none.",
        ],
      },
      {
        heading: "How it should look on the page",
        body: [
          "One column unless you have a reason. Ten to twelve point body text in a normal typeface. Section headings that are obviously headings without being decorative. An accent colour is fine — one, used on headings or a rule, not four. A photo only if you are applying somewhere that expects one, which in the US, UK, Canada and Australia means no.",
          "The failure mode is not ugliness, it is density. A page shrunk to nine-point type with quarter-inch margins to fit everything is harder to read than any font choice could make it, and the fix is cutting content rather than compressing it. If it does not fit at eleven point with real margins, you have too much on it.",
        ],
      },
    ],
    checklist: {
      heading: "The ten-second test",
      items: [
        "Look away, look back for ten seconds, look away — write down what you retained",
        "Your current title, seniority and field were among it",
        "So was one thing you achieved",
        "Three type sizes on the page, not seven",
        "One accent colour, used on headings or a rule — not four",
        "Body text at eleven point with margins of at least half an inch",
        "Nothing decorative competing with the evidence for the same seconds",
        "It is visibly written for the posting you are sending it to",
      ],
    },
    templates: {
      heading: "Templates that pass the ten-second test",
      blurb:
        "Clear hierarchy, generous line height, restrained accent, and nothing on the page that a reader has to look past. These are the layouts where the writing is what gets read.",
      category: "modern",
      count: 9,
    },
    faqs: [
      {
        question: "What does a good resume look like?",
        answer:
          "One column, clear hierarchy, reverse-chronological experience, three or four bullets per recent role with results attached, and enough white space to read comfortably at eleven point. A stranger should be able to name your job, your level and one thing you achieved after ten seconds with it.",
      },
      {
        question: "How should a resume look in 2026?",
        answer:
          "Much as it did in 2016, with four changes: no objective statement, no references line, no full street address, and a single-column layout as the safe default because of applicant tracking systems. What has genuinely shifted is competition — employers receive far more applications per opening, so a resume visibly written for the specific posting matters more than it used to.",
      },
      {
        question: "Should a resume be one page or two?",
        answer:
          "One under roughly ten years of experience, two beyond it. Two pages is not a penalty for senior candidates — compressing fifteen years onto one page deletes evidence rather than tightening writing. Three pages is only normal in academia, US federal applications and some clinical roles.",
      },
      {
        question: "Does a resume need to look designed?",
        answer:
          "No, and in most fields a heavily designed one works against you. Design is worth something in visual roles, where the page doubles as a work sample. Everywhere else the reader is looking past the layout for evidence, and ornament is competing with that evidence for the same few seconds.",
      },
    ],
    related: ["resume-format", "resume-fonts", "resume-mistakes"],
  },
  {
    slug: "resume-skills",
    title: "Skills on a resume: what to list, and what listing proves",
    metaTitle: "Skills for a Resume — What to Put and What to Cut ({year}) | meniacv",
    description:
      "How to choose the skills worth listing, why the list itself proves nothing, and where the proof actually goes. With examples by field and the words to stop using.",
    eyebrow: "Skills",
    updated: "2026-08-01",
    intro:
      "The skills section is the most over-worked and least persuasive part of most resumes. It gets rewritten endlessly because it looks like the part where you sell yourself, and it persuades nobody, because a list is a claim and claims are free. Understanding what the section is actually for — and it does have a real job — changes both what goes in it and how much time it deserves.",
    takeaways: [
      "The skills section is an index, not an argument. A list is a claim, and claims are free.",
      "The persuasion happens in your experience bullets — choose skills you can point at elsewhere.",
      "Start from the posting in front of you, not from a list of top skills on the internet.",
      "Twelve to twenty entries for most professional roles, grouped once you pass about ten.",
      "Cut hard-working, detail-oriented, team player and results-driven. Everyone claims them.",
    ],
    sections: [
      {
        heading: "What the skills section is for",
        body: [
          "It is an index, not an argument. Its job is to make the terms a reader or a parser is looking for findable in one place, and to state the tools of your trade in the vocabulary your field uses. That is genuinely useful and worth doing well. What it cannot do is convince anyone you have the skill, because you wrote it yourself and so did every other applicant.",
          "The persuasion happens in your experience bullets. \"Python\" in a list is a claim; \"Rewrote the nightly reconciliation job in Python, cutting a four-hour batch to eleven minutes\" is evidence. A reader who wants to know whether you can really do it goes looking for the second thing. This is the single most useful idea about resume skills, and it reframes the whole section: choose skills you can point at somewhere else on the page, and the list stops being decorative.",
        ],
      },
      {
        heading: "How to choose which ones",
        body: [
          "Take the job posting. Write down every tool, system, method and named competency it mentions. Cross off the ones you cannot honestly claim. What survives is your skills section, in roughly the order the posting emphasised them, and you have just done most of the keyword work that applicant tracking systems reward — without stuffing anything.",
          "Then add the things that are true and specific to you but the posting did not think to ask for, up to a total of about twelve to twenty. Below twelve looks thin for most professional roles; above twenty-five nobody reads it and the strong entries get diluted by the weak ones.",
          "Group them if you have more than about ten. Three or four labelled groups — Languages, Frameworks, Tools, Domain — are read; a run-on line of twenty-two comma-separated items is skimmed and forgotten.",
        ],
        list: [
          "Start from the posting, not from a list of \"top skills\" on the internet.",
          "Every skill listed should be defensible in an interview at the depth you implied.",
          "Twelve to twenty entries, grouped, for most professional roles.",
          "Name versions and specifics where they matter: \"Excel — Power Query, pivot tables\" not \"Microsoft Office\".",
          "Anything you would be embarrassed to be tested on comes off.",
        ],
      },
      {
        heading: "The words that are costing you space",
        body: [
          "Hard-working. Detail-oriented. Team player. Results-driven. Self-starter. Excellent communication skills. Passionate. Problem solver. Every one of these appears on a majority of resumes, which means none of them distinguishes a single applicant from any other, which means they carry no information at all.",
          "They are not wrong about you. They are simply unfalsifiable and universally claimed, and a reader has learned to skip them. The information they were trying to convey belongs in an experience bullet where it can be demonstrated: \"detail-oriented\" is worth nothing, and \"caught a reconciliation error that had been mispricing 3,000 orders a month\" is worth an interview.",
          "\"Microsoft Office\" belongs in the same category for most professional roles now. It has been assumed for fifteen years, and listing it reads as padding. The exception is a genuinely deep spreadsheet skill, which should be named as what it is.",
        ],
      },
      {
        heading: "What to list, by field",
        body: [
          "The pattern that works is the same everywhere — name the systems, not the qualities — but what counts as a system differs.",
        ],
        list: [
          "Software: languages, frameworks, databases, cloud platforms, CI tooling, testing approaches. Versions where they matter.",
          "Nursing and clinical: licences, EMR systems by name (Epic, Cerner), specialisations, certifications, patient populations, ratios handled.",
          "Customer service: the platforms (Zendesk, Salesforce Service Cloud), channels handled, languages spoken, volume, escalation and QA experience.",
          "Finance and accounting: ERP and reporting systems by name, regulatory frameworks, close cycles, modelling depth, the specific reconciliations you own.",
          "Marketing: channels, analytics and automation platforms by name, budget scale, the metrics you were accountable for.",
          "Administrative: calendaring and travel systems, expense platforms, the volume of people supported, event and vendor management.",
          "Trades and operations: certifications and licences, equipment operated, safety standards, compliance regimes.",
        ],
      },
      {
        heading: "Where the section goes",
        body: [
          "Below experience for anyone with a career, above it for students, career changers and anyone whose recent job titles do not describe the job they are applying for. The logic is simple: put whatever makes the strongest case first, and for most people that is what they have done rather than what they can do.",
          "One layout warning. If your template puts skills in a sidebar, run the copy-paste check on the exported PDF — a two-column layout can extract text across both columns, which drops your skills list into the middle of a job description. It is the one formatting decision that can quietly break an application.",
        ],
      },
    ],
    compare: {
      heading: "What belongs where",
      columns: ["", "Goes in the skills list", "Goes in a bullet"],
      rows: [
        [
          "Why",
          "It is checkable, and a reader or a parser can search for it",
          "It needs evidence before anyone believes it",
        ],
        [
          "Examples",
          "Python, Epic, Salesforce, CPA, Spanish (C1), GAAP, Kubernetes",
          "Leadership, communication, prioritisation, conflict resolution",
        ],
        [
          "Test",
          "Could someone verify it in an interview?",
          "Could you give an example in five seconds?",
        ],
        [
          "Written as",
          "A named term, with the version or specialism where it matters",
          "A verb, a scale and an outcome",
        ],
        [
          "Failure mode",
          "Listing something you touched once in a bootcamp",
          "Naming the abstract quality instead of the incident",
        ],
      ],
    },
    checklist: {
      heading: "Auditing your skills section",
      items: [
        "Every skill listed also appears somewhere in your experience section doing something",
        "The terms came from the job posting, not from a generic list",
        "Twelve to twenty entries, grouped into three or four labelled categories",
        "Named specifically — \"Excel: Power Query, pivot tables\", not \"Microsoft Office\"",
        "No ratings, meters, stars or percentages",
        "Nothing on the list you would be embarrassed to be tested on",
        "Below experience if your work history makes the case; above it if it does not",
        "The copy-paste check confirms it did not interleave into a job description",
      ],
    },
    templates: {
      heading: "Templates with a skills section that parses",
      blurb:
        "Single-column layouts where the skills block stays where you put it. The sidebar versions look excellent and can extract across both columns — which drops your skills into the middle of a job description.",
      category: "one-column",
    },
    faqs: [
      {
        question: "What skills should I put on my resume?",
        answer:
          "The ones the job posting names that you can honestly claim, plus the specific tools and systems of your trade — twelve to twenty in total, grouped if there are more than about ten. Start from the posting rather than from a generic list, because the terms that matter are the ones that role uses.",
      },
      {
        question: "What are the best skills to put on a resume?",
        answer:
          "There is no universal list, and the ones circulated as universal — communication, leadership, problem solving — are the least useful because everyone claims them. The best skills on your resume are the specific, named, checkable ones that also appear somewhere in your experience section doing something.",
      },
      {
        question: "How many skills should a resume have?",
        answer:
          "Twelve to twenty for most professional roles. Fewer than about eight reads as thin unless your field is genuinely narrow; more than twenty-five stops being read and dilutes the strong entries with filler.",
      },
      {
        question: "Should I rate my skills out of five?",
        answer:
          "No. A rating is a self-assessment against a scale nobody has defined, so it tells a reader nothing they can act on, and \"Python — 3/5\" invites a question you would rather not answer. If depth matters, show it in a bullet describing what you built.",
      },
      {
        question: "Where should the skills section go on a resume?",
        answer:
          "Below experience if your work history makes the case for you, above it if it does not — students, career changers, and anyone whose recent titles do not match the target role. Skills-first is a deliberate choice to lead with capability when chronology would mislead.",
      },
      {
        question: "Do skills sections help with ATS?",
        answer:
          "Yes, as an index. Applicant tracking systems match your document against the posting, and a grouped skills section puts the relevant terms in one findable place. What it will not do is rescue a resume whose experience section never demonstrates any of them — matching is only the first filter, and a person reads what survives it.",
      },
    ],
    related: ["hard-skills-vs-soft-skills", "technical-skills-resume", "ats-resume-keywords"],
  },
  {
    slug: "hard-skills-vs-soft-skills",
    title: "Hard skills and soft skills: which to list and which to prove",
    metaTitle: "Hard Skills vs Soft Skills on a Resume ({year}) | meniacv",
    description:
      "Hard skills belong in a list, soft skills do not. Why the distinction decides where each one goes on your resume, with the phrasing that makes a soft skill credible.",
    eyebrow: "Skills",
    updated: "2026-08-01",
    intro:
      "The distinction is usually taught as a taxonomy — hard skills are technical, soft skills are interpersonal — and then nobody says what to do with it. The useful version is a rule about placement. Hard skills can be listed, because they are checkable. Soft skills cannot, because everyone claims them and nobody can verify a claim. That single asymmetry decides where each belongs on the page.",
    takeaways: [
      "Hard skills have a right answer — a language, a licence, a system. They can be listed.",
      "Soft skills are judgements about how you work. Everyone claims them, so a list of them proves nothing.",
      "The rule: list the hard ones, demonstrate the soft ones in your experience bullets.",
      "In roles that are mostly soft skills, this matters more rather than less.",
      "The check: could you give an example in five seconds? If not, it is not evidence.",
    ],
    sections: [
      {
        heading: "The distinction that matters",
        body: [
          "A hard skill is something with a right answer. You can write SQL or you cannot; you hold an active RN licence or you do not; you have closed a set of books under IFRS or you have not. Because it is checkable, listing it is meaningful — a reader can confirm it in an interview, and a parser can match it against a posting.",
          "A soft skill is a judgement about how you work: communication, leadership, adaptability, conflict resolution. Nobody self-assesses these accurately, everybody claims them, and no reader has ever changed their mind about a candidate because the word \"collaborative\" appeared in a list. That is not because soft skills are unimportant. They are frequently the thing that actually decides the hire. It is because a list is the wrong instrument for them.",
        ],
      },
      {
        heading: "The rule: list the hard, demonstrate the soft",
        body: [
          "Hard skills go in the skills section, named specifically, grouped. Soft skills come out of the skills section entirely and go into your experience bullets, where they turn into events.",
          "\"Excellent communication skills\" is worth nothing. \"Wrote the runbook the on-call rotation still uses, cutting escalations to the team by about half\" is communication, demonstrated, and it also happens to be a better bullet. \"Leadership\" is worth nothing; \"Took over a team of six mid-project after the lead left and shipped on the original date\" is leadership, and no reader needs the abstract noun once they have the sentence.",
          "This is why deleting your soft-skill list usually improves a resume twice over — it frees a line, and it forces the evidence into the section where evidence belongs.",
        ],
      },
      {
        heading: "Where each one lives",
        body: [
          "Concrete placement, since the abstract rule is easy to nod at and hard to apply.",
        ],
        list: [
          "Hard skills — skills section: programming languages, software by name, machinery, licences, certifications, methodologies, languages spoken with a stated level, regulatory frameworks.",
          "Soft skills — experience bullets: leadership, mentoring, communication, negotiation, conflict resolution, prioritisation under pressure, stakeholder management.",
          "Borderline cases — either, if named specifically: \"technical writing\" is a hard skill; \"writing\" is not. \"Incident command\" is a hard skill; \"stays calm under pressure\" is not. \"Stakeholder management across four business units\" reads as concrete; \"stakeholder management\" alone does not.",
        ],
      },
      {
        heading: "When soft skills are the job",
        body: [
          "Some roles are mostly soft skills: management, sales, teaching, therapy, customer service, HR. The rule does not change — it gets more important, because in those fields everybody's skills list says the same six words and the résumés that stand out are the ones with incidents in them.",
          "For a customer service role, the bullet that wins is not \"strong de-escalation skills\". It is \"Handled the escalation queue for a 2m-user product, resolving about 40 cases a week with a 94% satisfaction score\". Same claim, made in a form that can be interrogated. If a hiring manager cannot ask a follow-up question about it, it was not evidence.",
        ],
      },
      {
        heading: "The interview check",
        body: [
          "Run this over every skill on your page: what would you say if someone asked \"can you give me an example?\" If a real answer comes to mind in five seconds, the skill is defensible and it should stay. If what comes to mind is a rephrasing of the skill itself, it is not evidence and it is taking up a line.",
          "That check catches the two failures that matter — soft skills with nothing behind them, and hard skills you listed because they were on the posting rather than because you have used them. The second is worse. A skills list that overstates gets you into an interview you then fail on the first technical question.",
        ],
      },
    ],
    compare: {
      heading: "Hard and soft, side by side",
      columns: ["", "Hard skills", "Soft skills"],
      rows: [
        [
          "What they are",
          "Specific, checkable capabilities with a right answer",
          "Judgements about how you work with people and pressure",
        ],
        [
          "Where they go",
          "The skills section, named and grouped",
          "Experience bullets, as things that happened",
        ],
        [
          "Examples",
          "SQL, Epic, CPA licence, AutoCAD, IFRS, Spanish (C1)",
          "Leadership, communication, negotiation, prioritisation",
        ],
        [
          "Why the split",
          "A reader can verify them in an interview",
          "Everyone claims them, so the claim carries no information",
        ],
        [
          "Done badly",
          "Listing a language you used once for an assignment",
          "\"Excellent communication skills\" as a line in a list",
        ],
        [
          "Done well",
          "\"PostgreSQL — query optimisation on 200m-row tables\"",
          "\"Wrote the runbook the on-call rotation still uses, halving escalations\"",
        ],
      ],
    },
    checklist: {
      heading: "Sorting your own list",
      items: [
        "Every entry in the skills section is checkable by someone else",
        "No abstract qualities sitting in the list — communication, leadership, adaptability",
        "Each soft skill you care about appears as an incident in a job bullet",
        "Borderline items are named specifically: \"technical writing\", not \"writing\"",
        "Nothing was listed because it appeared on the posting rather than in your career",
        "Every hard skill would survive a first technical screen",
        "The soft-skill bullets have a number, a scale or a consequence in them",
      ],
    },
    templates: {
      heading: "Templates that separate the two properly",
      blurb:
        "A clean skills block for the hard ones, and roomy bullets for the soft ones to be demonstrated in. These layouts give both what they need without a skills chart in sight.",
      category: "simple",
    },
    faqs: [
      {
        question: "What is the difference between hard skills and soft skills?",
        answer:
          "Hard skills are checkable and specific — a language, a system, a licence, a method. Soft skills are judgements about how you work, like communication or leadership. The practical consequence is placement: hard skills can be listed because a reader can verify them, and soft skills should be demonstrated in your experience bullets because a list of them proves nothing.",
      },
      {
        question: "Should I list soft skills on my resume?",
        answer:
          "Not as a list. Every candidate claims the same handful and no reader is persuaded by the words themselves. Convert each one into the incident that demonstrates it and put it in the relevant job — the claim becomes checkable and the bullet gets stronger at the same time.",
      },
      {
        question: "What are examples of hard skills?",
        answer:
          "Programming languages, SQL, financial modelling, named software (Epic, Salesforce, SAP, AutoCAD), machinery operation, a nursing or CPA licence, a second language at a stated level, regulatory frameworks like GAAP or GDPR, and specific methods like A/B testing or root cause analysis.",
      },
      {
        question: "Are soft skills important to employers?",
        answer:
          "Frequently they are the deciding factor, especially in management, sales, teaching and support roles. That is an argument for evidencing them properly rather than for listing them — the more a hire turns on soft skills, the more carefully hiring managers discount unsupported claims about them.",
      },
    ],
    related: ["resume-skills", "resume-bullet-points", "technical-skills-resume"],
  },
  {
    slug: "technical-skills-resume",
    title: "Technical and computer skills on a resume",
    metaTitle: "Technical & Computer Skills for a Resume ({year}) | meniacv",
    description:
      "How to list computer and technical skills so they mean something: naming specifics instead of suites, stating depth without ratings, and what to leave off entirely.",
    eyebrow: "Skills",
    updated: "2026-08-01",
    intro:
      "Technical skills are the part of the skills section that can genuinely differentiate you, and the part most often written in a way that cannot. \"Microsoft Office, good computer skills, familiar with databases\" is three lines that survive no scrutiny. The fix is not more items. It is naming the specific thing, at the specific depth, that a person doing the job would recognise.",
    takeaways: [
      "Name the system, not the category. \"Microsoft Office\" has been assumed for fifteen years.",
      "State depth by grouping into tiers, never with a rating bar on an undefined scale.",
      "Let the experience section carry the proof — depth demonstrated beats depth asserted.",
      "In non-technical roles, naming the specific platforms is the cheapest differentiation available.",
      "Leave off anything universal, anything obsolete, and anything you could not survive ten minutes on.",
    ],
    sections: [
      {
        heading: "Name the system, not the category",
        body: [
          "\"Microsoft Office\" has been assumed for fifteen years and listing it now reads as padding. \"Excel — Power Query, pivot tables, index-match, VBA macros for the monthly close\" describes a person who can do something. Same underlying skill, different amount of information.",
          "This generalises. \"Databases\" says nothing; \"PostgreSQL, query optimisation, partitioning on 200m-row tables\" says a great deal. \"CRM experience\" says nothing; \"Salesforce — custom objects, flow automation, admin certified\" says what you would actually be doing. The rule is to write the term someone hiring for the role would search for, which is almost always the product name and the specific capability, not the category above it.",
          "The category is only right when the category is the skill — \"cloud infrastructure\" is a real competency when it is followed by which clouds and what you ran on them.",
        ],
      },
      {
        heading: "Stating depth without a rating bar",
        body: [
          "The reason people reach for five-dot meters is a real problem: \"Python\" flattens the difference between a semester of coursework and eight years of production work. The meter is the wrong solution, because the scale is undefined and self-assigned. Two things work better.",
          "Group by depth. A skills section split into \"Daily\" and \"Working knowledge\" — or \"Core\" and \"Familiar\" — conveys the same gradient in words the reader can interpret, and it is honest about where the boundary is.",
          "Or let the experience section do it. If Python appears in two job bullets doing real work, no reader needs a rating; if it appears only in the list, they will assume the coursework level, which is usually correct. Depth demonstrated is always more credible than depth asserted.",
        ],
        list: [
          "Group into two or three tiers rather than rating each item.",
          "State versions and scale where they change the meaning: \"React 18\", \"Kubernetes across 40 services\".",
          "Put the skills you would want to be interviewed on first — order is read as priority.",
          "If a skill appears nowhere in your experience, expect to be asked why.",
        ],
      },
      {
        heading: "What to leave off",
        body: [
          "Anything universal, anything obsolete, and anything you could not survive ten minutes of questioning on.",
        ],
        list: [
          "\"Microsoft Office\", \"email\", \"internet research\", \"typing\" — assumed, and listing them signals a thin section rather than a broad one.",
          "Technologies you touched once in a bootcamp exercise. The interview will find them.",
          "Long-dead versions, unless the job is maintaining them — in which case say so, because COBOL and AS/400 experience is valuable precisely where it is wanted.",
          "Rating bars, star ratings and percentage meters, for the reasons above.",
          "Certifications inside the skills list. Those are credentials and they earn their own section, with issuer and date.",
        ],
      },
      {
        heading: "Non-technical roles with technical requirements",
        body: [
          "This is where naming specifics pays best, because the competition is not doing it. An administrative role that lists \"Concur, Coupa, Workday, Navan, Google Workspace admin\" beats one that lists \"proficient with computers\" by a wide margin, and both people may be equally capable — one of them just made it checkable.",
          "The same applies to nursing (\"Epic, Cerner, Meditech\"), teaching (\"Canvas, PowerSchool, Google Classroom\"), warehouse work (\"SAP EWM, RF scanners, Manhattan WMS\") and finance (\"NetSuite, Blackline, Hyperion\"). Every field has a small set of systems the job actually runs on. Those names are the highest-value words in your skills section, and they are the ones a search over a database of applicants is most likely to be run against.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Analyst",
        before:
          "Microsoft Office, good computer skills, familiar with databases",
        after:
          "Excel — Power Query, pivot tables, index-match, VBA macros for the monthly close. PostgreSQL — query optimisation on 200m-row tables. Power BI, dbt",
      },
      {
        label: "Administrative",
        before: "Proficient with computers and office software",
        after:
          "Microsoft 365, Google Workspace admin, Concur, Coupa, Navan, Workday, Asana, DocuSign",
        note:
          "Both describe the same person. Only one of them contains terms a recruiter would search a candidate database for.",
      },
      {
        label: "Stating depth",
        before: "Python ●●●○○   JavaScript ●●●●○   SQL ●●●●●",
        after:
          "Core: Python, SQL, Go. Working knowledge: TypeScript, Terraform, Kotlin",
        note:
          "The meter uses a scale nobody has defined and invites a question you cannot win. Two named tiers say the same thing in words a reader can interpret.",
      },
    ],
    checklist: {
      heading: "Rewriting your technical list",
      items: [
        "Every entry is a product or a capability, not a category above it",
        "Versions and scale stated where they change the meaning",
        "Grouped into two or three tiers rather than rated individually",
        "The skills you most want to be interviewed on come first",
        "No \"Microsoft Office\", \"email\" or \"internet research\"",
        "Certifications moved out into their own section with issuer and date",
        "Anything from a single bootcamp exercise has been removed",
        "The systems your target employer actually runs are named explicitly",
      ],
    },
    templates: {
      heading: "Templates for a dense technical list",
      blurb:
        "A grouped stack takes room. These compact layouts hold twenty named systems plus a full history at a readable size, which is the alternative to shrinking the type to make it fit.",
      category: "compact",
    },
    faqs: [
      {
        question: "What are computer skills for a resume?",
        answer:
          "The specific software and systems you can operate, named individually — Excel with the functions you actually use, the CRM or ERP by product name, the design or clinical or scheduling tools your field runs on. \"Microsoft Office\" and \"good computer skills\" are assumed and add nothing.",
      },
      {
        question: "Should technical skills go first on a resume?",
        answer:
          "Yes, when they are what the role is hiring for and your recent job titles do not already say it — engineers, analysts, technicians, and career changers all benefit from a skills block above experience. If your titles already establish the technical level, put experience first and let the section index the details.",
      },
      {
        question: "How do I show my level in a skill without rating bars?",
        answer:
          "Group into tiers — \"Core\" and \"Working knowledge\", or \"Daily\" and \"Familiar\" — and let your experience bullets carry the proof for anything you claim at the top tier. A self-assigned score out of five uses a scale the reader cannot interpret, and invites a question you would rather not be asked.",
      },
      {
        question: "Should I list Microsoft Office on a resume?",
        answer:
          "Only when the specific capability is unusual. \"Microsoft Office\" is assumed for any professional role. \"Excel — Power Query, VBA, model builds for a 12-entity consolidation\" is a genuine skill and worth the line it takes.",
      },
    ],
    related: ["resume-skills", "hard-skills-vs-soft-skills", "ats-resume-keywords"],
  },
  {
    slug: "skills-section",
    title: "The skills section: where to put it and how to format it",
    metaTitle: "Resume Skills Section — Placement and Format ({year}) | meniacv",
    description:
      "Where the skills section belongs on the page, how to group it, how many to list, and the formatting decisions that decide whether it survives a parser.",
    eyebrow: "Skills",
    updated: "2026-08-01",
    intro:
      "Two questions come up about the skills section far more than any other: where does it go, and how should it be laid out. Both have real answers that depend on your situation rather than on a universal rule — and one of them, the layout, is the single formatting decision most likely to break an application without you finding out.",
    takeaways: [
      "Below experience for most people; above it for students, career changers and contractors.",
      "Group into three or four labelled categories once you pass about ten items.",
      "Label groups by kind — Languages, Systems, Certifications — never by claimed proficiency.",
      "A sidebar skills block is the one formatting choice that can silently break an application.",
      "Match the posting's exact wording for skills you genuinely have. That is answering, not gaming.",
    ],
    sections: [
      {
        heading: "Where it goes",
        body: [
          "Below experience for most people with a career. Your work history is the strongest evidence you have, it belongs where the reader lands first, and the skills section functions as an index to it rather than as an opening argument.",
          "Above experience in four situations, all of them cases where chronology would mislead. Students and recent graduates, whose experience section is thin but whose capability is real. Career changers, whose recent titles describe the job they are leaving. Contractors and consultants with a long list of short engagements, where a capability summary orients the reader before the chronology overwhelms them. And heavily technical roles where the stack is the first thing a hiring engineer checks.",
          "There is no third position. A skills section in the middle of your experience, or split across the page, reads as a formatting accident.",
        ],
      },
      {
        heading: "How to group it",
        body: [
          "Under about ten items, one line of comma-separated terms is fine. Above ten, group — three or four labelled categories, four to six items each. The labels do real work: they tell a reader what kind of skill they are looking at before they read any of them, and they make the section scannable rather than a block to be skipped.",
          "Sensible groupings depend on the field: Languages / Frameworks / Infrastructure / Tools for engineering; Clinical / Systems / Certifications for nursing; Platforms / Analytics / Channels for marketing. What does not work is grouping by your own assessment — \"Expert / Intermediate / Beginner\" as headings invites the reader to discount two thirds of your list.",
          "Order within each group is read as priority, whether or not you intended it. Put what you want to be asked about first.",
        ],
        list: [
          "Twelve to twenty items total for most professional roles.",
          "Three or four groups, four to six items each, once you pass about ten.",
          "Label the groups by kind, not by claimed proficiency.",
          "No ratings, meters, stars or percentages.",
          "Match the posting's vocabulary where you honestly can — \"React\" and \"React.js\" are the same thing to you and two different strings to a matcher.",
        ],
      },
      {
        heading: "The sidebar problem",
        body: [
          "Most templates that put skills in a coloured sidebar look excellent and carry one real risk: when text is extracted from the PDF, a parser may read straight across the page rather than down one column and then the other. The result is your skills list interleaved into the middle of a job description, which can also take out the job title and dates on that role.",
          "The check takes ten seconds and there is no reason to skip it. Export the PDF, select all the text, paste it into a plain text file, and read what comes out. If your history is intact and in order, the layout parses. If it is interleaved, switch to a single-column template — your writing is untouched, because a template is a rendering choice rather than a container.",
          "Nothing gets auto-rejected for this. What happens is quieter and worse: the record is garbled, the resume ranks low against the posting, and no person ever sees it.",
        ],
      },
      {
        heading: "Matching the posting without stuffing",
        body: [
          "The legitimate version of keyword optimisation lives here. Read the posting, list every named tool and competency, keep the ones that are true of you, and use the posting's exact wording for them. That is not gaming anything — it is answering the question in the language it was asked.",
          "The illegitimate version is listing skills you do not have, or hiding terms in white text, which every modern parser strips and which reads as fraud when found. The cost of being caught is an ended application; the cost of a slightly shorter honest list is nothing, because the interview was going to test it anyway.",
        ],
      },
    ],
    compare: {
      heading: "Above experience, or below it",
      columns: ["", "Skills above experience", "Skills below experience"],
      rows: [
        [
          "Who it suits",
          "Students, career changers, contractors, heavily technical roles",
          "Anyone whose work history is the strongest thing they have",
        ],
        [
          "What it says",
          "Judge me on capability — the chronology would mislead you",
          "Here is what I have done; the list indexes the detail",
        ],
        [
          "Risk",
          "Reads as thin if the skills are generic",
          "None. It is the expected shape",
        ],
        [
          "Length",
          "Keep it tight — six to twelve, grouped",
          "Twelve to twenty, grouped",
        ],
      ],
    },
    checklist: {
      heading: "Placement and format",
      items: [
        "Positioned below experience unless chronology would mislead",
        "Three or four groups of four to six items, once past about ten",
        "Groups labelled by kind rather than by \"Expert / Intermediate\"",
        "Ordered within each group so what you want asked about comes first",
        "Twelve to twenty items in total",
        "No ratings, no meters, no percentages",
        "The posting's exact form used first, the variant second",
        "Copy-paste check run on the export, with nothing interleaved",
      ],
    },
    templates: {
      heading: "Sidebar layouts, and how to check one",
      blurb:
        "A sidebar buys density and carries the one real parsing risk. These are the two-column templates worth using — export, copy the text out, and confirm it reads down each column rather than across both.",
      category: "two-column",
    },
    faqs: [
      {
        question: "Where should the skills section go on a resume?",
        answer:
          "Below experience for most people, because work history is the stronger evidence. Above it for students, career changers, contractors with many short engagements, and heavily technical roles where the stack is the first thing checked.",
      },
      {
        question: "How should I format a skills section?",
        answer:
          "Grouped into three or four labelled categories of four to six items once you have more than about ten skills, plain text, no ratings. Label groups by kind — Languages, Systems, Certifications — rather than by claimed proficiency level.",
      },
      {
        question: "Can I put my skills in a sidebar?",
        answer:
          "You can, but check the export first. Two-column layouts can extract text across both columns instead of down each in turn, which drops your skills into the middle of a job description. Copy the text out of the exported PDF and read it — ten seconds tells you whether yours is affected.",
      },
      {
        question: "Should I copy skills straight from the job description?",
        answer:
          "Copy the wording of the ones that are true of you, yes — using the posting's exact term for a skill you have is answering the question in the language it was asked. Adding skills you do not have is a different act, and the interview finds it.",
      },
    ],
    related: ["resume-skills", "ats-friendly-resume", "technical-skills-resume"],
  },
  {
    slug: "high-school-resume",
    title: "How to write a high school resume",
    metaTitle: "High School Resume — Format, Sections and Examples ({year}) | meniacv",
    description:
      "What goes on a resume when school is most of your history: how to order it, what counts as experience, and the bullet patterns that work for a first job or a college application.",
    eyebrow: "Early career",
    updated: "2026-08-01",
    intro:
      "A high school resume is not a shorter version of an adult one. It is a different document with a different centre of gravity: education leads, activities count as experience, and the reader's question is not \"has this person done this job\" but \"will this person turn up, learn quickly and not need managing\". Once you are answering that question, a page fills up faster than you expect.",
    takeaways: [
      "Education first, with expected graduation date and GPA if it is around 3.4 or above.",
      "Babysitting, yard work, club roles and volunteering all count. Responsibility is the threshold, not a payslip.",
      "Bullets take the same shape as an adult's: a verb, a number, an outcome. The numbers are just smaller.",
      "Availability belongs in the summary — it decides a large share of hires at this level.",
      "One page, and a partly full one is completely normal. Padding is more visible than blank space.",
    ],
    sections: [
      {
        heading: "The order that works",
        body: [
          "Education first, always, and with more detail than an adult resume would carry — school, expected graduation date, GPA if it is above about 3.4, and any coursework that bears on what you are applying for. This is the one point in your life when your education section is the strongest thing on the page, and burying it below a summer job wastes it.",
          "Then whichever of the following you have most of: work experience, activities and leadership, projects, volunteering. There is no fixed order among them. If you have held a part-time job for a year, that goes next, because sustained employment while at school is the single most persuasive thing a sixteen-year-old can show. If you have not, lead with the club you ran or the thing you built.",
          "Skills last, and specific. Then stop. One page, and a high school resume that fills one page honestly is doing well.",
        ],
        list: [
          "Contact details — name, email, phone, city. Use an email address that is your name.",
          "Education — school, expected graduation, GPA if strong, relevant coursework, honours.",
          "Experience — paid work, in reverse-chronological order.",
          "Activities and leadership — clubs, teams, student government, with what you actually did.",
          "Volunteering — with hours or duration, which is what makes it credible.",
          "Skills — software, languages, certifications like a food handler card, lifeguard certification or driving licence.",
        ],
      },
      {
        heading: "What counts as experience",
        body: [
          "Almost everything you have been dismissing. Babysitting is childcare with responsibility for a minor. Mowing lawns for six neighbours is a small business with repeat customers. Running the concession stand at football games is cash handling and inventory. Being treasurer of a club is budgeting. A summer at a family business is work.",
          "The rule is not whether it was a formal job with a payslip. It is whether you turned up when you said you would, took responsibility for something, and can say what happened as a result. That is what an employer hiring for a first job is buying, and none of it requires a previous employer.",
          "Coursework counts too, when it produced something. A history research paper is not a bullet; a history research paper that won a regional prize, or that you presented to a school board, is. What separates them is the outcome, which is exactly the same test an adult resume applies.",
        ],
      },
      {
        heading: "Writing bullets with no job titles",
        body: [
          "The pattern is identical to a professional resume — what you did, how much, what changed — and the amounts are simply smaller. Small does not mean weak. A specific small number reads as true, where a vague large claim reads as inflated.",
          "\"Worked at a restaurant\" tells a reader nothing. \"Ran the register on Friday and Saturday nights, about 90 customers a shift, and trained two new hires on the till\" tells them you can handle volume, work unsocial hours, and be trusted to teach someone. Same job.",
          "\"Member of debate club\" is a line. \"Competed in 12 regional debates over two years; captained the team in senior year and organised the travel for eight people\" is evidence of commitment and organisation, and it took the same amount of page space.",
        ],
        list: [
          "Start with a verb: ran, organised, trained, built, raised, tracked, taught.",
          "Attach a number wherever one honestly exists — hours, people, customers, dollars, weeks.",
          "End with what changed, or what it enabled.",
          "Two or three bullets per entry is plenty. Nobody expects five.",
        ],
      },
      {
        heading: "For a job, and for a college application",
        body: [
          "They are not the same document, and using one for both weakens each. An employer wants reliability, availability and evidence you can be taught: lead with work, keep it to one page, and make your schedule and any certifications easy to find.",
          "A college or scholarship reader wants depth and trajectory — did you stay with something long enough to get good at it, and did you take on more over time. That version leads with activities and leadership, states years of involvement explicitly, and gives more room to achievements than to duties. It can carry more detail about coursework and awards, because that is what is being assessed.",
          "Keep one document with everything on it, and cut a version for each purpose. That is the same advice given to people thirty years into a career, and it works for the same reason.",
        ],
      },
      {
        heading: "The details that give it away",
        body: [
          "A few small things separate a high school resume that reads as competent from one that reads as a school assignment. An email address that is your name rather than a nickname from a game. A phone number you actually answer. Consistent date formatting. No photo. No objective statement saying you are seeking a position that will help you grow.",
          "And no padding. A resume with eleven skills listed, three of which are \"Microsoft Word\", \"communication\" and \"hard worker\", reads worse than one with four real ones. At this stage a short honest page is completely normal, and a reader who is hiring for a first job knows exactly what to expect from a sixteen-year-old's resume. Meeting that expectation cleanly beats trying to look like something else.",
        ],
      },
    ],
    compare: {
      heading: "Two different documents",
      columns: ["", "For a job", "For a college application"],
      rows: [
        [
          "Leads with",
          "Work, availability and certifications",
          "Activities, leadership and depth of involvement",
        ],
        [
          "The reader wants",
          "Reliability, teachability, and can you cover Saturday",
          "Trajectory — did you stay and take on more",
        ],
        [
          "Coursework",
          "Only where it bears on the job",
          "Relevant courses, awards and honours in full",
        ],
        [
          "Duration",
          "Useful",
          "Essential — state years of involvement explicitly",
        ],
        [
          "Length",
          "One page",
          "One page, denser",
        ],
      ],
    },
    checklist: {
      heading: "Before you send it",
      items: [
        "Email address is your name, not a nickname",
        "Expected graduation date is on the page",
        "GPA included only if it is around 3.4 or above",
        "Every entry has a verb, a number and an outcome",
        "Availability stated — evenings, weekends, holidays, start date",
        "Certifications listed: food handler, lifeguard, first aid, driving licence",
        "No objective statement about seeking growth opportunities",
        "No \"hard-working team player\" holding up the bottom third",
        "One page, no photo, consistent dates",
      ],
    },
    templates: {
      heading: "Templates for a first resume",
      blurb:
        "Plain, uncrowded, and comfortable when they are not completely full — which is the situation almost every first resume is in. Nothing here looks empty at three-quarters of a page.",
      category: "simple",
    },
    faqs: [
      {
        question: "What should a high school student put on a resume?",
        answer:
          "Contact details, education with expected graduation date and GPA if it is strong, any paid work, activities and leadership roles, volunteering with hours, and specific skills. Education goes at the top — it is the strongest thing on the page at this stage.",
      },
      {
        question: "How do I write a resume with no work experience?",
        answer:
          "Count what you have been discounting. Babysitting, yard work, club roles, sports commitments, volunteering and school projects all qualify if you took responsibility and can say what happened. Write each with a verb, a number and an outcome, exactly as you would a job.",
      },
      {
        question: "Should I put my high school diploma on my resume?",
        answer:
          "Yes, while it is your highest qualification or you are still studying — list the school, the diploma, and the graduation year. Once you have completed a degree, drop the high school entry entirely; it is assumed, and the line is better spent elsewhere.",
      },
      {
        question: "How long should a high school resume be?",
        answer:
          "One page, and it is completely normal for it not to fill one. A short honest page beats a padded one, and every reader hiring at this level knows what to expect.",
      },
      {
        question: "Should I include my GPA?",
        answer:
          "Include it if it is roughly 3.4 or above, or if the application asks for it. Below that, leave it off and let your activities and work carry the page — an omitted GPA is unremarkable, while a weak one stated is the first thing a reader's eye lands on.",
      },
    ],
    related: ["resume-with-no-experience", "college-student-resume", "education-on-resume"],
  },
  {
    slug: "college-student-resume",
    title: "The college student resume",
    metaTitle: "College Student Resume — Internships, Grad Roles ({year}) | meniacv",
    description:
      "How to build a resume around a degree, coursework and projects when your work history is a summer job — and when to move education back below experience.",
    eyebrow: "Early career",
    updated: "2026-08-01",
    intro:
      "The college resume has a specific problem: you are applying against people with the same degree, from the same institutions, at the same stage. The degree does not differentiate you, because everyone in the pile has one. What differentiates you is what you did that was not assigned — a project, a job held through term time, a society you ran, research you volunteered for. That material is usually there. It is just filed as \"not really experience\".",
    takeaways: [
      "Your degree does not differentiate you — everyone in the pile has one. What you did unassigned does.",
      "Education at the top while enrolled and for about two years after; below experience after that.",
      "Describe projects by what you produced, never by what the module required.",
      "Keep the retail or campus job. Sustaining it alongside a full course load is the reliability evidence.",
      "Tailor per application more than feels proportionate. The pool is more uniform now than it ever will be again.",
    ],
    sections: [
      {
        heading: "How to order it",
        body: [
          "Education at the top while you are enrolled and for about the first two years after graduating, then it moves below experience permanently. The switch is not about time exactly; it is about whether your degree or your work is the more persuasive thing on the page, and for most people that flips somewhere in the second job.",
          "Under education, include what actually helps: institution, degree, expected or actual graduation date, GPA if it is above roughly 3.4, relevant coursework if the role is technical, and thesis or dissertation topic if it bears on the job. Skip the rest — nobody needs your secondary school once you are at university.",
          "Then experience, then projects, then skills. If your projects are stronger than your jobs, which is common for engineering and design students, put projects first and call the section Projects rather than trying to disguise them as employment.",
        ],
      },
      {
        heading: "Coursework and projects as evidence",
        body: [
          "A coursework list on its own is weak — it says what your department required, not what you can do. A project with an outcome is strong, and every degree produces several. The difference is whether you describe the assignment or what you produced.",
          "\"Completed a machine learning module\" is department information. \"Built a churn model on 40k customer records for a course project; the final version reached 0.82 AUC and the write-up was used as an example in the following year's class\" is a thing you did, with a result, that could be discussed for ten minutes in an interview.",
          "The same works outside technical fields. A dissertation becomes a project entry: the question, the method, the size of the dataset or archive, the finding. A group project becomes an entry about coordination as much as content. If you built anything that other people used — a society's website, a spreadsheet the committee still runs on — that is a project and it belongs on the page.",
        ],
      },
      {
        heading: "The part-time job you keep leaving off",
        body: [
          "Students routinely omit retail, hospitality and campus jobs on the grounds that they are irrelevant to a graduate role. They are not irrelevant. They are evidence that you held a commitment alongside a full course load for two years, which is exactly the reliability question a graduate recruiter is trying to answer and which no amount of coursework addresses.",
          "Write it like a job, because it was one. Volume handled, responsibility taken, anything you improved, any promotion. A candidate who supervised weekend shifts at a supermarket while getting a 2:1 has demonstrated something a candidate with a clean academic record and no employment has not.",
          "The exception is a job you held for three weeks four years ago. Duration is what makes this argument, so anything under a few months can go.",
        ],
      },
      {
        heading: "Applying for internships and graduate roles",
        body: [
          "Tailor per application, more than you think is proportionate. Graduate schemes receive thousands of near-identical resumes from people with the same degree, and a page visibly written for that employer stands out in a way it never will again later in your career.",
          "That means matching the vocabulary of the posting in your skills section, promoting the project that resembles the work, and writing a summary — three sentences — that names the specific role you are aiming at. \"Final-year economics student seeking a challenging role in a dynamic company\" is filler. \"Final-year economics student, dissertation on regional pricing dispersion, looking for a graduate analyst role where the work is closer to data than to slides\" tells someone whether to keep reading.",
          "One page. There is no situation in which an undergraduate resume needs two, and stretching to two makes the thin parts obvious.",
        ],
      },
      {
        heading: "Law, medicine and other structured tracks",
        body: [
          "Some fields have a house format that overrides general advice, and it is worth finding out rather than assuming. A law school resume expects education first with journal, moot and clinic involvement listed explicitly, and firms read the specifics closely. Medical and nursing applications expect clinical hours, rotations and licensure treated as their own sections.",
          "Where a career services office publishes a format for your programme, use it. Those conventions exist because the readers are a small, repeat audience with fixed expectations, and matching them is a signal of fit rather than a failure of imagination. General resume advice — outcomes over duties, one page, no padding — still applies within whatever structure you are given.",
        ],
      },
    ],
    rewrites: [
      {
        label: "A course project",
        before: "Completed a machine learning module",
        after:
          "Built a churn model on 40k customer records for a course project; the final version reached 0.82 AUC and the write-up was used as an example in the following year's class",
      },
      {
        label: "The job you were going to leave off",
        before: "Part-time work at a supermarket",
        after:
          "Held a weekend supervisor role through both years of the degree — opened the store, ran a team of four on Saturdays, and trained six new starters",
        note:
          "This answers the reliability question that no amount of coursework can, which is why leaving it off is a mistake.",
      },
    ],
    checklist: {
      heading: "Before an internship or graduate application",
      items: [
        "Education at the top with expected graduation date",
        "GPA included above roughly 3.4, or a 2:1 and above",
        "Dissertation or final-project topic named, not just the degree title",
        "Every project described by what it produced and what resulted",
        "Part-time and campus work included, written as jobs",
        "Skills section using the posting's own vocabulary",
        "A three-sentence summary naming the specific role",
        "One page. There is no undergraduate case for two",
      ],
    },
    templates: {
      heading: "Templates for a graduate application",
      blurb:
        "Restrained layouts that read as current without decoration, and hold education, projects and a first job on one page without crowding. Reorder the sections so education comes first while you are still enrolled.",
      category: "minimal",
    },
    faqs: [
      {
        question: "What should a college student put on a resume?",
        answer:
          "Education at the top with degree, institution, graduation date and GPA if it is strong; any work experience including part-time and campus jobs; projects and coursework that produced something; leadership in societies or sport; and a specific skills section. One page.",
      },
      {
        question: "Should education go first on a student resume?",
        answer:
          "Yes, while you are enrolled and for roughly two years after graduating. After that it moves below experience, because by then your work is the more persuasive evidence and the degree has become a credential rather than an argument.",
      },
      {
        question: "Should I include my retail or hospitality job?",
        answer:
          "Yes, if you held it for more than a few months. It answers the reliability question that coursework cannot — you sustained a commitment alongside a full course load. Write it as a job, with volume, responsibility and anything you improved.",
      },
      {
        question: "How do I write a resume for an internship?",
        answer:
          "Lead with education, promote the project or coursework that most resembles the work, use the posting's own vocabulary in your skills section, and write a three-sentence summary naming the specific role. Tailoring matters more at this stage than it ever will again, because the applicant pool is more uniform than it will ever be again.",
      },
      {
        question: "Should I put my GPA on my resume?",
        answer:
          "Above roughly 3.4, or a 2:1 and above in the UK system, yes. Below that, leave it off — omitted goes unnoticed, while a weak figure stated becomes the first thing the reader's eye finds.",
      },
    ],
    related: ["high-school-resume", "resume-with-no-experience", "education-on-resume"],
  },
  {
    slug: "resume-with-no-experience",
    title: "Writing a resume with no experience",
    metaTitle: "How to Make a Resume With No Experience ({year}) | meniacv",
    description:
      "What to put on a resume for a first job when you have never had one — what counts as experience, how to structure the page, and what employers hiring at this level are actually reading for.",
    eyebrow: "Early career",
    updated: "2026-08-01",
    intro:
      "The instruction to \"lead with your experience\" is useless if you believe you have none, and that belief is usually wrong. Almost everyone writing a first resume has done things that answer the questions an employer is asking — they have just been filed under school, family, hobby or favour rather than under work. This is about finding that material and putting it on a page in a form a stranger can assess.",
    takeaways: [
      "Nobody hiring for a first job expects prior experience in that job. That is what first job means.",
      "They are asking four things: will you turn up, can you be taught, will you take responsibility, can you be trusted.",
      "All four can be evidenced without ever having been employed.",
      "List everything before you filter. Filtering too early is how people end up with a three-line resume.",
      "State your availability in the summary. It wins more first-job interviews than anything else on the page.",
    ],
    sections: [
      {
        heading: "What an employer is actually asking",
        body: [
          "Nobody hiring for a first job expects prior experience in that job. That is what first job means. What they are trying to establish is narrower and much easier to evidence: will you turn up when scheduled, can you be taught, will you take responsibility without being chased, and can you be trusted around customers, money or equipment.",
          "Every one of those can be demonstrated without ever having been employed. Two years of turning up to training. A club you were treasurer of. A younger sibling you got to school every morning for a year. A thing you built and finished. Reframing the page around those four questions, rather than around a job history you do not have, is the whole exercise.",
        ],
      },
      {
        heading: "Finding the material",
        body: [
          "Work through these categories and write down everything, before deciding what is good enough. Filtering too early is how people end up with a three-line resume.",
        ],
        list: [
          "Informal and paid work: babysitting, tutoring, yard work, dog walking, helping in a family business, freelance anything.",
          "School: projects that produced something, competitions, prizes, subjects relevant to the role, a leadership position.",
          "Clubs, teams and societies: what you organised, how many people, how long you stayed.",
          "Volunteering: the organisation, the role, and the hours or duration, which is what makes it credible.",
          "Self-taught work: a website you built, a channel you ran, a game you modded, a language you learned to a stated level.",
          "Certifications: first aid, food handling, lifeguarding, a driving licence, a completed online course with a real assessment.",
        ],
      },
      {
        heading: "Structuring the page",
        body: [
          "Contact details, then a short summary, then education, then whichever of experience, projects, activities and volunteering you have most of — renaming the section honestly rather than calling three club roles \"Professional Experience\". Skills last.",
          "The summary matters more here than on any other kind of resume, because it is where you state what you are looking for and why, which nothing else on the page can do for you. Three sentences: what you are, what you can already do, what you want. \"Recent high school graduate with two years of weekend retail work and a food handler certification, looking for full-time kitchen work. Available all weekends and evenings.\" That last sentence wins more interviews at this level than anything else on the page, and almost nobody includes it.",
          "One page, and do not pad to fill it. A three-quarter page that is all real beats a full page with \"proficient in Microsoft Word\" and \"hard-working team player\" holding up the bottom third.",
        ],
      },
      {
        heading: "Turning non-jobs into bullets",
        body: [
          "Use the same shape as any professional bullet: a verb, a scale, an outcome. The scale will be small, and that is fine — specific and small reads as true, where vague and large reads as invented.",
          "\"Babysitting\" becomes \"Cared for two children aged 4 and 7 three evenings a week for 18 months, including school pickup, meals and bedtime, for the same family throughout.\" The duration and the repeat engagement are the argument: someone trusted you with their children, consistently, for a year and a half.",
          "\"Volunteered at an animal shelter\" becomes \"Volunteered 6 hours a week for a year; trained three new volunteers on intake procedure and ran the Saturday adoption desk.\" That is reliability, teaching and customer contact, which is most of what an entry-level employer is trying to establish.",
        ],
      },
      {
        heading: "What to avoid",
        body: [
          "The objective statement that says you are seeking a challenging position that will allow you to grow and develop your skills. Every reader has seen it ten thousand times, it is about what you want rather than what you offer, and it occupies the most valuable space on the page.",
          "Inflated titles. \"Customer Experience Associate\" for a Saturday job at a bakery reads as insecure; \"Counter Assistant\" reads as honest, and honest is the register that works at this level. The same goes for describing a school group project as though it were a professional engagement.",
          "And padding of any kind — filler skills, hobbies with nothing behind them, a second page. The people reading first-job applications are not comparing you to a senior candidate. They are comparing you to twenty other people with roughly your background, and the one who wrote three specific bullets about a real thing they did wins.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Babysitting",
        before: "Babysitting for local families",
        after:
          "Cared for two children aged 4 and 7 three evenings a week for 18 months, including school pickup, meals and bedtime, for the same family throughout",
        note:
          "The duration and the repeat engagement are the argument: someone trusted you with their children, consistently, for a year and a half.",
      },
      {
        label: "Volunteering",
        before: "Volunteered at an animal shelter",
        after:
          "Volunteered 6 hours a week for a year; trained three new volunteers on intake procedure and ran the Saturday adoption desk",
      },
      {
        label: "The summary",
        before:
          "Seeking a challenging position that will allow me to grow and develop my skills",
        after:
          "Recent high school graduate with two years of weekend retail work and a food handler certification, looking for full-time kitchen work. Available all weekends and evenings.",
      },
    ],
    checklist: {
      heading: "Finding the material you already have",
      items: [
        "Informal and paid work: babysitting, tutoring, yard work, a family business",
        "School projects that produced something, competitions, prizes",
        "Clubs, teams and societies — anything with a budget, a team or a title",
        "Volunteering, with hours or duration stated",
        "Self-taught work: a site, a channel, a language, a finished course",
        "Certifications: first aid, food handling, lifeguarding, a driving licence",
        "Each written with a verb, a number and an outcome",
        "Availability and earliest start date in the summary",
      ],
    },
    templates: {
      heading: "Templates that suit a shorter page",
      blurb:
        "A first resume is often three-quarters of a page, and that is fine. These layouts read as deliberate rather than sparse at that length, and none of them has a section you would have to pad to fill.",
      category: "simple",
    },
    faqs: [
      {
        question: "How do I make a resume with no experience?",
        answer:
          "Build the page around what an employer at this level is actually asking — reliability, teachability, responsibility, trustworthiness — and evidence each from informal work, school projects, clubs, volunteering or self-taught work. Structure it as contact details, summary, education, then whichever section you have most material in, then skills. One page.",
      },
      {
        question: "What counts as experience on a first resume?",
        answer:
          "Anything where you took responsibility and something resulted: babysitting, tutoring, family business work, running a club, sustained volunteering, a project you built and finished, a competition you entered. Formal employment is not the threshold — being accountable to someone for something is.",
      },
      {
        question: "How do I write a resume for my first job?",
        answer:
          "Lead with a three-sentence summary that names the job you want and states your availability, then education, then your strongest material whether that is informal work, activities or projects. Availability and a real certification are worth more at this level than any adjective about yourself.",
      },
      {
        question: "Is a half-page resume acceptable?",
        answer:
          "Yes, for a first job. A short honest page reads better than a padded full one, and everyone hiring at this level knows what a first resume looks like. Filler is more visible than blank space.",
      },
      {
        question: "Should I include an objective statement?",
        answer:
          "Not the traditional kind about seeking a challenging opportunity to grow. A short summary that states what you can already do and when you are available does the same job from the reader's side, in the same space, and it is the version that gets replies.",
      },
    ],
    related: ["high-school-resume", "college-student-resume", "what-to-put-on-a-resume"],
  },
  {
    slug: "add-resume-to-linkedin",
    title: "How to add your resume to LinkedIn",
    metaTitle: "How to Add or Upload a Resume to LinkedIn ({year}) | meniacv",
    description:
      "The three different places LinkedIn accepts a resume, which one you actually want, and why attaching one to your public profile is usually the wrong choice.",
    eyebrow: "Practical",
    updated: "2026-08-01",
    intro:
      "\"Add my resume to LinkedIn\" turns out to mean three different things, and people routinely do the one they did not want. LinkedIn will store a resume for job applications, attach one to your profile for anyone to download, or accept one during a single application. Only the first is usually a good idea. Here is what each one does, and how to get to it.",
    takeaways: [
      "Three different things are called \"adding a resume to LinkedIn\", and most people do the wrong one.",
      "Store it in your job application settings — private, reusable, and what almost everyone wants.",
      "Uploading during a single application is better still if you tailor per job.",
      "The Featured section publishes it to every visitor including your employer. Rarely a good idea.",
      "An upload does not update your profile, and does not make you visible to recruiters.",
    ],
    sections: [
      {
        heading: "The three places, and which you want",
        body: [
          "Before clicking anything, decide which of these you are trying to do — the paths are different and so are the consequences.",
        ],
        list: [
          "Save a resume for applications. Stored in your job application settings and offered whenever you apply with LinkedIn's one-click flow. Private, reusable, and this is what most people want.",
          "Attach one during a single application. Uploaded at the moment you apply to one posting. Private to that employer, and the best option when you want to tailor per job.",
          "Publish one on your profile. Added to the Featured section, where it is visible and downloadable by anyone who visits — including your current employer. Rarely a good idea.",
        ],
      },
      {
        heading: "Saving a resume for applications",
        body: [
          "This is the one to use. In your account settings, under the data privacy area, LinkedIn keeps a job application settings page that stores uploaded resumes and offers them the next time you apply. You can hold several, which is the point — a version per role type, rather than one generic file used for everything.",
          "You can also reach the same store from the application flow itself: the first time you apply with LinkedIn's one-click option, the resume you upload is kept and offered again on the next application. Nothing is published to your profile by doing this, and nobody sees the file except employers you apply to.",
          "LinkedIn expects a PDF or Word file within a modest size limit, and PDF is the right choice — it reaches the reader looking the way you left it. Name the file with your own name rather than \"resume.pdf\", because it lands in a folder with forty other files called exactly that.",
        ],
      },
      {
        heading: "Updating or replacing the one you have",
        body: [
          "The stored resumes are a list, and the list is editable. Open the same job application settings page, delete the version that is out of date, and upload the new one. There is no in-place edit — LinkedIn stores a file, not a document it can modify, so replacing is the only route.",
          "Do this deliberately rather than accumulating. A stored list of five near-identical files from different years is how people end up attaching a two-year-old resume to an application without noticing. Keep the ones that are current and distinct, and delete the rest.",
          "If your profile is what is out of date rather than the file, that is a separate job — LinkedIn does not update your profile from an uploaded resume, and it does not update an uploaded resume when you edit your profile. They are unconnected.",
        ],
      },
      {
        heading: "Why the profile Featured section is usually wrong",
        body: [
          "You can add a resume to your profile as a featured document, and it will sit there as a download link for every visitor. Three reasons that is a bad default.",
          "It is public. Your current manager, your colleagues and anyone else can see that a current resume appeared on your profile, which is a signal you may not want to send. It also puts your phone number and email in front of every scraper that walks LinkedIn, which is a durable source of recruitment spam and worse.",
          "It is generic. A resume that has to serve every visitor cannot be tailored to any of them, so it is strictly weaker than the version you would attach to a specific application. And it duplicates your profile, which already contains the same history in a format better suited to being browsed.",
          "The narrow case where it does make sense: you are openly looking, you are not currently employed or your employer knows, and you want a downloadable artefact — a portfolio-style CV, a one-page case study — that your profile cannot represent. Even then, strip the phone number.",
        ],
      },
      {
        heading: "What the upload does not do",
        body: [
          "It does not update your profile. Your headline, About section, roles and skills stay exactly as they were — LinkedIn treats the file as an attachment, not as a source of profile data. If your profile is stale, editing the profile is the only fix.",
          "It does not make you visible to recruiters. That is the separate \"open to work\" setting, which controls whether recruiters searching LinkedIn see you as a candidate. Uploading a file changes nothing about your search visibility.",
          "And it does not tailor anything. A stored resume is used verbatim on every application it is attached to, so if you are applying across two quite different role types, store two files and pick deliberately. LinkedIn moves its settings around fairly often; if a menu is not where this describes, the reliable route is to start an application and manage the resume from within that flow.",
        ],
      },
    ],
    compare: {
      heading: "The three places, and who sees each",
      columns: ["Where", "Who sees it", "Use it when"],
      rows: [
        [
          "Job application settings",
          "Only employers you apply to",
          "You want one reusable file offered on every application",
        ],
        [
          "During an application",
          "Only that employer",
          "You tailor per job, which is the better habit",
        ],
        [
          "Profile Featured section",
          "Everyone, including your current employer",
          "You are openly looking and want a public downloadable artefact",
        ],
      ],
    },
    checklist: {
      heading: "Getting the upload right",
      items: [
        "You know which of the three you are doing before you click",
        "PDF rather than Word, so it arrives looking as you left it",
        "Named with your own name, not \"resume.pdf\"",
        "Stored files pruned — no two-year-old version sitting in the list",
        "Nothing published to the Featured section unless you intend it to be public",
        "Phone number removed from any version you do publish",
        "Profile facts — titles, employers, dates — match the file",
      ],
    },
    templates: {
      heading: "Templates for the file you upload",
      blurb:
        "Whatever you attach goes through the employer's own applicant tracking system, not LinkedIn's. These are the single-column layouts that parse cleanly at the other end.",
      category: "ats",
    },
    faqs: [
      {
        question: "How do I add my resume to LinkedIn?",
        answer:
          "For applications, open your job application settings under account settings and upload it there — it is then offered every time you apply with LinkedIn's one-click flow, and stays private. You can also upload during any individual application, which is the better option if you tailor per job.",
      },
      {
        question: "How do I upload a resume to LinkedIn from my phone?",
        answer:
          "The same settings exist in the mobile app under your account's data privacy section, and any application flow will also let you attach a file from your device or a cloud drive. The stored list is shared between the app and the website — upload once and it is available on both.",
      },
      {
        question: "How do I update my resume on LinkedIn?",
        answer:
          "Open the job application settings, delete the outdated file and upload the replacement. There is no in-place edit, because LinkedIn stores a file rather than a document it can modify. Editing your profile does not change any stored resume, and vice versa.",
      },
      {
        question: "Should I put my resume on my LinkedIn profile?",
        answer:
          "Usually no. A resume in your Featured section is downloadable by anyone including your current employer, it exposes your contact details to scrapers, and it cannot be tailored to any specific job. Store it for applications instead, which is private and reusable.",
      },
      {
        question: "Can recruiters see the resume I uploaded to LinkedIn?",
        answer:
          "Only the employers you actually apply to, if it was uploaded through the application settings or an application flow. A resume added to your profile's Featured section is a different matter — that one is visible and downloadable by every visitor.",
      },
      {
        question: "Does uploading a resume update my LinkedIn profile?",
        answer:
          "No. The file is stored as an attachment and your profile fields are untouched. If your profile is out of date, it has to be edited directly — and if you want to go the other way and build a resume from your profile, exporting the profile PDF and importing it into a builder is the faster route.",
      },
    ],
    related: ["linkedin-to-resume", "linkedin-on-resume", "ai-resume-builder"],
  },
  {
    slug: "linkedin-on-resume",
    title: "Putting your LinkedIn on your resume",
    metaTitle: "How to Put LinkedIn on a Resume — With Examples ({year}) | meniacv",
    description:
      "Where the LinkedIn URL goes, how to format it, how to customise it first, and when including the link works against you.",
    eyebrow: "Practical",
    updated: "2026-08-01",
    intro:
      "Adding a LinkedIn URL to a resume is a thirty-second job that most people do slightly wrong, and a small number should not do at all. The formatting matters less than one prior question nobody asks: is the profile at the other end of that link better than the resume it is attached to? If not, the link is an invitation to be disappointed.",
    takeaways: [
      "Customise the URL before it goes anywhere. The default ends in a random string and looks pasted.",
      "It belongs in the header contact line, beside your email — not in a section of its own.",
      "Show the readable form, hyperlink the full one, and check the link works in the exported PDF.",
      "If the profile is a skeleton or contradicts your resume, leave the link off until you fix it.",
      "The profile should carry what the resume had to cut. A shorter copy gives nobody a reason to click.",
    ],
    sections: [
      {
        heading: "Customise the URL first",
        body: [
          "The default LinkedIn URL ends in a string of random characters, and printed on a resume it looks like exactly what it is — something copied out of an address bar. LinkedIn lets you change it once your profile is established, from the public profile settings, to something like linkedin.com/in/your-name.",
          "Do that before you put it anywhere. A custom URL is readable, it survives being printed and typed in by hand, and it is the difference between a contact line that looks composed and one that looks pasted.",
          "If your name is taken, add a middle initial, a discipline or a city rather than a number. \"linkedin.com/in/jordanalvarez-data\" reads as intentional; \"linkedin.com/in/jordanalvarez7734\" reads as a fallback.",
        ],
      },
      {
        heading: "Where it goes and how to write it",
        body: [
          "In the contact line at the top, alongside your email and phone. It is a contact detail, not an achievement, and it does not need a section of its own.",
          "Write it as a shortened readable form — linkedin.com/in/jordanalvarez — hyperlinked to the full URL. Drop the https:// and the www., which are noise on a printed page. If your template renders links as labels, \"LinkedIn\" as the visible text with the URL behind it is fine for a document that will only ever be read on screen, and worse for one that might be printed, because the address disappears.",
          "One line, with your other links. A portfolio, a GitHub or a personal site sit in the same place. Four links is the sensible ceiling; past that the contact block starts competing with your summary for attention.",
        ],
        list: [
          "Customise the URL before using it anywhere.",
          "Put it in the header contact line, not in its own section.",
          "Show the readable form, hyperlink the full one.",
          "Include a portfolio or GitHub only if the work there is current and relevant.",
          "Check the link actually works in the exported PDF — this fails more often than people expect.",
        ],
      },
      {
        heading: "When not to include it",
        body: [
          "If your profile is a skeleton — a headline, two job titles, no summary, a photo from a decade ago — the link is a liability. A recruiter clicking it learns less than your resume told them and forms an impression of someone who does not maintain things. Either spend an hour on the profile or leave the link off; a resume with no LinkedIn URL is completely unremarkable.",
          "If your profile contradicts your resume, fix the contradiction before linking. Different date ranges on the same job, a title on one that does not appear on the other, an employer missing from one of them — recruiters routinely have both open, and a discrepancy in dates is the sort of small thing that turns into a large question.",
          "And if you are job hunting confidentially, think about what the profile signals. The link itself is harmless, but if you have turned on open-to-work banners or recently rewritten your headline, anyone you send the resume to can see that. That is usually fine and occasionally not.",
        ],
      },
      {
        heading: "What the profile should do that the resume cannot",
        body: [
          "The link is only worth including if clicking it adds something. The resume is two pages, tailored, and selective; the profile can be longer, broader and more human, and that is the value of having both.",
          "So the profile should carry the material the resume had to cut: the roles from twelve years ago, the projects that did not fit, recommendations from people you worked with, a summary written in the first person that sounds like a person. A profile that is a shorter, worse copy of the resume gives a reader no reason to have followed the link.",
          "The facts that appear in both — titles, employers, dates — should match exactly. Everything else can and should differ.",
        ],
      },
    ],
    checklist: {
      heading: "Before the URL goes on the page",
      items: [
        "Profile URL customised to something readable",
        "Written as linkedin.com/in/your-name, without https:// or www.",
        "Sitting in the header contact line, not in its own section",
        "The link actually works in the exported PDF",
        "Profile is complete — headline, about, current role, recent detail",
        "Titles, employers and dates match the resume exactly",
        "Four links at most across the whole header",
      ],
    },
    templates: {
      heading: "Templates with a proper contact line",
      blurb:
        "A header that holds an email, a phone number, a city and two links without wrapping into a mess. These layouts give the contact line the room it needs and keep every part of it as real text.",
      category: "modern",
    },
    faqs: [
      {
        question: "How do I put LinkedIn on my resume?",
        answer:
          "Customise your profile URL first, then add the shortened readable form — linkedin.com/in/your-name — to the contact line at the top of the resume, hyperlinked to the full address. It belongs beside your email and phone, not in a section of its own.",
      },
      {
        question: "Should I include my LinkedIn URL on my resume?",
        answer:
          "Yes, if the profile is complete and current. No, if it is a skeleton or contradicts your resume — a recruiter who clicks through to an empty profile learns less than they already knew and forms a worse impression than the missing link would have caused.",
      },
      {
        question: "How do I customise my LinkedIn URL?",
        answer:
          "From the public profile settings on your own profile, where LinkedIn lets you edit the address to something readable. Do it before the URL appears on any document — the default ends in a random string that looks pasted rather than composed.",
      },
      {
        question: "Should my LinkedIn match my resume exactly?",
        answer:
          "The facts should match — job titles, employers and dates. The rest should not. The profile is your general public record and can be longer and more personal; the resume is a tailored argument for one job. Identical documents make the link pointless.",
      },
    ],
    related: ["linkedin-to-resume", "add-resume-to-linkedin", "what-to-put-on-a-resume"],
  },
  {
    slug: "resume-fonts",
    title: "The best fonts for a resume, and the size to set them at",
    metaTitle: "Best Font for a Resume — And What Size ({year}) | meniacv",
    description:
      "Which typefaces work on a resume, which quietly cost you, what size and line height to set, and why the font is a much smaller decision than the time spent on it suggests.",
    eyebrow: "Formatting",
    updated: "2026-08-01",
    intro:
      "No hiring decision has ever turned on a typeface. But a handful of font choices do real damage — by looking dated, by making a page unreadable at the size you have squeezed it to, or by failing to embed in a PDF — and the difference between a safe choice and a bad one is about ninety seconds of attention. That is the right amount of time to spend here.",
    takeaways: [
      "Any well-drawn workhorse face works. Eleven point is the answer if you do not want to think about it.",
      "Sans-serif reads as contemporary, serif as formal. Both are correct almost everywhere.",
      "Avoid condensed faces — they exist to fit more text, which trades a real cost for an imaginary benefit.",
      "The most common font mistake is shrinking a good typeface to nine point to force one page.",
      "Fonts have no effect on parsing. Column count does.",
    ],
    sections: [
      {
        heading: "The fonts that work",
        body: [
          "Any well-drawn typeface with a full character set, real bold and italic weights, and comfortable letterforms at eleven point. That is a wide field, and within it the differences are aesthetic rather than functional.",
        ],
        list: [
          "Sans-serif: Helvetica, Arial, Calibri, Lato, Source Sans, Inter, Open Sans, Roboto, Verdana. Reads as contemporary; the default for technology, product and startup hiring.",
          "Serif: Georgia, Garamond, Cambria, Charter, Source Serif, Times New Roman. Reads as formal; the safer register for law, finance, academia and government.",
          "Either is correct almost everywhere. Pick one family and use it for the whole document — a serif for headings and a sans for body is a design decision that needs to be made well or not at all.",
        ],
      },
      {
        heading: "The ones to avoid, and why",
        body: [
          "Comic Sans and Papyrus are the jokes, and nobody reading this needs telling. The genuinely common mistakes are less obvious.",
          "Anything condensed or narrow — Arial Narrow, condensed variants — because it is almost always chosen to fit more text onto a page. It works, and it makes the page harder to read, which trades a real cost against an imaginary benefit. If the content does not fit at a normal width, cut the content.",
          "Script and display faces, at any size, for any role including creative ones. A designer demonstrates typographic judgement by setting a resume beautifully in a workhorse face, not by using a decorative one.",
          "And any font you installed yourself and are exporting from a desktop application without embedding. An unembedded font is substituted on the reader's machine, which can reflow your entire page. Exporting a PDF from a tool that embeds fonts removes this problem entirely, which is most of the reason to send a PDF at all.",
        ],
      },
      {
        heading: "Size, spacing and margins",
        body: [
          "Body text at ten to twelve point, and eleven is the answer if you do not want to think about it. Below ten it stops being comfortable for a reader scanning quickly on a screen; above twelve you are spending the page on air.",
          "Your name at eighteen to twenty-four point, section headings at thirteen to sixteen. That is three sizes total, and three is enough — the hierarchy on a resume is name, section, body, and adding a fourth or fifth size makes the page busier without making it clearer.",
          "Line height between 1.15 and 1.5. Margins between half an inch and one inch on every side. Half an inch is the floor; below it the page reads as crowded and some printers will clip.",
        ],
        list: [
          "Body: 10–12pt, 11pt if unsure.",
          "Name: 18–24pt. Section headings: 13–16pt.",
          "Line height: 1.15–1.5.",
          "Margins: 0.5–1 inch, never below 0.5.",
          "Bold for emphasis, sparingly. Underlining is for links only.",
        ],
      },
      {
        heading: "The trap: shrinking type to fit",
        body: [
          "The single most common font mistake is not choosing the wrong face. It is setting a perfectly good face at nine point with quarter-inch margins to force two pages of content onto one. The result is a page that is technically one page and practically unreadable, and every reader recognises what happened.",
          "The fix is editorial, not typographic. If it does not fit at eleven point with half-inch margins, there is too much on it — usually an old job that could be a single line, bullets that run to three lines each, or a skills section carrying twelve items nobody needed. Cutting is the answer, and it improves the resume twice over.",
          "The exception is that two pages is fine past roughly a decade of experience. People compress to one page because they believe a rule that does not exist at senior levels, and the compression deletes evidence.",
        ],
      },
      {
        heading: "Does the font affect ATS parsing?",
        body: [
          "No, with one qualification. Applicant tracking systems extract characters from the PDF, and the character stream is identical whether it was set in Garamond or Arial. Serif versus sans is invisible to a parser.",
          "The qualification is that the text must be text. A resume exported as an image, scanned, or with the name rendered inside a graphic contributes nothing to the parse regardless of how it was typeset. Check by selecting the text in your exported PDF: if you can highlight it, a parser can read it.",
          "What genuinely affects parsing is column count, not typography. That is worth the attention people spend on fonts.",
        ],
      },
    ],
    compare: {
      heading: "Choosing between serif and sans",
      columns: ["", "Serif", "Sans-serif"],
      rows: [
        [
          "Reads as",
          "Formal, traditional, considered",
          "Contemporary, clean, current",
        ],
        [
          "Best for",
          "Law, finance, academia, government, healthcare",
          "Technology, product, startups, design, most modern industries",
        ],
        [
          "Good choices",
          "Georgia, Garamond, Cambria, Charter, Source Serif",
          "Helvetica, Calibri, Lato, Inter, Source Sans, Open Sans",
        ],
        [
          "Avoid",
          "Times New Roman — it reads as unconsidered rather than formal",
          "Anything condensed, and anything with a personality",
        ],
        [
          "Parsing",
          "No effect whatsoever",
          "No effect whatsoever",
        ],
      ],
    },
    checklist: {
      heading: "Typography settings that work",
      items: [
        "Body text at 10–12pt, and 11pt if unsure",
        "Name at 18–24pt, section headings at 13–16pt — three sizes total",
        "Line height between 1.15 and 1.5",
        "Margins between half an inch and one inch on every side",
        "One type family throughout, unless you are mixing two deliberately",
        "Bold used sparingly; underline reserved for links",
        "Fonts embedded in the export, so nothing substitutes on the reader's machine",
        "Nothing compressed below 10pt or 0.5in to force a page break",
      ],
    },
    templates: {
      heading: "Templates by typeface",
      blurb:
        "Each of these is built around a specific face at a specific size, with the line height and margins already set where they should be. Font family, size and spacing all stay adjustable afterwards.",
      category: "classic",
      count: 9,
    },
    faqs: [
      {
        question: "What is the best font for a resume?",
        answer:
          "Any well-drawn workhorse face — Calibri, Helvetica, Arial, Lato and Source Sans among sans-serifs; Georgia, Garamond, Cambria and Charter among serifs. Sans-serif reads as contemporary and serif as formal, and both are correct almost everywhere. The choice matters far less than the size you set it at.",
      },
      {
        question: "What font size should a resume be?",
        answer:
          "Ten to twelve point for body text, with eleven as the default. Your name at eighteen to twenty-four, section headings at thirteen to sixteen. Below ten point the page stops being comfortable to scan, and shrinking type to force two pages into one is the most common formatting mistake there is.",
      },
      {
        question: "Is Times New Roman bad for a resume?",
        answer:
          "It is not bad, it is invisible — it has been the default in word processors for so long that it reads as unconsidered rather than as formal. If you want a serif, Garamond, Georgia, Cambria or Charter do the same job and look chosen.",
      },
      {
        question: "Should I use a serif or sans-serif font?",
        answer:
          "Sans-serif for technology, product, startups and most modern industries; serif for law, finance, academia, government and anywhere with a conservative house style. Neither will cost you a role. Consistency within the document matters more than the family.",
      },
      {
        question: "Do fonts affect ATS scanning?",
        answer:
          "No. Parsers extract characters, and the character stream is identical across typefaces. What does affect parsing is whether the text is real text rather than an image, and whether the layout is single or multi-column. Fonts are a design decision with no parsing consequence.",
      },
      {
        question: "What font should I use in Word?",
        answer:
          "Calibri, Cambria, Georgia or Garamond — all ship with Word, so they embed cleanly and never substitute. If you install a font yourself, make sure it is embedded on export, because an unembedded font is replaced on the reader's machine and can reflow the whole page.",
      },
    ],
    related: ["what-a-good-resume-looks-like", "resume-format", "resume-length"],
  },
  {
    slug: "harvard-resume-format",
    title: "The Harvard resume format, and why it works",
    metaTitle: "Harvard Resume Format — Structure and Template ({year}) | meniacv",
    description:
      "What the Harvard resume format actually is, the structure its career office teaches, the bullet formula behind it, and how to use it without going to Harvard.",
    eyebrow: "Formats",
    updated: "2026-08-01",
    intro:
      "The \"Harvard resume format\" is not a secret document and it is not a design. It is the plain single-column layout taught by Harvard's career services to its own students, and the reason people search for it is sound instinct: it is a good format, publicly documented, with no decoration to get wrong. What actually makes it work is a writing rule, not a layout.",
    takeaways: [
      "A one-page, single-column, black-and-white resume with no photo and no objective statement.",
      "Five sections: header, education, experience, leadership and activities, skills and interests.",
      "The bullet formula is the actual content: action verb, specific action, measurable result.",
      "Built for a conservative audience — consulting, banking, law, academia — which makes it a safe default.",
      "Adapt it mid-career by moving education below experience and allowing a second page.",
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "A one-page, single-column, black-and-white resume with the name at the top, no photo, no objective statement, and four or five plainly-labelled sections. There is no colour, no sidebar, no icon set and no graphic element of any kind. That austerity is the point rather than an omission — it puts every ounce of the reader's attention on the content.",
          "It is taught to undergraduates and graduate students at a school whose alumni are read closely by consulting firms, banks, law firms and academic departments, which is a demanding and conservative audience. A format built for those readers is a safe default for almost anyone.",
          "The version circulated online is a Word or PDF handout from the university's career office. Nothing about it is proprietary or restricted, and reproducing the structure is entirely ordinary — this is a convention, not a brand.",
        ],
      },
      {
        heading: "The structure",
        body: [
          "Five sections, in this order, with education first while you are a student or recent graduate.",
        ],
        list: [
          "Header: name, then one line with email, phone and city. No address, no photo, no title line.",
          "Education: institution, location, degree, graduation date, and where relevant GPA, honours, thesis and coursework. First on the page for students.",
          "Experience: reverse-chronological. Employer, location, title, dates, then bullets. Internships, research posts and part-time work all sit here as equals.",
          "Leadership and activities: societies, sport, volunteering, student government — with what you did rather than what you belonged to.",
          "Skills, certifications and interests: technical skills, languages with a stated level, and a short interests line, which is the one place the format allows personality.",
        ],
      },
      {
        heading: "The bullet formula, which is the actual content",
        body: [
          "The structure is the easy half. What Harvard's career office teaches, and what makes the format effective, is a formula for the bullets: start with a strong action verb, state what you did with specifics, and end with the result or the scale.",
          "\"Responsible for the weekly sales report\" fails the formula in every respect — no verb worth the name, no specifics, no outcome. \"Rebuilt the weekly sales report in SQL, cutting preparation from six hours to twenty minutes and freeing the analyst team for forecasting work\" passes, and the difference is not the format.",
          "Two supporting rules travel with it. Past tense for past roles, present for current ones, applied consistently. And quantify wherever a number honestly exists — people, dollars, percentages, hours, volume. A bullet with a number in it is read; a bullet without one is skimmed.",
        ],
      },
      {
        heading: "Where it is strong, and where it is not",
        body: [
          "It is strong for students and recent graduates, for conservative industries — consulting, banking, law, government, academia — and for anyone applying through an applicant tracking system, because a single column of plain text is the easiest thing in the world to parse. It also travels: it prints, it reads on a phone, and it survives being pasted into an internal portal.",
          "Its limits are real but narrow. It is one page by design, which is wrong for a senior candidate with fifteen years of history to represent. It puts education first, which is wrong once your work is the stronger argument. And in visual fields — design, art direction, brand — a page demonstrating no typographic judgement is itself a signal.",
          "The adaptation for a mid-career candidate is straightforward: move education below experience, allow a second page, and keep everything else. What you are keeping is the useful part.",
        ],
      },
      {
        heading: "Using it here",
        body: [
          "Any of the simple single-column templates on this site produce this structure — one column, no sidebar, plain headings, real-text export. Choose one, put education above experience if you are a student, and spend the time you would have spent on layout on the bullet formula instead.",
          "That is the honest version of this advice. The format is a five-minute decision that is already solved. The verb-specifics-result rewrite across every bullet is the work, and it is the entire reason the Harvard resumes read the way they do.",
        ],
      },
    ],
    rewrites: [
      {
        label: "The bullet formula",
        before: "Responsible for the weekly sales report",
        after:
          "Rebuilt the weekly sales report in SQL, cutting preparation from six hours to twenty minutes and freeing the analyst team for forecasting work",
        note:
          "Verb, specifics, result. This is what makes the format effective — the layout is the easy half.",
      },
      {
        label: "An activities entry",
        before: "Member of the investment society",
        after:
          "Ran the investment society's stock pitch competition — 60 entrants across two years, and secured three sponsors to fund the prize pool",
      },
    ],
    checklist: {
      heading: "Building one",
      items: [
        "Header: name, then one line with email, phone and city. No address, no photo",
        "Education first while you are a student or recent graduate",
        "Experience reverse-chronological, internships and part-time work as equals",
        "A leadership and activities section with what you did, not what you belonged to",
        "Skills, certifications and a short interests line at the bottom",
        "Every bullet: strong verb, specifics, then the result or the scale",
        "Past tense for past roles, present for current, applied consistently",
        "One page, one column, no colour",
      ],
    },
    templates: {
      heading: "Templates in this shape",
      blurb:
        "One column, plain headings, no colour and no sidebar — which is the Harvard format, reproduced. Put education above experience if you are a student and the structure is complete.",
      category: "one-column",
    },
    faqs: [
      {
        question: "What is the Harvard resume format?",
        answer:
          "A one-page, single-column, black-and-white resume taught by Harvard's career services: a plain header with no photo, then education, experience, leadership and activities, and skills. No colour, no sidebar, no objective statement. Its distinguishing feature is a bullet formula — action verb, specific action, measurable result.",
      },
      {
        question: "Is the Harvard resume format good for everyone?",
        answer:
          "It is an excellent default for students, recent graduates, conservative industries and any application going through an applicant tracking system. Mid-career candidates should adapt it by moving education below experience and allowing a second page; visual fields may want a layout that demonstrates design judgement.",
      },
      {
        question: "What is the Harvard bullet formula?",
        answer:
          "Start with a strong action verb, state what you did with specifics, end with the result or the scale. \"Rebuilt the weekly sales report in SQL, cutting preparation from six hours to twenty minutes\" rather than \"Responsible for weekly sales reporting\". Past tense for past roles, present for current.",
      },
      {
        question: "Where can I get the Harvard resume template?",
        answer:
          "The handout comes from Harvard's own career services office, and the structure it describes is a convention rather than a proprietary design. Any plain single-column template reproduces it — put education above experience if you are a student, use the bullet formula, and you have it.",
      },
      {
        question: "Does the Harvard format use an objective statement?",
        answer:
          "No. It has no objective and no summary for students — the header goes straight into education. A short summary is a reasonable mid-career addition, but the format as taught leaves it out and loses nothing by it.",
      },
    ],
    related: ["resume-bullet-points", "college-student-resume", "resume-format"],
  },
  {
    slug: "jakes-resume-template",
    title: "Jake's Resume: what it is and why engineers use it",
    metaTitle: "Jake's Resume Template — What It Is and How to Use It ({year}) | meniacv",
    description:
      "The single-page LaTeX template that became the default in software hiring: what it contains, why it works, and how to get the same result without learning LaTeX.",
    eyebrow: "Formats",
    updated: "2026-08-01",
    intro:
      "Jake's Resume is a one-page LaTeX resume template, published openly and adopted so widely in software hiring that a recruiter screening engineering applications will see several a day. It is a genuinely good template. It is also the reason a lot of engineering resumes now look identical — which is worth understanding before you decide it is the right choice.",
    takeaways: [
      "A free one-page LaTeX template with Education, Experience, Projects and Technical Skills.",
      "It works because Projects is a first-class section, it is single column, and its spacing is honest.",
      "Its cost is ubiquity — in a new-grad software pile, the document is no longer distinguishing.",
      "The other cost is LaTeX itself, if you do not already write it.",
      "Everything that makes it good is a layout decision that any editor can reproduce.",
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "A LaTeX template, originally shared on Overleaf and GitHub, that produces a tight one-page single-column resume with four sections: Education, Experience, Projects and Technical Skills. Its typography is conservative, its spacing is dense without being cramped, and it fits a surprising amount on one page without dropping below a readable size.",
          "It spread through computer science programmes and engineering subreddits because it solves the exact problem a CS student has: a lot of material — degree, internships, side projects, a long tools list — and one page to hold it. Most general-purpose templates handle that badly. This one was designed around it.",
          "It is free, and it is used by permission — the template is published openly for exactly this purpose. Nothing about using it is unusual or requires attribution on the document.",
        ],
      },
      {
        heading: "Why it works",
        body: [
          "Three decisions, and none of them is about looks.",
          "It has a Projects section as a first-class element, ranked equally with Experience. For a student or early-career engineer whose strongest evidence is something they built rather than somewhere they worked, that ordering is correct and most templates get it wrong.",
          "It is single-column, so it parses cleanly. And it is honest about density — the spacing is set so that a full page of real content fits at a readable size, which means people stop shrinking the type to make things fit. Most one-page resumes fail by compression rather than by layout, and this one removes the temptation.",
          "The fourth thing, which is not a design decision: it is the format the audience expects. A hiring engineer scanning it knows where everything is before they start reading.",
        ],
      },
      {
        heading: "The cost of using it",
        body: [
          "Ubiquity. If you are applying for a new-grad software role, a meaningful share of the pile is in this exact template — same section order, same typography, same tech-stack line. Nobody is rejected for it, but it removes any possibility of the document itself being memorable, and it makes the writing carry all of the differentiation.",
          "That is a fair trade if your writing is strong. It is a bad trade if you chose the template hoping the template would do some of the work, because in this case it demonstrably cannot: the person reading has seen forty of them this month.",
          "The other cost is LaTeX itself. Editing it means a LaTeX toolchain or an Overleaf account, and a syntax error in a nested macro at eleven at night before a deadline is a genuinely bad experience for someone who does not otherwise write LaTeX. If you already work in LaTeX this is nothing. If you do not, you are learning a document language to get a layout.",
        ],
      },
      {
        heading: "Getting the same result without LaTeX",
        body: [
          "The template is a set of decisions, and every one of them can be reproduced in any editor: single column, one page, sections ordered Education, Experience, Projects, Technical Skills for a student — Experience first once you have a career — dense but readable spacing, no colour, no photo, no icons, tech stack named explicitly per project.",
          "Any of the compact single-column templates here produces that shape, exports as real text, and can be edited without a compiler. Reorder the sections to match, keep it to one page, and the output is the same document with a different typeface.",
          "If what you want is specifically LaTeX output, this is not the tool for it — that is an honest limitation rather than a comparison. What is available here is the layout and the structure, which is what almost everyone searching for this template is actually after.",
        ],
      },
      {
        heading: "The part people skip",
        body: [
          "Templates are not why some engineering resumes get interviews. The projects section is. A project entry that says \"Built a full-stack web app using React, Node and MongoDB\" describes a tutorial; one that says \"Built a flight-delay predictor over 6m FAA records; the model runs nightly and the site has served about 400 users since launch\" describes a person who finished something and shipped it.",
          "The same applies to internship bullets. Verb, specifics, outcome — and a number wherever one honestly exists. Getting that right in a plain template beats getting it wrong in this one, every time.",
        ],
      },
    ],
    compare: {
      heading: "Jake's Resume against a general template",
      columns: ["", "Jake's Resume", "A general single-column template"],
      rows: [
        [
          "Projects",
          "A first-class section, ranked with experience",
          "Usually an afterthought below education",
        ],
        [
          "Editing",
          "LaTeX — a toolchain or an Overleaf account",
          "Direct, in an editor, with a live preview",
        ],
        [
          "Density",
          "Tuned so a full page fits at a readable size",
          "Varies. Some tempt you to shrink the type",
        ],
        [
          "Parsing",
          "Excellent — one column of real text",
          "Excellent, if it is single column",
        ],
        [
          "Distinctiveness",
          "None left. Recruiters see several a day",
          "Depends on the template, and it barely matters",
        ],
      ],
    },
    checklist: {
      heading: "Reproducing it anywhere",
      items: [
        "Single column, one page, no colour, no photo, no icons",
        "Education, Experience, Projects, Technical Skills — in that order as a student",
        "Experience above Projects once you have a career",
        "Dense but readable spacing, so nothing needs shrinking to fit",
        "Tech stack named per project rather than as one undifferentiated list",
        "Every project described by what it does before what it was built with",
        "A working link on every project, to a repo with a real README",
        "Graduation date visible — new-grad hiring runs on a calendar",
      ],
    },
    templates: {
      heading: "The same layout, without LaTeX",
      blurb:
        "Compact single-column templates that hold a degree, two internships, three projects and a stack list on one page at a readable size. Reorder the sections to match and the output is the same document in a different typeface.",
      category: "compact",
    },
    faqs: [
      {
        question: "What is Jake's Resume?",
        answer:
          "A free one-page LaTeX resume template, published on Overleaf and GitHub, with sections for Education, Experience, Projects and Technical Skills. It became close to a default in software engineering hiring because it fits a student's material onto one page at a readable density and treats projects as first-class evidence.",
      },
      {
        question: "Is Jake's Resume template good?",
        answer:
          "Yes — single column so it parses cleanly, dense enough that people stop shrinking their type, and structured the way an engineering reader expects. Its main drawback is how common it has become: in a new-grad software pile, the document itself is no longer distinguishing, so the writing has to do all the work.",
      },
      {
        question: "Do I need LaTeX to use Jake's Resume?",
        answer:
          "To use the original file, yes — it compiles through a LaTeX toolchain or Overleaf. The layout itself is just a set of decisions, and any compact single-column template reproduces it: one page, education first for students, a proper projects section, no colour and no photo.",
      },
      {
        question: "Is Jake's Resume ATS-friendly?",
        answer:
          "Yes. It is a single column of real text with plain headings, which is the easiest possible thing for a parser to read. The compiled PDF contains genuine selectable text, so the copy-paste check on it comes out clean.",
      },
      {
        question: "Should I use Jake's Resume if I am not an engineer?",
        answer:
          "The structure is built around a projects section and a technical skills block, which is specific to engineering. Outside software, a general single-column layout serves you better — the useful ideas here are one page, plain typography and honest density, and those transfer to any template.",
      },
    ],
    related: ["latex-resume", "ats-friendly-resume", "resume-bullet-points"],
  },
  {
    slug: "latex-resume",
    title: "LaTeX resumes: when they are worth it",
    metaTitle: "LaTeX Resume — Templates, Overleaf and the Trade-offs ({year}) | meniacv",
    description:
      "Why LaTeX resumes look the way they do, where Overleaf fits, what the format genuinely buys you, and the honest case for not bothering.",
    eyebrow: "Formats",
    updated: "2026-08-01",
    intro:
      "LaTeX resumes are near-universal in some corners of software, physics and academia, and completely absent everywhere else. Both of those are rational. LaTeX gives you typesetting quality and version control that no word processor matches, and charges for it in a document language you have to learn. Whether that trade is worth making depends almost entirely on whether you already write LaTeX for other reasons.",
    takeaways: [
      "LaTeX buys typographic consistency and a plain-text source under version control.",
      "It charges a document language for a layout, which is a poor trade if you do not already write it.",
      "The output is indistinguishable to a recruiter and identical to a parser.",
      "Overleaf is how most people use it — a browser editor with the compiler attached.",
      "The density and restraint people admire are properties of the layout, not of the engine.",
    ],
    sections: [
      {
        heading: "What LaTeX actually buys you",
        body: [
          "Typographic consistency you do not have to maintain. Spacing, alignment, hyphenation and vertical rhythm are handled by the engine rather than by you nudging things, so a LaTeX resume does not drift out of alignment when you add a bullet — which is the single most common way a Word resume degrades over five years of edits.",
          "Plain-text source. The document is a text file, so it lives in git with a real history, diffs sensibly, and can be regenerated identically in ten years. For anyone who already keeps their life in version control, that is genuinely valuable.",
          "And a specific look. LaTeX resumes are recognisable — tight, dense, Computer Modern or a close relative, no colour — and in the fields where they are common that look reads as fluent rather than as plain.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "A language, for a layout. Changing the spacing above a section heading in a template you did not write means reading someone else's macros. Adding a section that the template did not anticipate can mean an hour with documentation. None of that is hard if you write LaTeX weekly; all of it is disproportionate if you do not.",
          "It is also unforgiving about length. Getting a LaTeX resume from a page and a tenth down to exactly one page is a real editing session, where a word processor lets you nudge a margin. That is arguably a feature — it forces you to cut rather than compress — but it is a feature that costs time.",
          "And nothing about the output is better for the reader. A well-set resume from any editor and a LaTeX one are indistinguishable to a recruiter, and identical to a parser. The benefits are all on your side of the process, which is why the honest answer for most people is that it is not worth learning for this.",
        ],
      },
      {
        heading: "Overleaf and the common templates",
        body: [
          "Overleaf is a browser-based LaTeX editor with a compiler attached, and it is how most people who use LaTeX resumes actually use them — no local toolchain, no package installation, a preview beside the source. Its template gallery is where the well-known resume templates circulate.",
          "The ones you will encounter repeatedly: Jake's Resume, a dense one-page single-column layout that has become close to a default in software hiring; Deedy, a two-column layout popular a few years earlier; and the moderncv package, which is the standard choice in European academia and produces something closer to a formal CV.",
          "All are free and published for exactly this use. Pick by structure rather than by looks — whether the template has a projects section, whether it is one column, whether it expects education first — because those decisions matter and the typography differences do not.",
        ],
      },
      {
        heading: "The parsing question",
        body: [
          "A LaTeX-compiled PDF contains real selectable text and parses as well as anything else. The format is not a risk in itself. Two specific things in LaTeX resumes occasionally are.",
          "Ligatures and font encoding can turn a copy-pasted \"fi\" into something odd in older setups; using a modern engine and font package avoids it. And any template using an icon font for contact details renders your email as a glyph plus text, where the glyph contributes nothing — harmless, unless the icon has replaced a label the parser needed.",
          "Run the same check you would run on anything: export, select all, paste into a plain text file, and read what comes out. If your name, dates and titles survive in order, the document is fine.",
        ],
      },
      {
        heading: "The honest recommendation",
        body: [
          "If you already write LaTeX, use it. The version control alone justifies it and the learning cost is already paid.",
          "If you do not, the reasons to start are thin. What people actually admire in LaTeX resumes — the density, the restraint, the single column, the consistent spacing — are properties of the layout, not of the engine, and any competent editor reproduces them. This site does not generate LaTeX and is not going to pretend otherwise; what it produces is the same shape of document with the same real-text export, editable without a compiler.",
          "The one case where LaTeX is genuinely required rather than preferred is an academic CV in a field where a specific class file is expected. That is a real constraint, and it is worth knowing that it applies to a small number of people.",
        ],
      },
    ],
    compare: {
      heading: "LaTeX against an editor",
      columns: ["", "LaTeX", "A resume editor"],
      rows: [
        [
          "Typesetting",
          "Handled by the engine and never drifts",
          "Handled by the template, and also does not drift",
        ],
        [
          "Source",
          "Plain text, diffs cleanly, lives in git",
          "Stored as structured data, versioned by the tool",
        ],
        [
          "Editing cost",
          "Reading someone else's macros to move a heading",
          "Direct, with a live preview",
        ],
        [
          "Getting to one page",
          "A real editing session",
          "Immediate feedback as you cut",
        ],
        [
          "What the reader sees",
          "A well-set PDF",
          "The same well-set PDF",
        ],
        [
          "Worth it when",
          "You already write LaTeX for other reasons",
          "You do not",
        ],
      ],
    },
    checklist: {
      heading: "If you are using LaTeX",
      items: [
        "Pick the template by structure — projects section, column count, section order",
        "Use a modern engine and font package so ligatures extract cleanly",
        "Avoid templates that render contact details as icon glyphs with no text label",
        "Run the copy-paste check on the compiled PDF like any other file",
        "Keep the source in version control — it is most of the reason to bother",
        "Get to one page by cutting, not by fighting the spacing macros",
        "Have a plan for the employer who asks for an editable file",
      ],
    },
    templates: {
      heading: "The same restraint, without a compiler",
      blurb:
        "Tight, plain, single column, no colour — the properties that make LaTeX resumes look the way they do. This site does not generate LaTeX and will not pretend to; what it produces is this shape, editable without a toolchain.",
      category: "minimal",
    },
    faqs: [
      {
        question: "Should I use LaTeX for my resume?",
        answer:
          "If you already write LaTeX, yes — consistent typesetting and a plain-text source under version control are real advantages. If you do not, learning a document language to produce a layout you can get elsewhere is a poor trade, and the reader cannot tell the difference.",
      },
      {
        question: "Is a LaTeX resume ATS-friendly?",
        answer:
          "Yes. A compiled PDF contains real selectable text and parses as well as any other PDF. Watch only for templates that render contact details as icon glyphs without text labels, and run the copy-paste check on the export as you would with anything else.",
      },
      {
        question: "What is the best LaTeX resume template?",
        answer:
          "Jake's Resume for software and new-grad engineering roles, moderncv for European academic CVs, and Deedy if you want two columns and have checked the parse. Choose by structure — does it have a projects section, is it one column, does education come first — rather than by typography.",
      },
      {
        question: "Do I need Overleaf to write a LaTeX resume?",
        answer:
          "No, but it is the easiest route: a browser editor with the compiler attached, so there is no local toolchain to install. A local setup gives you offline editing and full control, which matters if the document lives in git alongside everything else you write.",
      },
      {
        question: "Can I convert a LaTeX resume to Word?",
        answer:
          "Not cleanly. Converters exist and they produce something that needs a full rebuild afterwards, because LaTeX's spacing model does not map onto a word processor's. If an employer asks for an editable file, the practical answer is to rebuild the content in the format they asked for rather than to convert.",
      },
    ],
    related: ["jakes-resume-template", "ats-friendly-resume", "resume-format"],
  },
  {
    slug: "federal-resume",
    title: "The federal resume: why it breaks every other rule",
    metaTitle: "Federal Resume Format — Length, Sections, USAJOBS ({year}) | meniacv",
    description:
      "A federal resume is four to six pages and includes hours per week, supervisor details and salary. What USAJOBS requires, why the rules are different, and how to write one.",
    eyebrow: "Formats",
    updated: "2026-08-01",
    intro:
      "Almost every piece of resume advice — one page, cut ruthlessly, no personal details, lead with impact — is wrong for a US federal application. The federal resume is a different genre with a different reader and a different failure mode, and applying private-sector instincts to it is the most common reason qualified applicants are rated ineligible before a human ever assesses them.",
    takeaways: [
      "Four to six pages is normal. A one-page federal resume is incomplete, not concise.",
      "You are assessed against a written qualification standard — anything omitted cannot be credited.",
      "Hours per week, salary or grade, and supervisor contact details are mandatory, not optional detail.",
      "The announcement's specialised experience statement is effectively the marking scheme.",
      "Use the announcement's own terminology. A rater will not reliably credit a synonym.",
    ],
    sections: [
      {
        heading: "Why the rules are different",
        body: [
          "A federal hiring specialist is not forming an impression. They are determining, against a written standard, whether you meet the qualification requirements for a specific grade — and they can only credit what is documented. If your resume does not state that you performed a duty, for how long, and at what level, it did not happen as far as the rating is concerned.",
          "That makes omission the dominant risk. In the private sector, an unnecessary detail costs you a reader's attention; in a federal application, a missing detail costs you the job outright, and there is no follow-up question. The whole document is written defensively as a result.",
          "This is also why length inverts. Four to six pages is normal, and applicants regularly submit more. A one-page federal resume is not tight, it is incomplete.",
        ],
      },
      {
        heading: "What must be on it",
        body: [
          "The specific fields matter, and their absence is what gets applications screened out.",
        ],
        list: [
          "Full contact details, plus citizenship status.",
          "For every position: job title, employer, full address, start and end dates including month and year, and hours worked per week.",
          "Salary or grade for each position — GS grade and step if the role was federal.",
          "Supervisor's name and telephone number, and whether they may be contacted.",
          "Detailed duties for each role, written to match the language of the announcement rather than compressed into three bullets.",
          "Education with the institution's full name, location, degree, completion date and relevant coursework or credit hours.",
          "Certifications, licences, training courses, awards, security clearances, and any veterans' preference or eligibility you are claiming.",
        ],
      },
      {
        heading: "Reading the announcement properly",
        body: [
          "A USAJOBS announcement contains the qualification standard and the specialised experience statement, and those paragraphs are effectively the marking scheme. Whatever they describe as required specialised experience is what a rater will search your resume for, in something close to the announcement's own words.",
          "So the correct process runs backwards from the announcement. Take each requirement, find the experience in your history that satisfies it, and write a passage that demonstrates it explicitly — using the announcement's terminology, because a rater matching \"acquisition planning\" will not credit your \"procurement scheduling\" without being sure they are the same thing.",
          "Announcements also specify the grade you are applying at, and the qualification standard for each grade is different. Applying to several grades of the same series usually means several versions of the document, not one.",
        ],
      },
      {
        heading: "How to write the duties",
        body: [
          "Longer and more complete than a private-sector bullet, and still not a job description. The private-sector rule — verb, specifics, result — still improves a federal resume; what changes is that you cannot cut the routine duties to make room for the impressive ones, because the routine duties are what the qualification standard is written against.",
          "So the shape is: a paragraph or a longer bullet list per role covering the full scope of what you did, with the specialised experience the announcement names appearing plainly and early, and accomplishments included rather than substituted for duties. Say both what the job involved and what you achieved in it.",
          "Do not use acronyms without expanding them at first use, even ones that seem universal within your agency. And do not assume institutional knowledge — the rater may not be from your field.",
        ],
      },
      {
        heading: "Building and submitting it",
        body: [
          "USAJOBS provides its own resume builder that enforces the required fields, which is the safest route for a first application because it will not let you omit a mandatory item. You may also upload your own document, and many announcements accept both; where an announcement specifies one, follow it exactly, because non-compliance is an eligibility failure rather than a stylistic one.",
          "If you upload your own, a plain single-column format with clear headings and complete fields is what you want. Any of the simple templates here will produce that shape — allow it to run to several pages, and treat the length as correct rather than as something to fix.",
          "One warning worth stating plainly: never carry classified or sensitive material into the document to demonstrate experience. Describe the function and the scope, not the content.",
        ],
      },
    ],
    compare: {
      heading: "Federal against private-sector",
      columns: ["", "Private-sector resume", "Federal resume"],
      rows: [
        [
          "Length",
          "One to two pages",
          "Four to six, often more",
        ],
        [
          "Editing",
          "Cut ruthlessly for relevance",
          "Omission is the dominant risk — include everything credited",
        ],
        [
          "Hours per week",
          "Never stated",
          "Mandatory for every position",
        ],
        [
          "Salary",
          "Never stated",
          "Required, with GS grade and step where applicable",
        ],
        [
          "Supervisor",
          "Never listed",
          "Name and phone number for each role",
        ],
        [
          "Duties",
          "Compressed into three to five outcome bullets",
          "Full scope, in the announcement's terminology",
        ],
      ],
    },
    checklist: {
      heading: "Every field a federal resume needs",
      items: [
        "Citizenship status",
        "For each role: job title, employer, full address, month and year dates",
        "Hours worked per week for every position",
        "Salary, or GS grade and step for federal roles",
        "Supervisor's name and phone number, and whether they may be contacted",
        "Detailed duties matching the announcement's language",
        "Education with full institution name, location and completion date",
        "Certifications, training, awards, clearances",
        "Veterans' preference or other eligibility being claimed",
        "Acronyms expanded at first use",
      ],
    },
    templates: {
      heading: "Templates for an uploaded federal resume",
      blurb:
        "Plain single-column layouts with clear headings, which is what you want if the announcement accepts an upload. Let it run to several pages — the length is correct here rather than something to fix.",
      category: "one-column",
    },
    faqs: [
      {
        question: "How long should a federal resume be?",
        answer:
          "Four to six pages is normal and longer is common. Length is not a fault in a federal application — the resume is assessed against a written qualification standard, and anything you leave out cannot be credited. A one-page federal resume reads as incomplete rather than as concise.",
      },
      {
        question: "What must a federal resume include?",
        answer:
          "Citizenship, and for every position: job title, employer with full address, month and year dates, hours per week, salary or GS grade, supervisor's name and phone number, and detailed duties. Plus education with completion dates, certifications, training, awards, clearances and any veterans' preference claimed.",
      },
      {
        question: "Should I use the USAJOBS resume builder?",
        answer:
          "For a first application, yes — it enforces the mandatory fields, so you cannot accidentally omit hours per week or a supervisor's details. Once you know the requirements, an uploaded document gives you better control over structure, provided the announcement permits an upload.",
      },
      {
        question: "How do I match the specialised experience statement?",
        answer:
          "Work backwards from the announcement. Take each requirement it lists, find the experience that satisfies it, and describe that experience using the announcement's own terminology. A rater matching a specific phrase will not reliably credit a synonym, so the wording is doing real work.",
      },
      {
        question: "Can I use my private-sector resume for a federal job?",
        answer:
          "No. It will be missing hours per week, salary or grade, supervisor contact details and full employer addresses, any of which can make you ineligible before your experience is assessed. The content transfers; the document has to be rebuilt to the federal requirements.",
      },
    ],
    related: ["resume-format", "resume-length", "what-to-put-on-a-resume"],
  },
  {
    slug: "acting-resume",
    title: "The acting resume, and how it differs from every other kind",
    metaTitle: "Acting Resume — Format, Sections and Template ({year}) | meniacv",
    description:
      "An acting resume is one page, attached to a headshot, and organised by medium rather than chronology. What casting reads, what to list, and the conventions that mark an amateur.",
    eyebrow: "Formats",
    updated: "2026-08-01",
    intro:
      "An acting resume is not a resume in the sense the rest of this site means. It is a credits list, stapled to the back of a headshot, read in about four seconds by someone deciding whether to see you. Chronology does not matter, outcomes do not matter, and the conventions are specific enough that getting them wrong marks you before a single credit is read.",
    takeaways: [
      "One page, trimmed to 8x10 inches, stapled to the back of the headshot.",
      "Credits are grouped by medium and ordered by strength — not chronologically.",
      "Film and TV take the billing level; theatre takes the character name. Mixing them is a tell.",
      "Never list background or extra work. Casting reads its presence as a signal.",
      "Special skills is genuinely searched. You must be able to perform every one on the day.",
    ],
    sections: [
      {
        heading: "The shape of the document",
        body: [
          "One page, always, trimmed to 8x10 inches so it sits flush against the back of the headshot it is stapled to. Not two pages, not a page and a half, and not a full letter page with an inch hanging off the edge — that last detail is small and it is noticed immediately.",
          "At the top: your name in large type, your union status if you have one, and your contact details. In practice that means your agent's contact details if you are represented, and your own email and phone if you are not. Never a home address.",
          "Under that, your physical stats — height, hair, eyes, and vocal range for musical theatre. Not weight, and not age. Casting works in playable age ranges, and stating a number narrows you for no benefit.",
        ],
      },
      {
        heading: "Credits, organised by medium",
        body: [
          "The central section, and it is grouped by medium rather than by date. Film, then television, then theatre, is the conventional order for screen-focused work; theatre first for a stage career. Within each, list your strongest and most recognisable work first — this is the one resume that is explicitly not chronological.",
          "Each credit is three columns: the production, the role type, and the company or director. What goes in the role column differs by medium, and this is where amateurs are spotted.",
        ],
        list: [
          "Film and TV: the role's billing, not the character name — Lead, Supporting, Co-Star, Guest Star, Recurring, Featured. Then the production company or director.",
          "Theatre: the character name, then the theatre and the director. This is the opposite convention to screen and it matters.",
          "Never list background or extra work. It is understood as a signal that you have nothing else, and casting directors regard listing it as a tell.",
          "Do not pad with student films you were barely in, or with a role you auditioned for and did not get. Both get found out.",
        ],
      },
      {
        heading: "Training and special skills",
        body: [
          "Training carries real weight, particularly early on. List the institution or teacher, the discipline, and the years — \"Meisner technique, two years, with [teacher]\" is far more informative than \"acting classes\". Named teachers and recognised programmes are read closely by people who know the field.",
          "Special skills is the section people treat as a joke and casting genuinely uses. It is searched. Dialects with the specific accents named, instruments with your actual level, sports, stage combat certification, driving licences including manual transmission and motorcycle, languages spoken fluently, dance styles.",
          "The rule is that you must be able to do it on the day, on camera, without warning. Listing a skill you half-have is how you end up on a set being asked to demonstrate it. \"Conversational French\" is a fine entry; \"French\" when you did two years at school is not.",
        ],
      },
      {
        heading: "The conventions that mark an amateur",
        body: [
          "A short list, and every one of them is avoidable.",
        ],
        list: [
          "A resume not trimmed to 8x10 and stapled to the headshot.",
          "Background or extra work listed as a credit.",
          "Character names in a film or TV credit instead of the billing level.",
          "Age, date of birth or weight anywhere on the page.",
          "A home address.",
          "Inflated credits — a co-star role described as a lead. The industry is small and this gets checked.",
          "An objective statement or a summary paragraph. Neither belongs on an acting resume.",
        ],
      },
      {
        heading: "Building one",
        body: [
          "Any plain single-column template gives you the structure — name block, a stats line, then grouped sections with three-column entries — and the whole document is a credits table, so simplicity is the correct choice. No colour, no design, no photo on the resume itself, because the headshot is the photo.",
          "Keep a master version with every credit and cut a submission version per project, exactly as you would for any other kind of application. A resume aimed at a comedy audition should not lead with your Chekhov.",
          "One practical note: because the document is a table of credits rather than prose, most general resume advice on this site does not apply to it. What does carry over is the discipline of not inflating anything, which matters more in a field this small than in any other.",
        ],
      },
    ],
    compare: {
      heading: "The two credit conventions",
      columns: ["", "Film & television", "Theatre"],
      rows: [
        [
          "Middle column holds",
          "The billing level",
          "The character name",
        ],
        [
          "Examples",
          "Lead, Supporting, Co-Star, Guest Star, Recurring, Featured",
          "Hamlet, Blanche DuBois, Ensemble",
        ],
        [
          "Right column holds",
          "Production company or director",
          "Theatre and director",
        ],
        [
          "Ordering",
          "Strongest and most recognisable first",
          "Strongest and most recognisable first",
        ],
        [
          "Common tell",
          "Listing the character name instead of the billing",
          "Listing a billing level instead of the character",
        ],
      ],
    },
    checklist: {
      heading: "Before it goes out",
      items: [
        "Trimmed to 8x10 and stapled to the headshot",
        "Name, union status and contact details at the top",
        "Agent's details if represented; your own if not. Never a home address",
        "Height, hair, eyes and vocal range — no age, no date of birth, no weight",
        "Credits grouped by medium, strongest first within each group",
        "Billing level for screen; character name for theatre",
        "No background or extra work anywhere",
        "Training with institution, discipline and years",
        "Every special skill performable on demand, on camera, without warning",
      ],
    },
    templates: {
      heading: "Templates for a credits page",
      blurb:
        "The document is a table of credits, so plain is correct — no colour, no design, and no photo on the resume itself, because the headshot is the photo. These are the stripped-back layouts that suit it.",
      category: "minimal",
    },
    faqs: [
      {
        question: "What should be on an acting resume?",
        answer:
          "Name, union status and contact details at the top; height, hair, eyes and vocal range; credits grouped by medium — film, television, theatre — with the production, the role level or character, and the company or director; then training and special skills. One page, trimmed to 8x10.",
      },
      {
        question: "How do you list credits on an acting resume?",
        answer:
          "By medium, not by date, with your strongest work first within each group. For film and television, list the billing level — Lead, Supporting, Co-Star, Guest Star — rather than the character name. For theatre, list the character name with the theatre and director. Mixing those two conventions is a common tell.",
      },
      {
        question: "Should I put extra work on my acting resume?",
        answer:
          "No. Background and extra credits are read as evidence that you have nothing else to list, and casting directors treat their presence as a signal rather than as experience. Leave the section shorter instead.",
      },
      {
        question: "What are special skills on an acting resume?",
        answer:
          "Anything you can perform on demand, on camera, without preparation: named dialects, instruments with your real level, sports, stage combat certification, driving including manual and motorcycle, languages, dance styles. The section is genuinely searched, and listing something you half-have is how you get caught out on set.",
      },
      {
        question: "Should an acting resume include my age?",
        answer:
          "No — not your age, date of birth or weight. Casting works in playable ranges, and a stated number narrows the roles you will be considered for without giving anyone information they need.",
      },
    ],
    related: ["what-to-put-on-a-resume", "resume-format", "resume-mistakes"],
  },
  {
    slug: "references-on-resume",
    title: "References: leave them off, and prepare them anyway",
    metaTitle: "References on a Resume — Do You Need Them? ({year}) | meniacv",
    description:
      "Why \"references available on request\" should come off your resume, when a separate reference page is asked for, and how to prepare referees before anyone calls them.",
    eyebrow: "Sections",
    updated: "2026-08-01",
    intro:
      "Two questions get conflated here. Whether references belong on your resume — no, and the line saying they are available on request should go too. And whether you need references at all — yes, absolutely, and the work of preparing them is real. Getting the first one right takes ten seconds; the second is what actually affects whether you get the offer.",
    takeaways: [
      "Do not list referees on the resume, and delete \"references available on request\" as well.",
      "Provide them as a separate page, matching your resume's header, when they are asked for.",
      "Three to four names, each with title, organisation, relationship and contact details.",
      "The best referee managed you directly and recently. Proximity beats seniority.",
      "Brief them with the job description. A referee caught cold gives generic praise, which is worthless.",
    ],
    sections: [
      {
        heading: "Take them off the resume",
        body: [
          "Do not list referees on the resume itself. It spends space on contact details for other people at the stage where the reader is deciding whether to spend six more seconds on you, and it hands out your former colleagues' phone numbers to every organisation you apply to — which they did not agree to and which is a real privacy problem in a document that gets forwarded.",
          "Delete \"references available on request\" as well. It is universally assumed, it has been for twenty years, and the line spends a full row of a page you are trying to fit onto one or two saying something no reader learns anything from. Recruiters have described it as the clearest single sign that a resume was written from a template last updated in 1998.",
          "The space it frees is not nothing. On a crowded one-page resume, that line is a bullet you could not fit.",
        ],
      },
      {
        heading: "The separate reference page",
        body: [
          "When references are asked for — usually late, often after an interview, sometimes as part of an application form — provide them as a separate document. It should match your resume's header exactly, same name block, same typeface, so the two obviously belong together.",
          "Three to four referees, and for each: name, current job title, organisation, relationship to you, and how to reach them. \"Direct manager at Acme, 2021–2024\" tells the reader what kind of reference this will be, which is the single most useful thing you can add.",
          "Some applications, particularly academic and government ones, specify how many referees and of what kind — a supervisor, an academic referee, a professional character reference. Follow that exactly. Substituting a colleague for a required line manager is treated as non-compliance rather than as a near enough.",
        ],
        list: [
          "Three to four names, all of whom have said yes.",
          "Name, title, organisation, relationship, email and phone.",
          "Same header and typography as your resume.",
          "Order them so the most relevant referee is first.",
          "One page, and no explanation of why each was chosen — the relationship line does that.",
        ],
      },
      {
        heading: "Choosing and preparing referees",
        body: [
          "The best referee is someone who managed you directly, recently, on work resembling the job you are applying for. Seniority is worth less than proximity: a team lead who saw your work daily gives a far better reference than a director who knows your name.",
          "Ask before you list anyone, every time, and ask in a way that gives them room to decline — \"would you be comfortable giving me a strong reference for this kind of role\" rather than \"can I put you down\". A lukewarm reference from someone who felt obliged is worse than no reference, and phrasing the question properly is how you find out in advance.",
          "Then brief them. Send the job description, tell them what the role is and which parts of your work are most relevant, and let them know roughly when a call might come. A referee who knows what is being assessed gives specific, useful answers; one caught cold gives generic praise, which is nearly worthless.",
        ],
      },
      {
        heading: "What references are actually for",
        body: [
          "Increasingly, less than people assume. Many large employers now restrict what they will confirm about a former employee to dates and job title, on legal advice, so a formal reference from a big company may be a two-line confirmation regardless of how they felt about you.",
          "That has shifted the weight onto informal and back-channel checks — a hiring manager who knows someone at your last employer and asks quietly. You cannot control those, but you can be aware that they happen, particularly in small industries, and that they are why leaving well matters more than any document.",
          "It also means the referees you choose should be people who will pick up the phone and speak freely, which often points towards a former manager who has since moved on rather than one still bound by their employer's policy.",
        ],
      },
    ],
    compare: {
      heading: "On the resume, or on a separate page",
      columns: ["", "On the resume", "On a separate page"],
      rows: [
        [
          "Space cost",
          "A full row, at the stage where every line competes",
          "None — it is a different document",
        ],
        [
          "Privacy",
          "Your colleagues' numbers go to every employer you apply to",
          "Shared only with employers who reached the reference stage",
        ],
        [
          "When the reader wants it",
          "They do not, at this stage",
          "Late, usually after an interview",
        ],
        [
          "\"Available on request\"",
          "Universally assumed since about 2005",
          "Not needed there either",
        ],
      ],
    },
    checklist: {
      heading: "Preparing your references",
      items: [
        "Nothing about references appears on the resume itself",
        "A separate one-page document with the same header and typeface",
        "Three to four referees, ordered most relevant first",
        "Each one: name, title, organisation, relationship to you, email and phone",
        "Every one of them has said yes, asked in a way that let them decline",
        "Each has the job description and knows roughly when a call might come",
        "Any application-specified referee type — supervisor, academic — followed exactly",
      ],
    },
    templates: {
      heading: "Templates whose header you can reuse",
      blurb:
        "A reference page should look like it belongs to your resume. Any of these gives you a header block you can lift verbatim onto a second document, so the two obviously came from the same person.",
      category: "simple",
    },
    faqs: [
      {
        question: "Should you put references on a resume?",
        answer:
          "No. Listing referees spends space on other people's contact details at the stage where a reader is deciding whether to keep reading, and it exposes your former colleagues' numbers to every employer you apply to. Provide them separately, when asked.",
      },
      {
        question: "Should I write \"references available on request\"?",
        answer:
          "No. It has been universally assumed for two decades, so the line conveys nothing, and it is one of the clearest signals that a resume was built from an outdated template. Delete it and use the row for a bullet.",
      },
      {
        question: "How do I write a reference page?",
        answer:
          "One page, matching your resume's header exactly. Three to four referees, each with name, job title, organisation, your relationship to them and their contact details. Order them with the most relevant first, and make sure every one of them has agreed in advance.",
      },
      {
        question: "How many references do I need?",
        answer:
          "Three is standard, four is comfortable, more is unnecessary. If the application specifies a number or a type — a direct supervisor, an academic referee — follow that exactly, because those requirements are checked for compliance rather than judged.",
      },
      {
        question: "Who should I ask to be a reference?",
        answer:
          "Someone who managed you directly and recently, on work similar to the job you are applying for. Proximity beats seniority — a team lead who saw your work every day gives a far more useful reference than a director who knows your name. Ask in a way that lets them decline, then brief them with the job description.",
      },
    ],
    related: ["what-to-put-on-a-resume", "resume-mistakes", "how-to-write-a-resume"],
  },
  {
    slug: "certifications-on-resume",
    title: "How to list certifications on a resume",
    metaTitle: "Certifications on a Resume — Where and How to List Them ({year}) | meniacv",
    description:
      "Where certifications belong, how to format them, which ones are worth listing, and how to handle expired credentials or ones you are still working towards.",
    eyebrow: "Sections",
    updated: "2026-08-01",
    intro:
      "A certification is one of the few things on a resume that is externally verified — someone other than you decided you passed. That makes it more valuable than most of what surrounds it, and it is routinely buried at the bottom of an education section where nobody looks. Where it goes depends on one question: is it a requirement for the job, or a supporting detail?",
    takeaways: [
      "A certification is externally verified, which makes it more valuable than most of what surrounds it.",
      "If it is a requirement for the job, it goes high on the page or in the header.",
      "If it is supporting, it gets its own section below experience — never buried in education.",
      "Four elements per entry: credential name, issuing body, date, and expiry or licence number.",
      "In progress is fine if you state the status and a date. Expired comes off unless labelled as lapsed.",
    ],
    sections: [
      {
        heading: "Where they go",
        body: [
          "If the certification is a requirement — a nursing licence, a CPA, a CDL, a security clearance, a teaching credential, a trade licence — it goes high on the page and gets its own section, or goes in the header beside your name. A hiring manager screening for licensed applicants is looking for exactly that, and if they have to find it on page two you have made their job harder for no reason.",
          "If it is a supporting credential — a cloud certification, a project management qualification, a course you completed — it gets its own section below experience and education. Still visible, still verified, not competing with your work history for the top of the page.",
          "If it is neither, it may not belong at all. A completion certificate for a two-hour online course is not a credential, and listing several of them together reads as padding rather than as development.",
        ],
      },
      {
        heading: "The format",
        body: [
          "Four elements per entry: the full name of the credential, the issuing body, the date awarded, and where relevant an expiry date or licence number. Consistency across entries matters more than the exact arrangement.",
        ],
        list: [
          "\"Registered Nurse (RN), California Board of Registered Nursing, licence #123456, active through 2027\"",
          "\"AWS Certified Solutions Architect – Associate, Amazon Web Services, 2025\"",
          "\"Project Management Professional (PMP), Project Management Institute, 2023\"",
          "Write the full name at least once, with the acronym in brackets — parsers and people both search for both forms.",
          "Include the state or jurisdiction for anything licensed, because a licence is jurisdictional and a reader needs to know whether it applies where the job is.",
        ],
      },
      {
        heading: "In progress, expired, and lapsed",
        body: [
          "In progress is fine to list, provided you say so plainly and give a date. \"CPA — three of four sections passed, final exam scheduled March 2026\" is honest and useful. \"CPA candidate\" with no detail is vague enough to look like an attempt to imply more than is true, and an interviewer will ask.",
          "Expired credentials come off, unless the underlying experience matters and you say clearly that it has lapsed. A certification that quietly expired two years ago and is still listed as current is a small dishonesty that becomes a large one if the employer verifies, which for licensed professions they always do.",
          "For anything with continuing-education requirements, the active-through date is doing real work. State it.",
        ],
      },
      {
        heading: "Which ones are worth the space",
        body: [
          "Anything that is a legal or contractual requirement for the role, always. Anything the job posting names, always — that one is being screened for. Industry-recognised credentials that a practitioner would know by name: AWS and Azure certifications for infrastructure work, PMP and PRINCE2 for delivery, CISSP for security, Six Sigma belts in manufacturing and operations, CPA and CFA in finance.",
          "Vendor certifications for products the employer uses are worth more than their general reputation suggests — an Epic or Salesforce certification is often the specific thing that moves an application forward, because it removes a training cost.",
          "What is not worth the space: online course completions with no assessment, badges from platforms nobody in the field recognises, and long lists of small credentials that together suggest activity rather than expertise. Three meaningful certifications beat eleven.",
        ],
      },
    ],
    compare: {
      heading: "Where each kind belongs",
      columns: ["Kind", "Where it goes", "How to write it"],
      rows: [
        [
          "Licence required for the role",
          "Header or a section near the top",
          "\"Registered Nurse (RN), California BRN, licence #123456, active through 2027\"",
        ],
        [
          "Industry credential",
          "Own section below experience",
          "\"AWS Certified Solutions Architect – Associate, Amazon Web Services, 2025\"",
        ],
        [
          "In progress",
          "Same section, labelled",
          "\"CPA — three of four sections passed, final exam March 2026\"",
        ],
        [
          "Expired",
          "Off the page, or labelled as lapsed",
          "Only if the underlying experience matters to this role",
        ],
        [
          "Course completion, no assessment",
          "Usually nowhere",
          "Several together read as padding rather than as development",
        ],
      ],
    },
    checklist: {
      heading: "How each entry should read",
      items: [
        "Full credential name, with the acronym in brackets at least once",
        "The issuing organisation named — several bodies certify the same thing",
        "Date awarded, and expiry or active-through date where one exists",
        "Jurisdiction stated for anything licensed",
        "Licence number where it is normally quoted",
        "Requirements near the top of the page; supporting credentials below experience",
        "In-progress entries carry a status and a date",
        "Nothing expired presented as current",
      ],
    },
    templates: {
      heading: "Templates with a proper credentials section",
      blurb:
        "Formal layouts that carry a certifications block near the top without it looking bolted on — which is what licensed fields need, since the credential is the eligibility gate rather than a supporting detail.",
      category: "professional",
    },
    faqs: [
      {
        question: "Where do certifications go on a resume?",
        answer:
          "In their own section below experience for supporting credentials, and high on the page — a dedicated section near the top, or beside your name in the header — when the certification is a requirement for the role, like a nursing licence, CPA or trade licence.",
      },
      {
        question: "How do you list certifications on a resume?",
        answer:
          "Full credential name, issuing organisation, date awarded, and expiry or licence number where relevant. Write the full name with the acronym in brackets at least once, and include the jurisdiction for anything licensed, since a licence only applies where it was issued.",
      },
      {
        question: "Should I list certifications I am still working on?",
        answer:
          "Yes, if you state the status and a date — \"three of four sections passed, final exam March 2026\". Vague phrasing like \"candidate\" with no detail reads as an attempt to imply more than is true, and it is the first thing an interviewer will probe.",
      },
      {
        question: "Should I include expired certifications?",
        answer:
          "Generally no. Include one only if the underlying experience matters to the role and you label it as lapsed. An expired credential presented as current is a small dishonesty that becomes serious when verified, and licensed professions verify every time.",
      },
      {
        question: "Do certifications go in the education section?",
        answer:
          "Not if they matter. Education is where a reader looks for degrees, and a licence buried there is doing a fraction of the work it should. Give certifications their own section so they are findable in a scan.",
      },
    ],
    related: ["education-on-resume", "what-to-put-on-a-resume", "resume-skills"],
  },
  {
    slug: "education-on-resume",
    title: "The education section: what to include and where to put it",
    metaTitle: "Education on a Resume — Format, Order, GPA ({year}) | meniacv",
    description:
      "Where the education section goes, what to list at each career stage, whether to include your GPA, and how to handle an unfinished degree or a long-ago graduation.",
    eyebrow: "Sections",
    updated: "2026-08-01",
    intro:
      "The education section is simple for about three years of your life and then quietly becomes a source of small decisions: does it stay at the top, does the GPA come off, does the graduation year date you, what do you do about the degree you did not finish. None of these is difficult, but getting them wrong is a common way to make a resume read older or thinner than it is.",
    takeaways: [
      "Above experience while you are a student and for about two years after; below it thereafter.",
      "The section gets shorter as your career gets longer, and that is the correct direction.",
      "Include a GPA above roughly 3.4, and only within about three years of graduating.",
      "Drop high school entirely once you hold a degree.",
      "An unfinished degree is listed by institution, subject and years — never as though completed.",
    ],
    sections: [
      {
        heading: "Where it goes",
        body: [
          "Above experience while you are a student and for roughly the first two years after graduating. Below experience for everyone else, permanently.",
          "The switch is about which is the stronger argument, not about elapsed time exactly. A recent graduate's degree is the most substantial thing they have; two jobs later, it is a credential that needs to be present rather than an argument that needs to be made. Someone reading a resume with eight years of experience and a degree at the top assumes the experience is weak.",
          "There is one exception: fields where the qualification is the gate. Medicine, law, academia and some engineering disciplines keep education prominent for longer, because the reader is checking it first regardless of your experience.",
        ],
      },
      {
        heading: "What to list at each stage",
        body: [
          "The section gets shorter as your career gets longer, and that is the correct direction.",
        ],
        list: [
          "Current student: institution, degree, expected graduation date, GPA if strong, relevant coursework, honours, thesis topic, study abroad.",
          "Recent graduate (0–2 years): the same, minus coursework unless the role is technical and you have little else.",
          "Mid-career (3–10 years): institution, degree, graduation year. Honours if genuinely distinguishing. Nothing else.",
          "Senior (10+ years): institution and degree. The year becomes optional.",
          "Any stage: drop high school entirely once you hold a degree. It is assumed, and the line is better spent elsewhere.",
        ],
      },
      {
        heading: "GPA, honours and the graduation year",
        body: [
          "Include a GPA above roughly 3.4, or a 2:1 and above in the UK system, and only within about three years of graduating. After that it comes off regardless of how good it was — a strong GPA on the resume of someone eight years into a career reads as reaching for something.",
          "Below that threshold, leave it out. An omitted GPA passes without comment; a weak one stated is the first thing a reader's eye lands on. Nobody has ever been rejected for not listing a GPA.",
          "The graduation year is a genuine judgement call later in a career, because it is the clearest age signal on the page and age discrimination is real. Removing it is legitimate and common past about twenty years of experience. Removing it while listing every job since 1998 achieves nothing, so the two decisions go together — cap your experience section at ten to fifteen years and the year becomes unremarkable either way.",
        ],
      },
      {
        heading: "Unfinished, in progress, and international degrees",
        body: [
          "A degree in progress: list it with the expected completion date. \"BSc Computer Science, University of Manchester, expected June 2027\" is complete information and entirely normal.",
          "A degree you did not finish: list the institution, the subject and the years attended, without implying a qualification. \"Economics coursework, University of Leeds, 2018–2020\" is honest and still communicates the study. Never list a degree you did not complete as though you did — this is the single most commonly verified fact on a resume and the consequence of being caught is not a rejection but a dismissal.",
          "An international degree: give the local equivalent alongside the original name, because a reader who does not recognise a qualification cannot credit it. Convert grades to the target country's scale, or state both. If the degree needs formal recognition to practise in the country you are applying to, say where you are in that process.",
        ],
      },
    ],
    compare: {
      heading: "What to include, by stage",
      columns: ["Stage", "What to list", "Where it goes"],
      rows: [
        [
          "Current student",
          "Institution, degree, expected graduation, GPA if strong, coursework, thesis, honours",
          "Above experience",
        ],
        [
          "0–2 years out",
          "The same, minus coursework unless the role is technical",
          "Above experience",
        ],
        [
          "3–10 years",
          "Institution, degree, graduation year. Honours if distinguishing",
          "Below experience",
        ],
        [
          "10+ years",
          "Institution and degree. The year becomes optional",
          "Below experience",
        ],
        [
          "Any stage",
          "No high school once you hold a degree",
          "—",
        ],
      ],
    },
    checklist: {
      heading: "Getting the section right",
      items: [
        "Positioned correctly for your career stage",
        "Institution, degree and year on every entry",
        "GPA only if strong and recent",
        "Coursework and thesis only while they are still doing work",
        "High school removed once you hold a degree",
        "In-progress degrees carry an expected completion date",
        "Unfinished study described without implying a qualification",
        "International degrees given a local equivalent and a converted grade",
      ],
    },
    templates: {
      heading: "Templates that handle education either way",
      blurb:
        "Section order is a choice, not a constraint — every template here reads the same whether education sits above your experience or below it. Move it as your career moves.",
      category: "classic",
    },
    faqs: [
      {
        question: "Where does education go on a resume?",
        answer:
          "Above experience while you are a student and for about two years after graduating; below experience after that. The exception is fields where the qualification gates the role — medicine, law, academia — where education stays prominent regardless of career stage.",
      },
      {
        question: "How do you list education on a resume?",
        answer:
          "Institution, degree, and graduation year, with location if it is not obvious. Students and recent graduates add GPA if strong, relevant coursework, honours and thesis topic. Mid-career and beyond, the entry shrinks to two or three lines.",
      },
      {
        question: "Should I put my GPA on my resume?",
        answer:
          "Only if it is roughly 3.4 or above, and only within about three years of graduating. Below that, omit it — nobody notices a missing GPA, while a weak one stated becomes the first thing read in the section.",
      },
      {
        question: "Should I include my high school?",
        answer:
          "Only until you hold a degree or are enrolled in one. Once you have a higher qualification, the high school entry is assumed and the space is better used. While it is your highest qualification, list the school, the diploma and the year.",
      },
      {
        question: "How do I list an unfinished degree?",
        answer:
          "State the institution, the subject and the years attended without implying a qualification — \"Economics coursework, University of Leeds, 2018–2020\". If you are still enrolled, list it with an expected completion date instead. Never present an incomplete degree as completed; it is the most routinely verified claim on any resume.",
      },
      {
        question: "Should I remove my graduation year?",
        answer:
          "It is reasonable past about twenty years of experience, since it is the clearest age signal on the page. It only works if you also cap your experience section at ten to fifteen years — removing one date while listing jobs from the nineties changes nothing.",
      },
    ],
    related: ["certifications-on-resume", "college-student-resume", "what-to-put-on-a-resume"],
  },
  {
    slug: "photo-on-resume",
    title: "Should you put a photo on your resume?",
    metaTitle: "Photo on a Resume — Where It Helps and Where It Hurts ({year}) | meniacv",
    description:
      "A photo on a resume is a regional convention, not a matter of taste. Where it is expected, where it costs you, what parsers do with it, and how to get the picture right.",
    eyebrow: "Formatting",
    updated: "2026-08-01",
    intro:
      "This question has a definite answer and it is not the same answer everywhere. A photo on a resume is conventional across much of continental Europe, Asia and Latin America, and actively discouraged in the US, UK, Canada and Australia. Neither position is about aesthetics, and the reasons behind each are worth understanding — because the decision changes per application, not per person.",
    takeaways: [
      "A regional convention, not a matter of taste — and the decision changes per application.",
      "Expected across continental Europe, much of Asia and Latin America.",
      "Discouraged in the US, UK, Canada, Ireland and Australia, for discrimination-exposure reasons.",
      "Parsers ignore images entirely. What breaks things is text rendered inside one.",
      "Keep two versions. The content is identical and the photo is a template setting.",
    ],
    sections: [
      {
        heading: "Where a photo is expected",
        body: [
          "Germany, France, Spain, Italy, Austria, Switzerland, Portugal, Belgium, the Netherlands and most of continental Europe. Much of Asia, including Japan, South Korea and China, where the photo is often on a prescribed form. Much of Latin America and the Middle East.",
          "In those markets, a CV without a photo is not neutral — it reads as incomplete, and in Germany a Lebenslauf without one is noticeably unusual. The photo usually sits top-right or in a header block, and it is expected to be a formal portrait rather than a candid.",
          "The same countries typically expect date of birth and nationality alongside it. If you are including the photo because of local convention, include the rest of the convention too; a half-adapted document reads as neither.",
        ],
      },
      {
        heading: "Where it works against you",
        body: [
          "The United States, the United Kingdom, Canada, Ireland and Australia. In these markets many employers actively prefer resumes without a photo, and the reason is legal rather than stylistic: a photo introduces protected characteristics into a screening decision, which creates discrimination exposure the employer would rather not have.",
          "The practical consequences vary and none of them help you. Some larger organisations strip photos before a recruiter sees the file. Some route photo-bearing applications through a slower compliance path. Some recruiters at agencies will ask you to resend without it, because their client will not accept it. And a handful discard the application rather than handle the risk.",
          "There is no upside to weigh against that. In these markets a photo does not make you more memorable in any way that helps; the reader's job is to assess evidence, and the photo is not evidence.",
        ],
      },
      {
        heading: "What parsers do with it",
        body: [
          "Nothing. An image in a PDF contributes no characters to the extracted text, so a photo is neither a positive nor a negative signal to an applicant tracking system. The widespread claim that photos break ATS parsing is not right.",
          "What genuinely breaks things is text inside the image. If your name, job title or contact details are rendered as part of a graphic — a designed header block, a banner — that text does not exist to any parser, and you have just made your own name unsearchable. This is a real and application-ending mistake, and it is entirely separate from whether a photo is present.",
          "The check is the usual one: export the PDF, select all the text, paste it somewhere plain. If your name is not in what comes out, the header is an image.",
        ],
      },
      {
        heading: "If you are including one",
        body: [
          "A bad photo is worse than no photo, and the bar is a professional identification portrait rather than a portrait session.",
        ],
        list: [
          "Head and shoulders, facing the camera, plain uncluttered background.",
          "Even natural light. No harsh shadow, no flash, no filter.",
          "Neutral or slight expression. Dressed roughly as you would for the interview.",
          "Recent — within a couple of years, and recognisably you.",
          "Not a cropped group photo, not a holiday shot, not a selfie, not a photo with someone else's arm in it.",
          "Never text inside the image.",
        ],
      },
      {
        heading: "Applying across regions",
        body: [
          "Keep two versions. This is the whole answer for anyone applying in more than one market, and it costs almost nothing — the content is identical and the photo is a template setting rather than a rewrite.",
          "The decision is made per application, by the country the job is in, not the country you are in. A British applicant applying to a Munich office should include a photo; a German applicant applying to a London office should not. Follow the reader's convention, because they are the one whose expectations shape how the document reads.",
        ],
      },
    ],
    compare: {
      heading: "Where a photo helps and where it costs you",
      columns: ["Region", "Photo?", "Also conventional"],
      rows: [
        [
          "Germany, Austria, Switzerland",
          "Yes — its absence is noticed",
          "Date of birth, sometimes nationality and marital status",
        ],
        [
          "France, Spain, Italy, Portugal",
          "Yes",
          "Date of birth, nationality",
        ],
        [
          "UK and Ireland",
          "No",
          "Nothing beyond name, email, phone and city",
        ],
        [
          "US and Canada",
          "No — some systems strip it, some employers discard it",
          "Nothing. No age, no nationality, no marital status",
        ],
        [
          "Australia and New Zealand",
          "No",
          "Nothing beyond the basics",
        ],
        [
          "Much of Asia and Latin America",
          "Yes, often on a prescribed form",
          "Varies by country — check the specific market",
        ],
      ],
    },
    checklist: {
      heading: "If you are including one",
      items: [
        "The country the job is in expects one — not the country you are in",
        "Head and shoulders, facing the camera, plain background",
        "Even natural light, no flash, no filter",
        "Neutral or slight expression, dressed as you would for the interview",
        "Recent within a couple of years, and recognisably you",
        "Not a cropped group photo, a holiday shot or a selfie",
        "No text of any kind inside the image",
        "Date of birth and nationality included too, where the same convention expects them",
      ],
    },
    templates: {
      heading: "Templates with a photo",
      blurb:
        "Layouts that make room for a portrait properly rather than dropping one into a corner — which is what a German, French, Spanish or Italian application expects. Switch to a plain one for the US or UK and keep the content.",
      category: "photo",
      count: 9,
    },
    faqs: [
      {
        question: "Should you put a photo on your resume?",
        answer:
          "It depends entirely on where you are applying. Include one for continental Europe, much of Asia and Latin America, where it is conventional and its absence is noticed. Leave it off for the US, UK, Canada, Ireland and Australia, where many employers prefer resumes without one and some strip or reject them.",
      },
      {
        question: "Do you put a photo on a resume in the US?",
        answer:
          "No. US employers generally prefer resumes without one, because a photo introduces protected characteristics into a screening decision and creates discrimination exposure. Some organisations remove photos before review, and a few discard the application rather than handle it.",
      },
      {
        question: "Does a photo affect ATS parsing?",
        answer:
          "No — an image contributes no text, so it is invisible to a parser in both directions. What does break parsing is text rendered inside an image, such as a designed header containing your name. That text does not exist to any system reading the file.",
      },
      {
        question: "What kind of photo should I use?",
        answer:
          "Head and shoulders, plain background, even natural light, neutral expression, dressed as you would for the interview, and recent enough to look like you. The standard is a professional identification photo, not a portrait session and not a cropped social photo.",
      },
      {
        question: "Do resumes need an image or graphics?",
        answer:
          "No. Nothing on a resume needs to be an image, and in the markets where photos are discouraged the whole page is better as plain text. Where you do include a photo, everything else — name, contact details, headings — should still be real text.",
      },
    ],
    related: ["what-a-good-resume-looks-like", "cv-vs-resume", "ats-friendly-resume"],
  },
  {
    slug: "resume-action-verbs",
    title: "Action verbs that carry a resume, and the ones that sink it",
    metaTitle: "Resume Action Verbs — Lists by Function ({year}) | meniacv",
    description:
      "The verbs worth starting a bullet with, grouped by what they claim, plus the weak openers to replace and why verb choice matters less than what comes after it.",
    eyebrow: "Writing",
    updated: "2026-08-01",
    intro:
      "Verb lists are the most-shared and least-useful resume advice on the internet, because swapping \"managed\" for \"orchestrated\" changes nothing about whether a bullet is persuasive. The verb does matter — it is the first word a scanning reader hits, and a weak one loses them. But it matters as the entry point to a specific claim, and a strong verb attached to a vague claim is worse than a plain one attached to a real result.",
    takeaways: [
      "The verb states your relationship to the work. Led, owned, supported and contributed to are four different claims.",
      "Fix the claim first. The right verb usually appears on its own once you know what you are claiming.",
      "Replace \"responsible for\", \"duties included\", \"helped with\" and \"worked on\".",
      "Plain verbs beat thesaurus verbs. Spearheaded and orchestrated now read as a warning.",
      "Parsers match nouns, not verbs. Strong verbs are for the human, which is reason enough.",
    ],
    sections: [
      {
        heading: "What the verb is doing",
        body: [
          "It states your relationship to the work. \"Led\", \"contributed to\", \"supported\" and \"owned\" describe four genuinely different levels of involvement in the same project, and choosing accurately is what makes the rest of the sentence believable. A reader who suspects you have inflated your role discounts everything after it.",
          "This is why the swap-your-verbs advice misfires. The problem with \"Responsible for the monthly close\" is not the phrase \"responsible for\". It is that the sentence contains no action, no scale and no outcome — and replacing the opener with \"Spearheaded\" produces a sentence that is now both empty and overwritten.",
          "Fix the claim first. The verb usually appears on its own once you know what you are claiming.",
        ],
      },
      {
        heading: "Verbs by what they claim",
        body: [
          "Grouped by the kind of work they describe, because picking from the right group is the useful part.",
        ],
        list: [
          "Built something: built, designed, developed, launched, created, implemented, engineered, architected, prototyped, shipped.",
          "Improved something: improved, reduced, increased, streamlined, optimised, automated, accelerated, simplified, consolidated, rewrote.",
          "Led people: led, managed, mentored, coached, trained, hired, supervised, directed, coordinated, onboarded.",
          "Owned an outcome: owned, drove, delivered, ran, oversaw, spearheaded, championed, established.",
          "Analysed: analysed, evaluated, investigated, modelled, forecast, audited, diagnosed, measured, researched.",
          "Persuaded or aligned: negotiated, secured, influenced, presented, briefed, advocated, resolved, mediated.",
          "Maintained and supported: maintained, administered, monitored, supported, resolved, triaged, documented.",
        ],
      },
      {
        heading: "The openers to replace",
        body: [
          "Four constructions account for most weak bullets, and all four are symptoms of describing a job rather than a contribution.",
          "\"Responsible for…\" describes a role that existed. \"Duties included…\" is a job description with your name on it. \"Helped with…\" and \"Assisted in…\" volunteer that your contribution was marginal, which is rarely what you meant and always how it reads. \"Worked on…\" says you were present.",
          "In each case the fix is the same question: what did you actually do, and what happened because of it? \"Responsible for the monthly close\" becomes \"Ran the monthly close for a 12-entity consolidation, cutting the cycle from nine days to five\". The verb changed, but the verb is not what fixed it.",
        ],
      },
      {
        heading: "Using them well",
        body: [
          "One verb per bullet, at the start, in past tense for past roles and present for the current one. Do not repeat the same verb three times in one job — it flattens the section and suggests the work was uniform when it was not.",
          "Do not reach for a thesaurus. \"Spearheaded\", \"orchestrated\", \"pioneered\" and \"leveraged\" appear so often in inflated resumes that they now read as a signal of one, and a hiring manager who has seen four \"orchestrated\"s this morning is discounting the fifth. Plain verbs — built, ran, cut, wrote, led — are stronger precisely because they are unremarkable enough to be believed.",
          "And keep them honest. \"Led\" a project you contributed to is the kind of claim that collapses in a thirty-second interview follow-up, and the collapse costs you far more than the accurate word would have.",
        ],
      },
    ],
    rewrites: [
      {
        label: "Ownership",
        before: "Responsible for the monthly close",
        after:
          "Ran the monthly close for a 12-entity consolidation, cutting the cycle from nine days to five",
      },
      {
        label: "Contribution",
        before: "Helped with the website redesign",
        after:
          "Rebuilt the checkout flow during the site redesign, taking page load from 4s to under 1s",
        note:
          "\"Helped with\" volunteers that your contribution was marginal. Naming what you specifically did is both more accurate and stronger.",
      },
      {
        label: "Overwriting",
        before:
          "Spearheaded the orchestration of a transformative cross-functional initiative",
        after:
          "Led the migration of four teams onto one deployment pipeline, cutting release time from a day to twenty minutes",
      },
    ],
    checklist: {
      heading: "Verb discipline across the page",
      items: [
        "Every bullet starts with a verb",
        "Past tense for past roles, present for the current one",
        "No verb repeated three times within one job",
        "No \"responsible for\", \"duties included\", \"helped with\" or \"worked on\"",
        "No spearheaded, orchestrated, pioneered or leveraged",
        "Every verb is accurate about your actual level of involvement",
        "You could survive a thirty-second follow-up on each one",
      ],
    },
    templates: {
      heading: "Templates that put bullets first",
      blurb:
        "Verb-led bullets only work if the bullets are what the eye lands on. These layouts keep the experience section dominant and resist the temptation to fill the page with panels around it.",
      category: "simple",
    },
    faqs: [
      {
        question: "What are good action verbs for a resume?",
        answer:
          "Plain, specific ones matched to what you actually did: built, launched, rewrote, cut, automated for delivery work; led, mentored, hired, trained for people work; analysed, modelled, audited, forecast for analytical work. The best verb is the accurate one, not the most impressive-sounding.",
      },
      {
        question: "What words should I avoid on a resume?",
        answer:
          "\"Responsible for\", \"duties included\", \"helped with\", \"assisted in\" and \"worked on\" — all of which describe a role rather than a contribution. Also the overwrought openers: spearheaded, orchestrated, pioneered, leveraged. They appear so often on inflated resumes that they now read as a warning sign.",
      },
      {
        question: "Do action verbs help with ATS?",
        answer:
          "Marginally at best. Applicant tracking systems match nouns — tools, skills, job titles, technologies — far more than verbs. Strong verbs are for the human reading the page, which is a good enough reason on its own.",
      },
      {
        question: "Should every bullet start with a verb?",
        answer:
          "Yes, in almost every case. It puts the action in the first word a scanning eye lands on and keeps the whole section structurally consistent, which makes the page faster to read. Vary which verb — repeating the same one three times in a role flattens work that was not uniform.",
      },
    ],
    related: ["resume-bullet-points", "resume-skills", "how-to-write-a-resume"],
  },
  {
    slug: "resume-objective",
    title: "Resume objectives and profiles: what replaced them",
    metaTitle: "Resume Objective vs Summary vs Profile ({year}) | meniacv",
    description:
      "The objective statement is obsolete and the summary replaced it. What the difference is, when an objective is still right, and how to write the three sentences that open a resume.",
    eyebrow: "Sections",
    updated: "2026-08-01",
    intro:
      "Objective, summary, profile, professional statement — four names for the block of text at the top of a resume, used interchangeably enough that the distinction has become genuinely confusing. There is one real difference underneath the vocabulary, and it decides whether the block is worth the space: whether it is written from your side or the reader's.",
    takeaways: [
      "An objective states what you want; a summary states what you offer. That is the whole distinction.",
      "The objective is largely obsolete, because nobody screening applications reads for your goals.",
      "\"Profile\" and \"professional summary\" are other names for the summary. Nothing turns on the label.",
      "An objective still helps for a career change, a relocation, a first job or a deliberate step down.",
      "If it would only restate your job title, delete it and use the space for a bullet.",
    ],
    sections: [
      {
        heading: "The actual difference",
        body: [
          "An objective states what you want. \"Seeking a challenging position with a growth-oriented company where I can utilise my skills.\" A summary states what you offer. \"Operations manager, eight years in third-party logistics, most recently running a 60-person warehouse through a WMS migration.\"",
          "That is the whole distinction, and it explains why one died. Nobody screening two hundred applications is reading for what the applicant wants — they are reading for whether this person can do the job. An objective spends the most valuable four lines on the page answering a question nobody asked.",
          "\"Profile\" and \"professional summary\" are just other names for the summary. Nothing turns on which label you use, so use whichever your template offers and spend your attention on the sentences.",
        ],
      },
      {
        heading: "When an objective still works",
        body: [
          "Rarely, and only when your goal is genuinely not obvious from the rest of the page. In those cases, stating it prevents a misreading rather than wasting space.",
        ],
        list: [
          "A career change, where your history points somewhere other than the job you are applying for.",
          "A relocation, where your address suggests you are in the wrong country or city for the role.",
          "A first job or an internship, where you have little history and the direction is the information.",
          "A deliberate step down or sideways, which otherwise reads as an error.",
          "Even then, write it as a summary with the objective folded in — what you bring, then what you are aiming at — rather than as a request.",
        ],
      },
      {
        heading: "Writing the three sentences",
        body: [
          "A summary is three sentences and should be readable in about eight seconds. Sentence one: what you are and at what level, with a number of years. Sentence two: your most relevant evidence — the thing you would most want this employer to know. Sentence three: what you are aiming at, if it is not obvious.",
          "\"Registered nurse with six years in acute medical-surgical care, currently on a 32-bed unit at a Level II trauma centre. Charge nurse two shifts a week and precept new graduates; Epic superuser for the unit. Looking for a permanent day-shift role in an urban teaching hospital.\"",
          "Every clause there is checkable. Compare it with the version that says \"compassionate and dedicated nursing professional with a proven track record of delivering high-quality patient care\", which is true of everyone applying and therefore describes no one.",
        ],
      },
      {
        heading: "When to leave it out entirely",
        body: [
          "If your summary would only restate your job title and years of experience, delete it. \"Software engineer with five years of experience\" adds nothing that the first line of your experience section does not already say, and the four lines are better spent on a bullet.",
          "The test: cover the summary with your hand and read the rest of the page. If nothing was lost, it was not doing anything. A summary earns its place when it says something the chronology cannot — a specialism, a scale, a direction, a reason the next role is a step rather than a jump.",
          "For students and career changers it almost always earns its place, because in both cases the chronology actively misleads and the summary is the correction.",
        ],
      },
    ],
    compare: {
      heading: "Objective against summary",
      columns: ["", "Objective", "Summary"],
      rows: [
        [
          "Written from",
          "Your side — what you want",
          "The reader's side — what you offer",
        ],
        [
          "Typical opening",
          "\"Seeking a challenging position where I can…\"",
          "\"Operations manager, eight years in third-party logistics…\"",
        ],
        [
          "What a screener does with it",
          "Skips it",
          "Uses it to decide whether to keep reading",
        ],
        [
          "Still useful for",
          "Career change, relocation, first job, deliberate step down",
          "Everyone else",
        ],
        [
          "Best practice",
          "Fold the goal into a summary as the last clause",
          "Three sentences, written last, from what is already on the page",
        ],
      ],
    },
    checklist: {
      heading: "What should open your resume",
      items: [
        "It is written from the reader's side — what you bring, not what you want",
        "Three sentences, readable in about eight seconds",
        "It names a level and a number of years",
        "It carries one specific, checkable piece of evidence",
        "It states what you are aiming at only where that is not obvious",
        "No adjectives about your character",
        "Cover it with your hand — something is lost",
      ],
    },
    templates: {
      heading: "Templates with room at the top",
      blurb:
        "Three or four lines of summary need space above the experience section without pushing it off the fold. These contemporary layouts hold one comfortably, and label it plainly enough for a parser.",
      category: "modern",
    },
    faqs: [
      {
        question: "What is the difference between a resume objective and a summary?",
        answer:
          "An objective states what you want from an employer; a summary states what you offer them. The objective is largely obsolete because nobody screening applications is reading for the applicant's goals. \"Profile\" and \"professional summary\" are alternative names for the same summary block.",
      },
      {
        question: "Do I need an objective on my resume?",
        answer:
          "No, in almost every case. Use a summary instead. An objective is still worth including for a career change, a relocation, a first job or a deliberate step down — situations where your goal is not obvious from the page and stating it prevents a misreading.",
      },
      {
        question: "How do you write a resume summary?",
        answer:
          "Three sentences. What you are and at what level, with years of experience; your single most relevant piece of evidence; and what you are aiming at if it is not obvious. Every clause should be specific enough that someone could ask a follow-up question about it.",
      },
      {
        question: "Should a resume have a profile section?",
        answer:
          "Only if it says something the rest of the page cannot. Cover it with your hand and read the resume — if nothing was lost, delete it and use the space for a bullet. It earns its place for students, career changers, and anyone whose chronology would otherwise mislead.",
      },
      {
        question: "What is a professional objective example?",
        answer:
          "If you need one, fold it into a summary: \"Retail supervisor with four years running weekend shifts and a food safety certification, moving into hospitality management. Available full-time from March.\" What you bring first, what you are aiming at second — the objective is the last clause, not the whole block.",
      },
    ],
    related: ["resume-summary-examples", "career-change-resume", "what-to-put-on-a-resume"],
  },
  {
    slug: "cover-letter-basics",
    title: "What a cover letter is, and whether you need one",
    metaTitle: "What Is a Cover Letter for a Resume? ({year}) | meniacv",
    description:
      "What a cover letter does that a resume cannot, when it is worth writing, what a cover page is and is not, and the four-paragraph structure that works.",
    eyebrow: "Cover letters",
    updated: "2026-08-01",
    intro:
      "A cover letter is a one-page letter sent alongside your resume that argues for the connection between the two — this job, and you. The resume states what you have done; the letter explains why it is relevant here, which is the one thing a list of jobs structurally cannot do. That is the whole purpose, and it is why generic cover letters are worse than no cover letter at all.",
    takeaways: [
      "A cover letter argues for the connection between this job and you — the one thing a resume cannot do.",
      "It handles what would look strange on a resume: a career change, a gap, a relocation, a step down.",
      "Write one when it is asked for, when a person will read it, or when the role involves writing.",
      "A generic letter is worse than none, because it is read as evidence of exactly that.",
      "A cover page — a title sheet in front of your resume — is a different thing, and almost always wrong.",
    ],
    sections: [
      {
        heading: "What it does that a resume cannot",
        body: [
          "A resume is a document you edit and reuse. It is a record of facts, ordered and selected, and it can be tailored but it is fundamentally the same document across applications. A cover letter is written to one employer and can therefore make an argument — about why this role, why now, why you specifically.",
          "It also handles the things that would look strange on a resume: a career change that needs a sentence of explanation, a relocation, a gap, a step down, an unusual route into the field. Those explanations are awkward as bullets and natural in a letter.",
          "And it demonstrates writing, which for a great many roles is a substantial part of the job. A cover letter is a work sample whether or not anyone calls it that.",
        ],
      },
      {
        heading: "When it is worth writing",
        body: [
          "When it is asked for, always, and taken seriously — an employer who requests one and receives a generic paragraph has learned something. When you are applying directly to a person or a small organisation, where somebody will genuinely read it. When something about your application needs explaining. And when the role involves writing.",
          "It is worth less when you are applying through a portal that offers an optional attachment field to a large organisation, where the first screen is automated and the letter may never be opened. It is worth nothing at all when it is generic — a letter that could be sent to any company is read as evidence of exactly that.",
          "The honest position: one strong tailored letter to a job you want beats twenty generic ones, and if you do not have time to write it properly, spend the time on the resume instead.",
        ],
      },
      {
        heading: "The structure that works",
        body: [
          "Four paragraphs, one page, under 400 words.",
        ],
        list: [
          "Open with why this job and this employer, specifically. Not \"I am writing to apply for\" — that is the subject line, not a sentence.",
          "Then the strongest piece of evidence you have that maps onto what they asked for, expanded beyond what the resume bullet could say.",
          "Then what draws you to this organisation in particular, demonstrating you know something real about it.",
          "Then a short close. What you are asking for, and nothing servile.",
        ],
      },
      {
        heading: "A cover letter is not a cover page",
        body: [
          "These get confused often enough to be worth separating. A cover letter is the letter described above. A cover page — a title sheet with your name on it in large type, in front of the resume — is a different thing, and for a resume it is almost always wrong.",
          "The reasons are practical. It puts a page between the reader and your content at the exact moment you have their attention. It can confuse parsers, which may take the title page as page one and miss the header on the real first page. And nobody has ever asked for one.",
          "The narrow exceptions are portfolios and formal proposal documents, where a title page is part of the expected format. For an ordinary job application, send the resume, with a cover letter as a separate file if one is wanted.",
        ],
      },
    ],
    compare: {
      heading: "Cover letter against cover page",
      columns: ["", "Cover letter", "Cover page"],
      rows: [
        [
          "What it is",
          "A one-page letter making an argument",
          "A title sheet with your name on it, in front of the resume",
        ],
        [
          "Sent as",
          "A separate file, or the body of the email",
          "Page one of the resume file",
        ],
        [
          "Effect on the reader",
          "Explains the connection they would otherwise infer",
          "Delays them by a page at the moment you have their attention",
        ],
        [
          "Effect on parsing",
          "None — it is a separate document",
          "Can be taken as page one, and the real header missed",
        ],
        [
          "When it is right",
          "Often",
          "Portfolios and formal proposal documents only",
        ],
      ],
    },
    checklist: {
      heading: "The four paragraphs",
      items: [
        "Opens with why this job and this employer, specifically",
        "Not \"I am writing to apply for\" — that is the subject line",
        "One piece of evidence expanded beyond what the resume bullet could say",
        "Something real about this organisation, demonstrating you know it",
        "A short close stating what you are asking for, with nothing servile",
        "One page, under 400 words",
        "Sent as a separate file, not as a title page in front of the resume",
        "Rewritten specifics for every application, even on a reused structure",
      ],
    },
    templates: {
      heading: "Templates for the pair",
      blurb:
        "A letter should look like it came from the same person as the resume beside it. Pick a resume template here and the matching letter layout inherits its typeface and header, so the two arrive as a set.",
      category: "classic",
    },
    faqs: [
      {
        question: "What is a cover letter for a resume?",
        answer:
          "A one-page letter sent with your resume that argues for the connection between the job and you. The resume records what you have done; the letter explains why it is relevant to this specific role — which is the one thing a list of jobs cannot do for itself.",
      },
      {
        question: "Do I need a cover letter?",
        answer:
          "Write one when it is asked for, when you are applying directly to a person or a small organisation, when something about your application needs explaining, or when the role involves writing. Skip it for automated bulk portals where it will not be read — and skip it always if the only version you have time for is generic.",
      },
      {
        question: "What is the difference between a cover letter and a cover page?",
        answer:
          "A cover letter is a letter making an argument for your application. A cover page is a title sheet with your name on it placed in front of the resume — which is almost always a mistake, because it delays the reader and can confuse parsers into treating it as page one.",
      },
      {
        question: "How long should a cover letter be?",
        answer:
          "One page, under 400 words, four paragraphs. Anything longer stops being read at the point it stops being tight, and there is no argument for a role that needs more than four paragraphs to make.",
      },
      {
        question: "Should I write a different cover letter for every job?",
        answer:
          "Yes — a letter that could be sent to any employer is read as one that was. The middle ground that works is a reusable structure with genuinely rewritten specifics: which of your evidence you lead with, and what you say about this particular organisation, change every time.",
      },
    ],
    related: ["resume-objective", "how-to-write-a-resume", "career-change-resume"],
  },
  {
    slug: "resume-writing-services",
    title: "Resume writing services: what you get for the money",
    metaTitle: "Resume Writing Services — Are They Worth It? ({year}) | meniacv",
    description:
      "What a professional resume writer actually does, what the tiers cost, when the money is well spent, and the cheaper things worth trying first.",
    eyebrow: "Deciding",
    updated: "2026-08-01",
    intro:
      "A professional resume writer will charge somewhere between about $150 and $1,000 depending on your level, and a small number of people get real value from that. Most of the people who pay it are buying a solution to a problem the service cannot fix — which is not the service's fault. It is worth understanding what you are actually buying before deciding, because the answer changes a lot by career stage.",
    takeaways: [
      "You are buying editorial judgement, which is real, and writing, where the value is thinnest.",
      "Nobody can invent your accomplishments. A writer rephrases the material you supply.",
      "There is no privileged ATS knowledge to buy. Any service claiming it is selling a mystery.",
      "Worth it for senior moves, hard career changes, and long searches where you need a diagnosis.",
      "Try the three free passes first — outcomes, cutting, vocabulary — or you will not know what to ask for.",
    ],
    sections: [
      {
        heading: "What the money buys",
        body: [
          "Two things, and they are worth separating. The first is editorial judgement: someone who reads resumes professionally deciding what to cut, what to lead with, and how to phrase a claim so it lands. That is genuinely valuable and genuinely hard to do for yourself, because the thing you cannot see about your own career is which parts are interesting.",
          "The second is the writing itself — turning your material into finished bullets. This is the part most people think they are paying for and the part where the value is thinnest, because a writer can only work from what you give them. Nobody can invent your accomplishments. If your intake form comes back with \"managed the reporting process\", the bullet you get back will be a better-phrased version of that, not a different fact.",
          "What you are not buying, whatever the marketing says, is a route past applicant tracking systems. There is no privileged formatting knowledge here. A single-column resume with real text and the posting's vocabulary in it parses, and that is available to anyone.",
        ],
      },
      {
        heading: "The tiers, roughly",
        body: [
          "Prices vary widely and the market is not transparent, but the shape of it is consistent.",
        ],
        list: [
          "$100–250: usually a template plus light editing, often from a marketplace writer working at volume. Sometimes fine, frequently a formatted version of what you sent.",
          "$300–600: a real intake process, a phone call, a writer who works in your field, one or two revision rounds. This is where the editorial judgement actually appears.",
          "$700–2,000+: executive-level work, generally including a LinkedIn rewrite and a positioning conversation. The value here is closer to career coaching than to writing.",
          "Subscription \"review\" products: an automated score plus generic recommendations, often as an upsell funnel toward a paid rewrite. Treat the score as a formatting checklist, not as an assessment.",
        ],
      },
      {
        heading: "When it is worth it",
        body: [
          "Three situations where paying is a reasonable decision. A senior or executive move, where positioning genuinely matters, the salary at stake is large, and the cost is a rounding error against the outcome. A career change where you cannot see how your history translates — an outside reader is exactly what that problem needs. And when you have been applying for months with no responses and cannot tell whether the resume is the problem, in which case you are buying a diagnosis rather than a document.",
          "It is not worth it if you are early in your career and the honest answer is that you have not yet done much — no writer can fix that, and the money is better spent on getting something to write about. It is not worth it if you have not tried writing it yourself first, because you will not know what to ask for. And it is not worth it if you are hoping to skip the reflective work of deciding what your career has actually been about, since that is the part that has to come from you regardless of who types it.",
        ],
      },
      {
        heading: "How to choose one",
        body: [
          "The single best filter is whether the writer knows your field. A generalist producing a nurse's resume, a software engineer's and a construction supervisor's from the same template will get the vocabulary of at least two of them slightly wrong, and slightly wrong is visible to anyone who does that job.",
          "Ask for samples in your industry, at your level. Ask who is doing the writing — several large services subcontract to a marketplace, which is why quality varies so much within the same brand. Ask what the revision policy is and how many rounds are included. And ask what happens to your data.",
          "Two warning signs. Any guarantee of interviews, which nobody can offer honestly. And any claim about beating or being optimised for applicant tracking systems, which signals a service selling a mystery rather than an edit.",
        ],
      },
      {
        heading: "What to try first",
        body: [
          "Most of the value in a paid rewrite comes from three passes you can run yourself, and they cost nothing. Rewrite every bullet so it ends in something that changed. Cut anything older than about fifteen years to a line. Read the posting and make sure its vocabulary appears on your page where it is honestly true.",
          "Then get a second reader. A colleague in your field, a manager you trust, or an automated review to catch the mechanical problems — missing outcomes, buried keywords, sections in the wrong order. The review here is free to run and tells you what is structurally weak, which is the same diagnosis the first hour of a paid engagement produces.",
          "If you do that and still cannot tell what is wrong, that is the point at which paying someone makes sense — and you will get far more out of it, because you will arrive with the material already organised.",
        ],
      },
    ],
    compare: {
      heading: "Paying against doing it yourself",
      columns: ["", "A writing service", "Doing it yourself"],
      rows: [
        [
          "What you get",
          "An outside reader who does this professionally",
          "The three passes that produce most of the same result",
        ],
        [
          "Cost",
          "$100–250 template work; $300–600 for real attention; $700+ at executive level",
          "An evening",
        ],
        [
          "Best for",
          "Senior moves, hard career changes, unexplained long searches",
          "Early career, and anyone who has not tried yet",
        ],
        [
          "Limit",
          "Cannot supply accomplishments you have not had",
          "You cannot see which parts of your own career are interesting",
        ],
        [
          "Watch for",
          "Interview guarantees and ATS claims",
          "Stopping at formatting instead of rewriting the bullets",
        ],
      ],
    },
    checklist: {
      heading: "Vetting a service before you pay",
      items: [
        "They have samples in your industry, at your level",
        "You know who is actually writing — several large services subcontract",
        "The revision policy and number of rounds are stated up front",
        "You know what happens to your data",
        "No guarantee of interviews, which nobody can offer honestly",
        "No claim about beating or being optimised for applicant tracking systems",
        "You have already done the outcome rewrite pass yourself",
        "You can say specifically what you want fixed",
      ],
    },
    templates: {
      heading: "What the formatting half costs: nothing",
      blurb:
        "Layout is the part of a paid rewrite you are least likely to need. Every template here is free to use with unlimited PDF export and no watermark — which leaves the money, if you spend it, for the editing.",
      category: "professional",
    },
    faqs: [
      {
        question: "Are resume writing services worth it?",
        answer:
          "For senior moves, difficult career changes, and long unexplained job searches, often yes — you are buying editorial judgement and an outside read on your own history. Early in a career, or before you have tried writing it yourself, usually not: a writer can only rephrase the material you give them, and cannot supply accomplishments you have not had.",
      },
      {
        question: "How much does a professional resume writer cost?",
        answer:
          "Roughly $100–250 for template-and-light-edit work, $300–600 for a real intake process with a writer in your field, and $700 upwards for executive-level work that usually includes LinkedIn and a positioning conversation. Price correlates with how much genuine editorial attention you get, not with formatting quality.",
      },
      {
        question: "Can a resume writer get my resume past ATS?",
        answer:
          "There is no privileged knowledge to buy here. A single-column layout with real text and the posting's own vocabulary parses cleanly, and any service claiming special ATS optimisation is selling a mystery. Treat that claim as a reason to look elsewhere.",
      },
      {
        question: "How do I choose a resume writer?",
        answer:
          "Pick someone who knows your field, and ask for samples at your level in your industry. Check who is actually writing — several large services subcontract to marketplace writers, which is why quality varies within one brand. Avoid anyone guaranteeing interviews or claiming to beat applicant tracking systems.",
      },
      {
        question: "What is the alternative to paying for a resume service?",
        answer:
          "Do the three passes yourself first: rewrite every bullet to end in an outcome, cut anything older than about fifteen years to a line, and make the posting's vocabulary appear where it is honestly true. Then get a second reader — a colleague in your field, or an automated review for the mechanical problems. That covers most of what the first hour of a paid engagement would find.",
      },
    ],
    related: ["ai-resume-builder", "resume-bullet-points", "resume-mistakes"],
  },
  {
    slug: "resume-website",
    title: "Building a resume website: when it helps and how to do it",
    metaTitle: "How to Build a Resume Website ({year}) | meniacv",
    description:
      "Who actually benefits from a personal resume site, what belongs on it, how to build one without over-engineering it, and why it never replaces the PDF.",
    eyebrow: "Practical",
    updated: "2026-08-01",
    intro:
      "A personal resume website is a genuinely good idea for a small number of people and a well-disguised procrastination project for everyone else. The distinguishing question is whether you have work that a page can show and a document cannot. If you do, build it in an afternoon. If you do not, the same afternoon spent rewriting your bullets will produce more interviews.",
    takeaways: [
      "Worth building if your work is visual, interactive or published. Otherwise almost nobody visits it.",
      "Buy a domain that is your name — it is the part that lasts, and it costs almost nothing.",
      "Keep it to one page: what you do, the work with outcomes, a condensed history, an email address.",
      "It never replaces the PDF. Applications expect a file, and recruiters forward documents.",
      "An abandoned site is worse than no site — it demonstrates the opposite of what you wanted.",
    ],
    sections: [
      {
        heading: "Who it actually helps",
        body: [
          "Anyone whose work is visual or interactive, because a PDF cannot show it: designers, front-end developers, photographers, illustrators, video editors, architects. For these fields the site is not a resume in a different format, it is the portfolio, and the resume is the appendix.",
          "Writers, researchers and consultants, where a body of published work benefits from being collected, linked and readable in a browser rather than listed.",
          "And people building a public presence — speakers, founders, anyone who wants to be findable by name. A personal domain that ranks for your own name is worth having, and it is the one benefit that accrues over years rather than per application.",
          "For everyone else — accountants, nurses, project managers, sales, operations — the honest answer is that almost nobody will visit it. Recruiters work from the resume and LinkedIn, and a third destination adds a click that most will not make.",
        ],
      },
      {
        heading: "What goes on it",
        body: [
          "Less than you think, and organised for someone who arrived from a link in an application and has thirty seconds.",
        ],
        list: [
          "A single sentence at the top saying what you do. Not a mission statement.",
          "The work itself, if the work is the point — three to six pieces, each with what it was, what you did and what happened. Case studies beat thumbnails.",
          "A condensed career history. Not the full resume; the shape of it, with the PDF downloadable.",
          "Contact: an email address, and links to whichever profiles are current. Not a contact form nobody trusts.",
          "Nothing else. No skill bars, no testimonials carousel, no blog you will abandon in six weeks, no animated hero section.",
        ],
      },
      {
        heading: "How to build it without losing a weekend",
        body: [
          "Match the tool to the point of the exercise. If the site is a portfolio, use something that lets you publish and move on — a hosted site builder, a template on a static host, or one of the personal-site services. Nobody hiring a photographer cares what the site is built with.",
          "If you are a developer and the site is itself a work sample, then building it is the point, and a static site generator deployed to any of the free hosts is the conventional route. Keep it small. A personal site that demonstrates restraint reads better to another engineer than one that demonstrates every framework you have tried.",
          "Buy a domain that is your name. It costs about the price of a coffee per year, it is the part that lasts, and yourname.com in a resume header looks considered in a way that a subdomain on a free host does not. Everything else about the site can be rebuilt later; the domain is the thing worth owning now.",
        ],
      },
      {
        heading: "The site does not replace the PDF",
        body: [
          "This is the mistake worth naming plainly. Applications go through systems that expect a file, recruiters forward documents to hiring managers, and hiring managers print things or read them offline. A URL in place of an attachment fails at the first automated step and irritates at every human one.",
          "So the site is a supplement. The PDF is what you send, with the URL in the contact line beside your email — one link, in the header, where a curious reader will find it. If the site is the portfolio for a visual role, name it as one: \"Portfolio: jordanalvarez.com\" tells the reader what they will get.",
          "Keep them consistent. A site listing a job the resume omits, or dates that do not match, creates exactly the sort of discrepancy that becomes a question. And if the site goes stale, take it down or update it — an abandoned personal site with a two-year-old \"currently at\" line is worse than no site, because it demonstrates the opposite of what you were trying to show.",
        ],
      },
    ],
    compare: {
      heading: "Is one worth building?",
      columns: ["Field", "Worth it?", "What it should carry"],
      rows: [
        [
          "Design, photography, illustration",
          "Yes — it is the portfolio",
          "The work, large, with the resume as an appendix",
        ],
        [
          "Front-end and creative engineering",
          "Yes — the site is itself a work sample",
          "Small, fast, restrained. Restraint reads better than range",
        ],
        [
          "Writing, research, consulting",
          "Often",
          "A collected, linked, readable body of published work",
        ],
        [
          "Accounting, nursing, operations, sales",
          "Rarely",
          "Nothing — the time is better spent on the resume bullets",
        ],
        [
          "Speaking, founding, public work",
          "Yes, for findability",
          "A page that ranks for your own name, kept current",
        ],
      ],
    },
    checklist: {
      heading: "Building one in an afternoon",
      items: [
        "A domain that is your name",
        "One sentence at the top saying what you do — not a mission statement",
        "Three to six pieces of work, each with what it was, what you did, what happened",
        "A condensed career history, with the PDF downloadable",
        "An email address, and links to whichever profiles are current",
        "No skill bars, testimonial carousels, contact forms or an abandoned blog",
        "The URL in your resume's contact line, labelled if it is a portfolio",
        "Facts consistent with the resume and the LinkedIn profile",
      ],
    },
    templates: {
      heading: "The PDF you still have to send",
      blurb:
        "The site is a supplement; the attachment is what the application actually consumes. These are the layouts with enough visual judgement to sit alongside a portfolio without becoming one.",
      category: "creative",
    },
    faqs: [
      {
        question: "Should I build a resume website?",
        answer:
          "Yes if your work is visual, interactive or published — designers, front-end developers, photographers, writers, consultants — because a page shows what a PDF cannot. For most other roles almost nobody visits it, and the time is better spent rewriting your resume bullets.",
      },
      {
        question: "How do I build a resume website?",
        answer:
          "Buy a domain that is your name, pick a hosted builder or a static site template, and publish a single page: what you do, three to six pieces of work with outcomes, a condensed history, and contact details. If you are a developer and the site is itself a work sample, a static generator on a free host is the conventional route.",
      },
      {
        question: "Does a resume website replace a PDF resume?",
        answer:
          "No. Applications go through systems that expect a file, and recruiters forward documents rather than links. Send the PDF and put the URL in your contact line beside your email — the site is a supplement for the reader who wants more.",
      },
      {
        question: "What should be on a personal resume website?",
        answer:
          "One sentence saying what you do, the work itself with what you did and what resulted, a condensed career history with the PDF downloadable, and an email address. Leave off skill bars, testimonial carousels, contact forms and a blog you will not maintain.",
      },
      {
        question: "Is a personal domain worth buying?",
        answer:
          "Yes — it costs a few pounds a year, it is the part of the setup that lasts, and yourname.com in a resume header reads as considered where a free subdomain does not. The site behind it can be rebuilt any number of times.",
      },
    ],
    related: ["linkedin-on-resume", "what-to-put-on-a-resume", "ai-resume-builder"],
  },
];

export const GUIDE_SLUGS = GUIDES.map((guide) => guide.slug);

export const getGuide = (slug: string) =>
  GUIDES.find((guide) => guide.slug === slug);
