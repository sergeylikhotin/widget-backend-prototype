/*
  Warnings:

  - Changed the type of `type` on the `ActionParam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `ComponentSchema` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `DataSource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('Tournament', 'Realtime', 'Info');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('Container', 'Text', 'Image');

-- CreateEnum
CREATE TYPE "ActionParamType" AS ENUM ('String', 'Number', 'Boolean', 'Date', 'JSON');

-- AlterTable
ALTER TABLE "ActionParam" DROP COLUMN "type",
ADD COLUMN     "type" "ActionParamType" NOT NULL;

-- AlterTable
ALTER TABLE "ComponentSchema" DROP COLUMN "type",
ADD COLUMN     "type" "ComponentType" NOT NULL;

-- AlterTable
ALTER TABLE "DataSource" DROP COLUMN "type",
ADD COLUMN     "type" "DataSourceType" NOT NULL;
