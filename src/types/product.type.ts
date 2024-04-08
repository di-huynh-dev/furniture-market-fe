export type ProductInfo = {
  name: string
  price: number
  salePrice: number
  description: string
  size: string
  material: string
  inStock: number
  featured: boolean
  systemCategoryId?: string
  storeCategoryId?: string
}

export type AddProductApiType = {
  name: string
  price: number
  salePrice: number
  description: string
  size: string
  material: string
  inStock: number
  featured: boolean
  systemCategoryId?: string
  storeCategoryId?: string
  thumbnail?: FileList | string | null
  images?: FileList | string | null
}
export type UpdateProductApiType = {
  name?: string
  price?: number
  salePrice?: number
  description?: string
  size?: string
  material?: string
  inStock?: number
  featured?: boolean
  systemCategoryId?: string
  storeCategoryId?: string
  thumbnail?: FileList | string | null
  images?: FileList | string | null
}

export type ProductDetailType = {
  id: string
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
  images: string[]
  storeCategories: string[]
}
