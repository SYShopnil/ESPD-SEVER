/*
  Warnings:

  - The `booking_type` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingTypes" AS ENUM ('One_To_One', 'One_To_Group');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "booking_type",
ADD COLUMN     "booking_type" "BookingTypes" NOT NULL DEFAULT 'One_To_One';

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "subject_id" INTEGER,
    "level_id" INTEGER,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
