export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  timestamp: string
  read: boolean
  productId?: string
  productTitle?: string
}

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    college: string
  }[]
  productId?: string
  productTitle?: string
  lastMessage?: Message
  updatedAt: string
  unreadCount: number
}
