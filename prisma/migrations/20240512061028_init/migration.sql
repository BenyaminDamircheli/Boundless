-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactFlow" (
    "id" SERIAL NOT NULL,
    "flow" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReactFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "AI" JSONB,
    "AIRecommendations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flowchats" (
    "id" SERIAL NOT NULL,
    "chats" JSONB NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Flowchats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactFlowChanges" (
    "id" SERIAL NOT NULL,
    "changes" JSONB NOT NULL,
    "reactFlowId" INTEGER NOT NULL,

    CONSTRAINT "ReactFlowChanges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReactFlow" ADD CONSTRAINT "ReactFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flowchats" ADD CONSTRAINT "Flowchats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactFlowChanges" ADD CONSTRAINT "ReactFlowChanges_reactFlowId_fkey" FOREIGN KEY ("reactFlowId") REFERENCES "ReactFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
