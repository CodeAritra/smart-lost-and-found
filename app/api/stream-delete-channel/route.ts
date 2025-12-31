import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { adminAuth } from "@/lib/firebaseAdmin";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const { channelId } = await req.json();

    if (!channelId) {
      return NextResponse.json(
        { error: "channelId is required" },
        { status: 400 }
      );
    }

    // 🔐 Verify Firebase user
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    await adminAuth.verifyIdToken(token); // just validation

    // 🧨 Delete channel
    const channel = serverClient.channel("messaging", channelId);
    await channel.delete();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete channel error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete channel" },
      { status: 500 }
    );
  }
}
