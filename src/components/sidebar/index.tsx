"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Home, Users, TrendingUp, Sliders, Settings, MessageCircle, BookOpen, Folder, Sun, Moon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Trainingsbereich', href: '/trainingsbereich' },
  { icon: TrendingUp, label: 'Performance', href: '/performance' },
  { icon: Sliders, label: 'Coaching', href: '/coaching' },
  { icon: Users, label: 'Kunden', href: '/kunden' },
  { icon: Folder, label: 'Ressourcen', href: '/ressourcen' },
  { icon: MessageCircle, label: 'Community', href: '/community' },
  { icon: Settings, label: 'Einstellungen', href: '/einstellungen' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <aside className="w-16 h-screen bg-background border-r flex flex-col transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="w-full h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground">
          CM
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <TooltipProvider>
          {navItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-center",
                      pathname === item.href ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center">
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
}