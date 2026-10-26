CREATE TABLE "student_verifications" (
  "userId" UUID PRIMARY KEY,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE "student_email_limits" (
  "key" TEXT PRIMARY KEY,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "lastSentAt" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL
);
CREATE TABLE "student_claims" (
  "userId" UUID PRIMARY KEY,
  "emailHash" TEXT NOT NULL UNIQUE,
  "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL
);

-- These records are only accessible through the server's database connection.
-- Supabase's public anon/authenticated API roles must never read or mutate them.
ALTER TABLE "student_verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_email_limits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_claims" ENABLE ROW LEVEL SECURITY;
