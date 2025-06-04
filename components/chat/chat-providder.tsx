"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const value: ChatContextType = {
    isOpen,
    setIsOpen,
    unreadCount,
    setUnreadCount,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
