"use client";

// Photos go to Supabase Storage, not into the document.
//
// A profile photo used to be inlined as a data URL, which put a two-megabyte
// phone picture inside the resume JSON: every autosave shipped it again, a
// guest's localStorage filled up on the first upload, and the signed print
// token — which carries the whole document in a URL — grew past what a server
// will accept. Storing a URL instead keeps the document small and lets the
// browser cache the image.
//
// Whatever ends up in `personal.photo` is still just a string, so the preview
// and the templates never had to learn about any of this.

import { createClient } from "@/lib/supabase/client";

const BUCKET = "images";

/** Longest edge we keep. A resume prints the photo at about 120px, so 512
 *  survives a retina screen and a PDF with room to spare — and lands around
 *  100KB instead of two megabytes. */
const MAX_EDGE = 512;

/** Guests have no account to file an upload under, so their photo stays in the
 *  document and has to fit in localStorage alongside it. */
const GUEST_MAX_EDGE = 256;

const QUALITY = 0.82;

/** Bigger than this and we don't even try to decode it. */
const MAX_INPUT_BYTES = 20_000_000;

export class UploadError extends Error {}

/**
 * Shrinks the file and stores it, returning the URL to put in `personal.photo`.
 * A signed-out user gets a data URL back instead — there is nowhere to file it.
 */
export async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("That file isn't an image.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new UploadError("That image is too large — try one under 20MB.");
  }

  const supabase = createClient();
  // getSession reads the cookie the server client wrote, so this doesn't cost
  // a round trip on every upload.
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;

  if (!userId) {
    return toDataUrl(await shrink(file, GUEST_MAX_EDGE));
  }

  const blob = await shrink(file, MAX_EDGE);

  // The user's own id is the first path segment, which is what the storage
  // policy checks — nobody can write into anyone else's folder.
  const path = `${userId}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    // The name is unique, so the file never changes under a URL.
    cacheControl: "31536000",
  });

  if (error) {
    throw new UploadError(
      `Couldn't upload that photo${error.message ? ` — ${error.message}` : "."}`,
    );
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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
    // A signed-out visitor gets a data URL back, which is what we started with.
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
  const path = storagePath(url);
  if (!path) return;
  try {
    await createClient().storage.from(BUCKET).remove([path]);
  } catch {
    // An orphaned file is cheap; a failed edit is not.
  }
}

/** The object path inside our bucket, or null if this URL isn't one of ours. */
function storagePath(url: string | undefined): string | null {
  if (!url || !url.startsWith("http")) return null;
  try {
    const { pathname } = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const at = pathname.indexOf(marker);
    return at === -1 ? null : decodeURIComponent(pathname.slice(at + marker.length));
  } catch {
    return null;
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
