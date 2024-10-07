// src/app/api/evaluateAntwort/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { levels } from '@/app/(main)/(pages)/trainingsbereich/levelsData';

export async function POST(request: NextRequest) {
  try {
    const { nachricht, level, userData, conversationHistory } = await request.json();

    if (!nachricht || level === undefined) {
      return NextResponse.json(
        { error: 'Nachricht und Level sind erforderlich.' },
        { status: 400 }
      );
    }

    const levelData = levels.find((lvl) => lvl.level === level);
    const levelGoals = levelData?.ziel.join(', ') || '';
    const levelTechniques = levelData?.techniken.join(', ') || '';

    const formattedConversation = conversationHistory
      .map((message: any) => {
        const sender = message.sender === 'benutzer' ? 'Verkäufer' : 'Kunde';
        return `${sender}: ${message.inhalt}`;
      })
      .join('\n');

    const prompt = `
Du bist ein erfahrener Verkaufstrainer. Analysiere die folgende Antwort eines Verkäufers auf Level ${level}. Die Lernziele dieses Levels sind: ${levelGoals}. Die wichtigen Techniken sind: ${levelTechniques}. Der Verkäufer verkauft das Produkt "${userData.product_name}" mit den Funktionen: ${userData.features.join(
      ', '
    )}. Berücksichtige das vorherige Gespräch in deiner Analyse.

Vorheriges Gespräch:
${formattedConversation}

Aktuelle Antwort des Verkäufers:
"${nachricht}"

Bewerte die Antwort des Verkäufers auf einer Skala von 1 bis 10 und gib eine kurze Begründung für die Bewertung.

Bewertung (1-10):
Begründung:
`;

    const response = await axios.post(
      'https://api.ai21.com/studio/v1/j2-ultra/complete',
      {
        prompt: prompt,
        maxTokens: 80,
        temperature: 0.7,
        topP: 1,
        stopSequences: ['###'],
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
        { error: 'Bewertung fehlgeschlagen.', details: response.data },
        { status: 500 }
      );
    }

    const completionText = response.data.completions[0]?.data.text.trim();
    const [scoreLine, ...justificationLines] = completionText.split('\n');
    const scoreMatch = scoreLine.match(/(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const justification = justificationLines.join('\n').trim();

    if (score === null) {
      return NextResponse.json(
        { error: 'Bewertung konnte nicht extrahiert werden.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ score, justification });
  } catch (error: any) {
    console.error('Fehler bei der Bewertung der Antwort:', error.message);
    return NextResponse.json(
      { error: 'Fehler bei der Bewertung der Antwort.', details: error.message },
      { status: 500 }
    );
  }
}
