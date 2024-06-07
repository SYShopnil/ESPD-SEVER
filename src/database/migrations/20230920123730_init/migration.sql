-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "qualificationId" INTEGER;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "qualifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
