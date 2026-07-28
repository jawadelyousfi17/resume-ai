import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getSubscription, planFor } from "@/lib/subscription";
import { EARLY_SUPPORTER } from "@/lib/plans";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { Profile } from "@/components/profile/Profile";

export const metadata: Metadata = {
  title: "Your account — meniacv",
  robots: { index: false, follow: false },
};

// Everything the account knows about itself: who they are, what they're on,
// and what that includes. Read here and handed down whole — the page under it
// draws, it doesn't fetch.

export default async function ProfilePage() {
  const user = await requireUser();

  const [plan, subscription] = await Promise.all([
    planFor(user.id),
    getSubscription(user.id),
  ]);

  return (
    <PlanProvider plan={plan}>
      <DashboardShell
        active="profile"
        account={{
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          plan,
        }}
      >
        <Profile
          account={{
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            joined: user.createdAt.getTime(),
          }}
          plan={plan}
          subscription={{
            status: subscription?.status ?? "active",
            // Dates don't cross into a client component; epoch millis do.
            renewsAt: subscription?.currentPeriodEnd?.getTime() ?? null,
            cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
            // The launch offer, if this is one of the hundred.
            supporterNumber: subscription?.earlySupporter
              ? (subscription.supporterNumber ?? 1)
              : null,
            supporterPlaces: EARLY_SUPPORTER.places,
          }}
        />
      </DashboardShell>
    </PlanProvider>
  );
}
