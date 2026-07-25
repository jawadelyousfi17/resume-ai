import * as z from "zod";

// Server Actions are public endpoints, so everything the editor sends gets
// checked here before it reaches the database.
//
// The check is deliberately shallow. `ResumeData` in lib/types.ts is a large,
// fast-moving shape, and a field-by-field mirror of it would drift out of sync
// and start rejecting perfectly good documents. What we care about is that the
// blob is a resume — right top-level shape, sane sizes, no runaway payloads —
// which is enough to keep the editor from choking on what it reads back.

/** Roughly 2 MB of JSON, which leaves room for an embedded profile photo. */
const MAX_DATA_BYTES = 2_000_000;

const sectionSchema = z.looseObject({
  id: z.string().min(1).max(200),
  type: z.string().min(1).max(50),
});

export const resumeDataSchema = z.looseObject({
  personal: z.looseObject({}),
  sections: z.array(sectionSchema).max(100),
  settings: z.looseObject({}),
});

export const pageFormatSchema = z.enum(["A4", "Letter"]);

export const resumeNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Give the resume a name." })
  .max(120, { error: "That name is too long." });

export const idSchema = z.uuid({ error: "Unknown resume." });

/** Validates a document and rejects one too big to be worth storing. */
export function parseResumeData(value: unknown) {
  const parsed = resumeDataSchema.safeParse(value);
  if (!parsed.success) {
    return { ok: false as const, error: "That resume didn't look right." };
  }
  if (JSON.stringify(parsed.data).length > MAX_DATA_BYTES) {
    return {
      ok: false as const,
      error: "This resume is too large to save — try a smaller photo.",
    };
  }
  return { ok: true as const, data: parsed.data };
}

export const emailSchema = z
  .email({ error: "Enter a valid email address." })
  .trim();

export const passwordSchema = z
  .string()
  .min(8, { error: "Use at least 8 characters." })
  .max(72, { error: "Passwords top out at 72 characters." });

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
