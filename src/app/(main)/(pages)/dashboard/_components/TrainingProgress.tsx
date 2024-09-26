"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProgressIndicators() {
  const { theme } = useTheme();

  const progressData = [
    { date: '01.10.', progress: 30 },
    { date: '05.10.', progress: 50 },
    { date: '10.10.', progress: 40 },
    { date: '15.10.', progress: 60 },
    { date: '20.10.', progress: 50 },
    { date: '25.10.', progress: 70 },
    { date: '30.10.', progress: 80 },
  ];

  const goals = [
    { id: 1, title: 'Monatliches Umsatzziel', progress: 70, target: 100, deadline: '31.10.2023' },
    { id: 2, title: 'Anzahl neuer Kunden', progress: 50, target: 60, deadline: '31.10.2023' },
    { id: 3, title: 'Aktuelles Level', progress: 80, levelName: 'Senior Closer', target: 100 },
  ];

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader className="pb-2"> {/* Reduzierter Abstand unten */}
        <CardTitle className="text-xl font-bold">Fortschritt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-9 pt-4"> {/* Zusätzlicher Abstand oben */}
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">{goal.title} {goal.levelName ? `- ${goal.levelName}` : ''}</p>
              <p className="text-sm font-medium">{goal.progress}%</p>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Ziel: {goal.target}{goal.title === 'Aktuelles Level' ? '' : ' Einheiten'}</span>
              {goal.deadline && (
                <span>Verbleibend: {calculateRemainingDays(goal.deadline)} Tage</span>
              )}
            </div>
            {goal.title === 'Aktuelles Level' && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Fortschritt</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#E5E7EB"} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} 
                      tick={{fontSize: 12}}
                    />
                    <YAxis 
                      stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} 
                      tick={{fontSize: 12}}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1F2937" : "#F9FAFB",
                        borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}
                      labelStyle={{ color: theme === "dark" ? "#F3F4F6" : "#1F2937" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#2563EB" // bg-blue-600
                      strokeWidth={2} 
                      dot={{ r: 4, fill: "#2563EB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Hilfsfunktion zur Berechnung der verbleibenden Tage bis zum Ziel
function calculateRemainingDays(deadline: string): number {
  const today = new Date();
  const targetDate = new Date(deadline.split('.').reverse().join('-'));
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
}