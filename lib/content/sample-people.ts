// The people the template pages are demonstrated with.
//
// There used to be one. Thirty-two template detail pages all rendering the
// same Amara Diaz document meant the only text that differed between them was
// a one-line descriptor — which is a duplicate-content problem, not a design
// choice: Google picks one page out of a near-identical set and drops the rest.
//
// Five personas, assigned to templates by a stable hash of the template id, so
// a given template always draws the same person (the screenshots in
// public/templates have to match, and a value that moved between server and
// client would break hydration).

import { avatarUrl } from "@/lib/avatar";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { ResumeData, TemplateId } from "@/lib/types";

/** Built from a compact description so five full resumes don't run to a
 *  thousand lines. Everything the renderer needs, nothing it doesn't. */
interface Person {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: [string, string][];
  summary: string;
  jobs: {
    role: string;
    company: string;
    location: string;
    start: string;
    end: string;
    bullets: string[];
  }[];
  education: { degree: string; school: string; location: string; start: string; end: string }[];
  skills: [string, number][];
  languages: [string, number][];
  certificates: { name: string; issuer: string; date: string }[];
}

const PEOPLE: Person[] = [
  {
    name: "Amara Diaz",
    title: "Senior Product Designer",
    email: "amara.diaz@email.com",
    phone: "+1 (415) 555-0134",
    location: "San Francisco, CA",
    links: [
      ["LinkedIn", "linkedin.com/in/amaradiaz"],
      ["Portfolio", "amara.design"],
    ],
    summary:
      "Product designer with 8 years shipping data-heavy tools for small teams. I work close to engineering, prototype in code, and care most about the boring flows nobody screenshots.",
    jobs: [
      {
        role: "Senior Product Designer",
        company: "Northwind",
        location: "San Francisco, CA",
        start: "2022-03",
        end: "",
        bullets: [
          "Led the redesign of the reporting suite, cutting time-to-first-report from **11 minutes to under 2**",
          "Built and maintained the design system now used by 4 product teams",
          "Ran the research programme that reshaped the 2024 roadmap",
        ],
      },
      {
        role: "Product Designer",
        company: "Lumen Labs",
        location: "Remote",
        start: "2019-01",
        end: "2022-02",
        bullets: [
          "Owned onboarding end to end; activation rose from **34% to 58%**",
          "Shipped the mobile app's first accessible colour system",
          "Ran the weekly design critique that became the team's review standard",
        ],
      },
      {
        role: "Junior Designer",
        company: "Foundry Studio",
        location: "Portland, OR",
        start: "2018-06",
        end: "2018-12",
        bullets: [
          "Designed marketing sites for eight early-stage clients",
          "Built the studio's first shared component library in Figma",
        ],
      },
    ],
    education: [
      {
        degree: "BA, Interaction Design",
        school: "Rhode Island School of Design",
        location: "Providence, RI",
        start: "2014-09",
        end: "2018-05",
      },
      {
        degree: "Certificate, Human-Computer Interaction",
        school: "University of California, San Diego",
        location: "Remote",
        start: "2020-02",
        end: "2020-08",
      },
    ],
    skills: [
      ["Design systems", 4],
      ["Prototyping", 4],
      ["User research", 3],
      ["Figma", 4],
      ["HTML & CSS", 3],
      ["Accessibility", 3],
      ["Design tokens", 3],
      ["Usability testing", 3],
    ],
    languages: [
      ["English", 4],
      ["Spanish", 3],
      ["Portuguese", 2],
    ],
    certificates: [
      { name: "Nielsen Norman UX Certification", issuer: "NN/g", date: "2023-04" },
      { name: "IAAP Accessibility Core Competencies", issuer: "IAAP", date: "2022-09" },
    ],
  },
  {
    name: "Daniel Okonkwo",
    title: "Backend Engineer",
    email: "d.okonkwo@email.com",
    phone: "+44 20 7946 0812",
    location: "London, UK",
    links: [
      ["GitHub", "github.com/dokonkwo"],
      ["LinkedIn", "linkedin.com/in/danielokonkwo"],
    ],
    summary:
      "Backend engineer, six years on payments and identity. I like the systems that have to be correct at 3am, and I write the runbook before the incident rather than after it.",
    jobs: [
      {
        role: "Senior Backend Engineer",
        company: "Vantage Pay",
        location: "London, UK",
        start: "2022-06",
        end: "",
        bullets: [
          "Split the checkout monolith into three services, cutting deploys from **40 minutes to under 6**",
          "Brought settlement failures from 2% to **under 0.1%** by rebuilding the reconciliation job",
          "Own the on-call rotation for a service handling 40,000 transactions a day",
        ],
      },
      {
        role: "Backend Engineer",
        company: "Meridian Health",
        location: "Manchester, UK",
        start: "2019-09",
        end: "2022-05",
        bullets: [
          "Built the FHIR integration connecting 14 NHS trusts to a shared records API",
          "Cut p99 latency on the patient lookup endpoint from **1.9s to 240ms**",
          "Introduced contract testing, ending a class of breakage that had caused 6 outages",
        ],
      },
    ],
    education: [
      {
        degree: "BSc, Computer Science",
        school: "University of Manchester",
        location: "Manchester, UK",
        start: "2016-09",
        end: "2019-06",
      },
    ],
    skills: [
      ["Go", 4],
      ["PostgreSQL", 4],
      ["Kubernetes", 3],
      ["Python", 3],
      ["Distributed systems", 4],
      ["Terraform", 3],
      ["gRPC", 3],
      ["Observability", 4],
    ],
    languages: [
      ["English", 4],
      ["Igbo", 4],
      ["French", 2],
    ],
    certificates: [
      { name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2023-02" },
      { name: "AWS Solutions Architect — Associate", issuer: "AWS", date: "2021-11" },
    ],
  },
  {
    name: "Sofia Lindqvist",
    title: "Registered Nurse, Med-Surg",
    email: "s.lindqvist@email.com",
    phone: "+1 (612) 555-0188",
    location: "Minneapolis, MN",
    links: [["LinkedIn", "linkedin.com/in/sofialindqvist"]],
    summary:
      "Registered nurse with seven years on a 32-bed medical-surgical floor. Charge nurse two years running, and the person who rewrote our handover after we found the misses were all at shift change.",
    jobs: [
      {
        role: "Charge Nurse, Medical-Surgical",
        company: "St Catherine's Hospital",
        location: "Minneapolis, MN",
        start: "2021-04",
        end: "",
        bullets: [
          "Redesigned bedside handover; handover-related incidents fell by **just over half** in two quarters",
          "Precepted 6 new-graduate nurses through the residency programme, all retained at 12 months",
          "Coordinate care for up to 7 patients per shift across a 32-bed unit",
        ],
      },
      {
        role: "Registered Nurse, Medical-Surgical",
        company: "Lakeview Regional",
        location: "St Paul, MN",
        start: "2018-07",
        end: "2021-03",
        bullets: [
          "Cut unit CAUTI rate by **38%** as catheter-care champion over an 18-month programme",
          "Served on the falls-prevention committee that reduced falls with injury by a third",
        ],
      },
    ],
    education: [
      {
        degree: "BSN, Nursing",
        school: "University of Minnesota",
        location: "Minneapolis, MN",
        start: "2014-09",
        end: "2018-05",
      },
    ],
    skills: [
      ["Patient assessment", 4],
      ["Wound care", 4],
      ["IV therapy", 4],
      ["Epic EHR", 4],
      ["Care coordination", 4],
      ["Telemetry", 3],
      ["Preceptorship", 3],
      ["Discharge planning", 4],
    ],
    languages: [
      ["English", 4],
      ["Swedish", 4],
      ["Somali", 2],
    ],
    certificates: [
      { name: "Registered Nurse (RN), Minnesota", issuer: "MN Board of Nursing", date: "2018-07" },
      { name: "ACLS + PALS", issuer: "American Heart Association", date: "2024-01" },
    ],
  },
  {
    name: "Rohan Mehta",
    title: "Financial Analyst",
    email: "rohan.mehta@email.com",
    phone: "+1 (212) 555-0147",
    location: "New York, NY",
    links: [["LinkedIn", "linkedin.com/in/rohanmehta"]],
    summary:
      "Financial analyst covering SaaS and marketplaces, five years between corporate FP&A and the sell side. I build the model, then I argue about the assumptions in it, which is the part that matters.",
    jobs: [
      {
        role: "Senior Financial Analyst",
        company: "Harrow Capital",
        location: "New York, NY",
        start: "2022-01",
        end: "",
        bullets: [
          "Own the operating model for a **$180m** revenue portfolio company through two board cycles",
          "Rebuilt the forecast to cohort-level retention, cutting quarterly variance from **11% to 4%**",
          "Ran diligence on 3 completed acquisitions, including the model that repriced one by $12m",
        ],
      },
      {
        role: "Financial Analyst",
        company: "Bridgeway Group",
        location: "Boston, MA",
        start: "2019-08",
        end: "2021-12",
        bullets: [
          "Automated the monthly close pack in SQL and Python, saving **~30 hours a month**",
          "Built the unit-economics dashboard the commercial team now sets pricing from",
        ],
      },
    ],
    education: [
      {
        degree: "BSc, Economics",
        school: "London School of Economics",
        location: "London, UK",
        start: "2015-09",
        end: "2018-06",
      },
    ],
    skills: [
      ["Financial modelling", 4],
      ["Valuation", 4],
      ["SQL", 3],
      ["Excel / VBA", 4],
      ["Power BI", 3],
      ["Forecasting", 4],
      ["Variance analysis", 4],
      ["Python", 2],
    ],
    languages: [
      ["English", 4],
      ["Hindi", 4],
      ["Gujarati", 3],
    ],
    certificates: [
      { name: "CFA Level II Candidate", issuer: "CFA Institute", date: "2024-06" },
      { name: "Financial Modelling & Valuation Analyst", issuer: "CFI", date: "2021-03" },
    ],
  },
  {
    name: "Claire Beaumont",
    title: "Marketing Manager",
    email: "claire.beaumont@email.com",
    phone: "+33 1 45 67 89 01",
    location: "Paris, France",
    links: [
      ["LinkedIn", "linkedin.com/in/clairebeaumont"],
      ["Portfolio", "clairebeaumont.co"],
    ],
    summary:
      "Marketing manager running acquisition and lifecycle for a DTC brand at €8m a year. Most of my useful work has been deciding which numbers were lying to us.",
    jobs: [
      {
        role: "Marketing Manager",
        company: "Maison Verte",
        location: "Paris, France",
        start: "2021-09",
        end: "",
        bullets: [
          "Took blended CAC from **€41 to €29** on flat spend by moving to holdout-based measurement",
          "Run a €120k monthly budget across paid social, search and lifecycle email",
          "Grew the owned email list to 240,000 and email to **31%** of revenue",
        ],
      },
      {
        role: "Growth Marketing Specialist",
        company: "Atelier Nord",
        location: "Lyon, France",
        start: "2018-11",
        end: "2021-08",
        bullets: [
          "Built the lifecycle programme from zero to **22%** of revenue in under two years",
          "Ran the brand's first geo-lift tests, ending a two-year argument about attribution",
        ],
      },
    ],
    education: [
      {
        degree: "Master, Marketing & Communication",
        school: "ESSEC Business School",
        location: "Cergy, France",
        start: "2016-09",
        end: "2018-06",
      },
    ],
    skills: [
      ["Paid social", 4],
      ["Lifecycle email", 4],
      ["Incrementality testing", 4],
      ["Google Ads", 3],
      ["GA4", 3],
      ["Klaviyo", 4],
      ["Copywriting", 3],
      ["Budget planning", 4],
    ],
    languages: [
      ["French", 4],
      ["English", 4],
      ["Italian", 2],
    ],
    certificates: [
      { name: "Google Analytics 4 Certification", issuer: "Google", date: "2024-02" },
      { name: "Meta Media Buying Professional", issuer: "Meta", date: "2022-05" },
    ],
  },
];

/** FNV-1a, the same hash lib/avatar.ts uses. Deterministic so a template keeps
 *  its person across renders, servers and screenshot runs. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function toResumeData(person: Person): ResumeData {
  return {
    personal: {
      fullName: person.name,
      title: person.title,
      email: person.email,
      phone: person.phone,
      location: person.location,
      // The sample person has a photo of her own, the same as any resume that
      // uses a photo template would. The renderer never supplies one.
      photo: avatarUrl(person.name),
      contactOrder: ["email", "phone", "location"],
      links: person.links.map(([label, url], i) => ({
        id: `l${i + 1}`,
        label,
        url,
      })),
    },
    sections: [
      {
        id: "s1",
        type: "summary",
        title: "Summary",
        content: person.summary,
      },
      {
        id: "s2",
        type: "experience",
        title: "Experience",
        items: person.jobs.map((job, i) => ({
          id: `e${i + 1}`,
          role: job.role,
          company: job.company,
          location: job.location,
          startDate: job.start,
          endDate: job.end,
          current: job.end === "",
          highlights: job.bullets.map((b) => `- ${b}`).join("\n"),
        })),
      },
      {
        id: "s3",
        type: "education",
        title: "Education",
        items: person.education.map((school, i) => ({
          id: `ed${i + 1}`,
          degree: school.degree,
          school: school.school,
          location: school.location,
          startDate: school.start,
          endDate: school.end,
          description: "",
        })),
      },
      {
        id: "s4",
        type: "skills",
        title: "Skills",
        items: person.skills.map(([name, level], i) => ({
          id: `k${i + 1}`,
          name,
          level,
        })),
      },
      {
        id: "s5",
        type: "languages",
        title: "Languages",
        items: person.languages.map(([name, level], i) => ({
          id: `g${i + 1}`,
          name,
          level,
        })),
      },
      {
        id: "s6",
        type: "certifications",
        title: "Certificates",
        items: person.certificates.map((cert, i) => ({
          id: `c${i + 1}`,
          degree: cert.name,
          school: cert.issuer,
          location: "",
          startDate: cert.date,
          endDate: cert.date,
          description: "",
        })),
      },
    ],
    settings: { ...DEFAULT_SETTINGS },
  };
}

/** The five sample documents, in the order the personas are declared. */
export const SAMPLE_PEOPLE: ResumeData[] = PEOPLE.map(toResumeData);

/** Which person a given template is demonstrated with. */
export function personFor(templateId: TemplateId): ResumeData {
  return SAMPLE_PEOPLE[hash(templateId) % SAMPLE_PEOPLE.length];
}
