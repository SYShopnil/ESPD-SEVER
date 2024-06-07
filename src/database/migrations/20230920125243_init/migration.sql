/*
  Warnings:

  - You are about to drop the column `qualificationId` on the `teachers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_qualificationId_fkey";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "qualificationId";

-- AddForeignKey
ALTER TABLE "qualifications" ADD CONSTRAINT "qualifications_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
