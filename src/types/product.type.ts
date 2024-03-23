export type ProductInfo = {
  id: string
  thumbnail: string
  name: string
  inStock: number
  price: number
  salePrice: number
  discountPrice?: number
  description?: string
  category?: string
  featured?: boolean
  onSale?: boolean
}

export type ProductDetailType = {
  id: number
  name: string
  onSale: boolean
  price: number
  salePrice: number
  description: string
  size: string
  material: string
  sold: number
  inStock: number
  featured: boolean
  categoryId: number
  collectionId: number
  thumbnail: string
  reviewAmount: number
  totalReviewPoint: number
  imageUrls: string[]
}
