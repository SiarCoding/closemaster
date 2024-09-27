// src/app/api/generateFeedback/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import { levels } from '@/app/(main)/(pages)/trainingsbereich/levelsData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationHistory, level, szenarioId } = body;

    if (!conversationHistory || !level || !szenarioId) {
      return NextResponse.json({ error: "Konversationsverlauf, Level und Szenario-ID sind erforderlich." }, { status: 400 });
    }

    // Laden der Bewertungskriterien
    const levelData = levels.find(lvl => lvl.level === level);
    const bewertungskriterien = levelData?.bewertungskriterien || [];

    // Formatieren der Gesprächshistorie
    const formattedConversation = conversationHistory.map((message: any) => {
      const sender = message.sender === 'benutzer' ? 'Verkäufer' : 'Kunde';
      return `${sender}: ${message.inhalt}`;
    }).join('\n');

    // Erstellen des Prompts für AI21
    const prompt = `
Du bist ein erfahrener Verkaufstrainer. Analysiere das folgende Verkaufsgespräch zwischen einem Verkäufer und einem Kunden. Bewerte den Verkäufer in den folgenden Kategorien auf einer Skala von 1 bis 10:

${bewertungskriterien.map(kriterium => `- ${kriterium.name}`).join('\n')}

Gib für jede Kategorie eine kurze Begründung der Bewertung. Identifiziere Stärken und Schwächen und mache konkrete Vorschläge zur Verbesserung.

Gespräch:
${formattedConversation}

Bewertung:
`;

    // Aufruf der AI21 API zur Generierung des Feedbacks
    const response = await axios.post(
      'https://api.ai21.com/studio/v1/j2-ultra/complete',
      {
        prompt: prompt,
        maxTokens: 500,
        temperature: 0.7,
        topP: 1,
        stopSequences: ["###"],
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
      return NextResponse.json({ error: "Feedbackgenerierung fehlgeschlagen.", details: response.data }, { status: 500 });
    }

    const feedbackText = response.data.completions[0]?.data.text.trim();

    return NextResponse.json({ feedback: feedbackText });
  } catch (error: any) {
    console.error("Fehler bei der Generierung des Feedbacks:", error.message);
    return NextResponse.json({ error: "Fehler bei der Generierung des Feedbacks.", details: error.message }, { status: 500 });
  }
}
