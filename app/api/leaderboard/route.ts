import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mode, Language, EditorMode } from "@/lib/generated/prisma/enums";

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode")?.toUpperCase() as Mode | undefined;
  const language = searchParams.get("language")?.toUpperCase() as
    | Language
    | undefined;
  const editor = searchParams.get("editor")?.toUpperCase() as
    | EditorMode
    | undefined;
  const timerSeconds = searchParams.get("timer")
    ? Number(searchParams.get("timer"))
    : undefined;
  const wordCount = searchParams.get("wordCount")
    ? Number(searchParams.get("wordCount"))
    : undefined;
  const snippetCount = searchParams.get("snippetCount")
    ? Number(searchParams.get("snippetCount"))
    : undefined;

  const filter: Record<string, unknown> = {};
  if (language) filter.language = language;
  if (mode) filter.mode = mode;
  if (editor) filter.editor = editor;
  if (timerSeconds !== undefined) filter.timerSeconds = timerSeconds;
  if (wordCount !== undefined) filter.wordCount = wordCount;
  if (snippetCount !== undefined) filter.snippetCount = snippetCount;

  const where = {
    ...filter,
    OR: [{ wpm: { not: null } }, { codingWpm: { not: null } }],
  };

  const runs = await prisma.run.findMany({
    where,
    include: {
      user: { select: { username: true } },
    },
    orderBy: [{ codingWpm: "desc" }, { rawWpm: "desc" }, { wpm: "desc" }],
    take: 100,
  });

  // Group runs by user and select best run by codingWpm for coding, rawWpm for text
  const bestRunsByUser: Record<string, (typeof runs)[0]> = {};
  for (const run of runs) {
    const username = run.user?.username ?? run.username ?? run.userId;
    const isCoding = run.language === "JAVASCRIPT" || run.activity === "CODE";
    const metric = isCoding ? (run.codingWpm ?? 0) : (run.rawWpm ?? 0);
    const currentBest = bestRunsByUser[username];
    const currentMetric = currentBest
      ? isCoding
        ? (currentBest.codingWpm ?? 0)
        : (currentBest.rawWpm ?? 0)
      : 0;
    if (!currentBest || metric > currentMetric) {
      bestRunsByUser[username] = run;
    }
  }
  const bestRuns = Object.values(bestRunsByUser)
    .sort((a, b) => {
      const isCodingA = a.language === "JAVASCRIPT" || a.activity === "CODE";
      const isCodingB = b.language === "JAVASCRIPT" || b.activity === "CODE";
      const metricA = isCodingA ? (a.codingWpm ?? 0) : (a.rawWpm ?? 0);
      const metricB = isCodingB ? (b.codingWpm ?? 0) : (b.rawWpm ?? 0);
      return metricB - metricA;
    })
    .map((run, index) => {
      const isCoding = run.language === "JAVASCRIPT" || run.activity === "CODE";
      if (isCoding) {
        return {
          rank: index + 1,
          name: run.user?.username ?? run.username ?? "Unknown",
          codingWpm: run.codingWpm ?? 0,
          snippetsPerMinute: run.snippetsPerMinute ?? 0,
          snippetsCompleted: run.snippetsCompleted ?? 0,
          durationSeconds: run.durationSeconds ?? 0,
          date: formatDate(run.createdAt),
        };
      } else {
        return {
          rank: index + 1,
          name: run.user?.username ?? run.username ?? "Unknown",
          wpm: run.wpm ?? 0,
          accuracy: run.accuracy ?? 0,
          raw: run.rawWpm ?? 0,
          consistency: run.consistency ?? 0,
          date: formatDate(run.createdAt),
        };
      }
    });

  return NextResponse.json({ data: bestRuns });
};
