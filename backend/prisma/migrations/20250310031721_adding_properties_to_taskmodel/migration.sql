-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "completedHours" DOUBLE PRECISION,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "remainingHours" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
