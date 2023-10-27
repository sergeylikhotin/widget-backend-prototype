/*
  Warnings:

  - Added the required column `widgetId` to the `Schema` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "widgetId" TEXT,
    CONSTRAINT "DataSource_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TournamentDataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    CONSTRAINT "TournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "DataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaincastTournamentDataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    CONSTRAINT "MaincastTournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dota2APITournamentDataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    CONSTRAINT "Dota2APITournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataBindedComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bindings" TEXT NOT NULL,
    CONSTRAINT "DataBindedComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataSourceComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    CONSTRAINT "DataSourceComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventsContainer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "EventsContainer_id_fkey" FOREIGN KEY ("id") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "eventsComponentId" INTEGER,
    CONSTRAINT "Event_eventsComponentId_fkey" FOREIGN KEY ("eventsComponentId") REFERENCES "EventsContainer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "eventId" INTEGER,
    CONSTRAINT "Action_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActionParam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" INTEGER,
    CONSTRAINT "ActionParam_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,
    CONSTRAINT "Schema_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schema" ("id", "name") SELECT "id", "name" FROM "Schema";
DROP TABLE "Schema";
ALTER TABLE "new_Schema" RENAME TO "Schema";
CREATE UNIQUE INDEX "Schema_widgetId_key" ON "Schema"("widgetId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
