"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { Edit2, Check, X } from 'lucide-react';

type CallType = 'Quali Call' | 'Erstgespräch' | 'Close-Call';

interface Conversation {
  id: number;
  customer: string;
  date: string;
  duration: string;
  status: string;
  probability: number;
  tags: string[];
  result: 'Abgeschlossen' | 'Offen';
  callType: CallType;
}

const initialConversations: Conversation[] = [
  { id: 1, customer: 'Anna Müller GmbH', date: '2023-05-15', duration: '45 min', status: 'Analysiert', probability: 75, tags: ['Hot Lead'], result: 'Offen', callType: 'Erstgespräch' },
  { id: 2, customer: 'Max Schmidt AG', date: '2023-05-14', duration: '30 min', status: 'Transkribiert', probability: 60, tags: ['Nachfassen'], result: 'Offen', callType: 'Quali Call' },
  { id: 3, customer: 'Lisa Weber KG', date: '2023-05-13', duration: '60 min', status: 'Aufgezeichnet', probability: 85, tags: ['Hot Lead', 'Nachfassen'], result: 'Abgeschlossen', callType: 'Close-Call' },
];

export function ConversationList() {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCustomer, setEditedCustomer] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedCallType, setEditedCallType] = useState<CallType>('Erstgespräch');

  const handleEdit = (id: number) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setEditingId(id);
      setEditedCustomer(conversation.customer);
      setEditedDate(conversation.date);
      setEditedCallType(conversation.callType);
    }
  };

  const handleSave = (id: number) => {
    setConversations(conversations.map(c => 
      c.id === id 
        ? { 
            ...c, 
            customer: editedCustomer, 
            date: editedDate, 
            callType: editedCallType,
            result: (editedCallType === 'Close-Call' && c.result === 'Abgeschlossen') ? 'Abgeschlossen' : 'Offen'
          } 
        : c
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const getProgressMessage = (callType: CallType, result: string) => {
    if (result === 'Abgeschlossen') return 'Glückwunsch! Der Kunde wurde erfolgreich abgeschlossen.';
    switch (callType) {
      case 'Quali Call':
        return 'Guter Start! Bereiten Sie sich auf das Erstgespräch vor.';
      case 'Erstgespräch':
        return 'Sie sind auf einem guten Weg. Bereiten Sie den Close-Call vor.';
      case 'Close-Call':
        return 'Fast geschafft! Konzentrieren Sie sich auf den Abschluss.';
      default:
        return '';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Kunde</TableHead>
          <TableHead className="text-left">Datum</TableHead>
          <TableHead className="text-left">Dauer</TableHead>
          <TableHead className="text-left">Status</TableHead>
          <TableHead className="text-left">Wahrscheinlichkeit</TableHead>
          <TableHead className="text-left">Tags</TableHead>
          <TableHead className="text-left">Ergebnis</TableHead>
          <TableHead className="text-left">Call-Typ</TableHead>
          <TableHead className="text-left">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conversation) => (
          <TableRow key={conversation.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <TableCell className="font-medium">
              {editingId === conversation.id ? (
                <Input 
                  value={editedCustomer} 
                  onChange={(e) => setEditedCustomer(e.target.value)}
                  className="w-full"
                />
              ) : (
                <Link href={`/gespraeche/${conversation.id}`} className="hover:underline">
                  {conversation.customer}
                </Link>
              )}
            </TableCell>
            <TableCell>
              {editingId === conversation.id ? (
                <Input 
                  type="date" 
                  value={editedDate} 
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="w-full"
                />
              ) : (
                conversation.date
              )}
            </TableCell>
            <TableCell>{conversation.duration}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn(
                conversation.status === 'Analysiert' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                conversation.status === 'Transkribiert' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              )}>
                {conversation.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${conversation.probability}%` }}
                />
              </div>
              <span className="text-sm">{conversation.probability}%</span>
            </TableCell>
            <TableCell>
              {conversation.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              <Badge className={cn(
                conversation.result === 'Abgeschlossen' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              )}>
                {conversation.result}
              </Badge>
            </TableCell>
            <TableCell>
              {editingId === conversation.id ? (
                <Select 
                  value={editedCallType} 
                  onValueChange={(value: CallType) => setEditedCallType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Call-Typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quali Call">Quali Call</SelectItem>
                    <SelectItem value="Erstgespräch">Erstgespräch</SelectItem>
                    <SelectItem value="Close-Call">Close-Call</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                conversation.callType
              )}
            </TableCell>
            <TableCell>
              {editingId === conversation.id ? (
                <>
                  <Button onClick={() => handleSave(conversation.id)} size="sm" className="mr-2">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEdit(conversation.id)} size="sm" variant="outline">
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}