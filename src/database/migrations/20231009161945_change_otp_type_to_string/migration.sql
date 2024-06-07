/*
  Warnings:

  - You are about to alter the column `otp` on the `reset_password` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "reset_password" ALTER COLUMN "otp" SET DATA TYPE VARCHAR(10);
