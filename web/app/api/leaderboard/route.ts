import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const toEnum = (value: string | null) =>
  value ? value.toUpperCase().replace("+", "P") : null;

const LANGUAGES = ["ENGLISH", "PYTHON", "JAVASCRIPT", "CPP"] as const;
const MODES = ["TIMER", "WORDS", "ZEN", "TASKS"] as const;
const EDITORS = ["TEXT", "VSCODE", "VIM"] as const;

const normalizeEnum = <T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
) => {
  const normalized = toEnum(value);
  if (normalized && allowed.includes(normalized as T)) {
    return normalized as T;
  }

  return fallback;
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const mode = normalizeEnum(searchParams.get("mode"), MODES, "TIMER");
  const language = normalizeEnum(
    searchParams.get("language"),
    LANGUAGES,
    "ENGLISH",
  );
  const editor = normalizeEnum(searchParams.get("editor"), EDITORS, "TEXT");
  const timerParam = searchParams.get("timer");
  const timerSeconds = timerParam ? Number(timerParam) : null;

  const configFilter =
    Number.isFinite(timerSeconds) && timerSeconds !== null
      ? { is: { timerSeconds } }
      : undefined;

  const runs = await prisma.run.findMany({
    where: {
      activity: "TEXT",
      language,
      mode,
      editor,
      config: configFilter,
      result: {
        is: {
          wpm: { not: null },
        },
      },
    },
    include: {
      user: { select: { username: true } },
      result: {
        select: {
          wpm: true,
          accuracy: true,
          rawWpm: true,
          consistency: true,
        },
      },
    },
    orderBy: {
      result: { wpm: "desc" },
    },
    take: 100,
  });

  const data = runs.map((run, index) => ({
    rank: index + 1,
    name: run.user.username,
    wpm: run.result?.wpm ?? 0,
    accuracy: run.result?.accuracy ?? 0,
    raw: run.result?.rawWpm ?? 0,
    consistency: run.result?.consistency ?? 0,
    date: formatDate(run.createdAt),
  }));

  return NextResponse.json({ data });
};
