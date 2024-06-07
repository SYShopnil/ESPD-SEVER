/*
  Warnings:

  - The values [SATURDAY,SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY] on the enum `WeekDays` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WeekDays_new" AS ENUM ('SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI');
ALTER TABLE "weekly_hours" ALTER COLUMN "day" TYPE "WeekDays_new" USING ("day"::text::"WeekDays_new");
ALTER TYPE "WeekDays" RENAME TO "WeekDays_old";
ALTER TYPE "WeekDays_new" RENAME TO "WeekDays";
DROP TYPE "WeekDays_old";
COMMIT;
