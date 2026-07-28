-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "celebratedAt" TIMESTAMP(3),
ADD COLUMN     "earlySupporter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supporterNumber" INTEGER;

-- The first hundred accounts get Ultimate for a year, on the house. Everyone
-- who signs in from now on is granted it by `grantEarlySupporter()` in
-- lib/subscription.ts; this hands the same thing to the accounts that already
-- existed, in the order they joined. Anyone already carrying a subscription
-- keeps it — `ON CONFLICT DO NOTHING` leaves their row alone.
INSERT INTO "subscriptions" (
    "id", "userId", "plan", "status", "cycle",
    "currentPeriodEnd", "earlySupporter", "supporterNumber",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid(), ranked."id", 'ultimate', 'active', 'yearly',
    NOW() + INTERVAL '1 year', true, ranked."place",
    NOW(), NOW()
FROM (
    SELECT u."id", ROW_NUMBER() OVER (ORDER BY u."createdAt", u."id") AS place
    FROM "users" u
) ranked
WHERE ranked."place" <= 100
ON CONFLICT ("userId") DO NOTHING;
