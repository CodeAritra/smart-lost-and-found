"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import { streamClient } from "@/lib/stream";
import { useAuth } from "@/context/authContext";
import "stream-chat-react/dist/css/v2/index.css";

export default function ChatPage() {
  const { itemId } = useParams();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner");

  const { user, loading } = useAuth();
  const router = useRouter();

  const [channel, setChannel] = useState<any>(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [isStreamConnected, setIsStreamConnected] = useState(false);


  useEffect(() => {
    if (loading || !user || !ownerId || !itemId) return;

    const initChat = async () => {
      try {
        setChatLoading(true);

        const idToken = await user.getIdToken();

        // 1️⃣ Get Stream token
        const tokenRes = await fetch("/api/stream-token", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const { token } = await tokenRes.json();

        // 2️⃣ ALWAYS connect user (once)
        if (!isStreamConnected) {
          await streamClient.connectUser(
            {
              id: user.uid,
              name: `user_${user.uid.slice(0, 5)}`,
            },
            token
          );

          setIsStreamConnected(true);
        }

        // 3️⃣ Create channel (server-side permissions)
        const channelId = `item_${itemId}`;

        await fetch("/api/stream-create-channel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            channelId,
            members: [ownerId],
          }),
        });

        // 4️⃣ Watch channel
        const ch = streamClient.channel("messaging", channelId, {
          members: [user.uid, ownerId],
        });

        await ch.watch();

        setChannel(ch);
      } catch (err) {
        console.error("Chat init error:", err);
      } finally {
        setChatLoading(false);
      }
    };

    initChat();
  }, [user, ownerId, itemId, loading, isStreamConnected]);



  if (loading || chatLoading) {
    return <p className="text-center mt-20">Connecting to chat…</p>;
  }

  if (!channel) {
    return <p className="text-center mt-20">Failed to load chat.</p>;
  }

  return (
    <Chat client={streamClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
