"use client"

import { useAuth } from "@/contexts/auth-context"
import { useMessages } from "@/contexts/messages-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, Package, MessageCircle, User, Settings, LogOut, Store, Home, Shield } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const navigationItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "My Listings", href: "/dashboard/listings" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const { getUnreadCount } = useMessages()
  const router = useRouter()
  const pathname = usePathname()
  const unreadCount = getUnreadCount()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="w-64 bg-card border-r h-screen flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.college}</p>
            <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="text-xs mt-1">
              {user.role === "admin" ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </>
              ) : (
                "Student"
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {/* Quick Actions */}
          <div className="mb-4">
            <Button className="w-full justify-start" onClick={() => router.push("/marketplace")}>
              <Store className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>

          {/* Admin Panel Access */}
          {user.role === "admin" && (
            <div className="mb-4">
              <Button variant="destructive" className="w-full justify-start" onClick={() => router.push("/admin")}>
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          )}

          {/* Main Navigation */}
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const isMessages = item.href === "/messages"

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {isMessages && unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => router.push("/")}>
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
