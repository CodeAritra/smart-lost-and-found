"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Search } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase"


export default function MatchStatusPage() {
  const params = useParams()

  // const itemId =
  //   typeof params.itemId === "string"
  //     ? params.itemId
  //     : params.itemId?.[0]
  const itemId = params.itemId
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner");

  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState<any | null>(null)

  const MOCK_MATCH = {
    id: "mock_match_001",
    lostItemId: itemId,
    foundItemId: "found_123",
    score: 0.20,
    decision: "reject",
    createdAt: new Date(),
  };

  const isMock = false

  useEffect(() => {
    if (!itemId) return
    const fetchMatch = async () => {
      try {
        setLoading(true)

        if (isMock) {
          await new Promise((res) => setTimeout(res, 600)); // simulate delay

          setMatch(MOCK_MATCH as any);
          return;
        }

        const q = query(
          collection(db, "matches"),
          where("lostItemId", "==", itemId),
          orderBy("score", "desc")
        )

        const snap = await getDocs(q)

        if (!snap.empty) {
          setMatch({ id: snap.docs[0].id, ...snap.docs[0].data() })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [itemId])

  const hasMatch = Boolean(match)
  useEffect(() => {
    console.log("match = ", hasMatch, "\nmatch item = ", match)
  }, [hasMatch, match])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking for matches...</p>
      </main>
    )
  }
 

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md p-8 rounded-2xl border-0 shadow-lg text-center">
          <div className="mb-6">
            {hasMatch ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            )}
          </div>

          {hasMatch ? (
            <>
              <h1 className="text-2xl font-bold mb-3">
                Match Found!
              </h1>

              <p className="text-muted-foreground mb-4">
                We found a potential match for your item with
                <span className="font-semibold">
                  {" "} {match.score}% confidence
                </span>
              </p>

              <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold mb-2">Why this matched:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {match?.reasons?.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-7">
                <Link href={`/chat/${params.itemId}?owner=${ownerId}`}>
                  <Button className="w-full h-12 font-semibold mb-2">
                    Go to chat box
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full h-12">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-3">
                No Match Yet
              </h1>

              <p className="text-muted-foreground mb-6">
                We haven’t found a matching item yet.
                Don’t worry — we’ll keep checking automatically.
              </p>

              <Link href="/dashboard">
                <Button className="w-full h-12 font-semibold">
                  Back to Dashboard
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </main>
  )
}
