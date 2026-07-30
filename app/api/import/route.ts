// Reads an uploaded resume — PDF, image, or plain text — and returns it as a
// document the editor can open. `lib/ai/read-resume` does the reading and owns
// the file types; `lib/ai/extract` owns the schema and the mapping into our
// own shape. This route is the account check and the response.
//
// The same reader is exposed publicly, with an API key, at /api/v1/extract.

import { requireFeature } from "@/lib/subscription";
import { importedResumeName, toResumeData } from "@/lib/ai/extract";
import { MAX_BYTES, ReadError, fileBlock, readResume } from "@/lib/ai/read-resume";
import { language, type LanguageCode } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  // Reading a file costs a model call, so it needs an account and a plan that
  // includes it — same rule as the writing tools.
  const denied = await requireFeature("import");
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Upload a file to import.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Upload a file to import.", 400);
  }
  if (file.size > MAX_BYTES) {
    return jsonError(`That file is larger than ${MAX_BYTES / (1024 * 1024)}MB.`, 413);
  }

  const lang = languageOf(form.get("language"));

  try {
    const { resume } = await readResume(await fileBlock(file), req.signal);
    return Response.json(
      {
        name: importedResumeName(resume),
        data: toResumeData(resume, lang),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    if (err instanceof ReadError) return jsonError(err.message, err.status);
    return jsonError(
      err instanceof Error ? err.message : "Couldn't read that file.",
      500,
    );
  }
}

function languageOf(value: FormDataEntryValue | null): LanguageCode {
  return language(typeof value === "string" ? value : undefined).code;
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
