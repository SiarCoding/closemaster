// src/app/(main)/dashboard/page.tsx

"use client";

import React, { useState } from 'react';
import { Rollenspiel } from './_components/Rollenspiel';

export default function Dashboard() {
  const [currentLevel, setCurrentLevel] = useState(1); // Startet bei Level 1

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <Rollenspiel initialLevel={currentLevel} onLevelChange={setCurrentLevel} />
    </div>
  );
}
