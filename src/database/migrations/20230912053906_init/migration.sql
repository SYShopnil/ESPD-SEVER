/*
  Warnings:

  - You are about to drop the column `experience` on the `TeacherOnboardRequest` table. All the data in the column will be lost.
  - Added the required column `token` to the `TeacherOnboardRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `qts_confered` on table `TeacherOnboardRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_dbs_checked` on table `TeacherOnboardRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `TeacherOnboardRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `TeacherOnboardRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TeacherOnboardRequest" DROP COLUMN "experience",
ADD COLUMN     "token" TEXT NOT NULL,
ALTER COLUMN "qts_confered" SET NOT NULL,
ALTER COLUMN "qts_confered" SET DEFAULT false,
ALTER COLUMN "has_dbs_checked" SET NOT NULL,
ALTER COLUMN "has_dbs_checked" SET DEFAULT false,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "is_dbs_checked" SET DEFAULT false,
ALTER COLUMN "is_super_tutor" SET DEFAULT false;
