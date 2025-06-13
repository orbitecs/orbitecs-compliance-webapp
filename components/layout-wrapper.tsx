"use client"

import type React from "react"
import { useSidebar } from "@/components/sidebar-context"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, isMobile } = useSidebar()

  return (
    <main
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-950",
        "min-h-[calc(100vh-4rem)]", // Altura mínima considerando el header
        "pt-4 px-4 md:px-6 lg:px-8",
        // Solo aplicar margen en desktop/tablet, no en móvil
        !isMobile && (isCollapsed ? "md:ml-16" : "md:ml-64"),
        // Asegurar que el contenido tenga espacio suficiente
        "pb-8"
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  )
}
