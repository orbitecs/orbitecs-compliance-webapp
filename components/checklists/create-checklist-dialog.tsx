"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, GripVertical, AlertCircle } from "lucide-react"
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
import { useToastContext } from "@/components/ui/toast-provider"
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
                  <div className="flex items-center justify-between">
                    <Label>Condicionales</Label>
                    <Button variant="outline" size="sm" onClick={() => onAddConditional(question.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Añadir condicional
                    </Button>
                  </div>

                  {question.conditionals.length > 0 ? (
                    question.conditionals.map((conditional, condIndex) => (
                      <div key={condIndex} className="border rounded-md p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`cond-question-${question.id}-${condIndex}`}>Si la pregunta</Label>
                            <Select
                              value={conditional.questionId}
                              onValueChange={(value) =>
                                onUpdateConditional(question.id, condIndex, "questionId", value)
                              }
                            >
                              <SelectTrigger id={`cond-question-${question.id}-${condIndex}`}>
                                <SelectValue placeholder="Seleccionar pregunta" />
                              </SelectTrigger>
                              <SelectContent>
                                {previousQuestions.map((q) => (
                                  <SelectItem key={q.id} value={q.id}>
                                    Pregunta {questions.findIndex((pq) => pq.id === q.id) + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`cond-operator-${question.id}-${condIndex}`}>Operador</Label>
                            <Select
                              value={conditional.operator}
                              onValueChange={(value) =>
                                onUpdateConditional(question.id, condIndex, "operator", value as "equals" | "notEquals")
                              }
                            >
                              <SelectTrigger id={`cond-operator-${question.id}-${condIndex}`}>
                                <SelectValue placeholder="Seleccionar operador" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Es igual a</SelectItem>
                                <SelectItem value="notEquals">No es igual a</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`cond-value-${question.id}-${condIndex}`}>Valor</Label>
                            <Input
                              id={`cond-value-${question.id}-${condIndex}`}
                              value={conditional.value}
                              onChange={(e) => onUpdateConditional(question.id, condIndex, "value", e.target.value)}
                              placeholder="Valor de comparación"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cond-action-${question.id}-${condIndex}`}>Acción</Label>
                            <Select
                              value={conditional.action}
                              onValueChange={(value) =>
                                onUpdateConditional(question.id, condIndex, "action", value as "show" | "hide")
                              }
                            >
                              <SelectTrigger id={`cond-action-${question.id}-${condIndex}`}>
                                <SelectValue placeholder="Seleccionar acción" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="show">Mostrar</SelectItem>
                                <SelectItem value="hide">Ocultar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <Label htmlFor={`cond-target-${question.id}-${condIndex}`}>Esta pregunta</Label>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveConditional(question.id, condIndex)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar condicional</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay condicionales configurados</p>
                  )}
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
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccess, showError } = useToastContext()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const resetForm = () => {
    setName("")
    setDescription("")
    setCategory("")
    setQuestions([])
    setActiveTab("details")
  }

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      type: "text",
      required: true,
      options: [], // Aseguramos que siempre esté inicializado como array vacío
      conditionals: [],
    }
    setQuestions([...questions, newQuestion])
  }

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value }
        }
        return q
      }),
    )
  }

  const handleRemoveQuestion = (id: string) => {
    // Eliminar la pregunta
    const updatedQuestions = questions.filter((q) => q.id !== id)

    // Eliminar cualquier condicional que haga referencia a esta pregunta
    const cleanedQuestions = updatedQuestions.map((q) => ({
      ...q,
      conditionals: q.conditionals.filter((c) => c.questionId !== id),
    }))

    setQuestions(cleanedQuestions)
  }

  const handleAddOption = (id: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            options: [...(q.options || []), ""], // Usamos un array vacío como fallback si options es undefined
          }
        }
        return q
      }),
    )
  }

  const handleUpdateOption = (id: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
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

  const handleRemoveOption = (id: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
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
                targetQuestionId: questionId,
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((q) => q.id === active.id)
        const newIndex = items.findIndex((q) => q.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!name || !description || !category) {
      showError("Por favor complete todos los campos requeridos")
      setActiveTab("details")
      return
    }

    if (questions.length === 0) {
      showError("Debe agregar al menos una pregunta al checklist")
      setActiveTab("questions")
      return
    }

    const invalidQuestions = questions.filter((q) => !q.text)
    if (invalidQuestions.length > 0) {
      showError("Todas las preguntas deben tener un texto")
      setActiveTab("questions")
      return
    }

    const invalidOptions = questions.some(
      (q) => (q.type === "multiple" || q.type === "checkbox") && (!q.options || q.options.length < 2),
    )
    if (invalidOptions) {
      showError("Las preguntas de opción múltiple o casillas deben tener al menos 2 opciones")
      setActiveTab("questions")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      showSuccess("Checklist creado exitosamente")
      setOpen(false)
      resetForm()
    } catch (error) {
      showError("Error al crear el checklist")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPreview = () => {
    if (questions.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay preguntas</AlertTitle>
          <AlertDescription>Agregue preguntas para ver la vista previa</AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{name || "Nombre del checklist"}</h3>
          <p className="text-sm text-muted-foreground">{description || "Descripción del checklist"}</p>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-md p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-medium">{index + 1}.</span>
                <div className="flex-1">
                  <p className="font-medium">
                    {question.text || "Texto de la pregunta"}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </p>

                  {question.type === "text" && <Input disabled placeholder="Respuesta de texto" className="mt-2" />}

                  {question.type === "yesno" && (
                    <RadioGroup className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`yes-${question.id}`} disabled />
                        <Label htmlFor={`yes-${question.id}`}>Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`no-${question.id}`} disabled />
                        <Label htmlFor={`no-${question.id}`}>No</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {question.type === "multiple" && (
                    <RadioGroup className="mt-2">
                      {(question.options || []).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={`opt-${optIndex}`} id={`opt-${question.id}-${optIndex}`} disabled />
                          <Label htmlFor={`opt-${question.id}-${optIndex}`}>{option || `Opción ${optIndex + 1}`}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <div className="mt-2 space-y-2">
                      {(question.options || []).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <Checkbox id={`check-${question.id}-${optIndex}`} disabled />
                          <Label htmlFor={`check-${question.id}-${optIndex}`}>
                            {option || `Opción ${optIndex + 1}`}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "number" && <Input type="number" disabled placeholder="0" className="mt-2" />}

                  {question.type === "date" && <Input type="date" disabled className="mt-2" />}

                  {question.conditionals.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p className="font-medium">Condicionales:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {question.conditionals.map((cond, condIndex) => {
                          const sourceQuestion = questions.find((q) => q.id === cond.questionId)
                          const sourceIndex = questions.findIndex((q) => q.id === cond.questionId) + 1
                          return (
                            <li key={condIndex}>
                              Si la pregunta {sourceIndex} {cond.operator === "equals" ? "es igual a" : "no es igual a"}{" "}
                              "{cond.value}", entonces {cond.action === "show" ? "mostrar" : "ocultar"} esta pregunta
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen || !isSubmitting) {
          setOpen(newOpen)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Crear Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Checklist</DialogTitle>
            <DialogDescription>Complete los detalles para crear un nuevo checklist de cumplimiento.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="questions">Preguntas</TabsTrigger>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-2">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="required">
                    Nombre del Checklist
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: ISO 27001 - Controles de Seguridad"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="required">
                    Categoría
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar categoría" />
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
                <div className="grid gap-2">
                  <Label htmlFor="description" className="required">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción detallada del checklist..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="py-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Preguntas</h3>
                  <Button type="button" onClick={handleAddQuestion}>
                    <Plus className="mr-2 h-4 w-4" /> Añadir Pregunta
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">
                      No hay preguntas. Haga clic en "Añadir Pregunta" para comenzar.
                    </p>
                  </div>
                ) : (
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
                )}

                {questions.length > 0 && (
                  <Button type="button" variant="outline" className="w-full" onClick={handleAddQuestion}>
                    <Plus className="mr-2 h-4 w-4" /> Añadir Otra Pregunta
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="py-2">
              {renderPreview()}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Checklist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
