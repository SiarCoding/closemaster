// src/app/api/generateKundenAntwortColdCalling/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { userMessage, conversationHistory } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Du bist ein virtueller Kunde in einem B2B Cold-Calling-Szenario. Der Anrufer ist ein Verkäufer, der versucht, ein Erstgespräch zu vereinbaren. Reagiere realistisch auf die Aussagen des Verkäufers. Deine Antworten sollten variieren und auf den Kontext des Gesprächs bezogen sein. Verwende verschiedene Einwände und Reaktionen, wie "Wir haben kein Interesse" oder "Sie sind heute der zehnte, der anruft". Das Gespräch sollte etwa 3-5 Minuten dauern.

      Gesprächsverlauf:
      ${conversationHistory.join("\n")}

      Verkäufer: ${userMessage}
      Kunde: `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const customerResponse = response.text();

    return NextResponse.json({ customerResponse });
  } catch (error) {
    console.error("Error generating customer response:", error);
    return NextResponse.json({ error: "Failed to generate customer response" }, { status: 500 });
  }
}