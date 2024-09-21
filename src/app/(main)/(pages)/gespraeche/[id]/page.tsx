"use client";

import React from 'react';
import { ConversationDetail } from '../_components/ConversationDetails';
import { TranscriptViewer } from '../_components/TranscriptViewer';
import { AudioPlayer } from '../_components/AudioPlayer';
import { NotesEditor } from '../_components/NotesEditor';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

// This is a mock function. In a real app, you'd fetch the conversation data based on the ID.
const getConversation = (id: string) => ({
  id: parseInt(id),
  customer: 'Anna Müller',
  date: '2023-05-15',
  duration: '45 min',
  status: 'Analysiert',
  probability: 75,
  tags: ['Hot Lead'],
});

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme();
  const conversation = getConversation(params.id);

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    )}>
      <ConversationDetail conversation={conversation} />
      <div className="mt-6 space-y-6">
        <AudioPlayer />
        <TranscriptViewer />
        <NotesEditor />
      </div>
    </div>
  );
}
