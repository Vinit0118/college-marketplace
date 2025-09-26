"use client"

import { useProducts } from "@/contexts/products-context"
import { useMessages } from "@/contexts/messages-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, MessageCircle, Eye } from "lucide-react"

export function StatsCards() {
  const { user } = useAuth()
  const { getUserProducts } = useProducts()
  const { conversations, getUnreadCount } = useMessages()

  if (!user) return null

  const userProducts = getUserProducts(user.id)
  const activeListings = userProducts.filter((p) => p.status === "available").length
  const soldItems = userProducts.filter((p) => p.status === "sold").length
  const totalEarnings = userProducts.filter((p) => p.status === "sold").reduce((sum, p) => sum + p.price, 0)
  const unreadMessages = getUnreadCount()

  const stats = [
    {
      title: "Active Listings",
      value: activeListings,
      icon: Package,
      description: "Items currently for sale",
    },
    {
      title: "Items Sold",
      value: soldItems,
      icon: Eye,
      description: "Successfully sold items",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings}`,
      icon: DollarSign,
      description: "From sold items",
    },
    {
      title: "Unread Messages",
      value: unreadMessages,
      icon: MessageCircle,
      description: "New messages waiting",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
