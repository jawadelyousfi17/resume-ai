import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getResume } from "@/lib/resumes";
import { isMobileUserAgent } from "@/lib/device";
import { Editor } from "@/components/editor/Editor";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { planFor } from "@/lib/subscription";

// Writing a resume needs an account. `requireUser()` sends anyone else to
// /login — including whoever still has a link to the old guest editor, which
// no longer has a resume to open.

export default async function ResumeEditorPage(
  props: PageProps<"/resume/[id]">,
) {
  const { id } = await props.params;
  const user = await requireUser();

  // The editor sends a different layout to a phone, and swapping it in after
  // hydration would flash the wrong one, so the guess is made here. The client
  // re-checks against the viewport and overrules this if it's wrong.
  const mobile = isMobileUserAgent((await headers()).get("user-agent"));

  // Scoped to the signed-in user, so somebody else's id reads as missing
  // rather than forbidden — no confirming which ids exist.
  const resume = await getResume(user.id, id);
  if (!resume) notFound();

  // Everything the assistant can do is priced, so the editor is wrapped in
  // what this account is allowed — each panel asks before it starts.
  return (
    <PlanProvider plan={await planFor(user.id)}>
      <Editor resume={resume} mobile={mobile} />
    </PlanProvider>
  );
}
