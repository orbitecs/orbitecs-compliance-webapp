"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToastContext } from "@/components/ui/toast-provider"
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
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo para un plan de acción específico (mismo que en la página de detalle)
const actionPlanData = {
  id: "AP-001",
  finding: "No existe una política de seguridad de la información aprobada",
  action: "Desarrollar y aprobar una política de seguridad de la información",
  responsible: "Juan Pérez",
  dueDate: new Date(2023, 6, 15),
  status: "pendiente",
  description:
    "Se requiere desarrollar y aprobar una política de seguridad de la información que cumpla con los requisitos de ISO 27001.",
  progress: 30,
  createdAt: new Date(2023, 5, 10),
  updatedAt: new Date(2023, 5, 20),
  assessments: [
    {
      id: "ASS-001",
      name: "ISO 27001 - Evaluación Anual",
    },
    {
      id: "ASS-005",
      name: "ISO 27001 - Evaluación de Controles",
    },
  ],
  activities: [
    {
      id: "ACT-001",
      description: "Investigar estándares y mejores prácticas",
      status: "completado",
      date: new Date(2023, 5, 15),
    },
    {
      id: "ACT-002",
      description: "Redactar borrador de política",
      status: "en-curso",
      date: new Date(2023, 6, 1),
    },
    {
      id: "ACT-003",
      description: "Revisión por parte de stakeholders",
      status: "pendiente",
      date: new Date(2023, 6, 10),
    },
    {
      id: "ACT-004",
      description: "Aprobación por la dirección",
      status: "pendiente",
      date: new Date(2023, 6, 15),
    },
  ],
}

// Lista de assessments disponibles para seleccionar
const availableAssessments = [
  {
    id: "ASS-001",
    name: "ISO 27001 - Evaluación Anual",
  },
  {
    id: "ASS-002",
    name: "Ley Fintech - Evaluación Trimestral",
  },
  {
    id: "ASS-003",
    name: "PCI DSS - Evaluación Semestral",
  },
  {
    id: "ASS-004",
    name: "GDPR - Evaluación de Cumplimiento",
  },
  {
    id: "ASS-005",
    name: "ISO 27001 - Evaluación de Controles",
  },
]

export default function EditActionPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showSuccess, showError } = useToastContext()
  const [actionPlan, setActionPlan] = useState(actionPlanData)
  const [date, setDate] = useState<Date | undefined>(actionPlanData.dueDate)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteActivityDialogOpen, setDeleteActivityDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>(actionPlanData.assessments.map((a) => a.id))

  // En una aplicación real, aquí cargaríamos los datos del plan de acción según el ID
  useEffect(() => {
    // Simular carga de datos
    setActionPlan(actionPlanData)
    setDate(actionPlanData.dueDate)
    setSelectedAssessments(actionPlanData.assessments.map((a) => a.id))
  }, [params.id])

  // Marcar cambios no guardados cuando se modifica el plan de acción
  useEffect(() => {
    setUnsavedChanges(true)
  }, [actionPlan, date, selectedAssessments])

  const handleUpdateActionPlan = (field: string, value: any) => {
    setActionPlan({
      ...actionPlan,
      [field]: value,
    })
  }

  const handleUpdateActivity = (activityId: string, field: string, value: any) => {
    setActionPlan({
      ...actionPlan,
      activities: actionPlan.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            [field]: value,
          }
        }
        return activity
      }),
    })
  }

  const handleDeleteActivity = () => {
    if (!activityToDelete) return

    setActionPlan({
      ...actionPlan,
      activities: actionPlan.activities.filter((activity) => activity.id !== activityToDelete),
    })

    setDeleteActivityDialogOpen(false)
    setActivityToDelete(null)
    showSuccess("Actividad eliminada correctamente")
  }

  const handleDeleteActivityClick = (activityId: string) => {
    setActivityToDelete(activityId)
    setDeleteActivityDialogOpen(true)
  }

  const handleAddActivity = () => {
    const newActivity = {
      id: `ACT-${actionPlan.activities.length + 1}`.padStart(7, "0"),
      description: "",
      status: "pendiente",
      date: new Date(),
    }

    setActionPlan({
      ...actionPlan,
      activities: [...actionPlan.activities, newActivity],
    })
  }

  const handleAssessmentChange = (assessmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssessments([...selectedAssessments, assessmentId])
    } else {
      setSelectedAssessments(selectedAssessments.filter((id) => id !== assessmentId))
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Actualizar el plan de acción con los assessments seleccionados
      const updatedActionPlan = {
        ...actionPlan,
        dueDate: date || actionPlan.dueDate,
        assessments: availableAssessments.filter((a) => selectedAssessments.includes(a.id)),
        updatedAt: new Date(),
      }

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      showSuccess("Plan de acción actualizado correctamente")
      setUnsavedChanges(false)
      router.push(`/action-plans/${params.id}`)
    } catch (error) {
      showError("Error al guardar los cambios")
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
            <h1 className="text-2xl font-bold tracking-tight">Editar Plan de Acción</h1>
            <p className="text-sm text-muted-foreground">ID: {actionPlan.id}</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Edite la información básica del plan de acción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="finding">Hallazgo</Label>
              <Textarea
                id="finding"
                value={actionPlan.finding}
                onChange={(e) => handleUpdateActionPlan("finding", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Acción Correctiva</Label>
              <Textarea
                id="action"
                value={actionPlan.action}
                onChange={(e) => handleUpdateActionPlan("action", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción Detallada</Label>
              <Textarea
                id="description"
                value={actionPlan.description}
                onChange={(e) => handleUpdateActionPlan("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsable</Label>
                <Select
                  value={actionPlan.responsible}
                  onValueChange={(value) => handleUpdateActionPlan("responsible", value)}
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
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={actionPlan.status} onValueChange={(value) => handleUpdateActionPlan("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en-curso">En curso</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      {date ? format(date, "PPP") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={actionPlan.progress}
                  onChange={(e) => handleUpdateActionPlan("progress", Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessments Relacionados</CardTitle>
            <CardDescription>Seleccione los assessments relacionados con este plan de acción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {availableAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assessment-${assessment.id}`}
                    checked={selectedAssessments.includes(assessment.id)}
                    onCheckedChange={(checked) => handleAssessmentChange(assessment.id, !!checked)}
                  />
                  <label
                    htmlFor={`assessment-${assessment.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {assessment.name} <span className="text-muted-foreground">({assessment.id})</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Actividades</CardTitle>
            <CardDescription>Gestione las actividades para completar este plan de acción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionPlan.activities.map((activity, index) => (
              <div key={activity.id} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">Actividad {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteActivityClick(activity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar actividad</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`activity-desc-${activity.id}`}>Descripción</Label>
                  <Input
                    id={`activity-desc-${activity.id}`}
                    value={activity.description}
                    onChange={(e) => handleUpdateActivity(activity.id, "description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`activity-date-${activity.id}`}>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id={`activity-date-${activity.id}`}
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          {format(activity.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={activity.date}
                          onSelect={(date) => handleUpdateActivity(activity.id, "date", date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`activity-status-${activity.id}`}>Estado</Label>
                    <Select
                      value={activity.status}
                      onValueChange={(value) => handleUpdateActivity(activity.id, "status", value)}
                    >
                      <SelectTrigger id={`activity-status-${activity.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en-curso">En curso</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" onClick={handleAddActivity}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Actividad
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación para eliminar actividad */}
      <AlertDialog open={deleteActivityDialogOpen} onOpenChange={setDeleteActivityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar esta actividad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La actividad será eliminada permanentemente del plan de acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteActivity} className="bg-red-600 hover:bg-red-700">
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
