-- DropForeignKey
ALTER TABLE "booking_memebers" DROP CONSTRAINT "booking_memebers_booking_id_fkey";

-- CreateTable
CREATE TABLE "level_costs" (
    "id" SERIAL NOT NULL,
    "no_of_member" INTEGER NOT NULL,
    "cost_per_student" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,
    "tutors_cut" INTEGER NOT NULL,

    CONSTRAINT "level_costs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_memebers" ADD CONSTRAINT "booking_memebers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_costs" ADD CONSTRAINT "level_costs_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
