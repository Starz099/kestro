import { NextRequest, NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type RunPayload = {
  activity: string;
  language: string;
  mode: string;
  editor: string;
  config?: {
    timerSeconds?: number;
    wordCount?: number;
    taskCount?: number;
    snippetCount?: number;
  };
  result: {
    durationSeconds: number;
    wpm?: number;
    rawWpm?: number;
    accuracy?: number;
    errors?: number;
    consistency?: number;
    tasksCompleted?: number;
    tasksPerMinute?: number;
    snippetsCompleted?: number;
    snippetsPerMinute?: number;
    codingWpm?: number;
  };
  series?: Array<{
    second: number;
    wpm?: number;
    rawWpm?: number;
    errors?: number;
    tasksDone?: number;
    snippetsDone?: number;
    code?: string;
    isCorrect?: boolean;
  }>;
};

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as RunPayload | null;

  if (!body || !body.activity || !body.language || !body.mode || !body.editor) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  if (!body.result || typeof body.result.durationSeconds !== "number") {
    return new NextResponse("Invalid result", { status: 400 });
  }

  const clerkUser = await currentUser();
  const metadataUsername =
    typeof clerkUser?.publicMetadata?.username === "string"
      ? clerkUser.publicMetadata.username
      : null;
  const username = clerkUser?.username ?? metadataUsername;

  if (!username) {
    return new NextResponse("Username missing", { status: 400 });
  }

  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      username,
    },
  });

  // Calculate codingWpm if activity is CODE and not provided
  let codingWpm = body.result?.codingWpm ?? null;
  if (
    body.activity === "CODE" &&
    (codingWpm === null || codingWpm === undefined)
  ) {
    // Calculate codingWpm: total letters in completed snippets / 5 / (durationSeconds / 60)
    let totalLetters = 0;
    if (Array.isArray(body.series)) {
      // If series contains completed snippets with code, sum their lengths
      const codes = body.series.map((s) => s.code).filter(Boolean);
      console.log("Completed snippet codes:", codes);
      totalLetters = codes.reduce((sum, code) => sum + code.length, 0);
    }
    // Fallback: if series not available, estimate with snippetsCompleted * avg snippet length
    if (
      totalLetters === 0 &&
      body.result.snippetsCompleted &&
      body.result.snippetsCompleted > 0
    ) {
      totalLetters = body.result.snippetsCompleted * 40; // Assume avg snippet length 40
    }
    const durationSeconds = body.result.durationSeconds;
    codingWpm =
      durationSeconds > 0 ? totalLetters / 5 / (durationSeconds / 60) : 0;
  }

  const run = await prisma.run.create({
    data: {
      userId: dbUser.id,
      username,
      activity: body.activity as never,
      language: body.language as never,
      mode: body.mode as never,
      editor: body.editor as never,
      timerSeconds: body.config?.timerSeconds ?? null,
      wordCount: body.config?.wordCount ?? null,
      taskCount: body.config?.taskCount ?? null,
      snippetCount: body.config?.snippetCount ?? null,
      durationSeconds: body.result.durationSeconds,
      wpm: body.result.wpm ?? null,
      rawWpm: body.result.rawWpm ?? null,
      accuracy: body.result.accuracy ?? null,
      errors: body.result.errors ?? null,
      consistency: body.result.consistency ?? null,
      tasksCompleted: body.result.tasksCompleted ?? null,
      tasksPerMinute: body.result.tasksPerMinute ?? null,
      snippetsCompleted: body.result.snippetsCompleted ?? null,
      snippetsPerMinute: body.result.snippetsPerMinute ?? null,
      codingWpm,
      // runSeriesPoints creation (series) can be handled separately if needed
    },
    select: { id: true },
  });

  return NextResponse.json({ id: run.id });
};
