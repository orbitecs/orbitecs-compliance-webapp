"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Bell,
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
import { useToast } from "@/components/ui/toast-provider"
import {
  useNotifications,
  type Notification,
  type NotificationSection,
  type NotificationPriority,
  type NotificationStatus,
} from "@/components/notifications/notifications-context"

export default function NotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { notifications, markAsRead, markAllAsRead, archiveNotification, deleteNotification } = useNotifications()

  // Estado para filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSection, setSelectedSection] = useState<NotificationSection | "all">("all")
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | "all">("all")
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

      // Filtro por estado
      if (selectedStatus !== "all" && notification.status !== selectedStatus) {
        return false
      }

      return true
    })
  }, [notifications, searchQuery, selectedSection, selectedPriority, selectedStatus, selectedTab])

  // Ordenar notificaciones por fecha (más recientes primero)
  const sortedNotifications = useMemo(() => {
    return [...filteredNotifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [filteredNotifications])

  // Agrupar notificaciones por fecha
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {}

    sortedNotifications.forEach((notification) => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

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

    if (notification.link) {
      router.push(notification.link)
    }
  }

  // Manejar marcar como leída
  const handleMarkAsRead = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(notification.id)
    toast({
      title: "Notificación marcada como leída",
      description: "La notificación ha sido marcada como leída correctamente.",
    })
  }

  // Manejar archivar
  const handleArchive = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    archiveNotification(notification.id)
    toast({
      title: "Notificación archivada",
      description: "La notificación ha sido archivada correctamente.",
    })
  }

  // Manejar eliminar
  const handleDelete = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification(notification.id)
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada correctamente.",
    })
  }

  // Manejar marcar todas como leídas
  const handleMarkAllAsRead = () => {
    markAllAsRead()
    toast({
      title: "Todas las notificaciones marcadas como leídas",
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
      settings: { label: "Configuración", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    }

    return (
      <Badge variant="outline" className={`${sectionConfig[section].color} border-0`}>
        {sectionConfig[section].label}
      </Badge>
    )
  }

  // Renderizar texto de prioridad
  const getPriorityText = (priority: NotificationPriority) => {
    switch (priority) {
      case "low":
        return "Baja"
      case "medium":
        return "Media"
      case "high":
        return "Alta"
      case "critical":
        return "Crítica"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">
            Gestiona todas tus notificaciones y mantente al día con las actualizaciones importantes.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Buscador */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar notificaciones..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtros
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Sección</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("all")}
                      className={selectedSection === "all" ? "bg-accent" : ""}
                    >
                      Todas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("dashboard")}
                      className={selectedSection === "dashboard" ? "bg-accent" : ""}
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("checklists")}
                      className={selectedSection === "checklists" ? "bg-accent" : ""}
                    >
                      Checklists
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("assessments")}
                      className={selectedSection === "assessments" ? "bg-accent" : ""}
                    >
                      Assessments
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("action_plans")}
                      className={selectedSection === "action_plans" ? "bg-accent" : ""}
                    >
                      Planes de Acción
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("users")}
                      className={selectedSection === "users" ? "bg-accent" : ""}
                    >
                      Usuarios
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedSection("settings")}
                      className={selectedSection === "settings" ? "bg-accent" : ""}
                    >
                      Configuración
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Prioridad</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("all")}
                      className={selectedPriority === "all" ? "bg-accent" : ""}
                    >
                      Todas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("low")}
                      className={selectedPriority === "low" ? "bg-accent" : ""}
                    >
                      <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
                      Baja
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("medium")}
                      className={selectedPriority === "medium" ? "bg-accent" : ""}
                    >
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                      Media
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("high")}
                      className={selectedPriority === "high" ? "bg-accent" : ""}
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                      Alta
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("critical")}
                      className={selectedPriority === "critical" ? "bg-accent" : ""}
                    >
                      <AlertOctagon className="h-4 w-4 text-red-500 mr-2" />
                      Crítica
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            </div>
          </div>

          {/* Filtros activos */}
          {(selectedSection !== "all" || selectedPriority !== "all" || searchQuery) && (
            <div className="flex flex-wrap gap-2">
              {selectedSection !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sección:{" "}
                  {selectedSection === "action_plans"
                    ? "Planes de Acción"
                    : selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSection("all")} />
                </Badge>
              )}

              {selectedPriority !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Prioridad: {getPriorityText(selectedPriority)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriority("all")} />
                </Badge>
              )}

              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: {searchQuery}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setSelectedSection("all")
                  setSelectedPriority("all")
                  setSearchQuery("")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Tabs */}
          <Tabs
            defaultValue="all"
            className="w-full"
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">No leídas</TabsTrigger>
              <TabsTrigger value="read">Leídas</TabsTrigger>
              <TabsTrigger value="archived">Archivadas</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {Object.keys(groupedNotifications).length > 0 ? (
                Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                  <div key={group} className="mb-8">
                    <h3 className="mb-4 text-lg font-semibold">{group}</h3>
                    <div className="space-y-4">
                      {groupNotifications.map((notification) => (
                        <Card
                          key={notification.id}
                          className={`cursor-pointer transition-colors ${
                            notification.status === "unread"
                              ? "border-l-4 border-l-blue-500 dark:border-l-blue-400"
                              : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {renderPriorityIcon(notification.priority)}
                                <CardTitle className="text-base">{notification.title}</CardTitle>
                              </div>
                              <div className="flex items-center gap-1">
                                {renderSectionBadge(notification.section)}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <ChevronDown className="h-4 w-4" />
                                      <span className="sr-only">Acciones</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {notification.status === "unread" && (
                                      <DropdownMenuItem onClick={(e) => handleMarkAsRead(notification, e)}>
                                        <Check className="mr-2 h-4 w-4" />
                                        <span>Marcar como leída</span>
                                      </DropdownMenuItem>
                                    )}
                                    {notification.status !== "archived" && (
                                      <DropdownMenuItem onClick={(e) => handleArchive(notification, e)}>
                                        <Archive className="mr-2 h-4 w-4" />
                                        <span>Archivar</span>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={(e) => handleDelete(notification, e)}
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Eliminar</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardDescription className="text-sm">{notification.message}</CardDescription>
                          </CardHeader>
                          <CardFooter className="pt-0 pb-3 flex justify-between items-center">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(notification.createdAt, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                            </div>
                            {notification.actionText && notification.link && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (notification.status === "unread") {
                                    markAsRead(notification.id)
                                  }
                                  router.push(notification.link!)
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay notificaciones</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    {selectedTab === "all"
                      ? "No tienes notificaciones en este momento."
                      : selectedTab === "unread"
                        ? "No tienes notificaciones sin leer."
                        : selectedTab === "read"
                          ? "No tienes notificaciones leídas."
                          : "No tienes notificaciones archivadas."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
