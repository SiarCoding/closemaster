"use client";

import { Bell, Calendar, Mail, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Infobar() {
  const { theme } = useTheme();

  return (
    <header className={cn(
      "border-b p-4",
      theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className={cn(
            "text-2xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-800"
          )}>
            @Deine Firma
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Upgrade to Pro
          </Button>
          <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
            <Mail className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 pl-2 pr-6 rounded-full">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src="/mann.jpg" alt="Max Mustermann" />
                  <AvatarFallback>MM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-white" : "text-gray-700"
                  )}>Max Mustermann</span>
                  <span className={cn(
                    "text-xs",
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  )}>Sales-Manager</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 ml-2",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn(
              "w-56",
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            )} align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Max Mustermann</p>
                  <p className={cn(
                    "text-xs leading-none",
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  )}>
                    max.mustermann@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}