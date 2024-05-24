/*
  Warnings:

  - You are about to drop the `Flowchats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactFlowChanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Flowchats" DROP CONSTRAINT "Flowchats_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_parentFlowId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReactFlowChanges" DROP CONSTRAINT "ReactFlowChanges_reactFlowId_fkey";

-- DropTable
DROP TABLE "Flowchats";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "ReactFlowChanges";
