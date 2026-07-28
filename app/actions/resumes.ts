"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as db from "@/lib/resumes";
import { quotaDenial } from "@/lib/subscription";
import {
  idSchema,
  pageFormatSchema,
  parseResumeData,
  resumeNameSchema,
} from "@/lib/validation";
import type { ResumeData } from "@/lib/types";

// Server Actions are reachable by anyone who can POST to the app, so each one
// starts by resolving the signed-in user and then only ever touches rows that
// belong to them. `requireUser()` redirects to /login when there's no session.
//
// Anything that adds a resume also asks lib/subscription whether the plan has
// room for one. Whatever the dashboard chooses to show, the limit is here.

export type ActionResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

const NOT_FOUND = "That resume no longer exists.";

export async function createResumeAction(): Promise<
  ActionResult<{ id: string }>
> {
  const user = await requireUser();

  const denied = await quotaDenial(user.id, "resumes");
  if (denied) return { ok: false, error: denied };

  const existing = await db.countResumes(user.id);
  const resume = await db.createResume(user.id, `Resume ${existing + 1}`);

  revalidatePath("/dashboard");
  return { ok: true, id: resume.id };
}

/**
 * Stores a whole document the client already has.
 *
 * Two callers: the guest handover right after a sign-in
 * (components/dashboard/GuestImport, which only clears local storage once this
 * succeeds), and a resume just read out of an uploaded file. Either way the
 * payload arrives from the browser, so it gets the same validation as any
 * other write.
 */
export async function importResumeAction(input: {
  name: string;
  format: string;
  data: unknown;
}): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  // A guest handing over the resume they wrote signed out counts against the
  // plan like any other: the free one resume is the one they just wrote.
  const denied = await quotaDenial(user.id, "resumes");
  if (denied) return { ok: false, error: denied };

  const parsedName = resumeNameSchema.safeParse(input.name);
  const parsedFormat = pageFormatSchema.safeParse(input.format);
  const parsedData = parseResumeData(input.data);

  if (!parsedData.ok) return { ok: false, error: parsedData.error };
  if (!parsedFormat.success) {
    return { ok: false, error: "That page format isn't one we support." };
  }

  const resume = await db.importResume(user.id, {
    // A guest resume can carry any name they typed, including none.
    name: parsedName.success ? parsedName.data : "My Resume",
    format: parsedFormat.data,
    // Loose by design — see the note at the top of lib/validation.ts.
    data: parsedData.data as unknown as ResumeData,
  });

  revalidatePath("/dashboard");
  return { ok: true, id: resume.id };
}

export async function renameResumeAction(
  id: string,
  name: string,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedName = resumeNameSchema.safeParse(name);
  if (!parsedName.success) {
    return { ok: false, error: parsedName.error.issues[0].message };
  }

  const updated = await db.renameResume(user.id, parsedId.data, parsedName.data);
  if (!updated) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  revalidatePath(`/resume/${parsedId.data}`);
  return { ok: true };
}

export async function duplicateResumeAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const denied = await quotaDenial(user.id, "resumes");
  if (denied) return { ok: false, error: denied };

  const copy = await db.duplicateResume(user.id, parsedId.data);
  if (!copy) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  return { ok: true, id: copy.id };
}

export async function deleteResumeAction(id: string): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const deleted = await db.deleteResume(user.id, parsedId.data);
  if (!deleted) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  return { ok: true };
}

/** The editor's autosave. Called on a debounce as the user types. */
export async function saveResumeDataAction(
  id: string,
  data: ResumeData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedData = parseResumeData(data);
  if (!parsedData.ok) return { ok: false, error: parsedData.error };

  const saved = await db.saveResumeData(
    user.id,
    parsedId.data,
    parsedData.data as unknown as ResumeData,
  );
  if (!saved) return { ok: false, error: NOT_FOUND };

  // The dashboard shows "edited 2 minutes ago" and a thumbnail of this data.
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setResumeFormatAction(
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

  const updated = await db.setResumeFormat(
    user.id,
    parsedId.data,
    parsedFormat.data,
  );
  if (!updated) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  return { ok: true };
}
