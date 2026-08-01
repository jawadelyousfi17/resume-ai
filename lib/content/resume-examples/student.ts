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
  {
    slug: "high-school-student",
    role: "High School Student",
    aka: [
      "high school resume",
      "teen resume",
      "first job",
      "high school graduate",
      "student with no work experience",
    ],
    category: "business",
    metaTitle:
      "High School Student Resume Example — First Job ({year}) | meniacv",
    description:
      "A complete high school student resume example for a first job or a college application, showing what counts as experience when school is most of your history.",
    updated: "2026-08-01",
    intro:
      "A high school resume is not an adult resume with the jobs removed. Education leads, activities count as experience, and the reader's question is whether you will turn up, learn quickly and not need managing. Once the page is answering that question rather than apologising for a thin work history, it fills up faster than most people expect.",
    looksFor: [
      "Availability — evenings, weekends, holidays, and when you can start",
      "Evidence you have sustained a commitment, whether that was a job, a team or a club",
      "Anything with responsibility attached: handling money, supervising, teaching, opening up",
      "Certifications that let an employer schedule you: food handler, lifeguard, first aid, driving licence",
      "A real email address and a phone you answer",
      "Specific skills rather than adjectives about your character",
    ],
    sample: {
      name: "Alicia Moreno",
      title: "High School Senior — Available Evenings & Weekends",
      email: "alicia.moreno@email.com",
      phone: "(915) 555-0174",
      location: "El Paso, TX",
      links: [],
      summary:
        "High school senior graduating May 2027, with two years of weekend concession work and a food handler card. Treasurer of the robotics club and a varsity swimmer. Looking for part-time restaurant or retail work, available evenings, weekends and school holidays.",
      experience: [
        {
          role: "Concession Stand Attendant",
          company: "Franklin High School Athletics Booster Club",
          location: "El Paso, TX",
          start: "2024-09",
          bullets: [
            "Run the register at home football and basketball games, serving roughly **200 customers** across a three-hour event",
            "Handle the cash float at open and close, and reconcile the drawer at the end of each game — **no shortfalls** across two seasons",
            "Trained **4 new volunteers** on the register and the food safety rules",
            "Suggested moving the drinks cooler to the front of the line, which cut the average queue at half-time noticeably",
          ],
        },
        {
          role: "Babysitter",
          company: "Private families — three regular clients",
          location: "El Paso, TX",
          start: "2023-06",
          bullets: [
            "Care for **five children aged 3–10** across three families, typically **8–10 hours a week** including school pickup, meals and bedtime",
            "Kept the same clients for over two years, including one family who now book me for weekend travel cover",
          ],
        },
      ],
      education: [
        {
          degree:
            "High School Diploma — expected May 2027. GPA 3.7. Coursework: AP Statistics, Physics, Spanish IV",
          school: "Franklin High School",
          location: "El Paso, TX",
          start: "2023-08",
          end: "2027-05",
        },
      ],
      skills: [
        "Cash handling and register operation",
        "Customer service",
        "Food safety",
        "Spanish (fluent)",
        "Google Workspace",
        "Basic bookkeeping",
        "Team leadership",
      ],
      certifications: [
        {
          name: "Texas Food Handler Certificate",
          issuer: "Texas Department of State Health Services",
          date: "2024-08",
        },
        {
          name: "First Aid & CPR",
          issuer: "American Red Cross",
          date: "2025-05",
        },
      ],
    },
    template: "meridian",
    sections: [
      {
        heading: "Education goes first, with substance",
        body: [
          "This is the one period in your life when your education section is the strongest thing on the page, so give it more than a school name. Expected graduation date, GPA if it is around 3.4 or above, and two or three courses that bear on what you are applying for.",
          "Expected graduation matters more than most people realise. An employer scheduling shifts needs to know when you finish and whether you are around in the summer, and leaving it out creates a question rather than an impression.",
          "Leave the GPA off if it is below that threshold. An omitted GPA is unremarkable; a weak one stated is the first thing a reader's eye lands on in a short section.",
        ],
      },
      {
        heading: "What counts as experience",
        body: [
          "Almost everything you have been dismissing. Babysitting is childcare with responsibility for a minor. Mowing lawns for six neighbours is a small business with repeat customers. Running the concession stand is cash handling and inventory. Being treasurer of a club is budgeting.",
          "The test is not whether it came with a payslip. It is whether you turned up when you said you would, took responsibility for something, and can say what happened as a result — which is precisely what an employer hiring for a first job is trying to establish, and none of it requires a previous employer.",
          "Coursework counts when it produced something. A research paper is not a bullet; a research paper that won a regional prize or that you presented to the school board is.",
        ],
        list: [
          "Informal and paid work: babysitting, tutoring, yard work, a family business",
          "Clubs and societies, especially anything with a budget, a team or a title",
          "Sports, where the argument is years of sustained commitment",
          "Volunteering, with hours or duration stated — that is what makes it credible",
          "Projects you finished: something you built, ran, organised or sold",
          "Certifications: food handler, lifeguard, first aid, a driving licence",
        ],
      },
      {
        heading: "Writing bullets when the numbers are small",
        body: [
          "The pattern is the same as any professional resume — a verb, a scale, an outcome — and the amounts are simply smaller. Small is not weak. A specific small number reads as true, where a vague large claim reads as inflated.",
          "\"Worked at the concession stand\" tells a reader nothing. \"Run the register at home games, serving roughly 200 customers across a three-hour event, and reconcile the drawer at close with no shortfalls across two seasons\" tells them you can handle volume and be trusted with money.",
          "\"Member of robotics club\" is a line. \"Treasurer of the robotics club; manage a $2,400 season budget and file the reimbursement paperwork for eight competitions\" is evidence, in the same amount of space.",
        ],
      },
      {
        heading: "Availability, and why it belongs in the summary",
        body: [
          "Employers hiring at this level are solving a scheduling problem. They need someone for Friday evenings, Saturday mornings and the December rush, and a candidate who states availability up front is easier to move forward than one who is slightly more experienced but unknown.",
          "So put it in the summary and be specific: evenings, weekends, school holidays, and when you can start. If school or sport limits you, say what you can do rather than leaving it to be discovered at the interview.",
          "The same logic applies to certifications. A food handler card, lifeguard certification or first aid qualification means the employer can schedule you immediately rather than after a training course, and that is a concrete advantage over other applicants.",
        ],
      },
      {
        heading: "A job application and a college application are different documents",
        body: [
          "An employer wants reliability, availability and evidence you can be taught. Lead with work, keep it to one page, and make your schedule and certifications easy to find.",
          "A college or scholarship reader wants depth and trajectory — did you stay with something long enough to get good at it, and did you take on more over time. That version leads with activities and leadership, states years of involvement explicitly, and gives more room to awards and coursework.",
          "Keep one document with everything on it and cut a version for each purpose. That is the same advice given to people thirty years into a career, and it works for the same reason.",
        ],
      },
    ],
    keywords: [
      {
        group: "Entry-level work",
        terms: [
          "Cash handling",
          "Register operation",
          "Customer service",
          "Food safety",
          "Stocking",
          "Cleaning and closing",
          "Order taking",
          "Babysitting",
          "Tutoring",
          "Lifeguarding",
        ],
      },
      {
        group: "Reliability signals",
        terms: [
          "Weekend availability",
          "Evening availability",
          "Holiday availability",
          "Punctual",
          "Attendance",
          "Team player",
          "Trained new staff",
          "Shift lead",
        ],
      },
      {
        group: "School and activities",
        terms: [
          "Expected graduation",
          "GPA",
          "Honor roll",
          "AP coursework",
          "Student government",
          "Varsity",
          "Club treasurer",
          "Volunteer hours",
          "National Honor Society",
        ],
      },
      {
        group: "Certifications",
        terms: [
          "Food handler card",
          "First aid",
          "CPR",
          "Lifeguard certification",
          "Driver's license",
          "OSHA 10",
        ],
      },
    ],
    mistakes: [
      "An objective saying you are seeking a position that will help you grow — it is about what you want, in the most valuable space on the page",
      "Leaving off babysitting, yard work or club roles because they are not \"real jobs\"",
      "No availability anywhere, when scheduling is what the employer is actually solving for",
      "An email address that is a nickname from a game rather than your name",
      "Padding with \"hard-working team player\" and \"proficient in Microsoft Word\" to fill the page",
      "Inflating a title — \"Customer Experience Associate\" for a Saturday job reads as insecure",
      "Listing a GPA below about 3.4, which draws attention to the weakest fact on a short page",
      "Stretching to two pages. One page, even a partly full one, is correct at this stage",
    ],
    faqs: [
      {
        question: "What should a high school student put on a resume?",
        answer:
          "Contact details, a short summary with your availability, education with expected graduation and GPA if it is strong, any paid or informal work, clubs and leadership, volunteering with hours, certifications, and specific skills. Education goes at the top — it is the strongest thing on the page at this stage.",
      },
      {
        question: "How do I write a high school resume with no work experience?",
        answer:
          "Count what you have been discounting: babysitting, yard work, club roles, sports, volunteering and school projects. Write each with a verb, a number and an outcome — \"cared for two children three evenings a week for 18 months\" rather than \"babysitting\". One page.",
      },
      {
        question: "How long should a high school resume be?",
        answer:
          "One page, and it is completely normal for it not to fill one. A three-quarter page of real material reads far better than a full page padded with adjectives, and every employer hiring at this level knows what a first resume looks like.",
      },
      {
        question: "Should I put my GPA on a high school resume?",
        answer:
          "Include it if it is roughly 3.4 or above, or if the application asks for it. Below that, leave it off and let your activities and work carry the page — an omitted GPA passes without comment, while a weak one is the first thing read.",
      },
      {
        question: "Is a high school resume different for college applications?",
        answer:
          "Yes. A job application leads with work, availability and certifications; a college or scholarship application leads with activities, leadership and depth of involvement, with years stated explicitly. Keep one master document and cut a version for each.",
      },
      {
        question: "Should I include my high school diploma once I have a degree?",
        answer:
          "No. Once you hold or are studying for a higher qualification, the high school entry is assumed and the line is better used elsewhere. It belongs on the page only while it is your highest qualification.",
      },
    ],
    related: ["student", "cashier", "customer-service-representative"],
    guides: ["high-school-resume", "resume-with-no-experience", "education-on-resume"],
  },
  {
    slug: "computer-science-student",
    role: "Computer Science Student",
    aka: [
      "CS student",
      "computer science graduate",
      "software engineering intern",
      "new grad software engineer",
      "cs resume",
    ],
    category: "engineering",
    metaTitle:
      "Computer Science Resume Example — Student & New Grad ({year}) | meniacv",
    description:
      "A complete computer science student resume example for internships and new-grad roles, with the projects section that does the work when your employment history is one summer.",
    updated: "2026-08-01",
    intro:
      "Every applicant for a new-grad software role has the same degree, roughly the same coursework and a similar GPA. The degree is table stakes, and the pile is enormous. What separates one CS resume from the next is the projects section — specifically, whether the projects on it were finished, used by anyone, and described in terms of what they do rather than what they were built with.",
    looksFor: [
      "Projects that shipped, with a link and a sense of whether anyone used them",
      "Internship experience, described as engineering rather than as attendance",
      "A concrete tech stack, named per project rather than as one undifferentiated list",
      "Evidence you can work in an existing codebase, not only from a blank file",
      "Graduation date, because hiring for new-grad roles runs on a calendar",
      "Anything that shows scale or constraint: data volume, users, latency, cost",
    ],
    sample: {
      name: "Rohan Desai",
      title: "Computer Science Student — Graduating May 2027",
      email: "r.desai@email.com",
      phone: "(512) 555-0136",
      location: "Austin, TX",
      links: [
        { label: "GitHub", url: "github.com/rohandesai" },
        { label: "LinkedIn", url: "linkedin.com/in/rohandesai" },
      ],
      summary:
        "Third-year computer science student at UT Austin, graduating May 2027. Backend-leaning: spent last summer on a payments team writing Go, and maintain a transit-delay API that has served about 90k requests since launch. Looking for a summer 2026 software engineering internship, ideally on infrastructure or backend systems.",
      experience: [
        {
          role: "Software Engineering Intern",
          company: "Lumen Payments",
          location: "Austin, TX",
          start: "2025-05",
          end: "2025-08",
          bullets: [
            "Shipped a **retry and backoff layer** for the settlement service in Go, cutting failed-batch reprocessing from a manual on-call task to an automatic one — about **6 pages a month** eliminated",
            "Added integration tests around the reconciliation path that caught **two pre-existing bugs** in edge-case currency rounding; both fixes went to production during the internship",
            "Worked in a **400k-line** existing codebase with code review, CI and a two-week release train, rather than on a greenfield project",
            "Presented the work to the platform team at the end-of-summer review and wrote the handover doc the following intern used",
          ],
        },
        {
          role: "Undergraduate Teaching Assistant, Data Structures",
          company: "UT Austin, Department of Computer Science",
          location: "Austin, TX",
          start: "2024-09",
          bullets: [
            "Run two weekly lab sections of **28 students each**, plus office hours",
            "Grade roughly **60 assignments a week** and wrote three of the current semester's autograder test suites",
          ],
        },
      ],
      education: [
        {
          degree:
            "BS Computer Science — GPA 3.8. Coursework: Operating Systems, Distributed Systems, Databases, Algorithms, Compilers",
          school: "University of Texas at Austin",
          location: "Austin, TX",
          start: "2023-08",
          end: "2027-05",
        },
      ],
      skills: [
        "Go",
        "Python",
        "TypeScript",
        "SQL (PostgreSQL)",
        "React",
        "Docker",
        "Kubernetes (basic)",
        "AWS (Lambda, S3, RDS)",
        "Redis",
        "Git and code review",
        "pytest, Go testing",
        "Linux",
      ],
    },
    template: "compact",
    sections: [
      {
        heading: "The projects section is the whole resume",
        body: [
          "For a new-grad application, the projects section is where differentiation happens, and most of them are written in a way that removes it. \"Built a full-stack web app using React, Node and MongoDB\" describes a tutorial. It could be any of two hundred applicants, because it is any of two hundred applicants.",
          "The fix is to describe what the thing does and whether it survived contact with reality. \"Built a transit-delay API over the city's GTFS feed; it has served about 90k requests since launch and the data pipeline runs nightly on a $5 VPS\" describes a person who shipped something, kept it running and thought about cost. Same project, entirely different signal.",
          "Three good projects beat eight. If a project was abandoned at 40%, either finish it or leave it off — a reader who clicks through to an empty repo has learned something you did not want them to.",
        ],
        list: [
          "What it does, in one clause, before what it was built with",
          "Whether anyone used it — requests, users, downloads, stars, a real deployment",
          "A constraint you worked under: latency, cost, data volume, a device limit",
          "A link that works, to a repo with a README that explains it",
          "The stack per project, so a reader can see which technologies you actually used where",
        ],
      },
      {
        heading: "Internships: write the engineering, not the attendance",
        body: [
          "Internship bullets tend to describe the experience of being an intern — attended standups, participated in code reviews, learned the codebase. None of that is a contribution.",
          "What a reader wants to know is what shipped and what it changed. \"Shipped a retry and backoff layer for the settlement service in Go, eliminating about six pages a month\" is engineering. So is \"added integration tests that caught two pre-existing bugs, both fixed in production during the internship\".",
          "The highest-value thing you can convey from an internship is that you worked inside an existing system. Almost every CS resume demonstrates the ability to start from a blank file; far fewer demonstrate the ability to read four hundred thousand lines of someone else's code and change it safely. Say so explicitly, because that is what the job is.",
        ],
      },
      {
        heading: "The skills list, and how to keep it honest",
        body: [
          "Group it — languages, frameworks, infrastructure, tools — rather than running twenty-five terms together. Order within each group is read as priority, so put what you would want to be interviewed on first.",
          "Do not rate yourself out of five. The scale is undefined and self-assigned, and it invites a question you would rather not answer. If the gradient matters, split the section into something like Core and Familiar, which conveys the same thing in words a reader can interpret.",
          "And keep it defensible. A language listed because you did one assignment in it will surface in the first technical screen, and being caught overstating is worse than a shorter list. The rough test: if it is on the page, you should be able to talk about something you built with it for two minutes.",
        ],
      },
      {
        heading: "Format, and the one-page rule",
        body: [
          "One page. There is no new-grad situation that justifies two, and stretching to two makes the thin parts conspicuous. Single column, plain typography, no photo, no skill bars, no colour beyond an accent.",
          "Order for a student: contact details with GitHub and LinkedIn, a short summary with your graduation date, education, experience, projects, skills. Move projects above experience if your projects are genuinely stronger than your internships — for many second-year applicants they are, and pretending otherwise buries your best material.",
          "Put your graduation date somewhere obvious. New-grad and internship hiring runs on a calendar, and a recruiter filtering for a summer 2026 cohort cannot place you without it.",
        ],
      },
      {
        heading: "Applying without an internship yet",
        body: [
          "Very common, and not fatal. The substitute is a projects section that is unusually good, plus anything that shows you have worked with other people's code: open-source contributions with links to merged pull requests, a hackathon project that got finished, a TA or lab-assistant role, a course project where you owned a component.",
          "Open-source contributions are worth more than their size suggests. A merged pull request against a real project — even a small one — demonstrates reading unfamiliar code, following a contribution process and responding to review, which is the closest thing to job experience available without a job.",
          "Class projects count, and should be described as work rather than as coursework. Name what you owned within a group project, because \"contributed to a team project\" tells a reader nothing about which part was yours.",
        ],
      },
    ],
    keywords: [
      {
        group: "Languages",
        terms: [
          "Python",
          "Java",
          "C++",
          "Go",
          "JavaScript",
          "TypeScript",
          "Rust",
          "SQL",
          "C",
          "Kotlin",
        ],
      },
      {
        group: "Frameworks and tools",
        terms: [
          "React",
          "Node.js",
          "Django",
          "Flask",
          "Spring",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "Docker",
          "Kubernetes",
          "Git",
          "CI/CD",
        ],
      },
      {
        group: "Coursework",
        terms: [
          "Data structures",
          "Algorithms",
          "Operating systems",
          "Distributed systems",
          "Databases",
          "Computer networks",
          "Compilers",
          "Machine learning",
          "Computer architecture",
          "Software engineering",
        ],
      },
      {
        group: "New-grad hiring language",
        terms: [
          "Software engineering intern",
          "New grad",
          "Entry level",
          "Expected graduation",
          "Open source contribution",
          "Hackathon",
          "Teaching assistant",
          "Capstone project",
        ],
      },
    ],
    mistakes: [
      "Projects described by their stack rather than by what they do — \"a full-stack app using React and Node\" is every other application",
      "Listing abandoned projects, or linking to a repo with no README",
      "Internship bullets about attending standups and learning the codebase rather than about what shipped",
      "Skill rating bars, which use a scale nobody has defined and invite a question you cannot win",
      "A twenty-five-item ungrouped skills list, including languages used once for an assignment",
      "No graduation date, when new-grad hiring runs on a calendar and recruiters filter by cohort",
      "Two pages. There is no new-grad case for a second page",
      "A full transcript of coursework rather than the four or five modules relevant to the role",
    ],
    faqs: [
      {
        question: "What should a computer science student put on a resume?",
        answer:
          "Contact details with a working GitHub link, a summary with your graduation date, education with GPA if strong and relevant coursework, any internships described by what shipped, a projects section, and a grouped skills list. One page.",
      },
      {
        question: "How do I write a CS resume with no internship?",
        answer:
          "Lead with projects and make them unusually good — finished, deployed, described by what they do, with a link that works. Add anything showing you have worked in someone else's code: merged open-source pull requests, a TA role, a course project where you owned a specific component.",
      },
      {
        question: "Should projects go above experience on a CS resume?",
        answer:
          "Yes if they are stronger than your internships, which is common in the first two years of a degree. Order the page by what makes the best case, not by convention — burying your best material under a thin experience section helps nobody.",
      },
      {
        question: "How do I describe a project on a resume?",
        answer:
          "What it does first, then the constraint you worked under, then whether anyone used it, then the stack. \"Transit-delay API over the city's GTFS feed; serves about 90k requests, pipeline runs nightly on a $5 VPS\" beats \"full-stack app built with React and Node\" by a wide margin.",
      },
      {
        question: "Should I list my GPA on a computer science resume?",
        answer:
          "Include it above roughly 3.4, and drop it once you are two or three years past graduation. Some large-company new-grad pipelines still filter on it, so omitting a strong one costs you; stating a weak one draws attention to it.",
      },
      {
        question: "How long should a new grad software engineer resume be?",
        answer:
          "One page, single column, no exceptions at this stage. If it is spilling over, the fix is cutting weak projects and trimming coursework rather than reducing the font size.",
      },
    ],
    related: ["software-engineer", "backend-developer", "student"],
    guides: ["jakes-resume-template", "college-student-resume", "resume-bullet-points"],
  },
];
