-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "shareSlug" TEXT,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "resumes_shareSlug_key" ON "resumes"("shareSlug");
