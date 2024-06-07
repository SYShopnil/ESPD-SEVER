/*
  Warnings:

  - You are about to drop the column `level_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_level_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_subject_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "level_id",
DROP COLUMN "subject_id",
ADD COLUMN     "subject_level_offerd_id" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_subject_level_offerd_id_fkey" FOREIGN KEY ("subject_level_offerd_id") REFERENCES "subject_offereds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
