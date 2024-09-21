"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

const cardData = [
  { title: 'Gesamtzahl der Gespräche', value: '124', progress: '20%', color: 'bg-indigo-400 dark:bg-indigo-600' },
  { title: 'Abschlussquote', value: '32%', progress: '5%', color: 'bg-orange-400 dark:bg-orange-600' },
  { title: 'Offene Follow-ups', value: '18', progress: '80%', color: 'bg-pink-400 dark:bg-pink-600' },
  { title: 'Aktuelles Level', value: 'Senior Closer', progress: '75%', color: 'bg-green-400 dark:bg-green-600' },
];

export function DashboardCards() {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cardData.map((item, index) => (
        <Card key={index} className={cn(
          "shadow-sm",
          theme === "dark" 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100" 
            : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            )}>{item.title}</CardTitle>
            <div className={`w-4 h-4 ${item.color} rounded-full`} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              item.title === 'Aktuelles Level' ? "text-xl font-bold" : "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>{item.value}</div>
            <p className={cn(
              "text-xs",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}>Fortschritt: {item.progress}</p>
            <div className={cn(
              "mt-4 h-2 w-full rounded-full",
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            )}>
              <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.progress }} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
