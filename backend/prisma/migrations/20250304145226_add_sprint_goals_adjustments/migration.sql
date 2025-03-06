/*
  Warnings:

  - You are about to drop the column `status` on the `SprintGoal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SprintGoal" DROP COLUMN "status",
ADD COLUMN     "goalsStatus" "GoalStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- CreateTable
CREATE TABLE "GoalTask" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GoalTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoalTask" ADD CONSTRAINT "GoalTask_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "SprintGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
