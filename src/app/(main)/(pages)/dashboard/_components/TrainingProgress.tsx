'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Loader2, BookOpen, Award, Star } from 'lucide-react';
import { getTrainings } from '../_actions/dashboardActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Training {
  id: number;
  title: string;
  progress: number;
  target: number;
  category: string;
}

export default function TrainingProgress() {
  const { theme } = useTheme();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainings() {
      try {
        const data = await getTrainings();
        const formattedData = Array.isArray(data) ? data.map(training => ({
          id: training.id,
          title: training.title,
          progress: training.progress,
          target: training.target,
          category: training.phase // Assuming 'phase' is used as 'category'
        })) : [];
        setTrainings(formattedData);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrainings();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'leadership':
        return <Award className="h-4 w-4 text-blue-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card
      className={cn(
        'shadow-lg overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-gray-50 to-white text-gray-800'
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-green-500" />
          Trainingsfortschritt
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : trainings.length === 0 ? (
          <p className="text-center py-4">Keine Trainingsdaten verfügbar.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {trainings.map((training) => (
                <div key={training.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(training.category)}
                      <p className="font-medium">{training.title}</p>
                    </div>
                    <Badge variant={training.progress >= 100 ? "default" : "secondary"}>
                      {training.progress}%
                    </Badge>
                  </div>
                  <Progress value={training.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Ziel: {training.target} Einheiten</span>
                    <span>{training.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}