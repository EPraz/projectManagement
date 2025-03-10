-- CreateEnum
CREATE TYPE "RetroCardType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateTable
CREATE TABLE "RetroCard" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "RetroCardType" NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,

    CONSTRAINT "RetroCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RetroCard" ADD CONSTRAINT "RetroCard_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetroCard" ADD CONSTRAINT "RetroCard_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
