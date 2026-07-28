/*
  Warnings:

  - You are about to drop the column `kind` on the `feedback` table. All the data in the column will be lost.
  - Added the required column `rating` to the `feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedback" DROP COLUMN "kind",
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- DropEnum
DROP TYPE "FeedbackKind";
