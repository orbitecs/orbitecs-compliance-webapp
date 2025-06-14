import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RBACProvider } from "@/components/rbac-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/components/notifications/notifications-context"
import { SidebarProvider } from "@/components/sidebar-context"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Orbitecs Compliance",
  description: "Sistema de Gestión de Cumplimiento",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
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
                  <div className="flex flex-1">
                    <Sidebar />
                    <LayoutWrapper>{children}</LayoutWrapper>
                  </div>
                </div>
              </SidebarProvider>
            </NotificationsProvider>
          </RBACProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
