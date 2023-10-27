/*
  Warnings:

  - You are about to drop the column `name` on the `Component` table. All the data in the column will be lost.
  - Added the required column `componentSchemaId` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Made the column `schemaId` on table `Component` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "ComponentSchema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContainerComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "ContainerComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TextComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    CONSTRAINT "TextComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    CONSTRAINT "ImageComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schemaId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "componentSchemaId" INTEGER NOT NULL,
    CONSTRAINT "Component_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContainerComponent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Component_componentSchemaId_fkey" FOREIGN KEY ("componentSchemaId") REFERENCES "ComponentSchema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("id", "parentId", "schemaId") SELECT "id", "parentId", "schemaId" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
