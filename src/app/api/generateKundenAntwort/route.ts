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

    // Erstellen des Prompts für AI21
    const prompt = `
Du bist ein virtueller Kunde in einem Verkaufstraining auf Level ${level}. Deine Aufgabe ist es, auf die Antworten des Verkäufers zu reagieren. Wenn der Verkäufer überzeugend ist, zeige Interesse am Kauf. Wenn nicht, äußere Bedenken oder stelle weitere Fragen.

Verkaufsdialog:
Verkäufer: ${nachricht}
Deine Antwort als Kunde:
`;

    // Aufruf der AI21 API zur Generierung der Kundenantwort
    const response = await axios.post(
      'https://api.ai21.com/studio/v1/j2-ultra/complete',
      {
        prompt: prompt,
        maxTokens: 150,
        temperature: 0.7,
        topP: 1,
        stopSequences: ["\n"],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI21_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.error("AI21 API Antwort:", response.data);
      return NextResponse.json({ error: "Antwortgenerierung fehlgeschlagen.", details: response.data }, { status: 500 });
    }

    const kundenAntwort = response.data.completions[0]?.data.text.trim() || "Entschuldigung, ich konnte keine passende Antwort generieren.";

    return NextResponse.json({ antwort: kundenAntwort });
  } catch (error: any) {
    console.error("Fehler bei der Antwortgenerierung:", error.message);
    return NextResponse.json({ error: "Fehler bei der Generierung der Antwort.", details: error.message }, { status: 500 });
  }
}
