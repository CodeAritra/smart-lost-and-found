"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { reportLostItem } from "@/lib/report"
import { useAuth } from "@/context/authContext"

export default function ReportLostPage() {
  const router = useRouter()

  const { user } = useAuth()

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    location: "",
    time: "",
    noPhoto: false
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleNoPhotoChange = (checked: boolean) => {
    setFormData({ ...formData, noPhoto: checked })

    if (checked) {
      setImage(null)
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Please login first")
      return
    }

    try {
      let imageUrl: string | undefined = undefined

      // Upload image if exists
      if (image && !formData.noPhoto) {
        imageUrl = await uploadToCloudinary(image)
      }

      const payload: any = {
        userId: user.uid,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        time: formData.time ? new Date(formData.time) : null,
      }

      // Only attach imageUrl if it exists
      if (imageUrl) {
        payload.imageUrl = imageUrl
      }

      await reportLostItem(payload)

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Try again.")
    }
  }


  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Lost Item</h1>
          <p className="text-muted-foreground">Help us find your item by providing details and a description</p>
        </div>

        <Card className="p-8 rounded-2xl border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div >
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
                <SelectContent className="bg-background border border-border shadow-lg">
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

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base font-semibold text-foreground mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your lost item in detail (color, brand, distinctive marks, etc.)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-lg min-h-24"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-base font-semibold text-foreground mb-2 block">
                Where did you lose it?
              </Label>
              <Input
                id="location"
                placeholder="e.g., Library, Student Center, Dorm Building"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="rounded-lg h-10"
                required
              />
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time" className="text-base font-semibold text-foreground mb-2 block">
                Approximate time lost
              </Label>
              <Input
                id="time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="rounded-lg h-10"
              />
            </div>

            {/* Image Upload */}
            {!formData.noPhoto && (
              <div>
                <Label className="text-base font-semibold text-foreground mb-2 block">
                  Upload Item Photo
                </Label>

                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="imageUpload"
                    onChange={handleImageChange}
                  />

                  <label htmlFor="imageUpload" className="cursor-pointer block">
                    {!imagePreview ? (
                      <p className="text-muted-foreground text-sm">
                        Click to upload an image
                      </p>
                    ) : (
                      <div className="flex justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}


            {/* No Photo Toggle */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <input
                id="noPhoto"
                type="checkbox"
                checked={formData.noPhoto}
                onChange={(e) => setFormData({ ...formData, noPhoto: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="noPhoto" className="cursor-pointer text-foreground font-medium">
                I don't have a photo
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold mt-8"
            >
              <Search className="h-5 w-5 mr-2" />
              Find My Item
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
