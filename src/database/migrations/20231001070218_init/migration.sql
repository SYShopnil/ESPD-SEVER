/*
  Warnings:

  - Made the column `duration` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 1,
ALTER COLUMN "suuport_message" SET DATA TYPE VARCHAR(500);
