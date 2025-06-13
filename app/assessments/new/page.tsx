"use client"

import { useState } from "react"
import { Plus, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo
const checklists = [
  {
    id: "CL-001",
    name: "ISO 27001 - Controles de Seguridad",
    questions: [
      {
        id: "Q1",
        text: "¿Se ha implementado un sistema de gestión de seguridad de la información (SGSI)?",
      },
      {
        id: "Q2",
        text: "¿Existe una política de seguridad de la información aprobada por la dirección?",
      },
      {
        id: "Q3",
        text: "¿Se realizan evaluaciones de riesgos de seguridad periódicamente?",
      },
    ],
  },
  {
    id: "CL-002",
    name: "Ley Fintech - Requisitos Generales",
    questions: [
      {
        id: "Q4",
        text: "¿La organización cuenta con los permisos y licencias requeridos por la Ley Fintech?",
      },
      {
        id: "Q5",
        text: "¿Se han implementado los controles para la prevención de lavado de dinero?",
      },
    ],
  },
]

export default function NewAssessmentPage() {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [selectedChecklists, setSelectedChecklists] = useState<string[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [customQuestions, setCustomQuestions] = useState<{ id: string; text: string }[]>([])
  const [newCustomQuestion, setNewCustomQuestion] = useState("")

  const handleChecklistToggle = (checklistId: string) => {
    if (selectedChecklists.includes(checklistId)) {
      setSelectedChecklists(selectedChecklists.filter((id) => id !== checklistId))
      // Remove all questions from this checklist
      const questionsToRemove = checklists.find((cl) => cl.id === checklistId)?.questions.map((q) => q.id) || []
      setSelectedQuestions(selectedQuestions.filter((id) => !questionsToRemove.includes(id)))
    } else {
      setSelectedChecklists([...selectedChecklists, checklistId])
    }
  }

  const handleQuestionToggle = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
    } else {
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const addCustomQuestion = () => {
    if (newCustomQuestion.trim()) {
      const newQuestion = {
        id: `CQ-${customQuestions.length + 1}`,
        text: newCustomQuestion,
      }
      setCustomQuestions([...customQuestions, newQuestion])
      setSelectedQuestions([...selectedQuestions, newQuestion.id])
      setNewCustomQuestion("")
    }
  }

  const removeCustomQuestion = (questionId: string) => {
    setCustomQuestions(customQuestions.filter((q) => q.id !== questionId))
    setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
  }

  const totalSelectedQuestions = selectedQuestions.length + customQuestions.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Assessment</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Vista previa
          </Button>
          <Button>Guardar Assessment</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Ingrese la información básica del assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Assessment</Label>
                <Input
                  id="title"
                  placeholder="Ej: Evaluación Anual ISO 27001"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Descripción del assessment..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsable</Label>
                <Select>
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Juan Pérez</SelectItem>
                    <SelectItem value="user2">María González</SelectItem>
                    <SelectItem value="user3">Carlos Rodríguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selección de Checklists</CardTitle>
              <CardDescription>Seleccione los checklists que desea incluir en el assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {checklists.map((checklist) => (
                  <AccordionItem key={checklist.id} value={checklist.id}>
                    <div className="flex items-center py-2">
                      <Checkbox
                        id={`checklist-${checklist.id}`}
                        checked={selectedChecklists.includes(checklist.id)}
                        onCheckedChange={() => handleChecklistToggle(checklist.id)}
                      />
                      <AccordionTrigger className="ml-2 flex-1 hover:no-underline">{checklist.name}</AccordionTrigger>
                    </div>
                    <AccordionContent>
                      <div className="pl-6 space-y-2">
                        {checklist.questions.map((question) => (
                          <div key={question.id} className="flex items-start py-1">
                            <Checkbox
                              id={`question-${question.id}`}
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() => handleQuestionToggle(question.id)}
                              className="mt-1"
                            />
                            <label htmlFor={`question-${question.id}`} className="ml-2 text-sm">
                              {question.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preguntas Personalizadas</CardTitle>
              <CardDescription>Agregue preguntas personalizadas al assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Escriba una nueva pregunta..."
                  value={newCustomQuestion}
                  onChange={(e) => setNewCustomQuestion(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addCustomQuestion}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Agregar pregunta</span>
                </Button>
              </div>
              <div className="space-y-2">
                {customQuestions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-2 border rounded-md">
                    <span className="text-sm">{question.text}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeCustomQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar pregunta</span>
                    </Button>
                  </div>
                ))}
                {customQuestions.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay preguntas personalizadas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Título</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title || "Sin título"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Fecha</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{date || "Sin fecha"}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Checklists seleccionados</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChecklists.length} checklists</p>
                <ul className="mt-2 space-y-1">
                  {selectedChecklists.map((id) => {
                    const checklist = checklists.find((cl) => cl.id === id)
                    return (
                      <li key={id} className="text-xs">
                        • {checklist?.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Preguntas seleccionadas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{totalSelectedQuestions} preguntas</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Guardar Assessment</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
