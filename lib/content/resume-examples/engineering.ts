// Software, data and infrastructure examples.

import type { ResumeExample } from "./types";

export const ENGINEERING_EXAMPLES: ResumeExample[] = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    aka: ["Software Developer", "Programmer", "SDE"],
    category: "engineering",
    metaTitle:
      "Software Developer Resume Examples & Templates ({year}) | meniacv",
    description:
      "A full software engineer resume example you can copy, plus the bullet points, skills and ATS keywords that get a developer past the screen and into an interview.",
    updated: "2026-07-29",
    intro:
      "A software engineer's resume is read twice: once by a parser looking for the stack, and once by an engineer deciding in about ten seconds whether you've built anything hard. Most developer resumes fail the second read, because they list technologies instead of saying what was shipped. Here is a full example that doesn't, and the reasoning behind every line of it.",
    looksFor: [
      "The stack, stated plainly and early — not buried in a paragraph",
      "Scale: users, requests, data volume, team size, uptime",
      "Ownership — \"built and shipped\" beats \"worked on\", every time",
      "Evidence of shipping to production, not just of learning",
      "A GitHub or a live project link that actually resolves",
    ],
    sample: {
      name: "Daniel Okafor",
      title: "Senior Software Engineer",
      email: "daniel.okafor@email.com",
      phone: "+1 (206) 555-0148",
      location: "Seattle, WA",
      links: [
        { label: "GitHub", url: "github.com/dokafor" },
        { label: "LinkedIn", url: "linkedin.com/in/danielokafor" },
      ],
      summary:
        "Backend-leaning software engineer with 7 years building payment and billing systems at scale. Comfortable owning a service end to end — schema, API, deploys, and the pager that comes with it. Most recently cut checkout latency by 60% for 2M monthly transactions.",
      experience: [
        {
          role: "Senior Software Engineer",
          company: "Northwind Commerce",
          location: "Seattle, WA",
          start: "2022-04",
          bullets: [
            "Own the payments service handling **2M transactions a month**; redesigned its settlement pipeline and cut p95 checkout latency from **1.4s to 550ms**",
            "Led the migration of 14 services from a shared monolith database to per-service Postgres, completed with **zero customer-facing downtime**",
            "Introduced contract tests across service boundaries, cutting integration incidents by **70%** over two quarters",
            "Mentor 3 engineers; two promoted to mid-level while on my team",
          ],
        },
        {
          role: "Software Engineer",
          company: "Lumen Labs",
          location: "Remote",
          start: "2019-06",
          end: "2022-03",
          bullets: [
            "Built the billing API that became the company's second revenue line, from empty repo to **$4M ARR** in 18 months",
            "Replaced nightly batch reconciliation with an event-driven pipeline in Go, taking data freshness from **24 hours to under 5 minutes**",
            "Reduced AWS spend **$18k/month** by right-sizing instances and adding request-level caching",
          ],
        },
        {
          role: "Junior Software Engineer",
          company: "Cascade Systems",
          location: "Portland, OR",
          start: "2018-01",
          end: "2019-05",
          bullets: [
            "Shipped the internal admin tool used daily by the 40-person support team",
            "Wrote the test harness that took CI from **no coverage to 65%** on the core module",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Computer Science",
          school: "University of Washington",
          location: "Seattle, WA",
          start: "2014-09",
          end: "2017-12",
        },
      ],
      skills: [
        "Go",
        "TypeScript",
        "Python",
        "PostgreSQL",
        "Kubernetes",
        "AWS",
        "gRPC",
        "Terraform",
        "Kafka",
        "CI/CD",
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          date: "2023-05",
        },
      ],
    },
    template: "meridian",
    sections: [
      {
        heading: "Lead with the stack, then prove you shipped with it",
        body: [
          "A recruiter screening developer applications is pattern-matching against a requisition: Go, Postgres, Kubernetes, five years. If those words aren't findable in the first third of the page, the resume can be excellent and still not survive the filter. That's the argument for a short summary that names the stack, and a skills block that isn't at the very bottom.",
          "But naming the stack is only the ticket in. The engineer who reads it next has seen a hundred resumes listing the same ten technologies, and what separates them is whether anything on the page was hard. \"Experience with Kubernetes\" says nothing. \"Migrated 14 services off a shared database with zero downtime\" says you have done the thing that goes wrong.",
        ],
      },
      {
        heading: "Write bullets as outcome, not assignment",
        body: [
          "The most common failure in a developer resume is describing the ticket instead of the result. \"Worked on the checkout flow\" is a fact about your calendar. \"Cut p95 checkout latency from 1.4s to 550ms\" is a fact about the product, and it implies the work.",
          "The pattern that holds up: what you owned, what you did to it, and the number that moved. Two of the three is usually enough. If you genuinely have no metric — plenty of good work has none — use scale instead: how many users, how much data, how many services, how big the team.",
        ],
        list: [
          "Owned X → did Y → metric moved from A to B",
          "Built X, now used by N people / serving N requests",
          "Replaced X with Y, cutting cost/latency/incidents by N%",
          "Led the migration of X, completed with no downtime",
        ],
      },
      {
        heading: "Seniority is shown by scope, not adjectives",
        body: [
          "Nobody is convinced by \"senior engineer with strong leadership skills\". Scope convinces. A junior fixes bugs in a service; a mid-level owns features in it; a senior owns the service, decides its shape, and is the person other engineers ask. Write the sentence that only a senior could truthfully write, and the level takes care of itself.",
          "Mentoring is worth one line and no more. \"Mentor 3 engineers; two promoted to mid-level\" is credible because it has an outcome attached. A paragraph about your leadership philosophy is not.",
        ],
      },
      {
        heading: "Projects earn their place only when they replace experience",
        body: [
          "If you have three years of professional work, a personal projects section competes with it for space and usually loses. Cut it, and put the one project that's genuinely impressive into your links.",
          "If you're early — a bootcamp graduate, a career changer, a new grad — projects are the whole argument, and they should be treated like jobs: what it does, what you built it with, and something that proves it's real. Users, stars, uptime, a live URL. A tutorial to-do app with none of those attached reads as coursework, because it is.",
        ],
      },
      {
        heading: "Keep it to one page until it can't be",
        body: [
          "One page through roughly eight years, two after that if the second page is full of substance rather than a spillover of your skills list. The pressure that puts on the page is useful: it forces the oldest, weakest bullets out, which are exactly the ones that dilute the strong ones.",
          "The internship from 2016 can go the moment you have two real jobs. So can the line about being a fast learner.",
        ],
      },
    ],
    keywords: [
      {
        group: "Languages",
        terms: [
          "Go",
          "Python",
          "Java",
          "TypeScript",
          "JavaScript",
          "C#",
          "Rust",
          "Kotlin",
          "SQL",
        ],
      },
      {
        group: "Infrastructure & platform",
        terms: [
          "AWS",
          "GCP",
          "Azure",
          "Kubernetes",
          "Docker",
          "Terraform",
          "CI/CD",
          "GitHub Actions",
          "Observability",
        ],
      },
      {
        group: "Data & messaging",
        terms: [
          "PostgreSQL",
          "MySQL",
          "Redis",
          "Kafka",
          "DynamoDB",
          "Elasticsearch",
          "Event-driven architecture",
        ],
      },
      {
        group: "Practice",
        terms: [
          "Microservices",
          "REST APIs",
          "gRPC",
          "Code review",
          "Unit testing",
          "Agile",
          "Scrum",
          "On-call",
          "System design",
        ],
      },
    ],
    mistakes: [
      "A skills list of 40 technologies, which tells a reader you're a beginner at most of them",
      "Rating yourself out of five on languages — no engineer believes the numbers",
      "\"Worked on\" and \"helped with\" as the verb on every bullet",
      "Listing the framework but never the thing you built with it",
      "A two-column layout that puts the whole stack in a sidebar an older parser drops",
      "Naming a private employer repo as your portfolio link",
    ],
    faqs: [
      {
        question: "Should a software engineer resume be one page or two?",
        answer:
          "One page up to about eight years of experience, two beyond that. Two pages are fine for a senior or staff engineer with real depth to show; they are not a licence to keep every internship. What gets cut first is the oldest role and any bullet without a result in it.",
      },
      {
        question: "Do I need a GitHub link?",
        answer:
          "It helps if the profile has something on it. A link to an empty account is worse than no link, and a reviewer who clicks through to three abandoned tutorial forks has learned something you didn't want them to. One repo with a readme that explains what it does beats twenty without.",
      },
      {
        question: "Where should the skills section go?",
        answer:
          "Near the top for a screening-heavy process, since that's where a recruiter looks and where a parser finds it fastest. Group by kind — languages, infrastructure, data — rather than by confidence, and leave out anything you'd rather not be interviewed on.",
      },
      {
        question: "How do I write a resume with no professional experience yet?",
        answer:
          "Treat projects as the experience section: what it does, what you built it with, and evidence it's real — users, a live URL, contributions to something you didn't start. Internships, open-source work and freelance jobs all count as experience and should be written the same way as a job.",
      },
      {
        question: "Does the ATS actually reject resumes automatically?",
        answer:
          "Almost never automatically. It parses your resume into fields and ranks it against the posting; a human then reads the top of the pile. The real risk isn't rejection, it's a parse that loses your job titles or dates and leaves you unrankable.",
      },
    ],
    related: [
      "frontend-developer",
      "backend-developer",
      "full-stack-developer",
      "devops-engineer",
    ],
    guides: ["ats-friendly-resume", "resume-bullet-points", "ai-resume-builder"],
  },

  {
    slug: "frontend-developer",
    role: "Frontend Developer",
    aka: ["Front End Engineer", "UI Developer", "React Developer"],
    category: "engineering",
    metaTitle: "Frontend Developer Resume Example & Guide ({year}) | meniacv",
    description:
      "A frontend developer resume example with React bullet points that show performance and accessibility work, plus the skills and keywords hiring teams screen for.",
    updated: "2026-07-29",
    intro:
      "Frontend hiring has a credibility problem: everyone claims React, so the word does nothing on its own. What separates a strong frontend resume is evidence of the things that are genuinely hard — performance on real devices, accessibility that survives an audit, and a component system other teams actually adopted.",
    looksFor: [
      "A framework claim backed by something shipped and public",
      "Core Web Vitals, bundle size, or render performance with numbers",
      "Accessibility named specifically — WCAG, screen readers, keyboard paths",
      "Design-system work, and whether anyone else used it",
      "Collaboration with design, not just ticket delivery",
    ],
    sample: {
      name: "Priya Raman",
      title: "Senior Frontend Developer",
      email: "priya.raman@email.com",
      phone: "+44 7700 900312",
      location: "London, UK",
      links: [
        { label: "Portfolio", url: "priyaraman.dev" },
        { label: "GitHub", url: "github.com/priyaraman" },
      ],
      summary:
        "Frontend developer with 6 years in React and TypeScript, focused on performance and accessibility. Took a 6MB dashboard bundle to 900KB and shipped the design system now used across four product teams.",
      experience: [
        {
          role: "Senior Frontend Developer",
          company: "Kestrel Analytics",
          location: "London, UK",
          start: "2022-09",
          bullets: [
            "Rebuilt the analytics dashboard in React and TypeScript, cutting the initial bundle from **6MB to 900KB** and LCP from **4.1s to 1.3s**",
            "Built and documented the component library now used by **4 product teams**, with 60+ components and visual regression tests",
            "Took the product from **31 to 0 critical axe violations** and to WCAG 2.2 AA sign-off on the core flows",
            "Introduced Playwright end-to-end coverage on checkout, catching 12 regressions before release in the first quarter",
          ],
        },
        {
          role: "Frontend Developer",
          company: "Havenly",
          location: "London, UK",
          start: "2020-02",
          end: "2022-08",
          bullets: [
            "Shipped the marketing site rebuild in Next.js; organic conversion rose **22%** on a **34-point Lighthouse gain**",
            "Replaced a hand-rolled state layer with React Query, deleting **4,000 lines** and most of the cache bugs with it",
            "Paired weekly with design to turn the Figma library into shared tokens, ending the drift between spec and build",
          ],
        },
        {
          role: "Junior Web Developer",
          company: "Brightside Studio",
          location: "Manchester, UK",
          start: "2019-01",
          end: "2020-01",
          bullets: [
            "Built responsive marketing sites for 11 clients on a two-developer team",
            "Introduced the studio's first shared CSS conventions, cutting new-site setup from days to hours",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Computer Science",
          school: "University of Manchester",
          location: "Manchester, UK",
          start: "2015-09",
          end: "2018-06",
        },
      ],
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "CSS architecture",
        "Web performance",
        "Accessibility (WCAG)",
        "Testing Library",
        "Playwright",
        "Design systems",
        "GraphQL",
      ],
    },
    template: "compact",
    sections: [
      {
        heading: "\"React\" is table stakes — the differentiator is what you fixed",
        body: [
          "Every frontend resume in the pile says React, TypeScript, and responsive design. Those words get you parsed; they don't get you picked. What gets you picked is the sentence a weaker candidate can't write, and in frontend that's almost always performance, accessibility, or systems adoption.",
          "So instead of \"developed responsive UIs using React\", write the one that has a number in it: \"cut the initial bundle from 6MB to 900KB and LCP from 4.1s to 1.3s\". The stack is implied. The judgement isn't, and that's what's being assessed.",
        ],
      },
      {
        heading: "Performance work is the easiest place to find real metrics",
        body: [
          "Frontend is unusually well instrumented, which is a gift for anyone writing a resume. Lighthouse scores, Core Web Vitals, bundle sizes, time to interactive, render counts — these are all numbers you can honestly quote, and most developers never think to.",
          "Pair the technical number with the business one where you have it. \"34-point Lighthouse gain\" is good; \"22% lift in organic conversion on a 34-point Lighthouse gain\" is the version that survives the conversation with the hiring manager's manager.",
        ],
        list: [
          "Bundle size before and after",
          "LCP, CLS, INP, or the Lighthouse score",
          "Number of components, and how many teams adopted them",
          "Accessibility violations closed, or the audit you passed",
          "Test coverage added, and the regressions it caught",
        ],
      },
      {
        heading: "Accessibility, stated specifically",
        body: [
          "\"Passionate about accessibility\" is a phrase that appears on resumes belonging to people who have never opened a screen reader. Naming the standard, the tool, or the outcome is what makes the claim land: WCAG 2.2 AA, axe, VoiceOver, keyboard-only navigation, focus management in a modal.",
          "This matters more than it used to. Public-sector and enterprise buyers increasingly require accessibility conformance, so a developer who has actually been through an audit is solving a procurement problem, not just a moral one. Say that you've done it.",
        ],
      },
      {
        heading: "A portfolio link that loads is worth a paragraph of prose",
        body: [
          "Frontend is the one specialism where the work can be inspected in a browser in five seconds, and reviewers do exactly that. One live, fast, accessible site under your own name will do more than any bullet on the page — and a portfolio that's slow or broken does proportionate damage, since the medium is the message here.",
          "Keep the link short and put it in the header next to your email. If your best work is under NDA, ship something small of your own instead; a single well-built page beats a list of client names nobody can click.",
        ],
      },
    ],
    keywords: [
      {
        group: "Core",
        terms: [
          "React",
          "TypeScript",
          "JavaScript (ES6+)",
          "HTML5",
          "CSS3",
          "Next.js",
          "Vue",
          "Svelte",
        ],
      },
      {
        group: "Styling & systems",
        terms: [
          "Tailwind CSS",
          "CSS Modules",
          "Design systems",
          "Design tokens",
          "Storybook",
          "Responsive design",
          "Figma",
        ],
      },
      {
        group: "Quality",
        terms: [
          "Jest",
          "Testing Library",
          "Playwright",
          "Cypress",
          "Accessibility",
          "WCAG 2.2",
          "axe",
          "Visual regression testing",
        ],
      },
      {
        group: "Performance & delivery",
        terms: [
          "Core Web Vitals",
          "Lighthouse",
          "Code splitting",
          "Server-side rendering",
          "Webpack",
          "Vite",
          "CI/CD",
          "GraphQL",
          "REST APIs",
        ],
      },
    ],
    mistakes: [
      "A skills list that mixes React with \"HTML\" as though they're comparable claims",
      "Naming every CSS framework you've ever touched, which reads as none of them well",
      "No portfolio link on a resume for a job that is visual by definition",
      "A portfolio that scores 40 on Lighthouse, on a resume claiming performance work",
      "\"Pixel-perfect\" — it signals you take specs literally rather than think about layout",
      "Describing designs you implemented without a single word on what they achieved",
    ],
    faqs: [
      {
        question: "Do I need a portfolio site as a frontend developer?",
        answer:
          "Practically, yes — reviewers click, and it's the fastest evidence you have. It doesn't need to be elaborate; one page with three projects, each with a live link and two sentences on what was hard, outperforms most elaborate portfolios. Just make sure it's fast and keyboard-navigable, because it will be judged as a work sample.",
      },
      {
        question: "Should I list React version numbers or specific hooks?",
        answer:
          "No. Version numbers age badly and hook names read as padding. Say React and TypeScript, then spend the space on what you built and how fast it loaded.",
      },
      {
        question: "How do I show frontend work that's behind a login?",
        answer:
          "Describe the outcome with numbers instead of showing the pixels — bundle size, Web Vitals, adoption across teams, violations closed. If everything you've shipped is private, build one small public thing so there's something to click.",
      },
      {
        question: "Is a design-heavy resume layout a good idea for frontend roles?",
        answer:
          "A clean, well-typeset resume is read as good taste; a two-column layout with icons and skill meters is read as a template. Keep the structure conventional so it parses, and let the portfolio carry the visual argument.",
      },
    ],
    related: [
      "software-engineer",
      "full-stack-developer",
      "ux-designer",
      "backend-developer",
    ],
    guides: ["ats-friendly-resume", "resume-bullet-points", "resume-format"],
  },

  {
    slug: "backend-developer",
    role: "Backend Developer",
    aka: ["Backend Engineer", "Server-Side Developer", "API Developer"],
    category: "engineering",
    metaTitle: "Backend Developer Resume Example & Guide ({year}) | meniacv",
    description:
      "A backend engineer resume example built around scale, reliability and data — with the bullet points, skills and ATS keywords that get past the screen.",
    updated: "2026-07-29",
    intro:
      "Backend work is invisible when it goes well, which makes it hard to write about. The resumes that land interviews solve that by quantifying the invisible: throughput, latency, uptime, cost, and the incidents that stopped happening after you changed something.",
    looksFor: [
      "Scale in concrete units — requests per second, rows, tenants, GB",
      "Reliability ownership: SLOs, on-call, incident response, postmortems",
      "Data modelling judgement, not just ORM familiarity",
      "Migrations done safely on live systems",
      "Cost awareness — infrastructure spend is a backend outcome",
    ],
    sample: {
      name: "Tomás Herrera",
      title: "Backend Engineer",
      email: "tomas.herrera@email.com",
      phone: "+34 600 555 214",
      location: "Madrid, Spain",
      links: [
        { label: "GitHub", url: "github.com/therrera" },
        { label: "LinkedIn", url: "linkedin.com/in/tomasherrera" },
      ],
      summary:
        "Backend engineer with 8 years on high-throughput Python and Go services. I own systems end to end, including the pager: took a logistics platform from 99.5% to 99.98% availability while tripling its traffic.",
      experience: [
        {
          role: "Backend Engineer",
          company: "Ruta Logistics",
          location: "Madrid, Spain",
          start: "2021-05",
          bullets: [
            "Own the routing and dispatch services handling **12k requests/second** at peak across 9 countries",
            "Raised availability from **99.5% to 99.98%** by adding circuit breakers, backpressure and a read-replica strategy — while traffic tripled",
            "Redesigned the shipments schema and ran the online migration of **1.2B rows** with no write downtime",
            "Cut infrastructure spend **€23k/month** by replacing per-request geocoding with a tiered cache",
            "Set the on-call rotation and postmortem process now used by all four backend teams",
          ],
        },
        {
          role: "Software Engineer, Platform",
          company: "Bandeja",
          location: "Barcelona, Spain",
          start: "2018-03",
          end: "2021-04",
          bullets: [
            "Built the multi-tenant billing service for **1,400 business customers**, including proration and dunning",
            "Replaced Celery batch jobs with a Kafka pipeline, cutting order-processing lag from **40 minutes to 30 seconds**",
            "Took API p99 from **2.3s to 400ms** by fixing N+1 queries and adding composite indexes",
          ],
        },
      ],
      education: [
        {
          degree: "MSc, Computer Engineering",
          school: "Universidad Politécnica de Madrid",
          location: "Madrid, Spain",
          start: "2015-09",
          end: "2017-07",
        },
        {
          degree: "BSc, Software Engineering",
          school: "Universidad de Granada",
          location: "Granada, Spain",
          start: "2011-09",
          end: "2015-06",
        },
      ],
      skills: [
        "Go",
        "Python",
        "PostgreSQL",
        "Kafka",
        "Redis",
        "Kubernetes",
        "gRPC",
        "Distributed systems",
        "Observability",
        "Terraform",
      ],
      certifications: [
        {
          name: "Certified Kubernetes Application Developer (CKAD)",
          issuer: "The Linux Foundation",
          date: "2022-11",
        },
      ],
    },
    template: "ledger",
    sections: [
      {
        heading: "Quantify the invisible",
        body: [
          "Nobody sees a backend service that works, so the resume has to describe it in numbers or it describes nothing. The good news is that backend work generates more measurable outcomes than almost any other specialism, and most of them are sitting in a dashboard you already look at.",
          "Requests per second, p99 latency, availability, rows migrated, queue lag, monthly spend. Any two of those in a bullet make it concrete. \"Improved system performance\" uses the same number of words to say nothing at all.",
        ],
        list: [
          "Throughput: requests/second, jobs/hour, events/day",
          "Latency: p95 and p99, before and after",
          "Reliability: availability, error rate, incident count",
          "Data: rows, tables, tenants, storage volume",
          "Cost: monthly infrastructure spend removed",
        ],
      },
      {
        heading: "Reliability ownership is a seniority signal",
        body: [
          "The line between a mid-level backend developer and a senior one is usually the pager. Someone who has been on call for a system they built, has run a postmortem without blaming anyone, and has set an SLO they had to defend is operating at a different level from someone who has only written features.",
          "Say so explicitly. On-call, incident response, SLOs, error budgets, and process you introduced rather than merely followed. This is the part of the job most resumes leave out, which makes it unusually cheap signal.",
        ],
      },
      {
        heading: "Migrations are the best story you have",
        body: [
          "Changing a schema on a live system with real customers is the hardest routine thing in backend engineering, and describing one well proves more than any framework claim. The details that matter are the scale, the safety, and the fact that nothing broke: \"online migration of 1.2B rows with no write downtime\".",
          "The same is true of decomposition work — pulling a service out of a monolith, moving off a shared database, replacing a batch job with a stream. Say what the old thing cost and what the new one made possible.",
        ],
      },
      {
        heading: "Show data judgement, not ORM familiarity",
        body: [
          "\"Experience with SQL and ORMs\" is a claim every applicant makes. What a hiring team is actually trying to find out is whether you can model a domain, choose an index, spot an N+1, and know when a relational database is the wrong tool.",
          "You demonstrate that with specifics: the composite index that took p99 from 2.3s to 400ms, the denormalisation you chose deliberately, the queue you added because the write path didn't need to be synchronous. One such bullet answers the question the interview would otherwise have to.",
        ],
      },
    ],
    keywords: [
      {
        group: "Languages",
        terms: ["Go", "Python", "Java", "Node.js", "C#", "Rust", "Ruby", "SQL"],
      },
      {
        group: "Data",
        terms: [
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "DynamoDB",
          "Elasticsearch",
          "Database design",
          "Query optimisation",
          "Schema migration",
        ],
      },
      {
        group: "Architecture",
        terms: [
          "Microservices",
          "REST APIs",
          "gRPC",
          "Event-driven architecture",
          "Kafka",
          "RabbitMQ",
          "Distributed systems",
          "Caching",
          "Idempotency",
        ],
      },
      {
        group: "Operations",
        terms: [
          "Kubernetes",
          "Docker",
          "AWS",
          "Terraform",
          "CI/CD",
          "Observability",
          "Prometheus",
          "SLOs",
          "On-call",
          "Incident response",
        ],
      },
    ],
    mistakes: [
      "Describing services with no indication of how much traffic they carried",
      "\"Improved performance\" with no before-and-after number attached",
      "Listing every AWS service by name instead of what you built on them",
      "Omitting on-call and incident work, which is the strongest seniority signal you have",
      "Framing a migration as a task rather than as a risk you managed",
      "Claiming distributed systems experience with nothing distributed on the page",
    ],
    faqs: [
      {
        question: "How do I show scale if my systems were small?",
        answer:
          "Use the real numbers anyway and let them be modest — \"400 requests/second across 60 business customers\" is credible and specific, and specificity is what's being rewarded. Inflated scale is the one thing that reliably fails in a technical interview, because the follow-up questions are about architecture you'd need to have actually built.",
      },
      {
        question: "Should I list every AWS service I've used?",
        answer:
          "No. Name the platform and the handful of services central to your work, then describe what you built. A list of twenty services reads as a tour, not as depth.",
      },
      {
        question: "Do backend developers need a GitHub portfolio?",
        answer:
          "Less than frontend developers do, because backend work is hard to demonstrate in a browser. Professional scale is the stronger evidence. If you have no professional backend experience yet, then yes — build something with a real database and real load behind it, and write the readme explaining the design decisions.",
      },
      {
        question: "Is a database section worth adding separately?",
        answer:
          "Group databases under skills rather than giving them their own section, but keep them distinct from languages so a parser and a reader both find them. Data modelling belongs in the bullets, where it can be shown rather than claimed.",
      },
    ],
    related: [
      "software-engineer",
      "devops-engineer",
      "full-stack-developer",
      "data-analyst",
    ],
    guides: ["resume-bullet-points", "ats-friendly-resume", "resume-format"],
  },

  {
    slug: "full-stack-developer",
    role: "Full Stack Developer",
    aka: ["Full Stack Engineer", "Web Developer", "Generalist Engineer"],
    category: "engineering",
    metaTitle: "Full Stack Developer Resume Example & Guide ({year}) | meniacv",
    description:
      "A full stack developer resume example that shows range without looking shallow, plus the skills, keywords and structure hiring teams expect.",
    updated: "2026-07-29",
    intro:
      "The risk in a full stack resume is not that it looks weak — it's that it looks thin. Claiming both halves of the stack invites the suspicion that you're mediocre at each. The fix is to show one axis of genuine depth and treat breadth as the thing that lets you ship whole features alone.",
    looksFor: [
      "Features owned end to end — schema through interface",
      "One area of real depth, so the breadth reads as range not shallowness",
      "Evidence of shipping independently, which is why full stack roles exist",
      "Product sense: what the feature was for, not just what it was",
      "Comfort with deployment and the boring parts of running software",
    ],
    sample: {
      name: "Alina Kovač",
      title: "Full Stack Developer",
      email: "alina.kovac@email.com",
      phone: "+1 (312) 555-0177",
      location: "Chicago, IL",
      links: [
        { label: "GitHub", url: "github.com/akovac" },
        { label: "Portfolio", url: "alinakovac.dev" },
      ],
      summary:
        "Full stack developer with 5 years shipping features end to end in TypeScript and Node — schema, API, interface and deploy. Strongest on the data layer; built the reporting product that became 30% of a startup's revenue.",
      experience: [
        {
          role: "Full Stack Developer",
          company: "Cadence HR",
          location: "Chicago, IL",
          start: "2022-01",
          bullets: [
            "Shipped the reporting product end to end — Postgres schema, Node API, React interface — now **30% of company revenue** and used by 800 customers",
            "Cut report generation from **90 seconds to 4** with materialised views and a background job queue",
            "Own deploys for 3 services on AWS; introduced preview environments that took review time from **days to hours**",
            "Built the SSO integration (SAML, OIDC) that unblocked **6 enterprise deals**",
          ],
        },
        {
          role: "Web Developer",
          company: "Tinderbox Digital",
          location: "Chicago, IL",
          start: "2019-08",
          end: "2021-12",
          bullets: [
            "Built and maintained 14 client web applications on a three-person team, from database to deploy",
            "Replaced the agency's bespoke CMS with a headless setup, cutting new-project setup from **3 weeks to 4 days**",
            "Took the largest client's checkout conversion up **17%** by rebuilding the flow and fixing mobile performance",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Information Systems",
          school: "University of Illinois Chicago",
          location: "Chicago, IL",
          start: "2015-08",
          end: "2019-05",
        },
      ],
      skills: [
        "TypeScript",
        "Node.js",
        "React",
        "PostgreSQL",
        "Next.js",
        "AWS",
        "Docker",
        "REST APIs",
        "Prisma",
        "CI/CD",
      ],
    },
    template: "classic",
    sections: [
      {
        heading: "Claim depth somewhere, or the breadth reads as shallow",
        body: [
          "\"Full stack\" is a claim about range, and range alone doesn't get hired at any level above junior. Every full stack resume that works has a centre of gravity — the data layer, the API, the interface, the infrastructure — and says so.",
          "One sentence in the summary is enough: \"strongest on the data layer\". It converts the breadth from a hedge into a shape. A reviewer now knows what you'd be trusted with on day one and what you'd grow into, which is exactly the question they were trying to answer.",
        ],
      },
      {
        heading: "The unit of work is the feature, not the layer",
        body: [
          "The reason full stack roles exist is that a single person who can take a feature from schema to shipped interface removes a whole class of coordination cost. So write bullets at that altitude: the feature, its layers, and what it did for the business.",
          "\"Shipped the reporting product end to end — Postgres schema, Node API, React interface — now 30% of company revenue\" makes the argument in one line. Splitting the same work into a frontend bullet and a backend bullet makes you look like two half-engineers.",
        ],
      },
      {
        heading: "Deployment counts, and most candidates omit it",
        body: [
          "In small teams the person who ships the feature also ships it to production. If you have owned deploys, environments, CI pipelines or monitoring, that is a differentiator worth a bullet — it's the difference between a developer who needs a platform team and one who doesn't.",
          "It's also the most common gap in full stack resumes, which makes it cheap signal. Preview environments, a pipeline you built, an incident you handled, a rollback that worked.",
        ],
      },
      {
        heading: "Show product sense in the framing",
        body: [
          "Generalists are usually hired into small teams, where the ability to ask whether a feature is worth building is nearly as valuable as building it. You demonstrate that not with a claim but with framing: say what the work was for.",
          "\"Built the SSO integration that unblocked 6 enterprise deals\" is a technical bullet with a commercial reason in it. That sentence does two jobs, and the second one is the reason a startup founder reads on.",
        ],
      },
      {
        heading: "Keep the stack list honest",
        body: [
          "A full stack resume is where skills lists go to become unbelievable — four languages, three frontend frameworks, two clouds, six databases. It has the opposite of the intended effect, because a reader assumes the whole list is inflated and stops trusting the parts that were true.",
          "Ten to twelve technologies, all of which you'd be happy to be interviewed on, in groups. Anything you last touched in a tutorial three years ago comes off.",
        ],
      },
    ],
    keywords: [
      {
        group: "Frontend",
        terms: [
          "React",
          "TypeScript",
          "Next.js",
          "JavaScript",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
          "Responsive design",
        ],
      },
      {
        group: "Backend",
        terms: [
          "Node.js",
          "Express",
          "Python",
          "Django",
          "REST APIs",
          "GraphQL",
          "Authentication",
          "Authorisation",
        ],
      },
      {
        group: "Data",
        terms: [
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "Prisma",
          "Database design",
          "Query optimisation",
        ],
      },
      {
        group: "Delivery",
        terms: [
          "AWS",
          "Docker",
          "CI/CD",
          "GitHub Actions",
          "Vercel",
          "Testing",
          "Agile",
          "Git",
        ],
      },
    ],
    mistakes: [
      "A skills list so long that no individual claim on it is believed",
      "Splitting one feature into separate frontend and backend bullets, halving its weight",
      "No stated area of depth, leaving a reviewer unsure what you'd own",
      "Listing frameworks used once in a tutorial alongside ones you've shipped",
      "Ignoring deployment and operations, the strongest generalist signal there is",
      "Describing agency work client by client instead of by what you built",
    ],
    faqs: [
      {
        question: "Is \"full stack\" a weaker claim than specialising?",
        answer:
          "Not in small companies, where it's exactly what's wanted. It's weaker at large ones, which hire into specialised teams and read undifferentiated breadth as inexperience. If you're targeting both, name a specialism in the summary and let the breadth show through the bullets.",
      },
      {
        question: "How many technologies should I list?",
        answer:
          "Ten to twelve, grouped, all defensible in an interview. Full stack resumes fail more often from over-claiming than from under-claiming, because a reader who spots one inflated entry discounts the whole list.",
      },
      {
        question: "Should I tailor towards frontend or backend for each application?",
        answer:
          "Yes, and it's mostly a matter of order rather than rewriting. Lead the summary with the half the posting emphasises, reorder your skills groups to match, and promote the bullets on that side. The facts don't change; the emphasis does.",
      },
      {
        question: "Do agency and freelance projects count as real experience?",
        answer:
          "Fully, and they often show more range than in-house work. Write them as one role with the agency or as \"Freelance Developer\", then use bullets for what you built across clients — not one bullet per client, which fragments the impact.",
      },
    ],
    related: [
      "software-engineer",
      "frontend-developer",
      "backend-developer",
      "mobile-developer",
    ],
    guides: ["how-to-write-a-resume", "resume-bullet-points", "ats-friendly-resume"],
  },

  {
    slug: "data-scientist",
    role: "Data Scientist",
    aka: ["Machine Learning Scientist", "Applied Scientist", "Research Scientist"],
    category: "engineering",
    metaTitle: "Data Scientist Resume Example & Guide ({year}) | meniacv",
    description:
      "A data scientist resume example that connects models to business outcomes, with the skills, keywords and structure hiring managers screen for.",
    updated: "2026-07-29",
    intro:
      "Most data science resumes read like a coursework transcript: methods, libraries, and a Kaggle rank. The ones that get interviews read like a business case — a decision that changed, a metric that moved, and a model that made it into production rather than into a notebook.",
    looksFor: [
      "Models that shipped and are still running, not just trained",
      "A business metric attached to the modelling work",
      "Experiment design — A/B tests, causal inference, statistical rigour",
      "Enough engineering to deploy and monitor what you build",
      "Communication with non-technical stakeholders, evidenced",
    ],
    sample: {
      name: "Wei Chen",
      title: "Senior Data Scientist",
      email: "wei.chen@email.com",
      phone: "+1 (415) 555-0192",
      location: "San Francisco, CA",
      links: [
        { label: "GitHub", url: "github.com/weichen-ds" },
        { label: "LinkedIn", url: "linkedin.com/in/weichends" },
      ],
      summary:
        "Data scientist with 6 years turning models into shipped product decisions. Built the churn model that cut voluntary churn 18% and the pricing experiment framework now used across three business lines. Python, causal inference, and enough engineering to deploy my own work.",
      experience: [
        {
          role: "Senior Data Scientist",
          company: "Vantage Subscriptions",
          location: "San Francisco, CA",
          start: "2022-06",
          bullets: [
            "Built and deployed the churn propensity model that drove a retention campaign cutting voluntary churn **18%** — worth **$6.2M ARR**",
            "Designed the experimentation framework (sequential testing, CUPED) now used for **all pricing tests** across 3 business lines",
            "Replaced a rules-based fraud filter with a gradient-boosted model, cutting false positives **41%** at equal recall",
            "Ran the quarterly readout to the exec team; two roadmap changes came directly from the analysis",
          ],
        },
        {
          role: "Data Scientist",
          company: "Meridian Health",
          location: "Oakland, CA",
          start: "2019-09",
          end: "2022-05",
          bullets: [
            "Built the no-show prediction model for **340k annual appointments**, enabling overbooking that recovered **$1.8M** in clinic capacity",
            "Led the causal analysis that ended a **$400k/year** outreach programme shown to have no measurable effect",
            "Productionised three models on Airflow and MLflow, taking retraining from manual to weekly and automated",
          ],
        },
        {
          role: "Data Analyst",
          company: "Meridian Health",
          location: "Oakland, CA",
          start: "2018-07",
          end: "2019-08",
          bullets: [
            "Built the operations dashboard used daily by 12 clinic managers, replacing a weekly manual spreadsheet",
            "Automated the regulatory reporting pipeline, removing **20 hours/month** of manual work",
          ],
        },
      ],
      education: [
        {
          degree: "MS, Statistics",
          school: "University of California, Berkeley",
          location: "Berkeley, CA",
          start: "2016-08",
          end: "2018-05",
        },
        {
          degree: "BS, Mathematics",
          school: "University of Michigan",
          location: "Ann Arbor, MI",
          start: "2012-09",
          end: "2016-05",
        },
      ],
      skills: [
        "Python",
        "SQL",
        "Causal inference",
        "A/B testing",
        "scikit-learn",
        "PyTorch",
        "Airflow",
        "MLflow",
        "dbt",
        "Snowflake",
      ],
    },
    template: "oxford",
    sections: [
      {
        heading: "A model with no decision attached is a hobby",
        body: [
          "The single biggest upgrade available to a data science resume is connecting each piece of modelling work to something that happened as a result. Not the AUC — the decision. Who did something differently because of your model, and what did that produce?",
          "\"Built a churn model with 0.86 AUC\" and \"built the churn model that drove a campaign cutting voluntary churn 18%, worth $6.2M ARR\" describe the same project. Only the second one tells a hiring manager that you understand what you're for. Keep the model metric if it's genuinely impressive, but never let it be the only number in the bullet.",
        ],
      },
      {
        heading: "Say what reached production",
        body: [
          "The industry's open secret is how many models never ship. So \"deployed\", \"in production\", \"retrained weekly\", and \"still running\" are among the highest-value words on a data science resume — they separate you from candidates whose best work lives in a notebook on a laptop.",
          "Name the machinery where you can: Airflow, MLflow, a feature store, a batch job, an endpoint. It signals you can work with engineers rather than handing them a pickle file and hoping.",
        ],
      },
      {
        heading: "Experiment design is the most under-sold skill",
        body: [
          "Plenty of applicants can fit a model. Far fewer can design a trustworthy experiment, spot the sample-ratio mismatch, choose the right unit of randomisation, or explain why an observational result isn't causal. If you can, that belongs high on the page in specific language.",
          "The negative results are the most persuasive of all, and almost nobody includes them. \"Led the causal analysis that ended a $400k/year programme shown to have no measurable effect\" is a bullet only an honest, rigorous analyst can write, and any good hiring manager knows it.",
        ],
        list: [
          "A/B testing at scale, and the framework you built or improved",
          "Causal inference methods you've actually applied — diff-in-diff, IV, matching",
          "A decision that was reversed or stopped because of your analysis",
          "Statistical rigour: power analysis, multiple comparisons, variance reduction",
        ],
      },
      {
        heading: "Cut the Kaggle rank and the course list",
        body: [
          "Competition placings and MOOC certificates are how a resume signals that professional experience is thin. Once you have a real job doing this work, they compete with it for space and lose.",
          "The exception is a genuinely elite result — a top-ten finish in a large competition is a credential. Everything else, including the eleven Coursera certificates, comes off in favour of one more line about what shipped.",
        ],
      },
      {
        heading: "Communication, shown rather than claimed",
        body: [
          "Every data science posting asks for stakeholder communication, and every resume claims it in the same dead phrase. Replace the claim with an artefact: the readout you run, the dashboard executives actually use, the recommendation that changed a roadmap.",
          "\"Ran the quarterly readout to the exec team; two roadmap changes came directly from the analysis\" is evidence. \"Excellent communication skills\" is filler that a reviewer's eye slides over.",
        ],
      },
    ],
    keywords: [
      {
        group: "Languages & querying",
        terms: ["Python", "SQL", "R", "pandas", "NumPy", "Spark", "dbt"],
      },
      {
        group: "Modelling",
        terms: [
          "scikit-learn",
          "XGBoost",
          "PyTorch",
          "TensorFlow",
          "Time series forecasting",
          "NLP",
          "Clustering",
          "Feature engineering",
        ],
      },
      {
        group: "Statistics & experimentation",
        terms: [
          "A/B testing",
          "Causal inference",
          "Hypothesis testing",
          "Regression analysis",
          "Bayesian methods",
          "Power analysis",
          "Experimental design",
        ],
      },
      {
        group: "Platform",
        terms: [
          "Airflow",
          "MLflow",
          "Snowflake",
          "BigQuery",
          "Databricks",
          "AWS SageMaker",
          "Docker",
          "Git",
          "Tableau",
        ],
      },
    ],
    mistakes: [
      "Reporting model metrics with no business outcome anywhere in the bullet",
      "A long list of algorithms studied rather than problems solved",
      "Kaggle ranks and MOOC certificates crowding out professional work",
      "No indication of whether anything you built ever shipped",
      "Claiming stakeholder communication with no artefact to point at",
      "A publications list on an industry application, where it reads as a mismatch",
    ],
    faqs: [
      {
        question: "Should I include Kaggle competitions on my resume?",
        answer:
          "Only a strong placing in a large competition, and only while your professional experience is thin. Once you have shipped models at work, competition results are the weakest thing on the page and should give up their space.",
      },
      {
        question: "How technical should the bullets be?",
        answer:
          "Technical enough to be credible to a practitioner, framed so a hiring manager understands the consequence. Name the method in a few words and spend the rest of the sentence on what changed. Assume the first reader is not a data scientist and the second one is.",
      },
      {
        question: "Do I need a PhD on the resume to be competitive?",
        answer:
          "For most applied roles, no — shipped work outranks credentials. Research scientist positions at large labs are the exception, and there the publication record matters. If you have a PhD, put the degree in education and keep publications to a short line unless the role is genuinely research-focused.",
      },
      {
        question: "What's the difference between a data scientist and a data analyst resume?",
        answer:
          "Analyst resumes are built on decisions informed and reporting owned; scientist resumes are built on models deployed and experiments designed. The overlap is large, so read the posting and lead with whichever it actually describes rather than with the more senior-sounding title.",
      },
    ],
    related: [
      "data-analyst",
      "machine-learning-engineer",
      "software-engineer",
      "product-manager",
    ],
    guides: ["resume-bullet-points", "resume-summary-examples", "ats-friendly-resume"],
  },

  {
    slug: "data-analyst",
    role: "Data Analyst",
    aka: ["Business Intelligence Analyst", "BI Analyst", "Reporting Analyst"],
    category: "engineering",
    metaTitle: "Data Analyst Resume Example & Guide ({year}) | meniacv",
    description:
      "A data analyst resume example built on decisions influenced rather than tools listed, with SQL, dashboards and the ATS keywords hiring teams look for.",
    updated: "2026-07-29",
    intro:
      "A data analyst resume is easy to write badly, because the work is easy to describe as a tool list: SQL, Tableau, Excel, Python. Everyone writes that. What gets you shortlisted is the sentence that names a decision somebody made because of your analysis.",
    looksFor: [
      "SQL confirmed by the complexity of what you built with it",
      "Decisions or dollars attached to the analysis",
      "Dashboards that are used, with a number of users or a process replaced",
      "Automation — manual work removed is the classic analyst win",
      "Domain fluency in the business you're analysing",
    ],
    sample: {
      name: "Grace Adeyemi",
      title: "Data Analyst",
      email: "grace.adeyemi@email.com",
      phone: "+1 (646) 555-0163",
      location: "New York, NY",
      links: [
        { label: "LinkedIn", url: "linkedin.com/in/graceadeyemi" },
        { label: "Portfolio", url: "graceadeyemi.com" },
      ],
      summary:
        "Data analyst with 4 years in retail and e-commerce, working in SQL, dbt and Looker. I turn reporting into decisions: my markdown analysis changed the buying strategy for a $40M category and recovered $2.1M in margin.",
      experience: [
        {
          role: "Data Analyst",
          company: "Harlow & Finch",
          location: "New York, NY",
          start: "2022-08",
          bullets: [
            "Ran the markdown and pricing analysis that reshaped buying for a **$40M category**, recovering **$2.1M in gross margin** in one season",
            "Rebuilt the merchandising reporting layer in dbt — **60+ models** — replacing 14 conflicting spreadsheets with one source of truth",
            "Built the daily trading dashboard now used by **35 buyers and planners**, retiring a 6-hour manual reporting cycle",
            "Automated weekly supplier scorecards in Python, removing **24 hours/month** of analyst time",
          ],
        },
        {
          role: "Junior Data Analyst",
          company: "Brightline Retail",
          location: "Newark, NJ",
          start: "2021-02",
          end: "2022-07",
          bullets: [
            "Owned the weekly sales reporting pack for 90 stores, and cut its production time from **2 days to 3 hours**",
            "Found and fixed a returns-attribution error that had overstated category profitability by **8%**",
            "Trained 20 store managers on the self-service reports, cutting ad-hoc data requests by **half**",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Economics",
          school: "Rutgers University",
          location: "New Brunswick, NJ",
          start: "2016-09",
          end: "2020-05",
        },
      ],
      skills: [
        "SQL",
        "dbt",
        "Looker",
        "Python (pandas)",
        "Tableau",
        "Excel (advanced)",
        "Snowflake",
        "Data modelling",
        "A/B testing",
        "Stakeholder reporting",
      ],
      certifications: [
        {
          name: "Google Data Analytics Professional Certificate",
          issuer: "Google",
          date: "2021-01",
        },
      ],
    },
    template: "modern",
    sections: [
      {
        heading: "Name the decision, not the dashboard",
        body: [
          "Analysts are hired to change what a business does. A resume that lists reports built describes the activity; a resume that names a decision describes the value. \"Ran the markdown analysis that reshaped buying for a $40M category, recovering $2.1M in margin\" is the shape to aim for.",
          "You will not have a dollar figure for everything, and you shouldn't invent one. Where the money isn't attributable, use the decision itself: a strategy that changed, a programme that stopped, a process that was retired, a forecast that got adopted.",
        ],
      },
      {
        heading: "Prove the SQL with the shape of the work",
        body: [
          "Everyone writes SQL on a data analyst resume, so the word carries almost no information. What carries information is what you built with it: a 60-model dbt project, a semantic layer, a cohort analysis across four systems, a reconciliation that found an error nobody else had.",
          "The same applies to Excel. \"Advanced Excel\" is unverifiable; \"rebuilt the planning model 40 people use\" is not. Let the artefact establish the skill level and use the skills section only for parsing.",
        ],
      },
      {
        heading: "Automation is the analyst's most reliable metric",
        body: [
          "Almost every analyst has removed manual work, and almost none of them put a number on it. Hours per month recovered, a reporting cycle shortened, a spreadsheet retired, ad-hoc requests halved — these are easy to quantify honestly and they read as maturity, because they show you improved the system rather than just serving it.",
          "This is also the bullet that travels best across industries, which matters if you're changing sector.",
        ],
        list: [
          "Hours of manual work removed per week or month",
          "Reporting cycle time, before and after",
          "Number of people using what you built",
          "Requests reduced by self-service reporting",
          "An error you found, and what it had been costing",
        ],
      },
      {
        heading: "Finding the error is a real achievement",
        body: [
          "Data quality work feels unglamorous and is enormously valuable, because a business making decisions on wrong numbers is worse off than one with no numbers. If you have found a material error — a misattributed return, a double-counted channel, a broken join in a report everyone trusted — that belongs on the page.",
          "Write it with the consequence: \"found and fixed a returns-attribution error that had overstated category profitability by 8%\". It demonstrates rigour, scepticism and ownership in one line.",
        ],
      },
      {
        heading: "Show the domain, not just the tooling",
        body: [
          "Analyst roles are unusually domain-bound. A retail analyst is expected to know what markdown, sell-through and open-to-buy mean; a fintech analyst is expected to know cohort retention and unit economics. Using the language of the sector correctly is a strong signal, and it's invisible in a tool list.",
          "If you're moving between industries, keep the domain vocabulary of your target where it's genuinely transferable, and lead with the methods and automation wins that don't depend on sector at all.",
        ],
      },
    ],
    keywords: [
      {
        group: "Core",
        terms: [
          "SQL",
          "Excel",
          "Python",
          "pandas",
          "R",
          "Data modelling",
          "ETL",
          "dbt",
        ],
      },
      {
        group: "Visualisation",
        terms: [
          "Tableau",
          "Power BI",
          "Looker",
          "Google Data Studio",
          "Dashboard design",
          "Data storytelling",
        ],
      },
      {
        group: "Warehousing",
        terms: [
          "Snowflake",
          "BigQuery",
          "Redshift",
          "PostgreSQL",
          "Data warehousing",
        ],
      },
      {
        group: "Analysis",
        terms: [
          "A/B testing",
          "Cohort analysis",
          "Forecasting",
          "KPI definition",
          "Segmentation",
          "Statistical analysis",
          "Stakeholder management",
        ],
      },
    ],
    mistakes: [
      "A tool list where the achievements should be",
      "\"Created dashboards and reports\" with no user, decision or number attached",
      "Claiming advanced Excel or SQL without anything on the page that requires it",
      "Leaving out automation wins, which are the easiest honest metrics you have",
      "Reporting on data volumes instead of on what the analysis changed",
      "Certificates listed above professional experience once you have any",
    ],
    faqs: [
      {
        question: "How do I quantify analyst work when I don't own the revenue?",
        answer:
          "Use the decision and the process instead of claiming the revenue. \"Analysis that changed the buying strategy for a $40M category\" is honest about your role while making the stakes clear, and time removed from a reporting cycle is yours outright.",
      },
      {
        question: "Is a portfolio useful for a data analyst?",
        answer:
          "Yes, especially early on. Two or three write-ups — a question, the data, the analysis, the recommendation — demonstrate reasoning that a resume bullet can only assert. A gallery of charts with no conclusions does not.",
      },
      {
        question: "Should I list a data analytics certificate?",
        answer:
          "Include it while you're breaking in; it shows deliberate preparation. Once you have a year or two of professional analysis, move it to a single line at the bottom and give the space to what you delivered.",
      },
      {
        question: "Tableau or Power BI — does it matter which I know?",
        answer:
          "Match the posting where you honestly can, and don't pad with the other. Teams know the concepts transfer, so a strong analyst on Power BI is not screened out of a Tableau shop; being caught claiming both when you've only used one is a worse outcome than the mismatch.",
      },
    ],
    related: [
      "data-scientist",
      "business-analyst",
      "financial-analyst",
      "product-manager",
    ],
    guides: ["resume-bullet-points", "ats-friendly-resume", "career-change-resume"],
  },
];
