interface ChatResponse {
    message: string
    suggestions?: string[]
    actions?: Array<{
      label: string
      action: string
      url?: string
    }>
  }
  
  export class ChatService {
    private static instance: ChatService | null = null
  
    static getInstance(): ChatService {
      if (!ChatService.instance) {
        ChatService.instance = new ChatService()
      }
      return ChatService.instance
    }
  
    async generateResponse(message: string, context: string): Promise<ChatResponse> {
      try {
        const lowerMessage = message?.toLowerCase() || ""
        const pageContext = context || ""
  
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))
  
        // Landing page responses
        if (pageContext.includes("landing page")) {
          if (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) {
            return {
              message:
                "Analytics Market AI es una plataforma avanzada para el análisis y predicción del mercado de divisas EUR/USD usando inteligencia artificial y modelos de deep learning.",
              suggestions: ["¿Cómo funciona?", "¿Es gratis?", "Ver dashboard"],
              actions: [{ label: "Ir al Dashboard", action: "navigate", url: "/dashboard" }],
            }
          }
  
          if (lowerMessage.includes("cómo funciona") || lowerMessage.includes("como funciona")) {
            return {
              message:
                "Nuestra plataforma funciona en 4 pasos simples: 1) Selecciona el modelo de IA, 2) Visualiza análisis históricos, 3) Obtén predicciones automáticas, 4) Toma decisiones informadas.",
              suggestions: ["Ver modelos disponibles", "¿Qué tan preciso es?", "Comenzar ahora"],
              actions: [{ label: "Probar Ahora", action: "navigate", url: "/dashboard" }],
            }
          }
        }
  
        // Dashboard responses
        if (pageContext.includes("dashboard")) {
          if (lowerMessage.includes("eur") || lowerMessage.includes("euro")) {
            return {
              message:
                "El EUR/USD es el par de divisas más negociado del mundo. En nuestro dashboard puedes ver el precio actual, cambios en 24h, y acceder a análisis detallado con predicciones de IA.",
              suggestions: ["Ver gráfico EUR/USD", "¿Cómo interpretar los datos?", "Predicciones"],
              actions: [{ label: "Análisis EUR/USD", action: "navigate", url: "/dashboard/eur-usd" }],
            }
          }
  
          if (lowerMessage.includes("predicción") || lowerMessage.includes("prediccion")) {
            return {
              message:
                "Nuestras predicciones utilizan modelos LSTM y GRU entrenados con años de datos históricos. Para ver predicciones detalladas, selecciona el par de divisas que te interese.",
              suggestions: ["Ver EUR/USD", "Ver USD/COP", "¿Cómo funcionan los modelos?"],
              actions: [
                { label: "EUR/USD", action: "navigate", url: "/dashboard/eur-usd" },
                { label: "USD/COP", action: "navigate", url: "/dashboard/usd-cop" },
              ],
            }
          }
        }
  
        // Chart page responses
        if (pageContext.includes("análisis")) {
          if (lowerMessage.includes("gráfico") || lowerMessage.includes("grafico")) {
            return {
              message:
                "El gráfico muestra datos históricos (línea sólida) y predicciones futuras (línea punteada). Puedes cambiar entre diferentes tipos de visualización: línea, velas japonesas, barras o área.",
              suggestions: ["¿Cómo leer velas japonesas?", "¿Qué significan los colores?", "Cambiar período"],
            }
          }
  
          if (lowerMessage.includes("modelo") || lowerMessage.includes("ia")) {
            return {
              message:
                "Utilizamos modelos de deep learning como LSTM (Long Short-Term Memory) y GRU (Gated Recurrent Unit), especialmente diseñados para analizar series temporales financieras y detectar patrones complejos.",
              suggestions: ["¿Qué es LSTM?", "¿Qué tan preciso es?", "Ver otros modelos"],
            }
          }
        }
  
        // General help
        if (lowerMessage.includes("ayuda") || lowerMessage.includes("help")) {
          return {
            message: `Estoy aquí para ayudarte con Analytics Market AI. Actualmente estás en ${pageContext}. Puedo responder preguntas sobre la plataforma, análisis de mercado, predicciones de IA, y cómo usar las diferentes funcionalidades.`,
            suggestions: ["¿Qué puedo hacer aquí?", "Características principales", "Contacto"],
          }
        }
  
        // Default response
        return {
          message: `Gracias por tu pregunta. Estoy aquí para ayudarte con Analytics Market AI. ¿Hay algo específico sobre ${pageContext} que te gustaría saber?`,
          suggestions: ["Características principales", "¿Cómo empezar?", "Soporte técnico"],
        }
      } catch (error) {
        console.error("Error in ChatService:", error)
        return {
          message: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
          suggestions: ["Ayuda", "Contacto"],
        }
      }
    }
  }
  