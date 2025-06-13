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
    // Notificaciones leídas
    {
      id: "6",
      title: "Mantenimiento programado",
      message: "La plataforma estará en mantenimiento el próximo domingo",
      section: "dashboard",
      priority: "medium",
      status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 días atrás
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // Leído hace 2 días
    },
    {
      id: "7",
      title: "Actualización de términos",
      message: "Los términos y condiciones han sido actualizados",
      section: "settings",
      priority: "low",
      status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 días atrás
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // Leído hace 4 días
    },
    // Notificaciones archivadas
    {
      id: "8",
      title: "Bienvenido a ComplianceHub",
      message: "Gracias por registrarte en nuestra plataforma",
      section: "dashboard",
      priority: "low",
      status: "archived",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 días atrás
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29), // Leído hace 29 días
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
    const unreadNotifications = notifs.filter((n) => n.status === "unread")

    const newCounts: NotificationCounts = {
      dashboard: 0,
      checklists: 0,
      assessments: 0,
      action_plans: 0,
      users: 0,
      settings: 0,
      total: unreadNotifications.length,
    }

    unreadNotifications.forEach((notification) => {
      newCounts[notification.section]++
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
      return prev.map((notification) => {
        // Si es un ID específico
        if (typeof idOrSection === "string" && notification.id === idOrSection && notification.status === "unread") {
          return { ...notification, status: "read", readAt: now }
        }

        // Si es una sección completa
        if (
          typeof idOrSection !== "string" &&
          notification.section === idOrSection &&
          notification.status === "unread"
        ) {
          return { ...notification, status: "read", readAt: now }
        }

        return notification
      })
    })

    // Actualizar contadores
    setNotifications((current) => {
      setCounts(calculateCounts(current))
      return current
    })
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    const now = new Date()

    setNotifications((prev) => {
      return prev.map((notification) => {
        if (notification.status === "unread") {
          return { ...notification, status: "read", readAt: now }
        }
        return notification
      })
    })

    setCounts({
      dashboard: 0,
      checklists: 0,
      assessments: 0,
      action_plans: 0,
      users: 0,
      settings: 0,
      total: 0,
    })
  }

  // Archivar una notificación
  const archiveNotification = (id: string) => {
    setNotifications((prev) => {
      return prev.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            status: "archived",
            readAt: notification.readAt || new Date(),
          }
        }
        return notification
      })
    })

    // Actualizar contadores
    setNotifications((current) => {
      setCounts(calculateCounts(current))
      return current
    })
  }

  // Eliminar una notificación
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))

    // Actualizar contadores
    setNotifications((current) => {
      setCounts(calculateCounts(current))
      return current
    })
  }

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications()

    // Simular actualizaciones periódicas (cada 30 segundos)
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
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
