// The language the *resume* is written in — not the language of the app's own
// UI. It decides the default section headings, how dates read, what the
// proficiency scales are called, which direction the page runs, and what the
// writing assistant drafts in.

import type { SectionType, TagGroupType } from "./types";

export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "nl"
  | "ru"
  | "zh"
  | "ar";

/** Which writing system a language needs, which is what decides whether the
 *  PDF can be typeset with the default fonts. */
export type Script = "latin" | "cyrillic" | "cjk" | "arabic";

export interface LanguageMeta {
  code: LanguageCode;
  /** The language's own name for itself — what the picker shows. */
  label: string;
  /** English name, for tooltips and the assistant's prompt. */
  english: string;
  /** Flag emoji for the picker. A language isn't a country, so these are the
   *  conventional stand-ins rather than a claim about where it's spoken. */
  flag: string;
  /** BCP 47 tag used for month names. */
  locale: string;
  dir: "ltr" | "rtl";
  script: Script;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English", english: "English", flag: "🇬🇧", locale: "en-US", dir: "ltr", script: "latin" },
  { code: "es", label: "Español", english: "Spanish", flag: "🇪🇸", locale: "es-ES", dir: "ltr", script: "latin" },
  { code: "fr", label: "Français", english: "French", flag: "🇫🇷", locale: "fr-FR", dir: "ltr", script: "latin" },
  { code: "de", label: "Deutsch", english: "German", flag: "🇩🇪", locale: "de-DE", dir: "ltr", script: "latin" },
  { code: "pt", label: "Português", english: "Portuguese", flag: "🇧🇷", locale: "pt-BR", dir: "ltr", script: "latin" },
  { code: "it", label: "Italiano", english: "Italian", flag: "🇮🇹", locale: "it-IT", dir: "ltr", script: "latin" },
  { code: "nl", label: "Nederlands", english: "Dutch", flag: "🇳🇱", locale: "nl-NL", dir: "ltr", script: "latin" },
  { code: "ru", label: "Русский", english: "Russian", flag: "🇷🇺", locale: "ru-RU", dir: "ltr", script: "cyrillic" },
  { code: "zh", label: "中文", english: "Chinese (Simplified)", flag: "🇨🇳", locale: "zh-CN", dir: "ltr", script: "cjk" },
  { code: "ar", label: "العربية", english: "Arabic", flag: "🇸🇦", locale: "ar", dir: "rtl", script: "arabic" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));

/** Tolerates a missing or unrecognised code — resumes saved before languages
 *  existed have none, and they are English. */
export function language(code?: string): LanguageMeta {
  return BY_CODE.get((code ?? "") as LanguageCode) ?? BY_CODE.get(DEFAULT_LANGUAGE)!;
}

export const isRtl = (code?: string) => language(code).dir === "rtl";

// ------------------------------------------------------------ section titles

/** The heading each new section is created with, per language. Users can
 *  rename any of them; these are only the starting point. */
export const SECTION_TITLES: Record<LanguageCode, Record<SectionType, string>> = {
  en: {
    summary: "Summary",
    experience: "Professional Experience",
    projects: "Projects",
    volunteering: "Volunteering",
    education: "Education",
    certifications: "Certifications",
    awards: "Awards",
    skills: "Skills",
    languages: "Languages",
    interests: "Interests",
  },
  es: {
    summary: "Perfil",
    experience: "Experiencia Profesional",
    projects: "Proyectos",
    volunteering: "Voluntariado",
    education: "Formación Académica",
    certifications: "Certificaciones",
    awards: "Premios",
    skills: "Habilidades",
    languages: "Idiomas",
    interests: "Intereses",
  },
  fr: {
    summary: "Profil",
    experience: "Expérience Professionnelle",
    projects: "Projets",
    volunteering: "Bénévolat",
    education: "Formation",
    certifications: "Certifications",
    awards: "Distinctions",
    skills: "Compétences",
    languages: "Langues",
    interests: "Centres d'intérêt",
  },
  de: {
    summary: "Profil",
    experience: "Berufserfahrung",
    projects: "Projekte",
    volunteering: "Ehrenamt",
    education: "Ausbildung",
    certifications: "Zertifikate",
    awards: "Auszeichnungen",
    skills: "Kenntnisse",
    languages: "Sprachen",
    interests: "Interessen",
  },
  pt: {
    summary: "Perfil",
    experience: "Experiência Profissional",
    projects: "Projetos",
    volunteering: "Trabalho Voluntário",
    education: "Formação Acadêmica",
    certifications: "Certificações",
    awards: "Prêmios",
    skills: "Habilidades",
    languages: "Idiomas",
    interests: "Interesses",
  },
  it: {
    summary: "Profilo",
    experience: "Esperienza Professionale",
    projects: "Progetti",
    volunteering: "Volontariato",
    education: "Istruzione",
    certifications: "Certificazioni",
    awards: "Riconoscimenti",
    skills: "Competenze",
    languages: "Lingue",
    interests: "Interessi",
  },
  nl: {
    summary: "Profiel",
    experience: "Werkervaring",
    projects: "Projecten",
    volunteering: "Vrijwilligerswerk",
    education: "Opleiding",
    certifications: "Certificeringen",
    awards: "Onderscheidingen",
    skills: "Vaardigheden",
    languages: "Talen",
    interests: "Interesses",
  },
  ru: {
    summary: "Профиль",
    experience: "Опыт работы",
    projects: "Проекты",
    volunteering: "Волонтёрство",
    education: "Образование",
    certifications: "Сертификаты",
    awards: "Награды",
    skills: "Навыки",
    languages: "Языки",
    interests: "Интересы",
  },
  zh: {
    summary: "个人简介",
    experience: "工作经历",
    projects: "项目经历",
    volunteering: "志愿服务",
    education: "教育背景",
    certifications: "证书",
    awards: "荣誉奖项",
    skills: "专业技能",
    languages: "语言能力",
    interests: "兴趣爱好",
  },
  ar: {
    summary: "نبذة",
    experience: "الخبرة المهنية",
    projects: "المشاريع",
    volunteering: "العمل التطوعي",
    education: "التعليم",
    certifications: "الشهادات",
    awards: "الجوائز",
    skills: "المهارات",
    languages: "اللغات",
    interests: "الاهتمامات",
  },
};

