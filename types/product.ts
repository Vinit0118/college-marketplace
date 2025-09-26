export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  condition: ProductCondition
  images: string[]
  sellerId: string
  sellerName: string
  sellerCollege: string
  sellerPhone?: string
  createdAt: string
  updatedAt: string
  status: "available" | "sold" | "reserved"
  tags: string[]
}

export type ProductCategory = "textbooks" | "novels" | "stationery" | "electronics" | "study-materials" | "other"

export type ProductCondition = "new" | "like-new" | "good" | "fair" | "poor"

export interface ProductFilters {
  category?: ProductCategory
  condition?: ProductCondition
  minPrice?: number
  maxPrice?: number
  college?: string
  search?: string
}
