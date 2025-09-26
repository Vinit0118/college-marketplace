"use client"

import { useState } from "react"
import { useProducts } from "@/contexts/products-context"
import { useMessages } from "@/contexts/messages-context"
import { useAuth } from "@/contexts/auth-context"
import { ProductCard } from "@/components/marketplace/product-card"
import { ProductFilters } from "@/components/marketplace/product-filters"
import { Button } from "@/components/ui/button"
import { Plus, Grid, List } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/product"

export default function MarketplacePage() {
  const { filteredProducts, filters, setFilters } = useProducts()
  const { createConversation } = useMessages()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  const handleContact = (product: Product) => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (product.sellerId === user.id) {
      // Can't message yourself
      return
    }

    // Create conversation and navigate to messages
    const conversationId = createConversation(
      product.sellerId,
      product.sellerName,
      product.sellerCollege,
      product.id,
      product.title,
    )

    router.push(`/messages?conversation=${conversationId}`)
  }

  const handleViewDetails = (product: Product) => {
    router.push(`/marketplace/${product.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground">{filteredProducts.length} items available</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => router.push("/sell")}>
                <Plus className="h-4 w-4 mr-2" />
                Sell Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
                <Button onClick={() => setFilters({})}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onContact={handleContact}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
