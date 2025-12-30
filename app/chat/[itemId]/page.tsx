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

    const initChannel = async () => {
      try {
        // 1️⃣ Fetch Stream token for the current user
        const idToken = await user.getIdToken();
        const res = await fetch("/api/stream-token", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error(`Stream token fetch failed: ${res.statusText}`);
        const data = await res.json();

        // 2️⃣ Connect Stream client if not already connected
        if (!streamClient.user) {
          await streamClient.connectUser(
            { id: user.uid, name: `user_${user.uid.slice(0, 5)}` },
            data.token
          );
        }

        // 3️⃣ Upsert both users via server route
        await fetch("/api/stream-upsert-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.uid, name: `user_${user.uid.slice(0,5)}` }),
        });

        await fetch("/api/stream-upsert-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ownerId, name: `user_${ownerId.slice(0,5)}` }),
        });

        // 4️⃣ Create or get channel
        const ch = streamClient.channel("messaging", `item_${itemId}`, {
          members: [user.uid, ownerId],
        });

        await ch.watch();
        setChannel(ch);
      } catch (err: any) {
        console.error("Chat init error:", err);
      } finally {
        setChatLoading(false);
      }
    };

    initChannel();
  }, [user, loading, itemId, ownerId, router]);

  if (loading || chatLoading)
    return <p className="text-center mt-20">Connecting to Chat...</p>;

  if (!channel)
    return <p className="text-center mt-20">Failed to load chat.</p>;

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
