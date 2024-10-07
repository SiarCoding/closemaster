'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';
import { getLeaderboardData } from '../_actions/dashboardActions';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeaderboardEntry {
  id: number;
  userId: number;
  user: {
    name: string | null;
    avatar?: string;
  };
  score: number;
  rank: number;
}

export default function Leaderboard() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboardData();
        const rankedData = data.map((entry, index) => ({ ...entry, rank: index + 1 }));
        setLeaderboard(rankedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

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
          <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center py-4">Keine Leaderboard-Daten verfügbar.</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 font-semibold">Rang</th>
                  <th className="pb-4 font-semibold">Name</th>
                  <th className="pb-4 font-semibold text-right">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-4 pr-4">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                        <span className={cn(
                          "ml-2 font-semibold",
                          entry.rank <= 3 ? "text-lg" : "text-base"
                        )}>
                          {entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={entry.user.avatar} alt={entry.user.name || ''} />
                          <AvatarFallback>{entry.user.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{entry.user.name || 'Unbekannt'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Badge variant="secondary" className="font-semibold">
                        {entry.score}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}