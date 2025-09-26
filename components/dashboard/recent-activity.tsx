"use client"

import { useProducts } from "@/contexts/products-context"
import { useMessages } from "@/contexts/messages-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Package, MessageCircle } from "lucide-react"

export function RecentActivity() {
  const { user } = useAuth()
  const { getUserProducts } = useProducts()
  const { conversations } = useMessages()

  if (!user) return null

  const userProducts = getUserProducts(user.id)
  const recentProducts = userProducts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const recentConversations = conversations
    .filter((c) => c.lastMessage)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const activities = [
    ...recentProducts.map((product) => ({
      id: `product-${product.id}`,
      type: "listing" as const,
      title: product.title,
      description: `Listed for $${product.price}`,
      timestamp: product.updatedAt,
      status: product.status,
      icon: Package,
    })),
    ...recentConversations.map((conv) => ({
      id: `conversation-${conv.id}`,
      type: "message" as const,
      title: conv.participants.find((p) => p.id !== user.id)?.name || "Unknown",
      description: conv.lastMessage?.content || "New conversation",
      timestamp: conv.updatedAt,
      status: conv.unreadCount > 0 ? "unread" : "read",
      icon: MessageCircle,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-full">
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  <div className="mt-1">
                    {activity.type === "listing" && (
                      <Badge variant={activity.status === "available" ? "default" : "secondary"} className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                    {activity.type === "message" && activity.status === "unread" && (
                      <Badge variant="destructive" className="text-xs">
                        Unread
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
