-- CreateTable
CREATE TABLE "public"."HeroSection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "bgImageUrl" TEXT NOT NULL,
    "cta1Text" TEXT NOT NULL,
    "cta1Href" TEXT NOT NULL,
    "cta2Text" TEXT NOT NULL,
    "cta2Href" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);
