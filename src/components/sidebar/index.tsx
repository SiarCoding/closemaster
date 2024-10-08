"use client";

import { Home, Users, TrendingUp, Sliders, Settings, MessageCircle, Sun, Moon, BookOpen, Folder } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from 'react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Trainingsbereich', href: '/trainingsbereich' },
  { icon: TrendingUp, label: 'Performance', href: '/performance' },
  { icon: Sliders, label: 'Coaching', href: '/coaching' },
  { icon: Users, label: 'Kunden', href: '/kunden' },
  { icon: Folder, label: 'Ressourcen', href: '/ressourcen' },
  { icon: MessageCircle, label: 'Community', href: '/community' },
  { icon: Settings, label: 'Einstellungen', href: '/einstellungen' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside className="w-64 p-6 flex flex-col justify-between h-screen bg-blue-600 dark:bg-gray-800 text-white">
      <div>
        <div className="mb-8">
          <div className="w-full h-12 rounded-lg flex items-center justify-center font-bold bg-white dark:bg-gray-700 text-blue-600 dark:text-white">
            CLOSEMASTER
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center w-full p-2 text-left space-x-3 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-blue-500 dark:bg-gray-700 text-white"
                  : "hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {theme === "dark" ? "Dark" : "Light"} Mode
          </span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Switch>
        </div>
      </div>
    </aside>
  );
}
