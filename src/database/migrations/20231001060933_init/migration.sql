-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "exam_board_id" INTEGER;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_exam_board_id_fkey" FOREIGN KEY ("exam_board_id") REFERENCES "exam_boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
