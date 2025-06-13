"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, Filter, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de ejemplo para la actividad del usuario
const activityData = [
  {
    id: "ACT-001",
    type: "login",
    description: "Inicio de sesión exitoso",
    date: "2023-06-10T08:30:00",
    ip: "192.168.1.1",
    device: "Chrome / Windows",
  },
  {
    id: "ACT-002",
    type: "assessment",
    description: "Creó un nuevo assessment: ISO 27001 - Q2 2023",
    date: "2023-06-10T09:15:00",
    details: "Assessment ID: A-123",
  },
  {
    id: "ACT-003",
    type: "checklist",
    description: "Modificó checklist: GDPR Compliance",
    date: "2023-06-09T14:20:00",
    details: "Checklist ID: C-456",
  },
  {
    id: "ACT-004",
    type: "action_plan",
    description: "Completó tarea en plan de acción: Actualizar política de seguridad",
    date: "2023-06-08T11:45:00",
    details: "Plan ID: P-789",
  },
  {
    id: "ACT-005",
    type: "user",
    description: "Actualizó información de perfil",
    date: "2023-06-07T16:30:00",
  },
  {
    id: "ACT-006",
    type: "login",
    description: "Inicio de sesión exitoso",
    date: "2023-06-07T08:25:00",
    ip: "192.168.1.1",
    device: "Chrome / Windows",
  },
  {
    id: "ACT-007",
    type: "assessment",
    description: "Exportó resultados de assessment: PCI DSS - Q1 2023",
    date: "2023-06-06T15:10:00",
    details: "Assessment ID: A-124",
  },
  {
    id: "ACT-008",
    type: "security",
    description: "Cambió contraseña",
    date: "2023-06-05T10:05:00",
  },
]

// Función para formatear fechas
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Función para formatear horas
function formatTime(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Componente para mostrar un elemento de actividad
function ActivityItem({ activity }: { activity: (typeof activityData)[0] }) {
  // Determinar el color del badge según el tipo de actividad
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "assessment":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "checklist":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "action_plan":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-0">
      <div className="flex-shrink-0 pt-1">
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getBadgeClass(activity.type)}`}>
          {activity.type === "login" && "Sesión"}
          {activity.type === "assessment" && "Assessment"}
          {activity.type === "checklist" && "Checklist"}
          {activity.type === "action_plan" && "Plan de Acción"}
          {activity.type === "user" && "Perfil"}
          {activity.type === "security" && "Seguridad"}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{activity.description}</p>
        {activity.details && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>}
        {(activity.ip || activity.device) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {activity.ip && `IP: ${activity.ip}`}
            {activity.ip && activity.device && " | "}
            {activity.device && `Dispositivo: ${activity.device}`}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(activity.date)}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatTime(activity.date)}</span>
        </div>
      </div>
    </div>
  )
}

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activityType, setActivityType] = useState("all")

  // Filtrar actividades según búsqueda y tipo
  const filteredActivities = activityData.filter((activity) => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = activityType === "all" || activity.type === activityType
    return matchesSearch && matchesType
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al perfil
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Actividad Reciente</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Actividad</CardTitle>
          <CardDescription>Revisa tu actividad reciente en la plataforma ComplianceHub.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar actividad..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-[180px]">
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="login">Sesión</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                    <SelectItem value="action_plan">Plan de Acción</SelectItem>
                    <SelectItem value="user">Perfil</SelectItem>
                    <SelectItem value="security">Seguridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all">Todo</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="content">Contenido</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="border rounded-md">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron actividades que coincidan con tu búsqueda.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="security" className="border rounded-md">
                {filteredActivities
                  .filter((activity) => ["login", "security"].includes(activity.type))
                  .map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
              </TabsContent>

              <TabsContent value="content" className="border rounded-md">
                {filteredActivities
                  .filter((activity) => ["assessment", "checklist", "action_plan"].includes(activity.type))
                  .map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
