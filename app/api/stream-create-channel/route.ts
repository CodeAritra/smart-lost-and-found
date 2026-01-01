import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { adminAuth } from "@/lib/firebaseAdmin";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const { channelId, members } = await req.json();

    if (!channelId || !Array.isArray(members) || members.length !== 1) {
      return NextResponse.json(
        { error: "Client must send exactly one other member" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);
    const creatorId = decoded.uid;
    const otherUserId = members[0];

    if (otherUserId === creatorId) {
      return NextResponse.json(
        { error: "Cannot create chat with yourself" },
        { status: 400 }
      );
    }

    await serverClient.upsertUser({
      id: creatorId,
      role: "user",
    });

    await serverClient.upsertUser({
      id: otherUserId,
      role: "user",
    });

    const channel = serverClient.channel("messaging", channelId, {
      members: [creatorId, otherUserId],
      created_by_id: creatorId,
    });

    try {
      await channel.create();
    } catch (err: any) {
      if (err?.code !== 16) {
        throw err;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Create channel error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
