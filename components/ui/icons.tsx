// The app's icon set, backed by HugeIcons Free.
//
// Every icon is exported as a plain component taking the same props as an
// <svg>, so call sites keep sizing with Tailwind (`className="h-4 w-4"`) —
// those classes win over the width/height attributes HugeIcons renders.

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  AiChipIcon,
  ArrowDown01Icon,
  Award01Icon,
  Book01Icon,
  Briefcase01Icon,
  Building01Icon,
  File02Icon,
  GoogleDocIcon as HugeGoogleDocIcon,
  Image01Icon,
  Layout01Icon,
  PaintBrush02Icon,
  SidebarLeftIcon,
  CalendarBlock01Icon,
  CalendarCheckIn01Icon,
  Camera01Icon,
  Cancel01Icon,
  Copy01Icon,
  Delete02Icon,
  Logout02Icon,
  ViewIcon,
  ViewOffSlashIcon,
  Download04Icon,
  DragDropVerticalIcon,
  File01Icon,
  GridViewIcon,
  Idea01Icon,
  Layers01Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  MagicWand01Icon,
  Link01Icon,
  LinkSquare02Icon,
  Mail01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  Mortarboard02Icon,
  PencilEdit02Icon,
  Rocket01Icon,
  Search01Icon,
  SparklesIcon as HugeSparklesIcon,
  Tag01Icon,
  Target02Icon,
  TextAlignLeftIcon,
  TextBoldIcon,
  TranslateIcon as HugeTranslateIcon,
  TextItalicIcon,
  Tick02Icon,
  UnfoldMoreIcon,
  UserIcon as HugeUserIcon,
} from "@hugeicons/core-free-icons";

type IconProps = React.SVGProps<SVGSVGElement>;

/** Wraps a HugeIcons glyph so it behaves like the inline SVGs it replaced. */
const icon = (glyph: IconSvgElement) => {
  const Icon = ({ strokeWidth, ...props }: IconProps) => (
    <HugeiconsIcon
      icon={glyph}
      size={20}
      color="currentColor"
      strokeWidth={typeof strokeWidth === "number" ? strokeWidth : 2}
      {...props}
    />
  );
  Icon.displayName = "HugeIcon";
  return Icon;
};

export const PlusIcon = icon(Add01Icon);
export const MinusIcon = icon(MinusSignIcon);
export const TrashIcon = icon(Delete02Icon);
export const ChevronDownIcon = icon(ArrowDown01Icon);
export const DownloadIcon = icon(Download04Icon);
export const GridIcon = icon(GridViewIcon);
export const FileTextIcon = icon(File01Icon);
export const WandIcon = icon(MagicWand01Icon);
export const SparklesIcon = icon(HugeSparklesIcon);
export const BulbIcon = icon(Idea01Icon);
export const CameraIcon = icon(Camera01Icon);
export const CheckIcon = icon(Tick02Icon);
export const XIcon = icon(Cancel01Icon);
export const DotsIcon = icon(MoreHorizontalIcon);
export const DragIcon = icon(DragDropVerticalIcon);
export const ChevronUpDownIcon = icon(UnfoldMoreIcon);
export const UserIcon = icon(HugeUserIcon);
export const RocketIcon = icon(Rocket01Icon);
export const BriefcaseIcon = icon(Briefcase01Icon);
export const CapIcon = icon(Mortarboard02Icon);
export const StackIcon = icon(Layers01Icon);
export const AlignIcon = icon(TextAlignLeftIcon);
export const MailIcon = icon(Mail01Icon);
export const TagIcon = icon(Tag01Icon);
export const AwardIcon = icon(Award01Icon);
export const EyeIcon = icon(ViewIcon);
export const EyeOffIcon = icon(ViewOffSlashIcon);
export const PencilIcon = icon(PencilEdit02Icon);
export const CalendarIcon = icon(CalendarCheckIn01Icon);
export const CalendarOffIcon = icon(CalendarBlock01Icon);
export const BoldIcon = icon(TextBoldIcon);
export const ItalicIcon = icon(TextItalicIcon);
export const BulletListIcon = icon(LeftToRightListBulletIcon);
export const NumberListIcon = icon(LeftToRightListNumberIcon);
export const TranslateIcon = icon(HugeTranslateIcon);
export const CopyIcon = icon(Copy01Icon);
/** Sharing: the link a resume is handed round on. */
export const LinkIcon = icon(Link01Icon);
/** A link that leaves this page — the shared resume, opened as a visitor
 *  sees it. */
export const ExternalLinkIcon = icon(LinkSquare02Icon);
export const SearchIcon = icon(Search01Icon);
export const LogoutIcon = icon(Logout02Icon);
/** The editor's AI tab. */
export const ChipIcon = icon(AiChipIcon);
/** The editor's tailoring tab. */
export const TargetIcon = icon(Target02Icon);

// The template filter row: one glyph per cut of the catalogue.
export const BookIcon = icon(Book01Icon);
export const BuildingIcon = icon(Building01Icon);
export const DocFileIcon = icon(File02Icon);
export const GoogleDocIcon = icon(HugeGoogleDocIcon);
export const ImageIcon = icon(Image01Icon);
export const LayoutIcon = icon(Layout01Icon);
export const BrushIcon = icon(PaintBrush02Icon);
export const SidebarIcon = icon(SidebarLeftIcon);
