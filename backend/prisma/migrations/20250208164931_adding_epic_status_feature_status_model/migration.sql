-- AlterTable
ALTER TABLE "Epic" ADD COLUMN     "statusId" TEXT;

-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "statusId" TEXT;

-- CreateTable
CREATE TABLE "EpicStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "EpicStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "FeatureStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EpicStatus_name_key" ON "EpicStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureStatus_name_key" ON "FeatureStatus"("name");

-- AddForeignKey
ALTER TABLE "Epic" ADD CONSTRAINT "Epic_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "EpicStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "FeatureStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpicStatus" ADD CONSTRAINT "EpicStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureStatus" ADD CONSTRAINT "FeatureStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
