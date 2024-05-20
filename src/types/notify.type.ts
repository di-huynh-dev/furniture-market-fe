export type NotifyProps = {
  title: string
  content: string
  time: string
  navigation: string
}

export interface Notification {
  id: string
  createdAt: string
  type: string
  seen: boolean
  content: [string, string]
}
