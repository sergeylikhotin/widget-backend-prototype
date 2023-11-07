/*
  Warnings:

  - You are about to drop the column `componentSchemaId` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the `ComponentSchema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataBindedComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataSourceComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TextComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_componentSchemaId_fkey";

-- DropForeignKey
ALTER TABLE "DataBindedComponent" DROP CONSTRAINT "DataBindedComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceComponent" DROP CONSTRAINT "DataSourceComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "ImageComponent" DROP CONSTRAINT "ImageComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "TextComponent" DROP CONSTRAINT "TextComponent_id_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "componentSchemaId",
ADD COLUMN     "bindings" JSONB,
ADD COLUMN     "props" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Unknown';

-- DropTable
DROP TABLE "ComponentSchema";

-- DropTable
DROP TABLE "DataBindedComponent";

-- DropTable
DROP TABLE "DataSourceComponent";

-- DropTable
DROP TABLE "ImageComponent";

-- DropTable
DROP TABLE "TextComponent";

-- DropEnum
DROP TYPE "ComponentType";
