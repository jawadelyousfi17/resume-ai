"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as db from "@/lib/cover-letters";
import { getResume } from "@/lib/resumes";
import { letterFromResume } from "@/lib/cover-letter";
import {
  coverLetterNameSchema,
  idSchema,
  pageFormatSchema,
  parseCoverLetterData,
} from "@/lib/validation";
import type { CoverLetterData } from "@/lib/types";
import type { ActionResult } from "./resumes";

// Same rules as the resume actions: these are public endpoints, so each one
// resolves the signed-in user first and only ever touches rows they own.

const NOT_FOUND = "That cover letter no longer exists.";

/**
 * Starts a letter.
 *
 * `resumeId` seeds the header from that resume; `data` is a letter the client
 * already has — what the AI draft dialog sends. Both are optional, and both go
 * through the same ownership and validation checks as anything else.
 */
export async function createCoverLetterAction(input?: {
  name?: string;
  resumeId?: string | null;
  data?: unknown;
}): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsedId = input?.resumeId
    ? idSchema.safeParse(input.resumeId)
    : null;
  const resumeId = parsedId?.success ? parsedId.data : null;

  let data: CoverLetterData | undefined;
  if (input?.data !== undefined) {
    const parsed = parseCoverLetterData(input.data);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    // Loose by design — see the note at the top of lib/validation.ts.
    data = parsed.data as unknown as CoverLetterData;
  } else if (resumeId) {
    // No document supplied, but a resume to start from: fill in the header
    // here rather than making the client fetch the resume to do it.
    const resume = await getResume(user.id, resumeId);
    if (resume) data = letterFromResume(resume);
  }

  const parsedName = coverLetterNameSchema.safeParse(input?.name ?? "");
  const existing = await db.countCoverLetters(user.id);

  const letter = await db.createCoverLetter(user.id, {
    name: parsedName.success ? parsedName.data : `Cover letter ${existing + 1}`,
    data,
    resumeId,
  });

  revalidatePath("/cover-letters");
  return { ok: true, id: letter.id };
}

export async function renameCoverLetterAction(
  id: string,
  name: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedName = coverLetterNameSchema.safeParse(name);
  if (!parsedName.success) {
    return { ok: false, error: parsedName.error.issues[0].message };
  }

  const updated = await db.renameCoverLetter(
    user.id,
    parsedId.data,
    parsedName.data,
  );
  if (!updated) return { ok: false, error: NOT_FOUND };

  revalidatePath("/cover-letters");
  revalidatePath(`/cover-letters/${parsedId.data}`);
  return { ok: true };
}

export async function duplicateCoverLetterAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const copy = await db.duplicateCoverLetter(user.id, parsedId.data);
  if (!copy) return { ok: false, error: NOT_FOUND };

  revalidatePath("/cover-letters");
  return { ok: true, id: copy.id };
}

export async function deleteCoverLetterAction(
  id: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const deleted = await db.deleteCoverLetter(user.id, parsedId.data);
  if (!deleted) return { ok: false, error: NOT_FOUND };

  revalidatePath("/cover-letters");
  return { ok: true };
}

/** The editor's autosave. Called on a debounce as the user types. */
export async function saveCoverLetterDataAction(
  id: string,
  data: CoverLetterData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedData = parseCoverLetterData(data);
  if (!parsedData.ok) return { ok: false, error: parsedData.error };

  const saved = await db.saveCoverLetterData(
    user.id,
    parsedId.data,
    parsedData.data as unknown as CoverLetterData,
  );
  if (!saved) return { ok: false, error: NOT_FOUND };

  revalidatePath("/cover-letters");
  return { ok: true };
}

export async function setCoverLetterFormatAction(
  id: string,
  format: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedFormat = pageFormatSchema.safeParse(format);
  if (!parsedFormat.success) {
    return { ok: false, error: "Unknown page format." };
  }

  const updated = await db.setCoverLetterFormat(
    user.id,
    parsedId.data,
    parsedFormat.data,
  );
  if (!updated) return { ok: false, error: NOT_FOUND };

  revalidatePath("/cover-letters");
  return { ok: true };
}
