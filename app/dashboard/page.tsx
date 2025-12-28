"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, MessageSquare, LogOut, PackageSearch, AlertTriangle, User, AlertCircle, Eye, Hand } from "lucide-react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useEffect } from "react"
import { logout } from "@/lib/firebaseAuth"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getGlobalFound, getGlobalLost, getMyReports } from "@/lib/firebaseFetch"

const TABS = [
  { id: "my", label: "My Reports", icon: User },
  { id: "lost", label: "Lost Items", icon: AlertTriangle },
  { id: "found", label: "Found Items", icon: PackageSearch },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"my" | "lost" | "found">("my")

  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) return <p>Loading...</p>


  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Dashboard</h1>
            <Button variant="ghost" onClick={handleLogout} className="rounded-full">
              <LogOut className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">What would you like to do?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/report-lost">
              <Card className="p-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Report Lost Item</h3>
                    <p className="text-sm text-muted-foreground">Find something you've lost</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/report-found">
              <Card className="p-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Report Found Item</h3>
                    <p className="text-sm text-muted-foreground">Help someone recover their item</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="w-full">
          {/* Tabs Header */}
          <div className="flex gap-2 mb-6">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant="outline"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "rounded-full px-5 flex gap-2",
                    activeTab === tab.id &&
                    "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          {/* Content Area (Full Width) */}
          <Card className="w-full p-6 rounded-2xl border-0 shadow-sm min-h-55">
            {activeTab === "my" && <MyReports />}
            {activeTab === "lost" && <GlobalLost />}
            {activeTab === "found" && <GlobalFound />}
          </Card>
        </div>
      </div>
    </main>
  )
}

type ItemType = "lost" | "found"

interface Item {
  id: string
  category: string
  description?: string
  condition?: string
  location: string
  imageUrl?: string

  userId: string       // user uid
  sensitiveItem?: boolean

  createdAt?: any          // Firestore Timestamp
}

interface ItemCardProps {
  item: Item
  type: ItemType
}


function ItemCard({ item, type }: ItemCardProps) {
  const { user } = useAuth()

  const isMyReport = item.userId === user?.uid

  return (
    <Card className="w-full p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        {/* Image */}
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt="item"
            className="h-24 w-24 rounded-xl object-cover border"
          />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground">
            No Image
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold capitalize text-base">
                {item.category}
              </h3>
              <Badge
                variant={type === "lost" ? "destructive" : "outline"}
              >
                {type === "lost" ? "Lost" : "Found"}
              </Badge>
              {isMyReport && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                >
                  My Report
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description || item.condition}
            </p>

            {/* Location */}
            <p className="text-xs mt-1 text-muted-foreground">
              📍 {item.location}
            </p>
          </div>

          {/* Action */}
          <div className="mt-4 flex justify-between">
            {/* Sensitive warning */}
            <div>{item.sensitiveItem && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  Sensitive item – verification required
                </span>
              </div>
            )}</div>
            <div>{isMyReport ? (
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Ownership
              </Button>
            ) : type === 'found' ? (
              <Button size="sm">
                <Hand className="h-4 w-4 mr-1" />
                Claim Ownership
              </Button>
            ) : null}</div>

          </div>
        </div>
      </div>
    </Card>
  )
}

function MyReports() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    getMyReports(user.uid).then(setItems)
  }, [user])

  if (!items.length)
    return <p className="text-muted-foreground text-center">No reports yet.</p>

  return (
    <div className="space-y-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} type="found" />
      ))}
    </div>
  )
}

function GlobalLost() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getGlobalLost().then(setItems)
  }, [])

  if (!items.length)
    return <p className="text-muted-foreground text-center">No lost items.</p>

  return (
    <div className="space-y-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} type="lost" />
      ))}
    </div>
  )
}

function GlobalFound() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getGlobalFound().then(setItems)
  }, [])

  if (!items.length)
    return <p className="text-muted-foreground text-center">No found items.</p>

  return (
    <div className="space-y-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} type="found" />
      ))}
    </div>
  )
}
