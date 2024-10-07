'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Loader2, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { getKpiData } from '../_actions/dashboardActions';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface KPI {
  salesTarget: number;
  newCustomers: number;
  levelProgress: number;
  level: string;
  credits: number;
}

export default function Recommendations() {
  const { theme } = useTheme();
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKpi() {
      try {
        const data = await getKpiData();
        setKpi(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKpi();
  }, []);

  useEffect(() => {
    if (kpi) {
      const recommendationsList = [
        {
          condition: (goals: KPI) => goals.salesTarget < 50,
          message:
            'Du bist bei weniger als 50% deines Umsatzziels. Konzentriere dich auf Upselling-Möglichkeiten.',
        },
        {
          condition: (goals: KPI) =>
            goals.salesTarget >= 50 && goals.salesTarget < 80,
          message:
            'Guter Fortschritt! Versuche, die letzten Kunden für diesen Monat zu gewinnen.',
        },
        {
          condition: (goals: KPI) => goals.salesTarget >= 80,
          message:
            'Fast geschafft! Ein paar weitere Abschlüsse, und du erreichst dein Umsatzziel.',
        },
        {
          condition: (goals: KPI) => goals.newCustomers < 50,
          message:
            'Setze den Fokus auf Neukundenakquise, um dein Ziel zu erreichen.',
        },
        {
          condition: (goals: KPI) => goals.levelProgress >= 100,
          message:
            'Glückwunsch! Du hast ein neues Level erreicht. Sieh dir deine neuen Vorteile an.',
        },
      ];

      const recommendation = recommendationsList.find((rec) =>
        rec.condition(kpi)
      );
      if (recommendation) {
        setTip(recommendation.message);
      } else {
        setTip('Weiter so! Du machst einen großartigen Job.');
      }
    }
  }, [kpi]);

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
          <Lightbulb className="mr-2 h-6 w-6 text-yellow-500" />
          Empfehlungen & KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : kpi ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <DollarSign className="mr-1 h-4 w-4 text-green-500" />
                    Umsatzziel
                  </span>
                  <Badge variant="outline">{kpi.salesTarget}%</Badge>
                </div>
                <Progress value={kpi.salesTarget} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <Users className="mr-1 h-4 w-4 text-blue-500" />
                    Neue Kunden
                  </span>
                  <Badge variant="outline">{kpi.newCustomers}</Badge>
                </div>
                <Progress value={kpi.newCustomers} max={100} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center">
                  <Target className="mr-1 h-4 w-4 text-purple-500" />
                  Level Fortschritt
                </span>
                <Badge variant="secondary">{kpi.level}</Badge>
              </div>
              <Progress value={kpi.levelProgress} className="h-2" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Tipp des Tages
              </h3>
              <p>{tip}</p>
            </div>
          </div>
        ) : (
          <p className="text-center py-4">Keine KPI-Daten verfügbar.</p>
        )}
      </CardContent>
    </Card>
  );
}