-- AddForeignKey
ALTER TABLE "exam_board_on_teachers" ADD CONSTRAINT "exam_board_on_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_board_on_teachers" ADD CONSTRAINT "exam_board_on_teachers_exam_board_id_fkey" FOREIGN KEY ("exam_board_id") REFERENCES "exam_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
