"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Button } from "@/components/ui/button"
import { Plus, Store } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your marketplace activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/marketplace")}>
              <Store className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
            <Button onClick={() => router.push("/sell")}>
              <Plus className="h-4 w-4 mr-2" />
              List New Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Ready to sell?</h3>
              <p className="text-sm opacity-90 mb-4">
                List your textbooks, electronics, or stationery to start earning
              </p>
              <Button variant="secondary" size="sm" onClick={() => router.push("/sell")}>
                Create Listing
              </Button>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Need something?</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse thousands of items from fellow students</p>
              <Button variant="outline" size="sm" onClick={() => router.push("/marketplace")}>
                Browse Items
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
