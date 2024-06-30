export type WishlistItem = {
  id: string
  thumbnail: string
  name: string
  material: string
  wishlistQuantity: number
}
export type WishlistType = {
  wishlistItemList: WishlistItem[]
  wishlistTotalQuantity: number
}
