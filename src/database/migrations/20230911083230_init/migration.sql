/*
  Warnings:

  - The `day` column on the `weekly_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `slot` column on the `weekly_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "Slots" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- AlterTable
ALTER TABLE "weekly_hours" DROP COLUMN "day",
ADD COLUMN     "day" "WeekDays",
DROP COLUMN "slot",
ADD COLUMN     "slot" "Slots";

-- AddForeignKey
ALTER TABLE "weekly_hours" ADD CONSTRAINT "weekly_hours_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
