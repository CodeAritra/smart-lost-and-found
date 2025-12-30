"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Package,
  MessageSquare,
  LogOut,
  PackageSearch,
  AlertTriangle,
  User,
  AlertCircle,
  Eye,
  Hand,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/authContext"
import { logout } from "@/lib/firebaseAuth"
import { getMyReports, getGlobalLost, getGlobalFound } from "@/lib/firebaseFetch"

/* ===================== Types ===================== */

type ItemType = "lost" | "found"

export interface Item {
  id: string
  name: string
  category: string
  description?: string
  condition?: string
  location: string
  imageUrl?: string
  userId: string
  sensitiveItem?: boolean
  createdAt?: any
  type: ItemType
}

interface ItemCardProps {
  item: Item
  type: ItemType
}

/* ===================== Tabs ===================== */

const TABS = [
  { id: "my", label: "My Reports", icon: User },
  { id: "lost", label: "Lost Items", icon: AlertTriangle },
  { id: "found", label: "Found Items", icon: PackageSearch },
] as const

/* ===================== Dashboard ===================== */

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"my" | "lost" | "found">("my")
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Dashboard</h1>

          <div className="flex items-center gap-2">
            <Link href="/inbox">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Inbox
              </Button>
            </Link>

            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">What would you like to do?</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/report-lost">
              <Card className="p-6 rounded-2xl hover:shadow-md cursor-pointer">
                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Search className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Report Lost Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Find something you've lost
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/report-found">
              <Card className="p-6 rounded-2xl hover:shadow-md cursor-pointer">
                <div className="flex gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Package className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Report Found Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Help someone recover their item
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="outline"
                onClick={() => setActiveTab(tab.id)}
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

        {/* Content */}
        <Card className="p-6 rounded-2xl">
          {activeTab === "my" && <MyReports />}
          {activeTab === "lost" && <GlobalLost />}
          {activeTab === "found" && <GlobalFound />}
        </Card>
      </div>
    </main>
  )
}

/* ===================== Item Card ===================== */

function ItemCard({ item, type }: ItemCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const isMine = item.userId === user?.uid

  return (
    <Card className="p-4 rounded-2xl hover:shadow-md">
      <div className="flex gap-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt="item"
            className="h-24 w-24 rounded-xl object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center text-sm">
            No Image
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold capitalize">{item.category}</h3>
            <Badge variant={type === "lost" ? "destructive" : "outline"}>
              {type}
            </Badge>
            {isMine && <Badge variant="secondary">My Report</Badge>}
          </div>

          <p className="text-sm text-muted-foreground">{item.name}</p>
          <p className="text-xs mt-1">📍 {item.location}</p>

          <div className="mt-4 flex gap-2">
            {!isMine && type === "found" && (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(`/verify-ownership/${item.id}`)
                  }
                >
                  <Hand className="h-4 w-4 mr-1" />
                  Claim
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(`/chat/${item.id}?owner=${item.userId}`)
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </>
            )}
          </div>

          {item.sensitiveItem && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
              <AlertCircle className="h-4 w-4" />
              Verification required
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ===================== Data Sections ===================== */

function MyReports() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    if (!user) return
    getMyReports(user.uid).then((res) => setItems(res as Item[]))
  }, [user])

  if (!items.length) return <p>No reports yet.</p>
  return <div className="space-y-4">{items.map(i => <ItemCard key={i.id} item={i} type={i.type} />)}</div>
}

function GlobalLost() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    getGlobalLost().then((res) => setItems(res as Item[]))
  }, [])

  if (!items.length) return <p>No lost items.</p>
  return <div className="space-y-4">{items.map(i => <ItemCard key={i.id} item={i} type="lost" />)}</div>
}

function GlobalFound() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    getGlobalFound().then((res) => setItems(res as Item[]))
  }, [])

  if (!items.length) return <p>No found items.</p>
  return <div className="space-y-4">{items.map(i => <ItemCard key={i.id} item={i} type="found" />)}</div>
}
