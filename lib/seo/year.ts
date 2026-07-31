// Titles carry the year — "(2026)" — because it measurably helps a listing
// that competes on freshness. Typed into the content it becomes a liability
// instead: every one of those titles is still advertising last year in
// January, which says the page is stale more loudly than the year said it was
// current.
//
// Content writes the token `{year}` and this fills it in. Evaluated at build
// time, so a redeploy rolls it over — these pages are static and rebuilt often
// enough that making them dynamic to gain a few hours of accuracy would be the
// wrong trade.

export const CURRENT_YEAR = new Date().getUTCFullYear();

/** Replaces every `{year}` in a title or description with the current year. */
export const withYear = (text: string): string =>
  text.replace(/\{year\}/g, String(CURRENT_YEAR));
