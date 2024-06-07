/*
  Warnings:

  - You are about to drop the column `student_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `subject_level_offerd_id` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_student_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_subject_level_offerd_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "student_id",
DROP COLUMN "subject_level_offerd_id",
ADD COLUMN     "level_id" INTEGER,
ADD COLUMN     "subject_id" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
