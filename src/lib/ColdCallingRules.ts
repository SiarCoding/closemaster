// ColdCallingRules.ts

interface CustomerBehaviorProfile {
    terminationProbabilityRange: [number, number];
    behaviorDescription: string;
    commonObjections: string[];
    reactionPatterns: {
      [technique: string]: string; // Wie reagiert der Kunde auf bestimmte Techniken
    };
    preferredSalesTechniques: string[]; // Verkaufstechniken, die beim Kunden am effektivsten sind
  }
  
  export const customerBehaviorProfiles: CustomerBehaviorProfile[] = [
    // Terminierungswahrscheinlichkeit 2% - 5%
    {
      terminationProbabilityRange: [2, 5],
      behaviorDescription: "Extrem skeptisch, wenig Zeit, schnell genervt, grundsätzlich ablehnend gegenüber Cold Calls.",
      commonObjections: [
        "Ich habe keine Zeit für dieses Gespräch.",
        "Bitte nehmen Sie mich von Ihrer Liste.",
        "Kein Interesse, danke.",
        "Wie sind Sie an meine Nummer gekommen?",
      ],
      reactionPatterns: {
        "Pattern Interrupt": "Kurz überrascht, aber bleibt ablehnend.",
        "Pitch innerhalb von 10 Sekunden": "Unterbricht sofort, möchte nicht zuhören.",
        "Einwand-Anerkennung und Umleitung": "Ignoriert den Versuch, bleibt abweisend.",
        "Emotionale Trigger nutzen": "Reagiert nicht darauf, zeigt Desinteresse.",
      },
      preferredSalesTechniques: ["Pattern Interrupt"],
    },
    // Terminierungswahrscheinlichkeit 5% - 8%
    {
      terminationProbabilityRange: [5, 8],
      behaviorDescription: "Sehr skeptisch, fühlt sich von Cold Calls gestört, zeigt leichtes Desinteresse.",
      commonObjections: [
        "Jetzt ist wirklich kein guter Zeitpunkt.",
        "Ich bezweifle, dass Ihr Produkt für uns relevant ist.",
        "Wir sind bereits gut aufgestellt.",
      ],
      reactionPatterns: {
        "Pattern Interrupt": "Wird aufmerksam, aber bleibt vorsichtig.",
        "Den Nutzen zuerst nennen": "Zeigt leichtes Interesse, aber noch skeptisch.",
        "Fragen statt direkt verkaufen": "Antwortet kurz, aber nicht ausführlich.",
      },
      preferredSalesTechniques: ["Pattern Interrupt", "Den Nutzen zuerst nennen"],
    },
    // Terminierungswahrscheinlichkeit 8% - 11%
    {
      terminationProbabilityRange: [8, 11],
      behaviorDescription: "Skeptisch, aber offen für neue Informationen, wenn schnell ein Nutzen erkennbar ist.",
      commonObjections: [
        "Worum geht es genau?",
        "Können Sie mir das per E-Mail schicken?",
        "Ich habe wenig Zeit, kommen Sie bitte zum Punkt.",
      ],
      reactionPatterns: {
        "Pitch innerhalb von 10 Sekunden": "Hört zu, entscheidet danach über weiteres Interesse.",
        "Den Nutzen zuerst nennen": "Zeigt Interesse, stellt eventuell Rückfragen.",
        "Fragen statt direkt verkaufen": "Beantwortet Fragen kurz, aber ehrlich.",
      },
      preferredSalesTechniques: ["Pitch innerhalb von 10 Sekunden", "Den Nutzen zuerst nennen"],
    },
    // Terminierungswahrscheinlichkeit 11% - 14%
    {
      terminationProbabilityRange: [11, 14],
      behaviorDescription: "Neutral eingestellt, offen für kurze Gespräche, wenn relevanter Mehrwert erkennbar ist.",
      commonObjections: [
        "Was genau bieten Sie an?",
        "Wie kann das für uns nützlich sein?",
        "Wir haben bereits eine Lösung, warum Ihre?",
      ],
      reactionPatterns: {
        "Den Nutzen zuerst nennen": "Zeigt Interesse, fragt nach Details.",
        "Fragen statt direkt verkaufen": "Beantwortet Fragen ausführlicher.",
        "Einwand-Anerkennung und Umleitung": "Fühlt sich verstanden, hört weiter zu.",
      },
      preferredSalesTechniques: ["Den Nutzen zuerst nennen", "Fragen statt direkt verkaufen"],
    },
    // Terminierungswahrscheinlichkeit 14% - 17%
    {
      terminationProbabilityRange: [14, 17],
      behaviorDescription: "Leicht interessiert, sucht nach Lösungen für bestehende Probleme, aber vorsichtig bei neuen Angeboten.",
      commonObjections: [
        "Wie unterscheidet sich Ihr Produkt von anderen?",
        "Wir haben Budgetbeschränkungen.",
        "Ist das kompliziert zu implementieren?",
      ],
      reactionPatterns: {
        "Einwand-Anerkennung und Umleitung": "Fühlt sich verstanden, Interesse steigt.",
        "Emotionale Trigger nutzen": "Reagiert positiv auf mögliche Vorteile.",
        "Qualifikation durch Fragen": "Beantwortet Fragen detailliert.",
      },
      preferredSalesTechniques: ["Einwand-Anerkennung und Umleitung", "Qualifikation durch Fragen"],
    },
    // Terminierungswahrscheinlichkeit 17% - 20%
    {
      terminationProbabilityRange: [17, 20],
      behaviorDescription: "Interessiert an Verbesserungen, offen für neue Lösungen, wenn Nutzen klar erkennbar ist.",
      commonObjections: [
        "Wie lange dauert die Implementierung?",
        "Welche Kosten kommen auf uns zu?",
        "Haben Sie Referenzen?",
      ],
      reactionPatterns: {
        "Den Nutzen zuerst nennen": "Zeigt deutliches Interesse.",
        "Emotionale Trigger nutzen": "Reagiert positiv, will mehr wissen.",
        "3-Sekunden-Elevator Pitch": "Beeindruckt, fragt nach Details.",
      },
      preferredSalesTechniques: ["Den Nutzen zuerst nennen", "3-Sekunden-Elevator Pitch"],
    },
    // Terminierungswahrscheinlichkeit 20% - 23%
    {
      terminationProbabilityRange: [20, 23],
      behaviorDescription: "Aktiv auf der Suche nach Lösungen, offen für detaillierte Gespräche.",
      commonObjections: [
        "Können wir einen Termin für eine ausführlichere Diskussion vereinbaren?",
        "Wie schnell können wir starten?",
        "Welche Ergebnisse können wir erwarten?",
      ],
      reactionPatterns: {
        "Assumptive Close": "Akzeptiert Terminvorschläge.",
        "Framing Technik": "Sieht den Mehrwert, stimmt zu.",
        "Summarize and Confirm": "Fühlt sich verstanden und bestätigt.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Framing Technik"],
    },
    // Terminierungswahrscheinlichkeit 23% - 26%
    {
      terminationProbabilityRange: [23, 26],
      behaviorDescription: "Sehr interessiert, hat akuten Bedarf, sucht nach schnellen Lösungen.",
      commonObjections: [
        "Keine Einwände, stellt viele Fragen.",
      ],
      reactionPatterns: {
        "Assumptive Close": "Stimmt schnell zu.",
        "Emotionale Trigger nutzen": "Motiviert, schnell zu handeln.",
        "Soft Close": "Bereit für nächste Schritte.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Soft Close"],
    },
    // Terminierungswahrscheinlichkeit 26% - 29%
    {
      terminationProbabilityRange: [26, 29],
      behaviorDescription: "Offen und freundlich, freut sich über Kontaktaufnahme, sieht potenziellen Nutzen.",
      commonObjections: [
        "Keine Einwände, offen für Vorschläge.",
      ],
      reactionPatterns: {
        "Direkt die Entscheidungsperson ansprechen": "Leitet ggf. weiter oder bestätigt.",
        "Mirroring": "Fühlt sich verstanden, baut Vertrauen auf.",
        "Feel, Felt, Found Methode": "Sieht sich in ähnlicher Situation, Vertrauen wächst.",
      },
      preferredSalesTechniques: ["Mirroring", "Feel, Felt, Found Methode"],
    },
    // Terminierungswahrscheinlichkeit 29% - 32%
    {
      terminationProbabilityRange: [29, 32],
      behaviorDescription: "Sehr kooperativ, zeigt aktives Interesse, stellt gezielte Fragen.",
      commonObjections: [
        "Wann können wir starten?",
        "Welche nächsten Schritte sind erforderlich?",
      ],
      reactionPatterns: {
        "Summarize and Confirm": "Bestätigt und ist bereit für Abschluss.",
        "Assumptive Close": "Stimmt Terminen zu.",
        "Takeaway Close": "Will nicht verpassen, zeigt Dringlichkeit.",
      },
      preferredSalesTechniques: ["Summarize and Confirm", "Assumptive Close"],
    },
    // Terminierungswahrscheinlichkeit 32% - 35%
    {
      terminationProbabilityRange: [32, 35],
      behaviorDescription: "Entscheidungsträger, sucht aktiv nach Lösungen, bereit für Investitionen.",
      commonObjections: [
        "Keine, fordert nur noch Details an.",
      ],
      reactionPatterns: {
        "Direkt die Entscheidungsperson ansprechen": "Bestätigt und entscheidet.",
        "Assumptive Close": "Akzeptiert Vorschläge.",
        "Scarcity Technik": "Reagiert auf Dringlichkeit, handelt schnell.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Scarcity Technik"],
    },
    // Fortsetzen bis 80% in ähnlicher Weise...
    // Hier sind weitere Beispiele:
  
    // Terminierungswahrscheinlichkeit 35% - 38%
    {
      terminationProbabilityRange: [35, 38],
      behaviorDescription: "Sehr offener Kunde, bereits mit ähnlichen Produkten vertraut, sucht nach Optimierungen.",
      commonObjections: [],
      reactionPatterns: {
        "Fragen statt direkt verkaufen": "Gibt ausführliche Antworten.",
        "Qualifikation durch Fragen": "Beantwortet detailliert, zeigt Interesse.",
        "Summarize and Confirm": "Fühlt sich verstanden und wertgeschätzt.",
      },
      preferredSalesTechniques: ["Qualifikation durch Fragen", "Summarize and Confirm"],
    },
    // Terminierungswahrscheinlichkeit 38% - 41%
    {
      terminationProbabilityRange: [38, 41],
      behaviorDescription: "Kunde mit dringendem Bedarf, bereit für schnelle Entscheidungen.",
      commonObjections: [],
      reactionPatterns: {
        "Assumptive Close": "Akzeptiert ohne Einwände.",
        "Soft Close": "Stimmt weiteren Schritten zu.",
        "Takeaway Close": "Will keine Chance verpassen.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Soft Close"],
    },
    // Terminierungswahrscheinlichkeit 41% - 44%
    {
      terminationProbabilityRange: [41, 44],
      behaviorDescription: "Sehr kooperativ, schätzt proaktive Angebote, zeigt Begeisterung.",
      commonObjections: [],
      reactionPatterns: {
        "Emotionale Trigger nutzen": "Reagiert sehr positiv.",
        "Mirroring": "Baut schnell Vertrauen auf.",
        "Framing Technik": "Sieht den Mehrwert sofort.",
      },
      preferredSalesTechniques: ["Emotionale Trigger nutzen", "Framing Technik"],
    },
    // Terminierungswahrscheinlichkeit 44% - 47%
    {
      terminationProbabilityRange: [44, 47],
      behaviorDescription: "Kunde hat Budget und sucht aktiv nach Investitionsmöglichkeiten.",
      commonObjections: [],
      reactionPatterns: {
        "Scarcity Technik": "Handelt schnell bei begrenzten Angeboten.",
        "Assumptive Close": "Stimmt sofort zu.",
        "Summarize and Confirm": "Fühlt sich sicher in der Entscheidung.",
      },
      preferredSalesTechniques: ["Scarcity Technik", "Assumptive Close"],
    },
    // Terminierungswahrscheinlichkeit 47% - 50%
    {
      terminationProbabilityRange: [47, 50],
      behaviorDescription: "Enthusiastischer Kunde, freut sich über Kontaktaufnahme, sieht großen Nutzen.",
      commonObjections: [],
      reactionPatterns: {
        "Assumptive Close": "Akzeptiert ohne Zögern.",
        "Takeaway Close": "Will nicht verlieren, stimmt sofort zu.",
        "Feel, Felt, Found Methode": "Fühlt sich verstanden und bestätigt.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Takeaway Close"],
    },
    // Terminierungswahrscheinlichkeit 50% - 53%
    {
      terminationProbabilityRange: [50, 53],
      behaviorDescription: "Sehr interessierter Kunde, hat akuten Bedarf und budgetäre Mittel.",
      commonObjections: [],
      reactionPatterns: {
        "Assumptive Close": "Stimmt Terminen und Abschlüssen zu.",
        "Summarize and Confirm": "Bestätigt Verständnis und Bereitschaft.",
        "Soft Close": "Offen für weitere Schritte.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Summarize and Confirm"],
    },
    // Terminierungswahrscheinlichkeit 53% - 56%
    {
      terminationProbabilityRange: [53, 56],
      behaviorDescription: "Kunde mit langfristigem Interesse, sucht nach verlässlichen Partnern.",
      commonObjections: [],
      reactionPatterns: {
        "Feel, Felt, Found Methode": "Fühlt sich verstanden, baut Vertrauen auf.",
        "Mirroring": "Vertrauen wächst, Beziehung stärkt sich.",
        "Summarize and Confirm": "Sichert Verständnis und nächste Schritte.",
      },
      preferredSalesTechniques: ["Feel, Felt, Found Methode", "Mirroring"],
    },
    // Terminierungswahrscheinlichkeit 56% - 59%
    {
      terminationProbabilityRange: [56, 59],
      behaviorDescription: "Kunde ist bereit, sofort zu handeln, benötigt minimale Überzeugung.",
      commonObjections: [],
      reactionPatterns: {
        "Assumptive Close": "Schließt sofort ab.",
        "Scarcity Technik": "Handelt schnell, um Angebot zu sichern.",
        "Soft Close": "Akzeptiert weitere Schritte ohne Zögern.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Scarcity Technik"],
    },
    // Terminierungswahrscheinlichkeit 59% - 62%
    {
      terminationProbabilityRange: [59, 62],
      behaviorDescription: "Extrem kooperativ, sucht nach genau dem angebotenen Produkt, bereit zum Abschluss.",
      commonObjections: [],
      reactionPatterns: {
        "Assumptive Close": "Stimmt sofort zu.",
        "Summarize and Confirm": "Bestätigt Verständnis und Bereitschaft.",
        "Takeaway Close": "Will Angebot nicht verlieren, handelt sofort.",
      },
      preferredSalesTechniques: ["Assumptive Close", "Summarize and Confirm"],
    },
    // Terminierungswahrscheinlichkeit 62% - 65%
    {
      terminationProbabilityRange: [62, 65],
      behaviorDescription: "Kunde ist begeistert vom Angebot, sieht großen Mehrwert, bereit für langfristige Partnerschaft.",
      commonObjections: [],
      reactionPatterns: {
        "Feel, Felt, Found Methode": "Fühlt starke Verbindung, Vertrauen ist hoch.",
        "Mirroring": "Beziehung ist sehr stark, Kommunikation fließt.",
        "Assumptive Close": "Abschluss erfolgt ohne Einwände.",
      },
      preferredSalesTechniques: ["Feel, Felt, Found Methode", "Assumptive Close"],
    },
    // Fortsetzen bis 80%
  
    // Du kannst diese Profile bis zu einer Terminierungswahrscheinlichkeit von 80% erweitern, wobei die Kunden immer kooperativer und einfacher zu terminieren sind.
  
    // Hinweis: Ab einer Terminierungswahrscheinlichkeit von über 65% sind Kunden sehr leicht zu terminieren, zeigen kaum bis keine Einwände und sind bereit, schnell zu handeln.
  ];
  
  export function getCustomerBehaviorProfile(terminationProbability: number): CustomerBehaviorProfile {
    return (
      customerBehaviorProfiles.find(
        (profile) =>
          terminationProbability >= profile.terminationProbabilityRange[0] &&
          terminationProbability < profile.terminationProbabilityRange[1]
      ) || customerBehaviorProfiles[0] // Fallback auf das erste Profil, wenn nichts gefunden wird
    );
  }
  