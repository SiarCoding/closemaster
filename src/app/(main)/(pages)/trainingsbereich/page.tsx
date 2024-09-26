// src/app/(main)/(pages)/trainingsbereich/page.tsx

"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicRollenspiel = dynamic(
  () => import('./_components/Rollenspiel').then((mod) => mod.Rollenspiel),
  { ssr: false }
);

export default function Trainingsbereich() {
  const [currentLevel, setCurrentLevel] = useState(1); // Startet bei Level 1

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trainingsbereich</h1>
      </div>
      <DynamicRollenspiel initialLevel={currentLevel} />
    </div>
  );
}
