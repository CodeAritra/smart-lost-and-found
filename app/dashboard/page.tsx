"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Package, MessageSquare, LogOut } from "lucide-react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useEffect } from "react"
import { logout } from "@/lib/firebaseAuth"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
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
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Activity</h2>
          <Card className="p-8 rounded-2xl border-0 shadow-sm text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No items yet. Start by reporting a lost or found item.</p>
          </Card>
        </div>
      </div>
    </main>
  )
}
