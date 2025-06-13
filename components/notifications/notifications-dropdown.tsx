"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bell, Check, ChevronRight, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNotifications } from "./notifications-context"
import { cn } from "@/lib/utils"

export function NotificationsDropdown() {
  const { counts, notifications, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  // Tomamos solo las 5 notificaciones más recientes
  const recentNotifications = notifications
    .filter((n) => n.status === "unread")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  const totalUnread = counts.total

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    // Mantenemos el dropdown abierto
  }

  const handleMarkAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    markAsRead(id)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "low":
        return <div className="w-2 h-2 rounded-full bg-blue-500" />
      case "medium":
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />
      case "high":
        return <div className="w-2 h-2 rounded-full bg-orange-500" />
      case "critical":
        return <div className="w-2 h-2 rounded-full bg-red-500" />
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500" />
    }
  }

  // Función segura para formatear fechas
  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: es,
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "fecha desconocida"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs p-0"
              aria-label={`${totalUnread} notificaciones pendientes`}
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 text-base">Notificaciones</DropdownMenuLabel>
          {totalUnread > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-8 text-xs">
                    <Check className="h-4 w-4 mr-1" />
                    Marcar todas como leídas
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Marcar todas como leídas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay notificaciones</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No tienes notificaciones pendientes en este momento.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentNotifications.map((notification) => (
                <li key={notification.id} className="relative">
                  <div
                    className={cn(
                      "block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      notification.status === "unread" && "border-l-4 border-blue-500",
                    )}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">{getPriorityIcon(notification.priority)}</div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                          <div className="ml-2 flex flex-shrink-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Marcar como leída</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-2 border-t">
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/notifications">
              Ver todas las notificaciones
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
