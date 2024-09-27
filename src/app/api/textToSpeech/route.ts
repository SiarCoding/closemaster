import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";
import * as dotenv from "dotenv";

// dotenv initialisieren, um Umgebungsvariablen zu nutzen
dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text ist erforderlich.' }, { status: 400 });
    }

    // Text in Sprache mit ElevenLabs umwandeln
    const audioStream = await client.generate({
      voice: "Eric", // Du kannst andere Stimmen von ElevenLabs verwenden
      model_id: "eleven_multilingual_v2", // Model-ID anpassen
      text,
    });

    // Umwandlung des Audio-Streams in einen Base64-String
    const audioBuffer = await streamToBuffer(audioStream);
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({ audio: audioBase64 });
  } catch (error: any) {
    console.error('Fehler bei Text-to-Speech:', error.message);
    return NextResponse.json({ error: 'Fehler bei der Text-to-Speech-Umwandlung.' }, { status: 500 });
  }
}

// Hilfsfunktion, um den Audio-Stream in einen Buffer zu konvertieren
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
