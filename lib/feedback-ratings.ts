// The five answers, worst to best.
//
// A face is faster to answer than a question, and a number is easier to read a
// hundred of than a paragraph. The box underneath is where the paragraph goes
// for the people who have one.

export const RATINGS: readonly {
  value: number;
  emoji: string;
  label: string;
}[] = [
  { value: 1, emoji: "😞", label: "Bad" },
  { value: 2, emoji: "🙁", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Fine" },
  { value: 4, emoji: "😃", label: "Great" },
  { value: 5, emoji: "🤩", label: "Perfect" },
];

/** What the box asks for, which depends on how it went. Someone who's had a
 *  bad time is asked what broke; someone delighted is asked what to keep. */
export function promptFor(rating: number | null): string {
  if (rating === null) return "Anything you'd like to add? (optional)";
  if (rating <= 2) return "What got in your way? (optional, but it helps)";
  if (rating === 3) return "What would have made it better? (optional)";
  return "What's working? It tells us what not to break. (optional)";
}

export const isRating = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= RATINGS.length;
