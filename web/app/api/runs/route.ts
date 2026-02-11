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
  };
  series?: Array<{
    second: number;
    wpm?: number;
    rawWpm?: number;
    errors?: number;
    tasksDone?: number;
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

  const hasConfig =
    body.config &&
    (body.config.timerSeconds !== undefined ||
      body.config.wordCount !== undefined ||
      body.config.taskCount !== undefined);
  const hasSeries = Array.isArray(body.series) && body.series.length > 0;

  const run = await prisma.run.create({
    data: {
      userId: dbUser.id,
      activity: body.activity as never,
      language: body.language as never,
      mode: body.mode as never,
      editor: body.editor as never,
      config: hasConfig
        ? {
            create: {
              timerSeconds: body.config?.timerSeconds ?? null,
              wordCount: body.config?.wordCount ?? null,
              taskCount: body.config?.taskCount ?? null,
            },
          }
        : undefined,
      result: {
        create: {
          durationSeconds: body.result.durationSeconds,
          wpm: body.result.wpm ?? null,
          rawWpm: body.result.rawWpm ?? null,
          accuracy: body.result.accuracy ?? null,
          errors: body.result.errors ?? null,
          consistency: body.result.consistency ?? null,
          tasksCompleted: body.result.tasksCompleted ?? null,
          tasksPerMinute: body.result.tasksPerMinute ?? null,
        },
      },
      series: hasSeries
        ? {
            createMany: {
              data: body.series!.map((point) => ({
                second: point.second,
                wpm: point.wpm ?? null,
                rawWpm: point.rawWpm ?? null,
                errors: point.errors ?? null,
                tasksDone: point.tasksDone ?? null,
              })),
            },
          }
        : undefined,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: run.id });
};
