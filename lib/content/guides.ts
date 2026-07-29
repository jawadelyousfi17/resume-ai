// The written guides behind /guides/<slug>.
//
// Content lives here rather than in the page components so every guide gets
// the same layout, the same metadata, the same structured data and the same
// internal linking without any of it being retyped. Adding a guide is adding
// an entry to GUIDES — the route, sitemap and index page pick it up.

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
  sections: GuideSection[];
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
    metaTitle: "How to Write a Resume in 2026 — Step-by-Step Guide | meniacv",
    description:
      "A practical order of operations for writing a resume from nothing: what goes on the page, what to cut, and how to make each line earn its space.",
    eyebrow: "Guide",
    updated: "2026-07-25",
    intro:
      "Most resume advice starts with formatting, which is the last thing that matters. Start with what you did, get it on the page in plain language, then shape it. This is the order that works.",
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
    ],
    faqs: [
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
    ],
    faqs: [
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
    ],
    faqs: [
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
    ],
    faqs: [
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
      {
        heading: "Before and after",
        body: [
          "\"Worked on improving site performance\" becomes \"Cut largest-contentful-paint from 4.1s to 1.2s across the marketing site, lifting mobile conversion 12%.\"",
          "\"Helped with the migration to the new CRM\" becomes \"Migrated 60,000 customer records to HubSpot with no reported data loss, and trained the 12-person sales team on the new workflow.\"",
        ],
      },
    ],
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
];

export const GUIDE_SLUGS = GUIDES.map((guide) => guide.slug);

export const getGuide = (slug: string) =>
  GUIDES.find((guide) => guide.slug === slug);
