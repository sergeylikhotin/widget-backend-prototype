/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CaslAbility` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('can', 'cannot');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('read', 'create', 'update', 'delete', 'manage');

-- DropForeignKey
ALTER TABLE "CaslAbility" DROP CONSTRAINT "CaslAbility_sharedWithId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CaslAbility";

-- DropEnum
DROP TYPE "CaslAction";

-- DropEnum
DROP TYPE "CaslModels";

-- DropEnum
DROP TYPE "CaslPermissionType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "type" "PermissionType" NOT NULL,
    "modelName" TEXT NOT NULL,
    "sharedWithId" INTEGER,
    "resourceId" INTEGER,
    "roleId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
