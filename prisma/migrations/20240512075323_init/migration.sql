/*
  Warnings:

  - Added the required column `title` to the `ReactFlow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReactFlow" ADD COLUMN     "title" TEXT NOT NULL;
