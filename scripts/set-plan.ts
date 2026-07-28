// Puts an account on a plan, by hand.
//
// There is no checkout yet, so this is the only way a subscription row gets
// written. It's also the way to test the limits: run it, reload, and the app
// behaves as that plan.
//
//   npm run plan -- someone@example.com ultimate
//   npm run plan -- someone@example.com basic --days 30
//   npm run plan -- someone@example.com free            (drops the row)
//
// `--days` sets `currentPeriodEnd` that far out, which is what a real renewal
// would do. Without it the plan has no end date and runs until changed.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { PLANS, type PlanId } from "../lib/plans";

async function main() {
  const [email, plan, ...rest] = process.argv.slice(2);
  const days = Number(rest[rest.indexOf("--days") + 1]) || null;

  if (!email || !PLANS.some((p) => p.id === plan)) {
    const ids = PLANS.map((p) => p.id).join(" | ");
    throw new Error(`usage: npm run plan -- <email> <${ids}> [--days N]`);
  }

  // The direct connection, like the migrations use — this runs from a shell,
  // not from the app, so there's no pooler in the way.
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error(`No account for ${email} — they must sign in once first.`);
    }

    // Free is the absence of a subscription, not a subscription to nothing, so
    // going back to it removes the row rather than writing "free" into it.
    if (plan === "free") {
      await prisma.subscription.deleteMany({ where: { userId: user.id } });
      console.log(`${email} is on the free plan.`);
      return;
    }

    const currentPeriodEnd = days
      ? new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      : null;

    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, plan: plan as PlanId, currentPeriodEnd },
      update: {
        plan: plan as PlanId,
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodEnd,
      },
    });

    const until = currentPeriodEnd
      ? ` until ${currentPeriodEnd.toDateString()}`
      : "";
    console.log(`${email} is on ${plan}${until}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
