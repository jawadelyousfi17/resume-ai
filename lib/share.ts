import "server-only";

import { randomBytes } from "node:crypto";

import { prisma } from "./prisma";
import { DEFAULT_SETTINGS, migrateResumeData } from "./defaults";
import type { PageFormat, ResumeData, ShareLink } from "./types";

// Public links.
//
// Everything in lib/resumes.ts is scoped by `userId` — that module will not
// read a row without one. Sharing is the one read that can't be: whoever opens
// a link is usually not the person who made it, and often not signed in at
// all. So it lives here, on its own, where the exception is visible.
//
// What makes that safe is the slug. It is not the row id — the id is in the
// owner's own URLs, is a UUID, and would turn every editor link into a public
// one the moment sharing existed. It's a fresh random token, minted here and
// nowhere else, and a resume without one cannot be reached at all: the lookup
// below refuses a null slug rather than matching every private row with it.

/** Crockford's alphabet minus the vowels that make words. Case-insensitive to
 *  read out loud, and no `l`/`1` or `O`/`0` to mistype. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** 12 characters of a 31-letter alphabet — about 59 bits. Guessing one at a
 *  thousand tries a second takes longer than the universe has been running. */
const SLUG_LENGTH = 12;

/** How many times to try again if a minted slug is already taken. At 59 bits
 *  this never runs twice; it exists so that if it somehow did, the answer is a
 *  second draw rather than an error. */
const MINT_ATTEMPTS = 5;

function mintSlug(): string {
  // Rejection-free: 31 doesn't divide 256, so a plain modulo would favour the
  // first few letters. Drawing bytes until enough land under the cutoff keeps
  // every letter equally likely.
  const cutoff = 256 - (256 % ALPHABET.length);
  let slug = "";
  while (slug.length < SLUG_LENGTH) {
    for (const byte of randomBytes(SLUG_LENGTH)) {
      if (byte >= cutoff) continue;
      slug += ALPHABET[byte % ALPHABET.length];
      if (slug.length === SLUG_LENGTH) break;
    }
  }
  return slug;
}

/** Whether a string could be one of ours — checked before it reaches the
 *  database, so a crawler dragging junk through /r/ costs a query per URL
 *  shape rather than per URL. */
export function isShareSlug(value: string): boolean {
  return (
    value.length === SLUG_LENGTH &&
    [...value].every((char) => ALPHABET.includes(char))
  );
}

/** A resume as a visitor sees it: the document, and nothing about the account
 *  it belongs to. */
export interface SharedResume {
  name: string;
  format: PageFormat;
  data: ResumeData;
  sharedAt: number;
  updatedAt: number;
}

/** The resume behind a link, or null when the slug is unknown or the link has
 *  since been revoked. */
export async function getSharedResume(
  slug: string,
): Promise<SharedResume | null> {
  if (!isShareSlug(slug)) return null;

  const row = await prisma.resume.findUnique({ where: { shareSlug: slug } });
  if (!row?.sharedAt) return null;

  const stored = row.data as unknown as ResumeData;
  return {
    name: row.name,
    format: row.format,
    // The same repair a resume gets on the way to the editor — a link made
    // today can be opened after the document shape has moved on.
    data: migrateResumeData({
      ...stored,
      settings: { ...DEFAULT_SETTINGS, ...stored.settings },
    }),
    sharedAt: row.sharedAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

/**
 * Puts a resume behind a public link, or hands back the link it already has.
 *
 * Idempotent on purpose: pressing Share twice should not invalidate the URL
 * that was pasted into an email between the two presses. Revoking is how a
 * link is retired, and sharing again after that mints a new one — so a
 * withdrawn URL stays dead.
 */
export async function shareResume(
  userId: string,
  id: string,
): Promise<ShareLink | null> {
  const existing = await prisma.resume.findFirst({
    where: { id, userId },
    select: { shareSlug: true, sharedAt: true },
  });
  if (!existing) return null;
  if (existing.shareSlug && existing.sharedAt) {
    return { slug: existing.shareSlug, sharedAt: existing.sharedAt.getTime() };
  }

  for (let attempt = 0; attempt < MINT_ATTEMPTS; attempt++) {
    const slug = mintSlug();
    const sharedAt = new Date();
    try {
      // Scoped by `userId` like every other write, and conditional on the
      // resume still being private: two presses landing together mint one
      // link, and the loser reads back the winner's.
      const { count } = await prisma.resume.updateMany({
        where: { id, userId, shareSlug: null },
        data: { shareSlug: slug, sharedAt },
      });
      if (count > 0) return { slug, sharedAt: sharedAt.getTime() };

      const won = await prisma.resume.findFirst({
        where: { id, userId },
        select: { shareSlug: true, sharedAt: true },
      });
      return won?.shareSlug && won.sharedAt
        ? { slug: won.shareSlug, sharedAt: won.sharedAt.getTime() }
        : null;
    } catch {
      // A slug that was taken between the draw and the write. Draw another.
    }
  }

  return null;
}

/** Takes the link away. The slug goes with it, so the URL can never be
 *  reissued to this resume or any other. */
export async function unshareResume(
  userId: string,
  id: string,
): Promise<boolean> {
  const { count } = await prisma.resume.updateMany({
    where: { id, userId },
    data: { shareSlug: null, sharedAt: null },
  });
  return count > 0;
}
