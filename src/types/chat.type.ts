export type ChatItem = {
  senderId: string
  receiverId: string | null // Allow null values for receiverId
  content?: string
  message?: string
  messageId?: string
  type: 'MESSAGE' | 'FILE' | 'IMAGE' | 'SYSTEM'
  randomHash: string
  createdAt: string
  image?: string | null // Adjusted to allow string or null for image
  read?: boolean
}
