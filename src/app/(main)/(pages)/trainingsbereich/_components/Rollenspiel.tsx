"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"
import socket from '@/socket';

export default function ColdCallingRollenspiel() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [customerResponse, setCustomerResponse] = useState('');
  const [isCustomerSpeaking, setIsCustomerSpeaking] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Verbunden mit Socket.IO-Server');
    });

    socket.on('customerResponse', (response: string) => {
      setCustomerResponse(response);
      setIsCustomerSpeaking(true);
      speakText(response);
    });

    return () => {
      socket.off('connect');
      socket.off('customerResponse');
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Fehler",
        description: "Aufnahme konnte nicht gestartet werden.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/transcribeAudio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transkription fehlgeschlagen');
      }

      const data = await response.json();
      const transcription = data.transcription;

      setConversationHistory(prev => [...prev, `Verkäufer: ${transcription}`]);
      generateCustomerResponse(transcription);
    } catch (error) {
      console.error('Error sending audio to server:', error);
      toast({
        title: "Fehler",
        description: "Audio konnte nicht gesendet werden.",
        variant: "destructive",
      });
    }
  };

  const generateCustomerResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/api/generateKundenAntwortColdCalling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage, conversationHistory }),
      });

      if (!response.ok) {
        throw new Error('Kundenantwort konnte nicht generiert werden');
      }

      const data = await response.json();
      const customerResponse = data.customerResponse;

      setConversationHistory(prev => [...prev, `Kunde: ${customerResponse}`]);
      setCustomerResponse(customerResponse);
      setIsCustomerSpeaking(true);
      speakText(customerResponse);

      // Senden Sie die Antwort an den Socket.IO-Server
      socket.emit('customerResponse', customerResponse);
    } catch (error) {
      console.error('Error generating customer response:', error);
      toast({
        title: "Fehler",
        description: "Kundenantwort konnte nicht generiert werden.",
        variant: "destructive",
      });
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.onend = () => setIsCustomerSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cold-Calling Rollenspiel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto border p-4 rounded">
            {conversationHistory.map((message, index) => (
              <p key={index} className={message.startsWith('Verkäufer') ? 'text-blue-600' : 'text-green-600'}>
                {message}
              </p>
            ))}
            {isCustomerSpeaking && <p className="text-green-600 animate-pulse">Kunde spricht...</p>}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={startRecording} disabled={isRecording || isCustomerSpeaking}>
              Aufnahme starten
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording || isCustomerSpeaking}>
              Aufnahme beenden
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}