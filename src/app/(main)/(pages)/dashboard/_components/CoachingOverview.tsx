"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Lightbulb, ListChecks, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoachingOverview() {
  const { theme } = useTheme();

  const coachingItems = [
    {
      id: 1,
      type: 'Empfehlung',
      title: 'Verbessere deine Einwandbehandlung',
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      actionText: 'Mehr erfahren',
    },
    {
      id: 2,
      type: 'Aktionsplan',
      title: 'Schritt-für-Schritt zur besseren Gesprächsführung',
      icon: <ListChecks className="w-5 h-5 text-green-500" />,
      actionText: 'Aktionsplan ansehen',
    },
    {
      id: 3,
      type: 'Feedback & Reflexion',
      title: 'Selbsteinschätzung nach dem letzten Gespräch',
      icon: <Repeat className="w-5 h-5 text-blue-500" />,
      actionText: 'Reflexion starten',
    },
  ];

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Coaching Übersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {coachingItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {item.icon}
              <p className="font-medium">{item.title}</p>
            </div>
            <Button variant="link" className="text-sm" onClick={() => {/* Navigation zur entsprechenden Seite */}}>
              {item.actionText}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
