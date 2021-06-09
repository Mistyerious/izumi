/*
  Warnings:

  - The primary key for the `warns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `warns` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(22)`.
  - Added the required column `guildId` to the `warns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "warns" DROP CONSTRAINT "warns_pkey",
ADD COLUMN     "guildId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(22),
ADD PRIMARY KEY ("id");
