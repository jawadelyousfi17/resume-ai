import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Where a profile photo goes.
//
// The upload runs here rather than in the browser because the session lives in
// cookies the page never reads — nothing else in the app talks to Supabase
// from the client. Going through the server also means the bucket can stay
// closed to anonymous writes.
//
// The browser has already shrunk the image to about 100KB; this is a check
// against anything else arriving.

const BUCKET = "images";
const MAX_BYTES = 2_000_000;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was sent" }, { status: 400 });
  }

  const extension = TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "That image format isn't supported." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That image is too large." }, { status: 413 });
  }

  // The uploader's own id is the first path segment, which is what the storage
  // policy checks — nobody can write into anyone else's folder.
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    // The name is unique, so the file never changes under a URL.
    cacheControl: "31536000",
  });

  if (error) {
    console.error("[upload]", error);
    return NextResponse.json(
      { error: "Couldn't store that image." },
      { status: 502 },
    );
  }

  const { publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path).data;
  return NextResponse.json({ url: publicUrl });
}

/** Removes an image this user owns. Best-effort — a caller replacing a photo
 *  shouldn't have to care whether the old file actually went away. */
export async function DELETE(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url") ?? "";
  const path = storagePath(url);
  // The policy would refuse anyway; this keeps us from asking at all.
  if (!path || !path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([path]);
  return NextResponse.json({ ok: true });
}

/** The object path inside our bucket, or null if this URL isn't one of ours. */
function storagePath(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const at = pathname.indexOf(marker);
    return at === -1
      ? null
      : decodeURIComponent(pathname.slice(at + marker.length));
  } catch {
    return null;
  }
}
