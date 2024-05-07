import { StoreInfo } from './product.type'

export type CartItem = {
  id: string
  thumbnail: string
  name: string
  weight: number
  height: number
  length: number
  width: number
  material: string
  inStock: number
  sold: number
  storeInfo: StoreInfo
  price: number
  featured: boolean
  salePrice: number
  onSale: boolean
  cartQuantity: number
}
export type CartType = {
  cartItemList: {
    storeInfo: StoreInfo
    items: CartItem[]
  }[]
  cartTotalQuantity: number
  cartTotalAmount: number
  shipping: number
  discountCode: string
  discount: number
}

export type CartItemListType = {
  storeInfo: StoreInfo
  items: CartItem[]
}
