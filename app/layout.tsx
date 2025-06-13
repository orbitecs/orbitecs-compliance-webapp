import type React from "react"
import type { Metadata } from "next/metadata"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RBACProvider } from "@/components/rbac-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import { NotificationsProvider } from "@/components/notifications/notifications-context"
import { SidebarProvider } from "@/components/sidebar-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ComplianceHub",
  description: "Plataforma de gestión de compliance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <RBACProvider initialRole="admin">
              <NotificationsProvider>
                <SidebarProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <div className="flex flex-1">
                      <Sidebar />
                      <LayoutWrapper>{children}</LayoutWrapper>
                    </div>
                  </div>
                </SidebarProvider>
              </NotificationsProvider>
            </RBACProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
