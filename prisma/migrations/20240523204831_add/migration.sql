/*
  Warnings:

  - The `edges` column on the `ReactFlow` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nodes` column on the `ReactFlow` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReactFlow" DROP COLUMN "edges",
ADD COLUMN     "edges" JSONB[],
DROP COLUMN "nodes",
ADD COLUMN     "nodes" JSONB[];
