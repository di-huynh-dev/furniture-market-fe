import { UserType } from './user.type'

export type ReviewType = {
  id: string
  content: string
  star: number
  reply: boolean
  createdAt: string
  reviewer?: UserType
  productInfo?: {
    id: string
    name: string
    thumbnail: string
  }
}

export type FeedbackType = {
  id: string
  content: string
  star: number
  reply: boolean
  createdAt: string
  reviewer: UserType
  productInfo: {
    id: string
    name: string
    thumbnail: string
  }
}