/** True when `title` is the stock heading for `type` in any language — which
 *  is how a language switch knows what it may rename and what the user chose
 *  for themselves. */
export function isDefaultTitle(type: SectionType, title: string): boolean {
  const t = title.trim();
  return LANGUAGES.some((l) => SECTION_TITLES[l.code][type] === t);
}

// -------------------------------------------------------------------- dates

/** What an ongoing role's end date reads as. */
const PRESENT: Record<LanguageCode, string> = {
  en: "Present",
  es: "Actualidad",
  fr: "Aujourd'hui",
  de: "Heute",
  pt: "Atual",
  it: "Presente",
  nl: "Heden",
  ru: "настоящее время",
  zh: "至今",
  ar: "حتى الآن",
};

export const presentLabel = (code?: string) => PRESENT[language(code).code];

const monthCache = new Map<string, string[]>();

/** Month names for a language, from the platform's own locale data rather
 *  than a table we'd have to maintain. */
export function monthNames(code?: string, long = false): string[] {
  const { locale } = language(code);
  const key = `${locale}:${long ? "long" : "short"}`;
  const cached = monthCache.get(key);
  if (cached) return cached;

  const format = new Intl.DateTimeFormat(locale, {
    month: long ? "long" : "short",
    timeZone: "UTC",
  });
  const names = Array.from({ length: 12 }, (_, i) =>
    format.format(new Date(Date.UTC(2000, i, 1))),
  );
  monthCache.set(key, names);
  return names;
}

// ------------------------------------------------------------------- levels

/** The proficiency scales, weakest first. An empty scale means the section
 *  doesn't do levels — interests never do. */
const LEVELS: Record<LanguageCode, Record<TagGroupType, string[]>> = {
  en: {
    skills: ["Beginner", "Intermediate", "Advanced", "Expert"],
    languages: ["Basic", "Conversational", "Fluent", "Native"],
    interests: [],
  },
  es: {
    skills: ["Principiante", "Intermedio", "Avanzado", "Experto"],
    languages: ["Básico", "Conversacional", "Fluido", "Nativo"],
    interests: [],
  },
  fr: {
    skills: ["Débutant", "Intermédiaire", "Avancé", "Expert"],
    languages: ["Notions", "Intermédiaire", "Courant", "Langue maternelle"],
    interests: [],
  },
  de: {
    skills: ["Grundkenntnisse", "Fortgeschritten", "Sehr gut", "Experte"],
    languages: [
      "Grundkenntnisse",
      "Konversationssicher",
      "Fließend",
      "Muttersprache",
    ],
    interests: [],
  },
  pt: {
    skills: ["Iniciante", "Intermediário", "Avançado", "Especialista"],
    languages: ["Básico", "Conversação", "Fluente", "Nativo"],
    interests: [],
  },
  it: {
    skills: ["Base", "Intermedio", "Avanzato", "Esperto"],
    languages: ["Base", "Conversazione", "Fluente", "Madrelingua"],
    interests: [],
  },
  nl: {
    skills: ["Beginner", "Gemiddeld", "Gevorderd", "Expert"],
    languages: ["Basis", "Conversatie", "Vloeiend", "Moedertaal"],
    interests: [],
  },
  ru: {
    skills: ["Начальный", "Средний", "Продвинутый", "Эксперт"],
    languages: ["Базовый", "Разговорный", "Свободный", "Родной"],
    interests: [],
  },
  zh: {
    skills: ["入门", "中级", "高级", "精通"],
    languages: ["入门", "日常交流", "流利", "母语"],
    interests: [],
  },
  ar: {
    skills: ["مبتدئ", "متوسط", "متقدم", "خبير"],
    languages: ["مبتدئ", "محادثة", "طليق", "لغة أم"],
    interests: [],
  },
};

export function skillLevels(type: TagGroupType, code?: string): string[] {
  return LEVELS[language(code).code][type];
}

/** The label for a stored level, or "" when the section has no scale, the
 *  level is unset, or it falls outside the scale. */
export function levelLabel(
  type: TagGroupType,
  level: number | undefined,
  code?: string,
): string {
  if (!level) return "";
  return skillLevels(type, code)[level - 1] ?? "";
}
