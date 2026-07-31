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
    metaTitle: "How to Write a Resume in {year} — Step-by-Step Guide | meniacv",
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
    ],
    faqs: [
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
    ],
    faqs: [
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
];

export const GUIDE_SLUGS = GUIDES.map((guide) => guide.slug);

export const getGuide = (slug: string) =>
  GUIDES.find((guide) => guide.slug === slug);
