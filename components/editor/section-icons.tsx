// One glyph per section type, shared by the Add-content modal, the section
// cards and the mobile setup flow, so a section is recognisable by the same
// mark everywhere.
//
// These come from the app's own set in public/svgs rather than the general
// icon library — a section is the thing you look for while scanning the
// editor, and these are drawn for it.

import {
  ArticleIcon,
  AwardIcon,
  BrainIcon,
  BriefcaseIcon,
  CapIcon,
  CertificateIcon,
  CommunityIcon,
  GlobeIcon,
  GuitarIcon,
  PuzzleIcon,
} from "@/components/ui/svg-icons";
import type { SectionType } from "@/lib/types";

type IconComponent = (
  props: React.SVGProps<SVGSVGElement>,
) => React.ReactElement;

export const SECTION_ICONS: Record<SectionType, IconComponent> = {
  summary: ArticleIcon,
  experience: BriefcaseIcon,
  projects: PuzzleIcon,
  volunteering: CommunityIcon,
  education: CapIcon,
  certifications: CertificateIcon,
  awards: AwardIcon,
  skills: BrainIcon,
  languages: GlobeIcon,
  interests: GuitarIcon,
};

/** Not a section, but it heads the same list. */
export { IdCardIcon as PersonalIcon } from "@/components/ui/svg-icons";
