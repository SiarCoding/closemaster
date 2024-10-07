'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CoachingItem {
  id: number;
  type: string;
  title: string;
  icon: JSX.Element;
  actionText: string;
  actionLink: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function CoachingOverview() {
  const { theme } = useTheme();

  const coachingItems: CoachingItem[] = [
    {
      id: 1,
      type: 'Empfehlung',
      title: 'Verbessere deine Einwandbehandlung',
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      actionText: 'Mehr erfahren',
      actionLink: '/training/einwandbehandlung',
      difficulty: 'Intermediate',
    },
    {
      id: 2,
      type: 'Kurs',
      title: 'Grundlagen des B2B-Verkaufs',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      actionText: 'Kurs starten',
      actionLink: '/courses/b2b-basics',
      difficulty: 'Beginner',
    },
    {
      id: 3,
      type: 'Ziel',
      title: 'Steigere deine Abschlussrate um 10%',
      icon: <Target className="w-5 h-5 text-green-500" />,
      actionText: 'Ziel anzeigen',
      actionLink: '/goals/closing-rate',
      difficulty: 'Advanced',
    },
    {
      id: 4,
      type: 'Trend',
      title: 'Neue Techniken im Vertrieb 2024',
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      actionText: 'Entdecken',
      actionLink: '/trends/sales-2024',
      difficulty: 'Intermediate',
    },
  ];

  const getDifficultyColor = (difficulty: CoachingItem['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    }
  };

  return (
    <Card className={cn(
      "shadow-lg",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Coaching Übersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {coachingItems.length === 0 ? (
          <p className="text-center">Keine Coaching-Empfehlungen verfügbar.</p>
        ) : (
          coachingItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  {item.icon}
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {item.type}
                  </Badge>
                  <h3 className="font-medium">{item.title}</h3>
                  <Badge className={cn("mt-1", getDifficultyColor(item.difficulty))}>
                    {item.difficulty}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" className="text-sm" onClick={() => { window.location.href = item.actionLink }}>
                {item.actionText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}