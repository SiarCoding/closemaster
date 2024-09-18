import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const conversations = [
  { id: 1, customer: 'Anna Müller', date: '2023-05-15', duration: '45 min', status: 'Analysiert', probability: 75 },
  { id: 2, customer: 'Max Schmidt', date: '2023-05-14', duration: '30 min', status: 'Offen', probability: 60 },
  { id: 3, customer: 'Lisa Weber', date: '2023-05-13', duration: '60 min', status: 'Analysiert', probability: 85 },
];

export function SearchFilter() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-600" />
          <Input
            placeholder="Suche Gespräche..."
            className="pl-8 text-gray-600 bg-white" 
          />
        </div>
        <Button className="text-gray-600 bg-gray-100 hover:bg-gray-200">
          <Filter className="mr-2 h-4 w-4 text-gray-600" />
          Filter
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-600">Kunde</TableHead>
            <TableHead className="text-gray-600">Datum</TableHead>
            <TableHead className="text-gray-600">Dauer</TableHead>
            <TableHead className="text-gray-600">Status</TableHead>
            <TableHead className="text-gray-600">Abschlusswahrscheinlichkeit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              <TableCell className="text-gray-600">{conversation.customer}</TableCell>
              <TableCell className="text-gray-600">{conversation.date}</TableCell>
              <TableCell className="text-gray-600">{conversation.duration}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  conversation.status === 'Analysiert' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {conversation.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${conversation.probability}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{conversation.probability}%</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
