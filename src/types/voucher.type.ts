export type VoucherType = {
  name?: string
  type?: string
  code?: string
  startDate?: string
  endDate?: string
  maxDiscount?: number
  minValue?: number
  totalTimes?: number
  buyerLimit?: number
  productIds?: string[] | []
}
