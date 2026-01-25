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

    // await serverClient.channel("messaging", channelId).delete().then(()=>{
    //   console.log("========deleted============")
    // })

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);

    const creatorId = `app_${decoded.uid}`;
    const otherUserId = members[0];

    if (!otherUserId.startsWith("app_")) {
      throw new Error("Invalid Stream user ID");
    }

    if (creatorId.includes("app_app_") || otherUserId.includes("app_app_")) {
      throw new Error("DOUBLE PREFIX BUG DETECTED in create-channel");
    }

    // console.log("\ncreator = ", creatorId, "\nothers = ", otherUserId)

    if (creatorId === otherUserId) {
      return NextResponse.json(
        { error: "Cannot create chat with yourself" },
        { status: 400 }
      );
    }

    await serverClient.upsertUser({ id: creatorId, role: "user" });
    await serverClient.upsertUser({ id: otherUserId, role: "user" });

    const channel = serverClient.channel("messaging", channelId, {
      members: [creatorId, otherUserId],
      created_by_id: creatorId,
    });

    try {
      await channel.create();
      // console.log(channel.state.members);
    } catch (err: any) {
      if (err?.code !== 16) throw err;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Create channel error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

