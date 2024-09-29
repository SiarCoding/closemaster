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
import FeedbackModal from './FeedbackModal';

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
  const [isLevelStarted, setIsLevelStarted] = useState(false);

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
    if (isLevelStarted && showIntro && currentLevel) {
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
  }, [isLevelStarted, showIntro, currentLevel]);

  const handleTextToSpeech = (text: string) => {
    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE'; // Sprache auf Deutsch setzen
      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('Text-to-speech error:', e);
        reject(e);
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Spracherkennung wird von diesem Browser nicht unterstützt.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log('Spracherkennung gestartet.');
    };

    recognition.onresult = async (event: any) => {
      const transcription = event.results[0][0].transcript;
      console.log('Transkription:', transcription);
      await handleBenutzerNachricht(transcription);
    };

    recognition.onerror = (event: any) => {
      console.error('Fehler bei der Spracherkennung:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log('Spracherkennung beendet.');
    };

    recognition.start();
  };

  const handleBenutzerNachricht = async (transcription: string) => {
    try {
      if (!currentSzenario) return;

      const benutzerNachricht: Nachricht = { sender: 'benutzer', inhalt: transcription };
      setNachrichten((prev) => [...prev, benutzerNachricht]);
      setConversationHistory((prev) => [...prev, benutzerNachricht]);

      // Nachricht bewerten
      const evaluationResponse = await axios.post('/api/evaluateAntwort', {
        nachricht: transcription,
        level: currentLevel?.level,
      });

      const { score, justification } = evaluationResponse.data;

      // Fortschritt basierend auf Bewertung anpassen
      if (score >= 7) {
        setFortschritt((prev) => Math.min(prev + 20, 100));
      } else {
        setFortschritt((prev) => Math.max(prev - 10, 0));
      }

      // Justification als Systemnachricht anzeigen
      const systemMessage: Nachricht = {
        sender: 'system',
        inhalt: `Bewertung: ${score}/10. ${justification}`,
      };
      setNachrichten((prev) => [...prev, systemMessage]);

      // Überprüfen, ob das Level abgeschlossen ist
      if (fortschritt >= 80) {
        await handleLevelAbschluss();
      } else {
        // Nächste Kundenantwort
        await sendKundenNachricht(transcription);
      }
    } catch (error) {
      console.error('Fehler bei der Verarbeitung der Benutzernachricht:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendKundenNachricht = async (benutzerNachricht?: string) => {
    try {
      const response = await axios.post('/api/generateKundenAntwort', {
        nachricht: benutzerNachricht || '',
        szenarioId: currentSzenario?.id,
        level: currentLevel?.level,
      });

      const kundenAntwort = response.data.antwort;
      const kundenNachricht: Nachricht = { sender: 'kunde', inhalt: kundenAntwort };
      setNachrichten((prev) => [...prev, kundenNachricht]);
      setConversationHistory((prev) => [...prev, kundenNachricht]);

      await handleTextToSpeech(kundenAntwort);

      // Nach dem Abspielen der Kundenantwort Spracherkennung starten
      handleSpeechRecognition();
    } catch (error) {
      console.error('Fehler bei der Generierung der Kundenantwort:', error);
    }
  };

  const handleLevelAbschluss = async () => {
    try {
      const response = await axios.post('/api/generateFeedback', {
        conversationHistory,
        level: currentLevel?.level,
        szenarioId: currentSzenario?.id,
      });

      const feedbackText = response.data.feedback;
      setFeedback(feedbackText);
      setShowFeedbackModal(true);

      setFortschritt(100);
    } catch (error) {
      console.error('Fehler bei der Generierung des Feedbacks:', error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      {!isLevelStarted ? (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-bold mb-4">Willkommen zum Rollenspiel</h2>
          <p className="mb-6">
            Klicke auf den Button, um Level {currentLevel?.level} zu starten.
          </p>
          <Button onClick={() => setIsLevelStarted(true)}>
            Level {currentLevel?.level} starten
          </Button>
        </div>
      ) : (
        <>
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
                {isRecording ? (
                  <p>Bitte sprechen Sie Ihre Antwort...</p>
                ) : (
                  <p>Warten auf die Antwort des Kunden...</p>
                )}
              </div>
            )}
          </CardFooter>

          {/* Feedback Modal */}
          <FeedbackModal
            isOpen={showFeedbackModal}
            feedback={feedback}
            onClose={() => setShowFeedbackModal(false)}
          />
        </>
      )}
    </Card>
  );
}
