-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
