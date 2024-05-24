/*
  Warnings:

  - Added the required column `parentFlowId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "parentFlowId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_parentFlowId_fkey" FOREIGN KEY ("parentFlowId") REFERENCES "ReactFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
