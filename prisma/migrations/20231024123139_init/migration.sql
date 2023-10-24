-- CreateTable
CREATE TABLE "Schema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schemaId" INTEGER,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Component_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Component" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
