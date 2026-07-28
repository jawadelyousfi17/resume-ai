-- CreateEnum
CREATE TYPE "FeedbackKind" AS ENUM ('bug', 'idea', 'praise', 'other');

-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "kind" "FeedbackKind" NOT NULL DEFAULT 'other',
    "message" TEXT NOT NULL,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_createdAt_idx" ON "feedback"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
