"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProducts } from "@/contexts/products-context"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProductCard } from "@/components/marketplace/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Product } from "@/types/product"

export default function ListingsPage() {
  const { user, isLoading } = useAuth()
  const { getUserProducts, updateProduct, deleteProduct } = useProducts()
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

  const userProducts = getUserProducts(user.id)
  const activeListings = userProducts.filter((p) => p.status === "available")
  const soldItems = userProducts.filter((p) => p.status === "sold")
  const reservedItems = userProducts.filter((p) => p.status === "reserved")

  const handleMarkAsSold = (productId: string) => {
    updateProduct(productId, { status: "sold" })
  }

  const handleMarkAsAvailable = (productId: string) => {
    updateProduct(productId, { status: "available" })
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteProduct(productId)
    }
  }

  const renderProductActions = (product: Product) => (
    <div className="flex gap-2 mt-4">
      {product.status === "available" && (
        <Button size="sm" variant="outline" onClick={() => handleMarkAsSold(product.id)}>
          Mark as Sold
        </Button>
      )}
      {product.status === "sold" && (
        <Button size="sm" variant="outline" onClick={() => handleMarkAsAvailable(product.id)}>
          Mark as Available
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => router.push(`/sell?edit=${product.id}`)}>
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your marketplace listings</p>
          </div>
          <Button onClick={() => router.push("/sell")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Listing
          </Button>
        </div>

        {/* Listings Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active
              <Badge variant="secondary">{activeListings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-2">
              Sold
              <Badge variant="secondary">{soldItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reserved" className="flex items-center gap-2">
              Reserved
              <Badge variant="secondary">{reservedItems.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No active listings yet</p>
                <Button onClick={() => router.push("/sell")}>Create Your First Listing</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    {renderProductActions(product)}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No sold items yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldItems.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    {renderProductActions(product)}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reserved">
            {reservedItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No reserved items</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservedItems.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    {renderProductActions(product)}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
