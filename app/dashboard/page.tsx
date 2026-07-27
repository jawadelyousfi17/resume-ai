import { getAuthUser, requireUser } from "@/lib/auth";
import { listResumes } from "@/lib/resumes";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default async function DashboardPage() {
  // Open to guests: with no session the dashboard renders against the single
  // resume their browser is holding, and offers to keep it if they sign in.
  const authUser = await getAuthUser();
  if (!authUser) return <Dashboard resumes={[]} account={null} />;

  // Mirrors the Supabase identity into our own table on first sight.
  const user = await requireUser();

  return (
    <Dashboard
      resumes={await listResumes(user.id)}
      account={{ email: user.email, name: user.name, avatarUrl: user.avatarUrl }}
    />
  );
}
