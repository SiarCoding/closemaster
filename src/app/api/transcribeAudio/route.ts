import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: "Keine Audiodatei gefunden." }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    console.log('Audio file type:', audioFile.type);
    console.log('Audio file size:', audioBuffer.length);

    if (audioBuffer.length === 0) {
      console.error('Die Audiodatei ist leer.');
      return NextResponse.json({ error: "Die Audiodatei ist leer." }, { status: 400 });
    }

    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        params: {
          language: 'de',
          punctuate: true,
          model: 'general',
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      console.error('Deepgram API Fehler:', response.data);
      return NextResponse.json({ error: "Transkription fehlgeschlagen." }, { status: 500 });
    }

    const transcription = response.data.results.channels[0].alternatives[0].transcript || "Transkription nicht verfügbar.";

    return NextResponse.json({ transcription });
  } catch (error: any) {
    console.error("Transkriptionsfehler:", error.response?.data || error.message);
    return NextResponse.json({ error: "Fehler bei der Transkription.", details: error.response?.data || error.message }, { status: 500 });
  }
}