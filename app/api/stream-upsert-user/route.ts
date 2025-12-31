import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) return NextResponse.json({ error: "Missing user id or name" }, { status: 400 });

    // Upsert the user on Stream (server-side, has permission)
    await serverClient.upsertUser({ id, name });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Stream upsert user error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
