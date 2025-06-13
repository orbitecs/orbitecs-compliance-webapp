"use client"

import { useState } from "react"
import { ArrowLeft, Globe, Laptop, LogOut, Smartphone, Trash } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/components/ui/use-toast"

// Datos de ejemplo para las sesiones
const sessionsData = [
  {
    id: "session-001",
    device: "Chrome en Windows 10",
    deviceType: "desktop",
    location: "Madrid, España",
    ip: "192.168.1.1",
    lastActive: "2023-06-10T10:30:00",
    isCurrent: true,
  },
  {
    id: "session-002",
    device: "Safari en iPhone",
    deviceType: "mobile",
    location: "Barcelona, España",
    ip: "192.168.2.2",
    lastActive: "2023-06-09T18:45:00",
    isCurrent: false,
  },
  {
    id: "session-003",
    device: "Firefox en macOS",
    deviceType: "desktop",
    location: "Valencia, España",
    ip: "192.168.3.3",
    lastActive: "2023-06-08T09:15:00",
    isCurrent: false,
  },
  {
    id: "session-004",
    device: "Chrome en Android",
    deviceType: "mobile",
    location: "Sevilla, España",
    ip: "192.168.4.4",
    lastActive: "2023-06-07T14:20:00",
    isCurrent: false,
  },
]

// Función para formatear fechas
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Función para calcular tiempo relativo
function getRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "hace unos segundos"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `hace ${days} ${days === 1 ? "día" : "días"}`
  }
}

// Componente para mostrar una sesión
function SessionItem({
  session,
  onTerminate,
}: {
  session: (typeof sessionsData)[0]
  onTerminate: (id: string) => void
}) {
  // Icono según el tipo de dispositivo
  const DeviceIcon = session.deviceType === "mobile" ? Smartphone : Laptop

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-0">
      <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
        <DeviceIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium">{session.device}</p>
          {session.isCurrent && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
              Actual
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Globe className="h-3 w-3 mr-1" />
          <span>
            {session.location} ({session.ip})
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activo: {getRelativeTime(session.lastActive)}</p>
      </div>
      <div className="flex-shrink-0">
        {!session.isCurrent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTerminate(session.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function SessionsPage() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState(sessionsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTerminateAllDialogOpen, setIsTerminateAllDialogOpen] = useState(false)
  const [sessionToTerminate, setSessionToTerminate] = useState<string | null>(null)

  // Manejar terminación de sesión individual
  const handleTerminate = (id: string) => {
    setSessionToTerminate(id)
    setIsDialogOpen(true)
  }

  // Confirmar terminación de sesión individual
  const confirmTerminate = () => {
    if (sessionToTerminate) {
      setSessions(sessions.filter((session) => session.id !== sessionToTerminate))
      toast({
        title: "Sesión terminada",
        description: "La sesión ha sido cerrada correctamente.",
      })
    }
    setIsDialogOpen(false)
    setSessionToTerminate(null)
  }

  // Confirmar terminación de todas las sesiones
  const confirmTerminateAll = () => {
    const currentSession = sessions.find((session) => session.isCurrent)
    setSessions(currentSession ? [currentSession] : [])
    toast({
      title: "Sesiones terminadas",
      description: "Todas las demás sesiones han sido cerradas correctamente.",
    })
    setIsTerminateAllDialogOpen(false)
  }

  // Filtrar sesiones actuales y otras
  const currentSession = sessions.find((session) => session.isCurrent)
  const otherSessions = sessions.filter((session) => !session.isCurrent)

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
        <h1 className="text-2xl font-bold tracking-tight">Sesiones Activas</h1>
        {otherSessions.length > 0 && (
          <Button variant="destructive" size="sm" onClick={() => setIsTerminateAllDialogOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Cerrar todas las sesiones
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dispositivos conectados</CardTitle>
          <CardDescription>
            Gestiona las sesiones activas en tu cuenta. Puedes cerrar sesión en dispositivos remotos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentSession && (
              <div>
                <h3 className="text-sm font-medium mb-2">Sesión actual</h3>
                <div className="border rounded-md">
                  <SessionItem session={currentSession} onTerminate={() => {}} />
                </div>
              </div>
            )}

            {otherSessions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Otras sesiones activas</h3>
                <div className="border rounded-md">
                  {otherSessions.map((session) => (
                    <SessionItem key={session.id} session={session} onTerminate={handleTerminate} />
                  ))}
                </div>
              </div>
            )}

            {otherSessions.length === 0 && (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                No hay otras sesiones activas en este momento.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para confirmar cierre de sesión individual */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar esta sesión? El dispositivo tendrá que iniciar sesión nuevamente para
              acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTerminate}>Cerrar sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para confirmar cierre de todas las sesiones */}
      <AlertDialog open={isTerminateAllDialogOpen} onOpenChange={setIsTerminateAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar todas las sesiones?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar todas las demás sesiones? Todos los dispositivos tendrán que iniciar
              sesión nuevamente para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTerminateAll}>Cerrar todas las sesiones</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
