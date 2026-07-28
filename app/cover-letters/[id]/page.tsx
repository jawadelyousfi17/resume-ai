import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCoverLetter } from "@/lib/cover-letters";
import { getResume } from "@/lib/resumes";
import { LetterEditor } from "@/components/cover-letter/LetterEditor";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { planFor } from "@/lib/subscription";

export default async function CoverLetterEditorPage(
  props: PageProps<"/cover-letters/[id]">,
) {
  const { id } = await props.params;
  const user = await requireUser();

  // Scoped to the signed-in user, so somebody else's id reads as missing
  // rather than forbidden — no confirming which ids exist.
  const letter = await getCoverLetter(user.id, id);
  if (!letter) notFound();

  // The resume behind it, if it's still there. Loaded here so a rewrite has
  // something to write from without a round trip from the client — and it's
  // scoped to this user too, so a stale link can't reach anyone else's.
  const resume = letter.resumeId
    ? await getResume(user.id, letter.resumeId)
    : null;

  return (
    <PlanProvider plan={await planFor(user.id)}>
      <LetterEditor letter={letter} resume={resume} />
    </PlanProvider>
  );
}
