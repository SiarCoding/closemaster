// src/app/api/transcribeAudio/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data'; // Installiere dies mit `npm install form-data` falls nötig

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

    // Sende die Audiodatei an die Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      audioBytes,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    if (response.status !== 200) {
      return NextResponse.json({ error: "Transkription fehlgeschlagen." }, { status: 500 });
    }

    const data = response.data;

    // Die Struktur der Antwort kann je nach Modell variieren
    const transcription = data.text || "Transkription nicht verfügbar.";

    return NextResponse.json({ text: transcription });
  } catch (error: any) {
    console.error("Transkriptionsfehler:", error.response?.data || error.message);
    return NextResponse.json({ error: "Fehler bei der Transkription." }, { status: 500 });
  }
}
