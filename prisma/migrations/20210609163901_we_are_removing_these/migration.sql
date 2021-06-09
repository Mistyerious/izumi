/*
  Warnings:

  - The primary key for the `warns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `warns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "warns" DROP CONSTRAINT "warns_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("caseId");
