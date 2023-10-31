/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ActionParam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Component` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ComponentSchema` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ContainerComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DataBindedComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DataSourceComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EventsContainer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ImageComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Schema` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TextComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ActionParam" DROP CONSTRAINT "ActionParam_actionId_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_componentSchemaId_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_schemaId_fkey";

-- DropForeignKey
ALTER TABLE "ContainerComponent" DROP CONSTRAINT "ContainerComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "DataBindedComponent" DROP CONSTRAINT "DataBindedComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceComponent" DROP CONSTRAINT "DataSourceComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventsComponentId_fkey";

-- DropForeignKey
ALTER TABLE "EventsContainer" DROP CONSTRAINT "EventsContainer_id_fkey";

-- DropForeignKey
ALTER TABLE "ImageComponent" DROP CONSTRAINT "ImageComponent_id_fkey";

-- DropForeignKey
ALTER TABLE "TextComponent" DROP CONSTRAINT "TextComponent_id_fkey";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "eventId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ActionParam" DROP CONSTRAINT "ActionParam_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "actionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ActionParam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Component" DROP CONSTRAINT "Component_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "schemaId" SET DATA TYPE TEXT,
ALTER COLUMN "parentId" SET DATA TYPE TEXT,
ALTER COLUMN "componentSchemaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Component_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Component_id_seq";

-- AlterTable
ALTER TABLE "ComponentSchema" DROP CONSTRAINT "ComponentSchema_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ComponentSchema_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ComponentSchema_id_seq";

-- AlterTable
ALTER TABLE "ContainerComponent" DROP CONSTRAINT "ContainerComponent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContainerComponent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DataBindedComponent" DROP CONSTRAINT "DataBindedComponent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DataBindedComponent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DataSourceComponent" DROP CONSTRAINT "DataSourceComponent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DataSourceComponent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "eventsComponentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EventsContainer" DROP CONSTRAINT "EventsContainer_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EventsContainer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ImageComponent" DROP CONSTRAINT "ImageComponent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ImageComponent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Schema" DROP CONSTRAINT "Schema_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Schema_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Schema_id_seq";

-- AlterTable
ALTER TABLE "TextComponent" DROP CONSTRAINT "TextComponent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TextComponent_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContainerComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_componentSchemaId_fkey" FOREIGN KEY ("componentSchemaId") REFERENCES "ComponentSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContainerComponent" ADD CONSTRAINT "ContainerComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextComponent" ADD CONSTRAINT "TextComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageComponent" ADD CONSTRAINT "ImageComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataBindedComponent" ADD CONSTRAINT "DataBindedComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceComponent" ADD CONSTRAINT "DataSourceComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsContainer" ADD CONSTRAINT "EventsContainer_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventsComponentId_fkey" FOREIGN KEY ("eventsComponentId") REFERENCES "EventsContainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionParam" ADD CONSTRAINT "ActionParam_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;
