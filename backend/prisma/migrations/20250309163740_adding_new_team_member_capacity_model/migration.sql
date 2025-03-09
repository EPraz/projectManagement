-- CreateTable
CREATE TABLE "TeamMemberCapacity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "daysOff" INTEGER NOT NULL,
    "remainingWork" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMemberCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMemberCapacity_userId_sprintId_key" ON "TeamMemberCapacity"("userId", "sprintId");

-- AddForeignKey
ALTER TABLE "TeamMemberCapacity" ADD CONSTRAINT "TeamMemberCapacity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberCapacity" ADD CONSTRAINT "TeamMemberCapacity_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
