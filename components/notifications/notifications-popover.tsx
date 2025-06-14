"use client"

import React from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para las notificaciones
const notifications = [
  {
    id: "1",
    title: "Nuevo Assessment Creado",
    description: "Se ha creado un nuevo assessment de ISO 27001",
    date: new Date(),
    read: false,
    type: "assessment",
  },
  {
    id: "2",
    title: "Plan de Acción Pendiente",
    description: "Tienes un plan de acción que requiere tu atención",
    date: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    read: false,
    type: "action_plan",
  },
  {
    id: "3",
    title: "Checklist Actualizado",
    description: "Se ha actualizado el checklist de PCI DSS",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    read: true,
    type: "checklist",
  },
]

export function NotificationsPopover({ children }: { children: React.ReactNode }) {
  const [notificationsList, setNotificationsList] = React.useState(notifications)
  const unreadCount = notificationsList.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotificationsList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  const clearAll = () => {
    setNotificationsList([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notificaciones</h4>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todo como leído
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Limpiar todo
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {notificationsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div className="grid gap-1 p-2">
              {notificationsList.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-3 rounded-lg transition-colors",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.date, "PPp", { locale: es })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 