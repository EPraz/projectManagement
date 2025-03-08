-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PairProgramming" (
    "id" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PairProgramming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PairProgramming" ADD CONSTRAINT "PairProgramming_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairProgramming" ADD CONSTRAINT "PairProgramming_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
