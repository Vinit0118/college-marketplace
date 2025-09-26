"use client"

import type { Conversation } from "@/types/message"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/contexts/auth-context"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const { user } = useAuth()

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-sm">Start messaging sellers to see conversations here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map((conversation) => {
          const otherParticipant = conversation.participants.find((p) => p.id !== user?.id)
          if (!otherParticipant) return null

          return (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedConversationId === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {otherParticipant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{otherParticipant.name}</h4>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-1">{otherParticipant.college}</p>

                    {conversation.productTitle && (
                      <p className="text-xs text-primary truncate mb-1">Re: {conversation.productTitle}</p>
                    )}

                    {conversation.lastMessage && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
