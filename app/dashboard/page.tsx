import { requireUser } from "@/lib/auth";
import { listResumes } from "@/lib/resumes";
import { pendingCelebration } from "@/lib/early-supporter";
import { planFor } from "@/lib/subscription";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { SupporterCelebration } from "@/components/dashboard/SupporterCelebration";

export default async function DashboardPage() {
  // Resumes belong to an account, so this page needs one: `requireUser()`
  // sends a signed-out visitor to /login, and mirrors the Supabase identity
  // into our own table on first sight.
  const user = await requireUser();

  const [resumes, plan, celebration] = await Promise.all([
    listResumes(user.id),
    planFor(user.id),
    // Null for everyone but an early supporter who hasn't been thanked yet,
    // which is all but one page load in an account's life.
    pendingCelebration(user.id),
  ]);

  return (
    <PlanProvider plan={plan}>
      <Dashboard
        resumes={resumes}
        account={{
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          plan,
        }}
      />
      {celebration && (
        <SupporterCelebration
          celebration={{ ...celebration, until: celebration.until.getTime() }}
        />
      )}
    </PlanProvider>
  );
}
