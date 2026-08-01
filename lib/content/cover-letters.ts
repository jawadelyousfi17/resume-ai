// The cover letter pillar: /cover-letter, /cover-letter/templates and
// /cover-letter/examples.
//
// Note the singular. /cover-letters — plural — is the signed-in app route where
// letters are actually drafted, and these pages link into it. Keeping the two
// apart means the marketing pages can prerender and stay crawlable while the
// editor stays behind `requireUser`.
//
// "Templates" here means the structural patterns a letter follows — the shape
// of the argument, not the shape of the page. The designs the builder actually
// renders live in lib/letter-templates, and /cover-letter/templates lists both:
// what to write, and what it can look like.

import type { FaqEntry } from "@/lib/content/guides";

/** The four paragraphs. Every letter on these pages follows this shape, and
 *  the hub page teaches it explicitly. */
export interface LetterPart {
  name: string;
  purpose: string;
  detail: string;
  /** What it looks like when it goes wrong. */
  failure: string;
}

export const LETTER_PARTS: LetterPart[] = [
  {
    name: "The opening",
    purpose: "Say what you're applying for and why you, in two sentences.",
    detail:
      "Name the role, then lead with the single most relevant thing about you — the years in the field, the specific system you've run, the result closest to what they're asking for. This is the only paragraph you can assume is read in full, so the strongest fact you have goes here rather than in the middle.",
    failure:
      "\"I am writing to express my keen interest in the Software Engineer position I saw advertised on your website.\" This sentence contains no information. It tells the reader what they already know, and it spends the one paragraph guaranteed to be read.",
  },
  {
    name: "The evidence",
    purpose: "Prove the claim you just made, with one specific story.",
    detail:
      "One example, told properly, beats four listed. Give the situation, what you did, and the number that moved. Choose the example that maps most directly onto the posting's first or second requirement — not the achievement you're proudest of, if they're different.",
    failure:
      "Restating your resume in prose. If a paragraph could be reconstructed by reading your bullet points, it's costing you the reader's attention and returning nothing.",
  },
  {
    name: "The fit",
    purpose: "Show you know what this company actually does.",
    detail:
      "Two or three sentences that could not appear in a letter to anyone else. A product decision they made, a market they're moving into, something specific about how they work. This is the paragraph that separates a letter from a form, and it's the one most people skip.",
    failure:
      "\"I have long admired your company's commitment to innovation and excellence.\" Swap in any other employer's name and the sentence still works, which is exactly the problem.",
  },
  {
    name: "The close",
    purpose: "Ask for the interview and stop.",
    detail:
      "One or two sentences. Say you'd welcome the chance to discuss it, thank them, sign off. No new arguments, no summary of what you just wrote, no apologising for your gaps.",
    failure:
      "A closing paragraph longer than the opening one, or a final line that undercuts everything above it — \"I know I don't have all the experience listed, but…\"",
  },
];

/** Situational patterns. These are what a "cover letter template" usefully
 *  means: the shape the argument takes when your situation isn't the standard
 *  one, not a choice of typeface. */
export interface LetterPattern {
  id: string;
  situation: string;
  when: string;
  approach: string[];
  /** A real opening paragraph, written to the pattern. */
  opening: string;
}

