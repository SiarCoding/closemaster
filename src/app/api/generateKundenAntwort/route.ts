import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nachricht, szenarioId, level, userData } = body;

    if (!nachricht || nachricht.trim() === '') {
      return NextResponse.json({ error: 'Die Nachricht darf nicht leer sein.' }, { status: 400 });
    }

    // Wit.ai API-Aufruf
    const witResponse = await axios.get(
      `https://api.wit.ai/message?v=20240930&q=${encodeURIComponent(nachricht)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WIT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const intent = witResponse.data.intents[0]?.name;
    const entities = witResponse.data.entities;

    // Logik zur Generierung der Antwort basierend auf Intent, Entities und userData
    let antwort = generateAntwort(intent, entities, userData, level, szenarioId);

    return NextResponse.json({ antwort });
  } catch (error) {
    // Fehlerbehandlung wie zuvor
    const err = error as Error | { response?: { data?: unknown; status?: number } };
    
    console.error('Fehler bei der Kommunikation mit Wit.ai:', 
      'response' in err ? err.response?.data : err instanceof Error ? err.message : 'Unknown error');

    return NextResponse.json({ error: 'Interner Serverfehler bei der Kommunikation mit Wit.ai' }, { status: 500 });
  }
}

function generateAntwort(intent: string, entities: any, userData: any, level: number, szenarioId: string): string {
  // Implementiere hier eine komplexere Logik zur Generierung der Antwort
  // Berücksichtige dabei intent, entities, userData, level und szenarioId

  switch(intent) {
    case 'greeting_with_interest':
      return `Guten Tag ${userData.nachname ? `Herr/Frau ${userData.nachname}` : ''}, 
              danke für Ihr Interesse an ${userData.product_name}. 
              Was möchten Sie speziell darüber wissen?`;
    case 'product_questions':
      return `Das ${userData.product_name} hat folgende Eigenschaften: ${userData.features.join(', ')}. 
              Welche Funktion interessiert Sie am meisten?`;
    case 'ask_price':
      return `Der Preis für ${userData.product_name} beträgt ${userData.price}. 
              Wie passt das in Ihr Budget?`;
    case 'raise_objections':
      // Hier könntest du spezifische Einwände basierend auf dem Level oder Szenario behandeln
      return `Ich verstehe Ihre Bedenken. Lassen Sie uns darüber sprechen, wie ${userData.product_name} 
              trotzdem einen Mehrwert für Sie bieten kann.`;
    // ... Weitere Fälle für andere Intents
    default:
      return `Entschuldigung, ich habe Ihre Frage nicht ganz verstanden. 
              Können Sie das bitte anders formulieren?`;
  }
}
