"use client";

// Photos go to storage, not into the document.
//
// A profile photo used to be inlined as a data URL, which put a two-megabyte
// phone picture inside the resume JSON: every autosave shipped it again, a
// guest's localStorage filled up on the first upload, and the signed print
// token — which carries the whole document in a URL — grew past what a server
// will accept. Storing a URL instead keeps the document small and lets the
// browser cache the image.
//
// The shrinking happens here, in the browser, so what crosses the network is
// a hundred kilobytes rather than the original. The upload itself goes through
// /api/upload, because the Supabase session lives in cookies this side never
// reads — and routing it through the server lets the bucket stay closed to
// anonymous writes.
//
// Whatever ends up in `personal.photo` is still just a string, so the preview
// and the templates never had to learn about any of this.

/** Longest edge we keep. A resume prints the photo at about 120px, so 512
 *  survives a retina screen and a PDF with room to spare — and lands around
 *  100KB instead of two megabytes. */
const MAX_EDGE = 512;

/** The size a photo falls back to when it has to stay inside the document —
 *  no storage configured, say. It has to fit in localStorage alongside the
 *  rest of the resume. */
const INLINE_MAX_EDGE = 256;

const QUALITY = 0.82;

/** Bigger than this and we don't even try to decode it. */
const MAX_INPUT_BYTES = 20_000_000;

export class UploadError extends Error {}

/**
 * Shrinks the file and stores it, returning the URL to put in `personal.photo`.
 *
 * Signed in or not — a guest's photo is stored too, under a folder of its own.
 * Only if the server says it can't store one does the photo stay inline.
 */
export async function uploadPhoto(
  file: File,
  /** Longest edge to keep. A page background covers the whole sheet, so it
   *  needs more pixels than a 120px portrait does. */
  maxEdge: number = MAX_EDGE,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("That file isn't an image.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new UploadError("That image is too large — try one under 20MB.");
  }

  const body = new FormData();
  body.append("file", await shrink(file, maxEdge), "photo.jpg");

  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) {
    // Nowhere to store it — no secret key configured, most likely. Keeping
    // the photo inside the document beats losing it.
    if (res.status === 401) return toDataUrl(await shrink(file, INLINE_MAX_EDGE));
    const { error } = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new UploadError(error || "Couldn't upload that photo.");
  }

  const { url } = (await res.json()) as { url?: string };
  if (!url) throw new UploadError("Couldn't upload that photo.");
  return url;
}

/**
 * Moves a photo that was stored inline — the way they all used to be — into
 * the bucket, and answers with its new URL. Null if there is nothing to move
 * or nowhere to move it to, in which case the document is left alone.
 *
 * Worth doing unprompted: an inline photo makes the document too big to save
 * and, once deflated into a print token, too big a URL to export through.
 */
export async function migrateInlinePhoto(photo: string): Promise<string | null> {
  if (!photo.startsWith("data:image/")) return null;
  try {
    const blob = await (await fetch(photo)).blob();
    const url = await uploadPhoto(
      new File([blob], "photo", { type: blob.type }),
    );
    // With nowhere to store it we get a data URL back, which is what we
    // started with.
    return url.startsWith("data:") ? null : url;
  } catch {
    return null;
  }
}

/**
 * Best-effort cleanup of a photo we stored. Failing to delete an old file is
 * not something to interrupt an edit for, so this never throws.
 */
export async function removePhoto(url: string | undefined): Promise<void> {
  if (!url?.startsWith("http")) return;
  try {
    await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
    });
  } catch {
    // An orphaned file is cheap; a failed edit is not.
  }
}

/* -------------------------------------------------------------------------- */
/* Resizing                                                                   */
/* -------------------------------------------------------------------------- */

/** The image, no longer than `maxEdge` on its longest side, as a JPEG. */
async function shrink(file: File, maxEdge: number): Promise<Blob> {
  const source = await decode(file);
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new UploadError("This browser couldn't process that image.");

  // JPEG has no transparency, and an unpainted canvas is black rather than
  // white — which is what a transparent PNG would turn into.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  if ("close" in source) source.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new UploadError("That image couldn't be read.");
  return blob;
}

/** Decodes to something drawable, respecting the camera's rotation. */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // HEIC and a few older formats only decode through an <img> — and on a
    // browser that can't read the format at all, this is where we find out.
    return await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new UploadError("That image format isn't supported."));
      };
      img.src = url;
    });
  }
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new UploadError("That image couldn't be read."));
    reader.readAsDataURL(blob);
  });
}
