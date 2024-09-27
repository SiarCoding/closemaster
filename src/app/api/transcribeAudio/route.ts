// src/app/api/transcribeAudio/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: "Keine Audiodatei gefunden." }, { status: 400 });
    }

    // Lese die Audiodatei als ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBytes = new Uint8Array(arrayBuffer);

    // Sende die Audiodatei an die lokale ASR-Server-API
    const asrResponse = await axios.post(
      'http://localhost:8000/transcribe', // Stelle sicher, dass der ASR-Server läuft
      audioBytes,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ASR_API_KEY}`, // Falls benötigt
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    if (asrResponse.status !== 200) {
      return NextResponse.json({ error: "Transkription fehlgeschlagen." }, { status: 500 });
    }

    const transcription = asrResponse.data.text || "Transkription nicht verfügbar.";

    return NextResponse.json({ text: transcription });
  } catch (error: any) {
    console.error("Transkriptionsfehler:", error.response?.data || error.message);
    return NextResponse.json({ error: "Fehler bei der Transkription." }, { status: 500 });
  }
}
