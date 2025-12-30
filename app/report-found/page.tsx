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
import { reportFoundItem } from "@/lib/report"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { useAuth } from "@/context/authContext"

export default function ReportFoundPage() {
  const { user } = useAuth()
  const router = useRouter()

  //  UPDATED STATE
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    brand: "",
    color: "",
    location: "",
    condition: "",
    description: "",
    sensitiveItem: false,
  })

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Please login first")
      return
    }

    try {
      //  UPDATED VALIDATION
      if (!formData.category || !formData.name || !formData.location) {
        alert("Category, item name, and location are required")
        return
      }

      // If NOT sensitive → image mandatory
      if (!formData.sensitiveItem && !image) {
        alert("Please upload an image of the found item")
        return
      }

      let imageUrl: string | undefined = undefined

      // Upload image only if not sensitive
      if (!formData.sensitiveItem && image) {
        imageUrl = await uploadToCloudinary(image)
      }

      //  UPDATED PAYLOAD
      const payload: any = {
        userId: user.uid,

        category: formData.category,
        name: formData.name,

        brand: formData.brand || null,
        color: formData.color || null,

        location: formData.location,
        condition: formData.condition || null,
        description: formData.description || null,

        sensitiveItem: formData.sensitiveItem,

        status: "unclaimed",
        createdAt: new Date(),
      }

      if (imageUrl) {
        payload.imageUrl = imageUrl
      }

      await reportFoundItem(payload)
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Found Item</h1>
          <p className="text-muted-foreground">Help us return this item to its owner</p>
        </div>

        <Card className="p-8 rounded-2xl border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Item Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="rounded-lg h-10">
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

            {/*  Item Name */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Item Name
              </Label>
              <Input
                placeholder="e.g., iPhone 13, Black Wallet"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg h-10"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Brand (optional)
              </Label>
              <Input
                placeholder="e.g., Apple, Nike"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="rounded-lg h-10"
              />
            </div>

            {/* Color */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Color
              </Label>
              <Input
                placeholder="e.g., Black, Blue"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="rounded-lg h-10"
              />
            </div>

            {/* Location */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Where did you find it?
              </Label>
              <Input
                placeholder="e.g., Library, Parking Lot"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="rounded-lg h-10"
                required
              />
            </div>

            {/* Condition */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Item Condition
              </Label>
              <Textarea
                placeholder="Any damage or missing parts?"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="rounded-lg min-h-24"
              />
            </div>

            {/*  Description */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-2 block">
                Additional Description
              </Label>
              <Textarea
                placeholder="Any extra identifying details"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg min-h-24"
              />
            </div>

            {/* Image */}
            {!formData.sensitiveItem && (
              <div>
                <Label className="text-base font-semibold text-foreground mb-2 block">
                  Upload Item Photo
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer">
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
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Sensitive Item */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Checkbox
                checked={formData.sensitiveItem}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sensitiveItem: checked as boolean })
                }
              />
              <Label className="cursor-pointer font-medium">
                This is a sensitive item (ID / Card / Document)
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-lg h-12 font-semibold mt-8"
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
