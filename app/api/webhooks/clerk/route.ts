import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();

  const svix_id = headersList.get("svix-id")!;
  const svix_timestamp = headersList.get("svix-timestamp")!;
  const svix_signature = headersList.get("svix-signature")!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const user = evt.data;
    const metadataUsername =
      typeof user.public_metadata?.username === "string"
        ? user.public_metadata.username
        : null;
    const username = user.username ?? metadataUsername;

    if (!username) {
      console.error("Username missing in webhook payload");
      return new Response("Username missing", { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {},
      create: {
        clerkId: user.id,
        username,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
