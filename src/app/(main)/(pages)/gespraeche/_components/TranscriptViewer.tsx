"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { Search } from 'lucide-react';

export function TranscriptViewer() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock transcript data
  const transcript = [
    { time: '00:00', speaker: 'Agent', text: 'Hallo, wie kann ich Ihnen heute helfen?' },
    { time: '00:05', speaker: 'Kunde', text: 'Ich habe eine Frage zu Ihrem Produkt X.' },
    // ... more transcript lines
  ];

  const filteredTranscript = transcript.filter(line => 
    line.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gray-800 text-gray-100" 
        : "bg-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Transkript</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Transkript durchsuchen..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {filteredTranscript.map((line, index) => (
          <div key={index} className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{line.time}</span>
            <span className="ml-2 font-semibold">{line.speaker}:</span>
            <p>{line.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}