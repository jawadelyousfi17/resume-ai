// The account page: who you are, what plan you're on, and where that plan
// stands. A server component — nothing here changes without a page load.

import Link from "next/link";

import { AccountAvatar } from "@/components/ui/account-avatar";
import { PlanBadge } from "@/components/ui/plan-badge";
import {
  CHECKOUT_ENABLED,
  EARLY_SUPPORTER,
  planById,
  type PlanId,
} from "@/lib/plans";

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

      {/* The plan, wearing its own card. Same slab, same ticks as the pricing
          page, so what you're on and what's on offer are the same object. */}
      <section className="mt-4">
        <article className="plan-shell flex flex-col overflow-hidden rounded-[20px] p-1.5 ring-1 ring-white/10">
          <div className="rounded-[15px] bg-white px-6 pt-6 pb-5 text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
            <p className="text-[13px] font-medium text-ink-faint">
              You&rsquo;re on
            </p>
            <h2 className="text-[26px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink">
              {current.title}
            </h2>

            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              <Standing plan={plan} subscription={subscription} />
            </p>

            {plan !== "ultimate" &&
              (CHECKOUT_ENABLED ? (
                <Link
                  href="/pricing"
                  className="plan-cta mt-5 flex h-11 w-full items-center justify-center rounded-[10px] text-[14.5px] font-medium tracking-[-0.025em] transition hover:opacity-95"
                >
                  See the plans
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-[10px] border border-field-border text-[14.5px] font-bold text-ink transition hover:border-ink/30"
                >
                  See what&rsquo;s coming
                </Link>
              ))}
          </div>

          <div className="px-5 pt-5 pb-4 text-white">
            <p className="text-[14px] leading-none font-normal tracking-[-0.02em] text-white/85 [text-shadow:0_1px_2px_rgba(1,4,36,0.38)]">
              {plan === "free" ? "What you get" : current.featuresHeading}
            </p>
            <ul className="mt-4 grid gap-3.5">
              {current.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-[14px] leading-[1.15] tracking-[-0.025em] [text-shadow:0_1px_2px_rgba(0,4,40,0.4)]"
                >
                  <span className="plan-check" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}

/** Where the subscription stands, in one sentence. */
function Standing({
  plan,
  subscription,
}: {
  plan: PlanId;
  subscription: ProfileSubscription;
}) {
  const { supporterNumber, renewsAt, cancelAtPeriodEnd, status } = subscription;

  if (supporterNumber !== null && renewsAt) {
    return (
      <>
        Supporter no. {supporterNumber} of the first{" "}
        {subscription.supporterPlaces} — Ultimate is yours free until{" "}
        <strong className="font-bold text-ink">{date(renewsAt)}</strong>, with
        no card and nothing to cancel.
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
        The paid plans aren&rsquo;t on sale yet; the first{" "}
        {EARLY_SUPPORTER.places} accounts get Ultimate free for a year.
      </>
    );
  }

  if (cancelAtPeriodEnd && renewsAt) {
    return (
      <>
        Cancelled — you keep everything until{" "}
        <strong className="font-bold text-ink">{date(renewsAt)}</strong>, then
        the account goes back to Free.
      </>
    );
  }

  if (status === "past_due" && renewsAt) {
    return (
      <>
        A payment didn&rsquo;t go through. Access holds until{" "}
        <strong className="font-bold text-ink">{date(renewsAt)}</strong>.
      </>
    );
  }

  if (renewsAt) {
    return (
      <>
        Renews on{" "}
        <strong className="font-bold text-ink">{date(renewsAt)}</strong>.
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
