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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
      // console.log("user === ", firebaseUser)

      if (firebaseUser && !streamClient.user) {
        try {
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();

          // Fetch Stream token from API
          const res = await fetch("/api/stream-token", {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          if (!res.ok) throw new Error(`Stream token fetch failed: ${res.statusText}`)
          const data = await res.json()

          // Connect Stream user
          await streamClient.connectUser(
            {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || `user_${firebaseUser.uid.slice(0, 5)}`,
              // name: `user_${firebaseUser.uid.slice(0, 5)}`,
            },
            data.token
          )
          console.log("Stream user connected:", streamClient.user)
        } catch (err) {
          console.error("Stream connect error:", err)
        }
      } else if (!firebaseUser && streamClient.user) {
        await streamClient.disconnectUser()
      }
    })

    return () => unsubscribe()
  }, [])

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
