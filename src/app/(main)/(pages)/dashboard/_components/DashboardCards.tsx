'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { getKpiData } from '../_actions/dashboardActions';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function DashboardCards() {
  const { theme } = useTheme();
  const [kpi, setKpi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKpi() {
      try {
        const data = await getKpiData();
        setKpi(data);
      } catch (error) {
        console.error('Error fetching KPI:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKpi();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!kpi) {
    return <p className="text-center">Keine KPI-Daten verfügbar.</p>;
  }

  const cardData = [
    {
      title: 'Verkaufsziel',
      value: `${kpi.salesTarget}% erreicht`,
      progress: kpi.salesTarget,
      color: 'bg-blue-400 dark:bg-blue-600',
    },
    {
      title: 'Neue Kunden',
      value: `${kpi.newCustomers}% erreicht`,
      progress: kpi.newCustomers,
      color: 'bg-green-400 dark:bg-green-600',
    },
    {
      title: 'Aktuelles Level',
      value: kpi.levelProgress >= 100 ? kpi.level : `${kpi.levelProgress}%`,
      progress: kpi.levelProgress,
      color: 'bg-purple-400 dark:bg-purple-600',
    },
    {
      title: 'Credits',
      value: `${kpi.credits} Credits`,
      progress: (kpi.credits / 100) * 100,
      color: 'bg-orange-400 dark:bg-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cardData.map((item, index) => (
        <Card
          key={index}
          className={cn(
            'shadow-sm',
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100'
              : 'bg-gradient-to-br from-gray-50 to-white text-gray-800'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={cn(
                'text-sm font-medium',
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              )}
            >
              {item.title}
            </CardTitle>
            <div className={`w-4 h-4 ${item.color} rounded-full`} />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                item.title === 'Aktuelles Level' ? 'text-xl font-bold' : 'text-2xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}
            >
              {item.value}
            </div>
            <p
              className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              Fortschritt: {item.progress}%
            </p>
            <Progress
              value={item.progress}
              className={cn(
                'mt-4 h-2',
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              )}
              // Remove the indicatorClassName prop
              // indicatorClassName={item.color}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
