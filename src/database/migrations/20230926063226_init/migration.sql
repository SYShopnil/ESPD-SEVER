-- CreateTable
CREATE TABLE "coach_calender" (
    "id" SERIAL NOT NULL,
    "day" "WeekDays" NOT NULL,
    "start_time" VARCHAR(20) NOT NULL,
    "end_time" VARCHAR(20) NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "coach_calender_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coach_calender" ADD CONSTRAINT "coach_calender_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
