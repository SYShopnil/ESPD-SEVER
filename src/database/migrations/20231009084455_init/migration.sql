-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "author_image" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "student_image" TEXT,
ADD COLUMN     "student_name" TEXT,
ALTER COLUMN "student_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "reset_password" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("id")
);
