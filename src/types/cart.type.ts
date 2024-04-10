export type CartItem = {
  id: string
  thumbnail: string
  name: string
  inStock: number
  sold: number
  price: number
  featured: boolean
  salePrice: number
  onSale: boolean
  cartQuantity: number
}
export type CartType = {
  cartItemList: CartItem[]
  cartTotalQuantity: number
  cartTotalAmount: number
  shipping: number
  discountCode: string
  discount: number
}
