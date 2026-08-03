import "server-only";

import type { Prisma, Resume as ResumeRow } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { DEFAULT_SETTINGS, createEmptyResume, migrateResumeData } from "./defaults";
import type { PageFormat, Resume, ResumeData } from "./types";

// Every query here is scoped by `userId`. Nothing in this module will read or
// write a row without one, so a guessed resume id gets a caller nowhere.
//
// Rows come back as the same `Resume` shape the UI has always used —
// timestamps as epoch millis, data already migrated — so components didn't
// have to change when localStorage went away.

export async function listResumes(userId: string): Promise<Resume[]> {
  const rows = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toResume);
}

/** How many resumes this user has — used to name the next one. */
export async function countResumes(userId: string): Promise<number> {
  return prisma.resume.count({ where: { userId } });
}

export async function getResume(
  userId: string,
  id: string,
): Promise<Resume | null> {
  const row = await prisma.resume.findFirst({ where: { id, userId } });
  return row ? toResume(row) : null;
}

export async function createResume(
  userId: string,
  name = "Resume 1",
): Promise<Resume> {
  // Reuse the blank-document factory, but let Postgres mint the id.
  const blank = createEmptyResume(name);
  const row = await prisma.resume.create({
    data: {
      userId,
      name: blank.name,
      format: blank.format,
      data: blank.data as unknown as Prisma.InputJsonValue,
    },
  });
  return toResume(row);
}

/** Stores a document the caller already has — how a guest's resume becomes a
 *  real row when they sign in. Postgres still mints the id. */
export async function importResume(
  userId: string,
  input: { name: string; format: PageFormat; data: ResumeData },
): Promise<Resume> {
  const row = await prisma.resume.create({
    data: {
      userId,
      name: input.name,
      format: input.format,
      data: input.data as unknown as Prisma.InputJsonValue,
    },
  });
  return toResume(row);
}

/** Persists edited document data, bumping `updatedAt`. */
export async function saveResumeData(
  userId: string,
  id: string,
  data: ResumeData,
): Promise<Resume | null> {
  return update(userId, id, { data: data as unknown as Prisma.InputJsonValue });
}

export async function renameResume(
  userId: string,
  id: string,
  name: string,
): Promise<Resume | null> {
  return update(userId, id, { name });
}

export async function setResumeFormat(
  userId: string,
  id: string,
  format: PageFormat,
): Promise<Resume | null> {
  return update(userId, id, { format });
}

export async function deleteResume(
  userId: string,
  id: string,
): Promise<boolean> {
  const { count } = await prisma.resume.deleteMany({ where: { id, userId } });
  return count > 0;
}

export async function duplicateResume(
  userId: string,
  id: string,
): Promise<Resume | null> {
  const source = await prisma.resume.findFirst({ where: { id, userId } });
  if (!source) return null;

  const copy = await prisma.resume.create({
    data: {
      userId,
      name: `${source.name} (copy)`,
      format: source.format,
      data: source.data as Prisma.InputJsonValue,
    },
  });
  return toResume(copy);
}

/** Applies a patch to a row this user owns, or returns null if they don't. */
async function update(
  userId: string,
  id: string,
  data: Prisma.ResumeUpdateInput,
): Promise<Resume | null> {
  const { count } = await prisma.resume.updateMany({
    where: { id, userId },
    data,
  });
  if (count === 0) return null;

  const row = await prisma.resume.findFirst({ where: { id, userId } });
  return row ? toResume(row) : null;
}

function toResume(row: ResumeRow): Resume {
  const stored = row.data as unknown as ResumeData;
  return {
    id: row.id,
    name: row.name,
    format: row.format,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
    // Null unless there's a public link out there — see lib/share.ts, which
    // is the only module that mints or clears one.
    share:
      row.shareSlug && row.sharedAt
        ? { slug: row.shareSlug, sharedAt: row.sharedAt.getTime() }
        : null,
    // Back-fill settings saved before customization existed, then bring older
    // field shapes up to date — same treatment the localStorage store gave
    // documents on load.
    data: migrateResumeData({
      ...stored,
      settings: { ...DEFAULT_SETTINGS, ...stored.settings },
    }),
  };
}
