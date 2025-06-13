"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Role, type Permission, rolePermissions } from "@/lib/rbac"

interface RBACContextType {
  userRole: Role
  setUserRole: (role: Role) => void
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const RBACContext = createContext<RBACContextType | undefined>(undefined)

export function RBACProvider({
  children,
  initialRole = "lector",
}: {
  children: React.ReactNode
  initialRole?: Role
}) {
  const [userRole, setUserRole] = useState<Role>(initialRole)

  // En una implementación real, aquí cargaríamos el rol del usuario desde una API o localStorage
  useEffect(() => {
    // Simulación de carga del rol desde localStorage o API
    const savedRole = localStorage.getItem("userRole") as Role | null
    if (savedRole && Object.keys(rolePermissions).includes(savedRole)) {
      setUserRole(savedRole)
    }
  }, [])

  // Guardar el rol cuando cambie
  useEffect(() => {
    localStorage.setItem("userRole", userRole)
  }, [userRole])

  const hasPermission = (permission: Permission): boolean => {
    return rolePermissions[userRole].includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  return (
    <RBACContext.Provider
      value={{
        userRole,
        setUserRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </RBACContext.Provider>
  )
}

export function useRBAC() {
  const context = useContext(RBACContext)
  if (context === undefined) {
    throw new Error("useRBAC must be used within a RBACProvider")
  }
  return context
}

// Componente de protección para elementos basados en permisos
export function PermissionGuard({
  permissions,
  children,
}: {
  permissions: Permission | Permission[]
  children: React.ReactNode
}) {
  const { hasPermission, hasAnyPermission } = useRBAC()

  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions]

  if (hasAnyPermission(permissionsArray)) {
    return <>{children}</>
  }

  return null
}