export const LETTER_PATTERNS: LetterPattern[] = [
  {
    id: "standard",
    situation: "The standard application",
    when: "You have directly relevant experience and you're applying cold through a posting or a portal.",
    approach: [
      "Lead with your closest match to the posting's first requirement, stated as a fact rather than a claim.",
      "Spend the middle paragraph on one worked example with a number in it.",
      "Use the third paragraph to show you've read something about the company beyond its careers page.",
      "Keep the whole thing under 300 words. A full page of prose is read less carefully than half of one.",
    ],
    opening:
      "I'm applying for the Senior Backend Engineer role. I've spent the last four years on payments infrastructure at a similar scale to yours — most recently rebuilding a settlement pipeline that was failing about 2% of transactions, and bringing that under 0.1%.",
  },
  {
    id: "career-change",
    situation: "Changing career or industry",
    when: "Your job titles don't match the posting and you need to explain the jump before the reader dismisses it.",
    approach: [
      "Name the change in the first paragraph. Trying to obscure it makes the reader work it out themselves, and they'll conclude the worst.",
      "Translate rather than apologise. Identify the two or three things the new role actually requires and show where you've already done them under a different title.",
      "Give one concrete reason for the move that is about the work, not about disliking your last job.",
      "Do not list what you lack. The reader can see your resume; your job here is to make the transferable case, not to argue the other side of it.",
    ],
    opening:
      "I'm applying for the Data Analyst role, coming from six years in clinical nursing. That's a change of field but less of a change of work than it sounds: the last two of those years were spent running our unit's quality reporting, where I built the dashboards that tracked readmission rates across 400 beds and presented them monthly to the clinical board.",
  },
  {
    id: "no-experience",
    situation: "First job, or no direct experience",
    when: "You're a student, a recent graduate, or applying for your first role in the field.",
    approach: [
      "Use coursework, projects, volunteering and part-time work as evidence. They count, and treating them as if they don't is the most common mistake in an entry-level letter.",
      "Be specific about a project. What it did, what you built, what you'd do differently. Specificity is the only thing that distinguishes one graduate letter from another.",
      "Show you understand what the job involves day to day. At entry level, evidence that you know what you're signing up for is genuinely persuasive.",
      "Never open by apologising for being new.",
    ],
    opening:
      "I'm applying for the Junior Front-End Developer role. I finished my computer science degree in June, and spent the last year of it building and maintaining the booking site for a 40-person climbing gym — React and TypeScript, about 300 bookings a week, and the first production system I've had to keep running when it broke at 8am.",
  },
  {
    id: "referral",
    situation: "You were referred by someone",
    when: "Someone inside the company suggested you apply, or you met someone there.",
    approach: [
      "Put the name in the first sentence. A referral is the strongest signal available to you and it decays the further down the page it appears.",
      "Say briefly how you know them and why they thought of you — that second half is what turns a name-drop into evidence.",
      "Then write the rest of the letter exactly as you otherwise would. A referral gets the letter read; it doesn't finish the argument for you.",
    ],
    opening:
      "Priya Raman suggested I get in touch about the Operations Manager opening. We worked together on the warehouse migration at Northgate, where I ran the cutover for three sites, and she thought the scale-up problem you're solving now would be a good match.",
  },
  {
    id: "speculative",
    situation: "No posting — writing on spec",
    when: "You want to work somewhere that hasn't advertised a role you fit.",
    approach: [
      "Open with the problem you think they have, not with a request. You're proposing something, and a proposal that starts by asking for a favour reads as a favour.",
      "Be concrete about what you'd do in the first six months.",
      "Name a role, or describe one. Asking whether there's anything going puts the work of imagining you onto a stranger.",
      "Accept a low response rate and send few, carefully. A speculative letter that reads as a mail-merge is worse than none.",
    ],
    opening:
      "You've opened three new sites this year and, as far as I can tell from your careers page, no one is running logistics across them as a single operation. I've spent five years doing exactly that — most recently consolidating four regional warehouses into one network and taking about 18% out of the per-unit cost.",
  },
];

/** A worked example letter, tied to the resume example for the same role so
 *  the two pages link to each other. `resumeSlug` must exist in
 *  RESUME_EXAMPLES — the cross-link on the role page depends on it. */
export interface CoverLetterExample {
  /** URL fragment on /cover-letter/examples. */
  id: string;
  role: string;
  /** The matching /resume-examples/{slug}. */
  resumeSlug: string;
  /** What this example demonstrates that the others don't. */
  note: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
}

