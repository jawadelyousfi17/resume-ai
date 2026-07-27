import { requireUser } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letters";
import { listResumes } from "@/lib/resumes";
import { CoverLetters } from "@/components/cover-letter/CoverLetters";

// Unlike the resume dashboard there's no guest mode here: a letter is drafted
// from a resume by the assistant, which needs an account either way.
// `requireUser` redirects to /login when there's no session.

export default async function CoverLettersPage() {
  const user = await requireUser();

  const [letters, resumes] = await Promise.all([
    listCoverLetters(user.id),
    listResumes(user.id),
  ]);

  return (
    <CoverLetters
      letters={letters}
      resumes={resumes}
      account={{ email: user.email, name: user.name, avatarUrl: user.avatarUrl }}
    />
  );
}
