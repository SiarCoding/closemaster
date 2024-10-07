"use client";

import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Mail, ChevronDown, LogOut, User, Settings } from 'lucide-react';
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
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getKpiData } from '@/app/(main)/(pages)/dashboard/_actions/dashboardActions';

interface UserData {
  salesTarget: number;
  newCustomers: number;
  levelProgress: number;
  credits: number;
  level: string;
}

export function Infobar() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getKpiData();
        setUserData(data);
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const companyName = typeof user?.publicMetadata.companyName === 'string' 
    ? user.publicMetadata.companyName 
    : "Company Name Not Set";

  return (
    <header className={cn(
      "border-b p-4",
      theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className={cn(
            "text-2xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-800"
          )}>
            {companyName}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
                  <Calendar className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
                  <Mail className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "px-2 py-1 rounded-md text-sm font-medium",
                  theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                )}>
                  Credits: {userData?.credits || 0}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Available Credits</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 pl-2 pr-6 rounded-full">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-white" : "text-gray-700"
                  )}>{user?.fullName || 'User'}</span>
                  <span className={cn(
                    "text-xs",
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  )}>{userData?.level || 'Level not set'}</span>
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
                  <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                  <p className={cn(
                    "text-xs leading-none",
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  )}>
                    {user?.primaryEmailAddress?.emailAddress || 'Email not set'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit User Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}