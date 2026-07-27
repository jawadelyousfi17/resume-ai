import "server-only";

// Every query here is scoped by `userId`, exactly as lib/resumes.ts is. Nothing
// in this module reads or writes a row without one, so a guessed id gets a
// caller nowhere.

import type {
  Prisma,
  CoverLetter as CoverLetterRow,
} from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { DEFAULT_LETTER_SETTINGS, createEmptyCoverLetterData } from "./cover-letter";
import type { CoverLetter, CoverLetterData, PageFormat } from "./types";

export async function listCoverLetters(userId: string): Promise<CoverLetter[]> {
  const rows = await prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toCoverLetter);
}

/** How many this user has — used to name the next one. */
export async function countCoverLetters(userId: string): Promise<number> {
  return prisma.coverLetter.count({ where: { userId } });
}

export async function getCoverLetter(
  userId: string,
  id: string,
): Promise<CoverLetter | null> {
  const row = await prisma.coverLetter.findFirst({ where: { id, userId } });
  return row ? toCoverLetter(row) : null;
}

export async function createCoverLetter(
  userId: string,
  input: {
    name: string;
    /** Omitted for a letter started from scratch. */
    data?: CoverLetterData;
    /** Checked against this user before it's stored — see below. */
    resumeId?: string | null;
  },
): Promise<CoverLetter> {
  // A resume id arrives from the browser, so it's only honoured if it names a
  // resume this same user owns. Anything else is stored as no link at all,
  // rather than as a pointer into somebody else's data.
  const resumeId = input.resumeId
    ? ((await prisma.resume.findFirst({
        where: { id: input.resumeId, userId },
        select: { id: true },
      })) ?? null)?.id ?? null
    : null;

  const row = await prisma.coverLetter.create({
    data: {
      userId,
      resumeId,
      name: input.name,
      data: (input.data ??
        createEmptyCoverLetterData()) as unknown as Prisma.InputJsonValue,
    },
  });
  return toCoverLetter(row);
}

export async function saveCoverLetterData(
  userId: string,
  id: string,
  data: CoverLetterData,
): Promise<CoverLetter | null> {
  return update(userId, id, { data: data as unknown as Prisma.InputJsonValue });
}

export async function renameCoverLetter(
  userId: string,
  id: string,
  name: string,
): Promise<CoverLetter | null> {
  return update(userId, id, { name });
}

export async function setCoverLetterFormat(
  userId: string,
  id: string,
  format: PageFormat,
): Promise<CoverLetter | null> {
  return update(userId, id, { format });
}

export async function deleteCoverLetter(
  userId: string,
  id: string,
): Promise<boolean> {
  const { count } = await prisma.coverLetter.deleteMany({
    where: { id, userId },
  });
  return count > 0;
}

export async function duplicateCoverLetter(
  userId: string,
  id: string,
): Promise<CoverLetter | null> {
  const source = await prisma.coverLetter.findFirst({ where: { id, userId } });
  if (!source) return null;

  const copy = await prisma.coverLetter.create({
    data: {
      userId,
      resumeId: source.resumeId,
      name: `${source.name} (copy)`,
      format: source.format,
      data: source.data as Prisma.InputJsonValue,
    },
  });
  return toCoverLetter(copy);
}

/** Applies a patch to a row this user owns, or returns null if they don't. */
async function update(
  userId: string,
  id: string,
  data: Prisma.CoverLetterUpdateInput,
): Promise<CoverLetter | null> {
  const { count } = await prisma.coverLetter.updateMany({
    where: { id, userId },
    data,
  });
  if (count === 0) return null;

  const row = await prisma.coverLetter.findFirst({ where: { id, userId } });
  return row ? toCoverLetter(row) : null;
}

function toCoverLetter(row: CoverLetterRow): CoverLetter {
  const stored = row.data as unknown as CoverLetterData;
  return {
    id: row.id,
    name: row.name,
    format: row.format,
    resumeId: row.resumeId,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
    data: {
      ...createEmptyCoverLetterData(),
      ...stored,
      // Back-fills anything added to settings after this letter was saved.
      settings: { ...DEFAULT_LETTER_SETTINGS, ...stored.settings },
    },
  };
}
