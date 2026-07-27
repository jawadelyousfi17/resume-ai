// The feature matrix under the plan cards: one row per feature, one column per
// plan, with a panel running the height of the plan we recommend.
//
// A real <table> — it is one — inside a scroller, because four columns of text
// can't honestly fit a phone. Server-rendered: nothing here reacts to the
// billing toggle, since the features don't change with the billing period.

import Link from "next/link";

import { CheckIcon } from "@/components/ui/icons";
import { COMPARISON, PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PlanComparison({ className }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="compare-plans">
      <div className="text-center">
        <h2
          id="compare-plans"
          className="text-[26px] leading-tight font-extrabold tracking-tight text-ink sm:text-[32px]"
        >
          Compare plans
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-soft">
          Every plan builds the same resume with the same templates and the same
          export. What you pay for is how many of them, and how much of the
          writing you want help with.
        </p>
      </div>

      {/* `relative` matters: the screen-reader-only spans in the cells are
          absolutely positioned, and without a containing block here they widen
          the document itself on a phone. */}
      <div className="relative mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">
            Features included in each meniacv plan
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[34%]" />
              {PLANS.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className={cn(
                    "px-6 pt-6 pb-5 text-center align-bottom",
                    // The recommended column is a panel running the whole
                    // height of the table, closed off at the bottom row.
                    plan.featured && "rounded-t-2xl bg-panel",
                  )}
                >
                  <span className="block text-[17px] font-extrabold tracking-tight text-ink">
                    {plan.id.toUpperCase()}
                  </span>
                  <Link
                    href={plan.href}
                    className="mt-2 inline-block text-[13.5px] font-bold text-brand underline underline-offset-4"
                  >
                    {plan.cta}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature}>
                <th
                  scope="row"
                  className="border-t border-black/[0.07] py-4 pr-6 text-[15px] font-bold text-ink"
                >
                  {row.feature}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={PLANS[i].id}
                    className={cn(
                      "border-t border-black/[0.07] px-6 py-4 text-center text-[14.5px] leading-snug text-ink-soft",
                      PLANS[i].featured && "bg-panel",
                    )}
                  >
                    <Cell value={cell} feature={row.feature} />
                  </td>
                ))}
              </tr>
            ))}

            {/* An empty last row so the panel behind the featured column has a
                bottom edge to round off. */}
            <tr aria-hidden="true">
              <td />
              {PLANS.map((plan) => (
                <td
                  key={plan.id}
                  className={cn(
                    "h-4",
                    plan.featured && "rounded-b-2xl bg-panel",
                  )}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({
  value,
  feature,
}: {
  value: string | boolean;
  feature: string;
}) {
  if (value === true) {
    return (
      <>
        <CheckIcon
          className="mx-auto h-5 w-5 text-brand"
          aria-hidden="true"
          strokeWidth={2.5}
        />
        <span className="sr-only">{`${feature}: included`}</span>
      </>
    );
  }

  if (value === false) {
    return (
      <>
        <span aria-hidden="true" className="text-ink-faint">
          —
        </span>
        <span className="sr-only">{`${feature}: not included`}</span>
      </>
    );
  }

  return <span>{value}</span>;
}
