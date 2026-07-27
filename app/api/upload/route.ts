import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Where a profile photo goes.
//
// The upload runs here rather than in the browser because the session lives in
// cookies the page never reads — nothing else in the app talks to Supabase
// from the client. Going through the server also means the bucket can stay
// closed to anonymous writes: a guest's photo is stored with the secret key,
// under a folder of its own, after this route has checked it.
//
// Open to signed-out visitors on purpose. The app works without an account,
// and a photo that only exists inside the document is what made resumes too
// big to save and too big to export.
//
// The browser has already shrunk the image to about 100KB; the limits below
// are a check against anything else arriving.

const BUCKET = "images";
const MAX_BYTES = 2_000_000;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: "That image is too large." },
      { status: 413 },
    );
  }

  const user = await getAuthUser();

  // A signed-in user's files are filed under their own id, which is what the
  // storage policy checks. A guest has no id to file under, so their photos go
  // to a folder of their own — written with the secret key, since no policy
  // can recognise someone who isn't anybody yet.
  // Without a secret key the guest write is attempted with the ordinary
  // client, which only gets through if a policy lets an anonymous caller
  // write. That's the weaker setup — see supabase/images-bucket.sql.
  const supabase = user
    ? await createClient()
    : (createAdminClient() ?? (await createClient()));

  const path = `${user ? user.id : "guest"}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    // The name is unique, so the file never changes under a URL.
    cacheControl: "31536000",
  });

  if (error) {
    console.error("[upload]", error);
    // A guest gets 401 rather than an error: nothing they did is wrong, and
    // the editor answers it by keeping the photo inside the document. A signed
    // -in user gets told, because for them this is a fault worth seeing.
    return NextResponse.json(
      { error: user ? "Couldn't store that image." : "No storage available." },
      { status: user ? 502 : 401 },
    );
  }

  const { publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path).data;
  return NextResponse.json({ url: publicUrl });
}

/** Removes an image the caller owns. Best-effort — someone replacing a photo
 *  shouldn't have to care whether the old file actually went away. */
export async function DELETE(request: Request) {
  const url = new URL(request.url).searchParams.get("url") ?? "";
  const path = storagePath(url);
  if (!path) return NextResponse.json({ ok: true });

  const user = await getAuthUser();

  // Own folder only. A guest photo is deletable by anyone holding its URL,
  // which is the only claim to it a guest has — and the uuid in it is not
  // something you can guess your way to.
  if (user) {
    if (!path.startsWith(`${user.id}/`)) return NextResponse.json({ ok: true });
    const supabase = await createClient();
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ ok: true });
  }

  if (!path.startsWith("guest/")) return NextResponse.json({ ok: true });
  const admin = createAdminClient();
  await admin?.storage.from(BUCKET).remove([path]);
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
