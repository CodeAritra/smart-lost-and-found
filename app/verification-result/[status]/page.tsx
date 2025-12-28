"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function VerificationResultPage() {
  const params = useParams()
  const status = params.status as string
  const isApproved = status === "approved"

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md p-8 rounded-2xl border-0 shadow-lg text-center">
          <div className="mb-6">
            {isApproved ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            )}
          </div>

          {isApproved ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ownership Verified</h1>
              <p className="text-muted-foreground mb-8">
                Great news! Your ownership has been verified. The person who found your item is ready to connect with
                you.
              </p>

              <div className="space-y-3">
                <Link href="/chat" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Open In-App Chat
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full rounded-lg h-12 font-semibold bg-transparent">
                    Proceed Without Chat
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Verification Unsuccessful</h1>
              <p className="text-muted-foreground mb-8">
                Your answers didn't match what the finder reported. If you believe this is an error, please reach out to
                campus security.
              </p>

              <Link href="/dashboard" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold">
                  Return to Dashboard
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </main>
  )
}
