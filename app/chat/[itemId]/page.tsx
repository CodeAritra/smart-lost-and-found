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

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!ownerId) return;

    const initChat = async () => {
      try {
        const idToken = await user.getIdToken();

        /*await fetch("/api/stream-delete-channel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            channelId: `item_${itemId}`,
          }),
        });*/


        // 1️⃣ Get Stream token

        const tokenRes = await fetch("/api/stream-token", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const { token } = await tokenRes.json();

        // 2️⃣ Connect Stream user
        if (!streamClient.user) {
          await streamClient.connectUser(
            {
              id: user.uid,
              name: `user_${user.uid.slice(0, 5)}`,
            },
            token
          );
        }

        // 3️⃣ Upsert both users
        await fetch("/api/stream-upsert-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.uid,
            name: `user_${user.uid.slice(0, 5)}`,
          }),
        });

        await fetch("/api/stream-upsert-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: ownerId,
            name: `user_${ownerId.slice(0, 5)}`,
          }),
        });

        // 4️⃣ 🔐 Create channel on SERVER
        const channelId = `item_${itemId}`;

        await fetch("/api/stream-create-channel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // 🔐 REQUIRED
          },
          body: JSON.stringify({
            channelId,
            members: [user.uid, ownerId],
          }),
        });


        // 5️⃣ Watch channel from client
        const ch = streamClient.channel("messaging", channelId);
        await ch.watch();

        setChannel(ch);
      } catch (err) {
        console.error("Chat init error:", err);
      } finally {
        setChatLoading(false);
      }
    };

    initChat();
  }, [user, loading, itemId, ownerId, router]);

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
