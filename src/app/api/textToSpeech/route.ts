// src/app/api/textToSpeech/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text ist erforderlich." }, { status: 400 });
    }

    // Hier würden Sie normalerweise eine TTS-API aufrufen
    // Für dieses Beispiel simulieren wir einfach eine Antwort
    const simulatedAudioData = Buffer.from('Simulated audio data').toString('base64');

    return NextResponse.json({ audio: simulatedAudioData });
  } catch (error: any) {
    console.error("TTS Fehler:", error.message);
    return NextResponse.json({ error: "Fehler bei der Sprachsynthese." }, { status: 500 });
  }
}
