/*
  Warnings:

  - Added the required column `description` to the `MoneyAdded` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyAdded" ADD COLUMN     "description" TEXT NOT NULL;
