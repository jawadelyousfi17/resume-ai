// The administrative and front-line service examples.
//
// Both of these roles are advertised in the language of duties — "greet
// customers", "manage calendars" — and both are hired on the basis of volume,
// judgement and reliability. The writing problem on these pages is the same:
// turning a job description everyone shares into evidence about one person.

import type { ResumeExample } from "./types";

export const ADMIN_SUPPORT_EXAMPLES: ResumeExample[] = [
  {
    slug: "administrative-assistant",
    role: "Administrative Assistant",
    aka: [
      "admin assistant",
      "executive assistant",
      "office administrator",
      "administrative coordinator",
      "office assistant",
    ],
    category: "commercial",
    metaTitle:
      "Administrative Assistant Resume Example & Guide ({year}) | meniacv",
    description:
      "A complete administrative assistant resume example, with the volume figures and systems detail that turn a generic duties list into evidence of how much you actually run.",
    updated: "2026-08-01",
    intro:
      "Administrative assistant postings are written as duty lists — manage calendars, coordinate travel, handle correspondence — and so are most of the resumes sent in reply. The result is a stack of applications that are indistinguishable from the job description and from each other. The way out is volume and consequence: how many people you support, how much you book, what would break without you.",
    looksFor: [
      "How many people you support, and at what level in the organisation",
      "The systems you run — calendaring, expense, travel, procurement — by product name",
      "Scale: meetings coordinated, travel booked, budget or expenses processed",
      "Evidence of judgement, not just execution — what you decided rather than what you were told",
      "Discretion, particularly for anyone supporting executives or handling confidential material",
      "Something you improved. A process that ran better after you touched it",
    ],
    sample: {
      name: "Priya Raman",
      title: "Senior Administrative Assistant",
      email: "p.raman@email.com",
      phone: "(206) 555-0163",
      location: "Seattle, WA",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/priyaraman" }],
      summary:
        "Administrative assistant with nine years supporting senior leadership in technology and professional services, currently the sole support for a four-person executive team and a 60-person department. Own the calendaring, travel, expense and vendor processes end to end, and rebuilt two of them. Looking for an executive assistant role with a chief of staff component.",
      experience: [
        {
          role: "Senior Administrative Assistant",
          company: "Northline Technologies",
          location: "Seattle, WA",
          start: "2021-09",
          bullets: [
            "Sole administrative support for the **VP of Engineering and three directors**, plus a **60-person** department",
            "Manage **four executive calendars** averaging **35–45 meetings a week**, including standing prioritisation calls when commitments conflict",
            "Book and reconcile domestic and international travel for the department — roughly **120 trips a year** against a **$480k** travel budget, closed under budget in each of the last three years",
            "Rebuilt the expense process onto Navan after the previous system caused month-end backlogs; average reimbursement time fell from **19 days to 6**",
            "Run quarterly all-hands and two annual offsites for 60+ attendees, owning venue, catering, travel and agenda",
            "Handle confidential material including compensation cycles, org changes and two acquisitions under NDA",
            "Onboard every new hire in the department — **34 since 2022** — covering equipment, access, first-week scheduling and buddy assignment",
          ],
        },
        {
          role: "Administrative Assistant",
          company: "Harbor & Finch Consulting",
          location: "Seattle, WA",
          start: "2018-03",
          end: "2021-08",
          bullets: [
            "Supported **12 consultants and two partners** across scheduling, client correspondence and document production",
            "Coordinated client meetings across **four time zones**, averaging **60+ scheduling requests a week**",
            "Built the proposal-formatting template the firm still uses, cutting document turnaround from a day to about two hours",
            "Managed office operations for a 40-person office: vendors, supplies, facilities requests and a **$90k** annual operating budget",
          ],
        },
        {
          role: "Office Coordinator",
          company: "Cascade Property Group",
          location: "Bellevue, WA",
          start: "2016-06",
          end: "2018-02",
          bullets: [
            "First point of contact for a 25-person office, handling reception, post, supplies and visitor management",
            "Processed **200+ invoices monthly** through the accounting system and chased outstanding approvals",
          ],
        },
      ],
      education: [
        {
          degree: "BA Communications",
          school: "Western Washington University",
          location: "Bellingham, WA",
          start: "2012-09",
          end: "2016-05",
        },
      ],
      skills: [
        "Executive calendar management",
        "Complex travel coordination",
        "Expense management (Navan, Concur)",
        "Event and offsite planning",
        "Vendor management",
        "Google Workspace",
        "Microsoft 365",
        "Slack",
        "Asana",
        "Coupa",
        "Confluence",
        "Minute-taking and follow-up tracking",
        "Confidential document handling",
        "Budget tracking",
      ],
    },
    template: "bergen",
    sections: [
      {
        heading: "Duties are not evidence — volume is",
        body: [
          "\"Managed executive calendars\" is on every administrative assistant resume ever written, including the ones from people who managed one calendar with four meetings a week. It carries no information because it does not distinguish anyone.",
          "\"Manage four executive calendars averaging 35–45 meetings a week, including standing prioritisation calls when commitments conflict\" describes a specific workload and a specific kind of judgement. The reader now knows the scale you operate at and that you are trusted to arbitrate between competing demands, which is the actual skill.",
          "Every duty on your list has a number attached to it somewhere. How many people, how many meetings, how many trips, how large a budget, how many invoices, how many events, how many new hires. Find them and put them in. This single pass does more for an administrative resume than any other change.",
        ],
        list: [
          "People supported, and their level",
          "Meetings coordinated per week, and how many calendars",
          "Trips booked per year, and the travel budget",
          "Events run, and attendee counts",
          "Invoices, expenses or purchase orders processed per month",
          "The size of any budget you were accountable for",
        ],
      },
      {
        heading: "Name the systems",
        body: [
          "Administrative work runs on software, and the products are specific enough that experience with the right one is a genuine hiring advantage. Concur, Navan, Expensify, Coupa, Workday, NetSuite, Salesforce, Asana, Monday, Confluence, Egnyte, DocuSign — an employer running one of these would rather not spend three weeks training you on it.",
          "This is also the part of your resume that a keyword search will actually match on. \"Proficient in Microsoft Office\" is assumed and matches nothing useful; \"Microsoft 365, Google Workspace, Concur, Coupa, Asana, DocuSign\" is a list of terms a recruiter is plausibly searching for.",
          "Be specific about depth where it matters. If you administer the tool rather than use it — you are the one who sets up approval chains in Coupa, or manages the Workspace org — say so, because that is a different and more valuable capability.",
        ],
      },
      {
        heading: "Show judgement, not just execution",
        body: [
          "The difference between an administrative assistant and a good one is decision-making, and it is the hardest thing to convey in a bullet. Execution is booking the trip. Judgement is knowing which of two conflicting meetings the VP should actually attend, catching that a vendor contract auto-renews next month, or rescheduling a week before an executive realises they need to.",
          "Write those. \"Standing prioritisation calls when commitments conflict\" says you are trusted to make the call. \"Flagged a vendor auto-renewal that saved a $22k charge for a service the team had stopped using\" is judgement with a number on it.",
          "The same applies to anything you improved. An administrative assistant who rebuilt a broken expense process, wrote the onboarding checklist the department now uses, or created the template that halved document turnaround has done work above the job description — and that is the evidence that gets someone hired into a more senior role rather than a lateral one.",
        ],
      },
      {
        heading: "Discretion and confidentiality",
        body: [
          "Anyone supporting executives handles material that is not public: compensation, performance, org changes, acquisitions, legal matters. Employers know this and screen for it, and most candidates leave it entirely implicit.",
          "State it, carefully. \"Handle confidential material including compensation cycles, org changes and two acquisitions under NDA\" tells a reader you have operated at that level of trust without disclosing anything. What you must not do is name the acquisition, the figures or the people — a resume that demonstrates discretion by breaching it is self-defeating, and readers notice.",
          "The same restraint applies in interviews, and stating it on the page sets up the right expectation.",
        ],
      },
      {
        heading: "Titles, and the executive assistant question",
        body: [
          "Administrative assistant, executive assistant, office administrator, administrative coordinator and office manager overlap enormously and are used inconsistently between organisations. What matters is scope, not the title you held.",
          "So describe the scope plainly and let the reader map it. Someone supporting a C-suite executive at a 40-person company may be doing more than an \"executive assistant\" at a large corporation who supports one director. If your title understated your role, do not inflate it — instead put the scope in the first bullet, where it does the same work honestly.",
          "If you are aiming for a step up into executive support or a chief of staff track, say so in the summary. It reframes the whole page as a trajectory rather than a lateral application.",
        ],
      },
    ],
    keywords: [
      {
        group: "Core administrative",
        terms: [
          "Calendar management",
          "Diary management",
          "Travel coordination",
          "Expense reports",
          "Meeting coordination",
          "Minute-taking",
          "Correspondence",
          "Document preparation",
          "Office management",
          "Reception",
          "Onboarding",
        ],
      },
      {
        group: "Systems",
        terms: [
          "Microsoft 365",
          "Google Workspace",
          "Outlook",
          "Concur",
          "Navan",
          "Expensify",
          "Coupa",
          "Workday",
          "NetSuite",
          "Asana",
          "Monday.com",
          "Slack",
          "Zoom",
          "DocuSign",
          "Confluence",
        ],
      },
      {
        group: "Scope and scale",
        terms: [
          "Executive support",
          "C-suite",
          "Multi-calendar",
          "International travel",
          "Cross-time-zone scheduling",
          "Budget tracking",
          "Vendor management",
          "Event planning",
          "Offsite coordination",
          "Purchase orders",
        ],
      },
      {
        group: "Judgement and trust",
        terms: [
          "Confidentiality",
          "NDA",
          "Discretion",
          "Prioritisation",
          "Stakeholder management",
          "Process improvement",
          "Gatekeeping",
          "Board materials",
        ],
      },
    ],
    mistakes: [
      "A duties list copied from the job description, which is indistinguishable from every other application",
      "No numbers anywhere — how many people, how many meetings, how large a budget",
      "\"Proficient in Microsoft Office\", which is assumed and matches nothing a recruiter searches for",
      "Naming systems generically (\"expense software\") instead of by product, which is exactly the term being searched",
      "Describing execution only, with no example of a decision you made or a process you fixed",
      "Naming confidential specifics to demonstrate you handle confidential material",
      "Inflating a title rather than describing the scope, which reads worse than the honest version",
      "Leaving off event and offsite work, which demonstrates project management under a different name",
    ],
    faqs: [
      {
        question: "What should an administrative assistant put on a resume?",
        answer:
          "How many people you support and at what level, the volume of your work — meetings, trips, events, invoices — the systems you use by product name, at least one process you improved, and evidence of judgement rather than execution alone. Numbers are what separate this resume from the job description.",
      },
      {
        question: "How do I make an admin assistant resume stand out?",
        answer:
          "Attach a number to every duty, name every system by product, and include one bullet showing a decision you made or something you fixed. Most applications in the stack are duty lists; a page with volume and consequence on it is immediately different.",
      },
      {
        question: "What is the difference between an administrative and an executive assistant resume?",
        answer:
          "Scope, not vocabulary. Executive support means fewer principals, more confidentiality, more independent prioritisation and more exposure to board or leadership material. If you have done that work under an administrative assistant title, describe the scope in your first bullet rather than changing the title.",
      },
      {
        question: "Should I list Microsoft Office on my resume?",
        answer:
          "Not as a line on its own — it has been assumed for fifteen years. List the specific platforms that differentiate you: Concur, Navan, Coupa, Workday, Asana, DocuSign, and any tool you administer rather than merely use.",
      },
      {
        question: "How do I show confidentiality on a resume?",
        answer:
          "Name the category of material without naming the material. \"Handled compensation cycles, org changes and two acquisitions under NDA\" demonstrates the trust level while proving the discretion. Listing the actual details would disprove the claim you were making.",
      },
      {
        question: "How long should an administrative assistant resume be?",
        answer:
          "One page under about ten years of experience, two beyond it. Keep older roles to one or two lines and give the space to your most recent position, where the scope is most relevant.",
      },
    ],
    related: ["customer-service-representative", "operations-manager", "medical-assistant"],
    guides: ["resume-bullet-points", "resume-skills", "what-to-put-on-a-resume"],
  },
  {
    slug: "cashier",
    role: "Cashier",
    aka: [
      "retail cashier",
      "checkout operator",
      "sales associate",
      "front end associate",
      "grocery cashier",
    ],
    category: "commercial",
    metaTitle: "Cashier Resume Example — Job Description & Duties ({year}) | meniacv",
    description:
      "A cashier resume example with the duties written as evidence rather than as a job description, plus what to put on the page when this is your first job.",
    updated: "2026-08-01",
    intro:
      "Most people writing a cashier resume are writing one of their first, and the advice they find tells them to list their duties. Every cashier has the same duties, so a duties list makes a hundred applicants identical. What a store manager is actually deciding is whether you will turn up, handle a queue without losing composure, and be trusted with the till — and all three of those can be evidenced.",
    looksFor: [
      "Availability, including weekends, evenings and holidays — often the deciding factor",
      "Transaction volume and till accuracy, which are the two measurable things in this job",
      "Evidence of reliability: how long you stayed, attendance, shifts picked up",
      "Composure with difficult customers, and any de-escalation or complaint handling",
      "The POS system by name, since training on an unfamiliar one costs the store hours",
      "Anything beyond the till — stock, opening or closing, training others, key holding",
    ],
    sample: {
      name: "Tyler Brennan",
      title: "Retail Cashier & Front-End Lead",
      email: "t.brennan@email.com",
      phone: "(503) 555-0119",
      location: "Portland, OR",
      links: [],
      summary:
        "Retail cashier with three years on the front end of a high-volume grocery store, currently a shift lead responsible for four registers and the self-checkout bank. Consistently under the store's till-variance threshold and trained six new cashiers. Available evenings, weekends and holidays, and looking for a full-time front-end or customer service desk role.",
      experience: [
        {
          role: "Cashier, promoted to Front-End Shift Lead (2025)",
          company: "Riverbend Market",
          location: "Portland, OR",
          start: "2023-05",
          bullets: [
            "Process **250–320 transactions per shift** on a high-volume front end, handling cash, card, EBT, WIC and store credit",
            "Maintain till variance under **$2 per shift** against a store threshold of $5, across three years",
            "Promoted to shift lead after 20 months; now supervise **four registers and the self-checkout bank**, approve overrides and handle escalations",
            "Trained **6 new cashiers** on POS, age-restricted sales and cash-handling procedure",
            "De-escalated an average of **3–4 customer complaints a week** at the register, referring only the ones requiring a refund above my authorisation",
            "Cut average self-checkout intervention time by reorganising the assist station so bagging supplies and override codes were within reach of the terminal",
          ],
        },
        {
          role: "Cashier and Stock Associate",
          company: "Northwest Hardware",
          location: "Portland, OR",
          start: "2022-06",
          end: "2023-04",
          bullets: [
            "Ran the register for **80–120 transactions a shift** and covered the returns desk",
            "Received and shelved deliveries twice weekly, and maintained the seasonal end-cap displays",
            "Held **perfect attendance** across 11 months and regularly picked up short-notice shifts",
          ],
        },
      ],
      education: [
        {
          degree: "High School Diploma",
          school: "Grant High School",
          location: "Portland, OR",
          start: "2019-09",
          end: "2023-06",
        },
      ],
      skills: [
        "POS operation (NCR, Toshiba)",
        "Cash handling and till reconciliation",
        "Card, EBT and WIC processing",
        "Self-checkout supervision",
        "Returns and exchanges",
        "Age-restricted sales compliance",
        "Loss prevention awareness",
        "Customer complaint handling",
        "Stock rotation and shelf replenishment",
        "Opening and closing procedures",
      ],
      certifications: [
        {
          name: "Oregon Food Handler Card",
          issuer: "Oregon Health Authority",
          date: "2024-03",
        },
      ],
    },
    template: "compact",
    sections: [
      {
        heading: "The job description is not your resume",
        body: [
          "\"Greeted customers, scanned items, processed payments, bagged groceries.\" That is the posting, written back to the manager who wrote it. Every applicant sends some version of it, which means it separates nobody and gets skimmed.",
          "Two numbers change this entirely, and every cashier has both. Transaction volume per shift, which tells a manager what pace you are used to — 300 transactions in a grocery rush is a different job from 60 in a boutique. And till accuracy, which is the one metric this role is genuinely measured on and which almost nobody thinks to include.",
          "\"Process 250–320 transactions per shift and maintain till variance under $2 against a $5 threshold\" is the same job as the duties list above, described by someone who is good at it.",
        ],
      },
      {
        heading: "Availability is doing more work than you think",
        body: [
          "Retail hiring is a scheduling problem more than a skills problem. Managers are covering evenings, weekends, holidays and the seasonal peak, and a candidate who is available for those is more valuable than a slightly more experienced one who is not.",
          "Put it in the summary, in plain words: \"Available evenings, weekends and holidays.\" It costs a line and it answers the question that decides a meaningful share of these hires. If you are limited — school hours, another job — say what you can do rather than leaving it to be discovered at the interview, because a manager who finds out late is annoyed rather than informed.",
          "Reliability is the other half of the same signal. Tenure, attendance and picking up short-notice shifts are all worth stating explicitly. In a role with high turnover, someone who stayed eighteen months is genuinely unusual.",
        ],
      },
      {
        heading: "Composure is the skill being hired for",
        body: [
          "Anyone can be trained to operate a till in an afternoon. What cannot be trained quickly is staying pleasant while a queue builds, a card declines, and someone is complaining about a price — and that is what a store manager is really trying to assess.",
          "So write it as an event rather than an adjective. \"Excellent customer service skills\" is a claim; \"de-escalate an average of three to four complaints a week at the register, referring only those requiring a refund above my authorisation\" is a description of someone who handles it and knows where the boundary is.",
          "Anything involving trust belongs here too: cash drops, opening or closing, key holding, approving overrides, handling the safe. Each of those is a manager having decided you were reliable, and that judgement transfers.",
        ],
      },
      {
        heading: "Everything beyond the register",
        body: [
          "Most cashiers do considerably more than cashiering, and leave all of it off. Stock and replenishment, receiving deliveries, returns desk, customer service desk, displays, inventory counts, training new starters, covering the floor. Each one broadens what a manager can schedule you for, which is the thing they are optimising.",
          "Training others is the strongest of these. A cashier who has trained six new hires has been trusted with the store's onboarding, and stating the number turns it from a soft claim into something countable.",
          "Also worth listing: the POS system by name. Stores run NCR, Toshiba, Square, Lightspeed, Clover, Shopify POS and others, and a candidate who already knows theirs saves training hours. It is the one technical keyword on the page and almost nobody includes it.",
        ],
      },
      {
        heading: "If this is your first job",
        body: [
          "You still have material. School, clubs, sports, volunteering, babysitting, helping in a family business — all of it evidences the same things a cashier role needs: turning up, handling people, being trusted. Write each one with a verb, a number and an outcome, exactly as you would a job.",
          "Lead with a summary that states what you are looking for and when you are available, then education, then whatever experience you have under an honest heading — \"Experience\" if it was paid work, \"Activities and Volunteering\" if it was not. Skills last, and specific: cash handling if you have done it, a food handler card if you hold one, languages spoken.",
          "One page, and do not pad it. A three-quarter page of real material reads far better than a full one propped up with \"hard-working team player\", and every manager hiring at this level knows exactly what a first resume looks like.",
        ],
      },
    ],
    keywords: [
      {
        group: "Register and cash",
        terms: [
          "POS",
          "Point of sale",
          "Cash handling",
          "Till reconciliation",
          "Cash drawer",
          "Card processing",
          "EBT",
          "WIC",
          "Refunds and exchanges",
          "Price overrides",
          "Self-checkout",
          "Loss prevention",
        ],
      },
      {
        group: "Customer service",
        terms: [
          "Customer service",
          "Complaint handling",
          "De-escalation",
          "Upselling",
          "Loyalty programme enrolment",
          "Queue management",
          "Product knowledge",
        ],
      },
      {
        group: "Store operations",
        terms: [
          "Stock replenishment",
          "Inventory count",
          "Receiving deliveries",
          "Merchandising",
          "Opening and closing",
          "Key holder",
          "Shift lead",
          "Planogram",
          "Stock rotation",
        ],
      },
      {
        group: "Compliance and availability",
        terms: [
          "Age-restricted sales",
          "Food handler card",
          "Health and safety",
          "Weekend availability",
          "Evening availability",
          "Holiday availability",
          "Full-time",
          "Part-time",
        ],
      },
    ],
    mistakes: [
      "Listing duties copied from the posting, which every other applicant has also done",
      "No transaction volume and no till accuracy — the two numbers this job is actually measured on",
      "Leaving availability off, when scheduling is what decides a large share of retail hires",
      "\"Excellent customer service skills\" instead of an example of handling a difficult customer",
      "Omitting the POS system by name, which is the one technical keyword on the page",
      "Not mentioning stock, returns, opening or training work, which broadens what you can be scheduled for",
      "Inflating the title — \"Customer Experience Associate\" for a checkout job reads as insecure",
      "Padding to fill a page. A short honest resume is completely normal for a first job",
    ],
    faqs: [
      {
        question: "What is a good cashier job description for a resume?",
        answer:
          "Not a description — a measured version of it. \"Process 250–320 transactions per shift handling cash, card, EBT and WIC; maintain till variance under $2 against a $5 store threshold\" covers the same duties as a generic list while telling a manager your pace and your accuracy.",
      },
      {
        question: "What are the duties of a cashier for a resume?",
        answer:
          "Transaction processing across payment types, till reconciliation, returns and exchanges, price overrides, self-checkout supervision, age-restricted sales compliance, and customer complaint handling — plus whatever else you cover, like stock, receiving, opening and closing, or training new starters. Attach a number to each one you can.",
      },
      {
        question: "How do I write a cashier resume with no experience?",
        answer:
          "Use school, clubs, sports, volunteering and informal work, each written with a verb, a number and an outcome. Lead with a summary stating what you want and your availability, then education, then your material under an honest heading. One page, no padding.",
      },
      {
        question: "What skills should a cashier put on a resume?",
        answer:
          "POS operation with the system named, cash handling and till reconciliation, card, EBT and WIC processing, returns and exchanges, age-restricted sales, de-escalation, stock replenishment, and any certification such as a food handler card. Specific and checkable beats a list of adjectives.",
      },
      {
        question: "Should I put availability on a retail resume?",
        answer:
          "Yes — a single line in your summary. Evening, weekend and holiday availability is the deciding factor in a large share of retail hires, and stating it up front is more useful than almost anything else you could put in that space.",
      },
    ],
    related: ["customer-service-representative", "student", "administrative-assistant"],
    guides: ["resume-with-no-experience", "high-school-resume", "resume-bullet-points"],
  },
];
