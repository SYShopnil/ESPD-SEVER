/*
  Warnings:

  - You are about to drop the column `amount` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `booking_members` table. All the data in the column will be lost.
  - You are about to drop the column `suuport_message` on the `booking_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking_members" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "duration",
DROP COLUMN "payment_status",
DROP COLUMN "start_time",
DROP COLUMN "status",
DROP COLUMN "suuport_message";
