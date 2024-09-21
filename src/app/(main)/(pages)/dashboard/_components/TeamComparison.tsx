"use client"

import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export default function TeamComparison() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const metrics = [
    { title: 'Abschlussquote', value: '80%', userValue: '32%', teamValue: '28%' },
    { title: 'Kundenzufriedenheit', value: '90%', userValue: '4.5/5', teamValue: '4.2/5' },
  ];

  const leaderboard = [
    { name: 'Anna M.', score: '50%', position: 1 },
    { name: 'Tom S.', score: '45%', position: 2 },
    { name: 'Lisa K.', score: '40%', position: 3 },
    { name: 'Max B.', score: '38%', position: 4 },
    { name: 'Sarah L.', score: '35%', position: 5 },
  ];

  const achievements = [
    { name: 'Verhandlungsmeister', icon: <Star className="w-4 h-4" />, description: '10 Deals über Zielpreis abgeschlossen' },
    { name: 'Senior Sales', icon: <Trophy className="w-4 h-4" />, description: '100 erfolgreiche Abschlüsse' },
    { name: 'Kundenliebling', icon: <Target className="w-4 h-4" />, description: '50 5-Sterne Bewertungen' },
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-sm space-y-8",
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 to-white"
    )}>
      <h2 className={cn(
        "text-2xl font-bold mb-6",
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      )}>Team-Vergleich & Leistungen</h2>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className={cn(
            "p-4 rounded-lg shadow-sm",
            theme === "dark" ? "bg-gray-800" : "bg-white"
          )}>
            <h4 className={cn(
              "text-lg font-semibold mb-3",
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            )}>{metric.title}</h4>
            <Progress value={parseInt(metric.value)} className="h-2 mb-3" />
            <div className={cn(
              "flex justify-between text-sm",
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            )}>
              <span>Sie: {metric.userValue}</span>
              <span>Team: {metric.teamValue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className={cn(
        "p-4 rounded-lg shadow-sm",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        )}>Leaderboard</h3>
        <ul className="space-y-3">
          {leaderboard.map((leader, index) => (
            <li key={index} className={cn(
              "flex justify-between items-center p-3 rounded-lg",
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            )}>
              <span className="flex items-center">
                <Trophy className={`w-5 h-5 mr-3 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`} />
                <span className={cn(
                  "font-medium",
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                )}>{leader.name}</span>
              </span>
              <span className="font-semibold text-indigo-600">{leader.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Achievements */}
      <div>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        )}>Errungenschaften</h3>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={cn(
              "flex items-start space-x-3 p-3 rounded-lg",
              theme === "dark" ? "bg-gray-800" : "bg-white"
            )}>
              <Badge variant="secondary" className={cn(
                "flex items-center space-x-2 px-3 py-1",
                theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700"
              )}>
                {achievement.icon}
                <span>{achievement.name}</span>
              </Badge>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}