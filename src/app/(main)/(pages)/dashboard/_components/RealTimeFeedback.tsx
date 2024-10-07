'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeedbacks, postFeedback } from '../_actions/dashboardActions';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface Feedback {
  id: number;
  message: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export default function RealTimeFeedback() {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const data = await getFeedbacks();
        setFeedbacks(Array.isArray(data) ? data.map(item => ({
          ...item,
          user: { name: 'User', avatar: undefined } // Add default user object
        })) : []);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  const handleSendFeedback = async () => {
    if (!newFeedback.trim()) return;

    try {
      const savedFeedback = await postFeedback(newFeedback);
      setFeedbacks((prev) => [...prev, {
        ...savedFeedback,
        user: { name: 'You', avatar: undefined } // Add user object to new feedback
      }]);
      setNewFeedback('');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <Card
      className={cn(
        'shadow-lg overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-gray-50 to-white text-gray-800'
      )}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-blue-500" />
          Echtzeit-Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="flex items-start space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={feedback.user.avatar} alt={feedback.user.name} />
                    <AvatarFallback>{feedback.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <p className="font-medium mb-1">{feedback.user.name}</p>
                      <p>{feedback.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Dein Feedback..."
                className="flex-1"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSendFeedback}
                className="flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}