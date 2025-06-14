"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Datos de ejemplo para un assessment específico (mismo que en la página de detalle)
const assessmentData = {
  id: "ASS-001",
  name: "ISO 27001 - Evaluación Anual",
  date: "12/06/2023",
  status: "Completado",
  compliance: 85,
  responsible: "Juan Pérez",
  category: "ISO 27001",
  description: "Evaluación anual de cumplimiento de controles de seguridad según ISO 27001.",
  checklists: [
    {
      id: "CL-001",
      name: "ISO 27001 - Controles de Seguridad",
      compliance: 90,
      questions: [
        {
          id: "Q1",
          text: "¿Se ha implementado un sistema de gestión de seguridad de la información (SGSI)?",
          answer: "Sí",
          compliance: true,
          evidence: "Documento SGSI-2023.pdf",
          comments: "Se verificó la existencia y actualización del SGSI",
        },
        {
          id: "Q2",
          text: "¿Existe una política de seguridad de la información aprobada por la dirección?",
          answer: "Sí",
          compliance: true,
          evidence: "Política-SI-v2.1.pdf",
          comments: "Política actualizada y aprobada en enero 2023",
        },
        {
          id: "Q3",
          text: "¿Se realizan evaluaciones de riesgos de seguridad periódicamente?",
          answer: "Parcial",
          compliance: false,
          evidence: "Registro-Evaluaciones.xlsx",
          comments: "Se realizan evaluaciones pero no con la periodicidad establecida",
        },
      ],
    },
    {
      id: "CL-005",
      name: "ISO 27001 - Gestión de Incidentes",
      compliance: 75,
      questions: [
        {
          id: "Q18",
          text: "¿Existe un procedimiento documentado para la gestión de incidentes de seguridad?",
          answer: "Sí",
          compliance: true,
          evidence: "Proc-GI-2023.pdf",
          comments: "Procedimiento actualizado y socializado",
        },
        {
          id: "Q19",
          text: "¿Se registran y clasifican todos los incidentes de seguridad?",
          answer: "Sí",
          compliance: true,
          evidence: "Registro-Incidentes.xlsx",
          comments: "Se mantiene registro actualizado",
        },
        {
          id: "Q20",
          text: "¿Se realizan análisis post-incidente para identificar mejoras?",
          answer: "No",
          compliance: false,
          evidence: "",
          comments: "No se evidencia análisis formal post-incidente",
        },
        {
          id: "Q21",
          text: "¿El personal está capacitado para identificar y reportar incidentes de seguridad?",
          answer: "Parcial",
          compliance: false,
          evidence: "Registro-Capacitaciones.pdf",
          comments: "Solo el 60% del personal ha recibido capacitación",
        },
      ],
    },
  ],
  findings: [
    {
      id: "F1",
      description: "No se realizan evaluaciones de riesgo con la periodicidad establecida",
      severity: "Media",
      relatedQuestion: "Q3",
    },
    {
      id: "F2",
      description: "No se realizan análisis post-incidente formales",
      severity: "Alta",
      relatedQuestion: "Q20",
    },
    {
      id: "F3",
      description: "Falta de capacitación en identificación y reporte de incidentes",
      severity: "Media",
      relatedQuestion: "Q21",
    },
  ],
}

