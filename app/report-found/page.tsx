"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReportFoundPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    color: "",
    location: "",
    condition: "",
    sensitiveItem: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to match results page
    router.push("/match-result")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold w-fit"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Found Item</h1>
          <p className="text-muted-foreground">Help us return this item to its owner</p>
        </div>

        <Card className="p-8 rounded-2xl border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-base font-semibold text-foreground mb-2 block">
                Item Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="rounded-lg h-10">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keys">Keys</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand" className="text-base font-semibold text-foreground mb-2 block">
                Brand (optional)
              </Label>
              <Input
                id="brand"
                placeholder="e.g., Apple, Nike, etc."
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="rounded-lg h-10"
              />
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="color" className="text-base font-semibold text-foreground mb-2 block">
                Color
              </Label>
              <Input
                id="color"
                placeholder="e.g., Black, Blue, Red"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="rounded-lg h-10"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-base font-semibold text-foreground mb-2 block">
                Where did you find it?
              </Label>
              <Input
                id="location"
                placeholder="e.g., Library, Student Center, Parking Lot"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="rounded-lg h-10"
                required
              />
            </div>

            {/* Condition */}
            <div>
              <Label htmlFor="condition" className="text-base font-semibold text-foreground mb-2 block">
                Item Condition
              </Label>
              <Textarea
                id="condition"
                placeholder="Describe the condition of the item (any damage, missing parts, etc.)"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="rounded-lg min-h-24"
              />
            </div>

            {/* Sensitive Item */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Checkbox
                id="sensitiveItem"
                checked={formData.sensitiveItem}
                onCheckedChange={(checked) => setFormData({ ...formData, sensitiveItem: checked as boolean })}
              />
              <Label htmlFor="sensitiveItem" className="cursor-pointer text-foreground font-medium">
                This is a sensitive item (ID / Card / Document)
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold mt-8"
            >
              <Package className="h-5 w-5 mr-2" />
              Submit Found Item
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
