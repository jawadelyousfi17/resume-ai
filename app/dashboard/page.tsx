import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { listResumes } from "@/lib/resumes";
import { pendingCelebration } from "@/lib/early-supporter";
import { planFor } from "@/lib/subscription";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { SupporterCelebration } from "@/components/dashboard/SupporterCelebration";

export const metadata: Metadata = {
  // Per-user and behind a sign-in — nothing here should rank. See the note on
  // /login: noindex rather than a robots.txt block, so the directive is
  // actually readable.
  robots: { index: false, follow: false },
};

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  // Resumes belong to an account, so this page needs one: `requireUser()`
  // sends a signed-out visitor to /login, and mirrors the Supabase identity
  // into our own table on first sight.
  const user = await requireUser();

  // Set when /start had to turn someone away for want of a slot on their
  // plan — the resume they pressed for was never written, so the page says so
  // with the plans rather than showing the same grid as if nothing happened.
  const params = await props.searchParams;
  const full = params.full;
  const atLimit = (Array.isArray(full) ? full[0] : full) === "resumes";

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
        full={atLimit}
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
