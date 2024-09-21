"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { TranscriptViewer } from './TranscriptViewer';
import { AudioPlayer } from './AudioPlayer';
import { NotesEditor } from './NotesEditor';

interface ConversationDetailProps {
  conversation: {
    id: number;
    customer: string;
    date: string;
    duration: string;
    status: string;
    probability: number;
    tags: string[];
  };
}

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  const { theme } = useTheme();

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{conversation.customer}</CardTitle>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-sm">{conversation.date}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{conversation.duration}</span>
          </div>
          <Badge variant="outline" className={cn(
            conversation.status === 'Analysiert' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
            conversation.status === 'Transkribiert' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
          )}>
            {conversation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Abschlusswahrscheinlichkeit</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${conversation.probability}%` }}
            />
          </div>
          <span className="text-sm">{conversation.probability}%</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          {conversation.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          ))}
        </div>
        <AudioPlayer />
        <TranscriptViewer />
        <NotesEditor />
      </CardContent>
    </Card>
  );
}