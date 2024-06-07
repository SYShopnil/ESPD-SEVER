-- CreateTable
CREATE TABLE "TeacherOnboardRequest" (
    "id" SERIAL NOT NULL,
    "qts_confered" BOOLEAN,
    "has_3years_exp" BOOLEAN,
    "has_dbs_checked" BOOLEAN,
    "email" TEXT,
    "phone" TEXT,
    "linkedin_url" TEXT,

    CONSTRAINT "TeacherOnboardRequest_pkey" PRIMARY KEY ("id")
);
