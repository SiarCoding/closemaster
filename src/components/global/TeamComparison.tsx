import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from 'lucide-react';

export default function TeamComparison() {
  const metrics = [
    { title: 'Abschlussquote', value: '80%', userValue: '32%', teamValue: '28%' },
    { title: 'Kundenzufriedenheit', value: '90%', userValue: '4.5/5', teamValue: '4.2/5' },
  ];

  const leaderboard = [
    { name: 'Anna M.', score: '50%', position: 1 },
    { name: 'Tom S.', score: '45%', position: 2 },
    { name: 'Lisa K.', score: '40%', position: 3 },
  ];

  const badges = [
    { name: 'Verhandlungsmeister', icon: <Star className="w-4 h-4" /> },
    { name: 'Senior Sales', icon: <Trophy className="w-4 h-4" /> },
  ];

  const challenges = [
    { name: 'Oktober Challenge', description: '10 Deals abschließen', progress: 60 },
  ];

  const quests = [
    { name: '5 Follow-ups', completed: true },
    { name: '3 neue Leads', completed: false },
  ];

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Team-Vergleich & Leistungen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Metriken</h3>
          {metrics.map((metric, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-600">{metric.title}</h4>
              <Progress value={parseInt(metric.value)} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sie: {metric.userValue}</span>
                <span>Team-Durchschnitt: {metric.teamValue}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Leaderboard</h3>
          <ul className="space-y-2">
            {leaderboard.map((leader, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="flex items-center">
                  <Trophy className={`w-4 h-4 mr-2 ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
                  {leader.name}
                </span>
                <span className="font-semibold">{leader.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Errungenschaften</h3>
          <div className="flex space-x-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                {badge.icon}
                <span>{badge.name}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Aktuelle Challenge</h3>
          {challenges.map((challenge, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <h4 className="text-sm font-semibold mb-1">{challenge.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
              <Progress value={challenge.progress} className="h-2" />
            </div>
          ))}
        </div>

        {/* Quests */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Tägliche Quests</h3>
          <ul className="space-y-2">
            {quests.map((quest, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input type="checkbox" checked={quest.completed} readOnly className="rounded text-indigo-600" />
                <span className={quest.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                  {quest.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Motivation Boost */}
        <div className="bg-indigo-100 p-3 rounded-lg flex items-center space-x-3">
          <Zap className="w-6 h-6 text-indigo-600" />
          <p className="text-sm text-indigo-700 font-medium">
            Nur noch 2 Abschlüsse bis zur nächsten Belohnung!
          </p>
        </div>

        {/* Sales Forecast */}
        <div className="bg-green-100 p-3 rounded-lg flex items-center space-x-3">
          <Target className="w-6 h-6 text-green-600" />
          <p className="text-sm text-green-700 font-medium">
            Bei deinem aktuellen Tempo könntest du Platz 1 erreichen!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}