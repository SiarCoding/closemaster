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
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import FeedbackModal from './FeedbackModal';

interface RollenspielProps {
  initialLevel: number;
  onLevelChange: (level: number) => void;
}

interface Nachricht {
  sender: 'benutzer' | 'kunde' | 'system';
  inhalt: string;
}

interface UserData {
  nachname: string;
  product_name: string;
  price: string;
  features: string[];
  competitor_product?: string;
  quantity?: number;
  custom_data?: string;
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

  // Neue State-Variable für die Nutzerdaten
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUserDataForm, setShowUserDataForm] = useState(false);

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
    if (isLevelStarted && showIntro && currentLevel && userData) {
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
  }, [isLevelStarted, showIntro, currentLevel, userData]);

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
        userData,
        conversationHistory,
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

  // Füge in der Funktion sendKundenNachricht die Anpassungen hinzu

  const sendKundenNachricht = async (benutzerNachricht?: string) => {
    try {
      let kundenNachrichtText = '';
  
      if (!benutzerNachricht) {
        // Erste Nachricht des virtuellen Kunden (Kunde begrüßt den Verkäufer)
        kundenNachrichtText = `Guten Tag, ich interessiere mich für Ihr Produkt ${userData?.product_name}.`;
      } else {
        // Nachricht des virtuellen Kunden basierend auf der Verkäuferantwort
        const response = await axios.post('/api/generateKundenAntwort', {
          nachricht: benutzerNachricht,
          szenarioId: currentSzenario?.id,
          level: currentLevel?.level,
          userData,
        });
  
        kundenNachrichtText = response.data.antwort;
      }
  
      const kundenNachricht: Nachricht = { sender: 'kunde', inhalt: kundenNachrichtText };
      setNachrichten((prev) => [...prev, kundenNachricht]);
      setConversationHistory((prev) => [...prev, kundenNachricht]);
  
      await handleTextToSpeech(kundenNachrichtText);
  
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
        userData,
      });

      const feedbackText = response.data.feedback;
      setFeedback(feedbackText);
      setShowFeedbackModal(true);

      setFortschritt(100);
    } catch (error) {
      console.error('Fehler bei der Generierung des Feedbacks:', error);
    }
  };

  const handleStartLevel = () => {
    setShowUserDataForm(true);
  };

  const handleUserDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: UserData = {
      nachname: formData.get('nachname') as string,
      product_name: formData.get('product_name') as string,
      price: formData.get('price') as string,
      features: (formData.get('features') as string).split(',').map((f) => f.trim()),
      competitor_product: formData.get('competitor_product') as string,
      quantity: parseInt(formData.get('quantity') as string) || undefined,
      custom_data: formData.get('custom_data') as string,
    };

    setUserData(data);
    setIsLevelStarted(true);
    setShowUserDataForm(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-green-50 shadow-lg">
      {!isLevelStarted ? (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Willkommen zum Rollenspiel</h2>
          <p className="mb-6 text-gray-600">
            Bereit für Level {currentLevel?.level}? Starte jetzt und verbessere deine Verkaufsfähigkeiten!
          </p>
          <Button
            onClick={handleStartLevel}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Level {currentLevel?.level} starten
          </Button>

          {showUserDataForm && (
            <form onSubmit={handleUserDataSubmit} className="mt-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Bitte fülle die folgenden Felder aus:</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Dein Nachname:</label>
                <input
                  name="nachname"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Produktname:</label>
                <input
                  name="product_name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preis:</label>
                <input
                  name="price"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Funktionen (kommagetrennt):</label>
                <input
                  name="features"
                  type="text"
                  required
                  placeholder="z.B. Hohe Leistung, Benutzerfreundlich"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {/* Optionale Felder */}
              <div className="mb-4">
                <label className="block text-gray-700">Wettbewerberprodukt (optional):</label>
                <input
                  name="competitor_product"
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Menge (optional):</label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Weitere Informationen (optional):</label>
                <textarea
                  name="custom_data"
                  className="w-full px-3 py-2 border rounded"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Rollenspiel starten
              </Button>
            </form>
          )}
        </div>
      ) : (
        <>
          <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">
              Rollenspiel - Level {currentLevel?.level}: {currentLevel?.name}
            </CardTitle>
            <CardDescription className="text-orange-100">{currentSzenario?.beschreibung}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Ziele:</h3>
              <div className="flex flex-wrap gap-2">
                {currentLevel?.ziel.map((ziel, index) => (
                  <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    {ziel}
                  </Badge>
                ))}
              </div>
            </div>
            <ScrollArea className="h-[400px] w-full pr-4 border rounded-lg bg-white" ref={scrollViewportRef}>
              {nachrichten.map((nachricht, index) => (
                <div
                  key={index}
                  className={`flex ${
                    nachricht.sender === 'benutzer' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`flex items-start max-w-[70%] ${
                      nachricht.sender === 'benutzer' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-10 h-10 border-2 border-white shadow-md">
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
                      className={`mx-2 p-3 rounded-lg shadow-md ${
                        nachricht.sender === 'benutzer'
                          ? 'bg-blue-500 text-white'
                          : nachricht.sender === 'kunde'
                          ? 'bg-gray-100'
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
          <CardFooter className="flex flex-col items-stretch bg-gray-50 rounded-b-lg">
            <div className="mb-4 w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Progress
                        value={fortschritt}
                        className="w-full h-3 bg-blue-200 [&>div]:bg-blue-500"
                      />
                      <span className="text-sm text-gray-600 mt-1 block">
                        Fortschritt: {fortschritt.toFixed(0)}%
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dein aktueller Fortschritt im Rollenspiel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {!isProcessing && fortschritt < 100 && (
              <div className="flex justify-center w-full mb-4">
                {isRecording ? (
                  <p className="text-blue-600 animate-pulse">Bitte sprechen Sie Ihre Antwort...</p>
                ) : (
                  <p className="text-gray-600">Warten auf die Antwort des Kunden...</p>
                )}
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Leistungsübersicht:</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: 'Kommunikation', wert: 75 },
                    { name: 'Produktwissen', wert: 85 },
                    { name: 'Überzeugungskraft', wert: 60 },
                    { name: 'Abschlussfähigkeit', wert: 70 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="wert" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
