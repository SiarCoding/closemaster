// app/api/generateKundenAntwortColdCalling/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { getCustomerBehaviorProfile, CustomerBehaviorProfile } from '@/lib/ColdCallingRules';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, product: true, productDescription: true, industry: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { userMessage, conversationHistory, ticketData } = await request.json();

    // Get the customer behavior profile based on termination probability
    const customerProfile: CustomerBehaviorProfile = getCustomerBehaviorProfile(ticketData.terminationProbability);

    let prompt = `
    Du bist **${ticketData.name}**, ein Kunde in einem B2B Cold-Calling-Szenario. Dein Verhalten ist wie folgt:
    
    - **Verhaltensbeschreibung**: ${customerProfile.behaviorDescription}
    - **Typische Einwände**: ${customerProfile.commonObjections.join('; ')}
    - **Reaktionsmuster**:
    ${Object.entries(customerProfile.reactionPatterns).map(([technique, reaction]) => `- Bei Anwendung von "${technique}": ${reaction}`).join('\n')}
    
    **Produkt:** ${user.product}
    **Produktbeschreibung:** ${user.productDescription}
    
    **Gesprächsverlauf:**
    ${conversationHistory.slice(-5).join("\n")}
    
    **Verkäufer:** ${userMessage}
    
    **Anweisungen:**
    
    - Analysiere die letzte Nachricht des Verkäufers.
    - Bestimme, ob der Verkäufer eine der folgenden Verkaufstechniken angewendet hat: ${customerProfile.preferredSalesTechniques.join(', ')}.
    - Reagiere entsprechend deinem Kundenprofil und den Reaktionsmustern.
    - Wenn der Verkäufer eine effektive Technik angewendet hat, zeige dich offener und positiver.
    - Wenn der Verkäufer keine Technik angewendet hat oder die Nachricht unverständlich ist, reagiere entsprechend deinem Verhalten und äußere ggf. typische Einwände.
    - Antworte in **maximal 2 Sätzen**.
    - **WICHTIG:** Antworte **nur** als Kunde, ohne Analyse oder Erwähnung von Verkaufstechniken.
    
    Antworte jetzt als Kunde:
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    let customerResponse = await result.response.text();

    // Entferne mögliche Anweisungen oder Analysen aus der Antwort
    customerResponse = customerResponse.replace(/^Kunde:\s*/i, '').trim();
    customerResponse = customerResponse.split('\n')[0]; // Nur die erste Zeile verwenden

    // Beende die Konversation, wenn der Kunde aufhört oder bestimmte Schlüsselwörter sagt
    if (conversationHistory.length > 15 || /auf wiedersehen|tschüss|ich lege jetzt auf/i.test(customerResponse)) {
      if (!/auf wiedersehen|tschüss|ich lege jetzt auf/i.test(customerResponse)) {
        customerResponse += " Ich denke, wir belassen es für heute dabei. Auf Wiedersehen.";
      }
      // Hier kannst du optional weitere Logik hinzufügen, um die Konversation zu beenden
    }

    // Stelle sicher, dass die Antwort sinnvoll ist
    if (customerResponse.toLowerCase() === 'ja') {
      customerResponse = "Könnten Sie mir mehr über die Vorteile Ihrer Lösung erzählen?";
    }

    return NextResponse.json({ customerResponse });
  } catch (error) {
    console.error("Error generating customer response:", error);
    return NextResponse.json({ error: "Failed to generate customer response" }, { status: 500 });
  }
}
