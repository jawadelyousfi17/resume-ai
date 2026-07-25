import { notFound } from "next/navigation";
import { getAuthUser, requireUser } from "@/lib/auth";
import { getResume } from "@/lib/resumes";
import { GUEST_RESUME_ID } from "@/lib/guest-id";
import { Editor } from "@/components/editor/Editor";
import { GuestEditor } from "@/components/editor/GuestEditor";

export default async function ResumeEditorPage(
  props: PageProps<"/resume/[id]">,
) {
  const { id } = await props.params;
  const authUser = await getAuthUser();

  // A guest's resume lives in their browser, so this page can't load it — the
  // client component subscribes to it instead.
  if (!authUser) {
    if (id !== GUEST_RESUME_ID) notFound();
    return <GuestEditor />;
  }

  const user = await requireUser();

  // Scoped to the signed-in user, so somebody else's id reads as missing
  // rather than forbidden — no confirming which ids exist.
  const resume = await getResume(user.id, id);
  if (!resume) notFound();

  return <Editor resume={resume} />;
}
