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

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
  actions?: Array<{
    label: string
    action: string
    url?: string
  }>
}

interface SimpleChatInterfaceProps {
  className?: string
}

export function SimpleChatInterface({ className }: SimpleChatInterfaceProps) {
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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getPageContext = () => {
    try {
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
          return `página ${pathname || "desconocida"}`
      }
    } catch (error) {
      console.error("Error getting page context:", error)
      return "página actual"
    }
  }

  const generateResponse = async (userMessage: string): Promise<Message> => {
    try {
      const lowerMessage = userMessage.toLowerCase()
      const context = getPageContext()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let response = {
        message: "",
        suggestions: [] as string[],
        actions: [] as Array<{ label: string; action: string; url?: string }>,
      }

      // Dashboard responses
      if (pathname === "/dashboard") {
        if (lowerMessage.includes("eur") || lowerMessage.includes("euro")) {
          response = {
            message:
              "El EUR/USD es el par de divisas más negociado del mundo. En nuestro dashboard puedes ver el precio actual, cambios en 24h, y acceder a análisis detallado con predicciones de IA.",
            suggestions: ["Ver gráfico EUR/USD", "¿Cómo interpretar los datos?", "Predicciones"],
            actions: [{ label: "Análisis EUR/USD", action: "navigate", url: "/dashboard/eur-usd" }],
          }
        } else if (lowerMessage.includes("cop") || lowerMessage.includes("peso")) {
          response = {
            message:
              "El USD/COP muestra el valor del dólar estadounidense frente al peso colombiano. Puedes ver estadísticas en tiempo real y acceder a análisis detallado.",
            suggestions: ["Ver gráfico USD/COP", "¿Qué afecta el precio?", "Predicciones"],
            actions: [{ label: "Análisis USD/COP", action: "navigate", url: "/dashboard/usd-cop" }],
          }
        } else if (lowerMessage.includes("predicción") || lowerMessage.includes("prediccion")) {
          response = {
            message:
              "Nuestras predicciones utilizan modelos LSTM y GRU entrenados con años de datos históricos. Para ver predicciones detalladas, selecciona el par de divisas que te interese.",
            suggestions: ["Ver EUR/USD", "Ver USD/COP", "¿Cómo funcionan los modelos?"],
            actions: [
              { label: "EUR/USD", action: "navigate", url: "/dashboard/eur-usd" },
              { label: "USD/COP", action: "navigate", url: "/dashboard/usd-cop" },
            ],
          }
        } else {
          response = {
            message:
              "En el dashboard puedes ver una vista general del mercado con precios actuales, cambios en 24h, y acceder a análisis detallado de cada par de divisas.",
            suggestions: ["Ver EUR/USD", "Ver USD/COP", "¿Cómo usar el dashboard?"],
            actions: [
              { label: "EUR/USD", action: "navigate", url: "/dashboard/eur-usd" },
              { label: "USD/COP", action: "navigate", url: "/dashboard/usd-cop" },
            ],
          }
        }
      }
      // Landing page responses
      else if (pathname === "/") {
        if (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) {
          response = {
            message:
              "Analytics Market AI es una plataforma avanzada para el análisis y predicción del mercado de divisas EUR/USD usando inteligencia artificial y modelos de deep learning.",
            suggestions: ["¿Cómo funciona?", "¿Es gratis?", "Ver dashboard"],
            actions: [{ label: "Ir al Dashboard", action: "navigate", url: "/dashboard" }],
          }
        } else if (lowerMessage.includes("cómo funciona") || lowerMessage.includes("como funciona")) {
          response = {
            message:
              "Nuestra plataforma funciona en 4 pasos simples: 1) Selecciona el modelo de IA, 2) Visualiza análisis históricos, 3) Obtén predicciones automáticas, 4) Toma decisiones informadas.",
            suggestions: ["Ver modelos disponibles", "¿Qué tan preciso es?", "Comenzar ahora"],
            actions: [{ label: "Probar Ahora", action: "navigate", url: "/dashboard" }],
          }
        } else {
          response = {
            message:
              "¡Bienvenido a Analytics Market AI! Somos una plataforma de análisis financiero con inteligencia artificial. ¿Te gustaría saber más sobre nuestras características?",
            suggestions: ["¿Qué es Analytics Market AI?", "¿Cómo funciona?", "Ver dashboard"],
            actions: [{ label: "Explorar Dashboard", action: "navigate", url: "/dashboard" }],
          }
        }
      }
      // Chart pages
      else if (pathname?.includes("/dashboard/")) {
        if (lowerMessage.includes("gráfico") || lowerMessage.includes("grafico")) {
          response = {
            message:
              "El gráfico muestra datos históricos (línea sólida) y predicciones futuras (línea punteada). Puedes cambiar entre diferentes tipos de visualización: línea, velas japonesas, barras o área.",
            suggestions: ["¿Cómo leer velas japonesas?", "¿Qué significan los colores?", "Cambiar período"],
            actions: []
          }
        } else if (lowerMessage.includes("modelo") || lowerMessage.includes("ia")) {
          response = {
            message:
              "Utilizamos modelos de deep learning como LSTM (Long Short-Term Memory) y GRU (Gated Recurrent Unit), especialmente diseñados para analizar series temporales financieras.",
            suggestions: ["¿Qué es LSTM?", "¿Qué tan preciso es?", "Ver otros modelos"],
            actions: []
          }
        } else {
          response = {
            message:
              "Estás viendo el análisis detallado con gráficos históricos y predicciones de IA. Puedes explorar diferentes períodos de tiempo y tipos de visualización.",
            suggestions: ["¿Cómo interpretar el gráfico?", "Ver predicciones", "Cambiar vista"],
          }
        }
      }
      // Default response
      else {
        response = {
          message: `Gracias por tu pregunta. Estoy aquí para ayudarte con Analytics Market AI. ¿Hay algo específico que te gustaría saber?`,
          suggestions: ["Características principales", "¿Cómo empezar?", "Soporte técnico"],
        }
      }

      return {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions,
      }
    } catch (error) {
      console.error("Error generating response:", error)
      return {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        sender: "bot",
        timestamp: new Date(),
        suggestions: ["Ayuda", "Contacto"],
      }
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    try {
      const text = messageText || inputValue
      if (!text.trim()) return

      const userMessage: Message = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsTyping(true)

      const botMessage = await generateResponse(text)
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
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
    try {
      if (action.action === "navigate" && action.url) {
        router.push(action.url)
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error handling action:", error)
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
          <span className="sr-only">Abrir chat</span>
        </Button>
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
          <CardContent className="p-0 flex flex-col h-[540px]">
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