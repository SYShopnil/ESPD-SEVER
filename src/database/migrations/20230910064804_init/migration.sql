/*
  Warnings:

  - You are about to drop the column `has_3years_exp` on the `TeacherOnboardRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeacherOnboardRequest" DROP COLUMN "has_3years_exp",
ADD COLUMN     "experience" TEXT;
