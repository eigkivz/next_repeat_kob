/*
  Warnings:

  - Made the column `taxCode` on table `Apartment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Apartment" ALTER COLUMN "taxCode" SET NOT NULL;

-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);
