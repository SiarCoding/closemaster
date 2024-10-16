// src/app/api/generateAITickets/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { customerBehaviorProfiles } from '@/lib/ColdCallingRules';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface GeneratedTicket {
  name: string;
  company: string;
  industry: string;
  behavior: string;
  terminationProbability: number;
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        product: true,
        industry: true,
        productDescription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { prompt } = await request.json();

    // Extrahiere die Terminierungswahrscheinlichkeiten und Verhaltensbeschreibungen aus den ColdCallingRules
    const behaviorData = customerBehaviorProfiles.map((profile) => ({
      terminationProbabilityRange: profile.terminationProbabilityRange,
      behaviorDescription: profile.behaviorDescription,
    }));

    // Erstelle einen String, der die Verhaltensbeschreibungen und entsprechenden Terminierungswahrscheinlichkeiten enthält
    const behaviorDescriptions = behaviorData
      .map(
        (data) =>
          `- Terminierungswahrscheinlichkeit ${data.terminationProbabilityRange[0]}% bis ${data.terminationProbabilityRange[1]}%: ${data.behaviorDescription}`
      )
      .join('\n');

    let aiPrompt = `
Du bist ein Vertriebsmitarbeiter für das Produkt "${user.product}" in der Branche "${user.industry}". Das Produkt ist: ${user.productDescription}

Basierend auf dem folgenden Benutzer-Prompt:

"${prompt}"

Generiere 5 realistische B2B-Kunden-Tickets für ein Cold-Calling-Szenario. Die Tickets sollten potenzielle Kunden darstellen, die Interesse an "${user.product}" haben könnten.

Jedes Ticket sollte folgende Informationen enthalten:

1. **Name**: Ein realistischer deutscher Vor- und Nachname.
2. **Firmenname**: Ein realistischer deutscher Unternehmensname mit Rechtsform.
3. **Branche**: Sollte zur Branche des Benutzers passen, muss aber nicht.
4. **Kundenverhalten**: Eine kurze Beschreibung in einem Satz, basierend auf den folgenden Verhaltensprofilen.
5. **Terminierungswahrscheinlichkeit**: Eine Zahl zwischen 2% und 25%, die zu dem Kundenverhalten passt.

**Verhaltensprofile und entsprechende Terminierungswahrscheinlichkeiten:**

${behaviorDescriptions}

**Anweisungen:**

- Stelle sicher, dass das Kundenverhalten und die Terminierungswahrscheinlichkeit zusammenpassen.
- Wähle für jedes Ticket eine der Verhaltensbeschreibungen aus und die entsprechende Terminierungswahrscheinlichkeit innerhalb des angegebenen Bereichs.
- Verwende realistische und konsistente Daten.
- Gib die Tickets im folgenden JSON-Format zurück:

[
  {
    "name": "Vorname Nachname",
    "company": "Firmenname GmbH",
    "industry": "Branche",
    "behavior": "Beschreibung des Kundenverhaltens",
    "terminationProbability": 15
  },
  ...
]
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(aiPrompt);
    const generatedContent = await result.response.text();

    let tickets: GeneratedTicket[];
    try {
      // Extrahiere den JSON-Teil aus der generierten Antwort
      const jsonStartIndex = generatedContent.indexOf('[');
      const jsonEndIndex = generatedContent.lastIndexOf(']') + 1;
      const jsonContent = generatedContent.substring(jsonStartIndex, jsonEndIndex);

      tickets = JSON.parse(jsonContent);

      // Validierung der Tickets
      tickets = tickets.map((ticket) => {
        // Stellen Sie sicher, dass die terminationProbability innerhalb von 2% bis 25% liegt
        if (ticket.terminationProbability < 2) {
          ticket.terminationProbability = 2;
        } else if (ticket.terminationProbability > 25) {
          ticket.terminationProbability = 25;
        }

        // Überprüfe, ob das Kundenverhalten zu den Verhaltensprofilen passt
        const matchingProfile = customerBehaviorProfiles.find((profile) =>
          profile.behaviorDescription === ticket.behavior
        );

        if (!matchingProfile) {
          // Wenn kein passendes Profil gefunden wurde, weise ein Standardprofil zu
          ticket.behavior = 'Neutrales Verhalten';
          ticket.terminationProbability = 10;
        }

        return ticket;
      });
    } catch (error) {
      console.error('Error parsing generated content:', error);
      return NextResponse.json(
        { error: 'Failed to parse generated tickets' },
        { status: 500 }
      );
    }

    const createdTickets = await Promise.all(
      tickets.map(async (ticket) => {
        return await db.ticket.create({
          data: {
            userId: user.id,
            name: ticket.name,
            company: ticket.company,
            industry: ticket.industry,
            behavior: ticket.behavior,
            terminationProbability: ticket.terminationProbability,
            status: 'kaltakquise',
            product: user.product || '',
            productDescription: user.productDescription || '',
          },
        });
      })
    );

    return NextResponse.json({ tickets: createdTickets });
  } catch (error) {
    console.error('Error generating AI tickets:', error);
    return NextResponse.json({ error: 'Failed to generate tickets' }, { status: 500 });
  }
}
