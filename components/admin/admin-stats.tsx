"use client"

import { useProducts } from "@/contexts/products-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, DollarSign, TrendingUp } from "lucide-react"

export function AdminStats() {
  const { products } = useProducts()

  // Mock user data since we don't have a users context
  const totalUsers = JSON.parse(localStorage.getItem("marketplace-users") || "[]").length
  const activeListings = products.filter((p) => p.status === "available").length
  const soldItems = products.filter((p) => p.status === "sold").length
  const totalRevenue = products.filter((p) => p.status === "sold").reduce((sum, p) => sum + p.price, 0)

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered students",
      change: "+12%",
    },
    {
      title: "Active Listings",
      value: activeListings,
      icon: Package,
      description: "Items for sale",
      change: "+8%",
    },
    {
      title: "Items Sold",
      value: soldItems,
      icon: TrendingUp,
      description: "Successful transactions",
      change: "+23%",
    },
    {
      title: "Total Volume",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Transaction volume",
      change: "+15%",
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
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-600">{stat.change}</span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
