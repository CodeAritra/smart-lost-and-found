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

    if (!channelId || !Array.isArray(members) || members.length < 2) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 🔐 Verify Firebase token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);
    const creatorId = decoded.uid;

    if (!members.includes(creatorId)) {
      return NextResponse.json(
        { error: "Creator must be a channel member" },
        { status: 403 }
      );
    }

    const channel = serverClient.channel("messaging", channelId, {
      members,
      created_by_id: creatorId,
    });

    try {
      // ✅ create channel
      await channel.create();
    } catch (err: any) {
      // 🟡 Channel already exists → ignore
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
