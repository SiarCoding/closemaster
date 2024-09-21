"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export function NotesEditor() {
  const { theme } = useTheme();
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Here you would typically save the notes to your backend
    console.log('Saving notes:', notes);
  };

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark" 
        ? "bg-gray-800 text-gray-100" 
        : "bg-white text-gray-800"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Notizen</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Fügen Sie hier Ihre Notizen hinzu..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] mb-4"
        />
        <Button onClick={handleSave}>Notizen speichern</Button>
      </CardContent>
    </Card>
  );
}