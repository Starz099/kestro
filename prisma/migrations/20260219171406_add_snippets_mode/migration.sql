-- AlterEnum
ALTER TYPE "Mode" ADD VALUE 'SNIPPETS';

-- AlterTable
ALTER TABLE "RunConfig" ADD COLUMN     "snippetCount" INTEGER;

-- AlterTable
ALTER TABLE "RunResult" ADD COLUMN     "snippetsCompleted" INTEGER,
ADD COLUMN     "snippetsPerMinute" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RunSeriesPoint" ADD COLUMN     "snippetsDone" INTEGER;