export const COVER_LETTER_EXAMPLES: CoverLetterExample[] = [
  {
    id: "software-engineer",
    role: "Software engineer",
    resumeSlug: "software-engineer",
    note: "Technical depth without turning into a list of technologies. The stack appears once, in service of a story about reliability.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I'm applying for the Senior Software Engineer role on your platform team. I've spent the last five years on backend systems at consumer scale, most recently as the engineer responsible for the service that handles checkout at Vantage — about 40,000 transactions a day, and the system that cannot be down.",
      "The work I'd point at is a rewrite I led last year. Our checkout service had grown into a single 30,000-line application with a 40-minute deploy and an on-call rotation nobody wanted. I split it into three services along the boundaries that were actually causing incidents, moved us to trunk-based deploys, and brought the deploy cycle to under six minutes. Incidents involving checkout dropped from about nine a quarter to two, and we stopped needing a dedicated release engineer.",
      "What interests me about your team specifically is that you've written publicly about moving off a similar monolith and choosing not to go to microservices wholesale — the post about keeping the billing domain deliberately together matched an argument I lost internally two years ago and now think you were right about. I'd like to work somewhere that reasons about this out loud.",
      "I'd welcome the chance to talk it through. Thank you for your time.",
    ],
    closing: "Sincerely,",
  },
  {
    id: "registered-nurse",
    role: "Registered nurse",
    resumeSlug: "registered-nurse",
    note: "Credentials handled early and briefly, so the letter can spend its length on judgement rather than on licensure.",
    greeting: "Dear Ms Alvarez,",
    paragraphs: [
      "I'm applying for the Registered Nurse position on your medical-surgical unit. I've been an RN for seven years, six of them on a 32-bed med-surg floor at St Catherine's, and I hold an active state licence along with ACLS and PALS certification.",
      "The part of the job I'd want you to know about is what happened when our unit went from a 1:5 to a 1:7 ratio during the staffing shortage in 2024. I took on the handover redesign, because the misses we were seeing were almost all at shift change rather than during care. We moved to a structured bedside handover with the patient present and a two-minute written summary that the oncoming nurse signed. Reported handover-related incidents on our floor fell by just over half in the following two quarters, and it's still the process in use.",
      "I'm drawn to your unit because of the nurse residency programme — I've precepted six new graduates and it's the part of the work I find most worth doing, and a hospital that has built structure around it rather than leaving it to whoever is on shift is one I'd like to be part of.",
      "Thank you for considering my application. I'd be glad to discuss the role.",
    ],
    closing: "Kind regards,",
  },
  {
    id: "product-manager",
    role: "Product manager",
    resumeSlug: "product-manager",
    note: "A decision the writer got wrong, used as evidence. Judgement is the thing being hired for, and admitting a wrong call demonstrates it.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I'm applying for the Senior Product Manager role on your growth team. I've spent four years running B2B SaaS products, most recently owning onboarding and activation at Kestrel, where I took activation from 31% to 52% over five quarters.",
      "The useful story is the quarter where that number didn't move. We'd assumed the drop-off was in the setup flow and spent six weeks rebuilding it — and activation stayed flat. When I finally sat in on five customer calls I found the real problem was that admins couldn't invite their team without a paid seat, so nobody ever reached the multiplayer moment the product depends on. We shipped free viewer seats in nine days and activation moved eleven points that month. It taught me to spend the first week on the interviews rather than the roadmap, and I've run every discovery cycle that way since.",
      "Your position is interesting to me because you're doing self-serve and enterprise sales at the same time, which is the hardest version of this problem — the instrumentation that tells you self-serve is working tends to be exactly what the enterprise motion ignores. I've run both alongside each other and would like to do it somewhere that has decided to take it seriously.",
      "I'd welcome a conversation. Thank you for your time.",
    ],
    closing: "Best regards,",
  },
  {
    id: "digital-marketing-manager",
    role: "Digital marketing manager",
    resumeSlug: "digital-marketing-manager",
    note: "Numbers everywhere, but each one attached to a decision rather than listed as a credential.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I'm applying for the Digital Marketing Manager role. I run acquisition for a DTC brand doing about £8m a year, across paid social, search and lifecycle email, on a £120k monthly budget.",
      "The change I'd point at is what we did with attribution. We'd been optimising Meta on platform-reported ROAS and it had been drifting up for months while blended CAC quietly got worse — the classic problem. I moved us onto a holdout-based measurement approach, ran geo tests on our three biggest channels, and found paid social was taking credit for roughly a third of conversions that email was actually driving. Reallocating against that took blended CAC from £41 to £29 over two quarters on flat spend, and it changed how the whole team argues about budget.",
      "What draws me to your business is that you've built a genuinely large owned audience and, from the outside, look to be under-monetising it relative to what you spend on acquisition. That's the problem I most enjoy, and it's the one where I think I'd be useful fastest.",
      "I'd be glad to talk it through. Thank you for considering my application.",
    ],
    closing: "Best regards,",
  },
  {
    id: "teacher",
    role: "Teacher",
    resumeSlug: "teacher",
    note: "Written for a reader who will hire on philosophy as much as on results, without becoming vague about either.",
    greeting: "Dear Mr Okafor,",
    paragraphs: [
      "I'm applying for the Year 9–13 Mathematics position. I've taught secondary maths for eight years, currently at Ashfield Academy, where I lead the KS4 curriculum for a cohort of about 210 students.",
      "The work I'm most confident about is what we did with the bottom set at KS4. When I took the group, 34% were achieving a grade 4 or above. Rather than reteaching the GCSE content more slowly, I spent the first half-term diagnosing where the arithmetic actually broke down — for most of them it was fractions, four years earlier — and rebuilt the sequence from there. Over two years the group went to 71% at grade 4 or above, and more usefully, students who had decided they were bad at maths largely stopped saying so.",
      "I'm applying to your school specifically because of the way the maths department has structured its intervention time. Most schools I've worked in treat intervention as extra lessons for the students who are furthest behind; you've built it into the timetable for everyone and staffed it properly, which is the approach I've been arguing for and haven't yet had a chance to teach inside.",
      "I would very much welcome the opportunity to discuss the role and to teach a sample lesson. Thank you for your time.",
    ],
    closing: "Yours sincerely,",
  },
  {
    id: "customer-service-representative",
    role: "Customer service representative",
    resumeSlug: "customer-service-representative",
    note: "An entry-accessible role written without filler. Volume and quality metrics both appear, because either alone is misleading.",
    greeting: "Dear Hiring Manager,",
    paragraphs: [
      "I'm applying for the Customer Service Representative position. I've spent three years in high-volume support, most recently handling around 60 contacts a day across chat and email for an online retailer, with a CSAT of 94% against a team average of 88%.",
      "The thing I'd want you to know is that I asked to take the escalations nobody wanted. Our hardest queue was delivery failures during peak, where the customer is angry and the answer is usually that we can't fix it today. I worked out that most of the anger came from not knowing rather than from the delay itself, so I started leading with what I actually knew and when I'd next know more, instead of with an apology. My resolution time on that queue went up slightly and my repeat-contact rate fell by about 40%, which is the number that actually costs the business money. The team adopted the approach the following quarter.",
      "I'd like to work at your company because you publish your response times openly, which very few companies in this space are willing to do. That suggests support is treated as something the business is accountable for rather than a cost to be minimised, and that's the difference between a job I'd stay in and one I wouldn't.",
      "Thank you for considering my application. I'd be glad to discuss it.",
    ],
    closing: "Kind regards,",
  },
];

