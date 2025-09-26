import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductsProvider } from "@/contexts/products-context"
import { MessagesProvider } from "@/contexts/messages-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "College Marketplace - Books & Stationery",
  description: "Buy and sell books, stationery, and study materials with fellow students",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <ProductsProvider>
              <MessagesProvider>{children}</MessagesProvider>
            </ProductsProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
