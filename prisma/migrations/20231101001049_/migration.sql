/*
  Warnings:

  - You are about to drop the column `activated` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "activated";

-- CreateIndex
CREATE UNIQUE INDEX "User_activationCode_key" ON "User"("activationCode");
