/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `otp_verifications` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `otp_verifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "otp_verifications" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otp_verifications_email_key" ON "otp_verifications"("email");
