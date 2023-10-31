-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'customer', 'manager', 'content_manager');

-- CreateEnum
CREATE TYPE "CaslPermissionType" AS ENUM ('can', 'cannot');

-- CreateEnum
CREATE TYPE "CaslAction" AS ENUM ('read', 'create', 'update', 'delete', 'manage');

-- CreateEnum
CREATE TYPE "CaslModels" AS ENUM ('all', 'User', 'Widget', 'Schema', 'Component');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['manager']::"Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaslAbility" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "action" "CaslAction" NOT NULL,
    "type" "CaslPermissionType" NOT NULL,
    "modelName" "CaslModels" NOT NULL,
    "sharedWithId" INTEGER,
    "resourceId" INTEGER,

    CONSTRAINT "CaslAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "schemaId" INTEGER,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CaslAbility" ADD CONSTRAINT "CaslAbility_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
