// Small formatting helpers shared by the preview, the forms and the PDF.

import { monthNames, presentLabel } from "./i18n";
import type { DateFormat } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Turn a native month-input value ("2021-05") into the resume's date style,
 *  in its language. Falls back to whatever string was passed if it isn't in
 *  that shape. */
export function formatMonth(
  value: string,
  lang?: string,
  style: DateFormat = "short",
): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const year = match[1];
  const monthNumber = Number(match[2]);
  if (monthNumber < 1 || monthNumber > 12) return value;

  if (style === "numeric") return `${pad(monthNumber)}/${year}`;
  if (style === "iso") return `${year}-${pad(monthNumber)}`;

  const month = monthNames(lang, style === "long")[monthNumber - 1];
  return month ? `${month} ${year}` : value;
}

/** Compose a "Start – End" range for an entry. */
export function formatRange(
  start: string,
  end: string,
  current?: boolean,
  lang?: string,
  style: DateFormat = "short",
): string {
  const from = formatMonth(start, lang, style);
  const to = current ? presentLabel(lang) : formatMonth(end, lang, style);
  if (from && to) return `${from} – ${to}`;
  return from || to || "";
}
