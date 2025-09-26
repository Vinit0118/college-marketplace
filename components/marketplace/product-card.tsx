"use client"

import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, User } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onContact?: (product: Product) => void
  onViewDetails?: (product: Product) => void
}

const categoryLabels = {
  textbooks: "Textbooks",
  novels: "Novels",
  stationery: "Stationery",
  electronics: "Electronics",
  "study-materials": "Study Materials",
  other: "Other",
}

const conditionColors = {
  new: "bg-green-100 text-green-800",
  "like-new": "bg-blue-100 text-blue-800",
  good: "bg-yellow-100 text-yellow-800",
  fair: "bg-orange-100 text-orange-800",
  poor: "bg-red-100 text-red-800",
}

export function ProductCard({ product, onContact, onViewDetails }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={product.images[0] || "/placeholder.svg?height=300&width=300&query=product"}
          alt={product.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={conditionColors[product.condition]}>{product.condition}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
          <span className="text-2xl font-bold text-primary">${product.price}</span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{product.sellerName}</span>
          <span>•</span>
          <span>{product.sellerCollege}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onViewDetails?.(product)}>
          View Details
        </Button>
        <Button className="flex-1" onClick={() => onContact?.(product)}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  )
}
