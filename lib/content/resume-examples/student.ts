// The entry-level examples: student, and anyone writing a resume with no
// employment history to put on it.
//
// This is a different writing problem from every other example on the site.
// The others are about selecting from too much material; this one is about
// establishing that coursework, projects, part-time work and volunteering are
// material at all — which is the thing most people in this position get wrong.

import type { ResumeExample } from "./types";

export const STUDENT_EXAMPLES: ResumeExample[] = [
  {
    slug: "student",
    role: "Student",
    aka: [
      "college student",
      "university student",
      "no experience",
      "first job",
      "undergraduate",
    ],
    category: "business",
    metaTitle: "Student Resume Example — First Job, No Experience ({year}) | meniacv",
    description:
      "A complete student resume example for a first job, with no professional experience — what to put on the page instead, how to order it, and the bullet patterns that work.",
    updated: "2026-07-31",
    intro:
      "The hardest resume to write is the first one, and not because the rules are different. It is because everyone tells you to lead with your experience and you do not think you have any. You almost certainly do — it is just filed under coursework, part-time work, a society you ran, or a project you built for yourself. This is what that looks like once it is on a page properly.",
    looksFor: [
      "Evidence you have done something outside a lecture theatre — a project, a job, a society, anything with an outcome attached",
      "A degree, expected graduation date and any grade worth stating",
      "Specific tools and skills rather than a list of adjectives about yourself",
      "Some sign you understand what the job involves day to day",
      "Reliability: a part-time job held for two years says more than most internships",
    ],
    sample: {
      name: "Nadia Rahman",
      title: "Business Management Student",
      email: "n.rahman@email.com",
      phone: "+44 7700 900432",
      location: "Leeds, UK",
      links: [
        { label: "LinkedIn", url: "linkedin.com/in/nadiarahman" },
        { label: "GitHub", url: "github.com/nrahman" },
      ],
      summary:
        "Final-year business management student graduating July 2026, with two years of customer-facing retail work alongside my degree and a dissertation on small-business pricing. Looking for a graduate operations or analyst role where the work is closer to spreadsheets than to slides.",
      experience: [
        {
          role: "Sales Assistant, Supervisor (from 2025)",
          company: "Waterstone & Co",
          location: "Leeds, UK",
          start: "2023-09",
          bullets: [
            "Promoted to weekend supervisor after 14 months; now open the store and run a team of **4** on Saturdays",
            "Cut stockroom pick times by about **a third** by reorganising the back room by turnover rather than by publisher",
            "Handle around **120 customer transactions** a shift, including refunds and complaints, with no escalations in 18 months",
          ],
        },
        {
          role: "Treasurer",
          company: "Leeds University Enterprise Society",
          location: "Leeds, UK",
          start: "2024-09",
          end: "2025-06",
          bullets: [
            "Managed a **£6,400** annual budget across 11 events and closed the year **£300** under budget",
            "Rebuilt the society's accounts in a shared spreadsheet after inheriting them on paper, which the committee still uses",
            "Negotiated venue rates that cut our largest event's cost by **£800** against the previous year",
          ],
        },
        {
          role: "Summer Intern, Operations",
          company: "Northgate Logistics",
          location: "Bradford, UK",
          start: "2025-06",
          end: "2025-08",
          bullets: [
            "Built the weekly delivery-exception report that replaced a manual email round-up, saving roughly **3 hours a week**",
            "Shadowed route planning and produced a written handover on the two bottlenecks I found",
          ],
        },
      ],
      education: [
        {
          // The degree line carries the dissertation and the relevant modules,
          // which is the advice this page gives — an entry that is only a
          // course title gives an interviewer nothing to ask about.
          degree:
            "BA (Hons) Business Management — predicted 2:1. Dissertation: pricing strategy in independent retail",
          school: "University of Leeds",
          location: "Leeds, UK",
          start: "2023-09",
          end: "2026-07",
        },
        {
          degree: "A-Levels: Maths (A), Economics (A), Geography (B)",
          school: "Bradford Sixth Form College",
          location: "Bradford, UK",
          start: "2021-09",
          end: "2023-06",
        },
      ],
      skills: [
        "Excel (pivot tables, VLOOKUP, INDEX/MATCH)",
        "SQL (basic)",
        "Power BI",
        "Google Workspace",
        "Stock management",
        "Budgeting",
        "Customer service",
        "Report writing",
      ],
      certifications: [
        {
          name: "Google Data Analytics Certificate",
          issuer: "Coursera",
          date: "2025-04",
        },
        {
          name: "Excel Skills for Business (Intermediate I)",
          issuer: "Macquarie University / Coursera",
          date: "2024-11",
        },
      ],
    },
    template: "meridian",
    sections: [
      {
        heading: "You have more experience than you think",
        body: [
          "The single most common mistake on a first resume is leaving things off because they do not feel like real jobs. A Saturday job in a shop, treasurer of a society, a dissertation, a side project, six months volunteering — all of it is evidence, and a page that omits it in favour of a paragraph about being a hard-working team player is throwing away the only material you have.",
          "The test is not whether something was paid or prestigious. It is whether you can describe what you did and what changed because of it. Two years of retail work with a promotion in it demonstrates reliability, judgement under pressure and the ability to hold a job alongside a degree — which is precisely what an employer is uncertain about when hiring someone with no career history.",
        ],
        list: [
          "Part-time and holiday work, however unrelated to the field",
          "Society and club positions, especially anything with a budget or a team",
          "Your dissertation or final-year project, described as work rather than as a title",
          "Personal projects — a site you built, a dataset you analysed, a business you tried",
          "Volunteering, tutoring, coaching, mentoring",
          "Certificates and online courses you actually finished",
        ],
      },
      {
        heading: "Where education goes",
        body: [
          "At the top, for exactly as long as it is the most impressive thing about you — which usually means until you have around a year of relevant full-time work. Include your expected graduation date rather than leaving it open, because an employer reading a graduate application needs to know when you are available.",
          "Give the degree some substance. A line naming your dissertation topic and three or four relevant modules is worth more than the degree title alone, because it gives an interviewer something to ask about. Include your grade or predicted grade if it is a 2:1 or above, or a GPA of roughly 3.5 or above; leave it off otherwise rather than drawing attention to it.",
          "A-Levels, IB or high school results belong on the page while you are a student and for a year or two after, then come off. Nobody hiring a 28-year-old cares.",
        ],
      },
      {
        heading: "Writing bullets when nothing had a revenue number",
        body: [
          "The advice to quantify everything is correct and it lands badly on a student resume, because most of what you have done did not have a KPI attached. The fix is to widen what counts as a number.",
          "Almost everything has a scale, a frequency, a duration or a comparison hiding in it. How many customers a shift? How large was the budget? How many people were on the committee? How long did the task take before and after you changed it? None of those are business metrics and all of them make a bullet concrete.",
          "\"Managed the society's budget\" is a responsibility. \"Managed a £6,400 annual budget across 11 events and closed £300 under\" is the same fact with the scale attached, and it is the version that gets read.",
        ],
      },
      {
        heading: "The summary, and what not to put in it",
        body: [
          "Three sentences: what you are studying and when you finish, the one or two things you have done that are relevant, and what you are looking for. That is all it needs to do.",
          "What it should not contain is adjectives about your character. \"Hard-working, passionate and detail-oriented graduate seeking an opportunity to leverage my skills\" is the single most common opening on a student resume and it says nothing that could not be said by anyone. Every claim in a summary should be one that would be strange to make if it were not true.",
        ],
      },
      {
        heading: "One page, and how to fill it honestly",
        body: [
          "One page, without exception, at this stage. If you are struggling to fill it, the answer is more detail on what you have done rather than more sections — three bullets on the retail job beats adding an Interests section to take up space.",
          "If you genuinely cannot fill a page, add a project. Building something small and describing it properly is the fastest way to turn a thin resume into a reasonable one, and it is a better use of a weekend than reformatting.",
        ],
      },
    ],
    keywords: [
      {
        group: "Transferable skills",
        terms: [
          "Customer service",
          "Time management",
          "Team leadership",
          "Problem solving",
          "Data entry",
          "Report writing",
          "Scheduling",
          "Budgeting",
          "Cash handling",
          "Inventory management",
        ],
      },
      {
        group: "Tools",
        terms: [
          "Microsoft Excel",
          "Pivot tables",
          "VLOOKUP",
          "Google Workspace",
          "PowerPoint",
          "Power BI",
          "SQL",
          "Canva",
          "Slack",
          "Trello",
        ],
      },
      {
        group: "Academic",
        terms: [
          "Dissertation",
          "Quantitative analysis",
          "Research methods",
          "Case study analysis",
          "Group project",
          "Presentation",
          "Statistics",
          "Literature review",
        ],
      },
      {
        group: "Graduate-scheme language",
        terms: [
          "Graduate",
          "Entry level",
          "Internship",
          "Placement year",
          "Expected graduation",
          "Predicted 2:1",
          "Available from",
          "Right to work",
        ],
      },
    ],
    mistakes: [
      "Opening with \"hard-working and passionate\" — every other applicant wrote the same sentence, and it is the first thing a reader skips",
      "Leaving off retail, hospitality or warehouse work because it isn't relevant. It demonstrates reliability, which is the exact thing being doubted",
      "Listing modules with no context — name the ones relevant to the job and your dissertation topic, not the full transcript",
      "An objective statement saying what you want. The employer is asking what you offer",
      "Padding to two pages. A full second page at this stage reads as inexperience rather than as substance",
      "Inventing a job title for a project. \"Founder\" of something with no users is read for what it is",
      "Listing every software you have ever opened. Ten skills you can discuss beat thirty you cannot",
      "Leaving off the expected graduation date, which is the first thing a graduate recruiter looks for",
    ],
    faqs: [
      {
        question: "How do I write a resume with no experience?",
        answer:
          "Use what you have: part-time work, society positions, your dissertation, personal projects, volunteering and finished courses. Describe each one as work — what you did and what changed — rather than listing it as a title. A student resume with a well-described Saturday job and a real project on it beats one padded with adjectives about being a team player.",
      },
      {
        question: "Should education go at the top of a student resume?",
        answer:
          "Yes, until you have around a year of relevant full-time work. Include your expected graduation date, your grade or predicted grade if it is a 2:1 or a GPA of about 3.5 and above, and a line naming your dissertation and a few relevant modules — that line gives an interviewer something to ask about.",
      },
      {
        question: "How long should a student resume be?",
        answer:
          "One page, without exception. If you cannot fill it, add detail to what is already there rather than adding sections — and if it is still thin, build a small project and describe it properly. That is a better use of a weekend than reformatting.",
      },
      {
        question: "Should I put my GPA or grade on my resume?",
        answer:
          "Include it if it is good — a 2:1 or first in the UK, roughly a 3.5 GPA or above in the US. Leave it off otherwise. Omitting it is unremarkable; including a weak one draws attention to the weakest fact about you.",
      },
      {
        question: "Do I need a cover letter for a first job?",
        answer:
          "More than you will later, yes. With little employment history, the letter is where you explain why you want this job specifically and what you have done that is relevant — the argument a thin resume cannot make on its own. The no-experience pattern on the cover letter templates page is written for exactly this.",
      },
      {
        question: "Can I put unfinished degrees or courses on a resume?",
        answer:
          "An in-progress degree, yes — that is what an expected graduation date is for. An abandoned one, only if the timeline would otherwise show an unexplained gap, and then state the dates honestly without implying completion. Courses you started and did not finish should come off.",
      },
    ],
    related: ["business-analyst", "customer-service-representative", "data-analyst"],
    guides: ["how-to-write-a-resume", "resume-bullet-points", "resume-length"],
  },
];
