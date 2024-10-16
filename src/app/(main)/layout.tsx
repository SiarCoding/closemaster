import React from 'react'
import { Sidebar } from '@/components/sidebar/index'
import { Infobar } from '@/components/infobar/index'
import { ThemeProvider } from "@/providers/theme-provider"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Infobar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}