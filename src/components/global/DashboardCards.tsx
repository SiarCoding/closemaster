import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const cardData = [
  { title: 'Gesamtzahl der Gespräche', value: '124', progress: '20%', color: 'bg-indigo-400' },
  { title: 'Abschlussquote', value: '32%', progress: '5%', color: 'bg-orange-400' },
  { title: 'Offene Follow-ups', value: '18', progress: '80%', color: 'bg-pink-400' },
];

export function DashboardCards() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {cardData.map((item, index) => (
        <Card key={index} className="bg-white border-none shadow-none"> {/* Kein Rand, kein Schatten */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{item.title}</CardTitle>
            <div className={`w-4 h-4 ${item.color} rounded-full`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{item.value}</div>
            <p className="text-xs text-gray-600">Fortschritt: {item.progress}</p>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
              <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.progress }} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
