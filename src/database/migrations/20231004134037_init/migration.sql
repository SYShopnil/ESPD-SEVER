/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `short_desc` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "short_desc" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
