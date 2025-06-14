"use client"

import { useSidebar } from "@/components/sidebar-context"
import { cn } from "@/lib/utils"

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen } = useSidebar()

  return (
    <main
      className={cn(
        "min-h-screen pt-16 transition-all duration-300 w-full",
        isOpen ? "md:pl-64" : "md:pl-20"
      )}
    >
      <div className="w-full p-4">
        {children}
      </div>
    </main>
  )
}
