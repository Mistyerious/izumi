/*
  Warnings:

  - Added the required column `userId` to the `warns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "warns" ADD COLUMN     "userId" TEXT NOT NULL;
