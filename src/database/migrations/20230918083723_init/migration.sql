-- CreateEnum
CREATE TYPE "login_types" AS ENUM ('email', 'facebook', 'google', 'apple');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "login_type" "login_types" DEFAULT 'email',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
