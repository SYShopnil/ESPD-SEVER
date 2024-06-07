/*
  Warnings:

  - The values [SAT,SUN,MON,TUE,WED,THU,FRI] on the enum `WeekDays` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WeekDays_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
ALTER TABLE "weekly_hours" ALTER COLUMN "day" TYPE "WeekDays_new" USING ("day"::text::"WeekDays_new");
ALTER TYPE "WeekDays" RENAME TO "WeekDays_old";
ALTER TYPE "WeekDays_new" RENAME TO "WeekDays";
DROP TYPE "WeekDays_old";
COMMIT;
