/*
  Warnings:

  - The values [Container] on the enum `ComponentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ContainerComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ComponentType_new" AS ENUM ('Root', 'Base', 'Text', 'Image');
ALTER TABLE "ComponentSchema" ALTER COLUMN "type" TYPE "ComponentType_new" USING ("type"::text::"ComponentType_new");
ALTER TYPE "ComponentType" RENAME TO "ComponentType_old";
ALTER TYPE "ComponentType_new" RENAME TO "ComponentType";
DROP TYPE "ComponentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ContainerComponent" DROP CONSTRAINT "ContainerComponent_id_fkey";

-- DropTable
DROP TABLE "ContainerComponent";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
