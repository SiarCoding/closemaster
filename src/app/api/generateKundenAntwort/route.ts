// src/app/api/generateKundenAntwort/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nachricht, szenario, level } = body;

    if (!nachricht || !szenario || level === undefined) {
      return NextResponse.json({ error: "Nachricht, Szenario und Level sind erforderlich." }, { status: 400 });
    }

    const prompt = `Szenario: ${szenario}
Level: ${level}
Kunde: ${nachricht}
Verkäufer: `;

    // Verwende die Hugging Face Inference API für Textgenerierung
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilgpt2',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Überprüfe die Antwortstruktur
    const generatedText = response.data.generated_text || response.data[0]?.generated_text || "Danke für Ihre Nachricht.";

    // Extrahiere die Antwort nach 'Verkäufer: '
    let antwort = generatedText.split('Verkäufer: ')[1]?.trim() || "Danke für Ihre Nachricht.";

    // Entferne mögliche zusätzliche Zeilen
    antwort = antwort.split('\n')[0].trim();

    return NextResponse.json({ antwort });
  } catch (error: any) {
    console.error("Fehler bei der Antwortgenerierung:", error.message);
    return NextResponse.json({ error: "Fehler bei der Generierung der Antwort." }, { status: 500 });
  }
}
