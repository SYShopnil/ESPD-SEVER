/*
  Warnings:

  - You are about to drop the column `isPopular` on the `subjects` table. All the data in the column will be lost.
  - Added the required column `is_popular` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "isPopular",
ADD COLUMN     "is_popular" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);
