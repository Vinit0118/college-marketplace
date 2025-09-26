"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product, ProductFilters } from "@/types/product"

interface ProductsContextType {
  products: Product[]
  filteredProducts: Product[]
  filters: ProductFilters
  setFilters: (filters: ProductFilters) => void
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getUserProducts: (userId: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Calculus: Early Transcendentals",
    description: "Stewart's Calculus textbook, 8th edition. Great condition with minimal highlighting.",
    price: 120,
    category: "textbooks",
    condition: "good",
    images: ["/calculus-textbook.png"],
    sellerId: "mock-user-1",
    sellerName: "Sarah Johnson",
    sellerCollege: "MIT",
    sellerPhone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: "available",
    tags: ["mathematics", "calculus", "stewart"],
  },
  {
    id: "2",
    title: 'MacBook Pro 13" (2021)',
    description:
      "Excellent condition MacBook Pro with M1 chip. Perfect for students. Includes charger and original box.",
    price: 800,
    category: "electronics",
    condition: "like-new",
    images: ["/macbook-pro-laptop.png"],
    sellerId: "mock-user-2",
    sellerName: "Mike Chen",
    sellerCollege: "Stanford University",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    status: "available",
    tags: ["laptop", "apple", "macbook", "m1"],
  },
  {
    id: "3",
    title: "Complete Stationery Set",
    description: "Brand new stationery set including pens, pencils, highlighters, notebooks, and more.",
    price: 25,
    category: "stationery",
    condition: "new",
    images: ["/stationery-set-pens-pencils.jpg"],
    sellerId: "mock-user-3",
    sellerName: "Emma Davis",
    sellerCollege: "Harvard University",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    status: "available",
    tags: ["pens", "pencils", "notebooks", "highlighters"],
  },
]

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<ProductFilters>({})

  useEffect(() => {
    // Load products from localStorage or use mock data
    const storedProducts = localStorage.getItem("marketplace-products")
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts))
      } catch {
        setProducts(mockProducts)
        localStorage.setItem("marketplace-products", JSON.stringify(mockProducts))
      }
    } else {
      setProducts(mockProducts)
      localStorage.setItem("marketplace-products", JSON.stringify(mockProducts))
    }
  }, [])

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.condition && product.condition !== filters.condition) return false
    if (filters.minPrice && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price > filters.maxPrice) return false
    if (filters.college && product.sellerCollege !== filters.college) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesTitle = product.title.toLowerCase().includes(searchLower)
      const matchesDescription = product.description.toLowerCase().includes(searchLower)
      const matchesTags = product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      if (!matchesTitle && !matchesDescription && !matchesTags) return false
    }
    return product.status === "available"
  })

  const addProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("marketplace-products", JSON.stringify(updatedProducts))
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product,
    )
    setProducts(updatedProducts)
    localStorage.setItem("marketplace-products", JSON.stringify(updatedProducts))
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("marketplace-products", JSON.stringify(updatedProducts))
  }

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id)
  }

  const getUserProducts = (userId: string) => {
    return products.filter((product) => product.sellerId === userId)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        setFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getUserProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
