"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/authContext"
import { login } from "@/lib/firebaseAuth"
import { Shield, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const handleGoogleSignIn = async () => {
    await login()
    console.log("Signing in with Google...")
  }

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 rounded-2xl border-0 shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Only verified campus users can access the platform</p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-12 font-semibold mb-4 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>

        {/* <Button
          variant="outline"
          className="w-full rounded-lg h-12 font-semibold flex items-center justify-center gap-2 bg-transparent"
        >
          <Mail className="h-5 w-5" />
          Sign in with College Email
        </Button> */}

        <p className="text-xs text-muted-foreground text-center mt-6">
          By signing in, you agree to our Terms of Service and confirm you are a verified campus member.
        </p>
      </Card>
    </main>
  )
}
