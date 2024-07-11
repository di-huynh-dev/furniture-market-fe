export type ProductInfo = {
  name: string
  price: number
  salePrice: number
  description: string
  size?: string
  weight: number
  height: number
  length: number
  width: number
  material: string
  inStock: number
  featured: boolean
  used: boolean
  systemCategoryId?: string
  storeCategoryId?: string
}

export type AddProductApiType = {
  name: string
  price: number
  salePrice: number
  description: string
  weight: number
  height: number
  length: number
  width: number
  material: string
  inStock: number
  featured: boolean
  used: boolean
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
  weight: number
  height: number
  length: number
  width: number
  material: string
  sold: number
  inStock: number
  featured: boolean
  used: boolean
  hidden: boolean
  categoryName: string
  thumbnail: string
  reviewAmount: number
  totalReviewPoint: number
  onDisplay: boolean
  images: string[]
  storeCategories: string[]
  storeInfo?: StoreInfo
  favourite: boolean
}

export type StoreInfo = {
  address: string
  avgReviewStar: string
  id: string
  logo: string
  numReview: number
  productAmount: number
  shopName: string
}

export type MarketingProductType = {
  id: string
  packet: string
  keywords: string[]
  productIds: string[]
  startDate: string
  endDate: string
}
