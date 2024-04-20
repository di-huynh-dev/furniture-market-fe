export type WishlistItem = {
  id: string
  thumbnail: string
  name: string
  material: string
}
export type WishlistType = {
  wishlistItemList: WishlistItem[]
  wishlistTotalQuantity: number
}
