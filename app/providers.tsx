"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RBACProvider } from "@/components/rbac-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/components/notifications/notifications-context"
import { SidebarProvider } from "@/components/sidebar-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useEffect, useState } from "react"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RBACProvider>
        <NotificationsProvider>
          <SidebarProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex flex-1 relative">
                <Sidebar />
                <LayoutWrapper>
                  <main className="flex-1 p-6">
                    {children}
                  </main>
                </LayoutWrapper>
              </div>
            </div>
          </SidebarProvider>
        </NotificationsProvider>
      </RBACProvider>
      <Toaster />
    </ThemeProvider>
  )
} 