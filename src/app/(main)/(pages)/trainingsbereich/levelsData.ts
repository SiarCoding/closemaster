// src/app/(main)/trainingsbereich/levelsData.ts

export interface Feedback {
    trigger: string;
    nachricht: string;
    empfehlung: string;
  }
  
  export interface Szenario {
    id: number;
    beschreibung: string;
    virtuellesKundenprofil: string;
    aufgaben: string[];
    feedback: Feedback[];
  }
  
  export interface Level {
    level: number;
    name: string;
    ziel: string[];
    techniken: string[];
    uebungen: string[];
    tipps: string[];
    szenarien: Szenario[];
  }
  
  export const levels: Level[] = [
    {
      level: 1,
      name: "Grundlagen der Verkaufskommunikation",
      ziel: [
        "Entwicklung grundlegender Kommunikationsfähigkeiten",
        "Verständnis für Kundenbedürfnisse",
        "Einführung in Fragetechniken",
      ],
      techniken: [
        "Aktives Zuhören",
        "Offene Fragen stellen",
        "Grundlegende Bedarfsanalyse",
      ],
      uebungen: [
        "Begrüßung und Gesprächseröffnung üben",
        "Kundenbedürfnisse identifizieren",
        "Einfache Produktpräsentation",
      ],
      tipps: [
        "Bleiben Sie freundlich und professionell",
        "Hören Sie dem Kunden aufmerksam zu",
        "Zeigen Sie echtes Interesse an den Bedürfnissen des Kunden",
      ],
      szenarien: [
        {
          id: 1,
          beschreibung: "Erstkontakt mit einem interessierten Kunden",
          virtuellesKundenprofil: "/kunde-avatar1.png",
          aufgaben: [
            "Begrüßen Sie den Kunden freundlich",
            "Stellen Sie offene Fragen, um Bedürfnisse zu ermitteln",
            "Präsentieren Sie ein passendes Produkt basierend auf den Kundenbedürfnissen",
          ],
          feedback: [
            {
              trigger: "hallo",
              nachricht: "Gute Begrüßung! Versuchen Sie, noch persönlicher zu wirken.",
              empfehlung: "Fügen Sie nach der Begrüßung eine Frage hinzu, wie 'Wie kann ich Ihnen heute helfen?'",
            },
            {
              trigger: "produkt",
              nachricht: "Guter Ansatz, ein Produkt vorzuschlagen. Achten Sie darauf, es mit den Kundenbedürfnissen zu verknüpfen.",
              empfehlung: "Sagen Sie zum Beispiel: 'Basierend auf Ihrem Bedarf nach X, könnte Produkt Y genau das Richtige für Sie sein, weil...'",
            },
          ],
        },
        {
          id: 2,
          beschreibung: "Umgang mit ersten Einwänden",
          virtuellesKundenprofil: "/kunde-avatar2.png",
          aufgaben: [
            "Hören Sie sich den Einwand des Kunden an",
            "Bestätigen Sie das Verständnis des Einwands",
            "Bieten Sie eine Lösung oder Alternative an",
          ],
          feedback: [
            {
              trigger: "verstehe",
              nachricht: "Gut, dass Sie Verständnis zeigen. Versuchen Sie, noch tiefer zu gehen.",
              empfehlung: "Fragen Sie nach: 'Können Sie mir mehr darüber erzählen, warum dieser Aspekt für Sie wichtig ist?'",
            },
            {
              trigger: "alternativ",
              nachricht: "Guter Ansatz, eine Alternative anzubieten. Erklären Sie die Vorteile noch detaillierter.",
              empfehlung: "Sagen Sie: 'Diese Alternative bietet Ihnen den Vorteil X, was Ihr ursprüngliches Anliegen Y adressiert.'",
            },
          ],
        },
        // Weitere Szenarien für Level 1 können hier hinzugefügt werden
      ],
    },
    // Weitere Levels können hier hinzugefügt werden
  ];
