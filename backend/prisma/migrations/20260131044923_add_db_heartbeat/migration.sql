-- CreateTable
CREATE TABLE "DbHeartbeat" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DbHeartbeat_pkey" PRIMARY KEY ("id")
);
