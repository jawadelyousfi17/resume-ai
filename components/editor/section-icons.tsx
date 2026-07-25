// One glyph per section type, shared by the Add-content modal and the
// section cards so a section is recognisable by the same mark everywhere.

import {
  AlignIcon,
  AwardIcon,
  BriefcaseIcon,
  BulbIcon,
  CapIcon,
  FileTextIcon,
  RocketIcon,
  StackIcon,
  TagIcon,
  UserIcon,
} from "@/components/ui/icons";
import type { SectionType } from "@/lib/types";

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;

export const SECTION_ICONS: Record<SectionType, IconComponent> = {
  summary: FileTextIcon,
  experience: BriefcaseIcon,
  projects: RocketIcon,
  volunteering: UserIcon,
  education: CapIcon,
  certifications: TagIcon,
  awards: AwardIcon,
  skills: StackIcon,
  languages: AlignIcon,
  interests: BulbIcon,
};
