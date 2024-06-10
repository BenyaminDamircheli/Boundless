/*
  Warnings:

  - You are about to drop the `ReactFlow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReactFlow" DROP CONSTRAINT "ReactFlow_userId_fkey";

-- DropTable
DROP TABLE "ReactFlow";

-- CreateTable
CREATE TABLE "Wiki" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nodes" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "quickAnswer" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wiki" ADD CONSTRAINT "Wiki_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
