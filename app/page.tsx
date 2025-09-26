"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MessageCircle, Shield } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">College Marketplace</h1>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/auth")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Buy & Sell Books with Fellow Students</h2>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
          Connect with students from your college to buy and sell textbooks, stationery, and study materials at great
          prices.
        </p>
        <div className="space-x-4">
          <Button size="lg" onClick={() => router.push("/auth")}>
            Start Trading
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/marketplace")}>
            Browse Items
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Our Marketplace?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Wide Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find textbooks, novels, stationery, and study materials from students across your college.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Student Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with verified students from your college for safe and trusted transactions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Easy Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in messaging system to negotiate prices and arrange meetups with sellers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Safe & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                College-verified accounts and secure platform ensure safe transactions for everyone.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Trading?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of students already using our marketplace</p>
          <Button size="lg" variant="secondary" onClick={() => router.push("/auth")}>
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  )
}
