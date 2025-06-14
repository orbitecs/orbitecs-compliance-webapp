"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Filter,
  Search,
  Trash2,
  X,
  Archive,
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  useNotifications,
  type Notification,
  type NotificationSection,
  type NotificationPriority,
  type NotificationStatus,
} from "@/components/notifications/notifications-context"

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead, archiveNotification, deleteNotification } = useNotifications()

  // Estado para filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSection, setSelectedSection] = useState<NotificationSection | "all">("all")
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | "all">("all")
  const [selectedTab, setSelectedTab] = useState<"all" | "unread" | "read" | "archived">("all")

  // Filtrar notificaciones según los criterios seleccionados
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Filtro por pestaña
      if (selectedTab !== "all" && notification.status !== selectedTab) {
        return false
      }

      // Filtro por búsqueda
      if (
        searchQuery &&
        !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filtro por sección
      if (selectedSection !== "all" && notification.section !== selectedSection) {
        return false
      }

      // Filtro por prioridad
      if (selectedPriority !== "all" && notification.priority !== selectedPriority) {
        return false
      }

      return true
    })
  }, [notifications, searchQuery, selectedSection, selectedPriority, selectedTab])

  // Ordenar notificaciones por fecha (más recientes primero)
  const sortedNotifications = useMemo(() => {
    return [...filteredNotifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [filteredNotifications])

  // Agrupar notificaciones por fecha
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    sortedNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.createdAt)
      let groupKey: string

      if (notificationDate.toDateString() === today.toDateString()) {
        groupKey = "Hoy"
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groupKey = "Ayer"
      } else if (today.getTime() - notificationDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        groupKey = "Esta semana"
      } else if (today.getTime() - notificationDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
        groupKey = "Este mes"
      } else {
        groupKey = "Anteriores"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(notification)
    })

    return groups
  }, [sortedNotifications])

  // Manejar clic en una notificación
  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === "unread") {
      markAsRead(notification.id)
    }
    notification.link && router.push(notification.link)
  }

  // Manejar marcar como leída
  const handleMarkAsRead = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(notification.id)
    toast({
      title: "Éxito",
      description: "La notificación ha sido marcada como leída correctamente.",
    })
  }

  // Manejar archivar
  const handleArchive = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    archiveNotification(notification.id)
    toast({
      title: "Éxito",
      description: "La notificación ha sido archivada correctamente.",
    })
  }

  // Manejar eliminar
  const handleDelete = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification(notification.id)
    toast({
      title: "Éxito",
      description: "La notificación ha sido eliminada correctamente.",
    })
  }

  // Manejar marcar todas como leídas
  const handleMarkAllAsRead = () => {
    markAllAsRead()
    toast({
      title: "Éxito",
      description: "Todas las notificaciones han sido marcadas como leídas correctamente.",
    })
  }

  // Renderizar icono de prioridad
  const renderPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case "low":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "critical":
        return <AlertOctagon className="h-4 w-4 text-red-500" />
    }
  }

  // Renderizar badge de sección
  const renderSectionBadge = (section: NotificationSection) => {
    const sectionConfig = {
      dashboard: { label: "Dashboard", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      checklists: { label: "Checklists", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      assessments: {
        label: "Assessments",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
      action_plans: {
        label: "Planes de Acción",
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      },
      users: { label: "Usuarios", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
      settings: { label: "Configuración", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
    }

    const config = sectionConfig[section]
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  // Renderizar badge de prioridad
  const renderPriorityBadge = (priority: NotificationPriority) => {
    const priorityConfig = {
      low: { label: "Baja", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      medium: { label: "Media", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      high: { label: "Alta", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
      critical: { label: "Crítica", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    }

    const config = priorityConfig[priority]
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  // Renderizar fecha relativa
  const renderRelativeDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) {
      return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    } else if (hours < 24) {
      return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`
    } else if (days < 7) {
      return `Hace ${days} ${days === 1 ? "día" : "días"}`
    } else {
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <Button onClick={handleMarkAllAsRead} variant="outline">
          <CheckCheck className="mr-2 h-4 w-4" />
          Marcar todas como leídas
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Buscar notificaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                Sección: {selectedSection === "all" ? "Todas" : selectedSection}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedSection("all")}>Todas</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedSection("dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSection("checklists")}>Checklists</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSection("assessments")}>Assessments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSection("action_plans")}>Planes de Acción</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSection("users")}>Usuarios</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSection("settings")}>Configuración</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                Prioridad: {selectedPriority === "all" ? "Todas" : selectedPriority}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPriority("all")}>Todas</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedPriority("low")}>Baja</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority("medium")}>Media</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority("high")}>Alta</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority("critical")}>Crítica</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread">No leídas</TabsTrigger>
          <TabsTrigger value="read">Leídas</TabsTrigger>
          <TabsTrigger value="archived">Archivadas</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {Object.entries(groupedNotifications).map(([group, notifications]) => (
            <div key={group} className="mb-6">
              <h2 className="mb-4 text-lg font-semibold">{group}</h2>
              <div className="grid gap-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      notification.status === "unread" ? "border-l-4 border-l-primary" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <CardDescription>{notification.message}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderPriorityIcon(notification.priority)}
                          {notification.status === "unread" && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">
                              No leída
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {renderSectionBadge(notification.section)}
                        {renderPriorityBadge(notification.priority)}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {renderRelativeDate(notification.createdAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-end space-x-2 pt-2">
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMarkAsRead(notification, e)}
                          className="h-8"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Marcar como leída
                        </Button>
                      )}
                      {notification.status !== "archived" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleArchive(notification, e)}
                          className="h-8"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archivar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(notification, e)}
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
