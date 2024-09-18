"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target } from 'lucide-react'

const data = [
  { name: 'Abgeschlossen', value: 10 },
  { name: 'Nicht abgeschlossen', value: 47 },
  { name: 'Gesamt', value: 94 },
]

const COLORS = ['#10b981', '#ef4444', '#3b82f6']

const timeRanges = [
  { value: '1week', label: 'Letzte Woche' },
  { value: '1month', label: 'Letzter Monat' },
  { value: '3months', label: 'Letzte 3 Monate' },
  { value: '6months', label: 'Letzte 6 Monate' },
  { value: '1year', label: 'Letztes Jahr' },
  { value: 'alltime', label: 'Gesamte Zeit' },
  { value: 'custom', label: 'Benutzerdefiniert' },
]

export default function SalesPerformance() {
  const [selectedRange, setSelectedRange] = useState('1year')

  const completedSales = data.find((entry) => entry.name === 'Abgeschlossen')?.value || 0
  const totalSales = data.find((entry) => entry.name === 'Gesamt')?.value || 0
  const completionPercentage = (completedSales / totalSales) * 100

  const getMessage = () => {
    if (completionPercentage <= 10) {
      return "Das ist erst der Anfang, aber hey, der Stein rollt! Schaff dir einen kleinen Vorsprung – die nächsten Schritte warten!";
    } else if (completionPercentage <= 20) {
      return "Guter Einstieg! Noch ein bisschen pushen, und du kommst richtig ins Rollen. Hol dir jetzt den nächsten Erfolg!";
    } else if (completionPercentage <= 30) {
      return "Du bist schon auf einem guten Weg, aber da geht noch mehr. Pack die 30%, und es wird richtig spannend!";
    } else if (completionPercentage <= 40) {
      return "30% sind schon ein guter Batzen, aber du hast noch viel Luft nach oben! Push dich noch ein Stück weiter.";
    } else if (completionPercentage <= 50) {
      return "Du bist fast bei der Hälfte – jetzt nicht nachlassen! Bleib dran, und hol dir den verdienten Erfolg!";
    } else if (completionPercentage <= 60) {
      return "Mehr als die Hälfte geschafft! Aber es gibt immer Luft nach oben – jetzt alles geben, um noch weiter zu kommen!";
    } else if (completionPercentage <= 70) {
      return "Du bist schon weit gekommen! Lass den Drive nicht nach – jetzt geht’s richtig ab! Nächster Stopp: 70%!";
    } else if (completionPercentage <= 80) {
      return "Wow, 70%! Du bist fast ganz oben. Ein paar Schritte noch, und du hast’s in der Tasche!";
    } else if (completionPercentage <= 90) {
      return "80% – das Ziel ist zum Greifen nah! Noch mal durchziehen, und du hast’s bald geschafft!";
    } else if (completionPercentage <= 100) {
      return "Krass, fast am Ziel! Jetzt keinen Gang zurückschalten, das letzte Stück rockst du noch locker!";
    } else {
      return "100%! Du hast es geschafft, starke Leistung! Feiere deinen Erfolg und mach dich bereit für das nächste Level!";
    }
  }

  const progressBackground = `linear-gradient(90deg, 
    #ef4444 0%,        
    #f97316 25%,       
    #facc15 40%,       
    #10b981 50%,       
    #10b981 100%       
  )`

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: {
    cx: number | undefined,
    cy: number | undefined,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number | undefined,
    value: number
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = (cx ?? 0) + radius * Math.cos(-midAngle * RADIAN);
    const y = (cy ?? 0) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#4B5563"
        textAnchor={x > (cx ?? 0) ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${value} (${(percent! * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Card className="bg-white border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-700">Sales-Performance</CardTitle>
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-[180px] bg-gray-100 border-none text-sm text-gray-700">
            <SelectValue placeholder="Zeit wählen" />
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
      <CardContent className="pt-2">
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false} 
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span className="text-gray-700">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-9 text-gray-700">Abschlussquote: </h3>
          <div className="relative w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="absolute inset-0 h-2.5 rounded-full"
              style={{ background: progressBackground }}
            ></div>
            <div
              className="absolute top-0 h-2.5 rounded-full border-r-2 border-gray-700"
              style={{ left: `${completionPercentage}%` }}
            >
              <div className="absolute -right-1 -top-7 bg-white px-2 py-1 rounded shadow text-xs text-gray-700">
                {Math.round(completionPercentage)}%
              </div>
            </div>
            <Target className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-4 italic text-center">
          {getMessage()}
        </p>
      </CardContent>
    </Card>
  )
}
