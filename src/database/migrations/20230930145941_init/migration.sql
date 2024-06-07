/*
  Warnings:

  - You are about to drop the `booking_memebers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_memebers" DROP CONSTRAINT "booking_memebers_booking_id_fkey";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "short_desc" TEXT;

-- DropTable
DROP TABLE "booking_memebers";

-- CreateTable
CREATE TABLE "booking_members" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "duration" INTEGER,
    "suuport_message" VARCHAR(200),
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "amount" INTEGER,
    "booking_id" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "booking_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_members" ADD CONSTRAINT "booking_members_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_members" ADD CONSTRAINT "booking_members_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
