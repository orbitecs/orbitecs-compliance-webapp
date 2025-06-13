"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

// Datos de ejemplo para un plan de acción específico
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

const statusMap = {
  pendiente: { label: "Pendiente", variant: "outline" as const },
  "en-curso": { label: "En curso", variant: "default" as const },
  finalizado: { label: "Finalizado", variant: "secondary" as const },
  completado: { label: "Completado", variant: "secondary" as const },
}

export default function ActionPlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showSuccess, showError } = useToastContext()
  const [activeTab, setActiveTab] = useState("details")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmationId, setConfirmationId] = useState("")

  // En una aplicación real, aquí cargaríamos los datos del plan de acción según el ID
  // Por ahora usamos los datos de ejemplo
  const actionPlan = actionPlanData

  const handleDeleteClick = () => {
    setConfirmationId("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (confirmationId === actionPlan.id) {
      // Aquí iría la lógica para eliminar el plan de acción
      showSuccess(`Plan de acción ${actionPlan.id} eliminado correctamente`)
      setDeleteDialogOpen(false)
      router.push("/action-plans")
    } else {
      showError("El ID de confirmación no coincide")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detalles del Plan de Acción</h1>
            <p className="text-sm text-muted-foreground">ID: {actionPlan.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/action-plans/${params.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={statusMap[actionPlan.status].variant} className="text-base">
              {statusMap[actionPlan.status].label}
            </Badge>
            <div className="mt-1 text-xs text-muted-foreground">
              Fecha límite: {format(actionPlan.dueDate, "dd/MM/yyyy")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{actionPlan.progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${actionPlan.progress}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Responsable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{actionPlan.responsible}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Asignado desde {format(actionPlan.createdAt, "dd/MM/yyyy")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="activities">Actividades</TabsTrigger>
          <TabsTrigger value="assessments">Assessments Relacionados</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Hallazgo</h3>
                <p className="mt-1">{actionPlan.finding}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Acción Correctiva</h3>
                <p className="mt-1">{actionPlan.action}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Descripción Detallada</h3>
                <p className="mt-1">{actionPlan.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Creación</h3>
                  <p>{format(actionPlan.createdAt, "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Última Actualización</h3>
                  <p>{format(actionPlan.updatedAt, "dd/MM/yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividades</CardTitle>
              <CardDescription>Actividades planificadas para completar el plan de acción</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionPlan.activities.map((activity) => (
                <div key={activity.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{activity.description}</h3>
                      <p className="text-sm text-muted-foreground">Fecha: {format(activity.date, "dd/MM/yyyy")}</p>
                    </div>
                    <Badge variant={statusMap[activity.status].variant}>{statusMap[activity.status].label}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessments Relacionados</CardTitle>
              <CardDescription>Assessments que identificaron este hallazgo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionPlan.assessments.map((assessment) => (
                <div key={assessment.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{assessment.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {assessment.id}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/assessments/${assessment.id}`)}>
                      <FileText className="mr-2 h-4 w-4" /> Ver Assessment
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este plan de acción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El plan de acción será eliminado permanentemente de nuestros servidores.
              <div className="mt-4">
                <div className="font-medium text-sm">
                  Para confirmar, escriba el ID del plan de acción: {actionPlan.id}
                </div>
                <Input
                  className="mt-2"
                  value={confirmationId}
                  onChange={(e) => setConfirmationId(e.target.value)}
                  placeholder="Escriba el ID para confirmar"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
