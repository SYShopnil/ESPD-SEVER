-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "lesson_group" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lesson_one_to_one" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "booking_memebers" (
    "id" SERIAL NOT NULL,
    "no_of_member" INTEGER,
    "date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "duration" INTEGER,
    "suuport_message" VARCHAR(200),
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "amount" INTEGER,
    "booking_id" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "booking_memebers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_memebers" ADD CONSTRAINT "booking_memebers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
