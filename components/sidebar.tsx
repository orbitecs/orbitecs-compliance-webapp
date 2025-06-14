"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  FileCheck,
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
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const { hasPermission } = useRBAC()

  const visibleNavigation = navigation.filter((item) => hasPermission(item.permission))

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen flex-col glass-effect border-r transition-all duration-300",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className={cn("font-semibold text-lg tracking-tight text-gradient", !isOpen && "hidden")}>
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 nav-link",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  !isOpen && "justify-center px-3"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-border/50 p-2 glass-effect">
          <div className="grid gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-full flex items-center justify-center transition-all duration-200",
                    "hover:bg-accent/50 hover:text-accent-foreground",
                    "focus:bg-accent/50 focus:text-accent-foreground",
                    "active:bg-accent/70 active:text-accent-foreground",
                    "rounded-lg"
                  )}
                  onClick={() => toggleSidebar()}
                >
                  {isOpen ? (
                    <ChevronLeft className="h-5 w-5 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-5 w-5 transition-transform duration-200" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p>{isOpen ? "Colapsar menú" : "Expandir menú"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
