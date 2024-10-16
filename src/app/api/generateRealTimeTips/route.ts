// app/api/generateRealTimeTips/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { getCustomerBehaviorProfile } from '@/lib/ColdCallingRules';
import salesTechniques from '@/lib/SalesTechniques';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const fallbackTip =
  'Hören Sie dem Kunden aufmerksam zu und stellen Sie offene Fragen, um mehr über seine Bedürfnisse zu erfahren.';
const fallbackExample =
  'Können Sie mir mehr darüber erzählen, welche Herausforderungen Sie derzeit in Ihrem Geschäft haben?';

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

    const { customerResponse, conversationHistory, ticketData } = await request.json();

    const customerProfile = getCustomerBehaviorProfile(ticketData.terminationProbability);

    let prompt = `
Du bist ein erfahrener Verkaufstrainer. Basierend auf der letzten Kundenantwort sollst du dem Verkäufer einen **konkreten** Tipp geben.

**Produkt des Verkäufers:**
- **Name**: ${user.product}
- **Beschreibung**: ${user.productDescription}

**Kundenprofil:**
- **Verhaltensbeschreibung:** ${customerProfile.behaviorDescription}
- **Bevorzugte Verkaufstechniken:** ${customerProfile.preferredSalesTechniques.join(', ')}

**Letzte Kundenantwort:**
"${customerResponse}"

**Anweisungen:**

- Analysiere die letzte Kundenantwort **kurz**.
- Gib dem Verkäufer einen **präzisen Tipp** (1-2 Sätze), wie er am besten reagieren sollte.
- Dein Tipp sollte eine der bevorzugten Verkaufstechniken beinhalten, **ohne sie explizit zu nennen oder zu beschreiben**.
- Gib einen **konkreten Beispielsatz**, den der Verkäufer verwenden könnte.
- **Vermeide** jegliche Erwähnung von Verkaufstechniken oder Strategien im Tipp und Beispiel.
- **Antwortformat strikt einhalten:**

**Antwortformat:**

Tipp: [Dein Tipp hier]

Beispiel: [Beispielsatz]
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = (await result.response.text()).trim();

    const [tipPart, examplePart] = response.split(/Beispiel:/i);
    const tip = tipPart.replace(/Tipp:\s*/i, '').trim() || fallbackTip;
    const example = examplePart ? examplePart.trim() : fallbackExample;

    return NextResponse.json({ tip, example });
  } catch (error) {
    console.error('Error generating real-time tip:', error);
    return NextResponse.json({ tip: fallbackTip, example: fallbackExample });
  }
}
