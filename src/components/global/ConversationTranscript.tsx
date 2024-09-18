import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const transcriptData = [
  { speaker: 'Verkäufer', text: 'Guten Tag, wie kann ich Ihnen helfen?', important: false },
  { speaker: 'Kunde', text: 'Ich interessiere mich für Ihr Produkt X.', important: false },
  { speaker: 'Verkäufer', text: 'Was genau interessiert Sie an Produkt X?', important: true },
  { speaker: 'Kunde', text: 'Ich habe gehört, es soll sehr effizient sein.', important: false },
  { speaker: 'Verkäufer', text: 'Ja, Produkt X ist 30% effizienter als die Konkurrenz.', important: true },
];

const speechMetrics = {
  seller: 60,
  customer: 40,
  sentiment: [
    { timestamp: '00:00', sentiment: 'neutral' },
    { timestamp: '01:30', sentiment: 'positiv' },
    { timestamp: '03:00', sentiment: 'neutral' },
    { timestamp: '04:00', sentiment: 'positiv' },
    { timestamp: '05:00', sentiment: 'negativ' },
  ],
};

export default function ConversationTranscript() {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Konversationstranskript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-auto bg-gray-100 p-4 rounded-lg">
          {transcriptData.map((line, index) => (
            <p
              key={index}
              onClick={() => setHighlightedIndex(index)}
              className={`mb-2 p-2 rounded-lg cursor-pointer text-gray-600 ${
                line.important ? 'bg-yellow-100' : ''
              } ${highlightedIndex === index ? 'bg-yellow-300' : ''}`}
            >
              <strong>{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Redeanteil</h3>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div className="bg-blue-600 h-6 rounded-full" style={{ width: `${speechMetrics.seller}%` }}>
                <span className="text-white text-sm ml-2">{speechMetrics.seller}% Verkäufer</span>
              </div>
            </div>
            <div className="bg-green-600 h-6 rounded-full mt-2" style={{ width: `${speechMetrics.customer}%` }}>
              <span className="text-white text-sm ml-2">{speechMetrics.customer}% Kunde</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Stimmungsanalyse</h3>
            <div className="w-full h-12 bg-gray-200 rounded-full flex items-center">
              {speechMetrics.sentiment.map((entry, index) => (
                <div
                  key={index}
                  className={`h-full rounded-full mx-1 ${
                    entry.sentiment === 'positiv' ? 'bg-green-500' : entry.sentiment === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: '20%' }}
                  title={`${entry.timestamp}: ${entry.sentiment}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {speechMetrics.sentiment.map((entry, index) => (
                <span key={index}>{entry.timestamp}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
