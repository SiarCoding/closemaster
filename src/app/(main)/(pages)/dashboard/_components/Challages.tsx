'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChallengesData, updateChallengeStatus } from '../_actions/dashboardActions';

interface Challenge {
  id: number;
  title: string;
  description: string;
  status: string; // "Pending" or "Completed"
  rewardPoints: number;
}

export default function Challenges() {
  const { theme } = useTheme();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getChallengesData();
        setChallenges(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleUpdateChallengeStatus = async (id: number, status: string) => {
    try {
      await updateChallengeStatus(id, status);
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === id ? { ...challenge, status } : challenge
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating challenge');
    }
  };

  const completedChallenges = challenges.filter((c) => c.status === 'Completed').length;
  const totalChallenges = challenges.length;
  const progressPercentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <Card
      className={cn(
        'shadow-lg',
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-gray-50 to-white text-gray-800'
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
          Herausforderungen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Fortschritt</span>
            <span className="text-sm font-medium">{completedChallenges}/{totalChallenges}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : challenges.length === 0 ? (
          <p className="text-center py-4">Keine Herausforderungen verfügbar.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{challenge.rewardPoints}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Belohnung: {challenge.rewardPoints} Punkte</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{challenge.description}</p>
                  {challenge.status === 'Pending' ? (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleUpdateChallengeStatus(challenge.id, 'Completed')}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Als erledigt markieren
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      <XCircle className="mr-2 h-4 w-4" />
                      Abgeschlossen
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}