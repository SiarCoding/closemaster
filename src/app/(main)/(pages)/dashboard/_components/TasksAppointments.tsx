'use client';

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Clock, Calendar } from "lucide-react";
import { getTasks } from "../_actions/dashboardActions";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  type?: 'task' | 'appointment';
}

export default function TasksAppointments() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data.map(item => ({
          ...item,
          type: item.time.includes(':') ? 'appointment' : 'task' // Infer type based on time format
        })) : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const toggleTaskCompletion = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Card className={cn("shadow-lg overflow-hidden",
      theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-white text-gray-800')}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6 text-blue-500" />
          Aufgaben & Termine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )  : tasks.length === 0 ? (
          <p className="text-center py-4">Keine Aufgaben oder Termine vorhanden.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-start space-x-4">
                  {task.type === 'task' ? (
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                  <Badge variant={task.type === 'task' ? "default" : "secondary"}>
                    {task.type === 'task' ? 'Aufgabe' : 'Termin'}
                  </Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}