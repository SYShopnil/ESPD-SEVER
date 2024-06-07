/*
  Warnings:

  - Added the required column `experience` to the `TeacherOnboardRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherOnboardRequest" ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "work_email" TEXT;
