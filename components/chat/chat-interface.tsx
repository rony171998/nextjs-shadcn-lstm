"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  pageContext?: string
}

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "¡Hola! Soy tu asistente de Analytics Market AI. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const context = getPageContext()
    const lowerMessage = userMessage.toLowerCase()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Context-aware responses based on current page
    if (pathname === "/") {
      if (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) {
        return "Analytics Market AI es una plataforma avanzada para el análisis y predicción del mercado de divisas EUR/USD usando inteligencia artificial y modelos de deep learning. Ofrecemos visualizaciones interactivas, predicciones precisas y análisis técnico completo."
      }
      if (lowerMessage.includes("cómo funciona") || lowerMessage.includes("como funciona")) {
        return "Nuestra plataforma funciona en 4 pasos: 1) Selecciona el modelo de IA (LSTM, GRU, etc.), 2) Visualiza análisis históricos, 3) Obtén predicciones automáticas, 4) Toma decisiones informadas. ¿Te gustaría ir al dashboard para probarlo?"
      }
      if (lowerMessage.includes("precio") || lowerMessage.includes("costo")) {
        return "Ofrecemos un plan gratuito para comenzar y planes premium con características avanzadas. Puedes empezar gratis desde el dashboard y explorar todas las funcionalidades básicas."
      }
    }

    if (pathname === "/dashboard") {
      if (lowerMessage.includes("eur") || lowerMessage.includes("euro")) {
        return "En el dashboard puedes ver el precio actual del EUR/USD, cambios en 24h, máximos y mínimos. Para análisis más detallado con gráficos y predicciones, haz clic en la tarjeta EUR/USD."
      }
      if (lowerMessage.includes("cop") || lowerMessage.includes("peso")) {
        return "El par USD/COP muestra el valor del dólar estadounidense frente al peso colombiano. Puedes ver estadísticas en tiempo real y acceder a análisis detallado haciendo clic en la tarjeta correspondiente."
      }
      if (lowerMessage.includes("predicción") || lowerMessage.includes("prediccion")) {
        return "Para ver predicciones detalladas, selecciona el par de divisas que te interese (EUR/USD o USD/COP) desde las tarjetas del dashboard. Allí encontrarás gráficos con predicciones de IA."
      }
    }

    if (pathname.includes("/dashboard/")) {
      if (lowerMessage.includes("gráfico") || lowerMessage.includes("grafico") || lowerMessage.includes("chart")) {
        return "El gráfico muestra datos históricos y predicciones futuras. Puedes cambiar entre vista de línea, velas japonesas, barras o área. Las predicciones aparecen como una línea punteada."
      }
      if (lowerMessage.includes("modelo") || lowerMessage.includes("ia") || lowerMessage.includes("ai")) {
        return "Utilizamos modelos avanzados de deep learning como LSTM, GRU y redes bidireccionales, entrenados específicamente para el mercado forex. Estos modelos analizan patrones históricos para generar predicciones precisas."
      }
      if (
        lowerMessage.includes("precisión") ||
        lowerMessage.includes("precision") ||
        lowerMessage.includes("confiable")
      ) {
        return "Nuestros modelos han sido entrenados con años de datos históricos y validados con técnicas de backtesting. Sin embargo, recuerda que el trading conlleva riesgos y las predicciones son orientativas."
      }
    }

    // General responses
    if (lowerMessage.includes("ayuda") || lowerMessage.includes("help")) {
      return `Estoy aquí para ayudarte con Analytics Market AI. Actualmente estás en ${context}. Puedo responder preguntas sobre la plataforma, análisis de mercado, predicciones de IA, y cómo usar las diferentes funcionalidades.`
    }

    if (lowerMessage.includes("contacto") || lowerMessage.includes("soporte")) {
      return "Para soporte adicional, puedes contactarnos a través de nuestro GitHub o enviar un mensaje directo. También puedes explorar la sección de FAQ en la página principal para respuestas a preguntas frecuentes."
    }

    // Default response
    return `Gracias por tu pregunta sobre ${context}. Puedo ayudarte con información sobre análisis de mercado, predicciones de IA, uso de la plataforma, y características específicas. ¿Hay algo específico que te gustaría saber?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      pageContext: getPageContext(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const botResponse = await generateBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        pageContext: getPageContext(),
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
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Abrir chat</span>
        </Button>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className={cn("w-80 shadow-2xl border-0", isMinimized ? "h-14" : "h-96")}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">Analytics AI Assistant</CardTitle>
              <p className="text-xs opacity-90">En línea</p>
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
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "flex items-start space-x-2 max-w-[80%]",
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row",
                      )}
                    >
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback
                          className={cn(message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}
                        >
                          {message.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {message.content}
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-muted">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
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

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Contexto: {getPageContext()}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
