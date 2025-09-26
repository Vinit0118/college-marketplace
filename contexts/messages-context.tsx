"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Message, Conversation } from "@/types/message"
import { useAuth } from "@/contexts/auth-context"

interface MessagesContextType {
  conversations: Conversation[]
  messages: { [conversationId: string]: Message[] }
  sendMessage: (conversationId: string, content: string, productId?: string) => void
  createConversation: (
    receiverId: string,
    receiverName: string,
    receiverCollege: string,
    productId?: string,
    productTitle?: string,
  ) => string
  markAsRead: (conversationId: string) => void
  getUnreadCount: () => number
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({})
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = () => {
    const storedConversations = localStorage.getItem(`conversations-${user?.id}`)
    const storedMessages = localStorage.getItem(`messages-${user?.id}`)

    if (storedConversations) {
      try {
        setConversations(JSON.parse(storedConversations))
      } catch (error) {
        console.error("Error loading conversations:", error)
      }
    }

    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }
  }

  const saveData = (newConversations: Conversation[], newMessages: { [conversationId: string]: Message[] }) => {
    if (user) {
      localStorage.setItem(`conversations-${user.id}`, JSON.stringify(newConversations))
      localStorage.setItem(`messages-${user.id}`, JSON.stringify(newMessages))
    }
  }

  const createConversation = (
    receiverId: string,
    receiverName: string,
    receiverCollege: string,
    productId?: string,
    productTitle?: string,
  ): string => {
    if (!user) return ""

    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conv) =>
        conv.participants.some((p) => p.id === receiverId) &&
        conv.participants.some((p) => p.id === user.id) &&
        (!productId || conv.productId === productId),
    )

    if (existingConversation) {
      return existingConversation.id
    }

    const conversationId = `conv-${Date.now()}`
    const newConversation: Conversation = {
      id: conversationId,
      participants: [
        { id: user.id, name: user.name, college: user.college },
        { id: receiverId, name: receiverName, college: receiverCollege },
      ],
      productId,
      productTitle,
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    }

    const updatedConversations = [...conversations, newConversation]
    const updatedMessages = { ...messages, [conversationId]: [] }

    setConversations(updatedConversations)
    setMessages(updatedMessages)
    saveData(updatedConversations, updatedMessages)

    return conversationId
  }

  const sendMessage = (conversationId: string, content: string, productId?: string) => {
    if (!user) return

    const conversation = conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    const receiver = conversation.participants.find((p) => p.id !== user.id)
    if (!receiver) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      receiverId: receiver.id,
      receiverName: receiver.name,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      productId,
      productTitle: conversation.productTitle,
    }

    const updatedMessages = {
      ...messages,
      [conversationId]: [...(messages[conversationId] || []), newMessage],
    }

    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
            unreadCount: conv.participants.find((p) => p.id !== user.id) ? conv.unreadCount + 1 : 0,
          }
        : conv,
    )

    setMessages(updatedMessages)
    setConversations(updatedConversations)
    saveData(updatedConversations, updatedMessages)
  }

  const markAsRead = (conversationId: string) => {
    if (!user) return

    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
    )

    const conversationMessages = messages[conversationId] || []
    const updatedMessages = {
      ...messages,
      [conversationId]: conversationMessages.map((msg) => (msg.receiverId === user.id ? { ...msg, read: true } : msg)),
    }

    setConversations(updatedConversations)
    setMessages(updatedMessages)
    saveData(updatedConversations, updatedMessages)
  }

  const getUnreadCount = (): number => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        messages,
        sendMessage,
        createConversation,
        markAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider")
  }
  return context
}
