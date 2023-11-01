/*
  Warnings:

  - You are about to drop the `DataSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dota2APITournamentDataSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaincastTournamentDataSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TournamentDataSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ComponentType" ADD VALUE 'DataSource';

-- DropForeignKey
ALTER TABLE "DataSource" DROP CONSTRAINT "DataSource_widgetId_fkey";

-- DropForeignKey
ALTER TABLE "Dota2APITournamentDataSource" DROP CONSTRAINT "Dota2APITournamentDataSource_id_fkey";

-- DropForeignKey
ALTER TABLE "MaincastTournamentDataSource" DROP CONSTRAINT "MaincastTournamentDataSource_id_fkey";

-- DropForeignKey
ALTER TABLE "TournamentDataSource" DROP CONSTRAINT "TournamentDataSource_id_fkey";

-- DropTable
DROP TABLE "DataSource";

-- DropTable
DROP TABLE "Dota2APITournamentDataSource";

-- DropTable
DROP TABLE "MaincastTournamentDataSource";

-- DropTable
DROP TABLE "TournamentDataSource";

-- DropEnum
DROP TYPE "DataSourceType";
