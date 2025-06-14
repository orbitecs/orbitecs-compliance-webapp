"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, FileText, CalendarIcon, CheckCircle2, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Status = "pendiente" | "en-curso" | "finalizado" | "completado"

interface Activity {
  id: string
  title: string
  description: string
  date: Date
  status: Status
  assignedTo: string
}

interface Assessment {
  id: string
  name: string
}

interface ActionPlan {
  id: string
  title: string
  description: string
  status: Status
  dueDate: Date
  updatedAt: Date
  createdAt: Date
  progress: number
  responsible: string
  finding: string
  action: string
  activities: Activity[]
  assessments: Assessment[]
}

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "outline" as const },
  "en-curso": { label: "En Curso", variant: "default" as const },
  finalizado: { label: "Finalizado", variant: "secondary" as const },
  completado: { label: "Completado", variant: "secondary" as const },
} as const;

// Datos de ejemplo para un plan de acción específico
const actionPlanData: ActionPlan = {
  id: "AP-001",
  title: "Implementación de controles de seguridad",
  description: "Plan para implementar y verificar los controles de seguridad en la infraestructura",
  status: "en-curso",
  dueDate: new Date("2024-06-30"),
  updatedAt: new Date("2024-03-15"),
  createdAt: new Date("2024-03-10"),
  progress: 50,
  responsible: "Juan Pérez",
  finding: "Falta de controles de seguridad en la infraestructura",
  action: "Implementar y verificar controles de seguridad",
  activities: [
    {
      id: "ACT-001",
      title: "Revisión de políticas de seguridad",
      description: "Actualizar y revisar las políticas de seguridad existentes",
      date: new Date("2024-03-20"),
      status: "pendiente",
      assignedTo: "Juan Pérez"
    },
    {
      id: "ACT-002",
      title: "Implementación de firewall",
      description: "Configurar y probar el nuevo firewall",
      date: new Date("2024-03-25"),
      status: "en-curso",
      assignedTo: "María García"
    }
  ],
  assessments: [
    {
      id: "AS-001",
      name: "Assessment de Seguridad 1"
    },
    {
      id: "AS-002",
      name: "Assessment de Seguridad 2"
    }
  ]
}

export default function ActionPlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // En una aplicación real, aquí cargaríamos los datos del plan de acción según el ID
  // Por ahora usamos los datos de ejemplo
  const actionPlan = actionPlanData

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // Aquí iría la llamada a la API para eliminar el plan de acción
      toast({
        title: "Éxito",
        description: "Plan de acción eliminado correctamente",
      })
      router.push("/action-plans")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el plan de acción",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
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
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
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
            <Badge variant={statusConfig[actionPlan.status].variant} className="text-base">
              {statusConfig[actionPlan.status].label}
            </Badge>
            <div className="mt-1 text-xs text-muted-foreground">
              Actualizado el {format(actionPlan.updatedAt, "dd/MM/yyyy")}
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
                    <Badge variant={statusConfig[activity.status].variant}>{statusConfig[activity.status].label}</Badge>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Plan de Acción</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este plan de acción? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
