"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export default function Recommendations() {
  const { theme } = useTheme();

  // Beispielhafte Nutzerziele und Fortschritte
  const userGoals = {
    salesTarget: 70, // 70% des Umsatzziels erreicht
    newCustomers: 50, // 50% des Ziels für neue Kunden erreicht
    levelProgress: 80, // 80% Fortschritt zum nächsten Level
  };

  // Empfehlungen basierend auf dem Fortschritt
  const recommendationsList = [
    {
      condition: (goals: any) => goals.salesTarget < 50,
      message: 'Du bist bei weniger als 50% deines Umsatzziels. Konzentriere dich auf Upselling-Möglichkeiten.',
    },
    {
      condition: (goals: any) => goals.salesTarget >= 50 && goals.salesTarget < 80,
      message: 'Guter Fortschritt! Versuche, die letzten Kunden für diesen Monat zu gewinnen.',
    },
    {
      condition: (goals: any) => goals.salesTarget >= 80,
      message: 'Fast geschafft! Ein paar weitere Abschlüsse, und du erreichst dein Umsatzziel.',
    },
    {
      condition: (goals: any) => goals.newCustomers < 50,
      message: 'Setze den Fokus auf Neukundenakquise, um dein Ziel zu erreichen.',
    },
    {
      condition: (goals: any) => goals.levelProgress >= 100,
      message: 'Glückwunsch! Du hast ein neues Level erreicht. Sieh dir deine neuen Vorteile an.',
    },
  ];

  const [tip, setTip] = useState('');

  useEffect(() => {
    // Finde die erste Empfehlung, deren Bedingung erfüllt ist
    const recommendation = recommendationsList.find((rec) => rec.condition(userGoals));
    if (recommendation) {
      setTip(recommendation.message);
    } else {
      setTip('Weiter so! Du machst einen großartigen Job.');
    }
  }, [userGoals]);

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader className="flex items-center space-x-3">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <CardTitle className="text-xl font-bold">Empfehlungen & Tipps</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{tip}</p>
      </CardContent>
    </Card>
  );
}
