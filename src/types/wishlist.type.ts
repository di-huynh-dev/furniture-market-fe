export type WishlistItem = {
  id: string
  thumbnail: string
  name: string
  inStock: number
  sold: number
  price: number
  featured: boolean
  salePrice: number
  onSale: boolean
  wishlistQuantity: number
}
export type WishlistType = {
  wishlistItemList: WishlistItem[]
  wishlistTotalQuantity: number
}
