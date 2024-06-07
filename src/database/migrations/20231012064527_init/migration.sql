-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "exam_board_id" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_exam_board_id_fkey" FOREIGN KEY ("exam_board_id") REFERENCES "exam_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
