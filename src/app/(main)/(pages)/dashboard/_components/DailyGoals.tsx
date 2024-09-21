"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Mic, FileText, Key } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export default function DailyGoals() {
  const { theme } = useTheme();

  const quests = [
    { name: '5 Follow-ups', completed: true },
    { name: '3 neue Leads', completed: false },
  ];

  const challenges = [
    { name: 'Oktober Challenge', description: '10 Deals abschließen', progress: 60 },
  ];

  const recentCalls = [
    { name: 'Gespräch mit Kunde A', duration: '45 min', keywordsCount: 12 },
    { name: 'Präsentation für Firma B', duration: '30 min', keywordsCount: 8 },
  ];

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Tägliche Ziele & Herausforderungen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Tägliche Quests</h3>
          <ul className="space-y-3">
            {quests.map((quest, index) => (
              <li key={index} className="flex items-center space-x-3">
                <CheckCircle className={`w-5 h-5 ${quest.completed ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={quest.completed ? 'line-through' : ''}>{quest.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Aktuelle Challenge</h3>
          {challenges.map((challenge, index) => (
            <div key={index}>
              <h4 className="text-md font-semibold mb-2">{challenge.name}</h4>
              <p className="text-sm mb-3">{challenge.description}</p>
              <Progress value={challenge.progress} className="h-3 rounded-full" />
              <p className="text-right mt-2 text-sm">{challenge.progress}% abgeschlossen</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Kürzliche Gesprächsanalysen</h3>
          {recentCalls.map((call, index) => (
            <div key={index} className={cn(
              "mb-4 p-3 rounded-lg",
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{call.name}</span>
                <span className={cn(
                  "text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                )}>{call.duration}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Mic className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">Aufgezeichnet</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">Transkribiert</span>
                </div>
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-sm">{call.keywordsCount} Schlüsselwörter</span>
                </div>
              </div>
            </div>
          ))}
          <button className={cn(
            "mt-2 hover:underline",
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          )}>Alle Analysen anzeigen</button>
        </div>
      </CardContent>
    </Card>
  );
}