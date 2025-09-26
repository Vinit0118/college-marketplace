"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProducts } from "@/contexts/products-context"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ProductCard } from "@/components/marketplace/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, CheckCircle, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product } from "@/types/product"

export default function AdminProductsPage() {
  const { user, isLoading } = useAuth()
  const { products, updateProduct, deleteProduct } = useProducts()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
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

  if (!user || user.role !== "admin") {
    return null
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeProducts = filteredProducts.filter((p) => p.status === "available")
  const soldProducts = filteredProducts.filter((p) => p.status === "sold")
  const allProducts = filteredProducts

  const handleRemoveProduct = (productId: string) => {
    if (confirm("Are you sure you want to remove this product?")) {
      deleteProduct(productId)
    }
  }

  const handleMarkAsSold = (productId: string) => {
    updateProduct(productId, { status: "sold" })
  }

  const renderProductActions = (product: Product) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {product.status === "available" && (
          <DropdownMenuItem onClick={() => handleMarkAsSold(product.id)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Sold
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleRemoveProduct(product.id)} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Monitor and moderate marketplace listings</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by title, description, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">{filteredProducts.length} products</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Products Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Products
              <Badge variant="secondary">{allProducts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active
              <Badge variant="secondary">{activeProducts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-2">
              Sold
              <Badge variant="secondary">{soldProducts.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {allProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    <div className="absolute top-2 right-2">{renderProductActions(product)}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No active products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    <div className="absolute top-2 right-2">{renderProductActions(product)}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No sold products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} onViewDetails={() => router.push(`/marketplace/${product.id}`)} />
                    <div className="absolute top-2 right-2">{renderProductActions(product)}</div>
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