export const getCoverLetterExample = (
  id: string,
): CoverLetterExample | undefined =>
  COVER_LETTER_EXAMPLES.find((example) => example.id === id);

/** The cover letter example matching a resume example, for the cross-link on
 *  /resume-examples/{slug}. */
export const coverLetterForResume = (
  resumeSlug: string,
): CoverLetterExample | undefined =>
  COVER_LETTER_EXAMPLES.find((example) => example.resumeSlug === resumeSlug);

export const HUB_FAQS: FaqEntry[] = [
  {
    question: "Do I still need a cover letter in 2026?",
    answer:
      "For roughly half of applications, yes. Where a posting asks for one, not sending it is a filter you fail before anyone reads your resume. Where it's optional, a letter is worth writing when you're changing field, when there's a gap or something else that needs explaining, when you have a referral, or when the role is competitive enough that the marginal effort matters. For a high-volume portal application to a role you match exactly, it's usually the lowest-value thing you could spend the next hour on.",
  },
  {
    question: "How long should a cover letter be?",
    answer:
      "Between 200 and 350 words — three or four short paragraphs on half a page. A full page of prose gets skimmed rather than read, and the parts that get skipped are always the middle, which is where your evidence is. If you can't make the argument in 350 words, the problem is usually that you're restating your resume rather than adding to it.",
  },
  {
    question: "Should I address it to a named person?",
    answer:
      "If you can find the name in about five minutes, use it. Beyond that, stop looking — \"Dear Hiring Manager\" is completely acceptable and much better than getting the name wrong or using \"To Whom It May Concern\", which reads as a form letter. Never guess at a title or a gendered honorific you aren't sure about.",
  },
  {
    question: "Can I use AI to write my cover letter?",
    answer:
      "To draft and to edit, yes — that's what the assistant in the editor is for, and it works from your resume so it has your actual history to draw on. What it can't invent is the specific detail that makes a letter worth reading: the story with the number in it, and the sentence about this company that couldn't apply to any other. Those have to come from you, and a letter without them reads as generated whether or not it was.",
  },
  {
    question: "Is my cover letter used to train an AI model?",
    answer:
      "No. Nothing you write here — resume or cover letter — is used to train a model. Your drafts are yours, they stay in your account, and you can delete them at any time.",
  },
  {
    question: "Should the cover letter repeat what's on my resume?",
    answer:
      "No, and this is the most common way a letter wastes its length. The reader has the resume. The letter's job is to do the thing a resume structurally cannot: connect one specific achievement to one specific requirement of this job, and explain anything that needs explaining. If a paragraph could be reconstructed from your bullet points, cut it.",
  },
];

