export type OrderItem = {
  id: string
  responses: ResponseItem[]
  status: string
  total: number
  storeInfo: {
    id: string
    logo: string
    name: string
  }
  buyerInfo?: {
    deliveryAddress: string
    id: string
    receiverName: string
    receiverPhone: string
  }
  paid: boolean
}

export type ResponseItem = {
  id: string
  productMaterial: string
  productId: string
  productName: string
  productPrice: number
  productSize: string
  productThumbnail: string
  quantity: number
  total: number
}

export type RefundOrderType = {
  id: string
  reason: string
  createdAt: string
  images: string[]
  accepted: boolean
  orderId: string
}
