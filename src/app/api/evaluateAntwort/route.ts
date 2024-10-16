// app/api/evaluateAntwort/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { getCustomerBehaviorProfile, CustomerBehaviorProfile } from '@/lib/ColdCallingRules';
import salesTechniques from '@/lib/SalesTechniques';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, product: true, productDescription: true, industry: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { userMessage, conversationHistory, ticketData } = await request.json();

    // Get the customer behavior profile based on termination probability
    const customerProfile: CustomerBehaviorProfile = getCustomerBehaviorProfile(
      ticketData.terminationProbability
    );

    // Get preferred sales techniques
    const preferredTechniques = salesTechniques.filter((technique) =>
      customerProfile.preferredSalesTechniques.includes(technique.name)
    );

    let prompt = `
Du bist ein erfahrener Verkaufstrainer. Deine Aufgabe ist es, die letzte Nachricht des Verkäufers zu bewerten.

**Produkt des Verkäufers:** ${user.product}
**Produktbeschreibung:** ${user.productDescription}

**Kundenprofil:**
- **Name:** ${ticketData.name}
- **Verhaltensbeschreibung:** ${customerProfile.behaviorDescription}
- **Bevorzugte Verkaufstechniken:** ${customerProfile.preferredSalesTechniques.join(', ')}

**Gesprächsverlauf:**
${conversationHistory.slice(-5).join('\n')}

**Verkäufer:** ${userMessage}

**Anweisungen:**

- Analysiere die letzte Nachricht des Verkäufers.
- Bestimme, ob er eine der bevorzugten Verkaufstechniken angewendet hat.
- Bewerte die Wirksamkeit seiner Antwort auf einer Skala von 1 bis 10 (10 ist hervorragend).
- Gib ein kurzes, konstruktives Feedback (1-2 Sätze), warum du diese Bewertung vergibst und wie er sich verbessern kann.

**Antwortformat:**

Bewertung: [1-10]

Feedback: [Dein Feedback hier]
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const evaluation = await result.response.text();

    let rating = 0;
    let feedback = '';

    const ratingMatch = evaluation.match(/Bewertung:\s*(\d+)/i);
    const feedbackMatch = evaluation.match(/Feedback:\s*(.+)/i);

    if (ratingMatch && ratingMatch[1]) {
      rating = parseInt(ratingMatch[1], 10);
    }

    if (feedbackMatch && feedbackMatch[1]) {
      feedback = feedbackMatch[1].trim();
    }

    if (isNaN(rating)) {
      rating = 0;
      feedback = 'Die Bewertung konnte nicht bestimmt werden. Bitte versuchen Sie es erneut.';
    }

    return NextResponse.json({ rating, feedback });
  } catch (error) {
    console.error('Error evaluating salesperson response:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate salesperson response',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
