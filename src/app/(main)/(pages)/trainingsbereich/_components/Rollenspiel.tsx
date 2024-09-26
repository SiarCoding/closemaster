// src/app/(main)/(pages)/trainingsbereich/_components/Rollenspiel.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { levels, Level, Szenario } from '../levelsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';

interface Nachricht {
  sender: 'benutzer' | 'kunde' | 'system';
  inhalt: string;
}

interface RollenspielProps {
  initialLevel: number;
}

export function Rollenspiel({ initialLevel }: RollenspielProps) {
  const [currentLevel, setCurrentLevel] = useState<Level | undefined>(levels.find(l => l.level === initialLevel));
  const [currentSzenario, setCurrentSzenario] = useState<Szenario | undefined>(currentLevel?.szenarien[0]);
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [fortschritt, setFortschritt] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 0);
    return () => clearTimeout(timer);
  }, [nachrichten, scrollToBottom]);

  useEffect(() => {
    if (showIntro && currentLevel) {
      const introMessage: Nachricht = {
        sender: 'system',
        inhalt: `Willkommen zum Rollenspiel! Du befindest dich auf Level ${currentLevel.level}: ${currentLevel.name}.`,
      };
      setNachrichten([introMessage]);
      setShowIntro(false);
    }
  }, [showIntro, currentLevel]);

  const startRecording = () => {
    const SpeechRecognition = (window.SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert("Ihr Browser unterstützt keine Spracherkennung.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsRecording(true);

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript;
      recognition.stop();
      setIsRecording(false);
      setIsProcessing(true);
      await handleBenutzerNachricht(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Spracherkennungsfehler:", event.error);
      setFeedback(prev => [...prev, "Fehler bei der Spracherkennung."]);
      setIsRecording(false);
      setIsProcessing(false);
    };
  };

  const handleAudioInput = () => {
    if (isRecording) {
      // SpeechRecognition wird automatisch gestoppt nach dem Ergebnis oder Fehler
      // Kein zusätzlicher Code benötigt
    } else {
      startRecording();
    }
  };

  const handleBenutzerNachricht = async (inhalt: string) => {
    if (!currentSzenario) return;

    setNachrichten(prev => [...prev, { sender: 'benutzer', inhalt }]);

    try {
      const response = await axios.post('/api/generateKundenAntwort', {
        nachricht: inhalt,
        szenario: currentSzenario.beschreibung,
        level: currentLevel?.level
      });

      const kundenAntwort = response.data.antwort;
      setNachrichten(prev => [...prev, { sender: 'kunde', inhalt: kundenAntwort }]);

      // Sprachsynthese mit Web Speech API
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(kundenAntwort);
      utterThis.lang = 'de-DE';
      synth.speak(utterThis);

      // Feedback basierend auf Triggern
      const relevantFeedback = currentSzenario.feedback.filter(fb => inhalt.toLowerCase().includes(fb.trigger.toLowerCase()));
      if (relevantFeedback.length > 0) {
        relevantFeedback.forEach(fb => {
          setFeedback(prev => [...prev, fb.nachricht]);
        });
      }

      // Fortschritt basierend auf Szenarioabschluss
      setFortschritt(prev => Math.min(prev + 50, 100)); // Für zwei Szenarien in Level 1

      if (fortschritt + 50 >= 100) {
        handleLevelUp();
      } else {
        // Lade das nächste Szenario
        const nextSzenario = currentLevel?.szenarien.find(s => s.id === currentSzenario.id + 1);
        if (nextSzenario) {
          setCurrentSzenario(nextSzenario);
          setNachrichten(prev => [...prev, { sender: 'system', inhalt: `Weiter zum nächsten Szenario: ${nextSzenario.beschreibung}` }]);
        }
      }
    } catch (error) {
      console.error("Fehler bei der Verarbeitung der Benutzernachricht:", error);
      setFeedback(prev => [...prev, "Fehler bei der Verarbeitung der Benutzernachricht."]);
      setIsProcessing(false);
    }
  };

  const handleLevelUp = () => {
    const nextLevelNumber = currentLevel ? currentLevel.level + 1 : 1;
    const nextLevel = levels.find(l => l.level === nextLevelNumber);
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setCurrentSzenario(nextLevel.szenarien[0]);
      setNachrichten([]);
      setFortschritt(0);
      setFeedback([]);
      setShowIntro(true);
      // Optional: Benachrichtigung über Level-Up
      alert(`Glückwunsch! Du hast Level ${nextLevel.level} erreicht.`);
    } else {
      // Wenn keine weiteren Levels vorhanden sind
      setNachrichten(prev => [...prev, { sender: 'system', inhalt: "Herzlichen Glückwunsch! Du hast alle verfügbaren Levels abgeschlossen." }]);
    }
  };

  if (!currentLevel || !currentSzenario) {
    return <div>Level oder Szenario nicht gefunden.</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Rollenspiel - Level {currentLevel.level}: {currentLevel.name}</CardTitle>
        <CardDescription>{currentSzenario.beschreibung}</CardDescription>
        <div className="flex items-center mt-2">
          <Avatar className="w-10 h-10 mr-2">
            <AvatarImage src={currentSzenario.virtuellesKundenprofil} />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <span>Virtueller Kunde</span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4" ref={scrollViewportRef}>
          {nachrichten.map((nachricht, index) => (
            <div key={index} className={`flex ${nachricht.sender === 'benutzer' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${nachricht.sender === 'benutzer' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={
                    nachricht.sender === 'kunde' ? currentSzenario.virtuellesKundenprofil :
                    nachricht.sender === 'benutzer' ? '/benutzer-avatar.png' :
                    '/system-avatar.png'
                  } />
                  <AvatarFallback>
                    {nachricht.sender === 'kunde' ? 'K' : (nachricht.sender === 'benutzer' ? 'B' : 'S')}
                  </AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${
                  nachricht.sender === 'benutzer' ? 'bg-blue-500 text-white' :
                  nachricht.sender === 'kunde' ? 'bg-gray-200' :
                  'bg-green-100'
                }`}>
                  {nachricht.inhalt}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        {feedback.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            {feedback.map((msg, idx) => (
              <p key={idx} className="text-yellow-800">{msg}</p>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="mb-4 w-full">
          <Progress value={fortschritt} className="w-full" />
          <span className="text-sm text-gray-600">Fortschritt: {fortschritt}%</span>
        </div>
        <div className="flex justify-center w-full mb-4">
          <Button 
            onClick={handleAudioInput}
            disabled={isProcessing}
          >
            {isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
          </Button>
        </div>
        {fortschritt >= 100 && (
          <Button className="mt-4" onClick={handleLevelUp}>Zum nächsten Level</Button>
        )}
      </CardFooter>
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
}
