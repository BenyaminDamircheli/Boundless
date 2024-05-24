/*
  Warnings:

  - Changed the type of `edges` on the `ReactFlow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nodes` on the `ReactFlow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ReactFlow" DROP COLUMN "edges",
ADD COLUMN     "edges" JSONB NOT NULL,
DROP COLUMN "nodes",
ADD COLUMN     "nodes" JSONB NOT NULL;
