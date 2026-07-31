// The document the landing page shows off. It's real ResumeData, rendered by
// the same <ResumePreview> the editor and the PDF export use — so the hero and
// the template strip can never drift from what the product actually produces.
//
// Ids are hard-coded rather than generated: this renders on the server, and a
// random id would differ between the server and client trees.

import type { ResumeData } from "@/lib/types";
import { avatarUrl } from "@/lib/avatar";
import { personFor } from "@/lib/content/sample-people";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { TemplateId } from "@/lib/types";
import { getTemplate } from "@/lib/templates";

export const SAMPLE_RESUME: ResumeData = {
  personal: {
    fullName: "Amara Diaz",
    title: "Senior Product Designer",
    email: "amara.diaz@email.com",
    phone: "+1 (415) 555-0134",
    location: "San Francisco, CA",
    // The sample person has a photo of her own, the same as any resume that
    // uses a photo template would. The renderer never supplies one.
    photo: avatarUrl("Amara Diaz"),
    contactOrder: ["email", "phone", "location"],
    links: [
      { id: "l1", label: "LinkedIn", url: "linkedin.com/in/amaradiaz" },
      { id: "l2", label: "Portfolio", url: "amara.design" },
    ],
  },
  sections: [
    {
      id: "s1",
      type: "summary",
      title: "Summary",
      content:
        "Product designer with 8 years shipping data-heavy tools for small teams. I work close to engineering, prototype in code, and care most about the boring flows nobody screenshots.",
    },
    {
      id: "s2",
      type: "experience",
      title: "Experience",
      items: [
        {
          id: "e1",
          role: "Senior Product Designer",
          company: "Northwind",
          location: "San Francisco, CA",
          startDate: "2022-03",
          endDate: "",
          current: true,
          highlights:
            "- Led the redesign of the reporting suite, cutting time-to-first-report from **11 minutes to under 2**\n- Built and maintained the design system now used by 4 product teams\n- Ran the research programme that reshaped the 2024 roadmap",
        },
        {
          id: "e2",
          role: "Product Designer",
          company: "Lumen Labs",
          location: "Remote",
          startDate: "2019-01",
          endDate: "2022-02",
          current: false,
          highlights:
            "- Owned onboarding end to end; activation rose from **34% to 58%**\n- Shipped the mobile app's first accessible colour system\n- Ran the weekly design critique that became the team's review standard",
        },
        {
          id: "e3",
          role: "Junior Designer",
          company: "Foundry Studio",
          location: "Portland, OR",
          startDate: "2018-06",
          endDate: "2018-12",
          current: false,
          highlights:
            "- Designed marketing sites for eight early-stage clients\n- Built the studio's first shared component library in Figma",
        },
      ],
    },
    {
      id: "s3",
      type: "education",
      title: "Education",
      items: [
        {
          id: "ed1",
          degree: "BA, Interaction Design",
          school: "Rhode Island School of Design",
          location: "Providence, RI",
          startDate: "2014-09",
          endDate: "2018-05",
          description: "",
        },
        {
          id: "ed2",
          degree: "Certificate, Human-Computer Interaction",
          school: "University of California, San Diego",
          location: "Remote",
          startDate: "2020-02",
          endDate: "2020-08",
          description: "",
        },
      ],
    },
    {
      id: "s4",
      type: "skills",
      title: "Skills",
      items: [
        { id: "k1", name: "Design systems", level: 4 },
        { id: "k2", name: "Prototyping", level: 4 },
        { id: "k3", name: "User research", level: 3 },
        { id: "k4", name: "Figma", level: 4 },
        { id: "k5", name: "HTML & CSS", level: 3 },
        { id: "k6", name: "Accessibility", level: 3 },
        { id: "k7", name: "Design tokens", level: 3 },
        { id: "k8", name: "Usability testing", level: 3 },
      ],
    },
    {
      id: "s5",
      type: "languages",
      title: "Languages",
      items: [
        { id: "g1", name: "English", level: 4 },
        { id: "g2", name: "Spanish", level: 3 },
        { id: "g3", name: "Portuguese", level: 2 },
      ],
    },
    {
      id: "s6",
      type: "certifications",
      title: "Certificates",
      items: [
        {
          id: "c1",
          degree: "Nielsen Norman UX Certification",
          school: "NN/g",
          location: "",
          startDate: "2023-04",
          endDate: "2023-04",
          description: "",
        },
        {
          id: "c2",
          degree: "IAAP Accessibility Core Competencies",
          school: "IAAP",
          location: "",
          startDate: "2022-09",
          endDate: "2022-09",
          description: "",
        },
      ],
    },
  ],
  settings: { ...DEFAULT_SETTINGS },
};

/** Applies a template's look to a document without touching its content. */
function withTemplate(data: ResumeData, id: TemplateId): ResumeData {
  const template = getTemplate(id);
  return {
    ...data,
    settings: {
      ...data.settings,
      template: id,
      fontFamily: template.presets.fontFamily,
      headingStyle: template.presets.headingStyle,
      // Each template was designed around an accent; without this they'd all
      // render in the default blue and half of them would lose their identity.
      accent: template.accent ?? data.settings.accent,
    },
  };
}

/**
 * Amara's document, laid out with one of the templates.
 *
 * For the places whose whole point is that it is *the same document* — the
 * hero demo flicking between looks, where changing the person mid-take would
 * read as the page being replaced rather than restyled.
 */
export function sampleWithTemplate(id: TemplateId): ResumeData {
  return withTemplate(SAMPLE_RESUME, id);
}

/**
 * A template shown with whichever of the five sample people it was assigned.
 *
 * For the gallery and the detail pages, where thirty-two renders of one
 * document was a duplicate-content problem — see lib/content/sample-people.ts.
 */
export function sampleForTemplate(id: TemplateId): ResumeData {
  return withTemplate(personFor(id), id);
}
