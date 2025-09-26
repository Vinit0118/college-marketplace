"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useMessages } from "@/contexts/messages-context"
import { ConversationList } from "@/components/messaging/conversation-list"
import { MessageThread } from "@/components/messaging/message-thread"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const { user, isLoading } = useAuth()
  const { conversations, messages, sendMessage, markAsRead } = useMessages()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId)
    }
  }, [selectedConversationId, markAsRead])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  const selectedMessages = selectedConversationId ? messages[selectedConversationId] || [] : []
  const otherParticipant = selectedConversation?.participants.find((p) => p.id !== user.id)

  const handleSendMessage = (content: string) => {
    if (selectedConversationId) {
      sendMessage(selectedConversationId, content, selectedConversation?.productId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Messages
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Conversations</h2>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedConversation && otherParticipant ? (
              <MessageThread
                conversationId={selectedConversationId!}
                messages={selectedMessages}
                otherParticipant={otherParticipant}
                productTitle={selectedConversation.productTitle}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
