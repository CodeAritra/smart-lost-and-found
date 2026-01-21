"use client"

import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react"
import { streamClient } from "@/lib/stream"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import "stream-chat-react/dist/css/v2/index.css"

export default function InboxPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <p className="mt-20 text-center">Loading...</p>
  if (!user) {
    router.replace("/login")
    return null
  }

  return (
    <Chat client={streamClient} theme="messaging light">
      <div className="flex flex-col h-screen">

        {/* TOP BAR */}
        <div className="p-2 border-b bg-white">
          <button
            onClick={() => router.replace("/dashboard")}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1">

          {/* LEFT: Inbox */}
          <div className="w-80 border-r">
            <ChannelList
              filters={{ members: { $in: [user.uid] } }}
              sort={{ last_message_at: -1 }}
            />
          </div>

          {/* RIGHT: Chat Window */}
          <div className="flex-1">
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </div>

        </div>
      </div>
    </Chat>
  )
}
