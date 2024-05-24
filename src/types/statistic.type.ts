export type StatisticType = {
  income: number

  incomeByDays: {
    date: string
    incomeByDay: number
  }[]
  soldProduct: number
  numOfOrderByMonth: number
  numOfOrderByDays: {
    date: string
    amount: number
  }[]
  productOfTheMonth: {
    id: string
    name: string
    thumbnail: string
  }
  soldByProductResponses: {
    productId: string
    productName: string
    soldCount: number
  }[]
}

export type StatisticIncomeType = {
  orderId: string
  tax: number
  totalPrice: number
  amount: number
}
