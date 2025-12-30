"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Calendar, Clock, QrCode, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PickupConfirmationPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"pending" | "completed">("pending")
  const [formData, setFormData] = useState({
    location: "Library - Ground Floor Service Desk",
    date: "Dec 28, 2024",
    time: "2:00 PM",
    instructions: "Item will be held at the front desk. Please bring a valid ID for verification.",
  })

  const handleConfirmPickup = () => {
    setStatus("completed")
  }

  if (status === "completed") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Pickup Confirmed</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your item is reserved and waiting for you. Thank you for using Smart Lost & Found!
            </p>
          </div>

          <Card className="p-8 rounded-2xl border-0 shadow-lg mb-6">
            <div className="mb-6">
              <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center mb-4">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Your Claim ID</p>
              <p className="text-2xl font-bold text-foreground font-mono">CL-20241228-7592</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-semibold text-foreground">{formData.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">{formData.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold text-foreground">{formData.time}</p>
                </div>
              </div>
            </div>
          </Card>

          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-8">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    )
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pickup Arrangements</h1>
          <p className="text-muted-foreground">Confirm the details for collecting your item</p>
        </div>

        <Card className="p-8 rounded-2xl border-0 shadow-lg mb-6">
          <div className="space-y-6">
            {/* Location */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">Pickup Location</Label>
              <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{formData.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">Indoor, accessible during regular hours</p>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold text-foreground mb-2 block">Date</Label>
                <Input type="text" value={formData.date} readOnly className="rounded-lg h-10 bg-muted" />
              </div>
              <div>
                <Label className="text-base font-semibold text-foreground mb-2 block">Time</Label>
                <Input type="text" value={formData.time} readOnly className="rounded-lg h-10 bg-muted" />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">Pickup Instructions</Label>
              <Textarea value={formData.instructions} readOnly className="rounded-lg min-h-24 bg-muted" />
            </div>

            {/* Claim ID Preview */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Your Claim ID (to present at pickup)</p>
              <p className="text-2xl font-bold text-primary font-mono">CL-20241228-7592</p>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirmPickup}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Confirm Pickup
          </Button>
          <Link href="/chat" className="block">
            <Button variant="outline" className="w-full rounded-lg h-12 font-semibold bg-transparent">
              Return to Chat
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
