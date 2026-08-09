// The account page: who you are, what plan you're on, and where that plan
// stands. A server component — nothing here changes without a page load.

import Link from "next/link";

import { AccountAvatar } from "@/components/ui/account-avatar";
import { PlanBadge } from "@/components/ui/plan-badge";
import {
  PlanTicks,
  planAction,
  planSkin,
  type PlanSkin,
} from "@/components/ui/plan-surface";
import {
  CHECKOUT_ENABLED,
  planById,
  type PlanId,
} from "@/lib/plans";
import { cn } from "@/lib/utils";

export interface ProfileSubscription {
  status: string;
  /** When the paid period ends, as epoch millis. Null when there's no end. */
  renewsAt: number | null;
  cancelAtPeriodEnd: boolean;
  /** Their place in the launch offer, or null if they weren't in it. */
  supporterNumber: number | null;
  supporterPlaces: number;
}

export function Profile({
  account,
  plan,
  subscription,
}: {
  account: {
    email: string;
    name: string | null;
    avatarUrl: string | null;
    joined: number;
  };
  plan: PlanId;
  subscription: ProfileSubscription;
}) {
  const current = planById(plan);
  const skin = planSkin(plan);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Your account
      </h1>

      <section className="mt-6 flex items-center gap-4 rounded-2xl bg-panel p-5 shadow-[var(--shadow-panel)]">
        <AccountAvatar
          src={account.avatarUrl}
          name={account.name ?? account.email}
          className="h-16 w-16"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[18px] font-extrabold text-ink">
              {account.name ?? "Your account"}
            </p>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-0.5 truncate text-[14px] text-ink-soft">
            {account.email}
          </p>
          <p className="mt-1 text-[13px] text-ink-faint">
            Here since {date(account.joined)}
          </p>
        </div>
      </section>

      {/* The plan, wearing the pricing page's own card — same surface, same
          ticks — so what you're on and what's on offer are the same object. */}
      <section className="mt-4">
        <article className={cn("rounded-2xl px-6 pt-6 pb-7", skin.card)}>
          <p className={cn("text-[13px] font-bold", skin.faint)}>
            You&rsquo;re on
          </p>
          <h2
            className={cn(
              "mt-1 text-[24px] leading-[1.1] font-extrabold tracking-tight",
              skin.title,
            )}
          >
            {current.title}
          </h2>

          <p className={cn("mt-3 text-[13.5px] leading-relaxed", skin.soft)}>
            <Standing plan={plan} subscription={subscription} skin={skin} />
          </p>

          {plan !== "ultimate" && (
            <Link
              href="/pricing"
              className={cn(
                planAction,
                CHECKOUT_ENABLED ? skin.cta : skin.ctaQuiet,
              )}
            >
              {CHECKOUT_ENABLED ? "See the plans" : "See what's coming"}
            </Link>
          )}

          <div className={cn("mt-7 border-t pt-6", skin.rule)}>
            <p className={cn("text-[13px] font-bold", skin.faint)}>
              {plan === "free" ? "What you get" : current.featuresHeading}
            </p>
            <PlanTicks
              features={current.features}
              skin={skin}
              className="mt-4"
            />
          </div>
        </article>
      </section>
    </div>
  );
}

/** Where the subscription stands, in one sentence. Takes the card's skin
 *  because the sentence is drawn on it — the dates it emphasises have to read
 *  on navy as well as on the panel. */
function Standing({
  plan,
  subscription,
  skin,
}: {
  plan: PlanId;
  subscription: ProfileSubscription;
  skin: PlanSkin;
}) {
  const { supporterNumber, renewsAt, cancelAtPeriodEnd, status } = subscription;
  const strong = cn("font-bold", skin.title);

  if (supporterNumber !== null && renewsAt) {
    return (
      <>
        Supporter no. {supporterNumber} of the first{" "}
        {subscription.supporterPlaces} — Ultimate is yours free until{" "}
        <strong className={strong}>{date(renewsAt)}</strong>, with no card and
        nothing to cancel.
      </>
    );
  }

  if (plan === "free") {
    return CHECKOUT_ENABLED ? (
      <>
        One resume, every template, unlimited downloads — and nothing expires.
      </>
    ) : (
      <>
        One resume, every template, unlimited downloads — and nothing expires.
        The paid plans aren&rsquo;t on sale yet.
      </>
    );
  }

  if (cancelAtPeriodEnd && renewsAt) {
    return (
      <>
        Cancelled — you keep everything until{" "}
        <strong className={strong}>{date(renewsAt)}</strong>, then the account
        goes back to Free.
      </>
    );
  }

  if (status === "past_due" && renewsAt) {
    return (
      <>
        A payment didn&rsquo;t go through. Access holds until{" "}
        <strong className={strong}>{date(renewsAt)}</strong>.
      </>
    );
  }

  if (renewsAt) {
    return (
      <>
        Renews on <strong className={strong}>{date(renewsAt)}</strong>.
      </>
    );
  }

  return <>Active, with no end date.</>;
}

function date(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
