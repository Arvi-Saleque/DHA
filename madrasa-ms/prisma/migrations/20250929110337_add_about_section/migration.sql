-- CreateTable
CREATE TABLE "public"."AboutSection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mission" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "yearEstablished" TEXT NOT NULL DEFAULT '2010',
    "totalStudents" TEXT NOT NULL DEFAULT '500+',
    "graduatedStudents" TEXT NOT NULL DEFAULT '1200+',
    "qualifiedTeachers" TEXT NOT NULL DEFAULT '25',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);
