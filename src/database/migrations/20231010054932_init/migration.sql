/*
  Warnings:

  - Added the required column `location` to the `features` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeaturesLocation" AS ENUM ('home', 'work_at_espd', 'work_at_espd_body');

-- AlterTable
ALTER TABLE "features" ADD COLUMN     "location" "FeaturesLocation" NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "repeated_student" INTEGER,
ADD COLUMN     "tution_hours" INTEGER;
