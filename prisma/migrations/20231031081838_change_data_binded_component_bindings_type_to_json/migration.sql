/*
  Warnings:

  - Changed the type of `bindings` on the `DataBindedComponent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DataBindedComponent" DROP COLUMN "bindings",
ADD COLUMN     "bindings" JSONB NOT NULL;
