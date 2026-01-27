import { NextResponse } from "next/server"
import { StreamChat } from "stream-chat"

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
)

export async function GET() {
  try {
    let offset = 0
    const limit = 100
    let deletedCount = 0

    while (true) {
      const channels = await serverClient.queryChannels(
        { type: "messaging" },
        {},
        { limit, offset }
      )

      if (!channels.length) break

      for (const channel of channels) {
        await channel.delete()
        deletedCount++
      }

      offset += limit
    }

    return NextResponse.json({
      success: true,
      message: "Chat reset successful. All channels deleted.",
      deletedCount
    })
  } catch (error) {
    console.error("Reset chat error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset chat"
      },
      { status: 500 }
    )
  }
}
