"use client";

import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

const conversations = [
  { id: 1, customer: 'Anna Müller', date: '2023-05-15', duration: '45 min', status: 'Analysiert', probability: 75 },
  { id: 2, customer: 'Max Schmidt', date: '2023-05-14', duration: '30 min', status: 'Offen', probability: 60 },
  { id: 3, customer: 'Lisa Weber', date: '2023-05-13', duration: '60 min', status: 'Analysiert', probability: 85 },
];

export function SearchFilter() {
  const { theme } = useTheme();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Suche nach Kunde, Stichworten, Datum..."
            className="pl-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recorded">Aufgezeichnet</SelectItem>
            <SelectItem value="transcribed">Transkribiert</SelectItem>
            <SelectItem value="analyzed">Analysiert</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot-lead">Hot Lead</SelectItem>
            <SelectItem value="follow-up">Nachfassen</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
          Sortieren
        </Button>
      </div>
    </div>
  );
}
