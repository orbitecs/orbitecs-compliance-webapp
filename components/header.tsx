"use client"

import { useState } from "react"
import { Bell, Menu, Bot, Search } from "lucide-react"
import { useSidebar } from "@/components/sidebar-context"
import { Button } from "@/components/ui/button"
import { NotificationsPopover } from "@/components/notifications/notifications-popover"
import { AIAssistant } from "@/components/ai-assistant"
import { UserNav } from "@/components/user-nav"
import { Input } from "@/components/ui/input"

export function Header() {
  const { toggleSidebar } = useSidebar()
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b">
      <div className="flex h-14 items-center px-6 w-full">
        {/* Logo */}
        <div className="flex items-center min-w-[220px]">
          <a className="flex items-center space-x-2 hover-lift" href="/">
            <span className="font-bold text-lg tracking-tight text-gradient">Orbitecs Compliance</span>
          </a>
        </div>

        {/* Buscador centrado */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-lg bg-background/50 pl-8 input-focus glass-effect"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Iconos de la derecha */}
        <div className="flex items-center gap-3 min-w-[100px] justify-end">
          <NotificationsPopover>
            <Button variant="ghost" size="icon" className="relative button-hover">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground shadow-sm">
                3
              </span>
            </Button>
          </NotificationsPopover>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAIOpen(true)}
            className="relative button-hover"
          >
            <Bot className="h-5 w-5" />
          </Button>
          <UserNav />
        </div>
      </div>
      <AIAssistant open={isAIOpen} onOpenChange={setIsAIOpen} />
    </header>
  )
}
