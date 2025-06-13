"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  FileCheck,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Monitor,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useRBAC } from "@/components/rbac-provider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/components/sidebar-context"
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

export function Sidebar() {
  const pathname = usePathname()
  const { hasPermission } = useRBAC()
  const { isCollapsed, isAutoCollapsed, canToggle, toggleSidebar, getScreenSizeLabel, isMobile } = useSidebar()

  // Para asegurar que todas las opciones aparezcan durante el desarrollo
  const showAllItems = true
  const visibleNavigation = showAllItems ? navigation : navigation.filter((item) => hasPermission(item.permission))

  const NavigationItem = ({ item }: { item: (typeof navigation)[0] }) => {
    const isActive = pathname === item.href

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          isActive
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
          isCollapsed ? "justify-center px-3" : "",
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-gray-500 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300",
            "flex-shrink-0 h-5 w-5",
            isCollapsed ? "" : "mr-3",
          )}
          aria-hidden="true"
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return linkContent
  }

  // No mostrar sidebar en móvil
  if (isMobile) {
    return null
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:pt-16 z-10 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Navegación Principal */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {visibleNavigation.map((item) => (
                <NavigationItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* Controles al Final */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-2">
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <Monitor className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">{getScreenSizeLabel()}</span>
                  {isAutoCollapsed && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Auto
                    </Badge>
                  )}
                </div>
              )}

              {canToggle ? (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 flex-shrink-0">
                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  <span className="sr-only">{isCollapsed ? "Expandir menú" : "Colapsar menú"}</span>
                </Button>
              ) : (
                isCollapsed && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-8 w-8 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      <p>Auto-colapsado en {getScreenSizeLabel()}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
