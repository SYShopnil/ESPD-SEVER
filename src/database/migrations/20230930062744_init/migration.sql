/*
  Warnings:

  - A unique constraint covering the columns `[work_email]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `no_of_member` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "no_of_member" SET NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "work_email" VARCHAR(200);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_work_email_key" ON "teachers"("work_email");
