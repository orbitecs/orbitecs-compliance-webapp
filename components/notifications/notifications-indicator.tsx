"use client"

import { Bell } from "lucide-react"
import { useNotifications } from "./notifications-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function NotificationsIndicator() {
  const { counts, markAllAsRead } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {counts.total > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs p-0"
              aria-label={`${counts.total} notificaciones pendientes`}
            >
              {counts.total > 99 ? "99+" : counts.total}
            </Badge>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {counts.total > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllAsRead()} className="h-8 text-xs">
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {counts.total === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No tienes notificaciones pendientes</div>
        ) : (
          <>
            {counts.dashboard > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Dashboard</span>
                <Badge variant="outline">{counts.dashboard}</Badge>
              </DropdownMenuItem>
            )}
            {counts.checklists > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Checklists</span>
                <Badge variant="outline">{counts.checklists}</Badge>
              </DropdownMenuItem>
            )}
            {counts.assessments > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Assessments</span>
                <Badge variant="outline">{counts.assessments}</Badge>
              </DropdownMenuItem>
            )}
            {counts.action_plans > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Planes de Acción</span>
                <Badge variant="outline">{counts.action_plans}</Badge>
              </DropdownMenuItem>
            )}
            {counts.users > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Usuarios</span>
                <Badge variant="outline">{counts.users}</Badge>
              </DropdownMenuItem>
            )}
            {counts.settings > 0 && (
              <DropdownMenuItem>
                <span className="flex-1">Configuración</span>
                <Badge variant="outline">{counts.settings}</Badge>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
