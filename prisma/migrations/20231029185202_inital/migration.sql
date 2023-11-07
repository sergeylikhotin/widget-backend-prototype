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
    "type" TEXT NOT NULL,
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
CREATE TABLE "MaincastTournamentDataSource" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "MaincastTournamentDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dota2APITournamentDataSource" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "Dota2APITournamentDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentSchema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ComponentSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "schemaId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "componentSchemaId" INTEGER NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContainerComponent" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "ContainerComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextComponent" (
    "id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TextComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageComponent" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataBindedComponent" (
    "id" INTEGER NOT NULL,
    "bindings" TEXT NOT NULL,

    CONSTRAINT "DataBindedComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceComponent" (
    "id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "DataSourceComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsContainer" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "EventsContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "eventsComponentId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionParam" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" INTEGER,

    CONSTRAINT "ActionParam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schema_widgetId_key" ON "Schema"("widgetId");

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentDataSource" ADD CONSTRAINT "TournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaincastTournamentDataSource" ADD CONSTRAINT "MaincastTournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dota2APITournamentDataSource" ADD CONSTRAINT "Dota2APITournamentDataSource_id_fkey" FOREIGN KEY ("id") REFERENCES "TournamentDataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
