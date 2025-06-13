"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type AIAssistantProps = {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hola, soy ComplianceBot, tu asistente de compliance. ¿En qué puedo ayudarte hoy?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Ejemplos de preguntas sugeridas
  const suggestedQuestions = [
    "¿Cómo puedo mejorar el nivel de compliance?",
    "Explícame los requisitos de ISO 27001",
    "¿Qué acciones debo tomar para este hallazgo?",
    "Genera un plan de acción para este assessment",
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Aquí iría la integración real con la API de IA
      // Este es un ejemplo usando AI SDK
      const prompt = `
        Eres ComplianceBot, un asistente especializado en compliance regulatorio y gestión de riesgos.
        Responde de manera concisa y profesional a la siguiente consulta: ${input}
      `

      // Simulamos una respuesta para demostración
      // En producción, usaríamos:
      // const { text } = await generateText({
      //   model: openai("gpt-4o"),
      //   prompt: prompt,
      // })

      // Simulación de respuesta con delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Respuesta simulada basada en palabras clave
      let responseText =
        "Lo siento, no tengo información específica sobre esa consulta. ¿Puedes proporcionar más detalles?"

      if (input.toLowerCase().includes("iso")) {
        responseText =
          "ISO 27001 es un estándar internacional para la gestión de seguridad de la información. Requiere identificar riesgos sistemáticamente, implementar controles de seguridad y adoptar un proceso de gestión para garantizar que los controles satisfagan las necesidades de seguridad de la organización."
      } else if (input.toLowerCase().includes("compliance") || input.toLowerCase().includes("cumplimiento")) {
        responseText =
          "Para mejorar el nivel de compliance, recomiendo: 1) Realizar evaluaciones regulares, 2) Implementar planes de acción para los hallazgos, 3) Capacitar al personal, 4) Mantener documentación actualizada, y 5) Establecer un proceso de mejora continua."
      } else if (input.toLowerCase().includes("plan") || input.toLowerCase().includes("acción")) {
        responseText =
          "Para generar un plan de acción efectivo: 1) Identifica claramente el hallazgo o no conformidad, 2) Establece acciones correctivas específicas, 3) Asigna responsables, 4) Define plazos realistas, 5) Establece métricas de éxito, y 6) Programa seguimientos periódicos."
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error al generar respuesta:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card
          className={cn(
            "flex flex-col w-[380px] shadow-lg border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden",
            isExpanded ? "h-[600px]" : "h-[60px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm">ComplianceBot</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Asistente de Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[85%] rounded-lg p-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground self-end"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 self-start",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 self-start bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Generando respuesta...</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Suggested questions */}
              {messages.length <= 2 && (
                <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preguntas sugeridas:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-3 py-1 transition-colors"
                        onClick={() => {
                          setInput(question)
                          if (inputRef.current) {
                            inputRef.current.focus()
                          }
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta..."
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Potenciado por IA especializada en compliance
                  </p>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
