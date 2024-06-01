/*
  Warnings:

  - Added the required column `quickAnswer` to the `ReactFlow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReactFlow" ADD COLUMN     "quickAnswer" TEXT NOT NULL;
