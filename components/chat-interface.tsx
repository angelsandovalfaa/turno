"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { getMessages, sendMessage } from "@/lib/chat"

export default function ChatInterface({
  sender,
  recipient,
}: {
  sender: string
  recipient: string
}) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load initial messages
    const loadMessages = () => {
      const msgs = getMessages(sender, recipient)
      setMessages(msgs)
    }

    loadMessages()

    // Set up interval to check for new messages
    const interval = setInterval(loadMessages, 5000)

    return () => clearInterval(interval)
  }, [sender, recipient])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message = {
      id: Date.now().toString(),
      sender,
      recipient,
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    sendMessage(message)

    // Optimistically add message to UI
    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-muted p-3 border-b">
        <h3 className="font-medium">Chat con {recipient === "secretary" ? "Secretaría" : "Jefatura"}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No hay mensajes. Comienza la conversación.
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === sender ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.sender === sender ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={
                      message.sender === "secretary" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }
                  >
                    {message.sender === "secretary" ? "S" : "J"}
                  </AvatarFallback>
                </Avatar>
                <Card className={`${message.sender === sender ? "bg-primary text-primary-foreground" : ""}`}>
                  <CardContent className="p-3">
                    <div>{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${message.sender === sender ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

