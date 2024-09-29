// src/app/api/generateKundenAntwort/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { levels } from '@/app/(main)/(pages)/trainingsbereich/levelsData';

export async function POST(request: NextRequest) {
  try {
    const { nachricht, szenarioId, level } = await request.json();

    if (szenarioId === undefined || level === undefined) {
      return NextResponse.json(
        { error: 'Szenario-ID und Level sind erforderlich.' },
        { status: 400 }
      );
    }

    const levelData = levels.find((lvl) => lvl.level === level);
    const szenario = levelData?.szenarien.find((sz) => sz.id === szenarioId);

    if (!szenario) {
      return NextResponse.json(
        { error: 'Ungültiges Szenario.' },
        { status: 400 }
      );
    }

    const sellerMessage = nachricht ? `Verkäufer: ${nachricht}\n` : '';

    const prompt = `
Du bist ein virtueller Kunde in einem Verkaufstraining auf Level ${level}. Dein Szenario ist: "${szenario.beschreibung}". Deine Aufgabe ist es, ein Verkaufsgespräch mit dem Verkäufer zu führen und auf seine Antworten zu reagieren. Wenn der Verkäufer überzeugend ist, zeige Interesse am Kauf. Wenn nicht, äußere Bedenken oder stelle weitere Fragen.

Verkaufsdialog:
${sellerMessage}Deine Antwort als Kunde:
`;

    const response = await axios.post(
      'https://api.ai21.com/studio/v1/j2-ultra/complete',
      {
        prompt: prompt,
        maxTokens: 150,
        temperature: 0.7,
        topP: 1,
        stopSequences: ['\n'],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI21_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.error('AI21 API Antwort:', response.data);
      return NextResponse.json(
        { error: 'Antwortgenerierung fehlgeschlagen.', details: response.data },
        { status: 500 }
      );
    }

    const kundenAntwort =
      response.data.completions[0]?.data.text.trim() ||
      'Entschuldigung, ich konnte keine passende Antwort generieren.';

    return NextResponse.json({ antwort: kundenAntwort });
  } catch (error: any) {
    console.error('Fehler bei der Antwortgenerierung:', error.message);
    return NextResponse.json(
      { error: 'Fehler bei der Generierung der Antwort.', details: error.message },
      { status: 500 }
    );
  }
}
