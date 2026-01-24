"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import { streamClient } from "@/lib/stream"

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)
const PUBLIC_ROUTES = ["/login"]

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [streamReady, setStreamReady] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setStreamReady(false);

      try {
        if (!firebaseUser) {
          if (streamClient.user) {
            await streamClient.disconnectUser();
          }
          setUser(null);
          return;
        }

        setUser(firebaseUser);

        const firebaseUid = firebaseUser.uid;
        // const streamUserId = `app_${firebaseUid}`;
        const idToken = await firebaseUser.getIdToken();

        // ✅ Ensure Stream user exists (USE app_ ID)
        await fetch("/api/stream-upsert-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: firebaseUid,
            name: firebaseUser.displayName,
            image: firebaseUser.photoURL,
          }),
        });

        // ✅ Fetch Stream token (token MUST be for app_ ID)
        const tokenRes = await fetch("/api/stream-token", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!tokenRes.ok) {
          throw new Error("Stream token fetch failed");
        }

        const { token, streamUserId } = await tokenRes.json();

        // ✅ Prevent double-connect (compare against app_ ID)
        if (streamClient.user?.id !== streamUserId) {
          await streamClient.connectUser(
            {
              id: streamUserId,
              name:
                firebaseUser.displayName ||
                `user_${firebaseUid.slice(0, 5)}`,
              image: firebaseUser.photoURL || "",
            },
            token
          );
        }

        console.log("✅ Stream connected as:", streamClient.user?.id);
        setStreamReady(true);
      } catch (err) {
        console.error("Auth/Stream error:", err);
        setStreamReady(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const id = streamClient.user?.id;
    if (id && id.includes("app_app_")) {
      console.error("🚨 DOUBLE PREFIX BUG DETECTED on client:", id);
    }
  }, [streamClient.user]);


  useEffect(() => {
    if (loading) return
    if (!user && !PUBLIC_ROUTES.includes(pathname)) router.replace("/login")
    if (user && pathname === "/login") router.replace("/dashboard")
  }, [user, loading, pathname, router])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
