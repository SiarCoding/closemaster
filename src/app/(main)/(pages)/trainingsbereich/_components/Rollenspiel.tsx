// src/app/(main)/trainingsbereich/_components/Rollenspiel.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { levels, Level, Szenario } from '../levelsData';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import FeedbackModal from './FeedbackModal'; // Neuer Component für Feedback

interface Nachricht {
  sender: 'benutzer' | 'kunde' | 'system';
  inhalt: string;
}

interface RollenspielProps {
  initialLevel: number;
  onLevelChange: (level: number) => void;
}

export function Rollenspiel({ initialLevel, onLevelChange }: RollenspielProps) {
  const [currentLevel, setCurrentLevel] = useState<Level | undefined>(
    levels.find((l) => l.level === initialLevel)
  );
  const [currentSzenario, setCurrentSzenario] = useState<Szenario | undefined>(
    currentLevel?.szenarien[0]
  );
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [fortschritt, setFortschritt] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Nachricht[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

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
      const introText = `Willkommen zum Rollenspiel! Du befindest dich auf Level ${currentLevel.level}: ${currentLevel.name}. Heute lernst du: ${currentLevel.ziel.join(
        ', '
      )}.`;
      const introMessage: Nachricht = {
        sender: 'system',
        inhalt: introText,
      };
      setNachrichten([introMessage]);
      setShowIntro(false);
      handleTextToSpeech(introText).then(() => {
        // Startet das Gespräch mit der ersten Kundenfrage
        sendKundenNachricht();
      });
    }
  }, [showIntro, currentLevel]);

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Ihr Browser unterstützt keine Spracherkennung.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsRecording(true);

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      recognition.stop();
      setIsRecording(false);
      setIsProcessing(true);
      await handleBenutzerNachricht(speechResult);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Spracherkennungsfehler:', event.error);
      setIsRecording(false);
      setIsProcessing(false);
    };
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      const response = await axios.post('/api/textToSpeech', { text });

      const data = response.data;

      if (data.audio) {
        // Audio-Quelle erstellen und abspielen
        const audioSrc = `data:audio/mp3;base64,${data.audio}`;
        const audio = new Audio(audioSrc);
        audio.play();
      } else {
        alert('Kein Audio generiert');
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleBenutzerNachricht = async (inhalt: string) => {
    if (!currentSzenario) return;

    const benutzerNachricht: Nachricht = { sender: 'benutzer', inhalt };
    setNachrichten((prev) => [...prev, benutzerNachricht]);
    setConversationHistory((prev) => [...prev, benutzerNachricht]);

    try {
      setIsProcessing(true);

      // Nächste Kundenantwort senden und Fortschritt aktualisieren
      const success = await sendKundenNachricht(inhalt);

      if (success) {
        // Gute Antwort, Fortschritt erhöhen
        setFortschritt((prev) => Math.min(prev + 20, 100)); // Erhöht um 20%
      } else {
        // Schlechte Antwort, Fortschritt verringern
        setFortschritt((prev) => Math.max(prev - 10, 0)); // Verringert um 10%
      }

      // Überprüfen, ob das Level abgeschlossen ist
      if (fortschritt >= 80) {
        await handleLevelAbschluss();
      }
    } catch (error) {
      console.error('Fehler bei der Verarbeitung der Benutzernachricht:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendKundenNachricht = async (benutzerNachricht?: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/generateKundenAntwort', {
        nachricht: benutzerNachricht || '',
        szenario: currentSzenario?.beschreibung,
        level: currentLevel?.level,
      });

      const kundenAntwort = response.data.antwort;
      const kundenNachricht: Nachricht = { sender: 'kunde', inhalt: kundenAntwort };
      setNachrichten((prev) => [...prev, kundenNachricht]);
      setConversationHistory((prev) => [...prev, kundenNachricht]);

      // Text-to-Speech für die Kundenantwort
      await handleTextToSpeech(kundenAntwort);

      // Bewertung der Kundenantwort
      return response.data.erfolgreich; // Boolean-Wert, ob die Antwort erfolgreich war
    } catch (error) {
      console.error('Fehler bei der Generierung der Kundenantwort:', error);
      return false;
    }
  };

  const handleLevelAbschluss = async () => {
    // Feedback vom Server abrufen
    try {
      const response = await axios.post('/api/generateFeedback', {
        conversationHistory,
        level: currentLevel?.level,
        szenarioId: currentSzenario?.id,
      });
      const feedbackText = response.data.feedback;
      setFeedback(feedbackText);
      setShowFeedbackModal(true);

      // Level als abgeschlossen markieren
      setFortschritt(100);
    } catch (error) {
      console.error('Fehler bei der Generierung des Feedbacks:', error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          Rollenspiel - Level {currentLevel?.level}: {currentLevel?.name}
        </CardTitle>
        <CardDescription>{currentSzenario?.beschreibung}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4" ref={scrollViewportRef}>
          {nachrichten.map((nachricht, index) => (
            <div
              key={index}
              className={`flex ${
                nachricht.sender === 'benutzer' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`flex items-start ${
                  nachricht.sender === 'benutzer' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      nachricht.sender === 'kunde'
                        ? currentSzenario?.virtuellesKundenprofil
                        : nachricht.sender === 'benutzer'
                        ? '/mann.jpg'
                        : '/system-avatar.png'
                    }
                  />
                  <AvatarFallback>
                    {nachricht.sender === 'kunde'
                      ? 'K'
                      : nachricht.sender === 'benutzer'
                      ? 'B'
                      : 'S'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    nachricht.sender === 'benutzer'
                      ? 'bg-blue-500 text-white'
                      : nachricht.sender === 'kunde'
                      ? 'bg-gray-200'
                      : 'bg-green-100'
                  }`}
                >
                  {nachricht.inhalt}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="mb-4 w-full">
          <Progress value={fortschritt} className="w-full" />
          <span className="text-sm text-gray-600">
            Fortschritt: {fortschritt.toFixed(0)}%
          </span>
        </div>
        {!isProcessing && fortschritt < 100 && (
          <div className="flex justify-center w-full mb-4">
            <Button onClick={startRecording} disabled={isRecording}>
              {isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
            </Button>
          </div>
        )}
      </CardFooter>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        feedback={feedback}
        onClose={() => setShowFeedbackModal(false)}
      />
    </Card>
  );
}
