-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CANCEL', 'COMPLETE', 'UPCOMING');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'UPCOMING';
