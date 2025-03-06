-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'AT_RISK');

-- CreateTable
CREATE TABLE "SprintGoal" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "GoalStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SprintGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprintGoal" ADD CONSTRAINT "SprintGoal_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
