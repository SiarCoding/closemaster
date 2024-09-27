// src/app/(main)/trainingsbereich/levelsData.ts

export interface Bewertungskriterium {
  name: string;
  gewichtung: number; // Gewichtung des Kriteriums für die Gesamtbewertung
}

export interface Szenario {
  id: number;
  beschreibung: string;
  virtuellesKundenprofil: string;
  aufgaben: string[];
}

export interface Level {
  level: number;
  name: string;
  ziel: string[];
  techniken: string[];
  uebungen: string[];
  tipps: string[];
  bewertungskriterien: Bewertungskriterium[];
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
    bewertungskriterien: [
      { name: "Kommunikationsfähigkeit", gewichtung: 0.4 },
      { name: "Bedarfsanalyse", gewichtung: 0.3 },
      { name: "Produktpräsentation", gewichtung: 0.3 },
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
      },
      // Weitere Szenarien...
    ],
  },
  // Weitere Levels...
];
