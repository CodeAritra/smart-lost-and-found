import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs"; 

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No auth header" }, { status: 401 });

    const token = authHeader.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Invalid auth header" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid)
      return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 });

    const streamToken = serverClient.createToken(decoded.uid);

    return NextResponse.json({ token: streamToken });
  } catch (err: any) {
    console.error("Stream token error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
