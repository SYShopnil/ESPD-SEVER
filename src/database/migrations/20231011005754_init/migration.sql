/*
  Warnings:

  - Added the required column `exam_board_id` to the `subject_offereds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subject_offereds" ADD COLUMN     "exam_board_id" INTEGER;

-- AddForeignKey
ALTER TABLE "subject_offereds" ADD CONSTRAINT "subject_offereds_exam_board_id_fkey" FOREIGN KEY ("exam_board_id") REFERENCES "exam_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
