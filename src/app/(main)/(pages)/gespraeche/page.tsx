"use client";

import React from 'react';
import { SearchFilter } from './_components/SearchFilter';
import { ConversationList } from './_components/ConversationList';
import { AddConversationModal } from './_components/AddConversationModal';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export default function Gespraeche() {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gespräche</h1>
        <AddConversationModal />
      </div>
      <SearchFilter />
      <div className="mt-6">
        <ConversationList />
      </div>
    </div>
  );
}