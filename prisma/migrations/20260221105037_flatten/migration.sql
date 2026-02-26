/*
  Warnings:

  - You are about to drop the `RunConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunResult` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RunConfig" DROP CONSTRAINT "RunConfig_runId_fkey";

-- DropForeignKey
ALTER TABLE "RunResult" DROP CONSTRAINT "RunResult_runId_fkey";

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "codingWpm" DOUBLE PRECISION,
ADD COLUMN     "consistency" DOUBLE PRECISION,
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "errors" INTEGER,
ADD COLUMN     "rawWpm" DOUBLE PRECISION,
ADD COLUMN     "snippetCount" INTEGER,
ADD COLUMN     "snippetsCompleted" INTEGER,
ADD COLUMN     "snippetsPerMinute" DOUBLE PRECISION,
ADD COLUMN     "taskCount" INTEGER,
ADD COLUMN     "tasksCompleted" INTEGER,
ADD COLUMN     "tasksPerMinute" DOUBLE PRECISION,
ADD COLUMN     "timerSeconds" INTEGER,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "wordCount" INTEGER,
ADD COLUMN     "wpm" DOUBLE PRECISION;

-- DropTable
DROP TABLE "RunConfig";

-- DropTable
DROP TABLE "RunResult";
