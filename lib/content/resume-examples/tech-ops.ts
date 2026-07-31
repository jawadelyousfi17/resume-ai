// Infrastructure, quality, mobile, ML and security examples.

import type { ResumeExample } from "./types";

export const TECH_OPS_EXAMPLES: ResumeExample[] = [
  {
    slug: "devops-engineer",
    role: "DevOps Engineer",
    aka: ["Site Reliability Engineer", "Platform Engineer", "Cloud Engineer"],
    category: "engineering",
    metaTitle: "DevOps Engineer Resume Example & Guide ({year}) | meniacv",
    description:
      "A DevOps and SRE resume example built on reliability, deploy frequency and cost, with the cloud keywords and certifications hiring teams screen for.",
    updated: "2026-07-29",
    intro:
      "DevOps resumes fail in a specific way: they become an inventory of tools. Kubernetes, Terraform, Jenkins, Prometheus, twelve AWS services. The tools are necessary and they prove nothing, because the job is not tool operation — it's making deploys fast, systems reliable, and infrastructure affordable.",
    looksFor: [
      "Deployment frequency and lead time — the DORA metrics, ideally",
      "Availability and incident numbers you were accountable for",
      "Infrastructure as code, with the estate size it manages",
      "Cost reduction, stated in currency per month",
      "Developer experience: what you made easier for other engineers",
    ],
    sample: {
      name: "Marcus Bell",
      title: "Senior DevOps Engineer",
      email: "marcus.bell@email.com",
      phone: "+1 (512) 555-0129",
      location: "Austin, TX",
      links: [
        { label: "GitHub", url: "github.com/marcusbell" },
        { label: "LinkedIn", url: "linkedin.com/in/marcusbell" },
      ],
      summary:
        "DevOps engineer with 8 years running production infrastructure on AWS and Kubernetes. Took a 40-service platform from weekly releases to 30 deploys a day, and cut cloud spend by $47k a month without touching headcount.",
      experience: [
        {
          role: "Senior DevOps Engineer",
          company: "Foldera",
          location: "Austin, TX",
          start: "2021-11",
          bullets: [
            "Rebuilt CI/CD for **40 services**, taking release cadence from weekly to **30 deploys/day** and lead time from **6 days to 45 minutes**",
            "Cut AWS spend **$47k/month (31%)** through rightsizing, spot instances and deleting orphaned resources",
            "Codified the entire estate in Terraform — **900+ resources**, previously half hand-built — and added drift detection",
            "Reduced MTTR from **90 minutes to 18** by rebuilding alerting around SLOs and killing 60% of noisy alerts",
            "Ran the migration from EC2 to EKS with **no unplanned downtime** across a 9-month programme",
          ],
        },
        {
          role: "DevOps Engineer",
          company: "Sunridge Software",
          location: "Austin, TX",
          start: "2018-04",
          end: "2021-10",
          bullets: [
            "Built the platform's first Kubernetes clusters and the Helm chart library that standardised deploys for 6 teams",
            "Introduced blue-green deploys, cutting failed releases from **1 in 5 to under 1 in 40**",
            "Automated environment provisioning, taking new environment setup from **3 days to 20 minutes**",
          ],
        },
        {
          role: "Systems Administrator",
          company: "Lone Star Hosting",
          location: "Austin, TX",
          start: "2016-06",
          end: "2018-03",
          bullets: [
            "Managed 300 Linux servers and the on-call rotation for a hosting estate with 4,000 customers",
            "Automated patching with Ansible, removing **30 hours/month** of manual work",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Information Technology",
          school: "Texas State University",
          location: "San Marcos, TX",
          start: "2012-08",
          end: "2016-05",
        },
      ],
      skills: [
        "Kubernetes",
        "Terraform",
        "AWS",
        "Linux",
        "CI/CD",
        "Prometheus",
        "Grafana",
        "Ansible",
        "Python",
        "Go",
      ],
      certifications: [
        {
          name: "Certified Kubernetes Administrator (CKA)",
          issuer: "The Linux Foundation",
          date: "2021-03",
        },
        {
          name: "AWS Certified Solutions Architect – Professional",
          issuer: "Amazon Web Services",
          date: "2022-08",
        },
      ],
    },
    template: "chronicle",
    sections: [
      {
        heading: "The four numbers that make a DevOps resume",
        body: [
          "Deployment frequency, lead time for change, change failure rate, and mean time to recovery. These are the metrics the discipline organised itself around, and a resume carrying two or three of them with real before-and-after values is immediately more credible than one carrying twenty tool names.",
          "\"Took release cadence from weekly to 30 deploys a day and lead time from 6 days to 45 minutes\" tells a reader what kind of engineer you are, what state you found things in, and what you're capable of changing. No tool list does that.",
        ],
        list: [
          "Deployment frequency, before and after",
          "Lead time from commit to production",
          "Change failure rate, or failed releases per hundred",
          "MTTR, and the alerting work behind the improvement",
          "Availability against the SLO you were accountable for",
        ],
      },
      {
        heading: "Cost is a first-class outcome",
        body: [
          "Cloud spend is one of the largest controllable line items in a modern engineering budget, and an engineer who has cut it materially is making an argument in a language finance understands. State it in currency per month with the percentage beside it: \"$47k/month (31%)\".",
          "Say how, briefly, because the how is what proves it was engineering rather than a spreadsheet exercise — rightsizing, spot capacity, storage tiering, deleting what nobody owned. A cost number with no mechanism reads as someone else's saving.",
        ],
      },
      {
        heading: "Infrastructure as code, with the estate size",
        body: [
          "\"Experience with Terraform\" is the weakest possible version of a strong claim. The strong version has scale and a starting condition in it: 900 resources codified, half of which were previously hand-built, with drift detection added.",
          "That sentence tells a hiring manager you've done the unglamorous part — importing existing infrastructure into code, which is where the real difficulty lives — rather than only writing greenfield modules.",
        ],
      },
      {
        heading: "Developer experience is the modern platform pitch",
        body: [
          "Platform teams increasingly justify themselves by what they remove from other engineers' days. Environment provisioning that used to take three days and now takes twenty minutes; a Helm library that standardised deploys across six teams; a pipeline nobody has to think about.",
          "This framing also travels well into platform engineering roles, which are largely DevOps roles with an internal-product mindset attached. If you have built anything self-service, say who uses it and what it replaced.",
        ],
      },
      {
        heading: "Certifications actually count here",
        body: [
          "Infrastructure is one of the few areas where certifications carry real screening weight — CKA, the AWS professional tiers, Terraform Associate. Recruiters filter on them and enterprise clients sometimes require them, so list them with the issuer and the year.",
          "They are still not a substitute for the metrics. A CKA with no reliability numbers on the page reads as someone who has studied Kubernetes rather than run it in anger.",
        ],
      },
    ],
    keywords: [
      {
        group: "Cloud",
        terms: [
          "AWS",
          "Azure",
          "GCP",
          "EKS",
          "EC2",
          "S3",
          "IAM",
          "VPC",
          "Cloud migration",
        ],
      },
      {
        group: "Orchestration & IaC",
        terms: [
          "Kubernetes",
          "Docker",
          "Terraform",
          "Helm",
          "Ansible",
          "Infrastructure as code",
          "GitOps",
          "ArgoCD",
        ],
      },
      {
        group: "Pipelines",
        terms: [
          "CI/CD",
          "Jenkins",
          "GitHub Actions",
          "GitLab CI",
          "Blue-green deployment",
          "Canary release",
          "Automated testing",
        ],
      },
      {
        group: "Reliability",
        terms: [
          "Prometheus",
          "Grafana",
          "Datadog",
          "Observability",
          "SLOs",
          "Incident response",
          "On-call",
          "Disaster recovery",
          "Linux administration",
          "Bash",
          "Python",
        ],
      },
    ],
    mistakes: [
      "A tool inventory with no reliability or velocity numbers anywhere",
      "Listing twenty AWS services rather than the platform you built on them",
      "\"Improved deployment process\" with no cadence figure attached",
      "No mention of on-call or incidents, which is the core of the job",
      "Cost savings claimed without the mechanism that produced them",
      "Certifications at the top of the page above eight years of operational work",
    ],
    faqs: [
      {
        question: "Is DevOps engineer the same as SRE on a resume?",
        answer:
          "They overlap heavily and the same resume can serve both, but the emphasis differs. SRE postings weight reliability engineering — SLOs, error budgets, incident analysis — while DevOps postings weight delivery pipelines and automation. Use the posting's own title and reorder your bullets to lead with whichever it cares about.",
      },
      {
        question: "Do I need certifications for a DevOps role?",
        answer:
          "They help more here than in most engineering fields, because recruiters genuinely screen on CKA and the AWS professional certifications. They don't replace evidence of running production systems, so treat them as a supporting line rather than the headline.",
      },
      {
        question: "How do I show DevOps work when I can't name the client?",
        answer:
          "Describe the estate instead of the customer: number of services, servers, regions, or the traffic they carried. \"A 40-service platform on AWS serving 12M monthly users\" is fully anonymous and far more informative than a company name would be.",
      },
      {
        question: "Should I include scripting languages?",
        answer:
          "Yes — Python, Bash and Go are core to the role, and postings list them. Put them in skills, and make sure at least one bullet shows automation you wrote rather than tools you configured.",
      },
    ],
    related: [
      "backend-developer",
      "software-engineer",
      "cybersecurity-analyst",
      "it-support-specialist",
    ],
    guides: ["ats-friendly-resume", "resume-bullet-points", "resume-format"],
  },

  {
    slug: "qa-engineer",
    role: "QA Engineer",
    aka: ["Software Tester", "QA Automation Engineer", "SDET"],
    category: "engineering",
    metaTitle: "QA Engineer Resume Example & Guide ({year}) | meniacv",
    description:
      "A QA engineer resume example that shows automation coverage, escaped defects and release confidence, plus the testing keywords ATS filters look for.",
    updated: "2026-07-29",
    intro:
      "Quality engineering has split into two jobs with one title: the manual tester who finds what automation can't, and the engineer who writes the automation. A resume that's vague about which one you are gets screened out of both. Be specific, and prove it with the numbers quality work generates naturally.",
    looksFor: [
      "Automation you wrote, in a named framework, with coverage figures",
      "Escaped defects — bugs that reached production, and the trend",
      "Release confidence: how testing changed the shipping cadence",
      "CI integration, because tests nobody runs don't count",
      "Judgement about what not to automate",
    ],
    sample: {
      name: "Nadia Haddad",
      title: "QA Automation Engineer",
      email: "nadia.haddad@email.com",
      phone: "+1 (703) 555-0158",
      location: "Arlington, VA",
      links: [
        { label: "GitHub", url: "github.com/nhaddad" },
        { label: "LinkedIn", url: "linkedin.com/in/nadiahaddad" },
      ],
      summary:
        "QA automation engineer with 6 years building test suites that teams actually trust. Took regression testing from a 4-day manual cycle to a 25-minute pipeline, and cut production defects by 62% in a year.",
      experience: [
        {
          role: "QA Automation Engineer",
          company: "Civica Health Systems",
          location: "Arlington, VA",
          start: "2022-02",
          bullets: [
            "Built the Playwright and pytest suite covering **420 scenarios**, replacing a **4-day manual regression cycle** with a 25-minute pipeline run",
            "Cut escaped production defects **62%** year over year while release frequency doubled",
            "Eliminated flakiness from **18% to under 1%** by rebuilding test data setup and removing implicit waits",
            "Introduced contract testing between 7 services, catching **31 breaking changes** before they merged",
            "Own accessibility and regulatory test coverage for a HIPAA-regulated product",
          ],
        },
        {
          role: "QA Engineer",
          company: "Blue Harbor Software",
          location: "Remote",
          start: "2019-05",
          end: "2022-01",
          bullets: [
            "Wrote the company's first automated API test suite, taking release regression from **2 days to 90 minutes**",
            "Led manual exploratory testing for 9 major releases, finding the **3 highest-severity defects** of the year",
            "Built the bug triage process that cut duplicate reports **45%** and gave engineers reproducible steps",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Computer Science",
          school: "George Mason University",
          location: "Fairfax, VA",
          start: "2015-08",
          end: "2019-05",
        },
      ],
      skills: [
        "Playwright",
        "Selenium",
        "pytest",
        "Python",
        "TypeScript",
        "API testing (Postman)",
        "CI/CD",
        "Performance testing (k6)",
        "Test strategy",
        "Accessibility testing",
      ],
      certifications: [
        {
          name: "ISTQB Certified Tester, Advanced Level",
          issuer: "ISTQB",
          date: "2021-06",
        },
      ],
    },
    template: "berlin",
    sections: [
      {
        heading: "Decide which QA engineer you are, on the page",
        body: [
          "\"QA Engineer\" now covers manual testers, automation engineers and SDETs who write production code. A resume that hedges across all three reads as junior in each. Name it in the title line and in the summary — automation-first, exploratory specialist, or genuinely both with an order of strength.",
          "If you do both, say which is primary and let the other appear as a strength rather than a claim of equal depth. \"Automation-first, with exploratory testing on high-risk releases\" is a clear, honest position.",
        ],
      },
      {
        heading: "Escaped defects is the metric that matters",
        body: [
          "Test counts are an activity measure; escaped defects are an outcome measure. How many bugs reached production, and what happened to that number while you were responsible for quality? That is the closest thing QA has to a revenue figure.",
          "Pair it with cadence, because the impressive version is both together. Fewer defects while shipping more often means the testing got better rather than the team getting slower — which is precisely the objection a hiring manager has about investing in QA.",
        ],
        list: [
          "Escaped or production defects, and the trend",
          "Regression cycle time, before and after automation",
          "Suite size in scenarios, and what it replaced",
          "Flake rate, which every engineering manager cares about",
          "Release frequency the testing enabled",
        ],
      },
      {
        heading: "Flakiness is the credibility test",
        body: [
          "Any tester can add automated tests. The engineer who takes a suite from 18% flaky to under 1% has done the hard, unglamorous work of fixing test data, timing and isolation — and has produced a suite people trust enough to block a release on.",
          "This single bullet distinguishes someone who has maintained automation at scale from someone who has only written it. Very few QA resumes include it, which makes it exceptionally cheap signal.",
        ],
      },
      {
        heading: "Tests that don't run in CI don't count",
        body: [
          "A suite on a laptop is a hobby. Say where the tests run, when they run, and what they block — pull request checks, nightly runs, pre-release gates. Naming the pipeline shows you understand testing as part of the delivery system rather than as a phase after it.",
          "This is also where the SDET boundary sits. If you have written CI configuration, built test infrastructure, or made someone else's tests faster, that is engineering work and should be described as such.",
        ],
      },
      {
        heading: "Show judgement about what not to automate",
        body: [
          "Mature quality engineering is largely about allocation: what gets automated, what gets explored by hand, what gets caught by monitoring instead. A resume that shows this thinking reads as senior, because it's the part juniors get wrong by trying to automate everything.",
          "One line on risk-based test strategy, or on the exploratory pass you keep for high-risk releases, communicates it without an essay. Then let the exploratory find speak for the value: \"found the 3 highest-severity defects of the year\".",
        ],
      },
    ],
    keywords: [
      {
        group: "Automation",
        terms: [
          "Playwright",
          "Selenium",
          "Cypress",
          "pytest",
          "JUnit",
          "TestNG",
          "Appium",
          "Test automation framework",
        ],
      },
      {
        group: "Types of testing",
        terms: [
          "Regression testing",
          "API testing",
          "Integration testing",
          "End-to-end testing",
          "Performance testing",
          "Load testing",
          "Accessibility testing",
          "Exploratory testing",
          "Smoke testing",
        ],
      },
      {
        group: "Tooling",
        terms: [
          "Postman",
          "JMeter",
          "k6",
          "Jira",
          "TestRail",
          "Git",
          "CI/CD",
          "Jenkins",
          "GitHub Actions",
        ],
      },
      {
        group: "Practice",
        terms: [
          "Test strategy",
          "Test plans",
          "Defect triage",
          "Risk-based testing",
          "Agile",
          "Scrum",
          "SDLC",
          "ISTQB",
          "Shift-left testing",
        ],
      },
    ],
    mistakes: [
      "Counting test cases written instead of defects prevented",
      "\"Manual and automated testing\" with no indication which you're strong at",
      "No mention of where the tests run, or whether they gate anything",
      "Listing every tool in the Jira ecosystem as a skill",
      "Omitting flakiness and maintenance, the parts that prove real experience",
      "Describing yourself as a gatekeeper rather than as part of delivery",
    ],
    faqs: [
      {
        question: "Is manual testing still worth putting on a resume?",
        answer:
          "Yes, but framed as exploratory testing and risk judgement rather than as executing test scripts. Script execution is the part automation took; finding the defects automation can't specify is skilled work and worth saying clearly.",
      },
      {
        question: "Do I need to code to get a QA job now?",
        answer:
          "For most QA engineer postings, yes — at least enough to write and maintain automation in one language. Purely manual roles still exist in regulated and hardware-adjacent domains, but they are a shrinking share and usually pay less.",
      },
      {
        question: "Should I list the ISTQB certification?",
        answer:
          "Include it; recruiters in enterprise and regulated environments do screen for it, and it costs one line. It carries less weight than a suite you built and the defect trend that followed, so keep it below the experience section.",
      },
      {
        question: "How do I move from QA into development?",
        answer:
          "Lead with the code you've written — frameworks, CI tooling, test infrastructure — and describe it as engineering rather than testing. SDET and platform-adjacent roles are the usual bridge, because they're the ones where your existing work is already the job.",
      },
    ],
    related: [
      "software-engineer",
      "devops-engineer",
      "backend-developer",
      "mobile-developer",
    ],
    guides: ["resume-bullet-points", "career-change-resume", "ats-friendly-resume"],
  },

  {
    slug: "mobile-developer",
    role: "Mobile Developer",
    aka: ["iOS Developer", "Android Developer", "React Native Developer"],
    category: "engineering",
    metaTitle: "Mobile Developer Resume Example & Guide ({year}) | meniacv",
    description:
      "An iOS and Android developer resume example with App Store evidence, crash-rate metrics and the mobile keywords hiring teams screen for.",
    updated: "2026-07-29",
    intro:
      "Mobile developers have something almost no other engineer has: shipped work anyone can download. A resume that doesn't point at it is wasting its strongest asset. The second advantage is that mobile generates unusually clean metrics — crash-free rates, store ratings, app size, install counts — and most candidates mention none of them.",
    looksFor: [
      "Apps in the store, named and linked, with install scale",
      "Crash-free session rate and how you moved it",
      "Native platform depth — Swift or Kotlin — stated without hedging",
      "Release process ownership: store submissions, phased rollouts, review rejections",
      "Performance work: startup time, app size, battery, offline behaviour",
    ],
    sample: {
      name: "Kenji Watanabe",
      title: "Senior iOS Developer",
      email: "kenji.watanabe@email.com",
      phone: "+1 (206) 555-0184",
      location: "Seattle, WA",
      links: [
        { label: "App Store", url: "apps.apple.com/dev/kwatanabe" },
        { label: "GitHub", url: "github.com/kwatanabe" },
      ],
      summary:
        "iOS developer with 7 years and four apps in the App Store, two above a million installs. Swift and SwiftUI, with a bias toward performance: took cold start from 3.2s to 1.1s and crash-free sessions to 99.94%.",
      experience: [
        {
          role: "Senior iOS Developer",
          company: "Trailhead Fitness",
          location: "Seattle, WA",
          start: "2021-08",
          bullets: [
            "Own the iOS app — **1.8M installs**, 4.7 stars — and took crash-free sessions from **99.1% to 99.94%**",
            "Cut cold start from **3.2s to 1.1s** by deferring non-critical initialisation and replacing the image pipeline",
            "Led the UIKit to SwiftUI migration across 60 screens, shipped incrementally with **no rating drop**",
            "Built the offline workout sync that resolved the top App Store complaint; **1-star reviews fell 38%**",
            "Own release management: phased rollouts, TestFlight beta of 4,000 users, and store submissions",
          ],
        },
        {
          role: "iOS Developer",
          company: "Ferry Labs",
          location: "Seattle, WA",
          start: "2018-09",
          end: "2021-07",
          bullets: [
            "Shipped two apps from empty project to launch, one reaching **400k installs** in its first year",
            "Reduced app size **42%** by auditing dependencies and moving to on-demand resources",
            "Built the shared networking and caching layer reused across both apps",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Computer Science",
          school: "University of Washington",
          location: "Seattle, WA",
          start: "2014-09",
          end: "2018-06",
        },
      ],
      skills: [
        "Swift",
        "SwiftUI",
        "UIKit",
        "Combine",
        "XCTest",
        "Core Data",
        "REST APIs",
        "Kotlin",
        "Fastlane",
        "App Store release management",
      ],
    },
    template: "amsterdam",
    sections: [
      {
        heading: "Link the apps. This is the whole advantage",
        body: [
          "A reviewer can download your work in thirty seconds, and if the resume gives them a way to do it, they will. Name the apps, put a store link in the header, and give the install scale and rating where they're good.",
          "If everything you've built is internal, enterprise or under NDA, say so briefly and substitute scale — \"internal field app used by 3,000 technicians daily\" is perfectly strong. What doesn't work is describing mobile work in the abstract when the medium has a public shop window.",
        ],
      },
      {
        heading: "The metrics mobile hands you for free",
        body: [
          "Every mobile team already watches a set of numbers that make excellent resume bullets, and most candidates never quote them. Crash-free session rate is the headline: it's the clearest quality signal in the discipline and moving it from 99.1% to 99.94% represents real engineering.",
          "Startup time, app size, ANR rate, store rating and review sentiment are all similarly available. Even review text is usable — \"resolved the top App Store complaint; 1-star reviews fell 38%\" connects engineering to the customer in a way few bullets manage.",
        ],
        list: [
          "Installs, monthly active users, or daily sessions",
          "Crash-free rate or ANR rate, before and after",
          "Cold start time and app binary size",
          "Store rating, and any movement you caused",
          "Rollout mechanics: phased releases, beta cohort size",
        ],
      },
      {
        heading: "Native or cross-platform — pick a lane in the summary",
        body: [
          "iOS, Android and React Native postings are screened by different people looking for different words. A resume that claims all three equally reads as shallow in each, so lead with your genuine strength and list the others as secondary competence.",
          "\"Swift and SwiftUI, with production Kotlin\" is credible. \"iOS, Android, Flutter, React Native\" invites the assumption that you've built one small thing in each. If you truly are a cross-platform specialist, say that plainly — it's a real specialism with its own demand.",
        ],
      },
      {
        heading: "Release management is undervalued signal",
        body: [
          "Shipping mobile software means dealing with store review, phased rollouts, forced upgrades, and the fact that you cannot hotfix a bad release the way you can on the web. Anyone who has owned that has learned things a web developer hasn't.",
          "Mention the mechanics: TestFlight or Play Console beta cohorts, staged rollouts, a rejection you resolved, a kill switch you built. It tells a hiring manager you can be trusted with the release, not just the code.",
        ],
      },
      {
        heading: "Migrations show currency",
        body: [
          "Mobile platforms churn faster than most, and having done a real migration — UIKit to SwiftUI, Java to Kotlin, XML layouts to Compose — proves you're current rather than maintaining something from 2018.",
          "The persuasive detail is how you did it: incrementally, screen by screen, without a rating drop. A big-bang rewrite that shipped is impressive; an incremental migration that never regressed the product is more impressive to anyone who has managed one.",
        ],
      },
    ],
    keywords: [
      {
        group: "iOS",
        terms: [
          "Swift",
          "SwiftUI",
          "UIKit",
          "Combine",
          "Xcode",
          "Core Data",
          "XCTest",
          "TestFlight",
        ],
      },
      {
        group: "Android",
        terms: [
          "Kotlin",
          "Jetpack Compose",
          "Android SDK",
          "Coroutines",
          "Room",
          "Gradle",
          "Play Console",
        ],
      },
      {
        group: "Cross-platform",
        terms: ["React Native", "Flutter", "Dart", "TypeScript", "Expo"],
      },
      {
        group: "Practice",
        terms: [
          "MVVM",
          "REST APIs",
          "GraphQL",
          "Offline-first",
          "Push notifications",
          "CI/CD",
          "Fastlane",
          "Firebase",
          "App Store optimisation",
          "Accessibility",
        ],
      },
    ],
    mistakes: [
      "No link to a single shipped app on a mobile developer resume",
      "Claiming iOS, Android and two cross-platform frameworks with equal confidence",
      "Never quoting crash rate, rating or installs, all of which you already track",
      "Listing Objective-C or Java prominently when the posting is Swift or Kotlin",
      "Describing screens built rather than what the app did for users",
      "Omitting release ownership, which is a large part of senior mobile work",
    ],
    faqs: [
      {
        question: "What if my apps are internal and can't be downloaded?",
        answer:
          "Say so in three words and give the scale instead — daily active users, devices deployed, or the operation the app runs. \"Internal field service app used by 3,000 technicians daily\" is stronger evidence of engineering than a consumer app with 200 installs.",
      },
      {
        question: "Should I list both iOS and Android?",
        answer:
          "List both if you've shipped in both, but rank them. Postings are written for one platform and screened by someone looking for its language, so lead with the one that matches and let the other read as useful breadth.",
      },
      {
        question: "Is React Native experience a disadvantage for native roles?",
        answer:
          "Only if it's all you have and the posting is explicitly native. Pair it with whatever native work you've done — a module you wrote in Swift or Kotlin, a performance problem you solved below the bridge — and it reads as range rather than as a gap.",
      },
      {
        question: "How do I show mobile performance work?",
        answer:
          "Cold start time, frame rate, app size and battery impact, each with a before and after. These are measured in every serious mobile team, and quoting them puts you ahead of the large majority of applicants who don't.",
      },
    ],
    related: [
      "software-engineer",
      "frontend-developer",
      "full-stack-developer",
      "qa-engineer",
    ],
    guides: ["resume-bullet-points", "ats-friendly-resume", "resume-summary-examples"],
  },

  {
    slug: "machine-learning-engineer",
    role: "Machine Learning Engineer",
    aka: ["MLOps Engineer", "AI Engineer", "ML Platform Engineer"],
    category: "engineering",
    metaTitle: "Machine Learning Engineer Resume Example & Guide ({year}) | meniacv",
    description:
      "An ML engineer resume example focused on models in production — serving latency, pipelines and evaluation — with the MLOps keywords hiring teams screen for.",
    updated: "2026-07-29",
    intro:
      "The difference between a data scientist and a machine learning engineer is where the work ends. A scientist's output is a finding; an engineer's output is a system that keeps making predictions at three in the morning. Write the resume around that, and the distinction does the positioning for you.",
    looksFor: [
      "Models serving live traffic, with latency and volume figures",
      "Pipelines: training, retraining, feature computation, evaluation",
      "Software engineering rigour — tests, deploys, monitoring, rollback",
      "Model performance monitoring and drift handling",
      "Cost per inference or training, increasingly the deciding constraint",
    ],
    sample: {
      name: "Farah Nasser",
      title: "Machine Learning Engineer",
      email: "farah.nasser@email.com",
      phone: "+1 (408) 555-0136",
      location: "San Jose, CA",
      links: [
        { label: "GitHub", url: "github.com/fnasser" },
        { label: "LinkedIn", url: "linkedin.com/in/farahnasser" },
      ],
      summary:
        "ML engineer with 6 years putting models into production and keeping them there. I own the serving path: recommendations at 8k predictions/second and p99 under 40ms, with automated retraining and drift alerts.",
      experience: [
        {
          role: "Machine Learning Engineer",
          company: "Loop Retail",
          location: "San Jose, CA",
          start: "2022-03",
          bullets: [
            "Own the recommendation serving stack — **8k predictions/second, p99 40ms** — driving **11% of site revenue**",
            "Built the feature store and automated retraining pipeline, taking model refresh from **quarterly and manual to daily**",
            "Cut inference cost **58%** by distilling the ranking model and moving serving to ONNX on CPU",
            "Added drift detection and shadow evaluation; caught **3 silent degradations** before they reached customers",
            "Rebuilt offline evaluation to match online results within **2%**, ending a long-standing trust problem with launches",
          ],
        },
        {
          role: "Machine Learning Engineer",
          company: "Cartwheel AI",
          location: "Remote",
          start: "2019-10",
          end: "2022-02",
          bullets: [
            "Productionised the document extraction model processing **2M documents/month** at 96% field accuracy",
            "Built the training infrastructure on Kubernetes that cut experiment turnaround from **2 days to 3 hours**",
            "Wrote the LLM evaluation harness — golden sets, regression gates in CI — that made prompt changes reviewable",
          ],
        },
      ],
      education: [
        {
          degree: "MS, Computer Science (Machine Learning)",
          school: "Georgia Institute of Technology",
          location: "Atlanta, GA",
          start: "2017-08",
          end: "2019-05",
        },
        {
          degree: "BEng, Electrical Engineering",
          school: "American University of Beirut",
          location: "Beirut, Lebanon",
          start: "2013-09",
          end: "2017-06",
        },
      ],
      skills: [
        "Python",
        "PyTorch",
        "Kubernetes",
        "Feature stores",
        "MLflow",
        "Airflow",
        "ONNX",
        "Spark",
        "AWS SageMaker",
        "Model monitoring",
      ],
    },
    template: "meridian",
    sections: [
      {
        heading: "Own the serving path, and say so",
        body: [
          "The clearest way to establish that you are an engineer rather than an analyst is to describe the production system: throughput, latency, availability, and what depends on it. \"8k predictions/second, p99 40ms, driving 11% of site revenue\" is a sentence a notebook-only candidate cannot write.",
          "This is also the answer to the most common screening question about ML resumes — did any of this ever run? Lead with the fact that it did.",
        ],
      },
      {
        heading: "Pipelines beat models",
        body: [
          "A single well-trained model is a one-off. A pipeline that retrains, evaluates, and promotes models without a human is infrastructure, and it's what companies are short of. Describe the machinery: feature computation, training orchestration, evaluation gates, promotion, rollback.",
          "The metric to attach is cadence. \"Model refresh from quarterly and manual to daily\" tells a hiring manager exactly what capability you added, and implies everything about the engineering underneath it.",
        ],
        list: [
          "Retraining frequency, before and after automation",
          "Experiment turnaround time",
          "Predictions per second and serving latency",
          "Inference or training cost, and how you reduced it",
          "Drift or degradation caught before customers noticed",
        ],
      },
      {
        heading: "Evaluation is the credibility centre of an ML resume",
        body: [
          "Anyone can report a metric on a test set. The engineer worth hiring is the one who has made offline evaluation actually predict online behaviour, built golden sets, gated deploys on regression tests, and caught silent failures in production.",
          "\"Rebuilt offline evaluation to match online results within 2%, ending a long-standing trust problem with launches\" is a strong bullet precisely because it's about the discipline of measurement rather than about a model architecture. Hiring managers who have been burned recognise it immediately.",
        ],
      },
      {
        heading: "Cost is now part of the job",
        body: [
          "Inference cost has become a first-order constraint, especially anywhere large models are involved. Distillation, quantisation, batching, caching, moving off GPUs where CPU will do — these are ordinary ML engineering decisions now, and quantifying one puts you in a small minority of applicants.",
          "State it as a percentage or a monthly figure and name the mechanism. \"Cut inference cost 58% by distilling the ranking model and moving serving to ONNX on CPU\" is engineering, finance and judgement in one line.",
        ],
      },
      {
        heading: "If you work with LLMs, be concrete about what you built",
        body: [
          "\"Experience with LLMs\" and \"prompt engineering\" have been diluted to the point of meaning nothing. What still signals competence is the surrounding engineering: evaluation harnesses, retrieval pipelines with measured relevance, guardrails, latency and cost budgets, caching strategies, and regression gates for prompt changes.",
          "Name the system and its constraint. An LLM evaluation harness with golden sets and CI gates is a real artefact; a list of model names you've called an API for is not.",
        ],
      },
    ],
    keywords: [
      {
        group: "Modelling",
        terms: [
          "PyTorch",
          "TensorFlow",
          "scikit-learn",
          "XGBoost",
          "Transformers",
          "Recommender systems",
          "NLP",
          "Computer vision",
          "Fine-tuning",
        ],
      },
      {
        group: "MLOps",
        terms: [
          "MLflow",
          "Airflow",
          "Kubeflow",
          "Feature store",
          "Model registry",
          "Model monitoring",
          "Drift detection",
          "A/B testing",
          "Model serving",
        ],
      },
      {
        group: "Platform",
        terms: [
          "Python",
          "Kubernetes",
          "Docker",
          "AWS SageMaker",
          "Vertex AI",
          "Spark",
          "Ray",
          "ONNX",
          "Triton",
          "CI/CD",
        ],
      },
      {
        group: "LLM systems",
        terms: [
          "LLM evaluation",
          "Retrieval-augmented generation",
          "Vector databases",
          "Embeddings",
          "Inference optimisation",
          "Quantisation",
          "Distillation",
        ],
      },
    ],
    mistakes: [
      "A resume that reads as data science, applied to an engineering posting",
      "Model accuracy with no serving, scale or deployment anywhere on the page",
      "Framework lists standing in for systems you've built",
      "\"Prompt engineering\" as a headline skill, with no evaluation behind it",
      "No mention of monitoring, which is where production ML actually fails",
      "Coursework projects presented at the same weight as production systems",
    ],
    faqs: [
      {
        question: "What's the difference between an ML engineer and a data scientist resume?",
        answer:
          "The ML engineer resume is about systems that keep running — serving, pipelines, monitoring, cost — and the data scientist resume is about findings and decisions. Same tools, different centre of gravity. Read the posting: if it lists Kubernetes and CI/CD, it wants the engineering version.",
      },
      {
        question: "Do I need a master's degree or PhD?",
        answer:
          "A master's is common and helps at screening; a PhD is mainly relevant for research positions. Neither substitutes for evidence that you've put a model into production and kept it healthy, which is what most applied postings are actually short of.",
      },
      {
        question: "How do I present LLM work without sounding generic?",
        answer:
          "Describe the engineering around the model rather than the model. Evaluation sets, retrieval relevance figures, latency and cost budgets, guardrails, and regression gates in CI are all specific and verifiable. \"Worked with GPT and LangChain\" is not.",
      },
      {
        question: "Should I list Kaggle or research papers?",
        answer:
          "Papers, briefly, if they're relevant and published. Kaggle only if the placing is strong and your production experience is thin. Both lose to a line about a model currently serving live traffic.",
      },
    ],
    related: [
      "data-scientist",
      "software-engineer",
      "devops-engineer",
      "backend-developer",
    ],
    guides: ["resume-bullet-points", "ats-friendly-resume", "ai-resume-builder"],
  },

  {
    slug: "cybersecurity-analyst",
    role: "Cybersecurity Analyst",
    aka: ["Security Analyst", "SOC Analyst", "Information Security Analyst"],
    category: "engineering",
    metaTitle: "Cybersecurity Analyst Resume Example & Guide ({year}) | meniacv",
    description:
      "A cybersecurity analyst resume example with incident response, detection engineering and compliance work, plus the certifications and keywords that pass screening.",
    updated: "2026-07-29",
    intro:
      "Security hiring screens hard on two things: certifications, because compliance frameworks and clients demand them, and demonstrated incident work, because nothing else proves you can act under pressure. A security resume that carries both, with numbers, clears the filter that most don't.",
    looksFor: [
      "Certifications, listed prominently — this field genuinely screens on them",
      "Incidents handled, with severity, volume and outcome",
      "Detection engineering: rules written, false positives reduced",
      "Frameworks by name — NIST, ISO 27001, SOC 2, MITRE ATT&CK",
      "Evidence you reduced risk, not just monitored it",
    ],
    sample: {
      name: "Owen Fitzgerald",
      title: "Cybersecurity Analyst",
      email: "owen.fitzgerald@email.com",
      phone: "+353 87 555 0142",
      location: "Dublin, Ireland",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/owenfitzgerald" }],
      summary:
        "Security analyst with 5 years in a 24/7 SOC and a detection engineering bias. Cut alert noise 64% while raising true-positive rate, led response on 40+ confirmed incidents, and took the organisation through its first SOC 2 Type II.",
      experience: [
        {
          role: "Security Analyst, Tier 2",
          company: "Corrib Financial",
          location: "Dublin, Ireland",
          start: "2022-05",
          bullets: [
            "Led response on **40+ confirmed incidents**, including a business email compromise contained in **22 minutes** with no funds lost",
            "Rewrote **120 SIEM detection rules** mapped to MITRE ATT&CK, cutting alert volume **64%** while raising true-positive rate from 12% to 38%",
            "Ran the vulnerability management programme across **2,300 endpoints**, cutting mean time to patch critical CVEs from **28 days to 6**",
            "Owned the technical evidence for the company's first **SOC 2 Type II**, passed with no exceptions",
            "Built the phishing simulation programme; reported-click rate fell from **18% to 4%** over four quarters",
          ],
        },
        {
          role: "SOC Analyst, Tier 1",
          company: "Shannon Managed Security",
          location: "Limerick, Ireland",
          start: "2020-02",
          end: "2022-04",
          bullets: [
            "Triaged **~200 alerts per shift** across 30 client environments in a 24/7 SOC",
            "Wrote the triage playbooks for the six most common alert types, cutting average handling time **40%**",
            "Escalated and documented the intrusion that led to a client's full credential rotation",
          ],
        },
      ],
      education: [
        {
          degree: "BSc, Computer Security & Digital Forensics",
          school: "Technological University Dublin",
          location: "Dublin, Ireland",
          start: "2016-09",
          end: "2020-05",
        },
      ],
      skills: [
        "SIEM (Splunk, Sentinel)",
        "Incident response",
        "MITRE ATT&CK",
        "EDR (CrowdStrike)",
        "Vulnerability management",
        "Python scripting",
        "Network analysis",
        "SOC 2 / ISO 27001",
        "Threat hunting",
        "Cloud security (Azure)",
      ],
      certifications: [
        {
          name: "CompTIA Security+",
          issuer: "CompTIA",
          date: "2020-01",
        },
        {
          name: "GIAC Certified Incident Handler (GCIH)",
          issuer: "SANS / GIAC",
          date: "2023-04",
        },
        {
          name: "Microsoft Certified: Security Operations Analyst",
          issuer: "Microsoft",
          date: "2022-06",
        },
      ],
    },
    template: "ashford",
    sections: [
      {
        heading: "Certifications go where they'll be found",
        body: [
          "Security is one of the few fields where certifications are a genuine screening gate. Security+, GCIH, GSEC, CISSP, CISM and the cloud security certifications are often written into the requisition, and sometimes into the client contract, so a recruiter is looking for those exact strings.",
          "Put them in their own clearly labelled section with the issuer and year, and mention the headline one in your summary if it's the role's stated requirement. This is the opposite of the advice for software engineering, and it's because the market is different.",
        ],
      },
      {
        heading: "Incidents are the proof; describe them safely",
        body: [
          "Nothing establishes a security analyst faster than incidents actually handled. The trick is writing them without disclosing anything you shouldn't: describe the class of incident, the scale, your role, and the time to contain — never client names, internal tooling detail, or anything that would help an attacker.",
          "\"Business email compromise contained in 22 minutes with no funds lost\" is specific, impressive and discloses nothing. Volume works too: 40 confirmed incidents, or 200 alerts triaged per shift, establishes the environment you've operated in.",
        ],
      },
      {
        heading: "Detection engineering separates analysts from alert-watchers",
        body: [
          "Tier 1 triage is necessary work and it's also where the largest number of candidates sit. What moves you above it is improving the detections themselves: rules written, coverage mapped to ATT&CK, false positives eliminated, playbooks automated.",
          "The metric pair to aim for is noise down and quality up together, because either alone is ambiguous — \"cut alert volume 64% while raising true-positive rate from 12% to 38%\" proves you tuned rather than just suppressed.",
        ],
        list: [
          "Detection rules written or tuned, and ATT&CK coverage added",
          "Alert volume and true-positive rate, before and after",
          "Mean time to detect, and mean time to contain",
          "Time to patch critical vulnerabilities, before and after",
          "Phishing click rate across a simulation programme",
        ],
      },
      {
        heading: "Compliance work is worth real space",
        body: [
          "Analysts often treat audit support as the boring part of the job and leave it off. That's a mistake: SOC 2, ISO 27001, PCI DSS and GDPR work is directly commercially valuable, and someone who has produced technical evidence for a clean audit is solving a problem the business feels acutely.",
          "Name the framework and the result. \"Owned the technical evidence for the first SOC 2 Type II, passed with no exceptions\" is a sentence a hiring manager can take to their own leadership as a reason to hire you.",
        ],
      },
      {
        heading: "Show risk reduced, not vigilance performed",
        body: [
          "Monitoring is an activity; reduced risk is an outcome. Wherever you can, express the work as an exposure that shrank — endpoints patched faster, credentials rotated, an attack path closed, a click rate that fell.",
          "This framing also handles the field's awkward reality that a good quarter looks like nothing happening. You can't quantify breaches that didn't occur, but you can quantify the window an attacker would have had.",
        ],
      },
    ],
    keywords: [
      {
        group: "Operations",
        terms: [
          "SIEM",
          "Splunk",
          "Microsoft Sentinel",
          "EDR",
          "CrowdStrike",
          "SOAR",
          "Incident response",
          "Threat hunting",
          "Digital forensics",
          "Malware analysis",
        ],
      },
      {
        group: "Frameworks",
        terms: [
          "MITRE ATT&CK",
          "NIST CSF",
          "ISO 27001",
          "SOC 2",
          "PCI DSS",
          "GDPR",
          "Risk assessment",
          "Zero trust",
        ],
      },
      {
        group: "Technical",
        terms: [
          "Network security",
          "Firewalls",
          "IDS/IPS",
          "Vulnerability management",
          "Penetration testing",
          "Cloud security",
          "Azure",
          "AWS",
          "Identity and access management",
          "Python",
        ],
      },
      {
        group: "Certifications",
        terms: [
          "Security+",
          "CISSP",
          "CISM",
          "GCIH",
          "GSEC",
          "OSCP",
          "CEH",
          "AZ-500",
        ],
      },
    ],
    mistakes: [
      "Burying certifications at the bottom in a field that screens on them",
      "Naming clients, internal tools or specific vulnerabilities you shouldn't disclose",
      "\"Monitored security alerts\" with no volume, outcome or tuning work",
      "Listing every security tool ever touched instead of what you detected or contained",
      "Omitting compliance and audit work, which is commercially the easiest sell",
      "Claiming penetration testing experience on the strength of a lab course",
    ],
    faqs: [
      {
        question: "How do I describe incidents without breaching confidentiality?",
        answer:
          "Use the class of incident, the scale, your role and the containment time, and leave out client names, tooling specifics and anything that maps to a live weakness. \"Contained a business email compromise in 22 minutes with no funds lost\" is safe and strong. If in doubt, describe the outcome and omit the mechanism.",
      },
      {
        question: "Which certification should I get first?",
        answer:
          "Security+ is the standard entry gate and appears in a large share of junior requisitions. After that, follow the work you want: GCIH or a SOC analyst certification for operations, OSCP for offensive roles, CISSP or CISM once you're heading toward management.",
      },
      {
        question: "Can I move into security from IT support or networking?",
        answer:
          "Yes, and it's the most common route in. Lead with the security-adjacent work you already do — patching, access reviews, hardening, phishing response — get Security+ to clear the keyword filter, and be explicit in the summary that you're targeting a security role.",
      },
      {
        question: "Do home labs and CTFs belong on a security resume?",
        answer:
          "While you're breaking in, yes — they're credible evidence of hands-on capability, and this field respects them more than most. Keep them to a compact section, name what you actually built or solved, and drop them once you have professional incident work to describe instead.",
      },
    ],
    related: [
      "devops-engineer",
      "it-support-specialist",
      "software-engineer",
      "business-analyst",
    ],
    guides: ["ats-friendly-resume", "resume-bullet-points", "career-change-resume"],
  },

  {
    slug: "it-support-specialist",
    role: "IT Support Specialist",
    aka: ["Help Desk Technician", "Desktop Support Analyst", "IT Technician"],
    category: "engineering",
    metaTitle: "IT Support Specialist Resume Example & Guide ({year}) | meniacv",
    description:
      "An IT support and help desk resume example with ticket volumes, resolution times and the certifications and keywords that get past ATS screening.",
    updated: "2026-07-29",
    intro:
      "IT support is the most volume-hired technical role there is, which means your resume competes with hundreds of near-identical ones. The two things that break the tie are numbers — tickets, resolution time, satisfaction — and evidence that you fixed causes rather than symptoms.",
    looksFor: [
      "Ticket volume and the environment size you supported",
      "First-contact resolution rate and average resolution time",
      "The stack: Windows, macOS, Active Directory, Microsoft 365, Intune",
      "Automation or documentation that reduced repeat tickets",
      "Customer-facing manner, evidenced by a satisfaction score",
    ],
    sample: {
      name: "Sofia Marchetti",
      title: "IT Support Specialist",
      email: "sofia.marchetti@email.com",
      phone: "+1 (773) 555-0119",
      location: "Chicago, IL",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/sofiamarchetti" }],
      summary:
        "IT support specialist with 5 years supporting 1,200-user environments across Windows, macOS and Microsoft 365. Consistently above 95% satisfaction, and I cut repeat password tickets by 70% by fixing the process rather than the ticket.",
      experience: [
        {
          role: "IT Support Specialist, Tier 2",
          company: "Lakeshore Legal Group",
          location: "Chicago, IL",
          start: "2022-06",
          bullets: [
            "Sole tier-2 support for **1,200 users** across 6 offices; resolve **~60 tickets/week** at **97% satisfaction**",
            "Cut password-reset tickets **70%** by deploying self-service reset in Entra ID and writing the user guide for it",
            "Led the **Windows 11 rollout to 900 devices** via Intune with no missed deadlines and under 10 escalations",
            "Raised first-contact resolution from **58% to 81%** by building a 40-article knowledge base from recurring tickets",
            "Manage onboarding and offboarding for **~25 starters/month**, including device build and access provisioning",
          ],
        },
        {
          role: "Help Desk Technician",
          company: "Midwest Care Partners",
          location: "Chicago, IL",
          start: "2020-08",
          end: "2022-05",
          bullets: [
            "Handled **~90 tickets/week** in a 400-user healthcare environment with strict HIPAA handling requirements",
            "Reduced average resolution time from **11 hours to 4** by re-triaging the queue and setting priority rules",
            "Imaged and deployed 250 laptops during the remote-work transition, on schedule",
          ],
        },
      ],
      education: [
        {
          degree: "Associate of Applied Science, Network Administration",
          school: "Harper College",
          location: "Palatine, IL",
          start: "2018-08",
          end: "2020-05",
        },
      ],
      skills: [
        "Windows 10/11",
        "macOS",
        "Active Directory / Entra ID",
        "Microsoft 365",
        "Intune",
        "Ticketing (ServiceNow, Jira)",
        "Networking (TCP/IP, DNS, VPN)",
        "PowerShell",
        "Hardware troubleshooting",
        "Documentation",
      ],
      certifications: [
        {
          name: "CompTIA A+",
          issuer: "CompTIA",
          date: "2020-06",
        },
        {
          name: "Microsoft 365 Certified: Modern Desktop Administrator Associate",
          issuer: "Microsoft",
          date: "2022-09",
        },
      ],
    },
    template: "bergen",
    sections: [
      {
        heading: "Numbers are how you stand out in a volume-hired role",
        body: [
          "Support resumes are the most interchangeable in tech, because the duties genuinely are similar everywhere. Ticket volume, user count, resolution time and satisfaction score are the fastest way to become specific, and they're all sitting in a system you already use.",
          "\"Sole tier-2 support for 1,200 users, resolving 60 tickets a week at 97% satisfaction\" tells a hiring manager the scale you can handle, the autonomy you're used to, and how users experience you. Three facts, one sentence, and almost nobody writes it.",
        ],
        list: [
          "Tickets per week or month, and the tier",
          "Users, sites and devices supported",
          "First-contact resolution rate",
          "Average or median resolution time, before and after",
          "Customer satisfaction score",
        ],
      },
      {
        heading: "Fixing the cause is what promotes you",
        body: [
          "Every support technician closes tickets. The ones who move into systems administration, engineering or security are the ones who made tickets stop happening — self-service password reset, a knowledge base, a script, a fixed image, a policy change.",
          "This is the single most valuable framing available to you, and it's usually true of work you've already done. \"Cut password-reset tickets 70% by deploying self-service reset\" is the same effort as \"handled password resets\", described at the level that gets noticed.",
        ],
      },
      {
        heading: "Name the stack the way postings name it",
        body: [
          "Support requisitions are keyword-dense and often screened by someone non-technical, so the specific strings matter: Active Directory, Entra ID, Microsoft 365, Intune, ServiceNow, Windows 11, macOS, VPN, DNS.",
          "Write them as the posting writes them, including both names where a product has been renamed. Being the candidate whose resume contains the exact term the recruiter searched for is a large part of getting shortlisted in this field.",
        ],
      },
      {
        heading: "Projects, not just the queue",
        body: [
          "A rollout is a project, and projects read as capability beyond day-to-day support. An OS migration, a device refresh, a move to a new ticketing system, an office build-out, an onboarding process you redesigned — each of these is worth a bullet with scale and outcome.",
          "\"Led the Windows 11 rollout to 900 devices via Intune with no missed deadlines\" is the bullet that gets you interviewed for a systems administrator role rather than another help desk one.",
        ],
      },
      {
        heading: "Say that you're good with people, by showing it",
        body: [
          "Support is a service job wearing a technical badge, and hiring managers know that patience under pressure is harder to find than knowledge of Group Policy. But \"excellent communication skills\" convinces nobody.",
          "A satisfaction score does. So does documentation written for non-technical users, training you delivered, or the fact that you're the person the executives ask for. Any of those is worth more than the adjective.",
        ],
      },
    ],
    keywords: [
      {
        group: "Platforms",
        terms: [
          "Windows 10",
          "Windows 11",
          "macOS",
          "iOS",
          "Android",
          "Linux",
          "Microsoft 365",
          "Google Workspace",
        ],
      },
      {
        group: "Administration",
        terms: [
          "Active Directory",
          "Entra ID",
          "Group Policy",
          "Intune",
          "MDM",
          "SCCM",
          "Exchange",
          "Azure",
          "PowerShell",
          "Imaging and deployment",
        ],
      },
      {
        group: "Networking & security",
        terms: [
          "TCP/IP",
          "DNS",
          "DHCP",
          "VPN",
          "Wi-Fi troubleshooting",
          "Firewalls",
          "MFA",
          "Endpoint protection",
        ],
      },
      {
        group: "Service management",
        terms: [
          "ServiceNow",
          "Jira Service Management",
          "Zendesk",
          "ITIL",
          "SLA management",
          "Incident management",
          "Knowledge base",
          "Onboarding and offboarding",
          "Asset management",
        ],
      },
    ],
    mistakes: [
      "A duty list — \"answered calls, resolved tickets\" — with no volume or outcome",
      "No user count, so a reader can't tell if you supported 40 people or 4,000",
      "Omitting the certifications, which are a genuine screening filter at this level",
      "Listing hardware models instead of the systems and platforms you administer",
      "Missing the process improvements, which are what qualify you for the next role up",
      "Using internal tier names and acronyms nobody outside the company knows",
    ],
    faqs: [
      {
        question: "Which certifications matter for IT support?",
        answer:
          "CompTIA A+ is the standard entry credential and clears a lot of automated filters. Network+ and the Microsoft desktop or Azure fundamentals certifications are the natural next steps, and ITIL Foundation helps in larger organisations that run formal service management.",
      },
      {
        question: "How do I move from help desk into systems or security?",
        answer:
          "Promote the project and automation work above the queue work — rollouts, scripting, access reviews, hardening — and add the certification for the direction you want. The résumé needs to read as someone already doing a slice of the target job, which most support specialists genuinely are.",
      },
      {
        question: "Should I list ticket numbers if my volume was low?",
        answer:
          "Yes, if the environment explains it. Low volume with high complexity is a legitimate profile — say the user count and the tier, and let the numbers describe a specialised environment rather than a slow one.",
      },
      {
        question: "Is a degree required for IT support roles?",
        answer:
          "Usually not. Certifications plus demonstrable environment scale carry more weight here than in most technical fields, and an associate degree or an apprenticeship is entirely normal. Put whatever education you have at the bottom and lead with the work.",
      },
    ],
    related: [
      "cybersecurity-analyst",
      "devops-engineer",
      "customer-service-representative",
      "operations-manager",
    ],
    guides: ["how-to-write-a-resume", "ats-friendly-resume", "resume-bullet-points"],
  },
];
