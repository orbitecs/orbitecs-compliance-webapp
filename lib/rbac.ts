import React from "react"
// Definición de roles y permisos
export type Role = "admin" | "gestor" | "auditor" | "lector"

export type Permission =
  // Permisos de dashboard
  | "dashboard.view"
  // Permisos de usuarios
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "users.manage_roles"
  // Permisos de checklists
  | "checklists.view"
  | "checklists.create"
  | "checklists.edit"
  | "checklists.delete"
  // Permisos de assessments
  | "assessments.view"
  | "assessments.create"
  | "assessments.edit"
  | "assessments.delete"
  // Permisos de planes de acción
  | "action_plans.view"
  | "action_plans.create"
  | "action_plans.edit"
  | "action_plans.delete"
  // Permisos de configuración
  | "settings.view"
  | "settings.edit"

// Mapeo de roles a permisos
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "users.manage_roles",
    "checklists.view",
    "checklists.create",
    "checklists.edit",
    "checklists.delete",
    "assessments.view",
    "assessments.create",
    "assessments.edit",
    "assessments.delete",
    "action_plans.view",
    "action_plans.create",
    "action_plans.edit",
    "action_plans.delete",
    "settings.view",
    "settings.edit",
  ],
  gestor: [
    "dashboard.view",
    "users.view",
    "checklists.view",
    "checklists.create",
    "checklists.edit",
    "assessments.view",
    "assessments.create",
    "assessments.edit",
    "action_plans.view",
    "action_plans.create",
    "action_plans.edit",
    "settings.view",
  ],
  auditor: [
    "dashboard.view",
    "users.view",
    "checklists.view",
    "assessments.view",
    "assessments.create",
    "assessments.edit",
    "action_plans.view",
    "action_plans.create",
    "action_plans.edit",
  ],
  lector: ["dashboard.view", "users.view", "checklists.view", "assessments.view", "action_plans.view"],
}

// Hook para verificar permisos (simulado)
export function usePermissions() {
  // En una implementación real, esto vendría de un contexto de autenticación
  const userRole: Role = "admin" // Simulamos un usuario admin

  const hasPermission = (permission: Permission): boolean => {
    return rolePermissions[userRole].includes(permission)
  }

  return {
    role: userRole,
    hasPermission,
    hasAnyPermission: (permissions: Permission[]): boolean => {
      return permissions.some((permission) => hasPermission(permission))
    },
    hasAllPermissions: (permissions: Permission[]): boolean => {
      return permissions.every((permission) => hasPermission(permission))
    },
  }
}

// Componente de protección para elementos basados en permisos
export function PermissionGuard({
  permissions,
  children,
}: {
  permissions: Permission | Permission[]
  children: React.ReactNode
}) {
  const { hasPermission, hasAnyPermission } = usePermissions()

  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions]

  if (hasAnyPermission(permissionsArray)) {
    return <>{children}</>
  }

  return null
}
