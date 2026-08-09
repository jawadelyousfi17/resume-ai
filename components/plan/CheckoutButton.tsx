"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { startCheckout } from "@/app/actions/checkout";
import { toast } from "@/components/ui/toast";
import type { BillingCycle, PlanId } from "@/lib/plans";

// The button that leaves the site.
//
// A plain button rather than a link, because the address it goes to doesn't
// exist until it's pressed: the checkout is built per click, server-side, and
// stamped with who's buying (app/actions/checkout.ts). Which plan and which
// cycle is all that crosses the wire — the browser never holds a Whop id.
//
// The navigation is done here rather than by redirecting from the action. The
// destination is another origin, and `window.location` says so plainly; it
// also leaves the failure cases as ordinary return values, which is how the
// wrong sentence ends up in a toast instead of an error boundary.

export function CheckoutButton({
  plan,
  cycle,
  className,
  children,
}: {
  plan: PlanId;
  cycle: BillingCycle;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() =>
        startTransition(async () => {
          const result = await startCheckout(plan, cycle);

          if (result.ok) {
            // Not `router.push`: this is Whop's origin, not a route.
            window.location.href = result.url;
            return;
          }

          toast.error(result.error);
          // Nobody is signed in, so there's no account for the plan to land
          // on. The sentence says that; this is the way to fix it.
          if (result.signIn) router.push(result.signIn);
        })
      }
    >
      {/* The label holds still while the request is in flight — the button
          is disabled and the page is about to be replaced, so a word change
          here would flash once and be gone. */}
      {children}
    </button>
  );
}
