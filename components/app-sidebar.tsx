"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckSquare, ClipboardList, FileCheck, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Checklists", href: "/checklists", icon: CheckSquare },
  { name: "Assessments", href: "/assessments", icon: ClipboardList },
  { name: "Planes de Acción", href: "/action-plans", icon: FileCheck },
  { name: "Usuarios", href: "/users", icon: Users },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
