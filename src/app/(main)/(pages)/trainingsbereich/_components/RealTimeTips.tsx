import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from 'lucide-react'

interface RealTimeTipsProps {
  tip: string;
  example: string;
  onClose: () => void;
}

export default function RealTimeTips({ tip, example, onClose }: RealTimeTipsProps) {
  const [showExample, setShowExample] = useState(false);

  const tipPoints = tip.split('. ').filter(point => point.trim() !== '');

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            Echtzeit-Tipp
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExample(!showExample)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showExample ? 'Tipp anzeigen' : 'Beispiel anzeigen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!showExample ? (
          <ul className="list-disc list-inside space-y-2">
            {tipPoints.map((point, index) => (
              <li key={index} className="text-sm text-gray-700">
                {point.trim()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-700 italic">{example}</p>
        )}
      </CardContent>
    </Card>
  )
}