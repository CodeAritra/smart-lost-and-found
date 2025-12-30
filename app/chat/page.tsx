"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, AlertTriangle, Clock, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  sender: "user" | "other"
  text: string
  timestamp: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "other",
      text: "Hi! I found your wallet at the library. I can help you get it back.",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      sender: "user",
      text: "Thank you so much! That's a relief. When can we meet?",
      timestamp: "2:35 PM",
    },
    {
      id: 3,
      sender: "other",
      text: "I'm free this afternoon or tomorrow morning. Where works best for you?",
      timestamp: "2:36 PM",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(45) // minutes

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: inputValue,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Item Pickup Chat</h1>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {timeRemaining} minutes remaining
              </p>
            </div>
            <div className="w-8" />
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">Do not share personal information</p>
            <p>This chat is for coordination only. Never share contact details, passwords, or financial information.</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-card border-t border-border sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="rounded-full h-10 text-sm flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-10 h-10 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This chat will expire in {timeRemaining} minutes for privacy.
          </p>
        </div>
      </div>

      {/* Floating Action */}
      <div className="bg-white dark:bg-card border-t border-border px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <Link href="/pickup-confirmation">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold">
              Mark as Arranged
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
