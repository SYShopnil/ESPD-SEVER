-- AlterTable
ALTER TABLE "students" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
