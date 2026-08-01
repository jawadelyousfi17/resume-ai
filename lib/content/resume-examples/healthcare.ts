// The allied-health examples: the certified and credentialed roles below the
// licensed clinician level.
//
// These pages have a different centre of gravity from the rest of the site.
// Credentials, patient volumes and shift patterns are screened before anything
// else, so the writing advice here is about surfacing those first rather than
// about narrative — a CNA resume that buries an active certification under a
// summary paragraph is failing at the only filter that runs on it.

import type { ResumeExample } from "./types";

export const HEALTHCARE_EXAMPLES: ResumeExample[] = [
  {
    slug: "certified-nursing-assistant",
    role: "Certified Nursing Assistant",
    aka: [
      "CNA",
      "nursing assistant",
      "nurse aide",
      "patient care assistant",
      "PCA",
      "state tested nursing assistant",
    ],
    category: "public",
    metaTitle:
      "CNA Resume Example — Certified Nursing Assistant ({year}) | meniacv",
    description:
      "A complete certified nursing assistant resume example, with the certification and patient-ratio detail that gets screened first and the bullet patterns that work for direct care.",
    updated: "2026-08-01",
    intro:
      "A CNA resume is read for three things before anyone assesses you as a candidate: is the certification active, in which state, and can this person handle the ratio on our unit. Everything else is secondary, and resumes that lead with a paragraph about being a compassionate caregiver are answering none of it. This is what the page looks like when it answers all three in the first four lines.",
    looksFor: [
      "An active CNA certification with the state and expiry visible without scrolling",
      "The setting you have worked in — long-term care, acute, rehab, home health — because the work differs sharply between them",
      "Patient ratios and census, which tell a charge nurse whether you can handle theirs",
      "EMR systems by name, since every facility runs one and training on a new one costs them time",
      "Reliability signals: length of tenure, shift flexibility, attendance",
      "BLS certification, and any additional credentials like phlebotomy or med-tech",
    ],
    sample: {
      name: "Danielle Okafor",
      title: "Certified Nursing Assistant — CNA, BLS",
      email: "d.okafor@email.com",
      phone: "(614) 555-0182",
      location: "Columbus, OH",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/danielleokafor" }],
      summary:
        "Certified nursing assistant with five years in long-term care and sub-acute rehab, currently carrying 12–14 residents on nights at a 96-bed skilled nursing facility. Charge-nurse delegate on weekends, precept new aides, and Epic-trained. Active Ohio CNA certification and BLS, looking for a day-shift position in an acute or rehab setting.",
      experience: [
        {
          role: "Certified Nursing Assistant, Sub-Acute Rehab",
          company: "Maplewood Skilled Nursing & Rehabilitation",
          location: "Columbus, OH",
          start: "2023-03",
          bullets: [
            "Provide direct care for **12–14 residents** per shift on a 96-bed unit, including ADLs, transfers, toileting, feeding assistance and vitals",
            "Precept new nursing assistants through their first two weeks — **9 aides** trained since 2024, seven of whom are still on the unit",
            "Flagged a change in a resident's baseline that led to an early UTI diagnosis and avoided a hospital transfer; now cited in unit orientation as the example of what to escalate",
            "Reduced call-light response time on nights by proposing a paired-rounding schedule with the second aide, taking the unit average from **just over 7 minutes to under 4**",
            "Document all care in **PointClickCare**; unit's designated trainer for new-hire charting since 2024",
          ],
        },
        {
          role: "Certified Nursing Assistant, Long-Term Care",
          company: "Brookfield Senior Living",
          location: "Westerville, OH",
          start: "2021-06",
          end: "2023-02",
          bullets: [
            "Cared for **10–12 residents** per shift in a memory-care wing, with a high proportion requiring two-person transfers",
            "Maintained **zero preventable falls** on assigned residents across 20 months",
            "Trained in Hoyer and sit-to-stand lift operation; the unit's go-to aide for bariatric transfers",
            "Held a **perfect attendance record** across two years, including picking up 40+ additional shifts during staffing shortages",
          ],
        },
        {
          role: "Home Health Aide",
          company: "Buckeye Home Care Services",
          location: "Columbus, OH",
          start: "2020-09",
          end: "2021-05",
          bullets: [
            "Supported **6 clients** weekly in their homes with personal care, meal preparation, medication reminders and mobility",
            "Coordinated with family members and the case manager on changes in condition, escalating three cases that resulted in care-plan revisions",
          ],
        },
      ],
      education: [
        {
          degree: "State-Approved Nurse Aide Training Program (75 hours)",
          school: "Columbus State Community College",
          location: "Columbus, OH",
          start: "2020-05",
          end: "2020-08",
        },
        {
          degree: "High School Diploma",
          school: "Northland High School",
          location: "Columbus, OH",
          start: "2016-08",
          end: "2020-05",
        },
      ],
      skills: [
        "Activities of daily living (ADLs)",
        "Vital signs and documentation",
        "Two-person and mechanical transfers (Hoyer, sit-to-stand)",
        "Fall prevention and safety rounds",
        "Dementia and memory care",
        "Wound observation and skin checks",
        "Catheter and ostomy care",
        "Intake and output tracking",
        "PointClickCare",
        "Epic",
        "Infection control and PPE protocol",
        "HIPAA compliance",
      ],
      certifications: [
        {
          name: "Certified Nursing Assistant (CNA) — Ohio, active through 2027",
          issuer: "Ohio Department of Health",
          date: "2020-09",
        },
        {
          name: "Basic Life Support (BLS) for Healthcare Providers",
          issuer: "American Heart Association",
          date: "2025-04",
        },
        {
          name: "Dementia Care Specialist Certificate",
          issuer: "Alzheimer's Association essentiALZ",
          date: "2024-02",
        },
      ],
    },
    template: "ledger",
    sections: [
      {
        heading: "Put the certification where it cannot be missed",
        body: [
          "Your CNA certification is not a credential that supports your candidacy — it is the eligibility gate, and a hiring manager sorting forty applications is checking it first. It belongs in three places: after your name in the title line, in the first sentence of your summary, and in its own certifications section with the state and the expiry date.",
          "That is not redundancy for its own sake. Certification is jurisdictional, and a facility in Ohio cannot hire an aide certified only in Kentucky without a reciprocity process they would rather avoid. Stating the state answers a question that would otherwise cost you a phone call you never get.",
          "The expiry matters just as much. \"CNA — Ohio\" leaves a reader wondering whether it lapsed; \"CNA — Ohio, active through 2027\" closes the question. Add BLS the same way, because it is required almost everywhere and an expired card delays a start date.",
        ],
      },
      {
        heading: "Ratios and census are the real experience section",
        body: [
          "\"Provided compassionate care to residents\" describes every CNA who has ever worked. \"Provide direct care for 12–14 residents per shift on a 96-bed sub-acute unit\" describes a specific workload, and a charge nurse reading it immediately knows whether you can handle theirs.",
          "Include the numbers that shape the job: how many patients or residents you carry, the size and type of the unit, how many require two-person transfers, and the shift you work. A candidate coming from 14 residents on nights is a different hire from one coming from 6 in assisted living, and neither of them can tell you which they are without the numbers.",
          "The setting matters as much as the ratio. Long-term care, memory care, sub-acute rehab, acute hospital and home health are genuinely different jobs with different pacing and different skill demands. Name yours explicitly rather than writing \"healthcare facility\".",
        ],
        list: [
          "Patients or residents per shift, and the unit's total bed count",
          "The setting — LTC, memory care, rehab, acute, home health",
          "Shift worked, and whether you are flexible across shifts",
          "Acuity indicators: two-person transfers, bariatric care, total-care residents",
          "The EMR you chart in, by name",
        ],
      },
      {
        heading: "What separates a strong CNA resume",
        body: [
          "Three things, and none of them is phrasing. Tenure, because turnover in this field is brutal and a facility is genuinely trying to hire someone who stays — two years in one place is a stronger signal than any adjective. Attendance, for the same reason, and it is worth stating plainly if yours is good. And evidence of clinical judgement.",
          "That last one is the differentiator and almost nobody includes it. A CNA who noticed a change in baseline and escalated it prevented a hospital transfer, and that is a story a nurse manager will read twice. It demonstrates the thing they cannot train quickly: knowing what is worth reporting.",
          "Precepting is the other high-value item. An aide who trains new hires is being trusted with the unit's onboarding, and stating how many people you have trained turns a soft claim into a countable one.",
        ],
      },
      {
        heading: "Scope, and the line not to cross",
        body: [
          "Be precise about scope of practice, because getting it wrong reads as either careless or as a candidate who works outside their licence. A CNA does not administer medication unless certified as a med aide in a state that permits it, and does not assess — a CNA observes and reports. Writing \"assessed patients\" where you meant \"monitored and reported changes\" is the single most common error on these resumes and an experienced nurse manager catches it instantly.",
          "The correct verbs are observed, monitored, reported, documented, escalated, assisted, provided, transferred, repositioned. They are not weaker than the clinical ones — used accurately, they signal that you understand where your role sits on the team, which is exactly what a charge nurse is checking for.",
          "If you do hold an expanded credential — med-tech, phlebotomy, restorative aide — name it explicitly with the issuing body, because it changes what you can be scheduled to do.",
        ],
      },
      {
        heading: "Length and format",
        body: [
          "One page for under about eight years, two beyond it, and a plain single-column layout. Healthcare systems run large applicant tracking installations and a sidebar layout can interleave your certifications into a job description — which for this role is the section that most needs to survive intact.",
          "Do not include a photo. Do include the shift you are available for and your earliest start date if you have one, because scheduling is the constraint most facilities are actually hiring against, and a candidate who states availability up front is easier to move forward.",
        ],
      },
    ],
    keywords: [
      {
        group: "Certifications and compliance",
        terms: [
          "Certified Nursing Assistant",
          "CNA",
          "State Tested Nursing Assistant",
          "STNA",
          "BLS",
          "CPR certified",
          "HIPAA",
          "Infection control",
          "PPE",
          "Mandatory reporter",
        ],
      },
      {
        group: "Direct care",
        terms: [
          "Activities of daily living",
          "ADLs",
          "Vital signs",
          "Ambulation",
          "Transfers",
          "Hoyer lift",
          "Sit-to-stand",
          "Repositioning",
          "Toileting",
          "Feeding assistance",
          "Bathing and grooming",
          "Catheter care",
          "Ostomy care",
          "Skin checks",
          "Intake and output",
        ],
      },
      {
        group: "Settings",
        terms: [
          "Long-term care",
          "Skilled nursing facility",
          "SNF",
          "Sub-acute rehabilitation",
          "Memory care",
          "Assisted living",
          "Acute care",
          "Home health",
          "Hospice",
          "Med-surg",
        ],
      },
      {
        group: "Systems",
        terms: [
          "PointClickCare",
          "Epic",
          "Cerner",
          "MatrixCare",
          "Meditech",
          "Electronic health records",
          "EMR",
          "Charting",
        ],
      },
    ],
    mistakes: [
      "Leaving the certification state and expiry off — a recruiter cannot verify eligibility and moves to the next application",
      "Writing \"assessed\" or \"diagnosed\". A CNA observes and reports, and a nurse manager notices immediately",
      "Describing the setting as \"healthcare facility\" instead of naming long-term care, rehab, memory care or acute",
      "No patient ratios anywhere on the page, which is the number a charge nurse is actually looking for",
      "Opening with \"compassionate and dedicated caregiver\" — true of every applicant, and therefore information about none",
      "Omitting the EMR you chart in, when training a new aide on an unfamiliar system is a real cost to the employer",
      "Hiding a strong attendance record or a long tenure, which in this field are among the most persuasive facts available",
      "A two-column template that interleaves the certifications section into a job description on export",
    ],
    faqs: [
      {
        question: "What should a CNA put on a resume?",
        answer:
          "Active certification with the state and expiry, BLS, the setting you have worked in, patient ratios per shift, the EMR you chart in, and specific care skills like transfers, ADLs and fall prevention. Tenure and attendance are worth stating explicitly — in a field with high turnover, both are strong signals.",
      },
      {
        question: "How do I write a CNA resume with no experience?",
        answer:
          "Lead with the certification and your clinical training hours, then describe your clinical rotation as you would a job — the setting, how many residents you were assigned, and what care you provided. Add any caregiving experience, paid or family, and any customer-facing work that shows reliability. One page, and state your shift availability.",
      },
      {
        question: "Where do certifications go on a CNA resume?",
        answer:
          "In three places: after your name in the title line, in the first sentence of your summary, and in a dedicated certifications section with the issuing body, state and expiry date. It is the eligibility gate rather than a supporting detail, and burying it in an education section costs you screenings.",
      },
      {
        question: "Should I list patient ratios on a nursing assistant resume?",
        answer:
          "Yes — it is the most useful number on the page. \"12–14 residents per shift on a 96-bed sub-acute unit\" tells a charge nurse whether you can handle their floor, which no amount of descriptive language can. Include the unit size and acuity indicators alongside it.",
      },
      {
        question: "How long should a CNA resume be?",
        answer:
          "One page under about eight years of experience, two beyond that. Use a single-column layout — healthcare systems run large applicant tracking installations, and a sidebar can interleave your certifications section into a job description on export.",
      },
      {
        question: "What is the difference between a CNA and a medical assistant resume?",
        answer:
          "A CNA resume is built around direct patient care, ratios and the care setting; a medical assistant resume is built around clinical procedures and administrative duties in an outpatient practice. The credentials differ too — state CNA certification against a national MA certification like CMA or RMA — and the two are screened by different people.",
      },
    ],
    related: ["registered-nurse", "medical-assistant", "customer-service-representative"],
    guides: ["certifications-on-resume", "resume-skills", "resume-bullet-points"],
  },
  {
    slug: "medical-assistant",
    role: "Medical Assistant",
    aka: [
      "certified medical assistant",
      "CMA",
      "clinical medical assistant",
      "MA",
      "registered medical assistant",
    ],
    category: "public",
    metaTitle:
      "Medical Assistant Resume Example — Clinical & Admin ({year}) | meniacv",
    description:
      "A complete medical assistant resume example covering both halves of the job — clinical procedures and front-office administration — with the certification and EMR detail practices screen for.",
    updated: "2026-08-01",
    intro:
      "A medical assistant does two jobs that are usually advertised as one, and most MA resumes make the mistake of writing only about the half they enjoyed. Practices hire for the combination: someone who can room a patient, draw blood and take vitals, and then handle prior authorisations and the schedule. A resume that demonstrates both is answering the posting; one that leans entirely clinical or entirely administrative is answering half of it.",
    looksFor: [
      "A national certification — CMA, RMA, CCMA or NCMA — with the certifying body named",
      "Which clinical procedures you perform, specifically, since scope varies by state and practice",
      "The EMR by name, because a practice on Epic does not want to train you on Epic",
      "Specialty experience, which matters more in outpatient medicine than most candidates realise",
      "Patient volume per day, which describes the pace you are used to",
      "Administrative competence: scheduling, insurance verification, prior authorisation, coding familiarity",
    ],
    sample: {
      name: "Marisol Vega",
      title: "Certified Medical Assistant (CMA) — Family Medicine",
      email: "m.vega@email.com",
      phone: "(480) 555-0147",
      location: "Mesa, AZ",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/marisolvega" }],
      summary:
        "Certified medical assistant with six years in family medicine and pediatrics, currently rooming 28–34 patients a day across three providers. Phlebotomy-certified, Epic superuser for the practice, and bilingual in English and Spanish. Looking for a clinical MA role in a specialty practice with a lead or trainer component.",
      experience: [
        {
          role: "Certified Medical Assistant, Family Medicine",
          company: "Desert Ridge Family Health",
          location: "Mesa, AZ",
          start: "2022-04",
          bullets: [
            "Room and prepare **28–34 patients a day** across three providers, taking vitals, reconciling medications and documenting chief complaint in Epic",
            "Perform venipuncture and capillary draws on roughly **15 patients daily**, including pediatric draws; first-stick success rate tracked at **94%** in the practice's quarterly audit",
            "Administer immunisations and injections under standing orders, and manage the vaccine fridge log and VFC inventory reconciliation",
            "Cut average prior-authorisation turnaround from **6 days to under 3** by rebuilding the tracking sheet and setting a same-day submission rule",
            "Named practice **Epic superuser** in 2024; trained **11 staff** through two template migrations",
            "Interpret for Spanish-speaking patients across roughly **a third of daily visits**, including consent and discharge instructions",
          ],
        },
        {
          role: "Medical Assistant, Pediatrics",
          company: "Sunrise Pediatric Associates",
          location: "Gilbert, AZ",
          start: "2020-01",
          end: "2022-03",
          bullets: [
            "Supported two pediatricians through **22–26 well-child and sick visits daily**, including growth measurements, developmental screening intake and vision and hearing checks",
            "Handled the immunisation schedule for the practice's panel, reducing overdue-vaccine recall list by **about 40%** over a year through a call-back routine",
            "Managed referrals and prior authorisations for specialty visits, tracking **30–40 open referrals** at any time",
          ],
        },
        {
          role: "Front Office Coordinator",
          company: "Valley Orthopedic Group",
          location: "Mesa, AZ",
          start: "2018-08",
          end: "2019-12",
          bullets: [
            "Scheduled **60+ appointments daily** across five providers and managed the surgical scheduling queue",
            "Verified insurance eligibility and collected copays; reduced front-desk claim rejections by catching coverage lapses at check-in",
          ],
        },
      ],
      education: [
        {
          degree:
            "Medical Assisting Diploma — clinical and administrative, 720 hours including a 160-hour externship",
          school: "Mesa Community College",
          location: "Mesa, AZ",
          start: "2017-08",
          end: "2018-07",
        },
      ],
      skills: [
        "Vital signs and patient rooming",
        "Venipuncture and capillary draw",
        "Injections and immunisations",
        "EKG",
        "Specimen collection and processing",
        "Sterile technique and instrument prep",
        "Medication reconciliation",
        "Prior authorisation and referrals",
        "Insurance verification",
        "ICD-10 and CPT familiarity",
        "Epic",
        "athenahealth",
        "Bilingual — English and Spanish",
        "HIPAA compliance",
      ],
      certifications: [
        {
          name: "Certified Medical Assistant (CMA) — active through 2027",
          issuer: "American Association of Medical Assistants (AAMA)",
          date: "2018-09",
        },
        {
          name: "Certified Phlebotomy Technician (CPT)",
          issuer: "National Healthcareer Association (NHA)",
          date: "2019-03",
        },
        {
          name: "Basic Life Support (BLS) for Healthcare Providers",
          issuer: "American Heart Association",
          date: "2025-06",
        },
      ],
    },
    template: "meridian",
    sections: [
      {
        heading: "Write for both halves of the job",
        body: [
          "Almost every medical assistant posting describes a hybrid role, and almost every MA resume describes half of one. Candidates who came up through the clinic write only about draws and rooming; candidates who came through the front desk write only about scheduling and insurance. Both leave the reader guessing about the other half.",
          "The practice is hiring one person to do both, and the ones who can are worth more. Give clinical work the majority of the space if the posting is clinical, but make the administrative competence visible — prior authorisations, referrals, insurance verification, scheduling volume. Those are the tasks that consume a practice manager's week, and an MA who handles them without supervision is a genuine relief.",
        ],
      },
      {
        heading: "Name the certification and the certifying body",
        body: [
          "\"Certified Medical Assistant\" without the body behind it is ambiguous, because several organisations certify medical assistants and employers do distinguish between them. CMA is issued by the AAMA and requires an accredited programme; RMA comes from AMT; CCMA and CMAA come from the NHA; NCMA from the NCCT. Some job postings specify one.",
          "So write it in full: credential, issuing organisation, and the date it runs through. If you are certification-eligible but have not sat the exam, say so with a date rather than leaving it out — a practice will often hire on that basis and cannot if they do not know.",
          "Add phlebotomy, EKG or radiology credentials separately. They expand what you can be scheduled for, and in a small practice that is the difference between hiring you and hiring two people.",
        ],
      },
      {
        heading: "Specificity about scope",
        body: [
          "Medical assistant scope varies by state and by practice, so listing the procedures you actually perform is more useful here than in almost any other role. A practice needs to know whether you can draw blood, run an EKG, administer injections under standing orders, place an IV, assist with minor procedures, or handle sterile instrument prep — and the answer differs from candidate to candidate.",
          "List them plainly, and be accurate about the boundary. A medical assistant works under a provider's supervision and does not diagnose, assess or make clinical decisions. Writing \"assessed patients\" instead of \"collected history and documented chief complaint\" is a scope error that an experienced clinical manager reads as a warning.",
          "Volume gives the list credibility. \"Venipuncture\" is a claim; \"venipuncture on roughly 15 patients daily including pediatric draws\" tells a reader you do it constantly and are comfortable with the hard version.",
        ],
        list: [
          "Rooming, vitals, medication reconciliation and history intake",
          "Venipuncture, capillary draw, specimen collection and processing",
          "Injections, immunisations, and whether you work under standing orders",
          "EKG, spirometry, vision and hearing screening",
          "Sterile technique, instrument prep, assisting with minor procedures",
          "Autoclave operation, vaccine storage logs, inventory",
        ],
      },
      {
        heading: "The EMR is a hiring criterion",
        body: [
          "Name it, every time. A practice running Epic, athenahealth, eClinicalWorks, NextGen or Cerner is looking for someone who has used theirs, because onboarding an MA onto an unfamiliar system costs weeks of reduced throughput. Candidates routinely leave this off and it is one of the highest-value words on the page.",
          "If you have used several, list them all — that is itself a signal that you adapt quickly. If you were a superuser, a trainer or involved in a migration, say so prominently. Those are the MAs who get promoted into lead roles, and a practice manager reading a resume is often screening for exactly that potential.",
        ],
      },
      {
        heading: "Specialty and language",
        body: [
          "Outpatient medicine is more specialised than it looks from outside, and experience in the same specialty is worth a great deal. Dermatology, orthopedics, cardiology, OB/GYN, pediatrics and family medicine all have different rhythms, procedures and documentation patterns. Name yours, and if you are moving between them, name the transferable procedures explicitly.",
          "Bilingual ability is one of the few things on a medical assistant resume that can be decisive on its own, particularly in Spanish, Mandarin, Vietnamese, Tagalog and Arabic depending on the patient population. State the language and be honest about the level — a practice will use you for consent and discharge instructions, and conversational is not the same as medical fluency.",
        ],
      },
    ],
    keywords: [
      {
        group: "Certifications",
        terms: [
          "Certified Medical Assistant",
          "CMA",
          "AAMA",
          "RMA",
          "AMT",
          "CCMA",
          "NHA",
          "NCMA",
          "Certified Phlebotomy Technician",
          "BLS",
          "CPR certified",
        ],
      },
      {
        group: "Clinical procedures",
        terms: [
          "Patient rooming",
          "Vital signs",
          "Venipuncture",
          "Phlebotomy",
          "Capillary draw",
          "Injections",
          "Immunisations",
          "EKG",
          "Spirometry",
          "Specimen collection",
          "Sterile technique",
          "Autoclave",
          "Medication reconciliation",
          "Wound care",
        ],
      },
      {
        group: "Administrative",
        terms: [
          "Prior authorisation",
          "Referrals",
          "Insurance verification",
          "Eligibility",
          "Scheduling",
          "Copay collection",
          "ICD-10",
          "CPT coding",
          "Medical records",
          "Patient intake",
        ],
      },
      {
        group: "Systems and compliance",
        terms: [
          "Epic",
          "athenahealth",
          "eClinicalWorks",
          "NextGen",
          "Cerner",
          "Allscripts",
          "EMR",
          "EHR",
          "HIPAA",
          "OSHA",
          "CLIA-waived testing",
        ],
      },
    ],
    mistakes: [
      "Writing only the clinical half or only the administrative half of a job that is advertised as both",
      "\"Certified Medical Assistant\" with no certifying body — CMA, RMA and CCMA come from different organisations and postings sometimes specify one",
      "Omitting the EMR, which is among the highest-value words on the page for an outpatient practice",
      "\"Assessed patients\" instead of \"collected history and documented chief complaint\" — a scope error a clinical manager reads as a warning",
      "No patient volume anywhere, so a reader cannot tell whether you have worked at clinic pace",
      "Listing procedures without saying how often you perform them, which makes the list read as coursework",
      "Leaving off a second language, which in many patient populations is the single most decisive item available",
      "Not naming the specialty, when outpatient specialties differ enough that same-specialty experience is a real advantage",
    ],
    faqs: [
      {
        question: "What should a medical assistant put on a resume?",
        answer:
          "Your certification with the issuing body and expiry, the specific clinical procedures you perform and how often, the EMR by name, patient volume per day, your specialty, and the administrative work you handle — prior authorisations, referrals, insurance verification and scheduling. Practices hire for both halves of the role.",
      },
      {
        question: "Which medical assistant certification should I list?",
        answer:
          "Whichever you hold, with the certifying organisation named: CMA from the AAMA, RMA from AMT, CCMA or CMAA from the NHA, NCMA from the NCCT. Employers distinguish between them and some postings specify one, so \"Certified Medical Assistant\" on its own leaves a question open.",
      },
      {
        question: "How do I write a medical assistant resume with no experience?",
        answer:
          "Treat your externship as a job — name the practice type, the patient volume, the procedures you performed and the EMR you trained on. List your certification or exam date, and include any customer-facing or administrative work, since half of this role is front-office competence. One page.",
      },
      {
        question: "Should I list the EMR I have used?",
        answer:
          "Always. Onboarding a medical assistant onto an unfamiliar system costs a practice weeks of reduced throughput, so Epic, athenahealth, eClinicalWorks, NextGen or Cerner experience is screened for directly. Superuser or migration experience is worth calling out separately.",
      },
      {
        question: "Is medical assistant experience in a different specialty transferable?",
        answer:
          "Largely, and it is worth making the case explicitly. Name the procedures that carry over — draws, EKG, rooming, injections, prior authorisations — rather than assuming a reader will infer it. Same-specialty candidates have an advantage, so the transferable list is what closes the gap.",
      },
      {
        question: "How long should a medical assistant resume be?",
        answer:
          "One page in almost every case, and two only past roughly a decade with several specialties behind you. Use a single-column layout so your certifications and procedure list survive parsing intact.",
      },
    ],
    related: ["certified-nursing-assistant", "registered-nurse", "administrative-assistant"],
    guides: ["certifications-on-resume", "resume-skills", "ats-resume-keywords"],
  },
];
