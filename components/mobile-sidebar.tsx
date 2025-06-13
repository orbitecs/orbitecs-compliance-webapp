"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckSquare, ClipboardList, FileCheck, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRBAC } from "@/components/rbac-provider"
import type { Permission } from "@/lib/rbac"

// Define la navegación con los permisos correctos
const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    permission: "dashboard.view" as Permission,
  },
  {
    name: "Checklists",
    href: "/checklists",
    icon: CheckSquare,
    permission: "checklists.view" as Permission,
  },
  {
    name: "Assessments",
    href: "/assessments",
    icon: ClipboardList,
    permission: "assessments.view" as Permission,
  },
  {
    name: "Planes de Acción",
    href: "/action-plans",
    icon: FileCheck,
    permission: "action_plans.view" as Permission,
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    permission: "users.view" as Permission,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    permission: "settings.view" as Permission,
  },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { hasPermission } = useRBAC()

  // Para asegurar que todas las opciones aparezcan durante el desarrollo
  // Esto es temporal y debe eliminarse en producción
  const showAllItems = true // En producción, cambiar a false

  // Filtra los elementos de navegación según los permisos del usuario
  // o muestra todos si showAllItems es true
  const visibleNavigation = showAllItems ? navigation : navigation.filter((item) => hasPermission(item.permission))

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold tracking-tight">ComplianceHub</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                )}
              >
                <item.icon
                  className={cn(
                    isActive
                      ? "text-gray-500 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                    "mr-3 flex-shrink-0 h-5 w-5",
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
