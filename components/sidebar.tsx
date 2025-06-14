"use client"

import type React from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const { isOpen, isAutoCollapsed, canToggle, toggleSidebar, getScreenSizeLabel, isMobile } = useSidebar()

  // Forzar que todas las opciones sean visibles
  const showAllItems = true
  const visibleNavigation = navigation // Mostrar todos los elementos sin filtrar

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
          isOpen ? "" : "justify-center px-3",
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-gray-500 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300",
            "flex-shrink-0 h-5 w-5",
            isOpen ? "" : "mr-3",
          )}
          aria-hidden="true"
        />
        {isOpen && <span className="truncate">{item.name}</span>}
      </Link>
    )

    if (isOpen) {
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
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className={cn("font-semibold", !isOpen && "hidden")}>
            Orbitecs Compliance
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid gap-1 px-2 py-4">
            {visibleNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                  !isOpen && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 p-2 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="w-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => toggleSidebar()}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
