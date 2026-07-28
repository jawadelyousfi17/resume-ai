"use client";

// What this account is allowed to do, available to any client component, and
// the card that explains a "no".
//
// The rule everywhere: ask before you start. A gated action calls `ask()` on
// the click that begins it — before a file is read, a request is sent, or a
// dialog full of options is opened. It answers true and you carry on, or it
// answers false and the upgrade card is already on screen saying why.
//
// The server refuses the same things again (lib/subscription.ts). This exists
// so the refusal arrives in a fifth of a second instead of at the end of a
// model call someone waited a minute for.

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { useAuthDialog } from "@/components/auth/AuthDialog";
import { UpgradeDialog } from "@/components/ui/upgrade-dialog";
import { PLAN_LIMITS, type PlanGate, type PlanId } from "@/lib/plans";

interface PlanAccess {
  /** Null for a guest — signing in comes before any question of plans. */
  plan: PlanId | null;
  /** Whether the plan covers it, asking nothing and showing nothing. */
  allows: (gate: PlanGate) => boolean;
  /** Whether they may go ahead. When they may not, this has already put the
   *  upgrade card — or the sign-in card — on screen. */
  ask: (gate: PlanGate) => boolean;
  /** The same question for a counted limit: `used` is what they have now, so
   *  the answer is known on the click rather than after a round trip. */
  askRoomFor: (gate: "resumes" | "coverLetters", used: number) => boolean;
}

// A tree with no provider is one with nothing gated in it; `ask` letting
// everything through leaves the server as the only gate, which is where the
// real one has always been.
const PlanContext = createContext<PlanAccess>({
  plan: null,
  allows: () => true,
  ask: () => true,
  askRoomFor: () => true,
});

export const usePlan = () => useContext(PlanContext);

export function PlanProvider({
  plan,
  children,
}: {
  plan: PlanId | null;
  children: React.ReactNode;
}) {
  const auth = useAuthDialog();
  const [asking, setAsking] = useState<PlanGate | null>(null);

  const allows = useCallback(
    // A guest is allowed nothing that costs a model call, but they're never
    // shown an upgrade card for it — they're shown the way in.
    (gate: PlanGate) => (plan ? Boolean(PLAN_LIMITS[plan][gate]) : false),
    [plan],
  );

  const ask = useCallback(
    (gate: PlanGate) => {
      if (!plan) {
        auth.open("signup");
        return false;
      }
      if (PLAN_LIMITS[plan][gate]) return true;
      setAsking(gate);
      return false;
    },
    [auth, plan],
  );

  const askRoomFor = useCallback(
    (gate: "resumes" | "coverLetters", used: number) => {
      if (!plan) {
        auth.open("signup");
        return false;
      }
      if (used < PLAN_LIMITS[plan][gate]) return true;
      setAsking(gate);
      return false;
    },
    [auth, plan],
  );

  const value = useMemo<PlanAccess>(
    () => ({ plan, allows, ask, askRoomFor }),
    [plan, allows, ask, askRoomFor],
  );

  return (
    <PlanContext.Provider value={value}>
      {children}
      <UpgradeDialog
        gate={asking}
        current={plan}
        onOpenChange={(open) => !open && setAsking(null)}
      />
    </PlanContext.Provider>
  );
}
