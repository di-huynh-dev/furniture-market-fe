export type VoucherType = {
  id?: string
  name?: string
  type?: string
  code?: string
  startDate?: string
  endDate?: string
  maxDiscount?: number
  minValue?: number
  totalTimes?: number
  buyerLimit?: number
  usable?: boolean
  productIds?: string[] | []
}
export type VoucherRespType = {
  id: string
  name?: string
  type?: string
  code?: string
  startDate: string
  endDate: string
  maxDiscount: number
  minValue: number
  totalTimes?: number
  buyerLimit?: number
  usable?: boolean
  productIds?: string[] | []
}
