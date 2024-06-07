/*
  Warnings:

  - You are about to drop the `coach_calender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "coach_calender" DROP CONSTRAINT "coach_calender_teacher_id_fkey";

-- DropTable
DROP TABLE "coach_calender";

-- CreateTable
CREATE TABLE "teacher_calender" (
    "id" SERIAL NOT NULL,
    "day" "WeekDays" NOT NULL,
    "start_time" VARCHAR(20) NOT NULL,
    "end_time" VARCHAR(20) NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_calender_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacher_calender" ADD CONSTRAINT "teacher_calender_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
