// Matching a resume against a job posting.
//
// The score is computed here, in the browser, from the words in the two
// documents — no model call. That keeps it instant and free, and it means the
// number can be explained: it is the share of the posting's own vocabulary
// that the resume already uses, weighted by how often the posting repeats it.
//
// It is a keyword score, not a judgement of the candidate, and the UI says so.

import { markdownToText } from "./markdown";
import type { ResumeData } from "./types";

/** Words that carry no signal about a job. */
const STOP = new Set(
  `a about above after again against all also am an and any are as at be because been
   before being below between both but by can cannot could did do does doing down during
   each few for from further had has have having he her here hers him his how i if in into
   is it its itself just me more most my no nor not of off on once only or other our ours
   out over own same she should so some such than that the their theirs them then there
   these they this those through to too under until up very was we were what when where
   which while who whom why will with would you your yours role roles job jobs work working
   team teams company companies candidate candidates experience experiences year years
   including include includes required require requires requirements responsibilities
   ability able across strong excellent great good new must plus etc via our we you they
   looking seeking join help build built building using use used within well like`
    .split(/\s+/)
    .filter(Boolean),
);

/** Two-word phrases are worth more than the sum of their parts — "design
 *  system" is a skill, "design" and "system" are not. */
const PHRASE_WEIGHT = 1.7;
const WORD_WEIGHT = 1;

/** How many terms the score looks at. Beyond this it's noise. */
const TERMS = 28;

export interface MatchTerm {
  term: string;
  /** How much of the score this term is worth. */
  weight: number;
  found: boolean;
}

export interface MatchResult {
  /** 0–100. The share of the posting's vocabulary the resume already uses. */
  score: number;
  matched: MatchTerm[];
  missing: MatchTerm[];
  /** What the posting appears to be called, when the first line looks like a
   *  title rather than prose. */
  title: string | null;
}

const normalise = (value: string) =>
  value
    .toLowerCase()
    // Keep what lives inside a real skill (c++, node.js, f#) and split on the
    // rest — a hyphen is a space as far as matching goes, so
    // "time-to-first-report" and "time to first report" are the same words.
    .replace(/[^a-z0-9+.#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Plurals are the same word for this purpose: "sessions" is "session". */
const stem = (word: string) =>
  word.length > 3 && word.endsWith("s") && !word.endsWith("ss")
    ? word.slice(0, -1)
    : word;

const words = (value: string) =>
  normalise(value)
    .split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w))
    .map(stem);

/** The posting, cut at the punctuation people list things with — so two words
 *  either side of a comma never become a phrase. */
const segments = (value: string) =>
  value
    .split(/[.,;:•|\n()[\]]+/)
    .map((part) => words(part))
    .filter((part) => part.length > 0);

/** Everything on the resume the posting could plausibly match against. */
export function resumeText(data: ResumeData): string {
  const parts: string[] = [data.personal.title, data.personal.fullName];

  for (const section of data.sections) {
    parts.push(section.title);
    if (section.type === "summary") {
      parts.push(markdownToText(section.content));
      continue;
    }
    if (!("items" in section)) continue;

    for (const item of section.items) {
      if ("role" in item) {
        parts.push(item.role, item.company, markdownToText(item.highlights));
      } else if ("degree" in item) {
        parts.push(item.degree, item.school, item.description ?? "");
      } else {
        parts.push(item.name);
      }
    }
  }

  // Stemmed the same way the posting's words are, so the two sides compare.
  return words(parts.filter(Boolean).join(" ")).join(" ");
}

/** The posting's own vocabulary, most-repeated first. */
function terms(posting: string): { term: string; weight: number }[] {
  const counts = new Map<string, number>();

  for (const part of segments(posting)) {
    for (const word of part) {
      counts.set(word, (counts.get(word) ?? 0) + WORD_WEIGHT);
    }
    for (let i = 0; i < part.length - 1; i++) {
      const phrase = `${part[i]} ${part[i + 1]}`;
      counts.set(phrase, (counts.get(phrase) ?? 0) + PHRASE_WEIGHT);
    }
  }

  return [...counts]
    .map(([term, count]) => ({
      term,
      // Repetition matters, but the tenth mention says little the second
      // didn't — so weight grows with the root rather than the count.
      weight: Math.sqrt(count) * (term.includes(" ") ? PHRASE_WEIGHT : 1),
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, TERMS);
}

/** The first line, when it reads like a job title rather than a sentence. */
function titleOf(posting: string): string | null {
  const line = posting.trim().split("\n")[0]?.trim() ?? "";
  if (!line || line.length > 80 || line.split(" ").length > 10) return null;
  return line.replace(/[.;:]+$/, "");
}

export function matchResume(data: ResumeData, posting: string): MatchResult {
  const haystack = ` ${resumeText(data)} `;
  const scored = terms(posting).map<MatchTerm>(({ term, weight }) => ({
    term,
    weight,
    found: haystack.includes(` ${term} `),
  }));

  const total = scored.reduce((sum, t) => sum + t.weight, 0);
  const hit = scored.reduce((sum, t) => (t.found ? sum + t.weight : sum), 0);

  return {
    score: total === 0 ? 0 : Math.round((hit / total) * 100),
    matched: scored.filter((t) => t.found),
    missing: scored.filter((t) => !t.found),
    title: titleOf(posting),
  };
}

/** What the number means, in a sentence. */
export function verdict(score: number): { label: string; copy: string } {
  if (score >= 70) {
    return {
      label: "Strong match",
      copy: "Most of what this posting asks for is already on the page. Tailoring is about emphasis now, not substance.",
    };
  }
  if (score >= 45) {
    return {
      label: "Worth tailoring",
      copy: "The experience is there, but the posting's own words aren't. Rewording the summary and the top bullets would close most of that gap.",
    };
  }
  return {
    label: "Long shot",
    copy: "Little of this posting's vocabulary appears on the resume. Tailoring can help, but it can't add experience you haven't got.",
  };
}
