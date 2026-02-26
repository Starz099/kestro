-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('TEXT', 'CODE');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'PYTHON', 'JAVASCRIPT', 'CPP');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('TIMER', 'WORDS', 'ZEN', 'TASKS');

-- CreateEnum
CREATE TYPE "EditorMode" AS ENUM ('TEXT', 'VSCODE', 'VIM');

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activity" "ActivityType" NOT NULL,
    "language" "Language" NOT NULL,
    "mode" "Mode" NOT NULL,
    "editor" "EditorMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunConfig" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "timerSeconds" INTEGER,
    "wordCount" INTEGER,
    "taskCount" INTEGER,

    CONSTRAINT "RunConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunResult" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "wpm" DOUBLE PRECISION,
    "rawWpm" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "errors" INTEGER,
    "consistency" DOUBLE PRECISION,
    "tasksCompleted" INTEGER,
    "tasksPerMinute" DOUBLE PRECISION,

    CONSTRAINT "RunResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunSeriesPoint" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "second" INTEGER NOT NULL,
    "wpm" DOUBLE PRECISION,
    "rawWpm" DOUBLE PRECISION,
    "errors" INTEGER,
    "tasksDone" INTEGER,

    CONSTRAINT "RunSeriesPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Run_activity_language_mode_editor_idx" ON "Run"("activity", "language", "mode", "editor");

-- CreateIndex
CREATE INDEX "Run_createdAt_idx" ON "Run"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RunConfig_runId_key" ON "RunConfig"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "RunResult_runId_key" ON "RunResult"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "RunSeriesPoint_runId_second_key" ON "RunSeriesPoint"("runId", "second");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunConfig" ADD CONSTRAINT "RunConfig_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunResult" ADD CONSTRAINT "RunResult_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunSeriesPoint" ADD CONSTRAINT "RunSeriesPoint_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
