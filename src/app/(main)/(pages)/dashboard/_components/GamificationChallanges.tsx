'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Star, CheckCircle, XCircle } from 'lucide-react';
import { getChallengesData, updateChallengeStatus } from '../_actions/dashboardActions';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Challenge {
  id: number;
  title: string;
  description: string;
  status: string;
  rewardPoints: number;
}

export default function GamificationChallenges() {
  const { theme } = useTheme();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const data = await getChallengesData();
        setChallenges(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await updateChallengeStatus(id, 'Completed');
      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === id ? { ...challenge, status: 'Completed' } : challenge
        )
      );
    } catch (error) {
      console.error('Error updating challenge status:', error);
    }
  };

  const completedChallenges = challenges.filter(c => c.status === 'Completed').length;
  const totalChallenges = challenges.length;
  const progressPercentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <Card className={cn(
      "shadow-lg",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
          Aktuelle Herausforderungen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
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
        ) : challenges.length === 0 ? (
          <p className="text-center py-4">Keine aktuellen Herausforderungen. Tolle Arbeit!</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <ul className="space-y-4">
              {challenges.map(challenge => (
                <li key={challenge.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.description}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {challenge.rewardPoints}
                    </Badge>
                  </div>
                  {challenge.status === 'Pending' ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleComplete(challenge.id)}
                      className="w-full mt-2"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Abschließen
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="w-full mt-2 text-green-500">
                      <XCircle className="mr-2 h-4 w-4" />
                      Erledigt
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}