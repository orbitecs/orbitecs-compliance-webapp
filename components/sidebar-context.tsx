"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SidebarContextType {
  isCollapsed: boolean
  isAutoCollapsed: boolean
  canToggle: boolean
  toggleSidebar: () => void
  screenSize: string
  getScreenSizeLabel: () => string
  isMobile: boolean
  isTablet: boolean
  isLaptop: boolean
  isDesktop: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const isLaptop = useMediaQuery("(min-width: 1025px) and (max-width: 1440px)")
  const isDesktop = useMediaQuery("(min-width: 1441px)")

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(false)

  // Determinar el tamaño de pantalla actual
  const getScreenSize = () => {
    if (isMobile) return "sm"
    if (isTablet) return "md"
    if (isLaptop) return "lg"
    if (isDesktop) return "xl"
    return "2xl"
  }

  const screenSize = getScreenSize()

  // Auto-colapsar basado en el tamaño de pantalla
  useEffect(() => {
    if (isTablet) {
      setIsCollapsed(true)
      setIsAutoCollapsed(true)
    } else if (isLaptop || isDesktop) {
      if (isAutoCollapsed) {
        setIsCollapsed(false)
        setIsAutoCollapsed(false)
      }
    }
  }, [isTablet, isLaptop, isDesktop, isAutoCollapsed])

  // Determinar si se puede alternar manualmente
  const canToggle = !isMobile && (!isTablet || !isAutoCollapsed)

  const toggleSidebar = () => {
    if (canToggle) {
      setIsCollapsed(!isCollapsed)
      setIsAutoCollapsed(false)
    }
  }

  const getScreenSizeLabel = () => {
    switch (screenSize) {
      case "sm":
        return "Móvil"
      case "md":
        return "Tablet"
      case "lg":
        return "Laptop"
      case "xl":
        return "Desktop"
      case "2xl":
        return "Desktop XL"
      default:
        return "Desconocido"
    }
  }

  const value = {
    isCollapsed,
    isAutoCollapsed,
    canToggle,
    toggleSidebar,
    screenSize,
    getScreenSizeLabel,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