export default function EditAssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [assessment, setAssessment] = useState(assessmentData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteQuestionDialogOpen, setDeleteQuestionDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<{ checklistId: string; questionId: string } | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)

  // En una aplicación real, aquí cargaríamos los datos del assessment según el ID
  useEffect(() => {
    // Simular carga de datos
    setAssessment(assessmentData)
  }, [params.id])

  // Marcar cambios no guardados cuando se modifica el assessment
  useEffect(() => {
    setUnsavedChanges(true)
  }, [assessment])

  const handleUpdateAssessment = (field: string, value: any) => {
    setAssessment({
      ...assessment,
      [field]: value,
    })
  }

  const handleUpdateQuestion = (checklistId: string, questionId: string, field: string, value: any) => {
    setAssessment({
      ...assessment,
      checklists: assessment.checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            questions: checklist.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  [field]: value,
                  // Si estamos actualizando la respuesta, actualizar también el cumplimiento
                  ...(field === "answer" && {
                    compliance: value === "Sí",
                  }),
                }
              }
              return question
            }),
          }
        }
        return checklist
      }),
    })
  }

  const handleDeleteQuestion = () => {
    if (!questionToDelete) return

    const { checklistId, questionId } = questionToDelete

    setAssessment({
      ...assessment,
      checklists: assessment.checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            questions: checklist.questions.filter((q) => q.id !== questionId),
          }
        }
        return checklist
      }),
      // También eliminar cualquier hallazgo relacionado con esta pregunta
      findings: assessment.findings.filter((f) => f.relatedQuestion !== questionId),
    })

    setDeleteQuestionDialogOpen(false)
    setQuestionToDelete(null)
    showSuccess("Pregunta eliminada correctamente")
  }

  const handleDeleteQuestionClick = (checklistId: string, questionId: string) => {
    setQuestionToDelete({ checklistId, questionId })
    setDeleteQuestionDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Éxito",
        description: "Assessment actualizado correctamente.",
      })
      setUnsavedChanges(false)
      router.push(`/assessments/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar los cambios.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (unsavedChanges) {
      setDiscardDialogOpen(true)
    } else {
      router.back()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Assessment</h1>
            <p className="text-sm text-muted-foreground">ID: {assessment.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="findings">Hallazgos</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Edite la información básica del assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Assessment</Label>
                <Input
                  id="name"
                  value={assessment.name}
                  onChange={(e) => handleUpdateAssessment("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={assessment.description}
                  onChange={(e) => handleUpdateAssessment("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={assessment.category}
                    onValueChange={(value) => handleUpdateAssessment("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                      <SelectItem value="Ley Fintech">Ley Fintech</SelectItem>
                      <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                      <SelectItem value="GDPR">GDPR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsable</Label>
                  <Select
                    value={assessment.responsible}
                    onValueChange={(value) => handleUpdateAssessment("responsible", value)}
                  >
                    <SelectTrigger id="responsible">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                      <SelectItem value="María González">María González</SelectItem>
                      <SelectItem value="Carlos Rodríguez">Carlos Rodríguez</SelectItem>
                      <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={format(new Date(assessment.date), "yyyy-MM-dd", { locale: es })}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      const formattedDate = format(date, "dd/MM/yyyy", { locale: es })
                      handleUpdateAssessment("date", formattedDate)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={assessment.status} onValueChange={(value) => handleUpdateAssessment("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {assessment.checklists.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader>
                <CardTitle>{checklist.name}</CardTitle>
                <CardDescription>ID: {checklist.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {checklist.questions.map((question) => (
                  <div key={question.id} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {question.id}: {question.text}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteQuestionClick(checklist.id, question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar pregunta</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${question.id}`}>Respuesta</Label>
                        <Select
                          value={question.answer}
                          onValueChange={(value) => handleUpdateQuestion(checklist.id, question.id, "answer", value)}
                        >
                          <SelectTrigger id={`answer-${question.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sí">Sí</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Parcial">Parcial</SelectItem>
                            <SelectItem value="N/A">No Aplica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`compliance-${question.id}`}>Cumplimiento</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id={`compliance-${question.id}`}
                            checked={question.compliance}
                            onCheckedChange={(checked) =>
                              handleUpdateQuestion(checklist.id, question.id, "compliance", !!checked)
                            }
                          />
                          <label
                            htmlFor={`compliance-${question.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Conforme
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`evidence-${question.id}`}>Evidencia</Label>
                      <Input
                        id={`evidence-${question.id}`}
                        value={question.evidence}
                        onChange={(e) => handleUpdateQuestion(checklist.id, question.id, "evidence", e.target.value)}
                        placeholder="Nombre del archivo o referencia"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`comments-${question.id}`}>Comentarios</Label>
                      <Textarea
                        id={`comments-${question.id}`}
                        value={question.comments}
                        onChange={(e) => handleUpdateQuestion(checklist.id, question.id, "comments", e.target.value)}
                        placeholder="Comentarios adicionales"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="findings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hallazgos</CardTitle>
              <CardDescription>Edite los hallazgos identificados durante la evaluación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.findings.map((finding, index) => (
                <div key={finding.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{finding.id}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setAssessment({
                          ...assessment,
                          findings: assessment.findings.filter((_, i) => i !== index),
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar hallazgo</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`finding-desc-${finding.id}`}>Descripción</Label>
                    <Textarea
                      id={`finding-desc-${finding.id}`}
                      value={finding.description}
                      onChange={(e) => {
                        const updatedFindings = [...assessment.findings]
                        updatedFindings[index] = {
                          ...finding,
                          description: e.target.value,
                        }
                        setAssessment({
                          ...assessment,
                          findings: updatedFindings,
                        })
                      }}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`finding-severity-${finding.id}`}>Severidad</Label>
                      <Select
                        value={finding.severity}
                        onValueChange={(value) => {
                          const updatedFindings = [...assessment.findings]
                          updatedFindings[index] = {
                            ...finding,
                            severity: value,
                          }
                          setAssessment({
                            ...assessment,
                            findings: updatedFindings,
                          })
                        }}
                      >
                        <SelectTrigger id={`finding-severity-${finding.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`finding-question-${finding.id}`}>Pregunta Relacionada</Label>
                      <Select
                        value={finding.relatedQuestion}
                        onValueChange={(value) => {
                          const updatedFindings = [...assessment.findings]
                          updatedFindings[index] = {
                            ...finding,
                            relatedQuestion: value,
                          }
                          setAssessment({
                            ...assessment,
                            findings: updatedFindings,
                          })
                        }}
                      >
                        <SelectTrigger id={`finding-question-${finding.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assessment.checklists.flatMap((checklist) =>
                            checklist.questions.map((question) => (
                              <SelectItem key={question.id} value={question.id}>
                                {question.id}
                              </SelectItem>
                            )),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newId = `F${assessment.findings.length + 1}`
                  setAssessment({
                    ...assessment,
                    findings: [
                      ...assessment.findings,
                      {
                        id: newId,
                        description: "",
                        severity: "Media",
                        relatedQuestion: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Añadir Hallazgo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar pregunta */}
      <AlertDialog open={deleteQuestionDialogOpen} onOpenChange={setDeleteQuestionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar esta pregunta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La pregunta será eliminada permanentemente del assessment.
              {questionToDelete &&
                assessment.findings.some((f) => f.relatedQuestion === questionToDelete.questionId) && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-800">Atención</div>
                      <div className="text-sm text-amber-700">
                        Esta pregunta tiene hallazgos asociados que también serán eliminados.
                      </div>
                    </div>
                  </div>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para descartar cambios */}
      <AlertDialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tiene cambios sin guardar. ¿Está seguro de que desea salir? Los cambios realizados se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
