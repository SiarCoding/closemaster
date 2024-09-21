"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from 'lucide-react';

const data = [
  { name: 'Jan', gesamt: 400, abgeschlossen: 240, nichtAbgeschlossen: 160 },
  { name: 'Feb', gesamt: 300, abgeschlossen: 180, nichtAbgeschlossen: 120 },
  { name: 'Mär', gesamt: 500, abgeschlossen: 350, nichtAbgeschlossen: 150 },
  { name: 'Apr', gesamt: 280, abgeschlossen: 220, nichtAbgeschlossen: 60 },
  { name: 'Mai', gesamt: 600, abgeschlossen: 420, nichtAbgeschlossen: 180 },
  { name: 'Jun', gesamt: 700, abgeschlossen: 550, nichtAbgeschlossen: 150 },
];

const timeRanges = [
  { value: '1week', label: 'Letzte Woche' },
  { value: '1month', label: 'Letzter Monat' },
  { value: '3months', label: 'Letzte 3 Monate' },
  { value: '6months', label: 'Letzte 6 Monate' },
  { value: '1year', label: 'Letztes Jahr' },
  { value: 'alltime', label: 'Gesamte Zeit' },
  { value: 'custom', label: 'Benutzerdefiniert' },
]

const levels = [
  { name: "Rookie Closer", threshold: 0 },
  { name: "Junior Closer", threshold: 20 },
  { name: "Intermediate Closer", threshold: 40 },
  { name: "Senior Closer", threshold: 60 },
  { name: "Expert Closer", threshold: 80 },
  { name: "Master Closer", threshold: 90 },
]

export default function SalesPerformance() {
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState('1year')

  const completedSales = data[data.length - 1].abgeschlossen
  const totalSales = data[data.length - 1].gesamt
  const completionPercentage = (completedSales / totalSales) * 100

  const previousPerformance = 30 // Angenommen, dies ist die vorherige Leistung
  const currentGoal = previousPerformance + 10 // Dynamisches Ziel: 10% Verbesserung
  const relativePerformance = completionPercentage - previousPerformance

  const getLevel = (percentage: number) => {
    return levels.reduce((acc, level) => percentage >= level.threshold ? level : acc)
  }

  const currentLevel = getLevel(completionPercentage)

  const chartColors = {
    gesamt: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    abgeschlossen: theme === 'dark' ? '#34D399' : '#10B981',
    nichtAbgeschlossen: theme === 'dark' ? '#F87171' : '#EF4444',
    axis: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    text: theme === 'dark' ? '#F3F4F6' : '#1F2937',
    background: theme === 'dark' ? '#374151' : '#F9FAFB',
    border: theme === 'dark' ? '#4B5563' : '#E5E7EB',
  }

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Sales-Performance</CardTitle>
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zeitraum wählen" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2 space-y-6">
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke={chartColors.axis}
                tick={{ fill: chartColors.text, fontSize: 12 }}
              />
              <YAxis 
                stroke={chartColors.axis}
                tick={{ fill: chartColors.text, fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
                itemStyle={{ color: chartColors.text }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '0.875rem' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="gesamt" 
                name="Gesamt" 
                stroke={chartColors.gesamt} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="abgeschlossen" 
                name="Abgeschlossen" 
                stroke={chartColors.abgeschlossen} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="nichtAbgeschlossen" 
                name="Nicht abgeschlossen" 
                stroke={chartColors.nichtAbgeschlossen} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Dynamisches Ziel</h3>
            <Progress value={(completionPercentage / currentGoal) * 100} className="w-full" />
            <p className="text-sm mt-1">
              {completionPercentage.toFixed(1)}% von {currentGoal}% erreicht
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Relative Performance</h3>
            <div className="flex items-center space-x-2">
              {relativePerformance > 0 ? (
                <ArrowUp className="text-green-500" />
              ) : (
                <ArrowDown className="text-red-500" />
              )}
              <span className={`text-lg font-bold ${relativePerformance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(relativePerformance).toFixed(1)}%
              </span>
              <span className="text-sm">im Vergleich zur letzten Periode</span>
            </div>
            <Progress value={(relativePerformance / 20 + 0.5) * 100} className="w-full mt-2" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Aktuelles Level</h3>
            <Badge variant="outline" className="text-lg">
              {currentLevel.name}
            </Badge>
            <p className="text-sm mt-1">
              Nächstes Level: {getLevel(completionPercentage + 0.1).name} bei {getLevel(completionPercentage + 0.1).threshold}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}