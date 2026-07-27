import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { JobBoard } from "@/components/jobs/JobBoard";
import { getAuthUser, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Job Tracker — meniacv",
  description:
    "Track every application on one board: saved, applied, interviewing, offer, closed.",
};

export default async function JobsPage() {
  // Open to guests, like the dashboard: the board lives in the browser, so
  // there is nothing here that needs an account.
  const authUser = await getAuthUser();
  const user = authUser ? await requireUser() : null;

  return (
    <DashboardShell
      active="jobs"
      account={user ? { email: user.email, name: user.name, avatarUrl: user.avatarUrl } : null}
    >
      <JobBoard />
    </DashboardShell>
  );
}
