// Small formatting helpers shared by the preview.

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Turn a native month-input value ("2021-05") into "May 2021". Falls back to
 *  whatever string was passed if it isn't in that shape. */
export function formatMonth(value: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const month = MONTHS[monthIndex];
  return month ? `${month} ${year}` : value;
}

/** Compose a "Start – End" range for an entry. */
export function formatRange(
  start: string,
  end: string,
  current?: boolean,
): string {
  const from = formatMonth(start);
  const to = current ? "Present" : formatMonth(end);
  if (from && to) return `${from} – ${to}`;
  return from || to || "";
}
