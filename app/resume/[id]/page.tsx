import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthUser, requireUser } from "@/lib/auth";
import { getResume } from "@/lib/resumes";
import { GUEST_RESUME_ID } from "@/lib/guest-id";
import { isMobileUserAgent } from "@/lib/device";
import { Editor } from "@/components/editor/Editor";
import { GuestEditor } from "@/components/editor/GuestEditor";

export default async function ResumeEditorPage(
  props: PageProps<"/resume/[id]">,
) {
  const { id } = await props.params;
  const authUser = await getAuthUser();

  // The editor sends a different layout to a phone, and swapping it in after
  // hydration would flash the wrong one, so the guess is made here. The client
  // re-checks against the viewport and overrules this if it's wrong.
  const mobile = isMobileUserAgent((await headers()).get("user-agent"));

  // A guest's resume lives in their browser, so this page can't load it — the
  // client component subscribes to it instead.
  if (!authUser) {
    if (id !== GUEST_RESUME_ID) notFound();
    return <GuestEditor mobile={mobile} />;
  }

  const user = await requireUser();

  // Scoped to the signed-in user, so somebody else's id reads as missing
  // rather than forbidden — no confirming which ids exist.
  const resume = await getResume(user.id, id);
  if (!resume) notFound();

  return <Editor resume={resume} mobile={mobile} />;
}
