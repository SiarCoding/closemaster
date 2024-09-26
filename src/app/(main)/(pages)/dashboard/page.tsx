"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import TasksAppointments from '@/app/(main)/(pages)/dashboard/_components/TasksAppointments';
import ProgressIndicators from '@/app/(main)/(pages)/dashboard/_components/ProgressIndicators';
import Recommendations from '@/app/(main)/(pages)/dashboard/_components/Recommendations';
import DashboardCards from '@/app/(main)/(pages)/dashboard/_components/DashboardCards';
import TrainingProgress from '@/app/(main)/(pages)/dashboard/_components/TrainingProgress';
import CoachingOverview from '@/app/(main)/(pages)/dashboard/_components/CoachingOverview';
import UpgradePlan from '@/components/global/UpgradePlan';

export default function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');

  const motivationalMessages = [
    "Heute ist ein großartiger Tag für neue Erfolge!",
    "Bleib dran, du bist auf dem richtigen Weg!",
    "Jeder Schritt zählt. Mach weiter so!",
    "Deine Ziele sind in greifbarer Nähe!",
  ];

  useEffect(() => {
    setMounted(true);
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "flex-1 overflow-y-auto",
      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto p-6 space-y-6",
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      )}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Willkommen zurück, Max!</h1>
          <p className="text-lg">{message}</p>
        </div>
        <DashboardCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-auto"> {/* Geändert von h-[400px] overflow-auto zu h-auto */}
              <ProgressIndicators />
            </div>
            <div className="h-[400px] overflow-auto">
              <CoachingOverview />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-[400px] overflow-auto">
              <TasksAppointments />
            </div>
            <div className="h-[400px] overflow-auto">
              <Recommendations />
            </div>
          </div>
        </div>
        <div className="h-[300px] overflow-auto">
          <TrainingProgress />
        </div>
        <UpgradePlan />
      </div>
    </div>
  );
}