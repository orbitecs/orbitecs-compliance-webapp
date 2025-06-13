"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Definir tipos para las notificaciones
export type NotificationSection = "dashboard" | "checklists" | "assessments" | "action_plans" | "users" | "settings"
export type NotificationPriority = "low" | "medium" | "high" | "critical"
export type NotificationStatus = "unread" | "read" | "archived"

export interface Notification {
  id: string
  title: string
  message: string
  section: NotificationSection
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: Date
  readAt?: Date
  link?: string
  actionText?: string
}

export interface NotificationCounts {
  dashboard: number
  checklists: number
  assessments: number
  action_plans: number
  users: number
  settings: number
  total: number
}

interface NotificationsContextType {
  notifications: Notification[]
  counts: NotificationCounts
  markAsRead: (notificationId: string | NotificationSection) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  deleteNotification: (id: string) => void
  fetchNotifications: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Datos de ejemplo para notificaciones
const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: "1",
      title: "Nuevo assessment creado",
      message: "Se ha creado un nuevo assessment para ISO 27001",
      section: "assessments",
      priority: "medium",
      status: "unread",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      link: "/assessments/123",
      actionText: "Ver assessment",
    },
    {
      id: "2",
      title: "Plan de acción vencido",
      message: "El plan de acción 'Actualizar política de seguridad' ha vencido",
      section: "action_plans",
      priority: "high",
      status: "unread",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      link: "/action-plans/456",
      actionText: "Ver plan",
    },
    {
      id: "3",
      title: "Nuevo usuario registrado",
      message: "El usuario Carlos Rodríguez se ha registrado en la plataforma",
      section: "users",
      priority: "low",
      status: "unread",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
      link: "/users",
      actionText: "Ver usuarios",
    },
    {
      id: "4",
      title: "Checklist actualizado",
      message: "El checklist 'GDPR Compliance' ha sido actualizado",
      section: "checklists",
      priority: "medium",
      status: "unread",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
      link: "/checklists/789",
      actionText: "Ver checklist",
    },
    {
      id: "5",
      title: "Alerta de seguridad",
      message: "Se ha detectado un intento de acceso no autorizado",
      section: "dashboard",
      priority: "critical",
      status: "unread",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 días atrás
      link: "/settings/security",
      actionText: "Ver detalles",
    },
  ]
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [counts, setCounts] = useState<NotificationCounts>({
    dashboard: 0,
    checklists: 0,
    assessments: 0,
    action_plans: 0,
    users: 0,
    settings: 0,
    total: 0,
  })

  // Calcular contadores basados en las notificaciones no leídas
  const calculateCounts = (notifs: Notification[]) => {
    const newCounts: NotificationCounts = {
      dashboard: 0,
      checklists: 0,
      assessments: 0,
      action_plans: 0,
      users: 0,
      settings: 0,
      total: 0,
    }

    notifs.forEach((notification) => {
      if (notification.status === "unread") {
        newCounts[notification.section]++
        newCounts.total++
      }
    })

    return newCounts
  }

  // Simular la obtención de notificaciones del servidor
  const fetchNotifications = async () => {
    // En una implementación real, esto sería una llamada a la API
    const mockNotifications = generateMockNotifications()
    setNotifications(mockNotifications)
    setCounts(calculateCounts(mockNotifications))
  }

  // Marcar notificaciones como leídas (por ID o por sección)
  const markAsRead = (idOrSection: string | NotificationSection) => {
    const now = new Date()

    setNotifications((prev) => {
      const updated = prev.map((notification) => {
        if (
          (typeof idOrSection === "string" && notification.id === idOrSection) ||
          (typeof idOrSection !== "string" && notification.section === idOrSection)
        ) {
          if (notification.status === "unread") {
            return { ...notification, status: "read", readAt: now }
          }
        }
        return notification
      })
      setCounts(calculateCounts(updated))
      return updated
    })
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    const now = new Date()

    setNotifications((prev) => {
      const updated = prev.map((notification) => {
        if (notification.status === "unread") {
          return { ...notification, status: "read", readAt: now }
        }
        return notification
      })
      setCounts(calculateCounts(updated))
      return updated
    })
  }

  // Archivar una notificación
  const archiveNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) => {
        if (notification.id === id) {
          return { ...notification, status: "archived" }
        }
        return notification
      })
      setCounts(calculateCounts(updated))
      return updated
    })
  }

  // Eliminar una notificación
  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.id !== id)
      setCounts(calculateCounts(updated))
      return updated
    })
  }

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        counts,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
