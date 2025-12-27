"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Package, CheckCircle, Shield } from "lucide-react"

export default function Home() {
  const [userType, setUserType] = useState<"lost" | "found" | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Smart Lost & Found Network</h1>
              <p className="text-muted-foreground text-sm mt-1">AI-powered recovery for campus items</p>
            </div>
            <Button asChild variant="outline" className="rounded-full bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Find Your Lost Items with AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Report lost or found items on campus and let our AI help match them together. Secure, private, and built for
            you.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/report-lost" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base font-semibold"
            >
              <Search className="mr-2 h-5 w-5" />
              Report Lost Item
            </Button>
          </Link>
          <Link href="/report-found" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full text-base font-semibold bg-transparent"
            >
              <Package className="mr-2 h-5 w-5" />
              Report Found Item
            </Button>
          </Link>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Report</h3>
            <p className="text-muted-foreground">
              Share details about your lost or found item with optional photos and location information.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Verifies</h3>
            <p className="text-muted-foreground">
              Our AI intelligently matches items and suggests the most likely matches based on descriptions.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure Handover</h3>
            <p className="text-muted-foreground">
              Verify ownership through security questions and coordinate safe pickup with in-app chat.
            </p>
          </Card>
        </div>

        {/* Trust Section */}
        <div className="mt-20 p-8 bg-white dark:bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Privacy First</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Only verified campus users can access the platform. Your personal information is never shared until you
            approve ownership verification.
          </p>
        </div>
      </div>
    </main>
  )
}
