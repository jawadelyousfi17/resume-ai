// Turns the model's plain-text answer into something the editor can apply.
// The prompts ask for bare lines, but a stray bullet character or a wrapping
// quote is cheap to tolerate here and annoying to see in the document.

const LEADING_MARKER = /^\s*(?:[-*•·‣]|\d+[.)])\s+/;
const WRAPPING_QUOTES = /^["'“”'']+|["'“”'']+$/g;

/** Strips a bullet/number marker and wrapping quotes from one line. */
export function cleanLine(line: string): string {
  return line.replace(LEADING_MARKER, "").replace(WRAPPING_QUOTES, "").trim();
}

/** One item per non-empty line. */
export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);
}

/** A paragraph: collapse the soft wrapping the model may have added. */
export function cleanParagraph(text: string): string {
  return cleanLine(text.trim().replace(/\s*\n\s*/g, " "));
}