export const TEMPLATE_FAQS: FaqEntry[] = [
  {
    question: "What should a cover letter template include?",
    answer:
      "Your name and contact details, the date, the recipient and company where you know them, a greeting, three or four paragraphs, a sign-off and your name. That's the whole structure, and it hasn't changed in decades. What varies usefully is the shape of the argument inside it, which is what the patterns on this page cover.",
  },
  {
    question: "Should my cover letter match my resume design?",
    answer:
      "Yes — same typeface, same accent colour, same margins. It's a small signal but it's read as attention to detail, and it costs nothing here because the letter builder inherits the settings from the resume you draft it against.",
  },
  {
    question: "Can I download a cover letter as a PDF?",
    answer:
      "Yes, as a real-text PDF, the same export the resume builder produces. Cover letters are part of the Ultimate plan at $17 a month, or $5 a month billed yearly; building and exporting resumes is free.",
  },
  {
    question: "Do cover letters go through an ATS?",
    answer:
      "Often they're stored rather than parsed and ranked, but treat them as parseable anyway: real text, no images, standard structure. The genuine risk is different — many portals have a plain-text paste box rather than a file upload, so keep a version whose meaning survives losing all its formatting.",
  },
];

export const EXAMPLE_FAQS: FaqEntry[] = [
  {
    question: "Can I copy one of these cover letter examples?",
    answer:
      "Copy the structure, not the sentences. Every letter here follows the same four-part shape, and that shape transfers to any role. The specifics can't — the whole reason these read as convincing is the detail in paragraph two, and detail borrowed from a stranger is exactly what a reader recognises as a template.",
  },
  {
    question: "What makes these different from a generic cover letter?",
    answer:
      "Each one contains a story that could only be told by the person who did the work, with a number attached, and a paragraph about the employer that could not be pasted into a letter to anyone else. Those two things are the entire difference between a letter that helps and a letter that costs you fifteen minutes.",
  },
  {
    question: "How do I write one for a role that isn't listed?",
    answer:
      "Use the closest example and follow the pattern — the four paragraphs work for any role, and the situational patterns cover the cases where your circumstances rather than your field are the complication. The examples here are matched to full resume examples, so start from the role page closest to yours.",
  },
];
