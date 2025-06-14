"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Trash2, GripVertical, AlertCircle, X, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { AIAssistant } from "@/components/ai-assistant"

const categories = ["ISO 27001", "Ley Fintech", "PCI DSS", "GDPR"]

const questionTypes = [
  { value: "text", label: "Texto" },
  { value: "yesno", label: "Sí/No" },
  { value: "multiple", label: "Opción múltiple" },
  { value: "checkbox", label: "Casillas de verificación" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
]

interface Question {
  id: string
  text: string
  type: string
  required: boolean
  options?: string[]
  conditionals: Conditional[]
}

interface Conditional {
  questionId: string
  operator: "equals" | "notEquals"
  value: string
  action: "show" | "hide"
  targetQuestionId: string
}

interface SortableQuestionProps {
  question: Question
  index: number
  questions: Question[]
  onUpdate: (id: string, field: string, value: any) => void
  onAddOption: (id: string) => void
  onUpdateOption: (id: string, index: number, value: string) => void
  onRemoveOption: (id: string, index: number) => void
  onRemove: (id: string) => void
  onAddConditional: (questionId: string) => void
  onUpdateConditional: (questionId: string, index: number, field: string, value: any) => void
  onRemoveConditional: (questionId: string, index: number) => void
}

function SortableQuestion({
  question,
  index,
  questions,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onRemove,
  onAddConditional,
  onUpdateConditional,
  onRemoveConditional,
}: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const previousQuestions = questions.slice(0, index)

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...attributes} {...listeners} className="mt-2 cursor-grab p-1 hover:bg-muted rounded-md touch-none">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`question-${question.id}`} className="text-base font-medium">
                    Pregunta {index + 1}
                  </Label>
                  <Textarea
                    id={`question-${question.id}`}
                    value={question.text}
                    onChange={(e) => onUpdate(question.id, "text", e.target.value)}
                    placeholder="Escriba la pregunta..."
                    className="resize-none"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(question.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar pregunta</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`type-${question.id}`}>Tipo de respuesta</Label>
                  <Select value={question.type} onValueChange={(value) => onUpdate(question.id, "type", value)}>
                    <SelectTrigger id={`type-${question.id}`}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) => onUpdate(question.id, "required", checked)}
                    />
                    <Label htmlFor={`required-${question.id}`}>Obligatorio</Label>
                  </div>
                </div>
              </div>

              {(question.type === "multiple" || question.type === "checkbox") && (
                <div className="space-y-2">
                  <Label>Opciones</Label>
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => onUpdateOption(question.id, optionIndex, e.target.value)}
                        placeholder={`Opción ${optionIndex + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveOption(question.id, optionIndex)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar opción</span>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => onAddOption(question.id)}>
                    <Plus className="mr-2 h-4 w-4" /> Añadir opción
                  </Button>
                </div>
              )}

              {previousQuestions.length > 0 && (
                <div className="space-y-2">
                  <Label>Condiciones</Label>
                  {question.conditionals.map((conditional, conditionalIndex) => (
                    <div key={conditionalIndex} className="flex items-center gap-2">
                      <Select
                        value={conditional.questionId}
                        onValueChange={(value) =>
                          onUpdateConditional(question.id, conditionalIndex, "questionId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar pregunta" />
                        </SelectTrigger>
                        <SelectContent>
                          {previousQuestions.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={conditional.operator}
                        onValueChange={(value) =>
                          onUpdateConditional(question.id, conditionalIndex, "operator", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar operador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="notEquals">No igual a</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={conditional.value}
                        onChange={(e) =>
                          onUpdateConditional(question.id, conditionalIndex, "value", e.target.value)
                        }
                        placeholder="Valor"
                      />
                      <Select
                        value={conditional.action}
                        onValueChange={(value) =>
                          onUpdateConditional(question.id, conditionalIndex, "action", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar acción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Mostrar</SelectItem>
                          <SelectItem value="hide">Ocultar</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveConditional(question.id, conditionalIndex)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar condición</span>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => onAddConditional(question.id)}>
                    <Plus className="mr-2 h-4 w-4" /> Añadir condición
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CreateChecklistDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isTemplate, setIsTemplate] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      type: "text",
      required: false,
      options: [],
      conditionals: [],
    }
    setQuestions([...questions, newQuestion])
  }

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            [field]: value,
          }
        }
        return q
      }),
    )
  }

  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...(q.options || []), ""],
          }
        }
        return q
      }),
    )
  }

  const handleUpdateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = [...(q.options || [])]
          updatedOptions[index] = value
          return {
            ...q,
            options: updatedOptions,
          }
        }
        return q
      }),
    )
  }

  const handleRemoveOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = [...(q.options || [])]
          updatedOptions.splice(index, 1)
          return {
            ...q,
            options: updatedOptions,
          }
        }
        return q
      }),
    )
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleAddConditional = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            conditionals: [
              ...q.conditionals,
              {
                questionId: "",
                operator: "equals",
                value: "",
                action: "show",
                targetQuestionId: "",
              },
            ],
          }
        }
        return q
      }),
    )
  }

  const handleUpdateConditional = (questionId: string, index: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedConditionals = [...q.conditionals]
          updatedConditionals[index] = {
            ...updatedConditionals[index],
            [field]: value,
          }
          return {
            ...q,
            conditionals: updatedConditionals,
          }
        }
        return q
      }),
    )
  }

  const handleRemoveConditional = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedConditionals = [...q.conditionals]
          updatedConditionals.splice(index, 1)
          return {
            ...q,
            conditionals: updatedConditionals,
          }
        }
        return q
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!name || !description || !category) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      setActiveTab("details")
      return
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos una pregunta al checklist",
        variant: "destructive",
      })
      setActiveTab("questions")
      return
    }

    const invalidQuestions = questions.filter((q) => !q.text)
    if (invalidQuestions.length > 0) {
      toast({
        title: "Error",
        description: "Todas las preguntas deben tener un texto",
        variant: "destructive",
      })
      setActiveTab("questions")
      return
    }

    const invalidOptions = questions.some(
      (q) => (q.type === "multiple" || q.type === "checkbox") && (!q.options || q.options.length < 2),
    )
    if (invalidOptions) {
      toast({
        title: "Error",
        description: "Las preguntas de opción múltiple o casillas deben tener al menos 2 opciones",
        variant: "destructive",
      })
      setActiveTab("questions")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Éxito",
        description: "Checklist creado exitosamente",
      })
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el checklist",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setCategory("")
    setIsTemplate(false)
    setQuestions([])
    setActiveTab("details")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Checklist</DialogTitle>
          <DialogDescription>
            Complete los detalles para crear un nuevo checklist.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="questions">Preguntas</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Título</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="template"
                  checked={isTemplate}
                  onCheckedChange={setIsTemplate}
                />
                <Label htmlFor="template">Usar como plantilla</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear"}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="questions">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preguntas del Checklist</h3>
                <Button onClick={handleAddQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Pregunta
                </Button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                  {questions.map((question, index) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      questions={questions}
                      onUpdate={handleUpdateQuestion}
                      onAddOption={handleAddOption}
                      onUpdateOption={handleUpdateOption}
                      onRemoveOption={handleRemoveOption}
                      onRemove={handleRemoveQuestion}
                      onAddConditional={handleAddConditional}
                      onUpdateConditional={handleUpdateConditional}
                      onRemoveConditional={handleRemoveConditional}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay preguntas agregadas. Haga clic en "Añadir Pregunta" para comenzar.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 