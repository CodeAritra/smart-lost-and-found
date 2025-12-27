"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MatchResultPage() {
  const router = useRouter()

  const matches = [
    {
      id: 1,
      confidence: "high",
      category: "Wallet",
      description: "Black leather wallet with red stitching",
      location: "Library - 3rd Floor",
      color: "Black",
      date: "Dec 20, 2024",
      isSensitive: false,
    },
    {
      id: 2,
      confidence: "medium",
      category: "Wallet",
      description: "Brown wallet found near cafeteria",
      location: "Student Center",
      color: "Brown",
      date: "Dec 21, 2024",
      isSensitive: false,
    },
  ]

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 rounded-full">High Match</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 rounded-full">Medium Match</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 rounded-full">Low Match</Badge>
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">We Found Possible Matches!</h1>
          </div>
          <p className="text-muted-foreground">Our AI identified items that might be yours. Review them below.</p>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="p-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{match.category}</h3>
                    {getConfidenceBadge(match.confidence)}
                  </div>
                  <p className="text-foreground">{match.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Location</p>
                  <p className="text-foreground font-medium">{match.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Color</p>
                  <p className="text-foreground font-medium">{match.color}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Date Found</p>
                  <p className="text-foreground font-medium">{match.date}</p>
                </div>
              </div>

              {match.isSensitive && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg mb-4 border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    This is a sensitive item. You'll need to answer verification questions.
                  </p>
                </div>
              )}

              <Button
                onClick={() => router.push(`/verify-ownership/${match.id}`)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold"
              >
                Verify Ownership
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 rounded-2xl border-0 shadow-sm bg-muted/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Don't see your item?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The item might not have been reported yet. Check back later or reach out to campus security.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-lg bg-transparent text-sm">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
