'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Loader2, Target, TrendingUp, Calendar } from 'lucide-react';
import { getGoals, getPerformances } from '../_actions/dashboardActions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Goal {
  id: number;
  title: string;
  target: number;
  progress: number;
  deadline?: Date | null;
}

interface Performance {
  date: Date;
  achievedGoals: number;
}

export default function ProgressIndicators() {
  const { theme } = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progressData, setProgressData] = useState<{ date: string; progress: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [goalsData, performancesData] = await Promise.all([
          getGoals(),
          getPerformances(),
        ]);

        setGoals(goalsData);
        setProgressData(
          performancesData.map((item: Performance) => ({
            date: new Date(item.date).toLocaleDateString(),
            progress: item.achievedGoals,
          }))
        );
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const calculateRemainingDays = (deadline: Date | null | undefined): number => {
    if (!deadline) return 0;
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
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
          <Target className="mr-2 h-6 w-6 text-blue-500" />
          Fortschritt & Ziele
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="goals">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="goals">Ziele</TabsTrigger>
              <TabsTrigger value="performance">Leistung</TabsTrigger>
            </TabsList>
            <TabsContent value="goals">
              <ScrollArea className="h-[300px] pr-4">
                {goals.length === 0 ? (
                  <p className="text-center py-4">
                    Keine Ziele gefunden. Setzen Sie sich neue Ziele, um Ihren Fortschritt zu verfolgen!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{goal.title}</p>
                          <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>
                            {goal.progress}%
                          </Badge>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Target className="mr-1 h-4 w-4" />
                            Ziel: {goal.target} Einheiten
                          </span>
                          {goal.deadline && (
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              Verbleibend: {calculateRemainingDays(goal.deadline)} Tage
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="performance">
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Leistungsentwicklung
                </h3>
                {progressData.length === 0 ? (
                  <p className="text-center py-4">Keine Leistungsdaten verfügbar.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                      <XAxis
                        dataKey="date"
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                          borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        }}
                        labelStyle={{ color: theme === 'dark' ? '#F3F4F6' : '#1F2937' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#2563EB' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}