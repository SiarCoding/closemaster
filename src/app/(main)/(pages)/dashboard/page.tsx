'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import DashboardCards from './_components/DashboardCards';
import ProgressIndicators from './_components/ProgressIndicators';
import TasksAppointments from './_components/TasksAppointments';
import Recommendations from './_components/Recommendations';
import TrainingProgress from './_components/TrainingProgress';
import CoachingOverview from './_components/CoachingOverview';
import Leaderboard from './_components/LeaderBoard';
import GamificationChallenges from './_components/GamificationChallanges';
import RealTimeFeedback from './_components/RealTimeFeedback';
import UpgradePlan from '@/components/global/UpgradePlan';

export default function Dashboard() {
  const { theme } = useTheme();
  const { user } = useUser();
  const userName = user?.firstName || 'Benutzer';

  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');

  const motivationalMessages = [
    'Heute ist ein großartiger Tag für neue Erfolge!',
    'Bleib dran, du bist auf dem richtigen Weg!',
    'Jeder Schritt zählt. Mach weiter so!',
    'Deine Ziele sind in greifbarer Nähe!',
    'Nutze die neuesten Strategien für maximalen Erfolg!',
    'Deine harte Arbeit zahlt sich aus – weiter so!',
  ];

  useEffect(() => {
    setMounted(true);
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto',
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto p-6 space-y-6',
          theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
        )}
      >
        {/* Begrüßungsnachricht mit abgerundeter Ecke */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Willkommen zurück, {userName}!</h1>
          <p className="text-xl text-white">{message}</p>
        </div>

        {/* Dashboard-Karten mit KPIs */}
        <DashboardCards />

        {/* Hauptinhalt */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linke Spalte */}
          <div className="space-y-6">
            <ProgressIndicators />
            <TasksAppointments />
          </div>

          {/* Mittlere Spalte */}
          <div className="space-y-6">
            <TrainingProgress />
            <CoachingOverview />
            <Recommendations />
          </div>

          {/* Rechte Spalte */}
          <div className="space-y-6">
            <GamificationChallenges />
            <Leaderboard />
          </div>
        </div>

        {/* Echtzeit-Feedback */}
        <div className="mt-6">
          <RealTimeFeedback />
        </div>

        {/* Upgrade-Plan */}
        <div className="mt-6">
          <UpgradePlan />
        </div>
      </div>
    </div>
  );
}