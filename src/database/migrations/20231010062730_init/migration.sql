/*
  Warnings:

  - Added the required column `contact_email` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "contact_email" TEXT NOT NULL;
