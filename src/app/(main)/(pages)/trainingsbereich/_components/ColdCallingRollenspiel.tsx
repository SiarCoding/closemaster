"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Mic, MicOff, PhoneCall, Phone } from 'lucide-react'
import RealTimeTips from './RealTimeTips'

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: ErrorEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface TicketData {
  id: number;
  name: string;
  company: string;
  industry: string;
  product: string;
  productDescription: string;
  behavior: string;
  terminationProbability: number;
}

interface ColdCallingRollenspielProps {
  ticketData: TicketData;
}

const CallerAnimation: React.FC<{ ticketData: TicketData }> = ({ ticketData }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="w-80 bg-white">
      <CardHeader className="text-center">
        <CardTitle>Eingehender Anruf</CardTitle>
        <CardDescription>{ticketData.name} von {ticketData.company}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/placeholder.svg" alt={ticketData.name} />
          <AvatarFallback>{ticketData.name[0]}</AvatarFallback>
        </Avatar>
        <div className="animate-pulse flex space-x-4">
          <Phone className="h-8 w-8 text-green-500" />
          <Phone className="h-8 w-8 text-green-500" />
          <Phone className="h-8 w-8 text-green-500" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function ColdCallingRollenspiel({ ticketData }: ColdCallingRollenspielProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const [customerResponse, setCustomerResponse] = useState('')
  const [isCustomerSpeaking, setIsCustomerSpeaking] = useState(false)
  const [progressValue, setProgressValue] = useState(50)
  const [currentTip, setCurrentTip] = useState({ tip: '', example: '' })
  const [isConversationEnded, setIsConversationEnded] = useState(false)
  const [evaluation, setEvaluation] = useState('')
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [isRinging, setIsRinging] = useState(false)
  const { toast } = useToast()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'de-DE';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          handleSpeechRecognitionResult(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: "Fehler",
            description: "Fehler bei der Spracherkennung: " + event.error,
            variant: "destructive",
          });
        };
      } else {
        console.error('Speech recognition not supported');
        toast({
          title: "Fehler",
          description: "Spracherkennung wird von Ihrem Browser nicht unterstützt.",
          variant: "destructive",
        });
      }
    }

    audioRef.current = new Audio('/phone-ring.mp3');

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (progressValue <= 0 || progressValue >= 100) {
      setIsConversationEnded(true);
    }
  }, [progressValue]);

  const startCall = () => {
    setIsCallStarted(true);
    setIsRinging(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setTimeout(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
          setIsRinging(false);
          startConversation();
        }, 11000); // 11 seconds for the ring sound
      }).catch(error => {
        console.error('Error playing audio:', error);
        setIsRinging(false);
        startConversation(); // Start conversation anyway if audio fails
      });
    } else {
      setIsRinging(false);
      startConversation();
    }
  };

  const startConversation = async () => {
    const initialMessage = `Hallo, ${ticketData.name} von ${ticketData.company}, mit wem spreche ich?`;
    setConversationHistory([`Kunde: ${initialMessage}`]);
    setCustomerResponse(initialMessage);
    await speakText(initialMessage);
    await generateRealTimeTip(initialMessage);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeechRecognitionResult = async (transcript: string) => {
    setConversationHistory(prev => [...prev, `Verkäufer: ${transcript}`]);
    await evaluateResponse(transcript);
    await generateCustomerResponse(transcript);
  };

  const generateCustomerResponse = async (userMessage: string) => {
    try {
      const limitedConversationHistory = conversationHistory.slice(-5);
      const response = await fetch('/api/generateKundenAntwortColdCalling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage, conversationHistory: limitedConversationHistory, ticketData }),
      });

      if (!response.ok) {
        throw new Error('Could not generate customer response');
      }

      const data = await response.json();
      const customerResponse = data.customerResponse;

      setConversationHistory(prev => [...prev, `Kunde: ${customerResponse}`]);
      setCustomerResponse(customerResponse);
      await speakText(customerResponse);

      if (customerResponse.toLowerCase().includes("auf wiedersehen") || customerResponse.toLowerCase().includes("tschüss")) {
        setIsConversationEnded(true);
      } else {
        await generateRealTimeTip(customerResponse);
      }
    } catch (error) {
      console.error('Error generating customer response:', error);
      toast({
        title: "Fehler",
        description: "Konnte keine Kundenantwort generieren.",
        variant: "destructive",
      });
    }
  };

  const evaluateResponse = async (userMessage: string) => {
    try {
      const limitedConversationHistory = conversationHistory.slice(-5);
      const response = await fetch('/api/evaluateAntwort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage, conversationHistory: limitedConversationHistory, ticketData }),
      });

      if (!response.ok) {
        throw new Error('Could not evaluate response');
      }

      const data = await response.json();
      const { rating, feedback } = data;
      
      setProgressValue(prev => {
        const change = (rating - 5) * 4; // Increased impact of rating
        const newValue = Math.max(0, Math.min(prev + change, 100));
        return newValue;
      });

      setEvaluation(feedback);
    } catch (error) {
      console.error('Error evaluating response:', error);
      toast({
        title: "Fehler",
        description: "Konnte die Antwort nicht bewerten.",
        variant: "destructive",
      });
    }
  };

  const generateRealTimeTip = async (customerResponse: string) => {
    try {
      const limitedConversationHistory = conversationHistory.slice(-5);
      const response = await fetch('/api/generateRealTimeTips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerResponse, conversationHistory: limitedConversationHistory, ticketData }),
      });

      if (!response.ok) {
        throw new Error('Could not generate real-time tip');
      }

      const data = await response.json();
      setCurrentTip({ tip: data.tip, example: data.example });
    } catch (error) {
      console.error('Error generating real-time tip:', error);
    }
  };

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsCustomerSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // If voices are not immediately available, wait for them to load
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          setVoice();
        };
      } else {
        setVoice();
      }

      function setVoice() {
        // Find a male German voice
        const maleGermanVoice = voices.find(voice => 
          voice.lang.includes('de') && voice.name.toLowerCase().includes('male')
        );
        
        if (maleGermanVoice) {
          utterance.voice = maleGermanVoice;
        } else {
          console.warn('No male German voice found. Using default voice.');
        }
        
        utterance.onend = () => {
          setIsCustomerSpeaking(false);
          resolve();
        };
        
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white min-h-screen">
      {isRinging && <CallerAnimation ticketData={ticketData} />}
      <Card className="flex-grow lg:w-2/3 bg-white shadow-xl">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">{ticketData.name}</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              Terminierungswahrscheinlichkeit: {ticketData.terminationProbability}%
            </Badge>
          </div>
          <CardDescription className="text-gray-600">
            {ticketData.behavior}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white shadow-inner">
            {conversationHistory.map((message, index) => (
              <div key={index} className={`flex items-start space-x-2 mb-4 ${message.startsWith('Verkäufer') ? 'justify-end' : 'justify-start'}`}>
                <Avatar className={`${message.startsWith('Verkäufer') ? 'order-2 bg-blue-500' : 'bg-gray-500'}`}>
                  <AvatarFallback>{message.startsWith('Verkäufer') ? 'V' : 'K'}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] rounded-lg p-3 ${message.startsWith('Verkäufer') ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            ))}
            
            {isCustomerSpeaking && (
              <div className="flex items-center space-x-2 text-blue-600">
                <span className="animate-pulse">●</span>
                <span>Kunde spricht...</span>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            {!isCallStarted ? (
              <Button
                onClick={startCall}
                className="w-48 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Anruf starten
              </Button>
            ) : (
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isCustomerSpeaking || isConversationEnded}
                className={`w-48 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-300 ease-in-out transform hover:scale-105`}
              
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-5  w-5" />
                    Aufnahme stoppen
                  </>
                ) : (
                  <>
                    <Mic  className="mr-2 h-5 w-5" />
                    Aufnahme starten
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="mt-4">
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-center text-sm mt-2 text-gray-600">Fortschritt: {progressValue}%</p>
          </div>
          {evaluation && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
              <p className="text-sm text-gray-700">Bewertung: {evaluation}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {currentTip.tip && (
        <div className="lg:w-1/3">
          <RealTimeTips 
            tip={currentTip.tip} 
            example={currentTip.example}
            onClose={() => setCurrentTip({ tip: '', example: '' })}
          />
        </div>
      )}

      <AlertDialog open={isConversationEnded}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800">Gespräch beendet</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {progressValue >= 100
                ? "Ausgezeichnet! Sie haben das Gespräch erfolgreich abgeschlossen und einen Termin vereinbart."
                : progressValue <= 0
                ? "Das Gespräch wurde leider nicht erfolgreich beendet. Versuchen Sie beim nächsten Mal, überzeugender zu argumentieren."
                : "Das Gespräch wurde beendet. Sie haben einige gute Punkte gemacht, aber es gibt noch Raum für Verbesserung."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setIsConversationEnded(false);
              setConversationHistory([]);
              setProgressValue(50);
              setEvaluation('');
              setIsCallStarted(false);
            }} className="bg-blue-500 hover:bg-blue-600 text-white">
              Neues Gespräch starten
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
