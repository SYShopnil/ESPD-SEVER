-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(200) NOT NULL,
    "profile_photo" VARCHAR(200),
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "experience" INTEGER NOT NULL,
    "is_dbs_checked" BOOLEAN NOT NULL,
    "is_super_tutor" BOOLEAN NOT NULL,
    "bio" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200),
    "price_one_to_one" INTEGER NOT NULL,
    "price_group" INTEGER NOT NULL,
    "address_line_1" VARCHAR(200),
    "address_line_2" VARCHAR(200),
    "city" VARCHAR(200),
    "postal_code" VARCHAR(200),
    "country" VARCHAR(200),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualifications" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "university_name" VARCHAR(200) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "degree" VARCHAR(200) NOT NULL,

    CONSTRAINT "qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "find_tutors" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200),

    CONSTRAINT "find_tutors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(200) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "email" VARCHAR(200),
    "phone" VARCHAR(200),

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "desc" VARCHAR(200),
    "student_name" VARCHAR(200) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "school" VARCHAR(200) NOT NULL,
    "image" VARCHAR(200),
    "sort_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_hours" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "slot" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(200) NOT NULL,
    "answer" VARCHAR(200) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_addresses" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "address_line_1" VARCHAR(200),
    "address_line_2" VARCHAR(200),
    "city" VARCHAR(200),
    "postal_cdoe" VARCHAR(200),
    "country" VARCHAR(200),

    CONSTRAINT "billing_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "profile_photo" VARCHAR(200),
    "address_line_1" VARCHAR(200),
    "address_line_2" VARCHAR(200),
    "city" VARCHAR(200),
    "postal_cdoe" VARCHAR(200),
    "country" VARCHAR(200),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "desc" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_board_on_teachers" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "exam_board_id" INTEGER NOT NULL,

    CONSTRAINT "exam_board_on_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_boards" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "logo" VARCHAR(200) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "exam_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booked_students" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "grouped_student_id" INTEGER NOT NULL,

    CONSTRAINT "booked_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,
    "booking_type" VARCHAR(200),
    "no_of_member" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "suuport_message" VARCHAR(200),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_on_subjects" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_on_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "isPopular" BOOLEAN NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_offereds" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,

    CONSTRAINT "subject_offereds_pkey" PRIMARY KEY ("id")
);
