"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { ChatService } from "@/lib/chat-service"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  pageContext?: string
  suggestions?: string[]
  actions?: Array<{
    label: string
    action: string
    url?: string
  }>
}

interface EnhancedChatInterfaceProps {
  className?: string
}

export function EnhancedChatInterface({ className }: EnhancedChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "¡Hola! Soy tu asistente de Analytics Market AI. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["¿Qué es Analytics Market AI?", "¿Cómo funciona?", "Ver dashboard"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const chatService = ChatService.getInstance()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getPageContext = () => {
    switch (pathname) {
      case "/":
        return "landing page - información general sobre Analytics Market AI"
      case "/dashboard":
        return "dashboard - vista general del mercado EUR/USD y USD/COP"
      case "/dashboard/eur-usd":
        return "página de análisis EUR/USD - gráficos y predicciones"
      case "/dashboard/usd-cop":
        return "página de análisis USD/COP - gráficos y predicciones"
      default:
        return `página ${pathname}`
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
      pageContext: getPageContext(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await chatService.generateResponse(text, getPageContext())
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: "bot",
        timestamp: new Date(),
        pageContext: getPageContext(),
        suggestions: response.suggestions,
        actions: response.actions,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleActionClick = (action: { label: string; action: string; url?: string }) => {
    if (action.action === "navigate" && action.url) {
      router.push(action.url)
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="">Chat</span>
        </Button>
        {/* Notification dot with pulse animation */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className={cn("w-96 shadow-2xl border-0 backdrop-blur-sm", isMinimized ? "h-14" : "h-[600px]")}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">Analytics AI Assistant</CardTitle>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs opacity-90">En línea</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[560px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "flex items-start space-x-2 max-w-[85%]",
                          message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row",
                        )}
                      >
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback
                            className={cn(
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted border border-border",
                            )}
                          >
                            {message.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm shadow-sm",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border",
                          )}
                        >
                          {message.content}
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-8">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-8">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.label}
                            {action.action === "navigate" && <ExternalLink className="h-3 w-3 ml-1" />}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-muted border border-border">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 border-border/50"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  size="sm"
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate">📍 {getPageContext()}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}