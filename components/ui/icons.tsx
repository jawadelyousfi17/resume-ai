// The app's icon set, backed by Lucide — the same pack the design system is
// drawn with, so an icon in a panel and one in the reference agree.
//
// Every icon is exported as a plain component taking the same props as an
// <svg>, so call sites keep sizing with Tailwind (`className="h-4 w-4"`) —
// those classes win over the width/height attributes Lucide renders. The
// names are the app's own, not Lucide's: a call site asks for "the delete
// icon", and which glyph that is gets decided here, once.

import {
  Award,
  BadgeCheck,
  Bold,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Brush,
  Building2,
  CalendarCheck,
  CalendarOff,
  Camera,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Copy,
  Cpu,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  FilePen,
  FileText,
  FileType,
  FileUser,
  Folder,
  Globe,
  GraduationCap,
  GripVertical,
  Guitar,
  IdCard,
  Image,
  Italic,
  Languages,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  LibraryBig,
  Lightbulb,
  Link,
  List,
  ListOrdered,
  LogOut,
  Mail,
  MapPin,
  Minus,
  Network,
  Newspaper,
  NotepadText,
  Palette,
  PanelLeft,
  Pencil,
  PencilLine,
  Phone,
  Plus,
  Puzzle,
  Rocket,
  ScrollText,
  Search,
  Signature,
  Sparkles,
  SquareKanban,
  SquarePen,
  Tag,
  Target,
  TextAlignStart,
  Trash2,
  Upload,
  User,
  Users,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";

type IconProps = React.SVGProps<SVGSVGElement>;

/** The design system's line weight — lighter than Lucide's default 2, which
 *  reads heavy beside 13–15px interface text. A call site can still pass its
 *  own `strokeWidth` for a tick that has to hold up at 12px. */
const STROKE = 1.75;

/** Wraps a Lucide glyph so it behaves like the inline SVGs it replaced:
 *  decorative unless labelled, sized by className, coloured by text colour. */
export const icon = (Glyph: LucideIcon) => {
  const Icon = ({ strokeWidth, ...props }: IconProps) => (
    <Glyph
      aria-hidden
      focusable="false"
      // The old sets drew at 20px when nothing asked otherwise; a className
      // size still wins over these attributes.
      size={20}
      strokeWidth={strokeWidth ?? STROKE}
      {...(props as React.ComponentProps<LucideIcon>)}
    />
  );
  Icon.displayName = `Icon(${Glyph.displayName ?? "Lucide"})`;
  return Icon;
};

export const PlusIcon = icon(Plus);
export const MinusIcon = icon(Minus);
export const TrashIcon = icon(Trash2);
export const ChevronDownIcon = icon(ChevronDown);
export const DownloadIcon = icon(Download);
export const GridIcon = icon(LayoutGrid);
export const FileTextIcon = icon(FileText);
export const WandIcon = icon(WandSparkles);
export const SparklesIcon = icon(Sparkles);
export const BulbIcon = icon(Lightbulb);
export const CameraIcon = icon(Camera);
export const CheckIcon = icon(Check);
export const XIcon = icon(X);
export const DotsIcon = icon(Ellipsis);
export const DragIcon = icon(GripVertical);
export const ChevronUpDownIcon = icon(ChevronsUpDown);
export const UserIcon = icon(User);
export const RocketIcon = icon(Rocket);
export const BriefcaseIcon = icon(BriefcaseBusiness);
export const CapIcon = icon(GraduationCap);
export const StackIcon = icon(Layers);
export const AlignIcon = icon(TextAlignStart);
export const MailIcon = icon(Mail);
export const TagIcon = icon(Tag);
export const AwardIcon = icon(Award);
export const EyeIcon = icon(Eye);
export const EyeOffIcon = icon(EyeOff);
export const PencilIcon = icon(PencilLine);
export const CalendarIcon = icon(CalendarCheck);
export const CalendarOffIcon = icon(CalendarOff);
export const BoldIcon = icon(Bold);
export const ItalicIcon = icon(Italic);
export const BulletListIcon = icon(List);
export const NumberListIcon = icon(ListOrdered);
export const TranslateIcon = icon(Languages);
export const CopyIcon = icon(Copy);
/** Sharing: the link a resume is handed round on. */
export const LinkIcon = icon(Link);
/** A link that leaves this page — the shared resume, opened as a visitor
 *  sees it. */
export const ExternalLinkIcon = icon(ExternalLink);
export const SearchIcon = icon(Search);
export const LogoutIcon = icon(LogOut);
/** The editor's AI tab. */
export const ChipIcon = icon(Cpu);
/** The editor's tailoring tab. */
export const TargetIcon = icon(Target);

// The template filter row: one glyph per cut of the catalogue.
export const BookIcon = icon(BookOpen);
export const BuildingIcon = icon(Building2);
export const DocFileIcon = icon(FileType);
export const GoogleDocIcon = icon(NotepadText);
export const ImageIcon = icon(Image);
export const LayoutIcon = icon(LayoutTemplate);
export const BrushIcon = icon(Brush);
export const SidebarIcon = icon(PanelLeft);

// Section and field glyphs — what used to be the hand-drawn set in
// svg-icons.tsx, which now re-exports these.
export const DocumentIcon = icon(FileText);
export const DesignIcon = icon(Palette);
export const MagicIcon = icon(WandSparkles);
export const EditSquareIcon = icon(SquarePen);
export const PhoneIcon = icon(Phone);
export const LocationIcon = icon(MapPin);
export const IdCardIcon = icon(IdCard);
export const PenIcon = icon(Pencil);
export const CloseIcon = icon(X);
export const UploadIcon = icon(Upload);
export const BrainIcon = icon(Brain);
export const GlobeIcon = icon(Globe);
export const CertificateIcon = icon(BadgeCheck);
export const GuitarIcon = icon(Guitar);
export const FolderIcon = icon(Folder);
export const BooksIcon = icon(LibraryBig);
export const CommunityIcon = icon(Users);
export const ArticleIcon = icon(Newspaper);
export const NetworkIcon = icon(Network);
export const PuzzleIcon = icon(Puzzle);
export const LetterIcon = icon(ScrollText);
export const SignatureIcon = icon(Signature);

// The dashboard's places, one glyph each: a resume is a page with a person on
// it, a letter is a page being written, the tracker is a board of columns.
export const ResumesIcon = icon(FileUser);
export const LettersIcon = icon(FilePen);
export const TrackerIcon = icon(SquareKanban);
