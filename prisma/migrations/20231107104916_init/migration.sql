-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'customer', 'manager', 'content_manager');

-- CreateEnum
CREATE TYPE "CaslPermissionType" AS ENUM ('can', 'cannot');

-- CreateEnum
CREATE TYPE "CaslAction" AS ENUM ('read', 'create', 'update', 'delete', 'manage');

-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('UNKNOWN', 'ORGANIZATIONAL', 'ROUND_ROBIN', 'SWISS', 'BRACKET_SINGLE', 'BRACKET_DOUBLE_SEED_LOSER', 'BRACKET_DOUBLE_ALL_WINNER', 'SHOWMATCH', 'GSL', 'PLACEMENT');

-- CreateEnum
CREATE TYPE "SeriesType" AS ENUM ('UNKNOWN', 'BEST_OF_ONE', 'BEST_OF_TWO', 'BEST_OF_THREE', 'BEST_OF_FIVE');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('Tournament');

-- CreateEnum
CREATE TYPE "ActionParamType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON');

-- CreateEnum
CREATE TYPE "CaslModels" AS ENUM ('all', 'User', 'Widget', 'Schema', 'Component', 'CaslAbility');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "roles" "Role"[] DEFAULT ARRAY['manager']::"Role"[],
    "activationCode" TEXT,
    "activationCodeExpiration" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaslAbility" (
    "id" SERIAL NOT NULL,
    "role" "Role",
    "action" "CaslAction" NOT NULL,
    "type" "CaslPermissionType" NOT NULL,
    "modelName" "CaslModels" NOT NULL,
    "sharedWithId" INTEGER,
    "resourceId" INTEGER,

    CONSTRAINT "CaslAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "prizePool" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "StageType" NOT NULL DEFAULT 'UNKNOWN',
    "formatDescription" TEXT[],
    "tournamentId" TEXT,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "type" "SeriesType" NOT NULL DEFAULT 'UNKNOWN',
    "team1Id" TEXT,
    "team1Wins" INTEGER NOT NULL,
    "team2Id" TEXT,
    "team2Wins" INTEGER NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "dotaMatchId" INTEGER,
    "team1Score" INTEGER NOT NULL,
    "team2Score" INTEGER NOT NULL,
    "seriesId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "maincastTeamId" INTEGER,
    "dotaTeamId" INTEGER,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DataSourceType" NOT NULL,
    "widgetId" TEXT,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentDataSource" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaincastApiTournamentDataSource" (
    "id" TEXT NOT NULL,
    "leagueIds" TEXT[],

    CONSTRAINT "MaincastApiTournamentDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DotaApiTournamentDataSource" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,

    CONSTRAINT "DotaApiTournamentDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schema" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "schemaId" TEXT NOT NULL,
    "parentId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'Unknown',
    "props" JSONB,
    "bindings" JSONB,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsContainer" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EventsContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "eventsComponentId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionParam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ActionParamType" NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" TEXT,

    CONSTRAINT "ActionParam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_activationCode_key" ON "User"("activationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Schema_widgetId_key" ON "Schema"("widgetId");

-- AddForeignKey
ALTER TABLE "CaslAbility" ADD CONSTRAINT "CaslAbility_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentDataSource" ADD CONSTRAINT "TournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentDataSource" ADD CONSTRAINT "TournamentDataSource_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaincastApiTournamentDataSource" ADD CONSTRAINT "MaincastApiTournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DotaApiTournamentDataSource" ADD CONSTRAINT "DotaApiTournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsContainer" ADD CONSTRAINT "EventsContainer_id_fkey" FOREIGN KEY ("id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventsComponentId_fkey" FOREIGN KEY ("eventsComponentId") REFERENCES "EventsContainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionParam" ADD CONSTRAINT "ActionParam_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;
