-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_featureId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "projectId" TEXT,
ALTER COLUMN "featureId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
