import { requireUser } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letters";
import { listResumes } from "@/lib/resumes";
import { planFor } from "@/lib/subscription";
import { CoverLetters } from "@/components/cover-letter/CoverLetters";
import { PlanProvider } from "@/components/plan/PlanProvider";

// Unlike the resume dashboard there's no guest mode here: a letter is drafted
// from a resume by the assistant, which needs an account either way.
// `requireUser` redirects to /login when there's no session.

export default async function CoverLettersPage() {
  const user = await requireUser();

  const [letters, resumes, plan] = await Promise.all([
    listCoverLetters(user.id),
    listResumes(user.id),
    planFor(user.id),
  ]);

  return (
    <PlanProvider plan={plan}>
      <CoverLetters
        letters={letters}
        resumes={resumes}
        account={{
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          plan,
        }}
      />
    </PlanProvider>
  );
}
