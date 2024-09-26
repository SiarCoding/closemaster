"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle, PlusCircle, ListTodo, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TasksAppointments() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Meeting mit Kunde X', time: '10:00 Uhr', completed: false },
    { id: 2, title: 'Angebot für Projekt Y erstellen', time: '14:00 Uhr', completed: false },
    { id: 3, title: 'Nachfassen bei Lead Z', time: '16:00 Uhr', completed: false },
    { id: 4, title: 'Vorbereitung Präsentation', time: '11:00 Uhr', completed: false },
    { id: 5, title: 'Team-Meeting', time: '15:30 Uhr', completed: false },
  ]);
  const [showAll, setShowAll] = useState(false);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 3);

  return (
    <Card className={cn(
      "shadow-sm",
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
    )}>
      <CardHeader className="flex flex-col space-y-1.5 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Aktuelle Aufgaben & Termine</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Neue Aufgabe</span>
              <span className="sm:hidden">Aufgabe</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Neuer Termin</span>
              <span className="sm:hidden">Termin</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.time.includes('Uhr') ? (
                <Calendar className="w-5 h-5 text-blue-500" />
              ) : (
                <ListTodo className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="font-medium">{task.title}</p>
                <p className={cn(
                  "text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                )}>{task.time}</p>
              </div>
            </div>
            <button
              className={cn(
                "flex items-center space-x-1",
                theme === "dark" ? "text-green-400" : "text-green-600"
              )}
              onClick={() => {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
              }}
            >
              <CheckCircle className={cn("w-5 h-5", task.completed ? "" : "opacity-50")} />
            </button>
          </div>
        ))}
        {tasks.length > 3 && (
          <Button
            variant="ghost"
            className="w-full mt-2 flex items-center justify-center"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Alle ansehen
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}