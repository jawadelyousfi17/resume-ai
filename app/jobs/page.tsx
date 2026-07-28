import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { JobBoard } from "@/components/jobs/JobBoard";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { requireUser } from "@/lib/auth";
import { planFor } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Job Tracker — meniacv",
  description:
    "Track every application on one board: saved, applied, interviewing, offer, closed.",
};

export default async function JobsPage() {
  // Behind the same door as the rest of the signed-in app. The board itself
  // lives in the browser, but a sidebar whose other links bounce you to
  // /login is not a page anyone should be standing on.
  const user = await requireUser();
  const plan = await planFor(user.id);

  return (
    <PlanProvider plan={plan}>
      <DashboardShell
        active="jobs"
        account={{
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          plan,
        }}
      >
        <JobBoard />
      </DashboardShell>
    </PlanProvider>
  );
}
