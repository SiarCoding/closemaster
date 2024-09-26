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

    // Erstelle FormData für den ASR-Server
    const asrFormData = new FormData();
    asrFormData.append('audio', audioFile, audioFile.name);

    // Sende die Audiodatei an den ASR-Server
    const response = await axios.post('http://localhost:8000/transcribe', asrFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const text = response.data.text;

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Transkriptionsfehler:", error.message);
    return NextResponse.json({ error: "Fehler bei der Transkription." }, { status: 500 });
  }
}
